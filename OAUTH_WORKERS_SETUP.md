# 🔐 OAuth Workers Setup Guide

## 🎯 **Problem gelöst:**

**Cloudflare Pages unterstützt keine Next.js API Routes!** 

Daher implementieren wir OAuth als separate Cloudflare Workers.

## 🚀 **Setup OAuth Workers**

### **1. Workers deployen**

```bash
# Google OAuth Worker
wrangler deploy workers/oauth-google.js --config wrangler-oauth.toml

# Discord OAuth Worker  
wrangler deploy workers/oauth-discord.js --config wrangler-oauth.toml
```

### **2. Environment Variables setzen**

```bash
# Google OAuth
wrangler secret put GOOGLE_CLIENT_ID
wrangler secret put GOOGLE_CLIENT_SECRET

# Discord OAuth
wrangler secret put DISCORD_CLIENT_ID
wrangler secret put DISCORD_CLIENT_SECRET

# JWT Secret
wrangler secret put JWT_SECRET
```

### **3. KV Namespace erstellen**

```bash
# OAuth States KV
wrangler kv:namespace create "OAUTH_STATES"
wrangler kv:namespace create "OAUTH_STATES" --preview
```

### **4. wrangler-oauth.toml aktualisieren**

```toml
# KV Namespace IDs aus wrangler kv:namespace list
[[kv_namespaces]]
binding = "OAUTH_STATES"
id = "your-actual-kv-id"
preview_id = "your-actual-preview-kv-id"
```

## 🔗 **OAuth URLs**

Nach dem Deploy:

- **Google OAuth:** `https://retain-flow-oauth.your-subdomain.workers.dev/oauth/google/start`
- **Discord OAuth:** `https://retain-flow-oauth.your-subdomain.workers.dev/oauth/discord/start`

## 📋 **Frontend Integration**

### **Login Page URLs aktualisieren:**

```tsx
// Google OAuth Button
<a href="https://retain-flow-oauth.your-subdomain.workers.dev/oauth/google/start">
  Continue with Google
</a>

// Discord OAuth Button  
<a href="https://retain-flow-oauth.your-subdomain.workers.dev/oauth/discord/start">
  Continue with Discord
</a>
```

## 🧪 **Testing**

### **1. OAuth Workers testen:**

```bash
# Google OAuth Start
curl https://retain-flow-oauth.your-subdomain.workers.dev/oauth/google/start

# Discord OAuth Start
curl https://retain-flow-oauth.your-subdomain.workers.dev/oauth/discord/start
```

### **2. OAuth Flow testen:**

1. **Login Page:** https://retain-flow-new.pages.dev/login
2. **Klicke "Continue with Google"**
3. **Klicke "Continue with Discord"**
4. **Teste Email/Password Login**

## 🔧 **Worker Configuration**

### **wrangler-oauth.toml:**

```toml
name = "retain-flow-oauth"
main = "workers/oauth-google.js"
compatibility_date = "2024-10-01"
compatibility_flags = ["nodejs_compat"]

[vars]
PUBLIC_URL = "https://retain-flow-new.pages.dev"

[[kv_namespaces]]
binding = "OAUTH_STATES"
id = "your-kv-id"
preview_id = "your-preview-kv-id"
```

## 📦 **Benötigte Secrets**

### **Cloudflare Workers Secrets:**

```bash
# OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
DISCORD_CLIENT_ID=your_discord_client_id
DISCORD_CLIENT_SECRET=your_discord_client_secret

# JWT
JWT_SECRET=your_jwt_secret

# URLs
PUBLIC_URL=https://retain-flow-new.pages.dev
```

## ✅ **Erfolgs-Kriterien**

1. **OAuth Workers deployed** ✅
2. **OAuth URLs funktionieren** ✅
3. **Google OAuth Flow funktioniert** ✅
4. **Discord OAuth Flow funktioniert** ✅
5. **Frontend Integration funktioniert** ✅
6. **Database Integration funktioniert** ✅

## 🚨 **Troubleshooting**

### **Häufige Probleme:**

1. **"Worker not found"**
   - Prüfe Worker URL
   - Prüfe wrangler.toml Konfiguration

2. **"Invalid client ID"**
   - Prüfe OAuth Credentials in Google/Discord Console
   - Prüfe Redirect URIs

3. **"KV namespace not found"**
   - Erstelle KV Namespace
   - Aktualisiere wrangler-oauth.toml

4. **"Database connection failed"**
   - Prüfe DATABASE_URL in Workers
   - Prüfe Prisma Konfiguration

### **Debug Commands:**

```bash
# Worker Logs
wrangler tail

# KV Namespace
wrangler kv:key list --namespace-id=your-kv-id

# Worker Status
wrangler whoami
```

## 🎉 **Nächste Schritte**

1. **OAuth Workers deployen**
2. **OAuth Credentials konfigurieren**
3. **Frontend URLs aktualisieren**
4. **OAuth Flow testen**
5. **Database Integration vervollständigen**

**Happy OAuth! 🚀**
