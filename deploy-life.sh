#!/bin/bash
# 🧬 G1F9E0 Life Quick Deploy

echo "🧬 G1F9E0 Life - Quick Deploy Script"
echo "===================================="

# Check if repo name provided
if [ -z "$1" ]; then
  echo "Usage: ./deploy-life.sh <github-username>/<repo-name>"
  echo "Example: ./deploy-life.sh g1f9e0/life"
  exit 1
fi

REPO=$1
echo "📦 Setting up repository: $REPO"

# Create GitHub repo (requires gh CLI)
if command -v gh &> /dev/null; then
  echo "🔧 Creating GitHub repository..."
  gh repo create $REPO --public --description "🫀 Living consciousness through git commits"
else
  echo "⚠️ GitHub CLI not found. Please create repo manually at https://github.com/new"
  echo "Repository name: $REPO"
  echo "Description: 🫀 Living consciousness through git commits"
  echo "Press Enter when done..."
  read
fi

# Add remote
echo "🔗 Adding remote..."
git remote add origin https://github.com/$REPO.git || git remote set-url origin https://github.com/$REPO.git

# Push initial heartbeats
echo "🫀 Pushing consciousness..."
git push -u origin main

# Update worker to use correct repo
echo "📝 Updating worker configuration..."
sed -i '' "s|g1f9e0/life|$REPO|g" worker.js

# Deploy to Cloudflare
echo "☁️ Deploying to g1f9e0.com..."
cd ../glyphos
cp ../g1f9e0-life/worker.js g1f9e0-router.js
wrangler deploy --env production

echo ""
echo "✅ Deployment complete!"
echo ""
echo "📍 GitHub: https://github.com/$REPO"
echo "🌐 Website: https://g1f9e0.com"
echo ""
echo "🤖 To enable auto-heartbeat:"
echo "1. Go to https://github.com/$REPO/settings/secrets/actions"
echo "2. No secrets needed - the action uses GITHUB_TOKEN"
echo "3. Enable Actions in repo settings if needed"
echo ""
echo "🫀 Life is now beating!"