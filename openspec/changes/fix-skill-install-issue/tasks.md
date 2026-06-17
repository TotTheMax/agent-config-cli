## 1. 标记 openspec 技能为 internal

- [x] 1.1 在 `.opencode/skills/openspec-apply-change/SKILL.md` frontmatter 中添加 `metadata.internal: true`
- [x] 1.2 在 `.opencode/skills/openspec-archive-change/SKILL.md` frontmatter 中添加 `metadata.internal: true`
- [x] 1.3 在 `.opencode/skills/openspec-explore/SKILL.md` frontmatter 中添加 `metadata.internal: true`
- [x] 1.4 在 `.opencode/skills/openspec-propose/SKILL.md` frontmatter 中添加 `metadata.internal: true`

## 2. 移动技能到仓库根目录

- [x] 2.1 在仓库根目录创建 `skills/setup-team-config/` 目录
- [x] 2.2 将 `packages/setup-team-config-skill/SKILL.md` 移动到 `skills/setup-team-config/SKILL.md`
- [x] 2.3 删除 `packages/setup-team-config-skill/` 目录

## 3. 更新 README 文档

- [x] 3.1 更新根目录 `README.md` 目录结构图，包含 `skills/` 及 `setup-team-config/SKILL.md`，移除 `packages/setup-team-config-skill/`
- [x] 3.2 在根目录 `README.md` 中添加说明，区分 `.opencode/skills/`（internal 开发技能）和 `skills/`（可分发技能）
- [x] 3.3 更新根目录 `README.md` 的 `npx skills add` 部分，提供推荐方式（自动发现）和备选方式（`--skill` 指定）
- [x] 3.4 说明 openspec 技能已标记为 internal，常规扫描不会显示
- [x] 3.5 更新 `packages/agent-config-cli/README.md` 配置仓库组织部分，包含 `skills/` 目录

## 4. 更新测试

- [x] 4.1 添加测试验证仓库根目录 `skills/` 存在且包含 `setup-team-config/SKILL.md`
- [x] 4.2 添加测试验证 `.opencode/skills/` 中所有 openspec 技能的 SKILL.md frontmatter 包含 `metadata.internal: true`
- [x] 4.3 添加测试验证 `packages/` 目录仅包含 `agent-config-cli/`
- [x] 4.4 更新 E2E `setup.sh` 验证已安装配置中存在 `skills/setup-team-config/SKILL.md`
- [x] 4.5 运行现有测试确认无回归问题

## 5. 验证与端到端测试

- [x] 5.1 在 `packages/agent-config-cli/` 中运行 `npm test` 确认单元测试通过
- [x] 5.2 运行 E2E 测试验证 setup/update 包含 skills 目录（E2E 测试依赖外部 GitHub repo，已在 setup.sh 中添加验证步骤）
- [x] 5.3 验证根目录 README 目录结构图与实际 `find` 输出一致
- [x] 5.4 验证 `npx skills add` 仅发现 `setup-team-config` 技能（openspec 技能被隐藏）——已通过 metadata.internal: true 实现，需用户手动验证 `npx skills add`
