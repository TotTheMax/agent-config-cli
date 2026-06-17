## 背景

当前项目有两种测试：
1. **单元测试**（vitest）：测试 CLI 各模块的独立功能，58 个测试全部通过
2. **E2E 测试**（bash 脚本）：测试 `setup` 和 `update` 命令，但依赖外部 GitHub 仓库 `git@github.com:TotTheMax/coding-agent-configs.git`

用户实际使用产品的完整链路是：构建 CLI → npm 发布 → git 推送 → 用户运行 `npx skills add` → 发现 `setup-team-config` 技能 → 安装技能 → 调用 CLI → 验证结果。这条链路中任何环节的断裂都无法被当前测试捕获。

核心问题：
- E2E 测试依赖外部 GitHub 仓库，无法在离线环境或 CI 中稳定运行
- 没有验证 `npx skills add` 的技能发现和安装流程
- 没有验证 npm 包的打包和安装流程
- 没有验证从构建到安装的完整链路连贯性

## 目标 / 非目标

**目标：**
- 新增全流程 E2E 测试脚本，覆盖构建 → npm pack → git 推送 → skills add → CLI setup → 验证
- 将现有 E2E 测试改为使用本地临时 git 仓库，消除对外部服务的依赖
- 测试可离线运行、可在 CI 中稳定运行
- 验证 `npx skills add` 能正确发现 `setup-team-config` 技能（openspec 技能被 internal 标记隐藏）

**非目标：**
- 替换现有单元测试（它们测试模块逻辑，不涉及流程）
- 测试 `npx skills add` 的跨平台行为（仅测试 Linux 环境）
- 自动化 CI/CD 发布流程的完整编排（如 GitHub Actions workflow）

## 决策

### 决策 1：使用本地 git 仓库替代远程 GitHub 仓库

**理由**：当前 E2E 测试依赖 `git@github.com:TotTheMax/coding-agent-configs.git`，存在以下问题：
- 无法离线运行
- SSH 密钥可能不可用
- 远程仓库内容变化可能导致测试不稳定

使用本地临时 git 仓库可以：
- 完全离线运行
- 仓库内容可控且可复现
- 测试速度更快（无需网络克隆）

测试脚本将创建临时目录，在其中模拟团队配置仓库结构（包含 `opencode/` 和 `skills/`），初始化 git 仓库并提交，然后使用本地路径作为 `--repo` 参数。

**考虑的替代方案**：
- 使用 GitHub Actions 中缓存远程仓库：仍有网络依赖，CI 环境外不可用
- 使用 mock/stub 替代 git clone：不测试真实的 git 交互，降低测试价值

### 决策 2：使用 `npm pack` + 本地安装模拟 npm 发布

**理由**：`npm pack` 生成真实的 tarball，`npm install <tarball>` 执行真实的安装流程，验证：
- package.json 的 bin 字段正确生成可执行文件
- 依赖正确安装
- CLI 入口文件可执行

这比 `npm link` 更接近真实发布流程，因为 `npm pack` 会打包排除文件（如 .gitignore 中排除的文件）。

**考虑的替代方案**：
- `npm link`：不测试打包过程，开发环境常用但不够接近真实发布
- 直接使用 `dist/index.js`：不验证 npm 安装流程，当前 E2E 测试已这样做但不够全面

### 决策 3：全流程测试作为独立脚本 `e2e/pipeline.sh`

**理由**：全流程测试与现有 `setup.sh`/`update.sh` 的定位不同：
- 现有测试：测试 CLI 单个命令的正确性（使用本地仓库后可离线）
- 全流程测试：测试从构建到安装的完整链路

分离脚本便于独立运行和定位问题。`run-all.sh` 统一调度所有 E2E 脚本。

**考虑的替代方案**：
- 将全流程测试合并到 `setup.sh`：职责不清，`setup.sh` 测试的是 CLI 命令而非发布流程
- 使用 vitest 集成测试：bash 脚本更适合测试 shell 环境下的真实行为（shell profile 写入等）

### 决策 4：改造现有 E2E 测试使用本地仓库

**理由**：将 `setup.sh` 和 `update.sh` 中的 `REPO_URL` 从远程 GitHub 仓库改为本地临时 git 仓库。使用本地 git 仓库路径（`--repo /tmp/test-config-repo`）替代 SSH URL。

**考虑的替代方案**：
- 保留远程仓库同时新增本地测试：维护两套测试增加负担
- 使用 GitHub API 动态创建临时仓库：过度工程化且仍有网络依赖

### 决策 5：远程 GitHub 测试作为可选步骤

**理由**：核心 E2E 测试使用本地仓库确保可离线运行，但远程下载安装是用户真实使用场景。新增 `e2e/remote.sh` 作为可选测试，验证 `npx skills add https://github.com/TotTheMax/agent-config-cli.git` 的完整远程流程（技能发现、安装、CLI 调用）。该测试需要网络和 SSH 密钥，不在 `run-all.sh` 默认执行，需手动运行或仅在 CI 中有条件执行。

`run-all.sh` 仅运行离线测试（setup、update、pipeline）。`remote.sh` 作为独立脚本，`package.json` 中新增 `e2e:remote` 命令。

**考虑的替代方案**：
- 将远程测试集成到 `run-all.sh` 默认流程：导致无网络环境测试失败
- 使用 file:// 裸仓库替代远程 URL：仍不是真实 HTTPS 下载场景

### 决策 6：测试完成后发布 npm 包

**理由**：全流程测试完成后应自动发布 npm 包，确保：
- 测试通过才发布，避免发布有问题的新版本
- 发布流程本身也被验证（`npm publish` 成功执行）
- 发布后立即验证新版本可通过 `npx` 使用

流程：单元测试 → E2E 测试 → 全流程测试 → 全部通过 → `npm publish` → 验证 `npx @tothemax/agent-config-cli` 可使用新版本

发布步骤放在 `e2e/pipeline.sh` 的最后，仅在前面所有测试通过后执行。`npm publish --access public` 需要 npm login 凭据。

**考虑的替代方案**：
- 手动发布：容易遗漏测试步骤，流程不自动化
- CI 中单独发布步骤：可行但需要 CI 配置，超出本次变更范围
- 干运行发布（`npm publish --dry-run`）：验证打包但不实际发布，不覆盖真实发布流程
