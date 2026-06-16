## ADDED Requirements

### Requirement: CLI supports --config-dir flag for custom installation path
CLI SHALL accept a `--config-dir` option on `setup` and `update` commands that specifies a custom absolute path for the configuration installation directory. When provided, this path SHALL be used directly as the agent's config directory (no agent name subdirectory appended). When not provided, CLI SHALL use the default path `~/.config/team-agent-config/<agent-name>`.

#### Scenario: Setup with custom config directory
- **WHEN** user runs `agent-config-cli setup --repo <url> -a opencode --config-dir ~/my-team-configs`
- **THEN** CLI SHALL install opencode config to `~/my-team-configs` (not `~/my-team-configs/opencode`) and set `OPENCODE_CONFIG_DIR` environment variable to `~/my-team-configs`

#### Scenario: Setup with default config directory
- **WHEN** user runs `agent-config-cli setup --repo <url> -a opencode` (no `--config-dir` flag)
- **THEN** CLI SHALL install opencode config to `~/.config/team-agent-config/opencode` and set `OPENCODE_CONFIG_DIR` environment variable to that path

#### Scenario: Custom config dir path validation
- **WHEN** user provides a relative path via `--config-dir` (e.g., `./configs`)
- **THEN** CLI SHALL resolve it to an absolute path and proceed with installation

#### Scenario: Update with custom config directory
- **WHEN** user runs `agent-config-cli update --repo <url> -a opencode --config-dir ~/my-team-configs`
- **THEN** CLI SHALL update opencode config at `~/my-team-configs`

#### Scenario: --config-dir without --agent
- **WHEN** user runs `agent-config-cli setup --repo <url> --config-dir ~/my-team-configs` (no `-a` flag)
- **THEN** CLI SHALL display an error indicating `--config-dir` requires `-a` to be specified, because different agents need different directories