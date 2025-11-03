#!/usr/bin/env bash
set -euo pipefail

if [ $# -lt 1 ]; then
  echo "uso: ./scripts/bootstrap-repo.sh <github-user-or-org>/<repo-name>"
  exit 1
fi

REPO="$1"
DEFAULT_BRANCH="main"

git init
git add .
git commit -m "chore: initial commit"
git branch -M "$DEFAULT_BRANCH"
git remote add origin "https://github.com/$REPO.git"
git push -u origin "$DEFAULT_BRANCH"

# Atualiza badges do README
if command -v sed >/dev/null 2>&1; then
  sed -i.bak "s|USER/REPO|$REPO|g" README.md || true
  rm -f README.md.bak
fi

echo "✅ Repo $REPO enviado. Atualizei os badges no README."
