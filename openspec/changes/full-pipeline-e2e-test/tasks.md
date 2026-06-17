## 1. 创建辅助脚本：本地 git 仓库构建器

- [x] 1.1 创建 `e2e/helpers/create-local-repo.sh` 辅助脚本，用于构建包含 `opencode/`、`skills/`、`rules/` 的临时本地 git 仓库
- [x] 1.2 确保 `create-local-repo.sh` 输出仓库路径供其他脚本使用
- [x] 1.3 在临时仓库中添加 `opencode/opencode.json`（含 MCP servers 配置）
- [x] 1.4 在临时仓库中添加 `opencode/rules/code-style.md` 等规则文件
- [x] 1.5 在临时仓库中添加 `skills/setup-team-config/SKILL.md`（从当前项目复制）

## 2. 改造现有 E2E 测试使用本地仓库

- [x] 2.1 修改 `e2e/setup.sh` 使用本地 git 仓库替代远程 GitHub 仓库
- [x] 2.2 修改 `e2e/update.sh` 使用本地 git 仓库替代远程 GitHub 仓库
- [x] 2.3 验证改造后的 setup.sh 和 update.sh 测试通过

## 3. 创建全流程 E2E 测试脚本

- [x] 3.1 创建 `e2e/pipeline.sh` 全流程测试脚本骨架
- [x] 3.2 实现步骤：构建 CLI（`npm run build`）并验证 `dist/index.js` 存在
- [x] 3.3 实现步骤：`npm pack` 生成 tarball 并验证内容
- [x] 3.4 实现步骤：在临时环境安装 tarball 并验证 `agent-config-cli` 可执行
- [x] 3.5 实现步骤：创建本地 git 仓库（调用 `create-local-repo.sh`）
- [x] 3.6 实现步骤：运行 `agent-config-cli setup --repo <local-path> -a opencode` 并验证安装结果
- [x] 3.7 实现步骤：运行 `npx skills add <local-repo-path> --list` 验证 `setup-team-config` 被发现
- [x] 3.8 实现步骤：运行 `npx skills add <local-repo-path> --list` 验证 openspec 技能被隐藏（metadata.internal: true）
- [x] 3.9 实现步骤：运行 `npx skills add <local-repo-path> --skill setup-team-config -a opencode -y --copy` 并验证技能安装路径

## 4. 创建可选远程测试脚本

- [x] 4.1 创建 `e2e/remote.sh` 可选远程测试脚本
- [x] 4.2 实现步骤：运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git --list` 验证技能发现
- [x] 4.3 实现步骤：运行 `npx skills add ... --skill setup-team-config -a opencode -y --copy` 验证技能安装
- [x] 4.4 实现步骤：运行 `agent-config-cli setup --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode` 验证远程安装

## 5. 在 pipeline.sh 中添加 npm publish 步骤

- [x] 5.1 在 `e2e/pipeline.sh` 末尾添加 `npm publish --access public` 步骤（仅在所有测试通过后执行，需 PUBLISH=true）
- [x] 5.2 添加发布后验证：`npx @tothemax/agent-config-cli@latest --version` 确认新版本可用
- [x] 5.3 确保测试失败时不执行 publish（PUBLISH=false 时跳过）

## 6. 更新 run-all.sh 和 package.json

- [x] 6.1 在 `e2e/run-all.sh` 中添加 `pipeline.sh` 测试调用（仅离线测试：setup、update、pipeline）
- [x] 6.2 更新 `package.json` 新增 `e2e:pipeline` 和 `e2e:remote` 脚本命令

## 7. 验证与测试

- [x] 7.1 运行 `npm test` 确认单元测试通过
- [x] 7.2 运行 `e2e/setup.sh` 确认使用本地仓库后测试通过
- [x] 7.3 运行 `e2e/update.sh` 确认使用本地仓库后测试通过
- [x] 7.4 运行 `e2e/pipeline.sh` 确认全流程测试通过（不含 publish，需手动验证发布步骤）
- [x] 7.5 运行 `e2e/run-all.sh` 确认所有离线 E2E 测试通过
