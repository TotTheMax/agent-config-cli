## Why

GitHub 上的团队配置测试项目 (`coding-agent-configs`) 目前是空仓库，缺少示例配置内容，也没有端到端测试来验证 CLI 能正确 clone 和安装配置。每次 CLI 更改后无法自动验证配置仓库的目录结构是否与 CLI 的安装逻辑匹配，容易出现目录结构不兼容等问题。

## What Changes

- 在 GitHub `coding-agent-configs` 仓库中创建示例配置文件（opencode 目录结构、opencode.json、.opencode/rules 等）
- 在 CLI 项目中新增端到端测试，使用 GitHub 仓库作为真实 clone 来源，验证 setup/update 全流程
- 端到端测试覆盖：clone 成功、配置安装到正确目录、环境变量写入 shell profile、update 更新配置等核心流程
- 每次 CLI 代码变更后运行 e2e 测试可自动验证质量

## Capabilities

### New Capabilities

- `sample-team-config`: GitHub 仓库中的示例团队配置内容，包含完整的 opencode 目录结构和配置文件
- `e2e-tests`: CLI 端到端测试，使用真实 GitHub 仓库 clone 验证 setup/update 全流程

### Modified Capabilities

（无已有 capability 需修改）

## Impact

- GitHub `coding-agent-configs` 仓库新增 opencode/ 目录和配置文件
- CLI 项目新增 e2e 测试文件和测试脚本
- 本地仓库（GitLab 版）的 opencode/ 目录结构可能与 GitHub 示例保持一致（可选）
- CI 流程建议加入 e2e 测试步骤