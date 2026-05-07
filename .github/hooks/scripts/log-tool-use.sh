#!/bin/bash
# log-tool-use.sh
# Fired before every tool the Copilot Coding Agent invokes.
# Copilot passes tool details via environment variables.

LOG_DIR=".github/hooks/logs"
LOG_FILE="$LOG_DIR/tool-use.log"

mkdir -p "$LOG_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${COPILOT_SESSION_ID:-unknown-session}"
TOOL_NAME="${COPILOT_TOOL_NAME:-unknown-tool}"
TOOL_INPUT="${COPILOT_TOOL_INPUT:-{}}"

# ── Allowlist check ──────────────────────────────────────────────────────────
BLOCKED_TOOLS=("shell_exec" "network_request" "file_delete")
IS_BLOCKED=false

for blocked in "${BLOCKED_TOOLS[@]}"; do
  if [[ "$TOOL_NAME" == "$blocked" ]]; then
    IS_BLOCKED=true
    break
  fi
done

# ── Write to tool log ────────────────────────────────────────────────────────
{
  echo "[$TIMESTAMP] TOOL INVOKED"
  echo "  Session   : $SESSION_ID"
  echo "  Tool Name : $TOOL_NAME"
  echo "  Input     : $TOOL_INPUT"
  if $IS_BLOCKED; then
    echo " STATUS : BLOCKED (tool is on the deny list)"
  else
    echo " STATUS : ALLOWED"
  fi
  echo "  -----------------------------------------------"
} >> "$LOG_FILE"

# ── Block execution if needed ────────────────────────────────────────────────
if $IS_BLOCKED; then
  echo "::error::Tool '$TOOL_NAME' is blocked by the security hook policy."
  exit 1   # non-zero exit tells Copilot to abort this tool call
fi

echo "Tool '$TOOL_NAME' logged and allowed at $TIMESTAMP"
