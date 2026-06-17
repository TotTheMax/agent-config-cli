## MODIFIED Requirements

### Requirement: 本地项目 README 目录结构与实际一致
本地项目 README 的目录结构图 SHALL 反映当前实际文件布局：
- `opencode/` 下包含 `opencode.json` 和 `rules/`（扁平结构，非 `.opencode/rules/` 嵌套）
- 仓库根目录包含 `skills/`（含 `setup-team-config/SKILL.md`）
- 不包含不存在的 `setup.sh`
- 包含 `packages/agent-config-cli/` 和 `openspec/`
- 说明 `.opencode/skills/` 为开发用 internal 技能，`skills/` 为可分发技能

#### Scenario: 目录结构图与实际文件匹配
- **WHEN** 读者查看本地 README 的目录结构图
- **THEN** 结构图 SHALL 与 `find` 命令输出的实际目录一致（主要目录级别）

#### Scenario: README 区分开发技能和可分发技能
- **WHEN** 读者查看本地 README 的目录结构说明
- **THEN** SHALL 明确区分 `.opencode/skills/`（openspec 开发工作流技能，标记为 internal）和 `skills/`（用户可安装的团队配置技能）

### Requirement: 测试项目 README 目录结构与实际一致
测试项目 README 的目录结构图 SHALL 反映当前实际文件布局：
- `opencode/` 下包含 `opencode.json` 和 `rules/`（扁平结构）
- 仓库根目录包含 `skills/`（含 `setup-team-config/SKILL.md`）
- 不提及 `packages/` 或 `openspec/`（这些不属于团队配置仓库）

#### Scenario: 测试项目结构图与实际文件匹配
- **WHEN** 读者查看测试项目 README 的目录结构图
- **THEN** 结构图 SHALL 与 GitHub 仓库实际文件一致

### Requirement: CLI 用法包含所有当前功能
两个 README 的 CLI 用法示例 SHALL 包含：
- `-a` / `--agent` 标志
- `--config-dir` 标志
- `--shell` 标志（bash/zsh/fish）
- `npx skills add` 安装说明 SHALL 提供推荐方式和备选方式

#### Scenario: --shell 标志出现在 README 中
- **WHEN** 读者查看 README 的 CLI 用法部分
- **THEN** SHALL 有 `--shell` 标志的用法示例

#### Scenario: skills add 安装说明包含推荐方式和备选方式
- **WHEN** 读者查看 README 的 `npx skills add` 安装部分
- **THEN** SHALL 包含以下安装方式：
  - 推荐方式：`npx skills add <repo-url>`（自动发现 `setup-team-config`）
  - 备选方式：`npx skills add <repo-url> --skill setup-team-config`（指定技能名）
- **AND** SHALL 说明技能列表中不会显示 openspec 开发技能（已标记为 internal）
