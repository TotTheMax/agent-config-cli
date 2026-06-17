## 1. 移动 CLI 源码到根目录

- [x] 1.1 将 `packages/agent-config-cli/src/` 移动到根目录 `src/`
- [x] 1.2 将 `packages/agent-config-cli/e2e/` 移动到根目录 `e2e/`
- [x] 1.3 将 `packages/agent-config-cli/package.json` 移动到根目录 `package.json`
- [x] 1.4 将 `packages/agent-config-cli/package-lock.json` 移动到根目录 `package-lock.json`
- [x] 1.5 将 `packages/agent-config-cli/tsconfig.json` 移动到根目录 `tsconfig.json`
- [x] 1.6 将 `packages/agent-config-cli/vitest.config.ts` 移动到根目录 `vitest.config.ts`
- [x] 1.7 将 `packages/agent-config-cli/README.md` 移动到根目录 `CLI.md`
- [x] 1.8 删除空的 `packages/` 目录

## 2. 更新内部引用路径

- [x] 2.1 更新 `repo-structure.test.ts` 中 REPO_ROOT 路径计算（层级减少：从 `../../../..` 变为 `../../..`）并更新 packages 目录不存在测试
- [x] 2.2 更新 E2E `setup.sh` 中 CLI 路径（路径仍然正确，无需修改）
- [x] 2.3 更新 E2E `update.sh` 中 CLI 路径（路径仍然正确，无需修改）
- [x] 2.4 安装依赖并构建（`npm install && npm run build`）确认编译正确

## 3. 更新 README 文档

- [x] 3.1 更新根 `README.md` 目录结构图为扁平布局（无 `packages/`，包含 `src/`、`e2e/`、`CLI.md` 等）
- [x] 3.2 更新根 `README.md` 中"Adding a New Agent"引用路径从 `packages/agent-config-cli/src/agents/` 改为 `src/agents/`
- [x] 3.3 在根 `README.md` 中添加指向 `CLI.md` 的链接说明

## 4. 验证与测试

- [x] 4.1 运行 `npm test` 确认所有单元测试通过（包括 repo-structure 测试的 REPO_ROOT 路径）
- [x] 4.2 运行 `npm run build` 确认编译成功
- [x] 4.3 验证根 README 目录结构图与实际 `find` 输出一致
- [x] 4.4 验证 `packages/` 目录不存在
