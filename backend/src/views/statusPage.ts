export interface ServerStatusData {
  uptimeSeconds: number;
  environment: string;
  port: number | string;
  dbStatus: 'connected' | 'connecting' | 'disconnecting' | 'disconnected';
  dbSystem: string;
  emailSyncStatus: string;
  syncIntervalSeconds: number;
}

export function formatUptime(seconds: number): string {
  const d = Math.floor(seconds / (3600 * 24));
  const h = Math.floor((seconds % (3600 * 24)) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const parts = [];
  if (d > 0) parts.push(`${d}d`);
  if (h > 0 || d > 0) parts.push(`${h}h`);
  if (m > 0 || h > 0 || d > 0) parts.push(`${m}m`);
  parts.push(`${s}s`);

  return parts.join(' ');
}

export function renderStatusPage(data: ServerStatusData): string {
  const isDbOk = data.dbStatus === 'connected';
  const initialUptimeStr = formatUptime(data.uptimeSeconds);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MaxIT Server - Advanced Backend Infrastructure</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background-color: #0b0f19;
      background-image: 
        radial-gradient(at 50% 0%, rgba(56, 189, 248, 0.08) 0px, transparent 60%),
        radial-gradient(at 80% 20%, rgba(16, 185, 129, 0.05) 0px, transparent 50%);
      color: #f1f5f9;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 40px 20px;
    }

    .container {
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
    }

    /* Header */
    .header {
      text-align: center;
      margin-bottom: 48px;
    }

    .title {
      font-size: 2.75rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: #38bdf8;
      text-shadow: 0 0 40px rgba(56, 189, 248, 0.35);
      margin-bottom: 10px;
    }

    .subtitle {
      font-size: 0.85rem;
      font-weight: 600;
      letter-spacing: 0.18em;
      text-transform: uppercase;
      color: #64748b;
    }

    /* Status Grid */
    .status-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
      margin-bottom: 24px;
    }

    @media (max-width: 860px) {
      .status-grid {
        grid-template-columns: 1fr;
      }
    }

    .card {
      background: #121826;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 26px 28px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
      transition: transform 0.2s ease, border-color 0.2s ease;
    }

    .card:hover {
      transform: translateY(-2px);
      border-color: rgba(56, 189, 248, 0.2);
    }

    .card-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 24px;
    }

    .status-dot {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      flex-shrink: 0;
    }

    .status-dot.green {
      background-color: #10b981;
      box-shadow: 0 0 12px #10b981;
      animation: pulseGreen 2.5s infinite;
    }

    .status-dot.red {
      background-color: #ef4444;
      box-shadow: 0 0 12px #ef4444;
      animation: pulseRed 2s infinite;
    }

    @keyframes pulseGreen {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.7; transform: scale(0.9); }
    }

    @keyframes pulseRed {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.6; transform: scale(0.88); }
    }

    .card-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      letter-spacing: -0.01em;
    }

    .meta-group {
      margin-bottom: 20px;
    }

    .meta-group:last-child {
      margin-bottom: 0;
    }

    .meta-label {
      font-size: 0.78rem;
      font-weight: 500;
      color: #64748b;
      margin-bottom: 4px;
    }

    .meta-value {
      font-size: 1.15rem;
      font-weight: 700;
      color: #f8fafc;
      letter-spacing: -0.01em;
    }

    /* Registry Section */
    .registry-box {
      background: #121826;
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 18px;
      padding: 30px;
      box-shadow: 0 20px 40px -15px rgba(0, 0, 0, 0.6);
    }

    .registry-title {
      font-size: 1.25rem;
      font-weight: 700;
      color: #ffffff;
      margin-bottom: 22px;
      letter-spacing: -0.01em;
    }

    .endpoint-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 16px;
    }

    @media (max-width: 860px) {
      .endpoint-grid {
        grid-template-columns: 1fr;
      }
    }

    .endpoint-card {
      background: #172033;
      border: 1px solid rgba(255, 255, 255, 0.04);
      border-radius: 12px;
      padding: 16px 18px;
      transition: background 0.2s ease, border-color 0.2s ease;
    }

    .endpoint-card:hover {
      background: #1c273e;
      border-color: rgba(56, 189, 248, 0.25);
    }

    .badge {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      margin-bottom: 8px;
      letter-spacing: 0.04em;
    }

    .badge-post {
      background-color: #10b981;
      color: #ffffff;
    }

    .badge-get {
      background-color: #38bdf8;
      color: #0b0f19;
    }

    .endpoint-path {
      font-family: 'JetBrains Mono', monospace;
      font-size: 0.88rem;
      font-weight: 600;
      color: #38bdf8;
      margin-bottom: 4px;
      word-break: break-all;
    }

    .endpoint-desc {
      font-size: 0.8rem;
      color: #94a3b8;
      line-height: 1.4;
    }

    /* Footer */
    .footer {
      text-align: center;
      margin-top: 32px;
      font-size: 0.8rem;
      color: #475569;
    }

    .footer a {
      color: #38bdf8;
      text-decoration: none;
      transition: opacity 0.2s;
    }

    .footer a:hover {
      opacity: 0.8;
    }
  </style>
