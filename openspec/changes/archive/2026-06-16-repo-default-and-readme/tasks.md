## 1. CLI 描述文本更新

- [x] 1.1 `--repo` 参数描述从 "GitLab repository URL for team config" 改为 "Git repository URL for team config (GitLab, GitHub, or any git server)"
- [x] 1.2 确认 setup 和 update 命令的 `--repo` 都更新了描述

## 2. Skill URL 推断逻辑

- [x] 2.1 更新 SKILL.md，增加 URL 推断规则说明：完整 URL（含 `://` 或 `@`）直接传入，短路径拼接 `https://github.com/` 前缀
- [x] 2.2 SKILL.md 增加短路径示例和推断失败时的提示指引
- [x] 2.3 SKILL.md 增加询问用户平台偏好的场景说明

## 3. npm README.md

- [x] 3.1 创建 README.md，包含：简介、安装（npx / npm install）、快速使用、命令详解（setup/update 及所有参数 --repo/-a/--config-dir）、配置仓库组织方式（按 agent 分目录）、目录结构示例、环境变量说明（OPENCODE_CONFIG_DIR）、常见问题
- [x] 3.2 验证 package.json 无 `files` 字段排除 README.md（npm 默认包含 README）

## 4. 测试

- [x] 4.1 更新已有 CLI 集成测试中 `--repo` 参数的描述验证

## 5. 版本发布

- [x] 5.1 更新 package.json 版本号（0.3.0）
- [ ] 5.2 构建并发布到 npm registry