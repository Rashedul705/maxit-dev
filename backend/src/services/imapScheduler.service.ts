import { syncReplies } from './imap.service.js';

let isSchedulerRunning = false;
let schedulerTimer: NodeJS.Timeout | null = null;

export function startImapScheduler() {
  if (isSchedulerRunning) {
    return;
  }

  const isEnabled = process.env.IMAP_SYNC_ENABLED !== 'false';
  if (!isEnabled) {
    console.log('[IMAP Scheduler] Background reply sync is disabled via IMAP_SYNC_ENABLED=false.');
    return;
  }

  isSchedulerRunning = true;

  const intervalSeconds = parseInt(process.env.SYNC_INTERVAL_SECONDS || '15', 10);
  const intervalMs = Math.max(5, intervalSeconds) * 1000;

  console.log(`[IMAP Scheduler] Background reply sync scheduled every ${intervalSeconds}s (Started).`);

  // First sync shortly after boot
  setTimeout(() => {
    syncReplies().catch(err => {
      console.error('[IMAP Scheduler Boot Sync Error]', err?.message || err);
    });
  }, 4000);

  // Periodic interval sync
  schedulerTimer = setInterval(() => {
    syncReplies().catch(err => {
      console.error('[IMAP Scheduler Interval Error]', err?.message || err);
    });
  }, intervalMs);
}

export function stopImapScheduler() {
  if (schedulerTimer) {
    clearInterval(schedulerTimer);
    schedulerTimer = null;
  }
  isSchedulerRunning = false;
}
