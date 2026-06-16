## ADDED Requirements

### Requirement: CLI supports --repo as optional with URL inference
CLI SHALL accept `--repo` as an optional parameter. When not provided, CLI SHALL use `--default-repo` if available. When `--repo` value contains `://` or `@`, CLI SHALL treat it as a complete URL and use it directly. When `--repo` value does not contain `://` or `@`, CLI SHALL treat it as a short path and prepend `https://github.com/` to form the full URL. When neither `--repo` nor `--default-repo` is provided, CLI SHALL display an error indicating that a repo URL is required.

#### Scenario: Full HTTPS URL provided
- **WHEN** user runs `agent-config-cli setup --repo https://gitlab.example.com/team/configs.git`
- **THEN** CLI SHALL use the URL directly for cloning

#### Scenario: Full SSH URL provided
- **WHEN** user runs `agent-config-cli setup --repo git@gitlab.example.com:team/configs.git`
- **THEN** CLI SHALL use the SSH URL directly for cloning

#### Scenario: Short path provided (GitHub inference)
- **WHEN** user runs `agent-config-cli setup --repo team/coding-agent-configs`
- **THEN** CLI SHALL resolve the URL to `https://github.com/team/coding-agent-configs`

#### Scenario: Default repo provided by skill
- **WHEN** user runs `agent-config-cli setup --default-repo https://gitlab.example.com/team/configs.git`
- **THEN** CLI SHALL use the default repo URL for cloning

#### Scenario: Short path with default repo override
- **WHEN** user runs `agent-config-cli setup --repo team/configs --default-repo https://gitlab.internal.com/`
- **THEN** CLI SHALL resolve the URL to `https://gitlab.internal.com/team/configs`

#### Scenario: No repo URL provided at all
- **WHEN** user runs `agent-config-cli setup` without `--repo` or `--default-repo`
- **THEN** CLI SHALL display an error: "No repository URL provided. Use --repo <url> or --default-repo <url>." and exit with non-zero status

### Requirement: CLI supports --default-repo for preset URL
CLI SHALL accept `--default-repo` option on `setup` and `update` commands. When `--default-repo` is provided without `--repo`, CLI SHALL use `--default-repo` value as the clone URL. When both `--default-repo` and `--repo` (short path) are provided, CLI SHALL concatenate them. When both `--default-repo` and `--repo` (full URL) are provided, CLI SHALL use `--repo` value directly (default-repo ignored).

#### Scenario: Only default-repo provided
- **WHEN** user runs `agent-config-cli setup --default-repo https://gitlab.example.com/team/configs.git`
- **THEN** CLI SHALL clone from the default-repo URL

#### Scenario: Both default-repo and short-path repo provided
- **WHEN** user runs `agent-config-cli setup --repo team/configs --default-repo https://gitlab.internal.com`
- **THEN** CLI SHALL resolve to `https://gitlab.internal.com/team/configs`

#### Scenario: Both default-repo and full-URL repo provided
- **WHEN** user runs `agent-config-cli setup --repo https://github.com/other/repo.git --default-repo https://gitlab.internal.com`
- **THEN** CLI SHALL use `https://github.com/other/repo.git` (default-repo ignored)