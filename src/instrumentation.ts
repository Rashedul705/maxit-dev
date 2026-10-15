export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startImapScheduler } = await import('@/lib/imapScheduler');
    startImapScheduler();
  }
}
