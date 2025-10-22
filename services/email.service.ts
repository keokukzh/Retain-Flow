import { Resend } from 'resend';

const resend = new Resend(process.env.EMAIL_SERVICE_API_KEY);

export interface EmailTemplate {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export class EmailService {
  async sendWelcomeEmail(email: string, name: string): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'RetainFlow <noreply@aidevelo.ai>',
        to: [email],
        subject: 'Welcome to RetainFlow! 🚀',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 2rem; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 2rem;">Welcome to RetainFlow!</h1>
              <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">Hi ${name}, let's start retaining your community!</p>
            </div>
            <div style="padding: 2rem;">
              <h2>Get Started with RetainFlow</h2>
              <p>We're excited to help you reduce churn and grow your community. Here's what you can do next:</p>
              <ul>
                <li>Connect your Discord server</li>
                <li>Set up your first retention campaign</li>
                <li>Configure AI-powered churn prediction</li>
              </ul>
              <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard" 
                   style="background: #667eea; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('Email send error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Email service error:', error);
      return false;
    }
  }

  async sendOnboardingEmail(email: string, step: number): Promise<boolean> {
    const steps = [
      {
        subject: 'Step 1: Connect Your Discord Server',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
            <h1>Step 1: Connect Your Discord Server</h1>
            <p>Let's start by connecting your Discord server to RetainFlow.</p>
            <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/integrations/discord" 
               style="background: #667eea; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block;">
              Connect Discord
            </a>
          </div>
        `,
      },
      {
        subject: 'Step 2: Set Up Your First Campaign',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
            <h1>Step 2: Set Up Your First Campaign</h1>
            <p>Now let's create your first retention campaign.</p>
            <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard" 
               style="background: #667eea; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block;">
              Create Campaign
            </a>
          </div>
        `,
      },
      {
        subject: 'Step 3: Configure AI Churn Prediction',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 2rem;">
            <h1>Step 3: Configure AI Churn Prediction</h1>
            <p>Finally, let's set up AI-powered churn prediction for your community.</p>
            <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard" 
               style="background: #667eea; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block;">
              Configure AI
            </a>
          </div>
        `,
      },
    ];

    const currentStep = steps[step - 1];
    if (!currentStep) return false;

    try {
      const { data, error } = await resend.emails.send({
        from: 'RetainFlow <noreply@aidevelo.ai>',
        to: [email],
        subject: currentStep.subject,
        html: currentStep.html,
      });

      if (error) {
        console.error('Onboarding email error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Onboarding email service error:', error);
      return false;
    }
  }

  async sendRetentionEmail(email: string, offerCode: string, discount: number): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'RetainFlow <noreply@aidevelo.ai>',
        to: [email],
        subject: `🎁 Special Offer: ${discount}% Off Your Next Month!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 2rem; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 2rem;">🎁 Special Offer Just for You!</h1>
              <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">We don't want to see you go!</p>
            </div>
            <div style="padding: 2rem;">
              <h2>${discount}% Off Your Next Month</h2>
              <p>We've noticed you might be thinking about leaving. Before you go, we'd like to offer you a special discount:</p>
              <div style="background: #f8f9fa; padding: 1.5rem; border-radius: 8px; text-align: center; margin: 1.5rem 0;">
                <h3 style="margin: 0; color: #667eea; font-size: 2rem;">${discount}% OFF</h3>
                <p style="margin: 0.5rem 0 0 0; color: #666;">Use code: <strong>${offerCode}</strong></p>
              </div>
              <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/billing?offer=${offerCode}" 
                   style="background: #667eea; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Apply Offer
                </a>
              </div>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('Retention email error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Retention email service error:', error);
      return false;
    }
  }

  async sendChurnPreventionEmail(email: string, reason: string): Promise<boolean> {
    try {
      const { data, error } = await resend.emails.send({
        from: 'RetainFlow <noreply@aidevelo.ai>',
        to: [email],
        subject: '⚠️ We noticed you might be leaving...',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%); padding: 2rem; text-align: center; color: white;">
              <h1 style="margin: 0; font-size: 2rem;">⚠️ Wait! Don't Go Yet!</h1>
              <p style="margin: 0.5rem 0 0 0; opacity: 0.9;">We've detected some concerning activity patterns</p>
            </div>
            <div style="padding: 2rem;">
              <h2>We're Here to Help!</h2>
              <p>Our AI has detected that you might be experiencing issues with:</p>
              <ul>
                <li><strong>${reason}</strong></li>
              </ul>
              <p>Before you make any decisions, let us help you resolve these issues:</p>
              <div style="text-align: center; margin: 2rem 0;">
                <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/support" 
                   style="background: #667eea; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block; margin-right: 1rem;">
                  Get Help
                </a>
                <a href="${process.env.NEXT_PUBLIC_VERCEL_URL}/dashboard" 
                   style="background: #28a745; color: white; padding: 1rem 2rem; text-decoration: none; border-radius: 8px; display: inline-block;">
                  Try Again
                </a>
              </div>
            </div>
          </div>
        `,
      });

      if (error) {
        console.error('Churn prevention email error:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Churn prevention email service error:', error);
      return false;
    }
  }
}

export const emailService = new EmailService();
