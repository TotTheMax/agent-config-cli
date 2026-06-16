## MODIFIED Requirements

### Requirement: CLI can clone team config from GitLab
CLI SHALL accept a git repository URL via the `--repo` flag (required) and clone the repository to a temporary local directory. The description SHALL say "Git repository URL for team config (GitLab, GitHub, or any git server)" to indicate support for any git platform, not just GitLab.

#### Scenario: Clone from GitLab URL
- **WHEN** user runs `agent-config-cli setup --repo https://gitlab.example.com/team/coding-agent-configs.git`
- **THEN** CLI clones the repository successfully

#### Scenario: Clone from GitHub URL
- **WHEN** user runs `agent-config-cli setup --repo https://github.com/team/coding-agent-configs.git`
- **THEN** CLI clones the repository successfully

#### Scenario: Clone from any git server URL
- **WHEN** user runs `agent-config-cli setup --repo https://git.internal.company.com/team/configs.git`
- **THEN** CLI clones the repository successfully

## ADDED Requirements

### Requirement: npm package includes README.md
The npm package SHALL include a README.md file that provides complete usage documentation including: introduction, installation, quick start, command reference with all parameters, config repository organization guide, directory structure examples, environment variable explanation, and FAQ.

#### Scenario: README displayed on npmjs.com
- **WHEN** a user visits `https://www.npmjs.com/package/@tothemax/agent-config-cli`
- **THEN** the page SHALL display the README.md content with full usage instructions and config repo organization guide

#### Scenario: README included in published package
- **WHEN** the package is published via `npm publish`
- **THEN** README.md SHALL be included in the package tarball