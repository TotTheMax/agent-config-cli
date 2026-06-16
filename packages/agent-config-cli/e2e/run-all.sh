#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

PASSED=0
FAILED=0

run_test() {
  local name="$1"
  local script="$2"
  echo ""
  echo ">>> Running: $name"
  if bash "$script"; then
    PASSED=$((PASSED + 1))
    echo ">>> $name: PASSED"
  else
    FAILED=$((FAILED + 1))
    echo ">>> $name: FAILED"
  fi
}

run_test "setup" "$SCRIPT_DIR/setup.sh"
run_test "update" "$SCRIPT_DIR/update.sh"

echo ""
echo "========================================"
echo "E2E Results: $PASSED passed, $FAILED failed"
echo "========================================"

if [ "$FAILED" -gt 0 ]; then
  exit 1
fi