## ADDED Requirements

### Requirement: 测试项目包含 MCP server 工具
测试项目 SHALL 在 `opencode/opencode.json` 的 `mcpServers` 字段中包含 MCP server 条目。至少 SHALL 包含一个 `filesystem` MCP server 配置，具有对项目目录的只读访问权限。

#### Scenario: opencode.json 包含 MCP server 条目
- **WHEN** 测试项目仓库被克隆并安装
- **THEN** 安装的 `opencode.json` SHALL 在 `mcpServers` 字段中包含至少一个条目
- **AND** MCP server 配置 SHALL 为 opencode 可解析的有效 JSON

#### Scenario: MCP filesystem server 已配置
- **WHEN** 安装的配置被 opencode 使用
- **THEN** opencode SHALL 能连接到 filesystem MCP server
- **AND** server SHALL 具有对项目目录的只读访问权限

### Requirement: 测试项目包含通用格式的 agent skills
测试项目 SHALL 在仓库根目录的 `skills/` 下包含至少一个 skill 定义。每个 skill SHALL 有 `SKILL.md` 文件描述何时以及如何使用该 skill。skills 放在仓库根目录而非 agent 目录内部，因为 skills 是通用格式，可跨不同 agent 共享。

#### Scenario: skills 目录存在且包含有效的 skill 文件
- **WHEN** 测试项目仓库被克隆
- **THEN** 仓库根目录 SHALL 包含 `skills/` 目录
- **AND** skills 目录中 SHALL 存在至少一个 `SKILL.md` 文件

#### Scenario: skills 在安装后被复制到 agent 配置目录
- **WHEN** `agent-config-cli setup` 命令运行并安装 opencode agent
- **THEN** 仓库根目录的 `skills/` SHALL 被复制到配置目录的 `.opencode/skills/` 下
- **AND** 每个 skill 的 `SKILL.md` 文件 SHALL 存在于安装后的配置目录中

### Requirement: 测试项目包含额外的 rules
测试项目 SHALL 在 `opencode/.opencode/rules/` 下包含至少两个额外 rule 文件（除现有的 `code-style.md` 外）。这些 rules SHALL 涵盖测试规范和 git 规范。

#### Scenario: 安装后存在多个 rule 文件
- **WHEN** 测试项目仓库被克隆并安装
- **THEN** 安装的配置 SHALL 在 `.opencode/rules/` 下包含至少 3 个 rule 文件
- **AND** rule 文件 SHALL 包括 `code-style.md`、`testing-conventions.md` 和 `git-conventions.md`

### Requirement: E2E 测试验证丰富的内容
E2E 测试套件 SHALL 验证丰富内容（MCP servers、skills、额外 rules）在 `setup` 命令运行后正确安装。

#### Scenario: E2E 测试验证 MCP server 配置
- **WHEN** E2E setup 测试运行
- **THEN** 测试 SHALL 验证 `opencode.json` 中的 `mcpServers` 非空

#### Scenario: E2E 测试验证 skills 目录
- **WHEN** E2E setup 测试运行
- **THEN** 测试 SHALL 验证仓库根目录的 `skills/` 目录存在且包含至少一个 `SKILL.md` 文件
- **AND** 测试 SHALL 验证安装后的配置目录中 `.opencode/skills/` 包含从根目录复制的 skills

#### Scenario: E2E 测试验证多个 rules
- **WHEN** E2E setup 测试运行
- **THEN** 测试 SHALL 验证 `.opencode/rules/` 下存在至少 3 个 rule 文件
