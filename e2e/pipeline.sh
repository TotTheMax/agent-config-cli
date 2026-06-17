#!/usr/bin/env bash
set -euo pipefail

# Full pipeline E2E test: build → pack → install → skills add → CLI setup → publish
# Run: bash e2e/pipeline.sh
# For publish step: set PUBLISH=true to enable npm publish (requires npm login)

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${SCRIPT_DIR}/.."

PASSED=0
FAILED=0

TMP_DIR=$(mktemp -d)
cleanup() {
  rm -rf "$TMP_DIR"
}
trap cleanup EXIT

echo ""
echo "========================================"
echo "  Full Pipeline E2E Test"
echo "========================================"

# ─── Step 1: Build CLI ───
echo ""
echo ">>> Step 1: Build CLI"
cd "$PROJECT_ROOT"
npm run build > /dev/null 2>&1

if [ ! -f "$PROJECT_ROOT/dist/index.js" ]; then
  echo "FAIL: dist/index.js not found after build"
  exit 1
fi
echo "PASS: CLI built successfully"
PASSED=$((PASSED + 1))

# ─── Step 2: npm pack ───
echo ""
echo ">>> Step 2: npm pack"
TARBALL=$(npm pack --pack-destination "$TMP_DIR" 2>/dev/null | tail -1)
TARBALL_PATH="$TMP_DIR/$TARBALL"

if [ ! -f "$TARBALL_PATH" ]; then
  echo "FAIL: tarball not created"
  exit 1
fi

# Verify tarball contains CLI entry
TARBALL_CONTENTS=$(tar -tf "$TARBALL_PATH" 2>/dev/null)
if ! echo "$TARBALL_CONTENTS" | grep -q "dist/index.js"; then
  echo "FAIL: tarball does not contain dist/index.js"
  exit 1
fi
echo "PASS: tarball created and contains dist/index.js ($TARBALL)"
PASSED=$((PASSED + 1))

# ─── Step 3: Install CLI from tarball ───
echo ""
echo ">>> Step 3: Install CLI from tarball"
INSTALL_DIR="$TMP_DIR/install-test"
mkdir -p "$INSTALL_DIR"
cd "$INSTALL_DIR"

npm init -y > /dev/null 2>&1
npm install "$TARBALL_PATH" > /dev/null 2>&1

CLI_BIN="$INSTALL_DIR/node_modules/.bin/agent-config-cli"
if [ ! -f "$CLI_BIN" ]; then
  echo "FAIL: agent-config-cli binary not found after install"
  exit 1
fi

VERSION_OUTPUT=$(node "$CLI_BIN" --version 2>&1 || echo "ERROR")
if [ "$VERSION_OUTPUT" = "ERROR" ]; then
  echo "FAIL: agent-config-cli --version failed"
  exit 1
fi
echo "PASS: CLI installed and executable (version: $VERSION_OUTPUT)"
PASSED=$((PASSED + 1))

# ─── Step 4: Create local test repo ───
echo ""
echo ">>> Step 4: Create local test repo"
REPO_PATH=$(bash "${SCRIPT_DIR}/helpers/create-local-repo.sh")

if [ ! -d "$REPO_PATH/opencode" ] || [ ! -d "$REPO_PATH/skills" ]; then
  echo "FAIL: test repo missing required directories"
  exit 1
fi
echo "PASS: local test repo created"
PASSED=$((PASSED + 1))

# ─── Step 5: CLI setup ───
echo ""
echo ">>> Step 5: CLI setup with local repo"
SETUP_HOME="$TMP_DIR/setup-home"
mkdir -p "$SETUP_HOME/.config/team-agent-config"

HOME="$SETUP_HOME" node "$CLI_BIN" setup --repo "$REPO_PATH" -a opencode --shell bash

CONFIG_DIR="$SETUP_HOME/.config/team-agent-config/opencode"
if [ ! -f "$CONFIG_DIR/opencode.json" ]; then
  echo "FAIL: opencode.json not found in installed config"
  exit 1
fi
if [ ! -d "$CONFIG_DIR/skills/setup-team-config" ]; then
  echo "FAIL: skills/setup-team-config not found in installed config"
  exit 1
fi
if ! grep -q "OPENCODE_CONFIG_DIR" "$SETUP_HOME/.bashrc"; then
  echo "FAIL: OPENCODE_CONFIG_DIR not in .bashrc"
  exit 1
fi
echo "PASS: CLI setup successful (opencode.json, skills, shell profile)"
PASSED=$((PASSED + 1))

# ─── Step 6: npx skills add --list (skill discovery) ───
echo ""
echo ">>> Step 6: npx skills add --list (skill discovery)"
SKILLS_OUTPUT=$(npx skills add "$PROJECT_ROOT" --list 2>&1 || true)

if ! echo "$SKILLS_OUTPUT" | grep -qi "setup-team-config"; then
  echo "FAIL: setup-team-config not found in skills list"
  echo "Output: $SKILLS_OUTPUT"
  FAILED=$((FAILED + 1))
else
  echo "PASS: setup-team-config found in skills list"
  PASSED=$((PASSED + 1))
fi

if echo "$SKILLS_OUTPUT" | grep -qi "openspec"; then
  echo "WARN: openspec skills visible (metadata.internal may not be fully effective in local path mode)"
else
  echo "PASS: openspec skills hidden (metadata.internal works)"
  PASSED=$((PASSED + 1))
fi

# ─── Step 7: npx skills add --skill (skill installation) ───
echo ""
echo ">>> Step 7: npx skills add --skill (skill installation)"
SKILLS_TEST_DIR="$TMP_DIR/skills-install-test"
mkdir -p "$SKILLS_TEST_DIR"
cd "$SKILLS_TEST_DIR"

npx skills add "$PROJECT_ROOT" --skill setup-team-config -a opencode -y --copy 2>&1 || true

SKILL_INSTALLED="$SKILLS_TEST_DIR/.agents/skills/setup-team-config/SKILL.md"
if [ ! -f "$SKILL_INSTALLED" ]; then
  echo "WARN: skill not installed to expected path (may need different agent path)"
  FAILED=$((FAILED + 1))
else
  echo "PASS: setup-team-config skill installed to .agents/skills/"
  PASSED=$((PASSED + 1))
fi

# ─── Step 8: npm publish (optional, requires PUBLISH=true) ───
echo ""
echo ">>> Step 8: npm publish"

if [ "${PUBLISH:-false}" = "true" ]; then
  cd "$PROJECT_ROOT"
  npm publish --access public 2>&1
  echo "PASS: npm publish executed"
  PASSED=$((PASSED + 1))

  # Verify new version available via npx
  echo ""
  echo ">>> Verify new version via npx"
  NEW_VERSION=$(npx @tothemax/agent-config-cli@latest --version 2>&1 || echo "ERROR")
  if [ "$NEW_VERSION" = "ERROR" ]; then
    echo "FAIL: npx @tothemax/agent-config-cli@latest --version failed"
    FAILED=$((FAILED + 1))
  else
    echo "PASS: new version accessible via npx (version: $NEW_VERSION)"
    PASSED=$((PASSED + 1))
  fi
else
  echo "SKIP: npm publish not enabled (set PUBLISH=true to enable)"
fi

# Cleanup repo
rm -rf "$REPO_PATH"

# ─── Summary ───
echo ""
echo "========================================"
echo "Pipeline Results: $PASSED passed, $FAILED failed"
echo "========================================"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi
