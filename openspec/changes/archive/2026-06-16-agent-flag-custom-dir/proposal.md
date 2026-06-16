## Why

当前 CLI 的 `setup` 和 `update` 命令默认只处理所有已注册的 agent（目前只有 opencode），无法指定单个 agent 操作。此外，团队配置安装目录只有硬编码的默认值（`~/.config/team-agent-config/opencode`），用户无法自定义路径，无法适配不同团队或个人的目录偏好。

## What Changes

- 新增 `-a` / `--agent` CLI 参数，允许用户指定要操作的目标 agent（如 `-a opencode`、`-a trae`），未指定时默认处理所有已注册 agent
- **BREAKING**: `setup` 和 `update` 命令的行为变更：不带 `-a` 时仍处理所有 agent，但带 `-a` 时只处理指定 agent；同时环境变量设置逻辑改为按 agent 维度管理
- 新增 `--config-dir` CLI 参数，允许用户自定义配置安装目录路径，覆盖默认值；未指定时使用默认路径 `~/.config/team-agent-config/<agent-name>`
- 更新 skill SKILL.md 中的 CLI 调用方式，增加 `-a` 和 `--config-dir` 参数说明

## Capabilities

### New Capabilities

- `agent-targeting`: CLI 支持通过 `-a` / `--agent` 参数指定目标 agent，只对该 agent 执行 setup/update 操作；未指定时处理所有已注册 agent
- `custom-config-dir`: CLI 支持通过 `--config-dir` 参数自定义配置安装目录路径，覆盖默认路径

### Modified Capabilities

- `team-config-cli`: CLI 的 setup/update 命令需集成 agent targeting 和 custom config dir 功能；环境变量设置逻辑需改为按 agent 维度，每个 agent 有独立的环境变量名和 marker
- `setup-team-config-skill`: skill 的 CLI 调用方式需更新，支持传递 `-a` 和 `--config-dir` 参数

## Impact

- CLI `setup` 和 `update` 命令的参数和行为变更（向后兼容：不带新参数时行为不变）
- 环境变量写入逻辑变更：每个 agent 维度独立管理
- `getConfigDir` 函数需支持自定义路径参数
- skill SKILL.md 文档更新