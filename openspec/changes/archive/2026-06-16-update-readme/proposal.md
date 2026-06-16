## Why

两个 README 文件（本地项目仓库 + 测试项目仓库）与实际结构不符：
- 目录结构仍显示 `.opencode/rules/` 嵌套，实际已改为 `opencode/rules/` 扁平结构
- 缺少仓库根目录 `skills/` 的描述
- 缺少 `--shell` CLI 标志文档
- 缺少 MCP tools 描述
- 本地 README 显示不存在的 `setup.sh`
- 测试项目 README 缺少 `--config-dir` 用法示例

## What Changes

- 更新本地项目 README 目录结构图（去掉 `.opencode` 嵌套，添加 `skills/`，去掉 `setup.sh`）
- 更新测试项目 README 目录结构图（`opencode/rules/` 扁平结构 + `skills/`）
- 两个 README 都添加 `--shell` 标志文档
- 测试项目 README 添加 MCP tools 说明
- 更新命令示例中的 `-a` 标志用法

## Capabilities

### New Capabilities

- `readme-sync`: 将两个 README 与当前实际代码和仓库结构同步

### Modified Capabilities

## Impact

- `README.md`（本地项目仓库） — 目录结构、CLI 用法、skills 说明
- `README.md`（测试项目仓库） — 目录结构、CLI 用法、MCP/skills 说明
