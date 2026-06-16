## ADDED Requirements

### Requirement: GitHub repo contains sample opencode config
The GitHub `tothemax/coding-agent-configs` repository SHALL contain an `opencode/` directory with sample configuration files that can be used by the CLI for testing and as a real team config reference.

#### Scenario: Repository has opencode directory structure
- **WHEN** the repository is cloned
- **THEN** it SHALL contain `opencode/opencode.json` and `opencode/.opencode/rules/code-style.md`

#### Scenario: opencode.json is valid JSON
- **WHEN** `opencode/opencode.json` is parsed
- **THEN** it SHALL be valid JSON containing at minimum a `model` key with a default model value

#### Scenario: Repository has README
- **WHEN** the repository is viewed on GitHub
- **THEN** it SHALL contain a `opencode/README.md` (or root `README.md`) describing the config structure and how to use it with the CLI

#### Scenario: Directory structure matches CLI expectations
- **WHEN** the CLI runs `setup --repo https://github.com/tothemax/coding-agent-configs.git -a opencode`
- **THEN** the `opencode/` directory contents SHALL be correctly copied to the target config directory