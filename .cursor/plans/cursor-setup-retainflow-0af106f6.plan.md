<!-- 0af106f6-70e8-4b89-8da6-9fa76e87cf86 90f2fe5f-9176-4c26-be1e-c57988b8f7eb -->
# RetainFlow: Visual Editor + Full Integrations Implementation

## Phase 1: Visual Editor Enhancement (30 Files)

### 1.1 Export Functionality

- **File: `app/visual-editor/page.tsx`**
- Add Export buttons (HTML/CSS, JSX, Database)
- Implement `handleExportHTML()`, `handleExportJSX()`, `handleSaveToDatabase()`
- LocalStorage → Database sync with Prisma

- **File: `services/editor.service.ts`** (NEW)
- `saveEditorContent(userId, html, css, metadata)`
- `getEditorContent(userId)`
- `exportToJSX(html, css)` - Convert to React component

- **API: `app/api/editor/save/route.ts`** (NEW)
- POST endpoint to save editor content
- Store in new `EditorProject` Prisma model

- **Prisma: `prisma/schema.prisma`**
- Add `EditorProject` model with fields: id, userId, name, html, css, thumbnail, createdAt, updatedAt

### 1.2 RetainFlow Component Library

- **File: `components/editor/blocks/RetainFlowBlocks.tsx`** (NEW)
- Custom GrapesJS blocks for RetainFlow
- Hero Block (with animated RF logo)
- Pricing Card Block (Free/Pro/Growth)
- Testimonial Block
- Integration Card Block
- CTA Button Block

- **File: `app/visual-editor/page.tsx`**
- Integrate custom blocks into GrapesJS `blockManager`
- Add RetainFlow-specific styling presets

### 1.3 Template Library

- **File: `templates/landing-pages.json`** (NEW)
- Pre-built templates: Creator Landing, SaaS Pricing, Retention Page
- JSON structure with HTML/CSS/metadata

- **File: `app/visual-editor/page.tsx`**
- Add "Templates" sidebar
- Load template button → inject into editor
- Template preview thumbnails

- **API: `app/api/templates/route.ts`** (NEW)
- GET `/api/templates` - List all templates
- GET `/api/templates/:id` - Load specific template

## Phase 2: Stripe Integration (15 Files)

### 2.1 Stripe Setup

- **File: `services/stripe.service.ts`** (NEW)
- Initialize Stripe with API key
- `createCheckoutSession(userId, priceId)`
- `createCustomer(email, name)`
- `cancelSubscription(subscriptionId)`
- `updateSubscription(subscriptionId, priceId)`

- **File: `.env.local`**
- Add: `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`

### 2.2 Subscription API

- **API: `app/api/subscriptions/create/route.ts`** (NEW)
- POST - Create checkout session
- Return session URL for redirect

- **API: `app/api/subscriptions/cancel/route.ts`** (NEW)
- POST - Cancel subscription
- Set `cancelAtPeriodEnd: true`

- **API: `app/api/subscriptions/update/route.ts`** (NEW)
- PATCH - Upgrade/downgrade plan

### 2.3 Webhook Handler

