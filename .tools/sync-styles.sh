#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/styles"
DEST_DIR="$ROOT_DIR/blog/public/styles"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source styles directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

shopt -s nullglob
stylesheets=("$SOURCE_DIR"/*.css)

if [[ ${#stylesheets[@]} -eq 0 ]]; then
  echo "No stylesheets found in: $SOURCE_DIR" >&2
  exit 1
fi

for stylesheet in "${stylesheets[@]}"; do
  cp "$stylesheet" "$DEST_DIR/"
  echo "Synced $(basename "$stylesheet")"
done

echo "Styles synced to $DEST_DIR"
