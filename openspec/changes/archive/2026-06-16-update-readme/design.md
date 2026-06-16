## Context

两个仓库各有 README 需要更新：
1. 本地项目仓库 (`coding-agent-configs` local)：开发者工作仓库，包含 `packages/agent-config-cli/`、`openspec/` 等
2. 测试项目仓库 (`coding-agent-configs` GitHub)：团队共享配置仓库，包含 `opencode/`、`skills/` 等

两个 README 的目录结构图和 CLI 用法描述与当前实际状态不符。

## Goals / Non-Goals

**Goals:**
- 两个 README 的目录结构图与实际文件一致
- CLI 用法示例包含所有当前功能（`-a`、`--config-dir`、`--shell`）
- 测试项目 README 说明 MCP tools 和 skills

**Non-Goals:**
- 重写 README 的整体风格或布局
- 添加教程或详细指南

## Decisions

### 1. 目录结构图使用实际文件

**决策**: 直接从两个仓库的实际文件列表生成目录结构图，不再手动维护。

**理由**: 避免未来再次出现不一致。结构图应反映 `opencode/rules/`（扁平）而非 `.opencode/rules/`（嵌套），以及仓库根目录的 `skills/`。

### 2. 测试项目 README 不引用 packages/

**决策**: 测试项目 README 只描述团队配置内容（opencode/、skills/、rules/、opencode.json），不提及 packages/ 或 openspec/（这些是开发仓库的内容）。

**理由**: 测试项目仓库是给终端用户用的，不应暴露开发工具链。

## Risks / Trade-offs

- [README 可能再次过时] → 尽量精简结构图，只列主要目录而非逐文件展开