- **API: `app/api/webhooks/stripe/route.ts`** (NEW)
- POST - Handle Stripe webhooks
- Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`, `invoice.payment_succeeded`, `invoice.payment_failed`
- Update `Subscription` model in database

### 2.4 Frontend Integration

- **Component: `components/PricingTable.tsx`**
- Wire "Start Free Trial" buttons to Stripe Checkout
- Call `/api/subscriptions/create`

- **Page: `app/billing/page.tsx`** (NEW)
- Subscription management UI
- Cancel, upgrade, view invoices

## Phase 3: Discord Bot Integration (12 Files)

### 3.1 Discord Bot Service

- **File: `automation/discord-bot.ts`** (NEW)
- Initialize Discord Client
- Event handlers: `ready`, `guildMemberAdd`, `messageCreate`, `guildCreate`
- Welcome DM function
- Role assignment function
- Activity tracking (message count)

- **File: `services/discord.service.ts`** (NEW)
- `syncGuild(guildId)` - Sync guild data to DB
- `syncMember(guildId, userId)` - Sync member data
- `trackActivity(userId, guildId)` - Update lastActiveAt, messageCount

### 3.2 Discord API Endpoints

- **API: `app/api/discord/webhook/route.ts`** (NEW)
- POST - Receive Discord events
- Process welcome, role assignment, activity

- **API: `app/api/discord/guilds/route.ts`** (NEW)
- GET - List connected guilds
- POST - Register new guild

- **API: `app/api/discord/members/:guildId/route.ts`** (NEW)
- GET - List guild members with activity

### 3.3 Bot Commands

- **File: `automation/discord-bot.ts`**
- `/retain` - Show retention stats
- `/role` - Assign creator role
- `/help` - Bot commands

### 3.4 Database Sync

- Update `DiscordGuild` and `DiscordMember` models on every event
- Link Discord users to RetainFlow users via `discordId`

## Phase 4: Email Automation (18 Files)

### 4.1 Email Service

- **File: `services/email.service.ts`** (NEW)
- Initialize Resend client
- `sendWelcomeEmail(email, name)`
- `sendOnboardingEmail(email, step)`
- `sendRetentionEmail(email, offerCode)`
- `sendChurnPreventionEmail(email, reason)`
- Log to `EmailLog` model

### 4.2 Email Templates

- **File: `templates/emails/welcome.tsx`** (NEW) - React Email template
- **File: `templates/emails/onboarding.tsx`** (NEW)
- **File: `templates/emails/retention-offer.tsx`** (NEW)
- **File: `templates/emails/churn-prevention.tsx`** (NEW)

### 4.3 Campaign Management

- **API: `app/api/campaigns/create/route.ts`** (NEW)
- POST - Create email campaign
- Save to `EmailCampaign` model

- **API: `app/api/campaigns/:id/send/route.ts`** (NEW)
- POST - Send campaign to user list
- Queue emails via BullMQ

- **API: `app/api/campaigns/:id/stats/route.ts`** (NEW)
- GET - Campaign stats (sent, opened, clicked)

### 4.4 BullMQ Integration

- **File: `automation/queues/email-queue.ts`** (NEW)
- Define `emailQueue` with Redis connection
- Processor: Send email via Resend
- Job data: { to, subject, template, data }

- **File: `automation/workers/email-worker.ts`** (NEW)
- Worker process to handle email jobs
- Retry logic (3 attempts)

### 4.5 Automation Triggers

- **File: `automation/triggers/user-signup.ts`** (NEW)
- On user registration → Queue welcome email

- **File: `automation/triggers/subscription-cancelled.ts`** (NEW)
- On subscription cancel → Queue retention offer email

- **File: `automation/triggers/churn-prediction.ts`** (NEW)
- On high churn score → Queue prevention email

## Phase 5: Whop Integration (10 Files)

### 5.1 Whop Service

- **File: `services/whop.service.ts`** (NEW)
- `getWhopUser(whopId)`
- `syncMembership(whopId, userId)`
- `getMembershipStatus(whopId)`

- **File: `.env.local`**
- Add: `WHOP_API_KEY`, `WHOP_WEBHOOK_SECRET`

### 5.2 Whop Webhook

- **API: `app/api/webhooks/whop/route.ts`** (NEW)
- POST - Handle Whop webhooks
- Events: `membership.created`, `membership.updated`, `payment.succeeded`, `membership.cancelled`
- Update `Subscription` and `User` models

### 5.3 User Sync

- **File: `services/whop.service.ts`**
- `syncUserFromWhop(whopId)` - Create/update RetainFlow user
- Map `whopId` to `User.whopId`

### 5.4 Membership Dashboard

- **Page: `app/integrations/whop/page.tsx`** (NEW)
- Display connected Whop memberships
- Sync button

## Phase 6: Churn Prediction & Retention (8 Files)

### 6.1 Churn Prediction Service

- **File: `services/churn-prediction.service.ts`** (NEW)
- `calculateChurnScore(userId)` - Algorithm based on:
- Last active date (weight: 40%)
- Message count in last 30 days (weight: 30%)
- Subscription cancel attempts (weight: 20%)
- Email open rate (weight: 10%)
- Return score 0-1
- Save to `ChurnPrediction` model

### 6.2 Retention Offer Service

- **File: `services/retention.service.ts`** (NEW)
- `generateOffer(userId, churnReason)` - Create dynamic offer
- Generate unique discount code via Stripe
- Save to `RetentionOffer` model

### 6.3 Cron Jobs

- **File: `automation/cron/churn-prediction.ts`** (NEW)
- Daily cron: Calculate churn scores for all active users
- If score > 0.7 → Queue retention email

- **File: `automation/cron/setup.ts`** (NEW)
- Initialize all cron jobs
- Schedule: `0 2 * * *` (2 AM daily)

### 6.4 Retention API

- **API: `app/api/retention/offers/route.ts`** (NEW)
- GET - List offers for current user
- POST - Apply offer code

- **API: `app/api/churn-predictions/:userId/route.ts`** (NEW)
- GET - Get user's churn score

## Phase 7: Redis & Queue Infrastructure (5 Files)

### 7.1 Redis Setup

- **File: `lib/redis.ts`** (NEW)
- Initialize Redis connection (Upstash or local)
- Export `redisClient`

### 7.2 Queue Configuration

- **File: `automation/queues/index.ts`** (NEW)
- Export all queues: `emailQueue`, `onboardingQueue`, `retentionQueue`

- **File: `automation/workers/index.ts`** (NEW)
- Start all workers
- Run: `node automation/workers/index.ts` in separate process

### 7.3 Upstash Integration

- **File: `.env.local`**
- Add: `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`

## Phase 8: Testing & Deployment (8 Files)

### 8.1 Integration Tests

- **File: `tests/integration/stripe.test.ts`** (NEW)
- Test checkout session creation
- Test webhook processing

- **File: `tests/integration/discord.test.ts`** (NEW)
- Test guild sync
- Test member activity tracking

- **File: `tests/integration/email.test.ts`** (NEW)
- Test email sending
- Test campaign creation

### 8.2 Environment Setup

- **File: `env.production.md`**
- Update with all new environment variables
- Add setup instructions for each service

### 8.3 Deployment

- Build and deploy to Cloudflare Pages
- Verify all webhooks are accessible
- Test each integration in production

## Success Criteria

### Visual Editor

- Export to HTML/CSS, JSX, Database ✓
- RetainFlow component library (5+ blocks) ✓
- Template library (3+ templates) ✓
- Save/Load functionality ✓

### Stripe Integration

- Checkout sessions working ✓
- Webhooks processing correctly ✓
- Subscription CRUD operations ✓
- Billing dashboard functional ✓

### Discord Bot

- Bot online and responding ✓
- Welcome DMs sent automatically ✓
- Activity tracking working ✓
- Guild/member sync complete ✓

### Email Automation

- All templates rendering ✓
- BullMQ queue processing ✓
- Campaign management UI ✓
- Automation triggers firing ✓

### Whop Integration

- Webhooks receiving events ✓
- User sync working ✓
- Membership status accurate ✓

### Churn Prediction

- Scoring algorithm accurate ✓
- Daily cron jobs running ✓
- Retention offers generated ✓
- API endpoints functional ✓

### To-dos

- [ ] Install react-spring for physics-based animations
- [ ] Create ThemeContext with localStorage persistence and useTheme hook
- [ ] Build InteractiveLogo component with drag interaction, pull cord, and physics animations
- [ ] Refactor Header to center large AIDEVELO.AI logo and prepare for dropdown menu
- [ ] Update globals.css with theme CSS variables and animation keyframes
- [ ] Wrap app with ThemeProvider in layout.tsx
- [ ] Add theme support to Hero, PricingTable, and Footer components
- [ ] Copy new AIDEVELO.AI logo to public directory
- [ ] Test pull cord physics, theme toggle, and animations across devices