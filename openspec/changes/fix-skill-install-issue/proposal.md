## 为什么

当用户运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git` 时，技能扫描器在 `.opencode/skills/` 中发现了 4 个 OpenSpec 开发工作流技能，而非预期的 `setup-team-config` 技能。可分发技能位于 `packages/setup-team-config-skill/`，不在 `npx skills add` 的标准发现路径中。此外，仓库根目录缺少 `skills/` 目录——这是 `npx skills add` 的标准发现路径之一，也是 `OpenCodeAgent.installSkills()` 复制技能的来源。

根据 `npx skills add`（vercel-labs/skills）的功能特性，解决方案为：
1. 将 `setup-team-config` 技能从 `packages/setup-team-config-skill/` 移至根目录 `skills/setup-team-config/`，使其在标准发现路径中可被自动发现
2. 为 `.opencode/skills/` 的 openspec 技能添加 `metadata.internal: true`，使其在常规发现中被隐藏
3. 删除 `packages/setup-team-config-skill/`，避免维护两份相同文件
4. 更新 README 文档说明正确的安装方式和两类技能的区别

## 变更内容

- 将 `packages/setup-team-config-skill/SKILL.md` 移至 `skills/setup-team-config/SKILL.md`
- 删除 `packages/setup-team-config-skill/` 目录
- 为 `.opencode/skills/` 中 4 个 openspec 技能的 SKILL.md YAML frontmatter 添加 `metadata.internal: true`
- 更新 README 文档反映正确的目录结构、`npx skills add` 安装方式以及开发技能与可分发技能的区别
- 添加/更新测试验证 `skills/` 目录存在且包含正确技能

## 能力

### 新增能力
- `skill-repo-discovery`: 确保 openspec 开发技能标记为 internal 不干扰常规发现，仓库根目录 `skills/` 包含 `setup-team-config` 技能使其可被 `npx skills add` 自动发现

### 修改能力
- `readme-sync`: README 目录结构和技能安装说明需要更新，反映 `skills/` 目录、`metadata.internal` 标记以及正确的 `npx skills add` 安装方式

## 影响

- `skills/setup-team-config/` 仓库根目录（新增）
- `packages/setup-team-config-skill/`（移除）
- `.opencode/skills/` 中 4 个 openspec 技能的 SKILL.md frontmatter（添加 `internal: true`）
- README.md 和 packages/agent-config-cli/README.md（文档更新）
- E2E 测试和单元测试（验证 skills 目录和技能发现）
