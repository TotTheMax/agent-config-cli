## ADDED Requirements

### Requirement: CLI can clone team config from GitLab
CLI SHALL accept a GitLab repository URL via the `--repo` flag and clone the repository to a temporary local directory. The URL SHALL be a valid Git repository URL (HTTPS or SSH).

#### Scenario: Clone with HTTPS URL
- **WHEN** user runs `agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git`
- **THEN** CLI clones the repository to a temporary directory and proceeds with installation

#### Scenario: Clone with SSH URL
- **WHEN** user runs `agent-config-cli setup --repo git@gitlab.example.com:team/coding-agent-configs.git`
- **THEN** CLI clones the repository via SSH to a temporary directory and proceeds with installation

#### Scenario: Invalid or unreachable URL
- **WHEN** user provides a URL that cannot be cloned (invalid format or no access)
- **THEN** CLI SHALL display an error message indicating the clone failed and exit with non-zero status

### Requirement: CLI can install opencode config from cloned repo
CLI SHALL copy the `opencode/` directory contents from the cloned repository to a target local directory. The target directory SHALL be determined by the `OPENCODE_CONFIG_DIR` environment variable path.

#### Scenario: Install opencode config successfully
- **WHEN** cloned repository contains an `opencode/` directory with valid configuration files
- **THEN** CLI SHALL copy all files from `opencode/` to the target config directory

#### Scenario: No opencode directory in repo
- **WHEN** cloned repository does not contain an `opencode/` directory
- **THEN** CLI SHALL display a warning that opencode config was not found and skip opencode installation

### Requirement: CLI can set OPENCODE_CONFIG_DIR environment variable
CLI SHALL write the `OPENCODE_CONFIG_DIR` environment variable export statement to the user's shell profile file. CLI SHALL auto-detect the current shell type (bash, zsh, fish) and write to the corresponding profile file (`~/.bashrc`, `~/.zshrc`, `~/.config/fish/config.fish`).

#### Scenario: Set env var for bash user
- **WHEN** user's current shell is bash and CLI installs opencode config to `/path/to/config`
- **THEN** CLI SHALL append `export OPENCODE_CONFIG_DIR="/path/to/config"` to `~/.bashrc`, wrapped with comment markers for identification

#### Scenario: Set env var for zsh user
- **WHEN** user's current shell is zsh and CLI installs opencode config to `/path/to/config`
- **THEN** CLI SHALL append `export OPENCODE_CONFIG_DIR="/path/to/config"` to `~/.zshrc`, wrapped with comment markers for identification

#### Scenario: Set env var for fish user
- **WHEN** user's current shell is fish and CLI installs opencode config to `/path/to/config`
- **THEN** CLI SHALL append `set -gx OPENCODE_CONFIG_DIR "/path/to/config"` to `~/.config/fish/config.fish`, wrapped with comment markers for identification

#### Scenario: Existing OPENCODE_CONFIG_DIR in profile
- **WHEN** the user's shell profile already contains an `OPENCODE_CONFIG_DIR` export within agent-config-cli comment markers
- **THEN** CLI SHALL replace the existing value with the new path instead of appending a duplicate

### Requirement: CLI can update team config
CLI SHALL provide an `update` command that re-clones the repository and replaces the local config files with the latest version from GitLab.

#### Scenario: Update config successfully
- **WHEN** user runs `agent-config-cli update --repo https://gitlab.example.com/team/coding-agent-configs.git`
- **THEN** CLI SHALL clone the latest version from GitLab and overwrite the existing local config files with updated content

#### Scenario: Update with no previous installation
- **WHEN** user runs `agent-config-cli update` but no previous installation exists locally
- **THEN** CLI SHALL display an error indicating no config found and suggest running `setup` first

### Requirement: CLI supports agent registry for multi-agent extensibility
CLI SHALL maintain an internal agent registry where each agent defines `name`, `detect()`, `install(configDir, repoDir)`, and `update(configDir, repoDir)` methods. Only `opencode` SHALL be registered in the first version.

#### Scenario: Registry contains opencode agent
- **WHEN** CLI initializes
- **THEN** the agent registry SHALL contain an entry for `opencode` with all required methods implemented

#### Scenario: Future agent can be added
- **WHEN** a new agent (e.g., `trae`) needs to be supported
- **THEN** developers SHALL be able to add a new registry entry without modifying core CLI logic

### Requirement: CLI can clean up temporary clone directory
CLI SHALL remove the temporary directory used for cloning after the installation or update process completes, regardless of success or failure.

#### Scenario: Cleanup after successful install
- **WHEN** CLI completes a successful setup operation
- **THEN** the temporary clone directory SHALL be removed

#### Scenario: Cleanup after failed install
- **WHEN** CLI encounters an error during setup
- **THEN** the temporary clone directory SHALL still be removed before exiting