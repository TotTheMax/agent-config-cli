## ADDED Requirements

### Requirement: Skill can infer full URL from short repo name
When the user provides only a repository name or short path (e.g., `team/coding-agent-configs`) to the skill, the skill SHALL attempt to infer the full URL by prepending `https://github.com/`. When the user provides a full URL (containing `://` or `@`), the skill SHALL use it directly without modification.

#### Scenario: User provides full HTTPS URL
- **WHEN** user provides `https://gitlab.example.com/team/coding-agent-configs.git` to the skill
- **THEN** skill SHALL call `npx @tothemax/agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git` without any modification

#### Scenario: User provides full SSH URL
- **WHEN** user provides `git@gitlab.example.com:team/coding-agent-configs.git` to the skill
- **THEN** skill SHALL call `npx @tothemax/agent-config-cli setup --repo git@gitlab.example.com:team/coding-agent-configs.git` without any modification

#### Scenario: User provides short path (GitHub inference)
- **WHEN** user provides `team/coding-agent-configs` to the skill (no `://` or `@`)
- **THEN** skill SHALL infer the URL as `https://github.com/team/coding-agent-configs` and call `npx @tothemax/agent-config-cli setup --repo https://github.com/team/coding-agent-configs`

#### Scenario: Skill asks user for platform preference
- **WHEN** user provides a short path and skill is unsure about the platform
- **THEN** skill MAY ask the user "Is this repository on GitHub or another platform?" before inferring the URL

#### Scenario: Clone failure after inference
- **WHEN** skill inferred a GitHub URL but the clone fails
- **THEN** skill SHALL inform the user that the repository may be on a different platform and ask them to provide the full URL