## ADDED Requirements

### Requirement: 全流程 E2E 测试脚本存在
项目 SHALL 包含 `e2e/pipeline.sh` 全流程端到端测试脚本，覆盖从构建 CLI 到用户安装技能的完整链路。

#### Scenario: pipeline.sh 存在于 e2e 目录
- **WHEN** 用户查看 `e2e/` 目录
- **THEN** SHALL 包含 `pipeline.sh` 文件

### Requirement: 全流程测试覆盖构建 CLI
`pipeline.sh` SHALL 第一步运行 `npm run build` 构建 CLI，验证构建成功且 `dist/index.js` 存在。

#### Scenario: 构建 CLI 成功
- **WHEN** `pipeline.sh` 运行
- **THEN** SHALL 执行 `npm run build` 并验证 `dist/index.js` 文件存在

### Requirement: 全流程测试覆盖 npm pack 打包
`pipeline.sh` SHALL 执行 `npm pack` 生成 tarball，验证 tarball 包含正确的文件（bin 入口、dist 目录）。

#### Scenario: npm pack 生成有效 tarball
- **WHEN** `pipeline.sh` 运行 npm pack 步骤
- **THEN** SHALL 生成 tarball 文件且包含 `dist/index.js` 入口

### Requirement: 全流程测试覆盖本地安装 CLI
`pipeline.sh` SHALL 在临时环境中通过 tarball 安装 CLI，验证 `agent-config-cli` 命令可执行。

#### Scenario: 本地安装 CLI 后可执行
- **WHEN** `pipeline.sh` 在临时环境中通过 npm install 安装 tarball
- **THEN** `agent-config-cli` 命令 SHALL 可执行并输出正确的版本信息

### Requirement: 全流程测试覆盖本地 git 仓库创建
`pipeline.sh` SHALL 创建临时本地 git 仓库模拟团队配置仓库，包含 `opencode/`（含 `opencode.json` 和 `rules/`）和 `skills/`（含 `setup-team-config/SKILL.md`）。

#### Scenario: 本地 git 仓库包含完整配置
- **WHEN** `pipeline.sh` 创建临时 git 仓库
- **THEN** 仓库 SHALL 包含 `opencode/opencode.json`、`opencode/rules/code-style.md`、`skills/setup-team-config/SKILL.md`

### Requirement: 全流程测试覆盖 CLI setup 命令
`pipeline.sh` SHALL 使用本地 git 仓库路径作为 `--repo` 参数运行 `agent-config-cli setup`，验证配置安装到正确目录。

#### Scenario: CLI setup 使用本地仓库安装成功
- **WHEN** `pipeline.sh` 运行 `agent-config-cli setup --repo <local-path> -a opencode`
- **THEN** SHALL 创建配置目录，包含 `opencode.json`、`skills/setup-team-config/SKILL.md`，且 shell profile 中包含 `OPENCODE_CONFIG_DIR`

### Requirement: 全流程测试覆盖 npx skills add 技能发现
`pipeline.sh` SHALL 运行 `npx skills add <local-repo-path> --list` 验证 `setup-team-config` 技能被发现且 openspec 技能被隐藏。

#### Scenario: npx skills add 发现 setup-team-config
- **WHEN** `pipeline.sh` 运行 `npx skills add <local-repo-path> --list`
- **THEN** 输出中 SHALL 包含 `setup-team-config`

#### Scenario: npx skills add 不显示 openspec 技能
- **WHEN** `pipeline.sh` 运行 `npx skills add <local-repo-path> --list`（不设置 `INSTALL_INTERNAL_SKILLS`）
- **THEN** 输出中 SHALL 不包含 `openspec-apply-change`、`openspec-archive-change`、`openspec-explore`、`openspec-propose`

### Requirement: 全流程测试覆盖技能安装
`pipeline.sh` SHALL 运行 `npx skills add <local-repo-path> --skill setup-team-config -a opencode -y --copy` 安装技能到本地项目，验证技能文件安装到正确路径。

#### Scenario: 技能安装到正确路径
- **WHEN** `pipeline.sh` 运行技能安装命令
- **THEN** SHALL 在 `.agents/skills/setup-team-config/` 目录中安装 `SKILL.md`

### Requirement: run-all.sh 整合全流程测试
`e2e/run-all.sh` SHALL 调用 `pipeline.sh` 作为测试之一，仅运行离线测试（setup、update、pipeline）。

#### Scenario: run-all.sh 包含 pipeline 测试
- **WHEN** 用户运行 `e2e/run-all.sh`
- **THEN** SHALL 执行 `pipeline.sh` 并报告结果，不执行远程测试

### Requirement: 远程 GitHub 技能发现测试作为可选脚本
项目 SHALL 包含 `e2e/remote.sh` 可选测试脚本，验证从真实 GitHub URL 下载并安装技能的流程。该测试需网络和 SSH 密钥，不在 `run-all.sh` 默认执行。

#### Scenario: remote.sh 存在于 e2e 目录
- **WHEN** 用户查看 `e2e/` 目录
- **THEN** SHALL 包含 `remote.sh` 文件

#### Scenario: 远程技能发现
- **WHEN** 用户运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git --list`
- **THEN** 输出中 SHALL 包含 `setup-team-config` 且不包含 openspec 技能

#### Scenario: 远程技能安装
- **WHEN** 用户运行 `npx skills add https://github.com/TotTheMax/agent-config-cli.git --skill setup-team-config -a opencode -y --copy`
- **THEN** SHALL 在 `.agents/skills/setup-team-config/` 目录中安装 `SKILL.md`

#### Scenario: 远程 CLI setup 使用真实 GitHub 仓库
- **WHEN** `remote.sh` 运行 `agent-config-cli setup --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode`
- **THEN** SHALL 创建配置目录，包含 `opencode.json` 和 `skills/`

### Requirement: package.json 包含 e2e:remote 命令
`package.json` SHALL 包含 `e2e:remote` 脚本命令用于运行可选远程测试。

#### Scenario: npm run e2e:remote 可执行
- **WHEN** 用户运行 `npm run e2e:remote`
- **THEN** SHALL 执行 `e2e/remote.sh`

### Requirement: 全流程测试完成后发布 npm 包
`pipeline.sh` SHALL 在所有测试通过后执行 `npm publish --access public` 发布 CLI 到 npm registry，并验证新版本可使用。

#### Scenario: npm publish 成功执行
- **WHEN** `pipeline.sh` 中所有前置测试通过
- **THEN** SHALL 执行 `npm publish --access public` 并确认发布成功

#### Scenario: 发布后新版本可通过 npx 使用
- **WHEN** npm 发布完成后
- **THEN** `npx @tothemax/agent-config-cli@latest --version` SHALL 返回新发布的版本号

#### Scenario: 测试未通过时不发布
- **WHEN** `pipeline.sh` 中任何前置测试失败
- **THEN** SHALL 不执行 `npm publish`
