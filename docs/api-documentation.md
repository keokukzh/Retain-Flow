# RetainFlow API Documentation

## Base URL
- Development: `http://localhost:3000/api`
- Production: `https://aidevelo.ai/api`

## Authentication

All API endpoints (except authentication endpoints) require a valid JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Authentication Endpoints

### POST /api/auth/register

Register a new user account.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "User created successfully. Please check your email to verify your account.",
  "user": {
    "id": "string",
    "email": "string",
    "emailVerified": false,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `201` - User created successfully
- `400` - Invalid input data
- `409` - User already exists
- `500` - Internal server error

### POST /api/auth/login

Authenticate a user and return a JWT token.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "emailVerified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Status Codes:**
- `200` - Login successful
- `400` - Missing credentials
- `401` - Invalid credentials or unverified email
- `500` - Internal server error

### POST /api/auth/verify-email

Verify user email address.

**Request Body:**
```json
{
  "token": "string"
}
```

**Response:**
```json
{
  "message": "Email verified successfully"
}
```

**Status Codes:**
- `200` - Email verified
- `400` - Invalid or expired token
- `500` - Internal server error

### POST /api/auth/forgot-password

Request password reset email.

**Request Body:**
```json
{
  "email": "string"
}
```

**Response:**
```json
{
  "message": "Password reset email sent"
}
```

**Status Codes:**
- `200` - Reset email sent
- `404` - User not found
- `500` - Internal server error

## Dashboard Endpoints

### GET /api/dashboard/stats

Get dashboard statistics for the authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "stats": {
    "totalMembers": 1250,
    "churnRate": 12.5,
    "retentionRate": 87.5,
    "activeCampaigns": 3,
    "revenue": 12500,
    "growth": 15.2
  },
  "churnPredictions": [
    {
      "userId": "string",
      "riskScore": 0.85,
      "factors": ["inactive_7_days", "no_engagement"],
      "lastActive": "2024-01-01T00:00:00.000Z"
    }
  ]
}
```

**Status Codes:**
- `200` - Statistics retrieved
- `401` - Unauthorized
- `500` - Internal server error

### GET /api/dashboard/analytics

Get detailed analytics data.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `period` - Time period (7d, 30d, 90d, 1y)
- `metric` - Specific metric to retrieve

**Response:**
```json
{
  "analytics": {
    "churnTrend": [
      {
        "date": "2024-01-01",
        "value": 12.5
      }
    ],
    "retentionTrend": [
      {
        "date": "2024-01-01",
        "value": 87.5
      }
    ],
    "engagementMetrics": {
      "dailyActive": 450,
      "weeklyActive": 1200,
      "monthlyActive": 1250
    }
  }
}
```

## Subscription Endpoints

### POST /api/subscriptions/create

Create a new subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "plan": "PRO",
  "paymentMethodId": "string"
}
```

**Response:**
```json
{
  "subscription": {
    "id": "string",
    "status": "ACTIVE",
    "plan": "PRO",
    "currentPeriodStart": "2024-01-01T00:00:00.000Z",
    "currentPeriodEnd": "2024-02-01T00:00:00.000Z"
  }
}
```

### POST /api/subscriptions/cancel

Cancel an active subscription.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "reason": "string",
  "feedback": "string"
}
```

**Response:**
```json
{
  "message": "Subscription cancelled successfully",
  "retentionOffers": [
    {
      "id": "string",
      "discountPercent": 25,
      "description": "25% off for 3 months",
      "expiresAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

## Retention Endpoints

### GET /api/retention/offers

Get available retention offers.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `reason` - Cancellation reason
- `userId` - Target user ID

**Response:**
```json
{
  "offers": [
    {
      "id": "string",
      "reason": "price_too_high",
      "discountPercent": 25,
      "description": "25% discount for 3 months",
      "offerCode": "SAVE25",
      "expiresAt": "2024-01-15T00:00:00.000Z"
    }
  ]
}
```

### POST /api/retention/campaigns

Create a retention campaign.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "string",
  "type": "RETENTION",
  "targetAudience": "at_risk",
  "template": "string",
  "scheduledAt": "2024-01-01T00:00:00.000Z"
}
```

**Response:**
```json
{
  "campaign": {
    "id": "string",
    "name": "string",
    "status": "SCHEDULED",
    "scheduledAt": "2024-01-01T00:00:00.000Z"
  }
}
```

## Integration Endpoints

### POST /api/discord/webhook

Handle Discord webhook events.

**Request Body:**
```json
{
  "event": "guildMemberAdd",
  "guildId": "string",
  "userId": "string",
  "data": {}
}
```

**Response:**
```json
{
  "message": "Event processed successfully"
}
```

### POST /api/whop/webhook

Handle Whop webhook events.

**Request Body:**
```json
{
  "event": "subscription.created",
  "subscriptionId": "string",
  "userId": "string",
  "data": {}
}
```

### POST /api/shopify/webhook

Handle Shopify webhook events.

**Request Body:**
```json
{
  "event": "order.created",
  "orderId": "string",
  "customerId": "string",
  "data": {}
}
```

## Error Responses

All endpoints return consistent error responses:

```json
{
  "message": "Error description",
  "code": "ERROR_CODE",
  "details": {}
}
```

### Common Error Codes

- `VALIDATION_ERROR` - Invalid input data
- `AUTHENTICATION_REQUIRED` - Missing or invalid token
- `AUTHORIZATION_FAILED` - Insufficient permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `INTERNAL_SERVER_ERROR` - Unexpected server error

## Rate Limiting

API endpoints are rate limited to prevent abuse:

- Authentication endpoints: 5 requests per minute
- General API endpoints: 100 requests per minute
- Webhook endpoints: 1000 requests per minute

Rate limit headers are included in responses:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Webhooks

RetainFlow can send webhooks to your application for important events:

### Event Types

- `user.created` - New user registration
- `subscription.created` - New subscription
- `subscription.cancelled` - Subscription cancellation
- `churn.predicted` - High churn risk detected
- `campaign.sent` - Email campaign sent

### Webhook Payload

```json
{
  "id": "string",
  "type": "user.created",
  "created": "2024-01-01T00:00:00.000Z",
  "data": {
    "object": {}
  }
}
```

### Webhook Security

Webhooks are signed with HMAC-SHA256. Verify signatures using your webhook secret:

```javascript
const crypto = require('crypto');

function verifyWebhook(payload, signature, secret) {
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}
```

## SDKs and Libraries

### JavaScript/TypeScript

```bash
npm install @retainflow/sdk
```

```javascript
import { RetainFlow } from '@retainflow/sdk';

const client = new RetainFlow({
  apiKey: 'your-api-key',
  baseUrl: 'https://aidevelo.ai/api'
});

// Get dashboard stats
const stats = await client.dashboard.getStats();
```

### Python

```bash
pip install retainflow-sdk
```

```python
from retainflow import RetainFlow

client = RetainFlow(api_key='your-api-key')

# Get dashboard stats
stats = client.dashboard.get_stats()
```

## Support

For API support and questions:
- Email: api-support@aidevelo.ai
- Documentation: https://docs.aidevelo.ai
- Status Page: https://status.aidevelo.ai
