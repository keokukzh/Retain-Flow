# Chatwoot Live Support Setup

## Overview

Chatwoot is an open-source customer engagement platform that provides live chat, email support, and help desk functionality. This integration enables RetainFlow to offer real-time customer support and automatically create support tickets for at-risk users.

## Prerequisites

- Chatwoot instance (cloud or self-hosted)
- Admin access to Chatwoot
- API access enabled

## Installation

### 1. Set up Chatwoot Instance

#### Option A: Chatwoot Cloud
1. Sign up at [Chatwoot Cloud](https://app.chatwoot.com)
2. Create a new account
3. Set up your inbox and team

#### Option B: Self-hosted
```bash
# Using Docker Compose
version: '3.8'
services:
  chatwoot:
    image: chatwoot/chatwoot:latest
    restart: always
    ports:
      - "3000:3000"
    environment:
      - RAILS_ENV=production
      - SECRET_KEY_BASE=your_secret_key
      - FRONTEND_URL=https://your-domain.com
      - DATABASE_URL=postgresql://user:password@db:5432/chatwoot
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTGRES_DB=chatwoot
      - POSTGRES_USER=chatwoot
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:6-alpine
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

### 2. Configure API Access

1. Go to Settings → Applications
2. Create a new application
3. Generate API token
4. Note the token for configuration

### 3. Set up Website Widget

1. Go to Settings → Inboxes
2. Create a new Website inbox
3. Copy the website token
4. Configure widget settings

### 4. Configure RetainFlow

Add the following environment variables:

```bash
# Chatwoot Configuration
CHATWOOT_API_URL=https://app.chatwoot.com
CHATWOOT_API_TOKEN=your_api_token
NEXT_PUBLIC_CHATWOOT_WEBSITE_TOKEN=your_website_token
```

## Usage

### Live Chat Widget

The integration automatically adds a live chat widget to your application:

```tsx
import { ChatWidget } from '@/components/support/ChatWidget';

// Widget is automatically included in layout
// No additional setup required
```

### API Endpoints

#### Create Conversation
```bash
POST /api/integrations/chatwoot/conversations
{
  "userId": "user_123",
  "message": "I need help with my subscription",
  "priority": "high"
}
```

#### Sync User Data
```bash
POST /api/integrations/chatwoot/contacts/sync
{
  "userId": "user_123",
  "email": "user@example.com",
  "name": "John Doe",
  "customAttributes": {
    "plan": "pro",
    "churn_risk": "high"
  }
}
```

#### Webhook Handler
```bash
POST /api/integrations/chatwoot/webhook
```

## Use Cases

### 1. Proactive Support

Automatically create support tickets for at-risk users:

```javascript
// When churn risk is detected
await ChatwootService.createConversation(
  userId,
  `User ${userId} has high churn risk (${churnScore}). Please reach out with retention offer.`
);
```

### 2. User Context

Sync user data to provide context to support agents:

```javascript
// Sync user information
await ChatwootService.syncUser(userId, {
  email: user.email,
  name: user.name,
  plan: user.subscription.plan,
  churnScore: churnScore,
  lastActive: user.lastActiveAt
});
```

### 3. Automated Responses

Set up automated responses for common queries:

```javascript
// Handle common questions
const responses = {
  'billing': 'I can help you with billing questions. Let me check your account...',
  'features': 'Here are the features available in your plan...',
  'cancellation': 'I understand you\'re considering cancellation. Let me offer you a special deal...'
};
```

## Widget Configuration

### Customization Options

```javascript
// Widget configuration
const widgetConfig = {
  launcherTitle: 'Need Help?',
  launcherMessage: 'Chat with our support team',
  position: 'bottom-right',
  theme: 'light',
  customAttributes: {
    userId: user.id,
    plan: user.subscription.plan,
    churnRisk: churnScore
  }
};
```

### Conditional Display

```tsx
// Show widget only for logged-in users
{user && <ChatWidget />}

// Show widget only for specific pages
{pathname === '/dashboard' && <ChatWidget />}
```

## Best Practices

### Support Workflow

1. **Tier 1 Support**
   - Automated responses for common questions
   - Basic troubleshooting guides
   - Escalation to human agents

2. **Tier 2 Support**
   - Complex technical issues
   - Account modifications
   - Retention conversations

3. **Tier 3 Support**
   - Billing disputes
   - Account cancellations
   - Special requests

### User Experience

- Provide quick response times
- Use proactive messaging for at-risk users
- Maintain conversation history
- Follow up on resolved issues

### Analytics

Track support metrics:
- Response time
- Resolution time
- Customer satisfaction
- Escalation rates

## Troubleshooting

### Common Issues

1. **Widget not loading**
   - Check website token configuration
   - Verify domain settings in Chatwoot
   - Check browser console for errors

2. **API authentication errors**
   - Verify API token is correct
   - Check token permissions
   - Ensure API access is enabled

3. **Webhook not receiving events**
   - Verify webhook URL configuration
   - Check webhook signature verification
   - Monitor webhook delivery logs

### Debug Mode

Enable debug logging:
```javascript
// In Chatwoot service
console.log('Chatwoot request:', { method, url, data });
console.log('Chatwoot response:', response);
```

### Support

- [Chatwoot Documentation](https://www.chatwoot.com/docs)
- [Chatwoot Community](https://github.com/chatwoot/chatwoot/discussions)
- [RetainFlow Support](mailto:support@aidevelo.ai)
