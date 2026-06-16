## MODIFIED Requirements

### Requirement: Skill calls CLI to perform setup
Skill SHALL invoke the `agent-config-cli` via `npx` to perform the configuration setup. Skill SHALL accept optional `-a` (agent name) and `--config-dir` (custom path) parameters from the user and pass them to the CLI invocation.

#### Scenario: Skill invokes CLI with agent flag
- **WHEN** user invokes the skill with agent name `opencode` and repo URL
- **THEN** skill SHALL execute `npx agent-config-cli setup --repo <url> -a opencode`

#### Scenario: Skill invokes CLI with agent flag and custom dir
- **WHEN** user invokes the skill with agent name `opencode`, repo URL, and custom config directory `~/custom-dir`
- **THEN** skill SHALL execute `npx agent-config-cli setup --repo <url> -a opencode --config-dir ~/custom-dir`

#### Scenario: Skill invokes CLI without new flags (backward compatible)
- **WHEN** user invokes the skill with only the repo URL
- **THEN** skill SHALL execute `npx agent-config-cli setup --repo <url>`, same as before