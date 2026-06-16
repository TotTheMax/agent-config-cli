## MODIFIED Requirements

### Requirement: CLI can clone team config from GitLab
CLI SHALL accept a GitLab repository URL via the `--repo` flag and clone the repository to a temporary local directory. The URL SHALL be a valid Git repository URL (HTTPS or SSH). CLI SHALL also accept an optional `-a` / `--agent` flag to target a specific agent, and an optional `--config-dir` flag for custom config directory path.

#### Scenario: Clone with HTTPS URL and agent flag
- **WHEN** user runs `agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git -a opencode`
- **THEN** CLI clones the repository and only processes the opencode agent

#### Scenario: Clone with HTTPS URL and both flags
- **WHEN** user runs `agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git -a opencode --config-dir ~/custom-dir`
- **THEN** CLI clones the repository, installs opencode config to `~/custom-dir`, and sets `OPENCODE_CONFIG_DIR` to `~/custom-dir`

#### Scenario: Clone with HTTPS URL without new flags (backward compatible)
- **WHEN** user runs `agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git`
- **THEN** CLI clones the repository and processes all registered agents with default paths, same as before

### Requirement: CLI can install opencode config from cloned repo
CLI SHALL copy the `<agent-name>/` directory contents from the cloned repository to the target local directory. The target directory SHALL be determined by: (1) `--config-dir` if provided, or (2) default `~/.config/team-agent-config/<agent-name>`. Only the agent specified by `-a` SHALL be processed if that flag is provided.

#### Scenario: Install opencode config with default path
- **WHEN** cloned repository contains `opencode/` directory and user runs `-a opencode` without `--config-dir`
- **THEN** CLI SHALL copy files from `opencode/` to `~/.config/team-agent-config/opencode`

#### Scenario: Install opencode config with custom path
- **WHEN** cloned repository contains `opencode/` directory and user runs `-a opencode --config-dir ~/custom-dir`
- **THEN** CLI SHALL copy files from `opencode/` to `~/custom-dir`

### Requirement: CLI can set environment variable for agent config
CLI SHALL write the agent-specific environment variable export statement to the user's shell profile file. Each agent SHALL define its own `envVarName` property. The environment variable value SHALL be the config directory path. CLI SHALL use agent-specific comment markers (`# >>> agent-config-cli:<agent-name> >>>`) to identify and manage each agent's block independently.

#### Scenario: Set env var for opencode with default path
- **WHEN** user runs setup for opencode without `--config-dir`
- **THEN** CLI SHALL write `export OPENCODE_CONFIG_DIR="~/.config/team-agent-config/opencode"` wrapped with `# >>> agent-config-cli:opencode >>>` markers

#### Scenario: Set env var for opencode with custom path
- **WHEN** user runs setup for opencode with `--config-dir ~/custom-dir`
- **THEN** CLI SHALL write `export OPENCODE_CONFIG_DIR="~/custom-dir"` wrapped with `# >>> agent-config-cli:opencode >>>` markers

#### Scenario: Replace existing marker for same agent
- **WHEN** the user's shell profile already contains an `agent-config-cli:opencode` marker block
- **THEN** CLI SHALL replace only that agent's block, not affecting other agents' blocks

#### Scenario: Existing old-format marker (backward compatibility)
- **WHEN** the user's shell profile contains the old `# >>> agent-config-cli >>>` marker (without agent name)
- **THEN** CLI SHALL replace the old block with the new agent-specific marker format

### Requirement: CLI can update team config
CLI SHALL provide an `update` command that re-clones the repository and replaces the local config files with the latest version. The `-a` and `--config-dir` flags SHALL work the same as on `setup`.

#### Scenario: Update specific agent
- **WHEN** user runs `agent-config-cli update --repo <url> -a opencode`
- **THEN** CLI SHALL only update opencode config

#### Scenario: Update with custom config dir
- **WHEN** user runs `agent-config-cli update --repo <url> -a opencode --config-dir ~/custom-dir`
- **THEN** CLI SHALL update opencode config at `~/custom-dir`

### Requirement: CLI supports agent registry for multi-agent extensibility
CLI SHALL maintain an internal agent registry where each agent defines `name`, `envVarName`, `detect()`, `install(configDir, repoDir)`, and `update(configDir, repoDir)` methods. The `envVarName` property SHALL be a string identifying the environment variable name for that agent's config directory.

#### Scenario: Registry contains opencode agent with envVarName
- **WHEN** CLI initializes
- **THEN** the agent registry SHALL contain an entry for `opencode` with `envVarName` set to `OPENCODE_CONFIG_DIR`

### Requirement: CLI can clean up temporary clone directory
(No changes needed - cleanup behavior unchanged)

## ADDED Requirements

### Requirement: Agent interface includes envVarName
The Agent interface SHALL include an `envVarName` property that returns the environment variable name for the agent's config directory. opencode SHALL return `OPENCODE_CONFIG_DIR`.

#### Scenario: OpenCode agent envVarName
- **WHEN** OpenCodeAgent is queried for its envVarName
- **THEN** it SHALL return `OPENCODE_CONFIG_DIR`

#### Scenario: Future agent envVarName
- **WHEN** a new agent (e.g., trae) is added with envVarName `TRAE_CONFIG_DIR`
- **THEN** the registry SHALL return `TRAE_CONFIG_DIR` for that agent