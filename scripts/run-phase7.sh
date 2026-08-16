#!/usr/bin/env sh

set -eu

started_at=$(date +%s)
evidence_generated=false

finish() {
  exit_code=$?
  ended_at=$(date +%s)
  duration_seconds=$((ended_at - started_at))
  if [ "$evidence_generated" = false ]; then
    gate_status=failed
    if [ "$exit_code" -eq 0 ]; then
      gate_status=passed
    fi
    QUALITY_GATE_STATUS="$gate_status" QUALITY_GATE_DURATION_SECONDS="$duration_seconds" npm run test:evidence || true
  fi
  trap - EXIT
  exit "$exit_code"
}

trap finish EXIT

npm run check
npm run test:run
npm run test:typecheck
npm run test:coverage
npm run build
npm run test:artifact
npm run test:typelevel
npm run test:package

ended_at=$(date +%s)
duration_seconds=$((ended_at - started_at))
QUALITY_GATE_STATUS=passed QUALITY_GATE_DURATION_SECONDS="$duration_seconds" npm run test:evidence
evidence_generated=true
