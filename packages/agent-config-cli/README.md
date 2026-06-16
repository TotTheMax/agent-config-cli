# @tothemax/agent-config-cli

CLI tool for setting up team-shared coding agent configurations. Clone a team config repository and install configurations for opencode (and future agents) to your local machine.

## Install

```bash
# Use directly with npx (no install needed)
npx @tothemax/agent-config-cli setup --repo <url>

# Or install globally
npm install -g @tothemax/agent-config-cli
agent-config-cli setup --repo <url>
```

## Quick Start

```bash
# Setup opencode config from your team's repository
npx @tothemax/agent-config-cli setup --repo https://github.com/your-team/coding-agent-configs.git -a opencode

# Setup all agents
npx @tothemax/agent-config-cli setup --repo https://gitlab.example.com/your-team/coding-agent-configs.git

# Update to latest config
npx @tothemax/agent-config-cli update --repo https://github.com/your-team/coding-agent-configs.git -a opencode
```

After setup, restart your shell or run `source ~/.bashrc` (or `~/.zshrc`) to apply the environment variable changes.

## Commands

### `setup`

Install team config from a git repository.

```bash
agent-config-cli setup --repo <url> [-a <agent>] [--config-dir <path>]
```

**Options:**

| Option | Required | Description |
|--------|----------|-------------|
| `--repo <url>` | Yes | Git repository URL for team config (GitLab, GitHub, or any git server) |
| `-a, --agent <name>` | No | Target a specific agent (e.g., `opencode`). Omit to setup all agents |
| `--config-dir <path>` | No | Custom config installation directory path. Requires `-a` to be specified |

**Examples:**

```bash
# Setup opencode only
agent-config-cli setup --repo https://gitlab.example.com/team/configs.git -a opencode

# Setup opencode with custom directory
agent-config-cli setup --repo https://github.com/team/configs -a opencode --config-dir ~/my-team-configs

# Setup all agents with default paths
agent-config-cli setup --repo https://gitlab.example.com/team/configs.git
```

### `update`

Update an already-installed team config to the latest version.

```bash
agent-config-cli update --repo <url> [-a <agent>] [--config-dir <path>]
```

Same options as `setup`. Must have a previous installation before running `update`.

## Config Repository Organization

Your team config repository should be organized by agent type, each in its own directory:

```
├── opencode/
│   ├── opencode.json          # opencode main config
│   ├── .opencode/             # opencode specific directory
│   │   └── rules/             # coding rules for opencode
│   │       └── code-style.md
│   └── setup.sh               # optional post-install script
├── trae/                      # future: trae cli configuration
│   └── ...
```

**Key points:**
- Each agent has its own top-level directory (e.g., `opencode/`, `trae/`)
- The CLI copies the entire `<agent>/` directory contents to the local config directory
- `setup.sh` is optional — not currently executed by the CLI

## Environment Variables

After setup, the CLI writes environment variables to your shell profile:

| Agent | Variable | Default Value |
|-------|----------|---------------|
| opencode | `OPENCODE_CONFIG_DIR` | `~/.config/team-agent-config/opencode` |

The CLI auto-detects your shell type (bash/zsh/fish) and writes to the correct profile file:
- bash: `~/.bashrc`
- zsh: `~/.zshrc`
- fish: `~/.config/fish/config.fish`

Each agent's environment variable is wrapped with comment markers for identification:

```bash
# >>> agent-config-cli:opencode >>>>
export OPENCODE_CONFIG_DIR="~/.config/team-agent-config/opencode"
# <<< agent-config-cli:opencode <<<

```

## Default vs Custom Config Directory

By default, each agent's config is installed to `~/.config/team-agent-config/<agent-name>/`.

You can customize this with `--config-dir`:

```bash
agent-config-cli setup --repo <url> -a opencode --config-dir ~/custom-path
```

**Note:** Custom paths are used directly (no agent name subdirectory is appended). `--config-dir` requires `-a` to be specified.

## FAQ

**Q: Does this only work with GitLab?**
A: No. The CLI works with any git server — GitLab, GitHub, Gitea, or any server that supports `git clone`.

**Q: How do I uninstall?**
A: Remove the environment variable block from your shell profile (marked with `agent-config-cli` comments), then delete the config directory (default: `~/.config/team-agent-config/<agent-name>/`).

**Q: How do I add support for a new agent (e.g., trae)?**
A: Add a new agent class in the CLI's `src/agents/` directory implementing the `Agent` interface, and register it in the agent registry. Then create a `<agent-name>/` directory in your config repo.

**Q: What if I already have a personal opencode config?**
A: The CLI uses `OPENCODE_CONFIG_DIR` to isolate team config in a separate directory, so your personal config in `~/.config/opencode/` is not affected. When `OPENCODE_CONFIG_DIR` is set, opencode uses that directory instead.

**Q: Can I use a local git repo path?**
A: Yes, you can pass a local path as `--repo` (e.g., `--repo /path/to/local/repo`).