import cron from 'cron';
import { runChurnPredictionCron } from './churn-prediction';

// Schedule churn prediction to run daily at 2 AM
const churnPredictionJob = new cron.CronJob(
  '0 2 * * *', // 2 AM daily
  async () => {
    console.log('Running scheduled churn prediction...');
    await runChurnPredictionCron();
  },
  null,
  true, // Start immediately
  'UTC'
);

// Schedule additional cron jobs here
// const emailCampaignJob = new cron.CronJob('0 9 * * *', ...); // 9 AM daily
// const retentionOfferJob = new cron.CronJob('0 14 * * *', ...); // 2 PM daily

export function startCronJobs(): void {
  console.log('Starting RetainFlow cron jobs...');
  
  // Start all cron jobs
  churnPredictionJob.start();
  
  console.log('All cron jobs started successfully');
}

export function stopCronJobs(): void {
  console.log('Stopping RetainFlow cron jobs...');
  
  churnPredictionJob.stop();
  
  console.log('All cron jobs stopped');
}
