# PostHog Analytics Setup

## Overview

PostHog is an open-source product analytics platform that provides event tracking, feature flags, and user insights. This integration enables RetainFlow to track user behavior, measure retention metrics, and run A/B tests.

## Prerequisites

- PostHog account (cloud or self-hosted)
- Project created in PostHog
- API keys generated

## Installation

### 1. Create PostHog Account

#### Option A: PostHog Cloud
1. Sign up at [PostHog Cloud](https://app.posthog.com)
2. Create a new project
3. Note your project API key

#### Option B: Self-hosted
```bash
# Using Docker Compose
version: '3.8'
services:
  posthog:
    image: posthog/posthog:latest
    restart: always
    ports:
      - "8000:8000"
    environment:
      - POSTHOG_SECRET_KEY=your_secret_key
      - DATABASE_URL=postgresql://user:password@db:5432/posthog
      - REDIS_URL=redis://redis:6379
    depends_on:
      - db
      - redis

  db:
    image: postgres:13
    environment:
      - POSTHOG_DB_NAME=posthog
      - POSTHOG_DB_USER=posthog
      - POSTHOG_DB_PASSWORD=password
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

### 2. Generate API Keys

1. Go to Project Settings → API Keys
2. Create a new Project API Key (for frontend)
3. Create a new Personal API Key (for backend)
4. Copy both keys for configuration

### 3. Configure RetainFlow

Add the following environment variables:

```bash
# PostHog Configuration
NEXT_PUBLIC_POSTHOG_KEY=phc_your_project_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
POSTHOG_PERSONAL_API_KEY=phx_your_personal_key
```

## Usage

### Event Tracking

The integration automatically tracks:
- Page views
- User signups and logins
- Subscription events
- Churn predictions
- Retention offers

### Custom Events

Track custom events from your application:

```javascript
import { trackEvent } from '@/components/analytics/PostHogProvider';

// Track custom event
trackEvent('button_clicked', {
  button_name: 'upgrade_plan',
  page: 'pricing',
  user_plan: 'free'
});
```

### Feature Flags

Use feature flags for A/B testing:

```javascript
import { PostHogService } from '@/services/posthog.service';

// Check if feature is enabled
const isEnabled = await PostHogService.isFeatureEnabled(userId, 'new_retention_flow');

if (isEnabled) {
  // Show new retention flow
} else {
  // Show old retention flow
}
```

### API Endpoints

#### Track Event
```bash
POST /api/analytics/track
{
  "event": "custom_event",
  "properties": {
    "property1": "value1",
    "property2": "value2"
  },
  "userId": "user_123"
}
```

#### Get Insights
```bash
GET /api/analytics/insights?userId=user_123&query={"events":["user_signed_up"]}
```

## Analytics Dashboard

### Key Metrics to Track

1. **User Acquisition**
   - Signup conversion rate
   - Traffic sources
   - Landing page performance

2. **User Engagement**
   - Daily/Monthly active users
   - Feature usage
   - Session duration

3. **Retention Metrics**
   - User retention rates
   - Churn prediction accuracy
   - Retention campaign effectiveness

4. **Business Metrics**
   - Subscription conversion
   - Revenue per user
   - Customer lifetime value

### Creating Insights

1. **Funnel Analysis**
   ```
   Event 1: Page View
   Event 2: Sign Up
   Event 3: Subscribe
   Event 4: First Payment
   ```

2. **Cohort Analysis**
   - Track user retention by signup date
   - Measure feature adoption over time
   - Analyze churn patterns

3. **A/B Tests**
   - Test different retention offers
   - Compare onboarding flows
   - Optimize pricing pages

## Example Queries

### User Retention Query
```sql
SELECT 
  DATE_TRUNC('week', timestamp) as week,
  COUNT(DISTINCT person_id) as active_users
FROM events 
WHERE event = 'page_view'
GROUP BY week
ORDER BY week;
```

### Churn Prediction Accuracy
```sql
SELECT 
  churn_score_bucket,
  COUNT(*) as total_users,
  SUM(CASE WHEN churned = true THEN 1 ELSE 0 END) as actual_churns,
  AVG(CASE WHEN churned = true THEN 1 ELSE 0 END) as churn_rate
FROM user_events
GROUP BY churn_score_bucket
ORDER BY churn_score_bucket;
```

## Best Practices

### Event Naming
- Use snake_case for event names
- Be consistent with naming conventions
- Include context in event names

### Properties
- Include relevant user context
- Use consistent property names
- Avoid PII in properties

### Performance
- Batch events when possible
- Use async tracking
- Monitor API rate limits

## Troubleshooting

### Common Issues

1. **Events not appearing**
   - Check API key configuration
   - Verify PostHog instance is accessible
   - Check browser console for errors

2. **Feature flags not working**
   - Verify Personal API key
   - Check flag configuration
   - Ensure proper user identification

3. **High API usage**
   - Implement event batching
   - Use sampling for high-volume events
   - Monitor rate limits

### Debug Mode

Enable debug logging:
```javascript
// In PostHog configuration
{
  debug: true,
  loaded: (posthog) => {
    console.log('PostHog loaded:', posthog);
  }
}
```

### Support

- [PostHog Documentation](https://posthog.com/docs)
- [PostHog Community](https://posthog.com/slack)
- [RetainFlow Support](mailto:support@aidevelo.ai)
