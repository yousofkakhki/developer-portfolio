#!/usr/bin/env bash
set -euo pipefail

npm test
npm run lint
npm run build
npm run seo:health
docker compose config --quiet
git diff --check
