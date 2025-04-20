#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  fetchSentryEvent,
  fetchSentryEvents,
  // fetchSentryIssue,
  // fetchSentryIssues,
} from "./fetcher";

/** Create server instance
 *
 * Watch out LLM TOKEN usage, too much information returned
 */
const server = new McpServer({
  name: "sentry-issue-mcp",
  version: "1.0.0",
});

/** Register tool for getting single event by id */
server.tool(
  "get_single_event",
  "get issue event by inputting sentry issue event url or sentry issue event id",
  {
    url_or_id: z
      .string()
      .describe("sentry issue event url or sentry issue event id"),
    organization_id_or_slug: z
      .string()
      .optional()
      .default(process.env.SENTRY_ORG as string)
      .describe("sentry organization id or slug, it can be undefined"),
    project_id_or_slug: z
      .string()
      .optional()
      .default(process.env.SENTRY_PROJ as string)
      .describe("sentry project name or slug, it can be undefined"),
    mode: z
      .enum(["tiny", "huge"])
      .optional()
      .default("tiny")
      .describe(
        "mode for output, it can be undefined, it used to control LLM token usage"
      ),
  },
  async ({ url_or_id, organization_id_or_slug, project_id_or_slug, mode }) => {
    let EVENT_ID = "";

    if (url_or_id.includes("http") || url_or_id.includes("https")) {
      EVENT_ID = url_or_id.match(/events\/([a-f0-9]+)/)?.[1] || "";
    } else {
      EVENT_ID = url_or_id;
    }

    if (!EVENT_ID) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid Event ID",
          },
        ],
      };
    }

    const eventEventData = await fetchSentryEvent<{
      entries: any[];
    }>(EVENT_ID, organization_id_or_slug, project_id_or_slug);

    if (!eventEventData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to Get Event",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            mode === "tiny" ? eventEventData.entries : eventEventData
          ),
        },
      ],
    };
  }
);

/** Register tool for getting events */
server.tool(
  "get_project_events",
  "get issue events by inputting sentry organization id or slug and sentry project name or slug",
  {
    organization_id_or_slug: z
      .string()
      .optional()
      .default(process.env.SENTRY_ORG as string)
      .describe("sentry organization id or slug, it can be undefined"),
    project_id_or_slug: z
      .string()
      .optional()
      .default(process.env.SENTRY_PROJ as string)
      .describe("sentry project name or slug, it can be undefined"),
    mode: z
      .enum(["tiny", "huge"])
      .optional()
      .default("tiny")
      .describe(
        "mode for output, it can be undefined, it used to control LLM token usage"
      ),
  },
  async ({ organization_id_or_slug, project_id_or_slug, mode }) => {
    const eventsData = await fetchSentryEvents<
      { id: string; title: string; dateCreated: string }[]
    >(organization_id_or_slug, project_id_or_slug);

    if (!eventsData) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to Get Issue",
          },
        ],
      };
    }

    return {
      content: [
        {
          type: "text",
          text: JSON.stringify(
            mode === "tiny"
              ? eventsData.map(({ id, title, dateCreated }) => ({
                  id,
                  title,
                  dateCreated,
                }))
              : eventsData
          ),
        },
      ],
    };
  }
);

// /** Register sentry tool for getting single issue by id */
// server.tool(
//   "get_single_issue",
//   "get issue by inputting sentry issue url or sentry issue id",
//   {
//     url_or_id: z.string().describe("sentry issue url or sentry issue id"),
//     organization_id_or_slug: z
//       .string()
//       .optional()
//       .describe("sentry organization id or slug, it can be undefined"),
//   },
//   async ({
//     url_or_id,
//     organization_id_or_slug = process.env.SENTRY_ORG as string,
//   }) => {
//     let ISSUE_ID = "";

//     if (url_or_id.includes("http") || url_or_id.includes("https")) {
//       ISSUE_ID = url_or_id.match(/issues\/(\d+)/)?.[1] || "";
//     } else {
//       ISSUE_ID = url_or_id;
//     }

//     if (!ISSUE_ID || Number.isNaN(Number(ISSUE_ID))) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "Invalid Issue ID",
//           },
//         ],
//       };
//     }

//     const issueData = await fetchSentryIssue(ISSUE_ID, organization_id_or_slug);

//     if (!issueData) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "Failed to Get Issue",
//           },
//         ],
//       };
//     }

//     return {
//       content: [
//         {
//           type: "text",
//           text: JSON.stringify(issueData),
//         },
//       ],
//     };
//   }
// );

// /** Register Sentry get issues (Watch out LLM TOKEN usage) */
// server.tool(
//   "get_project_issues",
//   "get issues by inputting",
//   {
//     organization_id_or_slug: z
//       .string()
//       .optional()
//       .describe("sentry organization id or slug, it can be undefined"),
//     project_id_or_slug: z
//       .string()
//       .optional()
//       .describe("sentry project name or slug, it can be undefined"),
//   },
//   async ({
//     project_id_or_slug = process.env.SENTRY_PROJ as string,
//     organization_id_or_slug = process.env.SENTRY_ORG as string,
//   }) => {
//     const issuesData = await fetchSentryIssues(
//       project_id_or_slug,
//       organization_id_or_slug
//     );

//     if (!issuesData) {
//       return {
//         content: [
//           {
//             type: "text",
//             text: "Failed to Get Issue",
//           },
//         ],
//       };
//     }

//     return {
//       content: [
//         {
//           type: "text",
//           text: JSON.stringify(issuesData),
//         },
//       ],
//     };
//   }
// );

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
