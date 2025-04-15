# sentry-issue-mcp

[![中文文档](https://img.shields.io/badge/中文文档-查看-red)](README_cn.md)
[![English](https://img.shields.io/badge/English-Read-blue)](README.md)

## 简介

这是一个用于处理 Sentry Issue 的 MCP（Model Context Portal）。
它支持两种工具来获取一个或一批 Issue。你可以选择让 LLM（大型语言模型）分析返回的结果，或者自行进行分析。

## 特性

- 体积小巧，易于部署。
- 代码简洁，结构清晰。
- 简单易用，随叫随用。

## 工具

- get-issue (获取 Issue):

  - 通过 URL 或 ID 获取单个 Issue。
  - 输入参数：
    - url_or_id：Sentry Issue 的 URL 或 ID。（必填）
    - organization_id_or_slug：Sentry 组织 ID 或 Slug（可选项）。

- get-issues (获取 Issue 列表):
  - 获取 Issue 列表。
  - 输入参数：
    - project_id_or_slug：Sentry 项目 ID 或 Slug（可选项）。
    - organization_id_or_slug：Sentry 组织 ID 或 Slug（可选项）。

## 快速上手

以下是 MCP 服务器的配置示例：

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

## 使用场景

- 让 LLM 分析单个 Issue（通过 URL 或 ID）：

  1. 输入："分析这个 Issue，给出原因和修复建议。{sentry_issue_url}"
  2. 如果你的 LLM 足够智能 🧠，它会调用 get-issue 工具。
  3. 你将获得分析结果。

- 让 LLM 找出今天最严重的 Issue (默认时间段为 "24h")：
  1. 输入："找出今天最严重的 Issue，给出原因和修复建议。"
  2. 如果你的 LLM 足够智能 🧠，它会调用 get-issues 工具。
  3. 你将获得分析结果。

## License

MIT
