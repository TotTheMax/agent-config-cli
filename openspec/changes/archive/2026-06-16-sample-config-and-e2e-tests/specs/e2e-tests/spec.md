## ADDED Requirements

### Requirement: CLI has end-to-end tests using real GitHub repo
The CLI project SHALL include e2e test scripts in `packages/agent-config-cli/e2e/` that use the real GitHub repository (`https://github.com/tothemax/coding-agent-configs.git`) to validate the complete setup and update flow.

#### Scenario: E2E test for setup command
- **WHEN** the e2e test runs `agent-config-cli setup --repo https://github.com/tothemax/coding-agent-configs.git -a opencode`
- **THEN** the test SHALL verify that opencode config files exist in the target directory and `OPENCODE_CONFIG_DIR` environment variable is written to a temporary shell profile

#### Scenario: E2E test for update command
- **WHEN** the e2e test first runs setup then runs `agent-config-cli update --repo https://github.com/tothemax/coding-agent-configs.git -a opencode`
- **THEN** the test SHALL verify that config files are updated and environment variable remains correct

#### Scenario: E2E test uses temporary HOME directory
- **WHEN** any e2e test runs
- **THEN** it SHALL use a temporary HOME directory and not modify the user's real shell profile or config directory

#### Scenario: E2E test cleanup
- **WHEN** an e2e test completes (success or failure)
- **THEN** it SHALL clean up the temporary HOME directory and any cloned files

### Requirement: E2E tests can be run via npm script
The CLI package.json SHALL include an `e2e` npm script that runs all end-to-end tests.

#### Scenario: Running e2e tests
- **WHEN** developer runs `npm run e2e`
- **THEN** all e2e test scripts SHALL execute and report pass/fail results