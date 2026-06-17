## ADDED Requirements

### Requirement: openspec 开发技能标记为 internal
`.opencode/skills/` 中所有 openspec 技能的 SKILL.md YAML frontmatter SHALL 包含 `metadata.internal: true`，使其在 `npx skills add` 常规扫描中隐藏。

#### Scenario: npx skills add 常规扫描不显示 openspec 技能
- **WHEN** 用户运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git`（不设置 `INSTALL_INTERNAL_SKILLS`）
- **THEN** 技能列表中 SHALL 不显示 openspec-apply-change、openspec-archive-change、openspec-explore、openspec-propose

#### Scenario: 设置 INSTALL_INTERNAL_SKILLS 后可发现 openspec 技能
- **WHEN** 用户运行 `INSTALL_INTERNAL_SKILLS=1 npx skills add https://github.com/TotTheMax/agent-config-cli.git`
- **THEN** 技能列表中 SHALL 显示 openspec 技能

#### Scenario: opencode 仍可正常加载 openspec 技能
- **WHEN** opencode 在项目中启动
- **THEN** SHALL 正常发现并加载 `.opencode/skills/` 中的所有 openspec 技能（`internal` 标记不影响 opencode 的技能加载）

### Requirement: 仓库根目录包含 skills 目录
仓库根目录 SHALL 包含 `skills/` 目录，其中放置面向用户的可分发技能。

#### Scenario: skills 目录存在于仓库根目录
- **WHEN** 用户克隆仓库并检查根目录
- **THEN** SHALL 存在 `skills/` 目录

#### Scenario: skills 目录包含 setup-team-config 技能
- **WHEN** 用户检查 `skills/` 目录内容
- **THEN** SHALL 包含 `skills/setup-team-config/SKILL.md` 文件

### Requirement: setup-team-config 技能可被 npx skills add 自动发现
`skills/setup-team-config/SKILL.md` SHALL 位于仓库根目录的 `skills/` 子目录中，使 `npx skills add` 标准发现路径扫描时能够发现该技能。

#### Scenario: npx skills add 自动发现 setup-team-config
- **WHEN** 用户运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git`
- **THEN** SHALL 在技能列表中仅显示 `setup-team-config`（openspec 技能已被 internal 标记隐藏）

### Requirement: CLI 安装时复制 skills 目录
`OpenCodeAgent.installSkills()` SHALL 从克隆仓库的 `skills/` 目录复制技能到安装配置目录。

#### Scenario: setup 命令安装共享技能
- **WHEN** 用户运行 `agent-config-cli setup --repo <url> -a opencode`
- **THEN** 安装配置目录 SHALL 包含 `skills/setup-team-config/SKILL.md`

#### Scenario: update 命令更新共享技能
- **WHEN** 用户运行 `agent-config-cli update --repo <url> -a opencode`
- **THEN** 安装配置目录 SHALL 包含更新后的 `skills/setup-team-config/SKILL.md`

### Requirement: packages 目录中不再保留 setup-team-config-skill
移动完成后，`packages/setup-team-config-skill/` 目录 SHALL 不再存在，保持单一来源避免维护重复文件。

#### Scenario: packages 目录中无冗余技能
- **WHEN** 用户检查 `packages/` 目录内容
- **THEN** SHALL 仅包含 `agent-config-cli/` 子目录
