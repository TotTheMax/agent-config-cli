## 为什么

当前 E2E 测试仅覆盖 CLI 的 `setup` 和 `update` 命令（依赖外部 GitHub 仓库 `coding-agent-configs`），但缺少从构建 CLI 到用户安装技能的完整发布流程验证。用户实际使用的完整流程是：构建 CLI → 发布 npm → 推送 git → 用户运行 `npx skills add` → 发现并安装 `setup-team-config` 技能 → 调用 CLI 安装团队配置。任何环节断裂都会导致用户体验问题，但目前没有自动化测试覆盖这条链路。

## 变更内容

- 新增全流程 E2E 测试脚本，覆盖从构建到安装的完整链路：
  1. 构建 CLI（`npm run build`）
  2. 本地模拟 npm 发布（`npm pack` + 本地安装）
  3. 本地模拟 git 仓库推送（使用本地 git 仓库替代远程仓库）
  4. 运行 `npx skills add` 发现并安装 `setup-team-config` 技能
  5. 验证技能安装到正确路径（`.agents/skills/` 或 `skills/`）
  6. 调用已安装技能运行 CLI `setup` 命令
  7. 验证配置安装结果（opencode.json、skills 目录、shell profile 等）
- 将现有 E2E 测试从依赖外部 GitHub 仓库改为使用本地临时 git 仓库，使测试可离线运行且不依赖外部服务
- 更新 `e2e/run-all.sh` 整合新增的全流程测试
- 全流程测试完成后自动发布 npm 包（`npm publish`），验证发布流程正确

## 能力

### 新增能力
- `pipeline-e2e`: 全流程端到端测试，覆盖构建 → npm pack → git 推送 → skills add 发现 → CLI setup 安装 → 结果验证

### 修改能力
- `rich-test-project`: 测试项目内容需要支持本地 E2E 测试（本地 git 仓库替代远程仓库）

## 影响

- `e2e/` 目录（新增全流程测试脚本、修改现有脚本使用本地仓库）
- `src/__tests__/`（可能新增测试辅助函数）
- `package.json`（新增 e2e:pipeline 脚本）
