## 背景

当前项目将 CLI 源码放在 `packages/agent-config-cli/` 子目录中。这个 `packages/` 嵌套结构最初是为了容纳两个子包（`agent-config-cli` 和 `setup-team-config-skill`），但后者已在上一个变更中移至根目录 `skills/`。现在 `packages/` 下仅剩 `agent-config-cli/` 一个子包，嵌套层级纯属冗余。

移动后的布局更直观：根目录即为 CLI 项目，辅以 `skills/`（可分发技能）、`opencode/`（示例配置）、`openspec/`（变更管理）和 `.opencode/`（开发技能）。

## 目标 / 非目标

**目标：**
- 将 CLI 源码（src/、e2e/、package.json、tsconfig.json 等）从 `packages/agent-config-cli/` 移至项目根目录
- 删除空的 `packages/` 目录
- 更新所有内部引用路径（E2E 脚本、测试中的 REPO_ROOT）
- 更新 README 目录结构图

**非目标：**
- 修改 CLI 的功能逻辑或代码实现
- 合并两个 README.md（根 README 和 CLI README 服务于不同目的：前者面向仓库整体，后者面向 npm 包用户）
- 改变 npm 包名或发布流程

## 决策

### 决策 1：保持两个 README 文件分离

**理由**：根 README.md 是仓库的整体介绍（目录结构、安装方式、技能说明），CLI README.md（移动后将成为根目录下的独立文件，需改名避免冲突）是 npm 包的详细文档（命令参考、配置说明、FAQ）。两者受众和内容不同，合并会导致根 README 过长。

移动后根目录会同时存在 `README.md`（仓库整体）和 CLI 的 README（需重命名）。重命名方案：
- `CLI.md` 或 `cli-readme.md` — 语义清晰，不会与根 README 冲突

**考虑的替代方案**：
- 合并为一个 README：内容过长，两种受众混杂
- 保留原名 `README.md` 在子目录中：与扁平化目标矛盾

### 决策 2：将 CLI README 重命名为 `CLI.md`

**理由**：扁平化后根目录只有一个 `README.md` 位置。CLI 的详细文档用 `CLI.md` 命名，npm 包通过 `package.json` 的 `README` 字段或 GitHub 侧边栏仍可被发现。

**考虑的替代方案**：
- `docs/cli.md`：额外嵌套一层 docs 目录，与扁平化目标矛盾
- 在根 README 中嵌入 CLI 内容：过长

## 风险 / 权衡

- [风险：npm 发布时 README.md 显示的是仓库整体介绍而非 CLI 详细文档] → 缓解：npm 发布时可考虑调整，但当前 npm 包通过 `npx @tothemax/agent-config-cli` 使用，用户主要通过 GitHub 或 npx 发现项目，npm registry 的 README 不是主要入口
- [风险：E2E 脚本中 CLI 路径引用需要更新] → 缓解：E2E 脚本中 `CLI` 变量从 `${SCRIPT_DIR}/../dist/index.js` 变为 `${SCRIPT_DIR}/../dist/index.js`（路径不变，因为 e2e/ 移到了根目录下）
- [风险：测试中 REPO_ROOT 路径计算变化] → 缓解：层级减少，REPO_ROOT 从 `../../../..` 变为 `../../..`，更简单
