#!/usr/bin/env bash
set -euo pipefail

# Creates a temporary local git repo simulating a team config repository
# with opencode config, skills, and rules.
# Usage: REPO_PATH=$(bash e2e/helpers/create-local-repo.sh)
# Outputs ONLY the repo path to stdout (logs go to stderr).

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/../../"

TMP_REPO=$(mktemp -d)
echo "Creating local test repo at: $TMP_REPO" >&2

# Create opencode directory with config
mkdir -p "$TMP_REPO/opencode/.opencode/rules"
mkdir -p "$TMP_REPO/opencode/.opencode/skills/sample-skill"

# opencode.json with MCP servers
cat > "$TMP_REPO/opencode/opencode.json" << 'JSONEOF'
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/tmp"]
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-fetch"]
    }
  }
}
JSONEOF

# Rule files
cat > "$TMP_REPO/opencode/.opencode/rules/code-style.md" << 'EOF'
# Code Style Rules

- Use 2-space indentation for TypeScript
- Use single quotes for strings
- Always add trailing commas in multiline objects/arrays
EOF

cat > "$TMP_REPO/opencode/.opencode/rules/testing.md" << 'EOF'
# Testing Rules

- Every module must have at least one unit test
- Use vitest for unit tests
EOF

cat > "$TMP_REPO/opencode/.opencode/rules/git-conventions.md" << 'EOF'
# Git Conventions

- Commit messages in English
- Use conventional commits format
EOF

# Skills directory at repo root
mkdir -p "$TMP_REPO/skills/setup-team-config"
cp "${PROJECT_ROOT}/skills/setup-team-config/SKILL.md" "$TMP_REPO/skills/setup-team-config/SKILL.md"

# Skills inside opencode/.opencode/skills (copied by CLI along with opencode config)
cat > "$TMP_REPO/opencode/.opencode/skills/sample-skill/SKILL.md" << 'EOF'
---
name: sample-skill
description: A sample skill for testing purposes
---
# Sample Skill

This is a test skill for E2E verification.
EOF

# Initialize git repo (suppress git hints to keep stdout clean)
cd "$TMP_REPO"
git init > /dev/null 2>&1
git add -A
git commit -m "Initial test config" > /dev/null 2>&1

echo "$TMP_REPO"
