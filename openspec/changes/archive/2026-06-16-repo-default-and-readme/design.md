## Context

当前 CLI `--repo` 是必填参数，用户每次需输入完整 URL。Skill 只是收集用户输入然后透传给 CLI，没有 URL 推断能力。如果用户跟 skill 说"用 team/coding-agent-configs"，skill 无法智能拼接完整 URL。CLI 描述只提到 GitLab，实际支持所有 git 平台。

## Goals / Non-Goals

**Goals:**

- `--repo` 保持必填，skill 负责智能推断完整 URL
- Skill 根据用户输入自动判断：完整 URL 直接用，仓库名称尝试 GitHub 拼接
- CLI 描述改为通用 git 平台表述
- 新增 npm README.md

**Non-Goals:**

- CLI 不做 URL 拼接（保持简单，拼接逻辑在 skill 层）
- 不支持自动检测 git 平台类型
- 不支持配置文件存储默认 URL
- 不支持多个平台同时尝试（只拼 GitHub）

## Decisions

### 1. URL 推断在 Skill 层而非 CLI 层

**决策**: URL 拼接/推断逻辑放在 skill 中，CLI `--repo` 保持必填不变。

**理由**:
- skill 是人与 CLI 之间的智能层，自然适合做推断
- CLI 保持简单纯粹（接受完整 URL，clone 仓库），不做假设
- 不同 skill 可以有不同的推断策略，CLI 不需要知道

**替代方案**: CLI 做 URL 拼接 → 增加 CLI 复杂度，且 CLI 不应有"猜测"行为

### 2. Skill 推断规则

**决策**: Skill 检查用户提供的字符串：
- 含 `://` 或 `@` → 视为完整 URL，直接传给 CLI
- 不含 `://` 且不含 `@` → 视为仓库名称，尝试拼接 `https://github.com/<name>`
- skill 也可先确认用户是否有团队 GitLab 地址偏好

**理由**:
- GitHub 是最常见的公开 git 平台，拼接 GitHub 覆盖最常见场景
- skill 可以在拼接前询问用户（是否在 GitHub 还是 GitLab）
- 简单规则，不增加复杂度

**替代方案**: skill 自动按多个平台尝试 → git clone 失败耗时长，用户体验差

### 3. 参数描述更新

**决策**: `--repo` 描述从 "GitLab repository URL for team config" 改为 "Git repository URL for team config (GitLab, GitHub, or any git server)"。

**理由**: CLI 用 simple-git clone，任何 git 服务器都支持

## Risks / Trade-offs

- [短路径默认拼 GitHub] → 如果仓库实际在 GitLab，拼接后 clone 会失败。缓解：skill 拼接后如果 clone 失败，提示用户确认平台地址
- [skill 层推断而非 CLI 层] → 不同 skill 实现可能不一致。缓解：推断规则在 SKILL.md 中明确记录，所有 skill 遵循同一规则