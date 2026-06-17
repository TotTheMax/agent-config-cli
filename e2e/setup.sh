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

echo "=== E2E: setup command ==="

# Setup with temporary HOME
HOME="$TMP_HOME" node "$CLI" setup --repo "$REPO_PATH" -a "$AGENT"

# Verify config directory exists
if [ ! -d "$TMP_CONFIG_BASE/$AGENT" ]; then
  echo "FAIL: config directory not created at $TMP_CONFIG_BASE/$AGENT"
  exit 1
fi
echo "PASS: config directory created"

# Verify opencode.json exists
if [ ! -f "$TMP_CONFIG_BASE/$AGENT/opencode.json" ]; then
  echo "FAIL: opencode.json not found"
  exit 1
fi
echo "PASS: opencode.json exists"

# Verify opencode.json is valid JSON
if ! python3 -c "import json; json.load(open('$TMP_CONFIG_BASE/$AGENT/opencode.json'))" 2>/dev/null; then
  if ! node -e "JSON.parse(require('fs').readFileSync('$TMP_CONFIG_BASE/$AGENT/opencode.json','utf8'))" 2>/dev/null; then
    echo "FAIL: opencode.json is not valid JSON"
    exit 1
  fi
fi
echo "PASS: opencode.json is valid JSON"

# Verify mcpServers is non-empty in opencode.json
if ! node -e "const cfg=JSON.parse(require('fs').readFileSync('$TMP_CONFIG_BASE/$AGENT/opencode.json','utf8')); if(Object.keys(cfg.mcpServers||{}).length===0) throw new Error('empty')" 2>/dev/null; then
  echo "FAIL: mcpServers is empty in opencode.json"
  exit 1
fi
echo "PASS: mcpServers non-empty in opencode.json"

# Verify .opencode/rules directory exists
if [ ! -d "$TMP_CONFIG_BASE/$AGENT/.opencode/rules" ]; then
  echo "FAIL: .opencode/rules directory not found"
  exit 1
fi
echo "PASS: .opencode/rules directory exists"

# Verify at least 3 rule files exist
RULE_COUNT=$(find "$TMP_CONFIG_BASE/$AGENT/.opencode/rules" -name "*.md" | wc -l)
if [ "$RULE_COUNT" -lt 3 ]; then
  echo "FAIL: expected at least 3 rule files, found $RULE_COUNT"
  exit 1
fi
echo "PASS: $RULE_COUNT rule files found (>= 3)"

# Verify code-style.md exists
if [ ! -f "$TMP_CONFIG_BASE/$AGENT/.opencode/rules/code-style.md" ]; then
  echo "FAIL: code-style.md not found"
  exit 1
fi
echo "PASS: code-style.md exists"

# Verify .opencode/skills directory exists and contains SKILL.md files
if [ ! -d "$TMP_CONFIG_BASE/$AGENT/.opencode/skills" ]; then
  echo "FAIL: .opencode/skills directory not found"
  exit 1
fi

SKILL_MD_COUNT=$(find "$TMP_CONFIG_BASE/$AGENT/.opencode/skills" -name "SKILL.md" | wc -l)
if [ "$SKILL_MD_COUNT" -lt 1 ]; then
  echo "FAIL: no SKILL.md files found in .opencode/skills"
  exit 1
fi
echo "PASS: $SKILL_MD_COUNT SKILL.md files found in .opencode/skills"

# Verify skills directory exists at config root
if [ ! -d "$TMP_CONFIG_BASE/$AGENT/skills" ]; then
  echo "FAIL: skills directory not found at config root"
  exit 1
fi

SKILL_SETUP_MD=$(find "$TMP_CONFIG_BASE/$AGENT/skills" -name "SKILL.md" | wc -l)
if [ "$SKILL_SETUP_MD" -lt 1 ]; then
  echo "FAIL: no SKILL.md files found in skills directory"
  exit 1
fi
echo "PASS: $SKILL_SETUP_MD SKILL.md files found in skills directory"

# Verify OPENCODE_CONFIG_DIR written to shell profile
BASHRC="$TMP_HOME/.bashrc"
ZSHRC="$TMP_HOME/.zshrc"

if [ ! -f "$BASHRC" ]; then
  echo "FAIL: .bashrc not created"
  exit 1
fi
if ! grep -q "OPENCODE_CONFIG_DIR" "$BASHRC"; then
  echo "FAIL: OPENCODE_CONFIG_DIR not found in .bashrc"
  exit 1
fi
echo "PASS: OPENCODE_CONFIG_DIR written to .bashrc"

# Verify marker format
if ! grep -q "agent-config-cli:opencode" "$BASHRC"; then
  echo "FAIL: agent-config-cli:opencode marker not found in .bashrc"
  exit 1
fi
echo "PASS: agent-specific marker found in .bashrc"

echo ""
echo "=== E2E: --shell zsh flag ==="

# Clean up previous profiles for --shell test
rm -f "$TMP_HOME/.bashrc" "$TMP_HOME/.zshrc"

HOME="$TMP_HOME" node "$CLI" setup --repo "$REPO_PATH" -a "$AGENT" --shell zsh

# Verify ONLY .zshrc gets env var when --shell zsh is specified
if [ ! -f "$ZSHRC" ]; then
  echo "FAIL: .zshrc not created with --shell zsh"
  exit 1
fi
if ! grep -q "OPENCODE_CONFIG_DIR" "$ZSHRC"; then
  echo "FAIL: OPENCODE_CONFIG_DIR not found in .zshrc with --shell zsh"
  exit 1
fi
echo "PASS: OPENCODE_CONFIG_DIR written to .zshrc with --shell zsh"

# .bashrc should NOT have the env var when --shell zsh overrides
if [ -f "$BASHRC" ] && grep -q "OPENCODE_CONFIG_DIR" "$BASHRC"; then
  echo "FAIL: OPENCODE_CONFIG_DIR found in .bashrc when --shell zsh should override"
  exit 1
fi
echo "PASS: .bashrc does not contain OPENCODE_CONFIG_DIR when --shell zsh specified"

echo ""
echo "=== E2E: dual-write fallback (force both shells) ==="

rm -f "$TMP_HOME/.bashrc" "$TMP_HOME/.zshrc"

# Force dual-write by specifying both shells explicitly
HOME="$TMP_HOME" node "$CLI" setup --repo "$REPO_PATH" -a "$AGENT" --shell bash
HOME="$TMP_HOME" node "$CLI" setup --repo "$REPO_PATH" -a "$AGENT" --shell zsh

# Both .bashrc and .zshrc should have env var
if [ ! -f "$BASHRC" ] || ! grep -q "OPENCODE_CONFIG_DIR" "$BASHRC"; then
  echo "FAIL: OPENCODE_CONFIG_DIR not in .bashrc"
  exit 1
fi
if [ ! -f "$ZSHRC" ] || ! grep -q "OPENCODE_CONFIG_DIR" "$ZSHRC"; then
  echo "FAIL: OPENCODE_CONFIG_DIR not in .zshrc"
  exit 1
fi
echo "PASS: both .bashrc and .zshrc contain OPENCODE_CONFIG_DIR"

echo ""
echo "=== E2E: setup PASSED ==="
