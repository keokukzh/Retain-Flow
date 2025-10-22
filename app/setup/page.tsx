'use client';

import React, { useState } from 'react';

export default function SetupPage() {
  const [credentials, setCredentials] = useState({
    googleClientId: '',
    googleClientSecret: '',
    discordClientId: '',
    discordClientSecret: '',
    jwtSecret: '',
    publicUrl: 'https://e30251a6.retainflow-prod.pages.dev'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const envVars = `
# Copy these environment variables to Cloudflare Pages → Project Settings → Environment Variables

# Google OAuth
GOOGLE_CLIENT_ID=${credentials.googleClientId}
GOOGLE_CLIENT_SECRET=${credentials.googleClientSecret}

# Discord OAuth  
DISCORD_CLIENT_ID=${credentials.discordClientId}
DISCORD_CLIENT_SECRET=${credentials.discordClientSecret}

# JWT & URL
JWT_SECRET=${credentials.jwtSecret}
PUBLIC_URL=${credentials.publicUrl}

# Stripe (get from your Stripe dashboard)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_ee2e5b786174555d01b1c457305ae593dbbeca52d23075a3c111fc3c99765495
STRIPE_PRICE_ID_PRO_MONTHLY=price_your_monthly_price_id
STRIPE_PRICE_ID_PRO_YEARLY=price_your_yearly_price_id
`;

    // Copy to clipboard
    navigator.clipboard.writeText(envVars);
    alert('Environment variables copied to clipboard! Paste them in Cloudflare Pages settings.');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">OAuth Setup</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Client ID
              </label>
              <input
                type="text"
                value={credentials.googleClientId}
                onChange={(e) => setCredentials({...credentials, googleClientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Get from https://console.developers.google.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Google Client Secret
              </label>
              <input
                type="password"
                value={credentials.googleClientSecret}
                onChange={(e) => setCredentials({...credentials, googleClientSecret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Get from Google Console"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discord Client ID
              </label>
              <input
                type="text"
                value={credentials.discordClientId}
                onChange={(e) => setCredentials({...credentials, discordClientId: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Get from https://discord.com/developers/applications"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Discord Client Secret
              </label>
              <input
                type="password"
                value={credentials.discordClientSecret}
                onChange={(e) => setCredentials({...credentials, discordClientSecret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Get from Discord Developer Portal"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                JWT Secret
              </label>
              <input
                type="text"
                value={credentials.jwtSecret}
                onChange={(e) => setCredentials({...credentials, jwtSecret: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Generate a random secret key"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Public URL
              </label>
              <input
                type="text"
                value={credentials.publicUrl}
                onChange={(e) => setCredentials({...credentials, publicUrl: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Your domain URL"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Generate Environment Variables
            </button>
          </form>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-2">Setup Instructions:</h3>
            <ol className="text-sm text-yellow-700 space-y-1">
              <li>1. Get OAuth credentials from Google Console and Discord Developer Portal</li>
              <li>2. Fill in the form above</li>
              <li>3. Click "Generate Environment Variables"</li>
              <li>4. Go to Cloudflare Pages → Your Project → Settings → Environment Variables</li>
              <li>5. Add each variable from the generated list</li>
              <li>6. Redeploy your project</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}
