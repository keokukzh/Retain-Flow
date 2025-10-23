# Cloudflare Pages Environment Variables Setup

## Discord Bot Token hinzufügen

1. **Gehe zu Cloudflare Dashboard**
   - URL: https://dash.cloudflare.com/
   - Login mit deinem Account

2. **Navigiere zu Pages**
   - Klicke auf "Pages" im linken Menü
   - Wähle dein Projekt "retain-flow-new"

3. **Environment Variables hinzufügen**
   - Klicke auf "Settings" Tab
   - Scrolle runter zu "Environment Variables"
   - Klicke "Add variable"

4. **Discord Bot Token konfigurieren**
   ```
   Name: DISCORD_BOT_TOKEN
   Value: [YOUR_DISCORD_BOT_TOKEN_HERE]
   ```

5. **Weitere Environment Variables hinzufügen**
   ```
   Name: DATABASE_URL
   Value: [Deine Neon PostgreSQL URL]
   
   Name: JWT_SECRET
   Value: [Dein JWT Secret]
   
   Name: STRIPE_API_KEY
   Value: [Dein Stripe Secret Key]
   
   Name: STRIPE_PUBLISHABLE_KEY
   Value: [Dein Stripe Publishable Key]
   ```

6. **Save & Redeploy**
   - Klicke "Save" für alle Environment Variables
   - Gehe zu "Deployments" Tab
   - Klicke "Retry deployment" für das neueste Deployment

## Wichtige Environment Variables

### Database
- `DATABASE_URL` - Neon PostgreSQL Connection String
- `DIRECT_DATABASE_URL` - Direct Database Connection (optional)

### Authentication
- `JWT_SECRET` - 32+ character random string for JWT signing

### Discord
- `DISCORD_BOT_TOKEN` - Discord Bot Token (bereits konfiguriert)
- `DISCORD_CLIENT_ID` - Discord Application Client ID
- `DISCORD_CLIENT_SECRET` - Discord Application Client Secret

### Stripe
- `STRIPE_API_KEY` - Stripe Secret Key (sk_live_... oder sk_test_...)
- `STRIPE_PUBLISHABLE_KEY` - Stripe Publishable Key (pk_live_... oder pk_test_...)
- `STRIPE_WEBHOOK_SECRET` - Stripe Webhook Secret (whsec_...)

### Email Service
- `EMAIL_SERVICE_API_KEY` - Resend API Key (re_...)
- `FROM_EMAIL` - Sender Email Address

### Application
- `NEXTAUTH_URL` - Application URL (https://retain-flow-new.pages.dev)
- `NEXTAUTH_SECRET` - NextAuth Secret

## Nach dem Setup

1. **Redeploy das Projekt**
   - Gehe zu "Deployments" Tab
   - Klicke "Retry deployment" für das neueste Deployment

2. **Teste die API Endpoints**
   ```bash
   curl https://retain-flow-new.pages.dev/api/dashboard/stats
   curl https://retain-flow-new.pages.dev/api/churn-predictions
   curl https://retain-flow-new.pages.dev/api/integrations/status
   ```

3. **Teste das Dashboard**
   - Gehe zu https://retain-flow-new.pages.dev/dashboard
   - Login mit Email/Password
   - Überprüfe Dashboard Statistiken

## Troubleshooting

### API Routes geben 404 zurück
- Überprüfe dass alle Environment Variables gesetzt sind
- Redeploy das Projekt nach dem Hinzufügen der Variables
- Überprüfe Cloudflare Functions Logs

### Discord Bot funktioniert nicht
- Überprüfe DISCORD_BOT_TOKEN ist korrekt
- Überprüfe Bot Permissions in Discord Developer Portal
- Überprüfe Bot ist in Guilds eingeladen

### Database Connection Fehler
- Überprüfe DATABASE_URL ist korrekt
- Überprüfe Neon Database ist aktiv
- Überprüfe Prisma Schema ist deployed
