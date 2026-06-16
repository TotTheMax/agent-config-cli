## ADDED Requirements

### Requirement: 本地项目 README 目录结构与实际一致
本地项目 README 的目录结构图 SHALL 反映当前实际文件布局：
- `opencode/` 下包含 `opencode.json` 和 `rules/`（扁平结构，非 `.opencode/rules/` 嵌套）
- 仓库根目录包含 `skills/`
- 不包含不存在的 `setup.sh`
- 包含 `packages/agent-config-cli/` 和 `openspec/`

#### Scenario: 目录结构图与实际文件匹配
- **WHEN** 读者查看本地 README 的目录结构图
- **THEN** 结构图 SHALL 与 `find` 命令输出的实际目录一致（主要目录级别）

### Requirement: 测试项目 README 目录结构与实际一致
测试项目 README 的目录结构图 SHALL 反映当前实际文件布局：
- `opencode/` 下包含 `opencode.json` 和 `rules/`（扁平结构）
- 仓库根目录包含 `skills/`
- 不提及 `packages/` 或 `openspec/`（这些不属于团队配置仓库）

#### Scenario: 测试项目结构图与实际文件匹配
- **WHEN** 读者查看测试项目 README 的目录结构图
- **THEN** 结构图 SHALL 与 GitHub 仓库实际文件一致

### Requirement: CLI 用法包含所有当前功能
两个 README 的 CLI 用法示例 SHALL 包含：
- `-a` / `--agent` 标志
- `--config-dir` 标志
- `--shell` 标志（bash/zsh/fish）

#### Scenario: --shell 标志出现在 README 中
- **WHEN** 读者查看 README 的 CLI 用法部分
- **THEN** SHALL 有 `--shell` 标志的用法示例

### Requirement: 测试项目 README 说明 MCP 和 skills
测试项目 README SHALL 说明：
- `opencode.json` 中的 MCP server 配置（filesystem、fetch）
- `skills/` 目录的通用格式和跨 agent 共享设计

#### Scenario: MCP 和 skills 说明存在
- **WHEN** 读者查看测试项目 README
- **THEN** SHALL 有 MCP tools 和 skills 的说明段落
