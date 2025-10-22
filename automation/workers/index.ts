import { emailWorker } from '../queues/email-queue';

console.log('Starting RetainFlow workers...');

// Start all workers
async function startWorkers() {
  try {
    console.log('Email worker started');
    
    // Add graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down workers...');
      await emailWorker.close();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down workers...');
      await emailWorker.close();
      process.exit(0);
    });

    console.log('All workers started successfully');
  } catch (error) {
    console.error('Error starting workers:', error);
    process.exit(1);
  }
}

startWorkers();
