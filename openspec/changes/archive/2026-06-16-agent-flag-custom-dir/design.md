## Context

当前 `agent-config-cli` 的 `setup` 和 `update` 命令遍历所有注册的 agent 执行操作，无法指定单个 agent。配置安装目录硬编码为 `~/.config/team-agent-config/<agent-name>`，无法自定义。随着后续将支持更多 agent（如 trae），用户需要按 agent 单独操作、且不同团队/个人可能有不同的目录偏好。

## Goals / Non-Goals

**Goals:**

- CLI 支持 `-a` / `--agent` 参数指定目标 agent，只对该 agent 执行操作
- CLI 支持 `--config-dir` 参数自定义配置安装目录路径
- 不带新参数时保持向后兼容（行为不变）
- 每个 agent 有独立的环境变量名和 marker 管理

**Non-Goals:**

- 不支持同时指定多个 agent（`-a opencode,trae`），只支持单个或全部
- 不自动推导环境变量名（每个 agent 的环境变量名由 agent 自己定义）
- 不改变现有 opencode 的 `OPENCODE_CONFIG_DIR` 环境变量名

## Decisions

### 1. `-a` / `--agent` 参数设计

**决策**: `-a` 接受单个 agent name（如 `-a opencode`）。不指定时处理所有已注册 agent。

**理由**: 
- 简单直观，符合常见 CLI 模式
- 大多数场景用户只需要操作一个 agent
- 不指定时遍历所有，向后兼容

**替代方案**: 支持多值 `-a opencode,trae` → 增加解析复杂度，实际需求少，暂不实现

### 2. `--config-dir` 参数设计

**决策**: `--config-dir` 接受一个绝对路径作为配置安装目录。指定后覆盖默认路径。路径直接作为该 agent 的配置目录，不再拼接 agent name 子目录。

**理由**:
- 用户指定路径时通常已经有明确意图（如 `--config-dir ~/my-team-configs`），不应再追加子目录
- 默认值中 `<agent-name>` 子目录是合理的，但自定义路径时追加会造成混乱
- 简单明确，不需要额外推导逻辑

**替代方案**: 自定义路径也拼接 agent name → 用户已指定路径却被追加子目录，不符合直觉

### 3. Agent 环境变量名定义

**决策**: 每个 Agent 接口新增 `envVarName` 属性，定义该 agent 需要设置的环境变量名。opencode 返回 `OPENCODE_CONFIG_DIR`，未来 trae 可返回 `TRAE_CONFIG_DIR` 等。

**理由**:
- 每个 agent 的配置目录环境变量名不同，由 agent 自己定义最合理
- 避免在 CLI 核心逻辑中硬编码环境变量名
- 扩展新 agent 时无需修改 CLI 核心代码

### 4. 环境变量 marker 管理

**决策**: 环境变量的 comment marker 中加入 agent name，从 `# >>> agent-config-cli >>>` 改为 `# >>> agent-config-cli:opencode >>>`，便于区分不同 agent 的环境变量块。

**理由**:
- 多 agent 场景下 profile 中会有多个环境变量设置，需要区分
- marker 中包含 agent name 便于定位和替换
- 仍然保持 `agent-config-cli` 前缀，便于整体识别和清理

## Risks / Trade-offs

- [向后兼容] → 不带新参数时行为不变，但 marker 格式变更会影响已有安装的替换逻辑。缓解：升级时 CLI 同时支持新旧 marker 格式的检测和替换
- [自定义路径与默认路径语义不同] → 默认路径包含 agent name 子目录，自定义路径不包含。缓解：文档清晰说明两种模式的路径结构差异
- [单 agent 指定时的环境变量设置] → 指定 `-a opencode` 时只设置 opencode 的环境变量。缓解：这是预期行为，符合直觉