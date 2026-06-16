## 1. CLI 项目初始化

- [x] 1.1 初始化 `agent-config-cli` npm 包项目结构（package.json、tsconfig.json、src/ 目录）
- [x] 1.2 配置构建工具（TypeScript 编译、bin 入口指向编译后的 CLI）
- [x] 1.3 添加必要依赖（commander 用于 CLI 参数解析、simple-git 用于 git 操作、fs-extra 用于文件操作）

## 2. Agent 注册表机制

- [x] 2.1 定义 Agent 接口类型：`name`、`detect()`、`install(configDir, repoDir)`、`update(configDir, repoDir)`
- [x] 2.2 实现 AgentRegistry 类，提供 `register(agent)`、`get(name)`、`list()` 方法
- [x] 2.3 实现 opencode agent 注册条目：`detect()` 检测当前环境是否为 opencode、`install()` 复制 opencode/ 目录内容到配置目录、`update()` 更新配置文件

## 3. CLI setup 命令

- [x] 3.1 实现 `setup` 命令入口，接受 `--repo` 参数（必填）
- [x] 3.2 实现 GitLab 仓库 clone 逻辑：创建临时目录、调用 simple-git clone、验证 clone 成功
- [x] 3.3 实现 opencode 配置安装逻辑：从克隆仓库的 `opencode/` 目录复制文件到目标配置目录
- [x] 3.4 处理无 `opencode/` 目录的情况：显示 warning 并跳过安装
- [x] 3.5 实现 clone 失败错误处理：显示错误信息、非零退出

## 4. 环境变量设置

- [x] 4.1 实现目标配置目录路径计算逻辑（默认 `~/.config/team-agent-config/opencode`）
- [x] 4.2 实现当前 shell 类型自动检测（通过 `process.env.SHELL` 判断 bash/zsh/fish）
- [x] 4.3 实现向对应 shell profile 文件写入 `OPENCODE_CONFIG_DIR` 环境变量的逻辑，添加 comment markers 便于识别
- [x] 4.4 实现检测已有 agent-config-cli 标记的 `OPENCODE_CONFIG_DIR` 设置，如存在则替换而非追加
- [x] 4.5 fish shell 的特殊语法处理（`set -gx` 而非 `export`）

## 5. CLI update 命令

- [x] 5.1 实现 `update` 命令入口，接受 `--repo` 参数（必填）
- [x] 5.2 实现更新逻辑：重新 clone 仓库、覆盖现有本地配置文件
- [x] 5.3 处理无已有安装的情况：显示错误并建议先运行 `setup`

## 6. 临时目录清理

- [x] 6.1 实现 setup/update 流程结束后的临时目录清理逻辑
- [x] 6.2 确保错误场景下也能清理临时目录（try/finally 模式）

## 7. CLI 测试

- [x] 7.1 编写 agent registry 的单元测试
- [x] 7.2 编写 opencode agent install/update 的单元测试
- [x] 7.3 编写 shell profile 环境变量写入的单元测试（覆盖 bash/zsh/fish 三种场景）
- [x] 7.4 编写环境变量替换（而非追加）的单元测试
- [x] 7.5 编写 setup 命令的集成测试（mock git clone）
- [x] 7.6 编写 update 命令的集成测试
- [x] 7.7 编写临时目录清理的单元测试（成功和失败场景）

## 8. Setup-team-config Skill

- [x] 8.1 创建 skill 项目目录结构（SKILL.md、package.json 或必要文件）
- [x] 8.2 实现 skill 入口逻辑：提示用户输入 GitLab 配置仓库 URL
- [x] 8.3 实现参数验证：URL 为必填，空 URL 显示错误并退出
- [x] 8.4 实现 CLI 调用逻辑：执行 `npx agent-config-cli setup --repo <url>`
- [x] 8.5 实现 CLI 执行结果输出转发和错误处理
- [ ] 8.6 发布 skill 到团队 GitLab 仓库（需手动发布，需 GitLab 访问权限）

## 9. 团队共享配置仓库组织

- [x] 9.1 在 `coding-agent-configs` 仓库中创建 `opencode/` 目录结构
- [x] 9.2 添加 `opencode/opencode.json` 团队共享配置文件
- [x] 9.3 添加 `opencode/.opencode/` 目录及必要内容（rules 等）
- [x] 9.4 创建 README 说明配置仓库的目录组织方式和使用方法