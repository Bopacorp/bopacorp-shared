#!/usr/bin/env sh

set -eu

root_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
temp_root=$(mktemp -d /tmp/bopacorp-shared-phase6.XXXXXX)
cache_dir="$temp_root/npm-cache"
dry_run_path="$temp_root/dry-run.json"
pack_path="$temp_root/pack.json"

cleanup() {
  rm -rf "$temp_root"
}

trap cleanup EXIT INT TERM
mkdir -p "$cache_dir"

npm_config_cache="$cache_dir" npm pack --dry-run --json > "$dry_run_path"
npm_config_cache="$cache_dir" npm pack --json --pack-destination "$temp_root" > "$pack_path"
node "$root_dir/scripts/verify-package-tarball.mjs" "$dry_run_path" "$pack_path" "$temp_root"

consumer_dir="$temp_root/consumer"

(cd "$consumer_dir" && npm_config_cache="$cache_dir" npm_config_offline=true npm install --ignore-scripts --no-audit --no-fund --package-lock=false)
(cd "$consumer_dir" && node runtime.mjs)
"$root_dir/node_modules/.bin/tsc" -p "$consumer_dir/tsconfig.json" --noEmit --pretty false

printf '%s\n' '{"consumerInstall":"passed","consumerRuntime":"passed","consumerTypecheck":"passed"}'
