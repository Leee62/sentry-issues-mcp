# sentry-issue-mcp

[![中文文档](https://img.shields.io/badge/中文文档-查看-red)](README_cn.md)
[![English](https://img.shields.io/badge/English-Read-blue)](README.md)

## Description

> ⚠️ Getting issues is deprecated as of version 1.0.5. The response structure is so similar to the event API that it's considered redundant.

This is a mcp for sentry issue.\
It supports 2 tools to get a issue or list of issues.\
U can let LLM analysis the Res, or u want to do.

## Feature

- EZ size
- EZ understand
- EZ tiny

## Tools

- get_single_event
  - get a event detail infos, tiny mode return stack info, huge mode return all info
  - inputs:
    - url_or_id: sentry event url or sentry event id
    - organization_id_or_slug: sentry organization id or slug, it can be undefined
    - project_id_or_slug: sentry project id or slug, it can be undefined
    - mode: tiny or huge, it can be undefined
- get_project_events
  - get list of events, tiny mode return id and title, huge mode return all info
  - inputs:
    - project_id_or_slug: sentry project id or slug
    - organization_id_or_slug: sentry organization id or slug, it can be undefined
    - mode: tiny or huge, it can be undefined

## QuickStart

this is MCP Server Config

```json
  "mcpServers": {
    "sentry-issue-mcp": {
      "type": "stdio",
      "command": "npx",
      "args": [
        "-y",
        "sentry-issues-mcp@latest"
      ],
      "env": {
        "SENTRY_HOST": "<your_sentry_host>",
        "SENTRY_ORG": "<your_sentry_org>",
        "SENTRY_PROJ": "<your_sentry_proj>",
        "SENTRY_USER_TOKEN": "<your_sentry_user_token>"
      }
    }
  }
```

## Case

- Ask LLM to analysis one issue by url or id
  1. input "analysis the issue, and give me the reason of it, and tell me how to fix it, {sentry_issue_url}"
  2. if ur LLM is SMART🧠, it will call tools
  3. u will get result
- Ask LLM to find Today most dangerous issue (PS: default val of sentry time period is "24h")
  1. input "find today most dangerous issue, and give me the reason of it, and tell me how to fix it"
  2. if ur LLM is SMART🧠, it will call tools
  3. u will get result

## License

MIT
