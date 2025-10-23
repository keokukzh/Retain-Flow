import { addEmailJob } from '../queues/email-queue';
import { N8nService } from '@/services/n8n.service';
import { PostHogService } from '@/services/posthog.service';
import { ChatwootService } from '@/services/chatwoot.service';
import { ComposioService } from '@/services/composio.service';

export async function triggerUserSignup(userId: string, email: string, name: string): Promise<void> {
  try {
    // Queue welcome email
    await addEmailJob({
      to: email,
      subject: 'Welcome to RetainFlow! 🚀',
      template: 'welcome',
      data: {
        name,
      },
    });

    // Queue onboarding sequence
    await addEmailJob({
      to: email,
      subject: 'Step 1: Connect Your Discord Server',
      template: 'onboarding',
      data: {
        step: 1,
      },
    });

    // Track user signup with PostHog
    await PostHogService.trackUserSignup(userId, email, name);

    // Trigger n8n onboarding workflow
    await N8nService.triggerWorkflow({
      workflowId: 'user-signup',
      data: {
        userId,
        email,
        name,
        signupDate: new Date().toISOString(),
      },
    });

    // Sync user to Chatwoot for support
    await ChatwootService.syncUser(userId, {
      email,
      name,
      customAttributes: {
        signup_source: 'website',
        onboarding_step: 1,
      },
    });

    // Send welcome notifications via Composio
    try {
      // Slack notification
      await ComposioService.executeAction(
        userId,
        'slack',
        'send_message',
        {
          channel: '#new-users',
          text: `🎉 New User Signup!\nName: ${name}\nEmail: ${email}\nUser ID: ${userId}`,
        }
      );

      // Airtable record creation
      await ComposioService.executeAction(
        userId,
        'airtable',
        'create_record',
        {
          baseId: process.env.AIRTABLE_USERS_BASE_ID,
          tableId: process.env.AIRTABLE_USERS_TABLE_ID,
          fields: {
            'Name': name,
            'Email': email,
            'User ID': userId,
            'Signup Date': new Date().toISOString(),
            'Status': 'New',
          },
        }
      );
    } catch (error) {
      console.log('Welcome notifications failed (Composio not connected):', error);
    }

    console.log(`User signup triggers queued for ${email}`);
  } catch (error) {
    console.error('Error triggering user signup automation:', error);
  }
}
