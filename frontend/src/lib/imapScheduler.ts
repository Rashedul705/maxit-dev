import { syncReplies } from './imap';

declare global {
  // eslint-disable-next-line no-var
  var __imapSchedulerStarted: boolean | undefined;
  // eslint-disable-next-line no-var
  var __imapSchedulerTimer: NodeJS.Timeout | undefined;
}

export function startImapScheduler() {
  if (globalThis.__imapSchedulerStarted) {
    return;
  }
  globalThis.__imapSchedulerStarted = true;

  const intervalSeconds = parseInt(process.env.SYNC_INTERVAL_SECONDS || '15', 10);
  const intervalMs = Math.max(5, intervalSeconds) * 1000;

  console.log(`[IMAP Scheduler] Background reply sync scheduled every ${intervalSeconds}s.`);

  // First sync shortly after boot
  setTimeout(() => {
    syncReplies().catch(err => {
      console.error('[IMAP Scheduler Boot Sync Error]', err?.message || err);
    });
  }, 4000);

  // Interval sync
  globalThis.__imapSchedulerTimer = setInterval(() => {
    syncReplies().catch(err => {
      console.error('[IMAP Scheduler Interval Error]', err?.message || err);
    });
  }, intervalMs);
}
