# Composio Integration Setup

## Overview

Composio is a unified API platform that allows you to integrate with 100+ SaaS applications through a single interface. This integration enables RetainFlow to automate actions across multiple platforms like Slack, Notion, Airtable, and more.

## Prerequisites

- Composio account
- API key from Composio dashboard
- Target applications configured in Composio

## Installation

### 1. Create Composio Account

1. Sign up at [Composio](https://composio.dev)
2. Create a new project
3. Generate an API key from the dashboard

### 2. Configure Applications

1. Go to the Apps section in Composio dashboard
2. Select applications you want to integrate (e.g., Slack, Notion, Airtable)
3. Configure OAuth connections for each app
4. Test connections to ensure they work

### 3. Configure RetainFlow

Add the following environment variable:

```bash
# Composio Configuration
COMPOSIO_API_KEY=your_composio_api_key
```

## Usage

### Available Applications

Popular applications supported by Composio:

- **Communication**: Slack, Discord, Microsoft Teams
- **Productivity**: Notion, Airtable, Google Workspace
- **CRM**: HubSpot, Salesforce, Pipedrive
- **Marketing**: Mailchimp, ConvertKit, ActiveCampaign
- **Analytics**: Google Analytics, Mixpanel, Amplitude

### API Endpoints

#### Connect Application
```bash
POST /api/integrations/composio/connect
{
  "userId": "user_123",
  "appId": "slack",
  "config": {
    "workspace": "your_workspace"
  }
}
```

#### Execute Action
```bash
POST /api/integrations/composio/execute
{
  "userId": "user_123",
  "appId": "slack",
  "actionId": "send_message",
  "parameters": {
    "channel": "#general",
    "text": "Hello from RetainFlow!"
  }
}
```

#### List Connections
```bash
GET /api/integrations/composio/connections?userId=user_123
```

#### Get Available Apps
```bash
GET /api/integrations/composio/apps
```

#### Get App Actions
```bash
GET /api/integrations/composio/actions/slack
```

## Example Use Cases

### 1. Slack Notifications

```javascript
// Send churn alert to Slack
await ComposioService.executeAction(
  userId,
  'slack',
  'send_message',
  {
    channel: '#alerts',
    text: `🚨 High churn risk detected for user ${userId}`,
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*User ID:* ${userId}\n*Risk Score:* ${churnScore}\n*Recommended Action:* Send retention offer`
        }
      }
    ]
  }
);
```

### 2. Notion Database Updates

```javascript
// Update user status in Notion
await ComposioService.executeAction(
  userId,
  'notion',
  'create_page',
  {
    parent: { database_id: 'notion_database_id' },
    properties: {
      'User ID': { title: [{ text: { content: userId } }] },
      'Status': { select: { name: 'At Risk' } },
      'Churn Score': { number: churnScore },
      'Last Updated': { date: { start: new Date().toISOString() } }
    }
  }
);
```

### 3. Airtable Record Creation

```javascript
// Create retention campaign record
await ComposioService.executeAction(
  userId,
  'airtable',
  'create_record',
  {
    baseId: 'airtable_base_id',
    tableId: 'airtable_table_id',
    fields: {
      'User ID': userId,
      'Campaign Type': 'Retention',
      'Status': 'Active',
      'Created Date': new Date().toISOString()
    }
  }
);
```

## Workflow Integration

### Churn Prediction Workflow

1. **Detect High Churn Risk**
   - RetainFlow identifies at-risk user
   - Triggers Composio action

2. **Multi-Platform Notification**
   - Send Slack alert to team
   - Create Notion page for tracking
   - Update Airtable record

3. **Automated Follow-up**
   - Schedule follow-up actions
   - Update user status across platforms
   - Track campaign effectiveness

### Retention Campaign Workflow

1. **Campaign Initiation**
   - User cancels subscription
   - RetainFlow triggers retention workflow

2. **Cross-Platform Sync**
   - Update CRM with cancellation reason
   - Create support ticket
   - Schedule follow-up calls

3. **Success Tracking**
   - Monitor campaign performance
   - Update analytics dashboards
   - Generate reports

## Best Practices

### Security
- Store API keys securely
- Use environment variables
- Implement proper error handling
- Monitor API usage

### Performance
- Batch operations when possible
- Implement retry logic
- Cache frequently used data
- Monitor rate limits

### Error Handling
- Implement comprehensive error handling
- Log all API interactions
- Set up monitoring and alerts
- Provide fallback mechanisms

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify API key is correct
   - Check application permissions
   - Ensure OAuth connections are valid

2. **Action Execution Failures**
   - Verify action parameters
   - Check application status
   - Review Composio logs

3. **Rate Limiting**
   - Implement exponential backoff
   - Monitor API usage
   - Consider upgrading plan

### Debug Mode

Enable detailed logging:
```javascript
// Add to your service calls
console.log('Composio request:', { appId, actionId, parameters });
console.log('Composio response:', result);
```

### Support

- [Composio Documentation](https://docs.composio.dev)
- [Composio Community](https://discord.gg/composio)
- [RetainFlow Support](mailto:support@aidevelo.ai)
