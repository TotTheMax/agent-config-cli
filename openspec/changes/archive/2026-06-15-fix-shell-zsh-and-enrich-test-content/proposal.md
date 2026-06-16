## Why

`agent-config-cli` 使用 `process.env.SHELL` 检测用户的 shell 类型，但 `$SHELL` 反映的是默认登录 shell，而非终端中实际运行的 shell。用户在登录 shell 为 bash 的情况下使用 zsh 交互时，环境变量会被写入 `.bashrc` 而非 `.zshrc`，导致配置无法生效。此外，`coding-agent-configs` 测试项目内容过少——缺少 skills、MCP 工具和更丰富的 rules——限制了其作为团队共享配置示例的价值以及 E2E 测试的覆盖范围。

## What Changes

- Shell 检测改为检查实际运行的 shell（通过父进程），不再仅依赖 `$SHELL`
- 新增 `--shell` CLI 标志，允许用户显式指定 shell 类型（bash/zsh/fish）
- 检测结果不确定时，将环境变量同时写入 `.bashrc` 和 `.zshrc` 作为兜底策略
- 丰富测试项目（`coding-agent-configs`）：
  - 在 `opencode/opencode.json` 中添加 MCP server 工具（filesystem、fetch）
  - 在仓库根目录 `skills/` 下添加通用格式的 agent skills（可跨 agent 共享）
  - 在 `opencode/.opencode/rules/` 下添加额外的 rules
  - 更新 `OpenCodeAgent.install()` 以复制仓库根目录的 `skills/` 到配置目录

## Capabilities

### New Capabilities

- `shell-detection-improved`: 改进 shell 检测，支持父进程检查、显式 `--shell` 标志和双重写入兜底
- `rich-test-project`: 丰富测试项目内容，包括 MCP 工具、skills 和 rules，用于完整的团队配置展示和 E2E 测试

### Modified Capabilities

## Impact

- `packages/agent-config-cli/src/shell/profile.ts` — shell 检测逻辑
- `packages/agent-config-cli/src/shell/env-writer.ts` — 双重写入兜底逻辑
- `packages/agent-config-cli/src/commands/setup.ts` — 新增 `--shell` 标志
- `packages/agent-config-cli/src/commands/update.ts` — 新增 `--shell` 标志
- `packages/agent-config-cli/src/__tests__/shell-profile.test.ts` — 新检测逻辑的测试
- `packages/agent-config-cli/src/agents/opencode.ts` — 安装逻辑更新，支持复制根目录 skills
- `packages/agent-config-cli/e2e/setup.sh` — 使用丰富后的测试项目进行 E2E 测试
- 测试项目（`coding-agent-configs` 仓库） — MCP、skills、rules 新文件
