## Why

CLI 的 `--repo` 参数描述只提到 GitLab，但实际上 GitHub 等 git 平台也同样支持。Skill 调用 CLI 时用户需要提供完整 URL，如果用户只说了仓库名称，skill 无法智能处理。npm 包缺少 README，用户在 npmjs.com 上看不到任何使用说明和配置指导。

## What Changes

- `--repo` 保持必填，但 Skill 负责决策具体地址：用户跟 skill 说完整 URL 时直接传入，只说仓库名称时 skill 会去 GitHub 等平台尝试拼接
- CLI `--repo` 参数描述从 "GitLab repository URL" 改为 "Git repository URL for team config"，兼容所有 git 平台
- 新增 npm 包 README.md，包含安装、使用、配置仓库组织方式、目录结构等完整说明
- Skill 增加智能 URL 拼接逻辑：用户只提供仓库名称时，skill 自动尝试 GitHub 等平台拼接完整 URL

## Capabilities

### New Capabilities

- `repo-url-inference`: Skill 智能拼接 repo URL 的能力：用户提供完整 URL 时直接使用，只提供仓库名称时 skill 自动尝试在 GitHub 等平台拼接

### Modified Capabilities

- `team-config-cli`: `--repo` 描述文本更新为通用 git 平台表述（仍为必填参数）
- `setup-team-config-skill`: Skill 增加智能 URL 推断逻辑，根据用户输入决定传给 CLI 的完整 URL

## Impact

- CLI `--repo` 参数无行为变更（仍必填），只是描述文本更新
- Skill 调用逻辑变更：skill 现在会根据用户输入推断完整 URL 再传给 CLI
- package.json 需确保 README.md 被包含在 npm publish 的文件列表中