## ADDED Requirements

### Requirement: Skill can be installed via npx skills add
Skill SHALL be published to a team GitLab repository and installable via the `npx skills add` command with the GitLab URL as the source.

#### Scenario: Install skill from GitLab
- **WHEN** user runs `npx skills add https://gitlab.example.com/team/setup-team-config-skill.git`
- **THEN** the skill SHALL be installed into the user's local opencode skills directory and be available for use

### Requirement: Skill prompts user for GitLab config repo URL
When the skill is invoked, it SHALL prompt the user to provide the team shared config GitLab repository URL. The URL SHALL be passed to the CLI as the `--repo` parameter.

#### Scenario: User provides valid URL
- **WHEN** user invokes the skill and provides a valid GitLab repository URL (e.g., `https://gitlab.example.com/team/coding-agent-configs.git`)
- **THEN** skill SHALL call `npx agent-config-cli setup --repo <provided-url>` to execute the configuration setup

#### Scenario: User provides no URL
- **WHEN** user invokes the skill but does not provide a URL
- **THEN** skill SHALL display an error message indicating the GitLab URL is required and exit without calling the CLI

### Requirement: Skill calls CLI to perform setup
Skill SHALL invoke the `agent-config-cli` via `npx` to perform the actual configuration setup. Skill SHALL NOT implement configuration logic itself; it acts only as an entry point that collects parameters and delegates to CLI.

#### Scenario: Skill invokes CLI setup
- **WHEN** skill receives a valid GitLab URL from the user
- **THEN** skill SHALL execute `npx agent-config-cli setup --repo <url>` and relay the CLI's output and exit status to the user

#### Scenario: CLI execution fails
- **WHEN** CLI execution returns a non-zero exit status
- **THEN** skill SHALL display the CLI error output to the user and report the failure