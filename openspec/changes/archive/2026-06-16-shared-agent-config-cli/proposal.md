## Why

团队使用多种 coding agent（如 opencode、trae cli 等）时，缺少统一的团队配置共享机制。每个员工需要手动配置 coding agent 的规则、skill、权限等，导致配置不一致、更新困难、维护成本高。需要一个标准化的方式让团队成员通过简单命令即可安装和使用共享团队配置，同时保持各 coding agent 的独立性。

## What Changes

- 新增一个 CLI 工具（`agent-config-cli`），负责从 GitLab 拉取团队共享配置并安装到本地
- 新增一个 opencode skill（`setup-team-config`），通过 `npx skills add` 安装后，调用 CLI 执行配置设置操作
- 用户在设置配置时需提供团队共享配置的 GitLab 地址（地址动态可变）
- opencode 配置通过 `OPENCODE_CONFIG_DIR` 环境变量指向独立目录，不覆盖 home 目录下的全局配置
- 团队共享配置在 GitLab 单独项目中维护，除 skill 外为每个 coding agent 单独维护配置目录
- CLI 设计上预留多 agent 扩展接口，第一版仅实现 opencode 支持

## Capabilities
 
### New Capabilities

- `team-config-cli`: CLI 工具的核心能力，包括从 GitLab clone 配置、安装配置到指定目录、设置环境变量、更新配置等操作。设计上支持多 agent 扩展，第一版实现 opencode 的配置安装逻辑
- `setup-team-config-skill`: opencode skill 能力，通过 skill 命令触发 CLI 执行配置设置，用户需提供 GitLab 地址参数。skill 发布到团队 GitLab，通过 `npx skills add` 安装

### Modified Capabilities

（无已有 capability 需修改）

## Impact

- 新增 `agent-config-cli` npm 包，需发布到团队内部 registry 或 GitLab
- 新增 `setup-team-config-skill` skill 仓库，需发布到团队 GitLab
- 团队共享配置项目需按 agent 类型组织目录结构（如 `opencode/`、`trae/` 等）
- 用户本地环境需支持 `OPENCODE_CONFIG_DIR` 环境变量设置
- CLI 需依赖 git（用于 clone 配置仓库）