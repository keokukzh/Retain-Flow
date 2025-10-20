# RetainFlow Architecture

## Overview

RetainFlow is a full-stack SaaS application built with Next.js 14, designed to help creators and community managers reduce churn and increase member retention through AI-powered insights and automation.

## Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **React Components** - Modular UI components
- **Framer** - Design system and animations (via MCP)

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM and query builder
- **PostgreSQL** - Primary database
- **Redis** - Caching and job queues
- **BullMQ** - Background job processing

### Integrations
- **Discord.js** - Discord bot integration
- **Stripe** - Payment processing and subscriptions
- **Resend** - Email service
- **Whop API** - Membership platform integration
- **Shopify API** - E-commerce integration

### Infrastructure
- **Vercel** - Frontend and API hosting
- **Railway** - Backend services and database
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error tracking
- **PostHog** - Analytics

## System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   Database      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   (PostgreSQL)  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Framer UI     │    │   Redis Queue   │    │   File Storage  │
│   (MCP Sync)    │    │   (BullMQ)      │    │   (Vercel)      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Database Schema

### Core Models

#### User
- Primary user entity
- Authentication and profile data
- Integration IDs (Discord, Whop, Shopify)

#### Subscription
- Stripe subscription management
- Plan types and billing cycles
- Status tracking

#### ChurnPrediction
- AI-generated churn risk scores
- Risk factors and confidence levels
- Historical predictions

#### RetentionOffer
- Dynamic retention campaigns
- Discount codes and expiration
- Usage tracking

#### EmailCampaign
- Automated email sequences
- Template management
- Delivery tracking

#### DiscordGuild & DiscordMember
- Discord server integration
- Member activity tracking
- Role management

## API Design

### Authentication
- JWT-based authentication
- Email verification flow
- Password reset functionality

### Core Endpoints

#### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/verify-email` - Email verification
- `POST /api/auth/forgot-password` - Password reset

#### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/analytics` - Detailed analytics
- `GET /api/dashboard/predictions` - Churn predictions

#### Subscriptions
- `POST /api/subscriptions/create` - Create subscription
- `POST /api/subscriptions/cancel` - Cancel subscription
- `GET /api/subscriptions/status` - Subscription status

#### Retention
- `GET /api/retention/offers` - Available offers
- `POST /api/retention/campaigns` - Create campaign
- `GET /api/retention/analytics` - Campaign analytics

#### Integrations
- `POST /api/discord/webhook` - Discord events
- `POST /api/whop/webhook` - Whop events
- `POST /api/shopify/webhook` - Shopify events

## Security

### Authentication & Authorization
- JWT tokens with 24-hour expiration
- Secure password hashing with bcrypt
- Email verification required
- Rate limiting on auth endpoints

### Data Protection
- GDPR compliance
- Data encryption at rest and in transit
- Secure environment variable management
- Input validation and sanitization

### API Security
- CORS configuration
- Request rate limiting
- SQL injection prevention
- XSS protection

## Deployment

### Environment Setup
- Development: Local with Docker
- Staging: Vercel preview deployments
- Production: Vercel + Railway

### CI/CD Pipeline
1. Code push triggers GitHub Actions
2. Automated testing (unit, integration, E2E)
3. Visual regression testing
4. Security audit
5. Deployment to staging
6. Manual approval for production
7. Production deployment
8. Post-deployment monitoring

### Monitoring
- Application performance monitoring
- Error tracking and alerting
- User analytics and behavior tracking
- Infrastructure health monitoring

## Scalability Considerations

### Database
- Connection pooling
- Query optimization
- Read replicas for analytics
- Automated backups

### Caching
- Redis for session storage
- API response caching
- Static asset CDN
- Database query caching

### Background Jobs
- Queue-based processing
- Job retry mechanisms
- Dead letter queues
- Horizontal scaling

## Development Workflow

### Code Organization
- Feature-based folder structure
- Shared components library
- Service layer abstraction
- Type-safe API contracts

### Testing Strategy
- Unit tests for business logic
- Integration tests for API endpoints
- E2E tests for user workflows
- Visual regression testing

### Code Quality
- ESLint and Prettier configuration
- TypeScript strict mode
- Pre-commit hooks
- Automated code reviews

## Future Enhancements

### Planned Features
- Advanced AI models for churn prediction
- Multi-tenant architecture
- Mobile application
- Advanced analytics dashboard
- White-label solutions

### Technical Improvements
- Microservices architecture
- Event-driven architecture
- Real-time notifications
- Advanced caching strategies
- Performance optimizations
