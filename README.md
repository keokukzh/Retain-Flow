# RetainFlow - AI-Powered Retention Tool for Creators

[![CI/CD Pipeline](https://github.com/retainflow/retainflow/workflows/CI%2FCD%20Pipeline/badge.svg)](https://github.com/retainflow/retainflow/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?logo=next.js&logoColor=white)](https://nextjs.org/)

RetainFlow is a comprehensive SaaS platform designed to help creators and community managers reduce churn, increase member retention, and grow their communities through AI-powered insights and automation.

## 🚀 Features

### Core Functionality
- **AI-Powered Churn Prediction** - Predict member churn before it happens
- **Automated Retention Campaigns** - Send targeted retention offers automatically
- **Real-time Analytics** - Track engagement, retention, and growth metrics
- **Multi-Platform Integration** - Connect Discord, Whop, Shopify, and more

### Creator-Focused Tools
- **Discord Bot Integration** - Automated welcome messages, role assignments, and engagement tracking
- **Membership Sync** - Real-time synchronization with Whop and Shopify
- **Email Automation** - Drip campaigns, onboarding sequences, and re-engagement flows
- **Custom Retention Offers** - Dynamic discount codes and personalized offers

### Enterprise Features
- **White-label Options** - Custom branding and domain
- **API Access** - Full REST API for custom integrations
- **Team Collaboration** - Multi-user access and role management
- **Advanced Analytics** - Detailed reporting and insights

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer** - Design system and animations

### Backend
- **Next.js API Routes** - Serverless API endpoints
- **Prisma** - Database ORM and query builder
- **PostgreSQL** - Primary database
- **Redis** - Caching and job queues
- **BullMQ** - Background job processing

### Integrations
- **Discord.js** - Discord bot integration
- **Stripe** - Payment processing
- **Resend** - Email service
- **Whop API** - Membership platform
- **Shopify API** - E-commerce integration

### Infrastructure
- **Vercel** - Frontend and API hosting
- **Railway** - Backend services and database
- **GitHub Actions** - CI/CD pipeline
- **Sentry** - Error tracking
- **PostHog** - Analytics

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+
- Redis 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/retainflow/retainflow.git
   cd retainflow
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**
   ```bash
   npx prisma migrate dev
   npx prisma db seed
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/retainflow"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key"

# Stripe
STRIPE_API_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."

# Discord Bot
DISCORD_BOT_TOKEN="your-discord-bot-token"
DISCORD_CLIENT_ID="your-discord-client-id"

# Email Service
EMAIL_SERVICE_API_KEY="re_..."

# Redis
REDIS_URL="redis://localhost:6379"
```

## 📖 Documentation

- [Architecture Guide](docs/architecture.md) - System architecture and design decisions
- [API Documentation](docs/api-documentation.md) - Complete API reference
- [Integrations Guide](docs/integrations.md) - Platform integration setup
- [Deployment Guide](docs/deployment.md) - Production deployment instructions
- [Troubleshooting](docs/troubleshooting.md) - Common issues and solutions

## 🧪 Testing

### Run Tests
```bash
# Unit tests
npm test

# E2E tests
npm run test:e2e

# Visual regression tests
npm run visual:test

# All tests
npm run test:all
```

### Test Coverage
```bash
npm run test:coverage
```

## 🚀 Deployment

### Staging
```bash
git push origin develop
```

### Production
```bash
git push origin main
```

### Manual Deployment
```bash
# Deploy to Vercel
vercel --prod

# Deploy to Railway
railway up --environment production
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- ESLint and Prettier for code formatting
- Jest for unit testing
- Playwright for E2E testing
- Conventional commits for commit messages

## 📊 Project Status

### Current Version: 1.0.0

#### ✅ Completed Features
- [x] User authentication and authorization
- [x] Dashboard with analytics
- [x] Discord bot integration
- [x] Stripe subscription management
- [x] Email automation system
- [x] Basic churn prediction
- [x] Retention campaign system
- [x] API documentation
- [x] CI/CD pipeline
- [x] Visual regression testing

#### 🚧 In Progress
- [ ] Advanced AI models for churn prediction
- [ ] Whop integration
- [ ] Shopify integration
- [ ] Mobile application
- [ ] Advanced analytics dashboard

#### 📋 Planned Features
- [ ] Multi-tenant architecture
- [ ] White-label solutions
- [ ] Advanced reporting
- [ ] Team collaboration features
- [ ] Custom integrations marketplace

## 🏗️ Architecture

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

## 🔒 Security

- JWT-based authentication
- HTTPS everywhere
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- GDPR compliance
- Regular security audits

## 📈 Performance

- Server-side rendering with Next.js
- Image optimization
- CDN for static assets
- Database query optimization
- Redis caching
- Background job processing

## 🌍 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - React framework
- [Prisma](https://prisma.io/) - Database toolkit
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vercel](https://vercel.com/) - Deployment platform
- [Railway](https://railway.app/) - Backend hosting

## 📞 Support

- **Email**: support@aidevelo.ai
- **Discord**: [Join our community](https://discord.gg/retainflow)
- **Documentation**: [docs.aidevelo.ai](https://docs.aidevelo.ai)
- **Status Page**: [status.aidevelo.ai](https://status.aidevelo.ai)

## 🎯 Roadmap

### Q1 2024
- Advanced AI churn prediction models
- Whop and Shopify integrations
- Mobile application beta

### Q2 2024
- Multi-tenant architecture
- White-label solutions
- Advanced analytics

### Q3 2024
- Team collaboration features
- Custom integrations marketplace
- Enterprise features

---

**Built with ❤️ by [AIDevelopment](https://aidevelo.ai)**
