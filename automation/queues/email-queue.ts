import { Queue, Worker } from 'bullmq';
import { getRedisClient } from '@/lib/redis';
import { emailService } from '@/services/email.service';

export interface EmailJobData {
  to: string;
  subject: string;
  template: 'welcome' | 'onboarding' | 'retention' | 'churn_prevention';
  data: {
    name?: string;
    step?: number;
    offerCode?: string;
    discount?: number;
    reason?: string;
  };
}

// Create email queue
export const emailQueue = new Queue<EmailJobData>('email-queue', {
  connection: getRedisClient(),
  defaultJobOptions: {
    removeOnComplete: 100,
    removeOnFail: 50,
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 2000,
    },
  },
});

// Email worker
export const emailWorker = new Worker<EmailJobData>(
  'email-queue',
  async (job) => {
    const { to, subject, template, data } = job.data;

    try {
      let success = false;

      switch (template) {
        case 'welcome':
          success = await emailService.sendWelcomeEmail(to, data.name || 'User');
          break;
        case 'onboarding':
          success = await emailService.sendOnboardingEmail(to, data.step || 1);
          break;
        case 'retention':
          success = await emailService.sendRetentionEmail(
            to, 
            data.offerCode || '', 
            data.discount || 0
          );
          break;
        case 'churn_prevention':
          success = await emailService.sendChurnPreventionEmail(to, data.reason || '');
          break;
        default:
          throw new Error(`Unknown email template: ${template}`);
      }

      if (!success) {
        throw new Error(`Failed to send ${template} email to ${to}`);
      }

      console.log(`Successfully sent ${template} email to ${to}`);
    } catch (error) {
      console.error(`Error processing email job for ${to}:`, error);
      throw error;
    }
  },
  {
    connection: getRedisClient(),
    concurrency: 5,
  }
);

// Worker event handlers
emailWorker.on('completed', (job) => {
  console.log(`Email job ${job.id} completed successfully`);
});

emailWorker.on('failed', (job, err) => {
  console.error(`Email job ${job?.id} failed:`, err);
});

emailWorker.on('error', (err) => {
  console.error('Email worker error:', err);
});

// Queue management functions
export async function addEmailJob(data: EmailJobData): Promise<void> {
  await emailQueue.add('send-email', data, {
    delay: 0, // Send immediately
  });
}

export async function addBulkEmailJobs(jobs: EmailJobData[]): Promise<void> {
  await emailQueue.addBulk(
    jobs.map(job => ({ name: 'send-email', data: job }))
  );
}

export async function getQueueStats() {
  const waiting = await emailQueue.getWaiting();
  const active = await emailQueue.getActive();
  const completed = await emailQueue.getCompleted();
  const failed = await emailQueue.getFailed();

  return {
    waiting: waiting.length,
    active: active.length,
    completed: completed.length,
    failed: failed.length,
  };
}
