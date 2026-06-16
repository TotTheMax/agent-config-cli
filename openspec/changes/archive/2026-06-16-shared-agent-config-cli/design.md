## Context

团队使用多种 coding agent（当前主要为 opencode，未来可能扩展到 trae cli 等），每个 agent 有独立的配置体系。目前缺少团队级别的配置共享机制，每个员工需手动配置，导致配置碎片化、难以统一更新。

opencode 支持通过 `OPENCODE_CONFIG_DIR` 环境变量指定配置目录，可以不覆盖用户 home 目录下的全局配置。团队配置存储在 GitLab 上的单独项目中，按 agent 类型分目录组织。

当前仓库 `coding-agent-configs` 即为团队共享配置的承载项目。

## Goals / Non-Goals

**Goals:**

- 提供一个 CLI 工具（`agent-config-cli`），能从用户指定的 GitLab 地址 clone 配置并安装到本地
- 提供 opencode skill（`setup-team-config`），通过 skill 命令触发 CLI 执行配置安装
- opencode 配置通过 `OPENCODE_CONFIG_DIR` 环境变量隔离，不影响用户全局配置
- CLI 架构预留多 agent 扩展接口，第一版仅实现 opencode 支持
- skill 通过团队 GitLab 发布，员工通过 `npx skills add` 安装

**Non-Goals:**

- 不支持 trae cli 或其他 agent 的配置安装（第一版）
- 不自动更新已安装的配置（第一版仅支持手动 `update` 命令）
- 不管理用户个人的自定义配置覆盖
- 不实现配置版本回滚机制
- 不处理 GitLab 认证（假设用户已有访问权限或使用 SSH key）

## Decisions

### 1. CLI 与 Skill 分离架构

**决策**: CLI 是独立的 npm 包（`agent-config-cli`），skill 是单独的 skill 仓库，skill 调用 CLI 执行操作。

**理由**: 
- CLI 可以独立使用，不依赖 skill 机制
- Skill 只是触发入口，实际逻辑在 CLI 中，便于复用和测试
- 未来其他 agent 也可以有自己的 skill，但共用同一个 CLI
- CLI 可以通过 `npx` 直接运行，也可以被 skill 调用

**替代方案**: 将所有逻辑写在 skill 内 → 不可复用，难以支持其他 agent

### 2. Agent 注册表模式

**决策**: CLI 内部维护一个 agent 注册表，每个 agent 是一个插件对象，定义了 `name`、`detect()`、`install(configDir, repoDir)`、`update(configDir, repoDir)` 等方法。

**理由**: 
- 新增 agent 只需添加一个注册表条目，不改变核心流程
- 每个 agent 的配置安装逻辑独立，互不影响
- 符合开闭原则

**替代方案**: 使用 if/else 分支 → 不可扩展，代码耦合

### 3. 配置目录结构

**决策**: 团队共享配置 GitLab 仓库按 agent 分目录：

```
├── opencode/
│   ├── opencode.json      # agent 主配置
│   ├── .opencode/         # agent 专有目录（rules、skills 等）
│   └── setup.sh           # 安装后脚本（可选）
├── trae/                  # 未来扩展
│   └── ...
```

**理由**: 
- 各 agent 配置结构不同，无法统一格式
- 按目录隔离便于独立维护和演进
- CLI 根据目标 agent 只 clone/处理对应目录

**替代方案**: 所有配置平铺 → 不同 agent 配置结构不同，难以管理

### 4. 环境变量隔离策略

**决策**: 使用 `OPENCODE_CONFIG_DIR` 环境变量指向安装目录，不修改 home 目录全局配置。CLI 将环境变量设置写入 shell profile 文件（如 `.bashrc`、`.zshrc`）。

**理由**: 
- opencode 官方支持此环境变量
- 避免覆盖用户个人配置
- 团队配置和个人配置完全隔离
- 删除环境变量即可恢复到个人配置状态

**替代方案**: 直接写入 `~/.config/opencode/` → 覆盖个人配置，无法隔离

### 5. Skill 调用方式

**决策**: skill 通过 `npx agent-config-cli setup --repo <gitlab-url>` 命令调用 CLI。用户在 skill 执行时提供 GitLab 地址。

**理由**: 
- GitLab 地址动态可变，不同团队可能有不同的配置仓库
- npx 可以直接运行未安装的 npm 包
- skill 只需要收集参数并调用 CLI

**替代方案**: 将 GitLab 地址硬编码在 skill 中 → 无法适配不同团队

## Risks / Trade-offs

- [环境变量持久化] → CLI 写入 shell profile 可能与用户现有配置冲突。缓解：检测现有配置，追加而非覆盖，并在配置项前后加注释标记便于识别和清理
- [GitLab 认证] → 第一版假设用户有 SSH key 或 HTTPS 访问权限。缓解：文档说明认证要求，未来版本可增加 token 输入选项
- [配置更新冲突] → 团队配置更新后本地未同步。缓解：提供 `update` 命令重新拉取，未来可考虑自动检测
- [多 shell profile 支持] → 不同用户使用 bash/zsh/fish 等。缓解：CLI 自动检测当前 shell 类型并写入对应 profile