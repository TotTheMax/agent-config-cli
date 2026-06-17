## 为什么

项目的主要组成部分是 `agent-config-cli` CLI 工具，但它被嵌套在 `packages/agent-config-cli/` 目录下。`packages/` 原本是为了容纳两个子包（`agent-config-cli` 和 `setup-team-config-skill`），但后者已在上一个变更中移至根目录 `skills/`。现在 `packages/` 下仅剩一个子包，嵌套结构不再合理，增加了不必要的路径层级和认知负担。

## 变更内容

- **BREAKING**: 将 `packages/agent-config-cli/` 下的所有文件（src/、e2e/、package.json、tsconfig.json、vitest.config.ts、README.md）移至项目根目录
- 删除空的 `packages/` 目录
- 更新所有内部引用路径（tsconfig.json 的 rootDir、测试中的 REPO_ROOT、E2E 脚本中的 CLI 路径）
- 更新根 README 目录结构图和 CLI 代码引用路径
- 合并两个 README.md（当前根 README 和 CLI README）或保持根 README 简洁指向 CLI README

## 能力

### 新增能力
- `project-layout`: 项目扁平化布局规范，CLI 代码位于根目录而非 packages 子目录

### 修改能力
- `readme-sync`: README 目录结构图需要更新为扁平布局，引用路径从 `packages/agent-config-cli/` 改为根目录

## 影响

- `packages/agent-config-cli/` → 项目根目录（移动）
- `packages/` 目录（删除）
- 根 README.md 和 CLI README.md（合并或更新）
- tsconfig.json、vitest.config.ts（路径不变，但位置从 packages 下移到根目录）
- E2E 脚本中 CLI 路径引用（从 `../dist/index.js` 变为 `./dist/index.js`）
- 测试中 REPO_ROOT 计算（路径层级减少）
- .gitignore（可能需要调整）
