/**
 * Event Reminder Scheduler
 * 
 * This file contains scheduled tasks for sending notifications
 * Run this as a cron job to send event reminders daily
 * 
 * Example cron setup (Linux):
 * 0 6 * * * node /path/to/scheduler.js
 * 
 * This runs every day at 6 AM
 */

require('dotenv').config();
const mongoose = require('mongoose');
const notificationController = require('./controllers/notificationController');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('MongoDB connected for scheduler');
  runScheduledTasks();
})
.catch(err => {
  console.log('MongoDB connection error:', err);
  process.exit(1);
});

async function runScheduledTasks() {
  try {
    console.log(`[${new Date().toISOString()}] Running scheduled tasks...`);
    
    // Send event reminders for today
    const result = await notificationController.sendEventReminders();
    
    console.log(`[${new Date().toISOString()}] Scheduled tasks completed:`, result);
    
    // Exit after task completion
    process.exit(0);
  } catch (error) {
    console.error('Error running scheduled tasks:', error);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Scheduler interrupted');
  mongoose.connection.close();
  process.exit(0);
});