</head>
<body>
  <div class="container">
    <header class="header">
      <h1 class="title">MaxIT Server</h1>
      <p class="subtitle">ADVANCED BACKEND INFRASTRUCTURE</p>
    </header>

    <div class="status-grid">
      <!-- Card 1: Core Engine -->
      <div class="card">
        <div class="card-header">
          <span class="status-dot green"></span>
          <h2 class="card-title">Core Engine</h2>
        </div>

        <div class="meta-group">
          <div class="meta-label">Uptime</div>
          <div class="meta-value" id="uptimeVal">${initialUptimeStr}</div>
        </div>

        <div class="meta-group">
          <div class="meta-label">Environment</div>
          <div class="meta-value">${data.environment}</div>
        </div>

        <div class="meta-group">
          <div class="meta-label">Port</div>
          <div class="meta-value">${data.port}</div>
        </div>
      </div>

      <!-- Card 2: Database -->
      <div class="card">
        <div class="card-header">
          <span class="status-dot ${isDbOk ? 'green' : 'red'}" id="dbDot"></span>
          <h2 class="card-title">Database</h2>
        </div>

        <div class="meta-group">
          <div class="meta-label">System</div>
          <div class="meta-value">${data.dbSystem}</div>
        </div>

        <div class="meta-group">
          <div class="meta-label">Connection</div>
          <div class="meta-value" id="dbStatusText">${isDbOk ? 'Stable' : 'Offline'}</div>
        </div>

        <div class="meta-group">
          <div class="meta-label">Persistence</div>
          <div class="meta-value">Buffer / Binary</div>
        </div>
      </div>

      <!-- Card 3: Cache / Sync Logic -->
      <div class="card">
        <div class="card-header">
          <span class="status-dot green"></span>
          <h2 class="card-title">Cache Logic</h2>
        </div>

        <div class="meta-group">
          <div class="meta-label">Engine</div>
          <div class="meta-value">IMAP & Nodemailer</div>
        </div>

        <div class="meta-group">
          <div class="meta-label">Status</div>
          <div class="meta-value">${data.emailSyncStatus} (${data.syncIntervalSeconds}s sync)</div>
        </div>

        <div class="meta-group">
          <div class="meta-label">Mechanism</div>
          <div class="meta-value">JSON Caching</div>
        </div>
      </div>
    </div>

    <!-- API Registry -->
    <section class="registry-box">
      <h2 class="registry-title">API Registry</h2>

      <div class="endpoint-grid">
        <div class="endpoint-card">
          <span class="badge badge-post">POST</span>
          <div class="endpoint-path">/api/upload</div>
          <div class="endpoint-desc">Upload media with magic-bytes & volume fallback</div>
        </div>

        <div class="endpoint-card">
          <span class="badge badge-get">GET</span>
          <div class="endpoint-path">/health</div>
          <div class="endpoint-desc">Real-time health & database telemetry check</div>
        </div>

        <div class="endpoint-card">
          <span class="badge badge-post">POST</span>
          <div class="endpoint-path">/api/auth/login</div>
          <div class="endpoint-desc">Admin authentication & secure JWT issuance</div>
        </div>

        <div class="endpoint-card">
          <span class="badge badge-post">POST</span>
          <div class="endpoint-path">/api/contact</div>
          <div class="endpoint-desc">Customer contact inquiry with rate limiting</div>
        </div>

        <div class="endpoint-card">
          <span class="badge badge-get">GET</span>
          <div class="endpoint-path">/api/admin/inbox</div>
          <div class="endpoint-desc">Live email sync and admin conversation thread</div>
        </div>

        <div class="endpoint-card">
          <span class="badge badge-get">GET</span>
          <div class="endpoint-path">/uploads/:filename</div>
          <div class="endpoint-desc">Static uploaded media delivery with nosniff</div>
        </div>
      </div>
    </section>

    <footer class="footer">
      MaxIT Monorepo Architecture &bull; <a href="/health">View Raw Telemetry JSON</a>
    </footer>
  </div>

  <script>
    let uptimeSeconds = ${data.uptimeSeconds};

    function formatUptime(sec) {
      const d = Math.floor(sec / 86400);
      const h = Math.floor((sec % 86400) / 3600);
      const m = Math.floor((sec % 3600) / 60);
      const s = Math.floor(sec % 60);
      const parts = [];
      if (d > 0) parts.push(d + 'd');
      if (h > 0 || d > 0) parts.push(h + 'h');
      if (m > 0 || h > 0 || d > 0) parts.push(m + 'm');
      parts.push(s + 's');
      return parts.join(' ');
    }

    // Live tick uptime counter
    setInterval(() => {
      uptimeSeconds++;
      const el = document.getElementById('uptimeVal');
      if (el) el.innerText = formatUptime(uptimeSeconds);
    }, 1000);

    // Live poll /health every 10s
    async function checkHealth() {
      try {
        const res = await fetch('/health');
        const data = await res.json();
        const dot = document.getElementById('dbDot');
        const text = document.getElementById('dbStatusText');
        if (data.db === 'connected') {
          if (dot) { dot.className = 'status-dot green'; }
          if (text) { text.innerText = 'Stable'; }
        } else {
          if (dot) { dot.className = 'status-dot red'; }
          if (text) { text.innerText = 'Offline'; }
        }
      } catch (e) {
        const dot = document.getElementById('dbDot');
        const text = document.getElementById('dbStatusText');
        if (dot) { dot.className = 'status-dot red'; }
        if (text) { text.innerText = 'Offline'; }
      }
    }
    setInterval(checkHealth, 10000);
  </script>
</body>
</html>`;
}
