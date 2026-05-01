#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
SOURCE_DIR="$ROOT_DIR/public/assets/team"
DEST_DIR="$ROOT_DIR/public/assets/people"

if [[ ! -d "$SOURCE_DIR" ]]; then
  echo "Source team images directory not found: $SOURCE_DIR" >&2
  exit 1
fi

mkdir -p "$DEST_DIR"

shopt -s nullglob
images=(
  "$SOURCE_DIR"/*.avif
  "$SOURCE_DIR"/*.gif
  "$SOURCE_DIR"/*.jpg
  "$SOURCE_DIR"/*.jpeg
  "$SOURCE_DIR"/*.png
  "$SOURCE_DIR"/*.svg
  "$SOURCE_DIR"/*.webp
)

if [[ ${#images[@]} -eq 0 ]]; then
  echo "No team images found in: $SOURCE_DIR" >&2
  exit 1
fi

for image in "${images[@]}"; do
  cp "$image" "$DEST_DIR/"
  echo "Synced $(basename "$image")"
done

echo "Team images synced to $DEST_DIR"
