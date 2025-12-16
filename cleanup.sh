#!/bin/bash

# Cleanup script for VPS - Removes temporary and unnecessary files
# Run with: bash cleanup.sh

set -e

echo "🧹 Starting cleanup process..."

# 1. Clean Docker
echo "📦 Cleaning Docker..."
docker system prune -af --volumes 2>/dev/null || echo "Docker cleanup skipped"
docker image prune -af 2>/dev/null || echo "Docker images cleanup skipped"
docker builder prune -af 2>/dev/null || echo "Docker builder cleanup skipped"

# 2. Clean temporary files
echo "🗑️  Cleaning temporary files..."
rm -rf /tmp/* /var/tmp/* 2>/dev/null || echo "Temp cleanup skipped"
find /root -name "*.log" -type f -delete 2>/dev/null || echo "Log cleanup skipped"
find /root -name "*.tmp" -type f -delete 2>/dev/null || echo "Tmp files cleanup skipped"

# 3. Clean npm cache
echo "📦 Cleaning npm cache..."
npm cache clean --force 2>/dev/null || echo "NPM cache cleanup skipped"

# 4. Clean project build artifacts
echo "🏗️  Cleaning build artifacts..."
cd /root/Projects/kakhk.ir/developer-portfolio 2>/dev/null || exit
rm -rf .next 2>/dev/null || echo ".next cleanup skipped"
rm -rf node_modules/.cache 2>/dev/null || echo "node_modules cache cleanup skipped"
rm -rf .turbo 2>/dev/null || echo ".turbo cleanup skipped"

# 5. Clean old Docker images (keep only latest)
echo "🐳 Cleaning old Docker images..."
docker images --format "{{.Repository}}:{{.Tag}}" | grep -E "(portfolio|developer-portfolio)" | grep -v latest | xargs -r docker rmi 2>/dev/null || echo "Old images cleanup skipped"

# 6. Clean package manager caches
echo "📚 Cleaning package manager caches..."
apt-get clean 2>/dev/null || echo "apt-get clean skipped"
apt-get autoclean 2>/dev/null || echo "apt-get autoclean skipped"

# 7. Show disk usage
echo ""
echo "💾 Disk usage after cleanup:"
df -h / | tail -1

echo ""
echo "✅ Cleanup complete!"

