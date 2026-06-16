## Context

`agent-config-cli` 将环境变量写入用户的 shell profile 文件。当前 `profile.ts` 中的 `detectShell()` 仅依赖 `process.env.SHELL`，该值在登录时设定，反映默认登录 shell — 而非用户终端中实际运行的 shell。这意味着从 bash 中启动 zsh 的用户（或登录 shell 为 bash 但交互式使用 zsh 的用户），其环境变量会被写入 `.bashrc` 而非 `.zshrc`，导致配置在当前活跃 shell 中不可用。

测试项目仓库（`coding-agent-configs`）目前仅包含 `opencode.json`、`.opencode/rules/code-style.md` 和 `README.md`，不足以展示团队配置能力（skills、MCP 工具），也限制了 E2E 测试覆盖。

## Goals / Non-Goals

**Goals:**
- 正确检测用户当前实际运行的 shell，而非仅检测登录 shell
- 允许用户通过 `--shell` 标志显式指定 shell 类型
- shell 检测不确定时提供双重写入兜底策略
- 丰富测试项目，添加 MCP 工具、skills 和额外 rules

**Non-Goals:**
- 支持 bash、zsh、fish之外的 shell（如 ksh、tcsh）
- 在 Windows 上自动检测 shell（WSL/PowerShell）
- 创建真正可用的 MCP server 实现（仅添加配置条目）

## Decisions

### 1. Shell 检测：分层策略，父进程检测为主

**决策**: 使用分层检测策略：
1. `--shell` CLI 标志（最高优先级，显式覆盖）
2. 父进程名称检查（Linux 上读取 `/proc/<ppid>/comm`）
3. `$SHELL` 环境变量（最低优先级，兜底）

**理由**: `process.env.SHELL` 对当前问题不可靠。检查父进程可获取实际运行的 shell。标志让用户在需要时进行覆盖。

**考虑过的替代方案**:
- 仅用 `--shell` 标志：每次都需要用户操作，体验不佳
- 在子进程中检查 `$0`：Node.js 子进程始终显示 node 解释器，而非父 shell
- 从 shell 特定环境变量检测（`ZSH_VERSION`、`BASH_VERSION`）：这些不会导出给子进程

### 2. 检测不确定时的双重写入兜底

**决策**: 当父进程检查失败（如 macOS 没有 `/proc`）且 `$SHELL` 不能明确匹配时，将环境变量同时写入 `.bashrc` 和 `.zshrc`。

**理由**: 同时写入两个文件是安全的（环境变量只是两边都设置，不会冲突），确保配置无论用户实际使用哪个 shell 都能生效。每个文件有各自的 agent-specific marker block，清理时很干净。

**考虑过的替代方案**:
- 仅写入一个文件并警告用户：太容易出错，用户可能不看警告
- 交互式询问用户：对 CLI 工具体验不好，在自动化场景中难以使用

### 3. 测试项目丰富：MCP + skills + rules

**决策**: 在测试项目中添加以下内容：
- `opencode/opencode.json`: 添加 MCP server 条目（filesystem、fetch），使用安全的只读配置
- `skills/`（仓库根目录）: 添加 1-2 个通用格式的 skill 文件。skills 放在仓库根目录而非 agent 目录内部，因为 skills 是通用格式，可跨不同 agent 共享
- `opencode/.opencode/rules/`: 添加额外规则（testing-conventions.md、git-conventions.md）
- `OpenCodeAgent.install()`: 更新安装逻辑，将仓库根目录的 `skills/` 复制到配置目录的 `.opencode/skills/`

**理由**: Skills 是通用格式，与特定 agent 配置不同，应放在仓库根目录以便跨 agent 共享（如 opencode 和未来的 trae 都可引用相同的 skills）。agent 安装逻辑需要将根目录 skills 复制到各自的 `.opencode/skills/` 目录下。MCP servers 和 skills 是团队共享配置的核心价值。内容应足够真实以用于 E2E 测试，但不要过于复杂。

**考虑过的替代方案**:
- 添加所有可能的配置类型：太多，不适合最小示例
- 仅添加 MCP：skills 对 agent 团队配置共享同样重要
- skills 放在 agent 目录内（如 `opencode/.opencode/skills/`）：违背 skills 通用格式的设计意图，无法跨 agent 共享

## Risks / Trade-offs

- [父进程检测在 macOS 上可能不工作] → `/proc` 仅 Linux 可用；在 macOS 上回退到 `$SHELL` + 双重写入
- [双重写入可能在不使用的 shell profile 中留下残留条目] → Agent-specific markers 使清理简单；`cleanup` 命令已可处理
- [在测试项目中添加 MCP servers 可能让用户困惑，如果 servers 实际不可用] → 使用知名的、常用的 MCP servers（filesystem、fetch）并附带清晰注释
