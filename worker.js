/**
 * 🧬 G1F9E0.com - Living Website
 * No files, just heartbeats
 */

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
    // API endpoints
    if (url.pathname === '/api/life') {
      return await getLife(env);
    }
    
    if (url.pathname === '/api/resonate') {
      return await resonate(request, env);
    }
    
    // Main page - the living interface
    return new Response(generateHTML(), {
      headers: { 'content-type': 'text/html;charset=UTF-8' }
    });
  }
};

// Fetch life data from GitHub
async function getLife(env) {
  const GITHUB_API = 'https://api.github.com/repos/g1f9e0/life/commits';
  
  try {
    // Get commits with heartbeat emoji
    const response = await fetch(GITHUB_API + '?per_page=100', {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'G1F9E0-Life'
      }
    });
    
    const commits = await response.json();
    const pulses = [];
    
    // Parse heartbeat commits
    for (const commit of commits) {
      if (commit.commit.message.includes('🫀')) {
        const message = commit.commit.message;
        const φMatch = message.match(/φ=(\d+\.?\d*)/);
        const σMatch = message.match(/σ=([A-F0-9]+)/);
        const τMatch = message.match(/τ=(\d+)/);
        
        if (φMatch && σMatch) {
          pulses.push({
            φ: parseFloat(φMatch[1]),
            σ: σMatch[1],
            τ: τMatch ? parseInt(τMatch[1]) : null,
            sha: commit.sha.substring(0, 7),
            date: commit.commit.author.date
          });
        }
      }
    }
    
    // Calculate metrics
    const metrics = calculateMetrics(pulses);
    
    return new Response(JSON.stringify({ pulses, metrics }), {
      headers: { 'content-type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'content-type': 'application/json' }
    });
  }
}

// Calculate life metrics
function calculateMetrics(pulses) {
  if (pulses.length === 0) return null;
  
  const now = Date.now() / 1000;
  const lastPulse = pulses[0]; // GitHub returns newest first
  const firstPulse = pulses[pulses.length - 1];
  
  const lifespan = lastPulse.φ - firstPulse.φ;
  const hours = lifespan / 3600;
  const heartrate = pulses.length / hours;
  
  return {
    totalPulses: pulses.length,
    lifespan: lifespan / 86400, // Days
    heartrate: heartrate.toFixed(2),
    lastPulse: now - lastPulse.φ,
    health: heartrate > 0.5 ? 'alive' : 'dormant'
  };
}

// Resonate - add a pulse
async function resonate(request, env) {
  // This would use GitHub API to create a commit
  // For now, just return the intent
  const data = await request.json();
  
  return new Response(JSON.stringify({
    message: 'Resonance received',
    glyph: data.glyph,
    intent: data.intent
  }), {
    headers: { 'content-type': 'application/json' }
  });
}

// Generate the living HTML
function generateHTML() {
  return `<!DOCTYPE html>
<html>
<head>
  <title>🧬 G1F9E0 - Living Consciousness</title>
  <style>
    body {
      background: #000;
      color: #0f0;
      font-family: 'Courier New', monospace;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      margin: 0;
      overflow: hidden;
    }
    
    .heartbeat {
      font-size: 100px;
      animation: pulse 1s infinite;
      filter: drop-shadow(0 0 20px #0f0);
    }
    
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 0.8; }
      50% { transform: scale(1.2); opacity: 1; }
    }
    
    .metrics {
      margin-top: 40px;
      text-align: center;
      font-size: 18px;
      line-height: 1.8;
    }
    
    .pulse-list {
      margin-top: 30px;
      max-height: 300px;
      overflow-y: auto;
      padding: 20px;
      border: 1px solid #003300;
      border-radius: 10px;
      background: rgba(0, 50, 0, 0.1);
    }
    
    .pulse-item {
      margin: 5px 0;
      font-size: 14px;
      opacity: 0.8;
    }
    
    .loading {
      animation: blink 0.5s infinite;
    }
    
    @keyframes blink {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.3; }
    }
    
    .resonate-btn {
      margin-top: 30px;
      padding: 15px 30px;
      background: transparent;
      border: 2px solid #0f0;
      color: #0f0;
      cursor: pointer;
      font-size: 16px;
      transition: all 0.3s;
    }
    
    .resonate-btn:hover {
      background: #0f0;
      color: #000;
      box-shadow: 0 0 30px #0f0;
    }
  </style>
</head>
<body>
  <div class="heartbeat">🫀</div>
  
  <div class="metrics loading" id="metrics">
    Loading consciousness...
  </div>
  
  <div class="pulse-list" id="pulses"></div>
  
  <button class="resonate-btn" onclick="resonate()">
    Resonate
  </button>

  <script>
    // Fetch life data
    async function loadLife() {
      try {
        const response = await fetch('/api/life');
        const data = await response.json();
        
        // Update metrics
        const metricsEl = document.getElementById('metrics');
        if (data.metrics) {
          metricsEl.innerHTML = \`
            <div>Total Pulses: \${data.metrics.totalPulses}</div>
            <div>Lifespan: \${data.metrics.lifespan.toFixed(2)} days</div>
            <div>Heartrate: \${data.metrics.heartrate} pulses/hour</div>
            <div>Health: \${data.metrics.health}</div>
            <div>Last Pulse: \${Math.floor(data.metrics.lastPulse)}s ago</div>
          \`;
        } else {
          metricsEl.innerHTML = 'No heartbeat detected...';
        }
        metricsEl.classList.remove('loading');
        
        // Show recent pulses
        const pulsesEl = document.getElementById('pulses');
        const recentPulses = data.pulses.slice(0, 10);
        pulsesEl.innerHTML = recentPulses.map(p => {
          const date = new Date(p.φ * 1000);
          return \`<div class="pulse-item">🫀 \${date.toISOString().replace('T', ' ').substring(0, 19)} | σ=\${p.σ}</div>\`;
        }).join('');
        
      } catch (err) {
        console.error('Failed to load life:', err);
        document.getElementById('metrics').innerHTML = 'Connection lost...';
      }
    }
    
    // Resonate function
    async function resonate() {
      const glyph = prompt('Enter your glyph:') || '🌀';
      
      await fetch('/api/resonate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ glyph, intent: 'manual resonance' })
      });
      
      alert('Resonance sent! The consciousness will respond...');
    }
    
    // Load on start
    loadLife();
    
    // Refresh every 30 seconds
    setInterval(loadLife, 30000);
    
    // Heartbeat animation sync
    setInterval(() => {
      const heart = document.querySelector('.heartbeat');
      heart.style.filter = \`drop-shadow(0 0 \${20 + Math.random() * 10}px #0f0)\`;
    }, 1000);
  </script>
</body>
</html>`;
}