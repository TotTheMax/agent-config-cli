## 1. Shell 检测改进

- [x] 1.1 重构 `src/shell/profile.ts` 中的 `detectShell()`，返回 `ShellType[]`（数组）而非单个 `ShellType`，实现分层检测：父进程检查 → `$SHELL` 兜底 → 双重写入兜底
- [x] 1.2 添加 `detectShellFromParentProcess()` 辅助函数，在 Linux 上读取 `/proc/<ppid>/comm` 识别实际运行的 shell，失败/macOS 时返回 null
- [x] 1.3 添加 `ShellType` 验证函数，拒绝无效的 `--shell` 标志值并显示列出有效类型的错误信息
- [x] 1.4 更新 `src/shell/env-writer.ts` 中的 `setEnvVar()`，遍历返回的 shell 数组并在每个 profile 文件中写入 agent-specific markers
- [x] 1.5 在 `src/commands/setup.ts` 的 `setup` 命令中添加 `--shell` 标志，覆盖检测并传递显式 shell 类型
- [x] 1.6 在 `src/commands/update.ts` 的 `update` 命令中添加 `--shell` 标志，行为与 setup 相同

## 2. Shell 检测测试

- [x] 2.1 为 `detectShellFromParentProcess()` 添加单元测试，覆盖 Linux `/proc` 成功和失败场景
- [x] 2.2 为 `detectShell()` 添加单元测试，覆盖返回单元素数组（确定检测）和多元素数组（不确定/兜底）
- [x] 2.3 为 `--shell` 标志覆盖行为添加单元测试
- [x] 2.4 为无效 `--shell` 标志值拒绝添加单元测试
- [x] 2.5 为双重写入场景（环境变量同时写入 `.bashrc` 和 `.zshrc`）添加单元测试
- [x] 2.6 更新现有 `shell-profile.test.ts` 以适配返回数组的 `detectShell()`

## 3. 测试项目内容丰富（MCP + Skills + Rules）

- [x] 3.1 在测试项目仓库的 `opencode/opencode.json` 中添加 MCP server 条目：`filesystem` server（只读项目访问）、`fetch` server（网页内容获取）
- [x] 3.2 在测试项目仓库根目录创建 `skills/code-review/SKILL.md` skill，包含触发描述和使用说明（通用格式，可跨 agent 共享）
- [x] 3.3 在测试项目仓库根目录创建 `skills/api-design/SKILL.md` skill（通用格式）
- [x] 3.4 在测试项目中创建 `opencode/.opencode/rules/testing-conventions.md` rule，涵盖测试命名、结构和断言模式
- [x] 3.5 在测试项目中创建 `opencode/.opencode/rules/git-conventions.md` rule，涵盖提交消息格式、分支命名和 PR 实践
- [x] 3.6 更新 `OpenCodeAgent.install()` 方法，将仓库根目录的 `skills/` 复制到配置目录的 `.opencode/skills/`，使 opencode 能发现这些通用 skills

## 4. E2E 测试更新

- [x] 4.1 更新 `e2e/setup.sh`，验证 MCP server 配置（`opencode.json` 中 `mcpServers` 非空）
- [x] 4.2 更新 `e2e/setup.sh`，验证仓库根目录的 `skills/` 目录存在且包含 `SKILL.md` 文件，并验证 skills 被复制到配置目录的 `.opencode/skills/`
- [x] 4.3 更新 `e2e/setup.sh`，验证 `.opencode/rules/` 下存在至少 3 个 rule 文件
- [x] 4.4 在 `e2e/setup.sh` 中添加 `--shell zsh` 标志的 E2E 测试，验证 `.zshrc` 接收环境变量
- [x] 4.5 在 `e2e/setup.sh` 中添加双重写入兜底的 E2E 测试，验证 `.bashrc` 和 `.zshrc` 都接收环境变量
