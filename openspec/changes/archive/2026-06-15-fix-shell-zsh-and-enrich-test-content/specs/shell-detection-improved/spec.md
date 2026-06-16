## ADDED Requirements

### Requirement: Shell 检测使用父进程检查
系统 SHALL 通过检查父进程名称来检测用户当前实际运行的 shell，而非仅依赖 `SHELL` 环境变量。在 Linux 上，系统 SHALL 读取 `/proc/<ppid>/comm` 获取父进程名称。在 macOS 或 `/proc` 不可用时，系统 SHALL 回退到 `SHELL` 环境变量。

#### Scenario: Linux 上用户登录 shell 为 bash 但实际运行 zsh
- **WHEN** 用户登录 shell 为 bash（`SHELL=/bin/bash`）但终端中实际运行 zsh
- **THEN** 系统 SHALL 检测到 "zsh" 并将环境变量写入 `.zshrc`

#### Scenario: 用户正常运行 bash
- **WHEN** 用户登录 shell 为 bash 且实际运行 bash
- **THEN** 系统 SHALL 检测到 "bash" 并将环境变量写入 `.bashrc`

#### Scenario: /proc 不可用（macOS）
- **WHEN** 通过 `/proc` 的父进程检测失败
- **THEN** 系统 SHALL 回退到检查 `SHELL` 环境变量

### Requirement: CLI --shell 标志用于显式指定 shell 类型
系统 SHALL 在 `setup` 和 `update` 命令上接受 `--shell` 标志，取值为 `bash`、`zsh` 或 `fish`。提供该标志时 SHALL 覆盖所有 shell 检测逻辑。

#### Scenario: 用户显式指定 zsh
- **WHEN** 用户运行 `agent-config-cli setup --repo <url> --shell zsh`
- **THEN** 系统 SHALL 将环境变量写入 `.zshrc`，无论检测到的 shell 类型

#### Scenario: 用户显式指定 fish
- **WHEN** 用户运行 `agent-config-cli setup --repo <url> --shell fish`
- **THEN** 系统 SHALL 将环境变量写入 fish 配置（`~/.config/fish/config.fish`）

#### Scenario: 指定了无效的 shell 类型
- **WHEN** 用户运行 `agent-config-cli setup --repo <url> --shell powershell`
- **THEN** 系统 SHALL 显示错误信息并列出有效 shell 类型（bash、zsh、fish），以退出码 1 退出

### Requirement: Shell 检测不确定时的双重写入兜底
当父进程检查失败且 `SHELL` 环境变量不确定或不可靠时，系统 SHALL 将环境变量同时写入 `.bashrc` 和 `.zshrc` 作为兜底策略。每个文件 SHALL 包含各自的 agent-specific marker block。

#### Scenario: macOS 上检测失败，SHELL 指向 bash 但用户可能运行 zsh
- **WHEN** 父进程检测失败且 `SHELL=/bin/bash`
- **THEN** 系统 SHALL 将环境变量同时写入 `.bashrc` 和 `.zshrc`
- **AND** 每个文件 SHALL 包含各自的 agent-specific marker block

#### Scenario: 检测不确定时提供了 --shell 标志
- **WHEN** shell 检测不确定但用户提供了 `--shell zsh`
- **THEN** 系统 SHALL 仅写入 `.zshrc`（不需要双重写入）

### Requirement: Shell 检测函数返回 shell 类型数组
`detectShell` 函数 SHALL 返回 `ShellType` 值的数组，表示需要写入环境变量的所有 shell 类型。检测确定时，数组 SHALL 包含单个元素。不确定时，数组 SHALL 包含多个元素。

#### Scenario: 确定检测返回单个 shell
- **WHEN** 父进程明确识别为 zsh
- **THEN** `detectShell()` SHALL 返回 `["zsh"]`

#### Scenario: 不确定检测返回多个 shell
- **WHEN** 父进程检查失败且 `SHELL=/bin/bash`
- **THEN** `detectShell()` SHALL 返回 `["bash", "zsh"]`

#### Scenario: --shell 标志覆盖检测
- **WHEN** 提供了 `--shell zsh`
- **THEN** 检测 SHALL 返回 `["zsh"]`，无论其他信号
