# n8n Integration Setup

## Overview

n8n is a powerful workflow automation tool that allows you to create complex automation workflows without coding. This integration enables RetainFlow to trigger n8n workflows and receive webhooks from n8n.

## Prerequisites

- n8n instance running (self-hosted or cloud)
- n8n API access enabled
- API key generated in n8n

## Installation

### 1. Set up n8n Instance

#### Option A: Self-hosted (Docker)
```bash
# Create docker-compose.yml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n
    restart: always
    ports:
      - "5678:5678"
    environment:
      - N8N_BASIC_AUTH_ACTIVE=true
      - N8N_BASIC_AUTH_USER=admin
      - N8N_BASIC_AUTH_PASSWORD=your_password
      - N8N_HOST=localhost
      - N8N_PORT=5678
      - N8N_PROTOCOL=http
      - WEBHOOK_URL=http://localhost:5678/
    volumes:
      - n8n_data:/home/node/.n8n

volumes:
  n8n_data:
```

#### Option B: n8n Cloud
1. Sign up at [n8n.cloud](https://n8n.cloud)
2. Create a new workspace
3. Note your instance URL

### 2. Generate API Key

1. Log into your n8n instance
2. Go to Settings → API Keys
3. Create a new API key
4. Copy the key for configuration

### 3. Configure RetainFlow

Add the following environment variables:

```bash
# n8n Configuration
N8N_API_URL=https://your-n8n-instance.com
N8N_API_KEY=your_n8n_api_key
```

## Usage

### Creating Workflows

1. **Churn Prediction Workflow**
   - Trigger: Webhook from RetainFlow
   - Actions: Send notifications, create tickets, update CRM

2. **Retention Campaign Workflow**
   - Trigger: Scheduled or event-based
   - Actions: Send emails, update user status, sync data

3. **User Onboarding Workflow**
   - Trigger: User signup webhook
   - Actions: Send welcome sequence, assign roles, sync platforms

### API Endpoints

#### Trigger Workflow
```bash
POST /api/integrations/n8n/trigger
{
  "workflowId": "workflow_id",
  "data": {
    "userId": "user_123",
    "event": "churn_prediction",
    "score": 0.8
  }
}
```

#### Webhook Endpoint
```bash
POST /api/integrations/n8n/webhooks/{webhookId}
```

#### Check Status
```bash
GET /api/integrations/n8n/status?userId=user_123
```

## Example Workflows

### 1. Churn Prediction Alert

```json
{
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "churn-prediction",
        "httpMethod": "POST"
      }
    },
    {
      "name": "Send Slack Alert",
      "type": "n8n-nodes-base.slack",
      "parameters": {
        "operation": "postMessage",
        "channel": "#alerts",
        "text": "High churn risk detected for user {{$json.userId}}"
      }
    }
  ]
}
```

### 2. Retention Campaign

```json
{
  "nodes": [
    {
      "name": "Schedule Trigger",
      "type": "n8n-nodes-base.scheduleTrigger",
      "parameters": {
        "rule": {
          "interval": [{"field": "cronExpression", "expression": "0 9 * * *"}]
        }
      }
    },
    {
      "name": "Get At-Risk Users",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://aidevelo.ai/api/churn-predictions",
        "method": "GET"
      }
    },
    {
      "name": "Send Retention Email",
      "type": "n8n-nodes-base.emailSend",
      "parameters": {
        "toEmail": "{{$json.email}}",
        "subject": "We miss you! Special offer inside",
        "message": "Hi {{$json.name}}, we noticed you haven't been active..."
      }
    }
  ]
}
```

## Best Practices

### Security
- Use HTTPS for webhook URLs
- Implement webhook signature verification
- Restrict API key permissions
- Use environment variables for sensitive data

### Performance
- Implement retry logic for failed requests
- Use batch operations when possible
- Monitor workflow execution times
- Set up proper error handling

### Monitoring
- Enable n8n execution logs
- Set up alerts for failed workflows
- Monitor API rate limits
- Track workflow performance metrics

## Troubleshooting

### Common Issues

1. **Webhook not receiving data**
   - Check webhook URL configuration
   - Verify n8n instance is accessible
   - Check firewall settings

2. **API authentication errors**
   - Verify API key is correct
   - Check API key permissions
   - Ensure n8n instance is running

3. **Workflow execution failures**
   - Check node configurations
   - Verify data formats
   - Review execution logs

### Debug Mode

Enable debug logging in n8n:
```bash
N8N_LOG_LEVEL=debug
```

### Support

- [n8n Documentation](https://docs.n8n.io)
- [n8n Community](https://community.n8n.io)
- [RetainFlow Support](mailto:support@aidevelo.ai)
