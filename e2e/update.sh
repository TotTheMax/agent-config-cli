#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLI="${SCRIPT_DIR}/../dist/index.js"
AGENT="opencode"

# Create local test repo
REPO_PATH=$(bash "${SCRIPT_DIR}/helpers/create-local-repo.sh")

TMP_HOME=$(mktemp -d)
TMP_CONFIG_BASE="$TMP_HOME/.config/team-agent-config"

cleanup() {
  rm -rf "$TMP_HOME"
  rm -rf "$REPO_PATH"
}
trap cleanup EXIT

echo "=== E2E: update command ==="

# First: setup
HOME="$TMP_HOME" node "$CLI" setup --repo "$REPO_PATH" -a "$AGENT"

# Verify setup worked
if [ ! -f "$TMP_CONFIG_BASE/$AGENT/opencode.json" ]; then
  echo "FAIL: setup did not create config"
  exit 1
fi
echo "PASS: setup created config"

# Record original content
ORIGINAL=$(cat "$TMP_CONFIG_BASE/$AGENT/opencode.json")

# Now: update
HOME="$TMP_HOME" node "$CLI" update --repo "$REPO_PATH" -a "$AGENT"

# Verify config directory still exists
if [ ! -d "$TMP_CONFIG_BASE/$AGENT" ]; then
  echo "FAIL: config directory removed after update"
  exit 1
fi
echo "PASS: config directory still exists after update"

# Verify opencode.json still exists and is valid
if [ ! -f "$TMP_CONFIG_BASE/$AGENT/opencode.json" ]; then
  echo "FAIL: opencode.json not found after update"
  exit 1
fi
echo "PASS: opencode.json exists after update"

# Verify OPENCODE_CONFIG_DIR still in profile
PROFILE="$TMP_HOME/.bashrc"
if ! grep -q "OPENCODE_CONFIG_DIR" "$PROFILE"; then
  echo "FAIL: OPENCODE_CONFIG_DIR not found in .bashrc after update"
  exit 1
fi
echo "PASS: OPENCODE_CONFIG_DIR still in .bashrc after update"

# Verify only one marker block (no duplicate)
MARKER_COUNT=$(grep -c "agent-config-cli:opencode >>>" "$PROFILE" || echo "0")
if [ "$MARKER_COUNT" -ne 1 ]; then
  echo "FAIL: duplicate marker blocks found (count: $MARKER_COUNT)"
  exit 1
fi
echo "PASS: no duplicate marker blocks"

echo "=== E2E: update PASSED ==="