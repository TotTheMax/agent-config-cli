## MODIFIED Requirements

### Requirement: Skill prompts user for GitLab config repo URL
Skill SHALL prompt the user to provide the team shared config repository URL or short path. When the user provides a full URL (containing `://` or `@`), skill SHALL pass it directly to the CLI. When the user provides only a repository name or short path, skill SHALL infer the full URL by prepending `https://github.com/` before passing to CLI. If the inferred URL fails to clone, skill SHALL ask the user for the correct platform URL.

#### Scenario: User provides full URL
- **WHEN** user provides `https://gitlab.example.com/team/coding-agent-configs.git`
- **THEN** skill SHALL call `npx @tothemax/agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git -a opencode`

#### Scenario: User provides short path (GitHub inference)
- **WHEN** user provides `team/coding-agent-configs` as repo name
- **THEN** skill SHALL infer `https://github.com/team/coding-agent-configs` and call `npx @tothemax/agent-config-cli setup --repo https://github.com/team/coding-agent-configs -a opencode`

#### Scenario: Skill asks for platform when ambiguous
- **WHEN** user provides a short path and skill wants to confirm the platform
- **THEN** skill SHALL ask "Is this on GitHub, or would you like to provide a different platform URL?"

#### Scenario: Clone failure after URL inference
- **WHEN** skill inferred a GitHub URL but the CLI clone fails
- **THEN** skill SHALL tell the user "The repository may not be on GitHub. Please provide the full URL (e.g., https://gitlab.example.com/team/coding-agent-configs.git)"