# 🔐 OAuth Setup Guide

## 🎯 Aktueller Stand

✅ **OAuth Endpoints implementiert**
✅ **Auth Context erstellt**
✅ **Login/Register Pages aktiviert**
✅ **Database Schema erweitert**

## 📋 Nächste Schritte

### **1. Google OAuth Setup**

#### **Google Cloud Console:**
1. **Projekt erstellen:**
   - Gehe zu: https://console.cloud.google.com/
   - Klicke "New Project"
   - Name: "Retain Flow OAuth"
   - Erstelle das Projekt

2. **OAuth Consent Screen:**
   - Gehe zu "OAuth consent screen"
   - User Type: "External"
   - App Name: "Retain Flow"
   - User Support Email: deine Email
   - Developer Contact: deine Email
   - Scopes: `email`, `profile`, `openid`

3. **Credentials erstellen:**
   - Gehe zu "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
   - Application type: "Web application"
   - Name: "Retain Flow Web Client"
   - Authorized redirect URIs:
     ```
     https://retain-flow-new.pages.dev/api/auth/oauth/google/callback
     ```
   - Erstelle die Credentials

4. **Client ID & Secret kopieren:**
   - Kopiere die `Client ID` und `Client Secret`
   - Speichere sie sicher

### **2. Discord OAuth Setup**

#### **Discord Developer Portal:**
1. **Application erstellen:**
   - Gehe zu: https://discord.com/developers/applications
   - Klicke "New Application"
   - Name: "Retain Flow"
   - Erstelle die Application

2. **OAuth2 konfigurieren:**
   - Gehe zu "OAuth2" → "General"
   - Redirects hinzufügen:
     ```
     https://retain-flow-new.pages.dev/api/auth/oauth/discord/callback
     ```
   - Scopes: `identify`, `email`

3. **Client ID & Secret kopieren:**
   - Kopiere die `Client ID` und `Client Secret`
   - Speichere sie sicher

### **3. Environment Variables hinzufügen**

#### **Cloudflare Pages:**
1. **Gehe zu Cloudflare Dashboard:**
   - https://dash.cloudflare.com/pages/retain-flow-new
   - Settings → Environment Variables

2. **Production Environment Variables hinzufügen:**
   ```bash
   GOOGLE_CLIENT_ID=deine_google_client_id
   GOOGLE_CLIENT_SECRET=dein_google_client_secret
   DISCORD_CLIENT_ID=deine_discord_client_id
   DISCORD_CLIENT_SECRET=dein_discord_client_secret
   ```

3. **Preview Environment (optional):**
   - Gleiche Variablen für Preview Environment

#### **GitHub Secrets:**
1. **Gehe zu GitHub Repository:**
   - https://github.com/keokukzh/Retain-Flow/settings/secrets/actions

2. **Neue Secrets hinzufügen:**
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `DISCORD_CLIENT_ID`
   - `DISCORD_CLIENT_SECRET`

### **4. Database Migration**

#### **Prisma Schema aktualisieren:**
```bash
# Lokal ausführen
npx prisma migrate dev --name add-oauth-fields

# Oder direkt in Cloudflare
npx prisma migrate deploy
```

### **5. Testing**

#### **OAuth URLs testen:**
```bash
# Google OAuth Start
curl https://retain-flow-new.pages.dev/api/auth/oauth/google/start

# Discord OAuth Start
curl https://retain-flow-new.pages.dev/api/auth/oauth/discord/start
```

#### **Login Page testen:**
1. Gehe zu: https://retain-flow-new.pages.dev/login
2. Klicke "Continue with Google"
3. Klicke "Continue with Discord"
4. Teste Email/Password Login

## 🔗 Wichtige Links

### **OAuth Setup:**
- **Google Cloud Console:** https://console.cloud.google.com/
- **Discord Developer Portal:** https://discord.com/developers/applications
- **Neon Database:** https://console.neon.tech/

### **Deployment:**
- **Cloudflare Pages:** https://dash.cloudflare.com/pages/retain-flow-new
- **GitHub Actions:** https://github.com/keokukzh/Retain-Flow/actions
- **Live Site:** https://retain-flow-new.pages.dev

### **Testing:**
- **Login Page:** https://retain-flow-new.pages.dev/login
- **Register Page:** https://retain-flow-new.pages.dev/register
- **Dashboard:** https://retain-flow-new.pages.dev/dashboard

## ✅ Erfolgs-Kriterien

1. **Google OAuth funktioniert** ✅
2. **Discord OAuth funktioniert** ✅
3. **Email/Password Login funktioniert** ✅
4. **User Registration funktioniert** ✅
5. **Dashboard zeigt User-Daten** ✅
6. **Protected Routes funktionieren** ✅
7. **Database Operationen erfolgreich** ✅
8. **Keine Console Errors** ✅

## 🚨 Troubleshooting

### **Häufige Probleme:**

1. **"Invalid redirect URI"**
   - Prüfe die Redirect URIs in Google/Discord Console
   - Stelle sicher, dass die URLs exakt übereinstimmen

2. **"Client ID not found"**
   - Prüfe die Environment Variables in Cloudflare
   - Stelle sicher, dass die Secrets korrekt sind

3. **"Database connection failed"**
   - Prüfe die DATABASE_URL in Cloudflare
   - Führe `npx prisma migrate deploy` aus

4. **"JWT token invalid"**
   - Prüfe die JWT_SECRET in Cloudflare
   - Stelle sicher, dass der Secret stark genug ist

### **Debug Commands:**
```bash
# Lokal testen
npm run dev

# Build testen
npm run pages:build

# Deploy testen
npm run pages:deploy
```

## 📞 Support

Bei Problemen:
1. Prüfe die Console Logs in Cloudflare
2. Prüfe die GitHub Actions Logs
3. Teste die OAuth URLs direkt
4. Prüfe die Database Connection

**Happy Coding! 🚀**
