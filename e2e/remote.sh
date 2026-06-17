#!/usr/bin/env bash
set -euo pipefail

# Optional remote E2E test: verify real GitHub skill discovery and CLI setup
# Requires network and SSH key access
# Run: bash e2e/remote.sh

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI="${SCRIPT_DIR}/../dist/index.js"
AGENT="opencode"
REPO_URL="git@github.com:TotTheMax/coding-agent-configs.git"
SKILLS_REPO_URL="https://github.com/TotTheMax/agent-config-cli.git"

PASSED=0
FAILED=0

TMP_HOME=$(mktemp -d)
cleanup() {
  rm -rf "$TMP_HOME"
}
trap cleanup EXIT

echo ""
echo "========================================"
echo "  Remote E2E Test"
echo "========================================"

# ─── Step 1: npx skills add --list ───
echo ""
echo ">>> Step 1: npx skills add --list (remote skill discovery)"
SKILLS_OUTPUT=$(npx skills add "$SKILLS_REPO_URL" --list 2>&1 || true)

if ! echo "$SKILLS_OUTPUT" | grep -qi "setup-team-config"; then
  echo "FAIL: setup-team-config not found in remote skills list"
  FAILED=$((FAILED + 1))
else
  echo "PASS: setup-team-config found in remote skills list"
  PASSED=$((PASSED + 1))
fi

if echo "$SKILLS_OUTPUT" | grep -qi "openspec"; then
  echo "FAIL: openspec skills visible in remote skills list (metadata.internal not working)"
  FAILED=$((FAILED + 1))
else
  echo "PASS: openspec skills hidden in remote skills list"
  PASSED=$((PASSED + 1))
fi

# ─── Step 2: npx skills add --skill (remote skill installation) ───
echo ""
echo ">>> Step 2: npx skills add --skill (remote skill installation)"
REMOTE_INSTALL_DIR=$(mktemp -d)
cleanup_install() {
  rm -rf "$TMP_HOME" "$REMOTE_INSTALL_DIR"
}
trap cleanup_install EXIT

cd "$REMOTE_INSTALL_DIR"
npx skills add "$SKILLS_REPO_URL" --skill setup-team-config -a opencode -y --copy 2>&1 || true

SKILL_INSTALLED="$REMOTE_INSTALL_DIR/.agents/skills/setup-team-config/SKILL.md"
if [ ! -f "$SKILL_INSTALLED" ]; then
  echo "FAIL: skill not installed from remote repo"
  FAILED=$((FAILED + 1))
else
  echo "PASS: setup-team-config installed from remote repo"
  PASSED=$((PASSED + 1))
fi

# ─── Step 3: CLI setup with real GitHub repo ───
echo ""
echo ">>> Step 3: CLI setup with real GitHub repo"

TMP_CONFIG_BASE="$TMP_HOME/.config/team-agent-config"
HOME="$TMP_HOME" node "$CLI" setup --repo "$REPO_URL" -a "$AGENT"

if [ ! -f "$TMP_CONFIG_BASE/$AGENT/opencode.json" ]; then
  echo "FAIL: opencode.json not created from remote repo"
  FAILED=$((FAILED + 1))
else
  echo "PASS: opencode.json created from remote repo"
  PASSED=$((PASSED + 1))
fi

if [ ! -d "$TMP_CONFIG_BASE/$AGENT/skills" ]; then
  echo "FAIL: skills directory not created from remote repo"
  FAILED=$((FAILED + 1))
else
  echo "PASS: skills directory created from remote repo"
  PASSED=$((PASSED + 1))
fi

# ─── Summary ───
echo ""
echo "========================================"
echo "Remote Results: $PASSED passed, $FAILED failed"
echo "========================================"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
