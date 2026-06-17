# Agent Config CLI

CLI tool for setting up team-shared coding agent configurations.

**Repository**: https://github.com/TotTheMax/agent-config-cli

## Directory Structure

```
├── src/                        # CLI tool source code
├── e2e/                        # end-to-end test scripts
├── skills/                     # distributable skills for npx skills add
│   └── setup-team-config/
│       └── SKILL.md
├── opencode/                   # opencode agent config for this project
│   ├── opencode.json
│   └── rules/
├── openspec/                   # change management
├── .opencode/                  # internal development skills/commands (not user-installable)
├── CLI.md                      # CLI detailed documentation (commands, options, FAQ)
├── package.json
├── tsconfig.json
└── vitest.config.ts
```

> **Note**: `.opencode/skills/` contains internal development workflow skills (openspec), marked with `metadata.internal: true` — they are hidden from `npx skills add` by default. `skills/` contains the user-installable `setup-team-config` skill.

## Installation

### Install via opencode skill (recommended)

```bash
# Recommended: auto-discover setup-team-config skill
npx skills add https://github.com/TotTheMax/agent-config-cli.git

# Alternative: specify skill name explicitly
npx skills add https://github.com/TotTheMax/agent-config-cli.git --skill setup-team-config
```

The openspec development skills (in `.opencode/skills/`) are marked as `internal` and will not appear in the skill list. Select `setup-team-config` to install the team config setup skill.

Then invoke the `setup-team-config` skill in opencode and provide your team's config repo URL.

### Install via CLI directly

```bash
npx @tothemax/agent-config-cli setup --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode
```

### Specify Shell Type

```bash
npx @tothemax/agent-config-cli setup --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode --shell zsh
npx @tothemax/agent-config-cli setup --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode --shell fish
```

If `--shell` is not specified, the CLI detects the running shell automatically. When detection is ambiguous, it writes env vars to both `.bashrc` and `.zshrc`.

### Custom Config Directory

```bash
npx @tothemax/agent-config-cli setup --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode --config-dir ~/custom-dir
```

### Update Team Config

```bash
npx @tothemax/agent-config-cli update --repo https://github.com/TotTheMax/coding-agent-configs.git -a opencode
```

### Uninstall

Remove the `OPENCODE_CONFIG_DIR` marker block from your shell profile (marked with `# >>> agent-config-cli:opencode >>>` comments). Both `.bashrc` and `.zshrc` may contain the env var if detection was ambiguous. Then delete the config directory.

## Example Team Config Repository

The example team config repository is at: https://github.com/TotTheMax/coding-agent-configs

It includes:
- `opencode.json` with MCP server configurations (filesystem, fetch)
- `opencode/rules/` with coding rules (code-style, testing, git conventions)
- `skills/` with shared agent skills (setup-team-config)

## Adding a New Agent

1. Create a `<agent-name>/` directory in the team config repo following the agent's config structure
2. Implement an `Agent` class in `agent-config-cli` (see `src/agents/`)
3. Register it in the CLI's agent registry

## Notes

- Skills are in `skills/` at team config repo root (universal format, shared across agents)
- The installed config directory follows `.opencode` format: `rules/` and `skills/` at top level
- opencode uses `OPENCODE_CONFIG_DIR` env var to avoid overwriting personal config
- The config repo URL is provided by the user at setup time

For detailed CLI documentation (commands, options, FAQ), see [CLI.md](CLI.md).
