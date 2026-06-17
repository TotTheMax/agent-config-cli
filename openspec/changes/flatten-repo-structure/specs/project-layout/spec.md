## ADDED Requirements

### Requirement: CLI 源码位于项目根目录
CLI 工具的源码 SHALL 位于项目根目录，而非嵌套在 `packages/` 子目录下。根目录 SHALL 包含 `src/`、`e2e/`、`package.json`、`tsconfig.json`、`vitest.config.ts` 等文件。

#### Scenario: 根目录包含 CLI 源码文件
- **WHEN** 用户查看项目根目录
- **THEN** SHALL 包含 `src/`、`e2e/`、`package.json`、`tsconfig.json`、`vitest.config.ts`

#### Scenario: packages 目录不存在
- **WHEN** 用户检查项目根目录
- **THEN** `packages/` 目录 SHALL 不存在

### Requirement: CLI README 重命名为 CLI.md
原 `packages/agent-config-cli/README.md` 移至根目录后 SHALL 重命名为 `CLI.md`，避免与根 `README.md` 冲突。

#### Scenario: CLI.md 存在于根目录
- **WHEN** 用户查看项目根目录
- **THEN** SHALL 包含 `CLI.md` 文件，内容为 CLI 工具的详细文档

#### Scenario: 根目录无同名冲突
- **WHEN** 用户查看项目根目录的 README 相关文件
- **THEN** SHALL 同时存在 `README.md`（仓库整体）和 `CLI.md`（CLI 详细文档），两者内容不同

### Requirement: E2E 脚本路径正确引用 CLI
E2E 脚本 SHALL 正确引用根目录下的 `dist/index.js` 作为 CLI 入口。

#### Scenario: E2E setup.sh 正确引用 CLI
- **WHEN** E2E 测试脚本运行
- **THEN** CLI 变量 SHALL 正确指向根目录下的 `dist/index.js`

### Requirement: 测试中 REPO_ROOT 路径计算正确
`repo-structure.test.ts` 中的 REPO_ROOT SHALL 从测试文件位置正确计算到项目根目录（层级减少一层）。

#### Scenario: REPO_ROOT 指向项目根目录
- **WHEN** `repo-structure.test.ts` 测试运行
- **THEN** REPO_ROOT SHALL 正确指向项目根目录（`coding-agent-configs/`）
