import { addEmailJob } from '../queues/email-queue';

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

    console.log(`User signup triggers queued for ${email}`);
  } catch (error) {
    console.error('Error triggering user signup automation:', error);
  }
}
