## ADDED Requirements

### Requirement: CLI supports --agent flag to target specific agent
CLI SHALL accept an `-a` / `--agent` option on `setup` and `update` commands that specifies a single target agent name. When provided, CLI SHALL only execute setup/update for the specified agent. When not provided, CLI SHALL process all registered agents (backward compatible behavior).

#### Scenario: Setup specific agent with --agent flag
- **WHEN** user runs `agent-config-cli setup --repo <url> -a opencode`
- **THEN** CLI SHALL only install config and set environment variable for the opencode agent, skipping all other agents

#### Scenario: Setup all agents without --agent flag
- **WHEN** user runs `agent-config-cli setup --repo <url>` (no `-a` flag)
- **THEN** CLI SHALL process all registered agents, same as current behavior

#### Scenario: Invalid agent name provided
- **WHEN** user runs `agent-config-cli setup --repo <url> -a nonexistent`
- **THEN** CLI SHALL display an error listing available agent names and exit with non-zero status

#### Scenario: Update specific agent with --agent flag
- **WHEN** user runs `agent-config-cli update --repo <url> -a opencode`
- **THEN** CLI SHALL only update config for the opencode agent, skipping all other agents

#### Scenario: Update all agents without --agent flag
- **WHEN** user runs `agent-config-cli update --repo <url>` (no `-a` flag)
- **THEN** CLI SHALL process all registered agents, same as current behavior