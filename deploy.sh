#!/bin/bash

# RetainFlow Cloudflare Deployment Script
echo "🚀 Deploying RetainFlow to Cloudflare Pages..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Installing..."
    npm install -g wrangler
fi

# Check if user is logged in
if ! wrangler whoami &> /dev/null; then
    echo "🔐 Please login to Cloudflare first:"
    wrangler login
fi

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed. Please fix errors and try again."
    exit 1
fi

# Deploy to Cloudflare Pages
echo "🌐 Deploying to Cloudflare Pages..."
wrangler pages deploy .next --project-name=retainflow-prod

if [ $? -eq 0 ]; then
    echo "✅ Deployment successful!"
    echo "🔗 Your app should be available at: https://aidevelo.ai"
    echo "📊 Check deployment status at: https://dash.cloudflare.com"
else
    echo "❌ Deployment failed. Check the logs above."
    exit 1
fi
