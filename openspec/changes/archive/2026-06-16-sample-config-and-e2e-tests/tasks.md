## 1. GitHub 示例配置仓库

- [x] 1.1 在 `/home/xjiang3/workspace/github/tothemax/coding-agent-configs/` 创建 `opencode/` 目录
- [x] 1.2 创建 `opencode/opencode.json` 配置文件（包含 model 和 provider 配置）
- [x] 1.3 创建 `opencode/.opencode/rules/` 目录和 `code-style.md` 规则文件
- [x] 1.4 创建根目录 `README.md` 说明配置仓库的目录组织和使用方法
- [x] 1.5 推送所有内容到 GitHub 远程仓库

## 2. CLI 端到端测试

- [x] 2.1 创建 `packages/agent-config-cli/e2e/` 目录
- [x] 2.2 编写 `e2e/setup.sh` 测试脚本：使用临时 HOME 目录，运行 setup 命令，验证配置文件安装和环境变量写入
- [x] 2.3 编写 `e2e/update.sh` 测试脚本：先 setup 再 update，验证配置更新和环境变量保持正确
- [x] 2.4 编写 `e2e/run-all.sh` 统一运行所有 e2e 测试，汇总结果
- [x] 2.5 在 package.json 中新增 `e2e` npm script
- [x] 2.6 运行 e2e 测试验证通过

## 3. 版本发布

- [x] 3.1 更新 package.json 版本号（0.4.0）
- [ ] 3.2 构建并发布到 npm registry