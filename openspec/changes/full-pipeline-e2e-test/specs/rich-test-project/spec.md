## MODIFIED Requirements

### Requirement: 测试项目 README 说明 MCP 和 skills
测试项目 README SHALL 说明：
- `opencode.json` 中的 MCP server 配置（filesystem、fetch）
- `skills/` 目录的通用格式和跨 agent 共享设计
- E2E 测试使用本地 git 仓库，不再依赖外部 GitHub 仓库

#### Scenario: MCP 和 skills 说明存在
- **WHEN** 读者查看测试项目 README
- **THEN** SHALL 有 MCP tools 和 skills 的说明段落

#### Scenario: README 说明 E2E 测试使用本地仓库
- **WHEN** 读者查看测试项目 README 的测试相关部分
- **THEN** SHALL 说明 E2E 测试使用本地 git 仓库，可离线运行
