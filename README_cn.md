# sentry-issue-mcp

[![中文文档](https://img.shields.io/badge/中文文档-查看-red)](README_cn.md)
[![English](https://img.shields.io/badge/English-Read-blue)](README.md)

## 简介

> ⚠️ 从 1.0.5 版本开始，获取问题被弃用。 响应结构与事件 API 非常相似，因此被认为是冗余的。

这是一个用于处理 Sentry Issue 的 MCP（Model Context Portal）。
它支持两种工具来获取一个或一批 Issue。你可以选择让 LLM（大型语言模型）分析返回的结果，或者自行进行分析。

## 特性

- 体积小巧，易于部署。
- 代码简洁，结构清晰。
- 简单易用，随叫随用。

## 工具

- get_single_event
  - 获取 event 详细信息，tiny 模式返回 stack info，huge 模式返回全部信息
  - inputs:
    - url_or_id: sentry event 的 url 网址或者 event id
    - organization_id_or_slug: 组织名
    - project_id_or_slug: 项目名
    - mode: 轻量信息 ting / 完整信息 huge
- get_project_events
  - 获取项目下的 event 列表，tiny 模式返回 id 和 title，huge 模式返回全部信息
  - inputs:
    - project_id_or_slug: 项目名
    - organization_id_or_slug: 组织名
    - mode: 轻量信息 ting / 完整信息 huge

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
