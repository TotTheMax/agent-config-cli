## 1. Agent 接口与注册表更新

- [x] 1.1 Agent 接口新增 `envVarName` 属性，OpenCodeAgent 返回 `OPENCODE_CONFIG_DIR`
- [x] 1.2 更新 `registry.register(new OpenCodeAgent())` 调用确保新属性生效

## 2. CLI 命令参数扩展

- [x] 2.1 setup 命令新增 `-a` / `--agent` 选项，接受单个 agent name
- [x] 2.2 update 命令新增 `-a` / `--agent` 选项，接受单个 agent name
- [x] 2.3 setup 命令新增 `--config-dir` 选项，接受自定义配置目录绝对路径
- [x] 2.4 update 命令新增 `--config-dir` 选项，接受自定义配置目录绝对路径
- [x] 2.5 `--config-dir` 不带 `-a` 时报错提示必须指定 agent
- [x] 2.6 无效 agent name 时报错并列出可用 agent名称

## 3. 配置目录路径逻辑更新

- [x] 3.1 `getConfigDir` 函数支持传入自定义路径参数，自定义路径直接使用不做拼接；默认时仍返回 `~/.config/team-agent-config/<agent-name>`
- [x] 3.2 相对路径传入 `--config-dir` 时自动 resolve 为绝对路径

## 4. 环境变量与 marker 管理更新

- [x] 4.1 `setEnvVar` 函数支持 agent name 参数，marker 从 `# >>> agent-config-cli >>>` 改为 `# >>> agent-config-cli:<agent-name> >>>`
- [x] 4.2 `replaceBlock` 函数按 agent name 维度独立替换，不影响其他 agent 的 marker block
- [x] 4.3 兼容旧格式 marker：检测到无 agent name 的旧 marker 时，替换为新格式

## 5. setup/update 命令逻辑改造

- [x] 5.1 setup 命令：带 `-a` 时只处理指定 agent，不带时遍历所有
- [x] 5.2 update 命令：带 `-a` 时只处理指定 agent，不带时遍历所有
- [x] 5.3 传入 `--config-dir` 时用自定义路径调用 `agent.install()` 和 `setEnvVar()`
- [x] 5.4 环境变量设置使用 `agent.envVarName` 而非硬编码 `OPENCODE_CONFIG_DIR`

## 6. Skill 更新

- [x] 6.1 更新 SKILL.md 文档，增加 `-a` 和 `--config-dir` 参数说明和使用示例

## 7. 测试

- [x] 7.1 编写 `-a` 参数的单元测试（指定 agent、不指定、无效 agent）
- [x] 7.2 编写 `--config-dir` 参数的单元测试（自定义路径、默认路径、相对路径、不带 `-a` 时报错）
- [x] 7.3 编写 `envVarName` 属性的单元测试
- [x] 7.4 编写新 marker 格式的单元测试（agent-specific marker、旧格式兼容、独立替换）
- [x] 7.5 编写 setup/update 命令集成测试（组合 `-a` 和 `--config-dir` 场景）

## 8. 版本发布

- [x] 8.1 更新 package.json 版本号（0.2.0）
- [ ] 8.2 构建并发布到 npm registry