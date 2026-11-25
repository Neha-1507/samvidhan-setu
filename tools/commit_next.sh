#!/usr/bin/env bash
# Commits the next N planned changes, one file per commit.
# Usage:  tools/commit_next.sh        (next 1)
#         tools/commit_next.sh 5      (next 5)
#         tools/commit_next.sh status (show what is left)
# Plan:   COMMIT_PLAN.txt, one line each:  path|commit message
set -euo pipefail
cd "$(git rev-parse --show-toplevel)"

PLAN="COMMIT_PLAN.txt"
STAGE=$(sed -n 's/^# stage:[[:space:]]*//p' "$PLAN" | head -1)
PROGRESS=".commit_progress_${STAGE:-default}"
mapfile -t LINES < <(grep -v -e '^[[:space:]]*#' -e '^[[:space:]]*$' "$PLAN")
total=${#LINES[@]}
done_count=$(cat "$PROGRESS" 2>/dev/null || echo 0)

if [[ "${1:-1}" == "status" ]]; then
  echo "done $done_count of $total"
  for ((i = done_count; i < total; i++)); do echo "  next: ${LINES[i]%%|*}"; done | head -5
  exit 0
fi

count="${1:-1}"
made=0
while ((made < count && done_count < total)); do
  line="${LINES[done_count]}"
  path="${line%%|*}"
  msg="${line#*|}"
  if [[ ! -e "$path" ]]; then
    echo "missing file: $path (copy it into the repo first)"; exit 1
  fi
  if [[ -z "$(git status --porcelain -- "$path")" ]]; then
    echo "skip (no changes, already committed?): $path"
  else
    git add -- "$path"
    git commit -q -m "$msg"
    echo "committed: $msg"
    made=$((made + 1))
  fi
  done_count=$((done_count + 1))
  echo "$done_count" > "$PROGRESS"
done
echo "progress: $done_count of $total"
