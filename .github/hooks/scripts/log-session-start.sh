#!/bin/bash
# log-session-start.sh
# Fired once when a Copilot Coding Agent session begins.

LOG_DIR=".github/hooks/logs"
LOG_FILE="$LOG_DIR/session.log"

mkdir -p "$LOG_DIR"

TIMESTAMP=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
SESSION_ID="${COPILOT_SESSION_ID:-unknown-session}"
REPO="${GITHUB_REPOSITORY:-unknown-repo}"
ACTOR="${GITHUB_ACTOR:-unknown-actor}"
ISSUE="${COPILOT_ISSUE_NUMBER:-N/A}"

echo "[$TIMESTAMP] SESSION STARTED" >> "$LOG_FILE"
echo "  Session ID : $SESSION_ID"    >> "$LOG_FILE"
echo "  Repository : $REPO"          >> "$LOG_FILE"
echo "  Actor      : $ACTOR"         >> "$LOG_FILE"
echo "  Issue #    : $ISSUE"         >> "$LOG_FILE"
echo "  -----------------------------------------------" >> "$LOG_FILE"

echo "Session start logged at $TIMESTAMP (session: $SESSION_ID)"
