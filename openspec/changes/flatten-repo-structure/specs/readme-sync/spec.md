## MODIFIED Requirements

### Requirement: 本地项目 README 目录结构与实际一致
本地项目 README 的目录结构图 SHALL 反映当前实际文件布局：
- `src/` 下包含 CLI 源码（agents、commands、shell、utils）
- `e2e/` 下包含端到端测试脚本
- `skills/` 下包含 `setup-team-config/SKILL.md`
- `opencode/` 下包含 `opencode.json` 和 `rules/`
- `openspec/` 下包含变更管理
- `.opencode/` 下包含 internal 开发技能
- 包含 `package.json`、`tsconfig.json`、`vitest.config.ts`、`CLI.md`
- 不包含 `packages/` 目录
- 说明 `.opencode/skills/` 为 internal 技能，`skills/` 为可分发技能

#### Scenario: 目录结构图与实际文件匹配
- **WHEN** 读者查看本地 README 的目录结构图
- **THEN** 结构图 SHALL 与 `find` 命令输出的实际目录一致（主要目录级别）

#### Scenario: README 无 packages 目录
- **WHEN** 读者查看本地 README 的目录结构图
- **THEN** SHALL 不包含 `packages/` 目录

### Requirement: CLI 用法包含所有当前功能
根 README 的 CLI 用法引用 SHALL 使用根目录路径而非 `packages/agent-config-cli/` 路径。

#### Scenario: 添加新 Agent 引用根目录路径
- **WHEN** 读者查看根 README 的"Adding a New Agent"部分
- **THEN** SHALL 引用 `src/agents/` 而非 `packages/agent-config-cli/src/agents/`
