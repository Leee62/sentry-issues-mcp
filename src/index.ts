#!/usr/bin/env node

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { fetchSentryIssue, fetchSentryIssues } from "./fetcher";

/** Create server instance */
const server = new McpServer({
  name: "sentry-issue-mcp",
  version: "1.0.0",
});

/** Register sentry tool for getting single issue by id */
server.tool(
  "get-issue",
  "get issue by inputting sentry issue url or sentry issue id",
  {
    url_or_id: z.string().describe("sentry issue url or sentry issue id"),
    organization_id_or_slug: z
      .string()
      .optional()
      .describe("sentry organization id or slug, it can be undefined"),
  },
  async ({
    url_or_id,
    organization_id_or_slug = process.env.SENTRY_ORG as string,
  }) => {
    let ISSUE_ID = "";

    if (url_or_id.includes("http") || url_or_id.includes("https")) {
      ISSUE_ID = url_or_id.match(/issues\/(\d+)/)?.[1] || "";
    } else {
      ISSUE_ID = url_or_id;
    }

    if (!ISSUE_ID || Number.isNaN(Number(ISSUE_ID))) {
      return {
        content: [
          {
            type: "text",
            text: "Invalid Issue ID",
          },
        ],
      };
    }

    const issueData = await fetchSentryIssue(ISSUE_ID, organization_id_or_slug);

    if (!issueData) {
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
          text: JSON.stringify(issueData),
        },
      ],
    };
  }
);

/** Register Sentry get multiple issues */
server.tool(
  "get-issues",
  "get issues by inputting",
  {
    organization_id_or_slug: z
      .string()
      .optional()
      .describe("sentry organization id or slug, it can be undefined"),
    project_id_or_slug: z
      .string()
      .optional()
      .describe("sentry project name or slug, it can be undefined"),
  },
  async ({
    project_id_or_slug = process.env.SENTRY_PROJ as string,
    organization_id_or_slug = process.env.SENTRY_ORG as string,
  }) => {
    const issuesData = await fetchSentryIssues(
      project_id_or_slug,
      organization_id_or_slug
    );

    if (!issuesData) {
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
          text: JSON.stringify(issuesData),
        },
      ],
    };
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});
