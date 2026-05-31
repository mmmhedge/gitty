#!/usr/bin/env bash
#
# mirror_repo.sh — honestly consolidate REAL work onto your central account.
#
# Mirror-clones a source repo (from any account or platform: GitHub, GitLab,
# Bitbucket, a local path...) and pushes ALL of its branches, tags and full
# commit history to a destination repo on your central account. Commit author
# dates are preserved exactly — nothing is fabricated or backdated. This is the
# legitimate way to make work you actually did show up in one place.
#
# Contribution-graph note: a mirrored commit only counts toward your graph if
# its AUTHOR email is verified on your central account. So first add those
# emails under GitHub → Settings → Emails (see docs/consolidation.md).
#
# DO NOT use this to copy private company / org code you aren't permitted to
# redistribute. You don't need to: linking the email + enabling private
# contributions already credits that work without exposing the code.
#
# Usage:
#   scripts/mirror_repo.sh <source-url-or-path> <destination-url>
#
# Example:
#   scripts/mirror_repo.sh \
#     https://gitlab.com/olduser/cool-project.git \
#     https://github.com/your-gh-handle/cool-project.git
#
set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "usage: $0 <source-url-or-path> <destination-url>" >&2
  exit 1
fi

SRC="$1"
DEST="$2"
WORKDIR="$(mktemp -d)"
trap 'rm -rf "$WORKDIR"' EXIT

echo ">> Mirror-cloning $SRC"
git clone --mirror "$SRC" "$WORKDIR/repo.git"

cd "$WORKDIR/repo.git"

echo ">> Author summary (these emails must be verified on your account to count):"
git log --all --format='%aE' | sort | uniq -c | sort -rn

echo ">> Pushing full history to $DEST"
git push --mirror "$DEST"

echo ">> Done. $DEST now has the complete real history of $SRC."
