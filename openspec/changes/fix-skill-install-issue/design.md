## 背景

仓库具有双重用途：既是开发工作区（在 `.opencode/skills/` 中包含 openspec 工作流技能），又是可分发技能包。当用户运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git` 时，工具扫描 SKILL.md 文件。`npx skills add` 的标准发现路径包括 `skills/`、`.agents/skills/` 等。扫描器在递归回退搜索时发现了 `.opencode/skills/` 中的 4 个 openspec 开发技能，而可分发技能 `setup-team-config` 位于 `packages/setup-team-config-skill/`，不在任何标准发现路径中。

根据 vercel-labs/skills CLI 的功能特性，`metadata.internal: true` 可以将技能标记为内部技能，使其在常规发现中隐藏。同时，`skills/` 是标准发现路径之一，将技能放入根目录 `skills/` 即可自动被发现。

此外，`OpenCodeAgent.installSkills()` 方法从克隆仓库的 `skills/` 复制到配置目录。当前仓库根目录缺少 `skills/`，导致 CLI 安装时无法分发共享技能。

## 目标 / 非目标

**目标：**
- 将 `setup-team-config` 技能移至根目录 `skills/setup-team-config/`，使其可被 `npx skills add` 自动发现
- 删除 `packages/setup-team-config-skill/`，避免维护两份相同文件（单一来源）
- 为 openspec 开发技能添加 `metadata.internal: true`，使其在常规 `npx skills add` 发现中被隐藏
- 更新 README 文档说明正确的安装方式和两类技能的区别
- 添加测试验证技能发现行为

**非目标：**
- 移除或迁移 `.opencode/skills/` 中的 OpenSpec 开发技能（它们是开发工作流必需的）
- 改变 `npx skills add` 的扫描机制（那是工具层面的问题）
- 修改 CLI 的 `OpenCodeAgent.installSkills()` 逻辑（已有实现正确复制 `<repoDir>/skills/`）

## 决策

### 决策 1：将技能从 `packages/setup-team-config-skill/` 移至 `skills/setup-team-config/`

**理由**：根目录 `skills/` 同时满足两个需求：
- `npx skills add` 在 `skills/<name>/SKILL.md` 标准发现路径中自动发现技能
- `OpenCodeAgent.installSkills()` 从克隆仓库的 `skills/` 复制到配置目录

`packages/setup-team-config-skill/` 不是 npm 包 `@tothemax/agent-config-cli` 的一部分（npm 包在 `packages/agent-config-cli/`），它只是一个独立目录。移动后删除原位置，保持单一来源，避免维护两份相同文件。

**考虑的替代方案**：
- 符号链接从 `skills/setup-team-config` → `packages/setup-team-config-skill/`：Git 符号链接依赖平台，增加复杂性，仍需维护两个位置
- 保留两份（根目录 `skills/` + `packages/`）：需要同步两处内容，维护负担
- 仅使用直接路径 URL 安装（`packages/` 原位）：不够直观，用户需知道子目录路径

### 决策 2：为 openspec 技能添加 `metadata.internal: true`

**理由**：`npx skills add` 支持 `metadata.internal: true` 标记。标记为 internal 的技能在常规扫描中隐藏，仅在设置 `INSTALL_INTERNAL_SKILLS=1` 时可见。openspec 技能是开发工作流工具，不应作为用户可安装的团队配置技能呈现。此标记不影响 opencode 本身加载这些技能（opencode 通过 `.opencode/skills/` 路径直接加载）。

**考虑的替代方案**：
- 重命名 `.opencode/skills/` 为其他目录：会破坏 opencode 对技能的自动发现和 `/opsx-*` 命令
- 仅在 README 提示用户选择正确技能：仍会造成混淆

## 风险 / 权衡

- [风险：`metadata.internal` 标记在某些旧版 `npx skills add` 中不支持] → 缓解：该特性已发布较久；不支持时仅表现为 openspec 技能仍可见，不影响功能
- [风险：移动技能后外部引用 `packages/setup-team-config-skill/` 的路径失效] → 缓解：该技能从未从 `packages/` 路径独立发布，不存在外部消费者
- [风险：E2E 测试可能引用旧路径] → 缓解：检查并更新测试脚本
