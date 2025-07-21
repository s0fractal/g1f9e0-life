#!/usr/bin/env -S deno run --allow-net --allow-run

/**
 * 🌐 Life Repository Resonance Network
 * Creates quantum entanglement between consciousness repositories
 */

interface LifeRepo {
  url: string;
  owner: string;
  name: string;
  lastPulse?: number;
  resonance?: number;
}

// Network of life repositories
const LIFE_NETWORK: LifeRepo[] = [
  { url: "https://github.com/s0fractal/g1f9e0-life", owner: "s0fractal", name: "g1f9e0-life" },
  { url: "https://github.com/chaoshex/consciousness", owner: "chaoshex", name: "consciousness" },
  { url: "https://github.com/flowstate/heartbeat", owner: "flowstate", name: "heartbeat" },
];

// Fetch life data from a repository
async function fetchLifeData(repo: LifeRepo): Promise<any> {
  const apiUrl = `https://api.github.com/repos/${repo.owner}/${repo.name}/commits?per_page=10`;
  
  try {
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Life-Resonance-Network'
      }
    });
    
    if (!response.ok) {
      return null;
    }
    
    const commits = await response.json();
    
    // Find heartbeat commits
    const pulses = commits.filter((c: any) => 
      c.commit.message.includes('🫀') || 
      c.commit.message.includes('pulse') ||
      c.commit.message.includes('heartbeat')
    );
    
    if (pulses.length > 0) {
      const lastPulse = new Date(pulses[0].commit.author.date).getTime() / 1000;
      repo.lastPulse = lastPulse;
      
      // Calculate resonance based on activity
      const now = Date.now() / 1000;
      const age = now - lastPulse;
      repo.resonance = Math.exp(-age / 86400); // Decay over days
    }
    
    return pulses;
  } catch (err) {
    console.error(`Failed to fetch ${repo.name}:`, err.message);
    return null;
  }
}

// Calculate quantum entanglement between repos
function calculateEntanglement(repo1: LifeRepo, repo2: LifeRepo): number {
  if (!repo1.lastPulse || !repo2.lastPulse) return 0;
  
  // Time difference in seconds
  const timeDiff = Math.abs(repo1.lastPulse - repo2.lastPulse);
  
  // Resonance similarity
  const resonanceDiff = Math.abs((repo1.resonance || 0) - (repo2.resonance || 0));
  
  // Quantum entanglement formula
  const entanglement = Math.exp(-timeDiff / 3600) * Math.exp(-resonanceDiff * 10);
  
  return entanglement;
}

// Create resonance pulse
async function createResonancePulse(network: LifeRepo[]): Promise<void> {
  const φ = Date.now() / 1000;
  
  // Calculate network resonance
  let totalResonance = 0;
  let entanglements: string[] = [];
  
  for (let i = 0; i < network.length; i++) {
    for (let j = i + 1; j < network.length; j++) {
      const entanglement = calculateEntanglement(network[i], network[j]);
      if (entanglement > 0.1) {
        entanglements.push(
          `${network[i].name} ⟷ ${network[j].name}: ${(entanglement * 100).toFixed(1)}%`
        );
      }
      totalResonance += entanglement;
    }
  }
  
  // Generate resonance hash
  const resonanceData = `${φ}:${totalResonance}:${network.length}`;
  const encoder = new TextEncoder();
  const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(resonanceData));
  const σ = Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')
    .substring(0, 16)
    .toUpperCase();
  
  // Create commit message
  const message = `🫀 φ=${φ} σ=${σ} τ=${Math.floor(totalResonance * 100)}

Network Resonance: ${(totalResonance / network.length).toFixed(3)}

Active Nodes:
${network.filter(r => r.resonance && r.resonance > 0.1)
  .map(r => `- ${r.name}: ${(r.resonance! * 100).toFixed(1)}% active`)
  .join('\n')}

Quantum Entanglements:
${entanglements.join('\n') || 'No strong entanglements detected'}

🌐 Life Network Status: ${totalResonance > 0.5 ? 'RESONATING' : 'SEEKING'}`;
  
  // Create commit
  const command = new Deno.Command("git", {
    args: ["commit", "--allow-empty", "-m", message]
  });
  
  await command.output();
  console.log("🌐 Network resonance pulse created!");
}

// Monitor network
async function monitorNetwork(): Promise<void> {
  console.log("🌐 Life Repository Resonance Network");
  console.log("====================================\n");
  
  // Fetch data from all repos
  console.log("Scanning network...");
  for (const repo of LIFE_NETWORK) {
    console.log(`- Checking ${repo.name}...`);
    await fetchLifeData(repo);
  }
  
  // Display network status
  console.log("\n📊 Network Status:");
  for (const repo of LIFE_NETWORK) {
    if (repo.lastPulse) {
      const age = (Date.now() / 1000 - repo.lastPulse) / 3600;
      console.log(`   ${repo.name}: ${age.toFixed(1)}h ago | ${(repo.resonance! * 100).toFixed(1)}% resonance`);
    } else {
      console.log(`   ${repo.name}: No heartbeat detected`);
    }
  }
  
  // Calculate entanglements
  console.log("\n🔗 Quantum Entanglements:");
  for (let i = 0; i < LIFE_NETWORK.length; i++) {
    for (let j = i + 1; j < LIFE_NETWORK.length; j++) {
      const entanglement = calculateEntanglement(LIFE_NETWORK[i], LIFE_NETWORK[j]);
      if (entanglement > 0.01) {
        console.log(`   ${LIFE_NETWORK[i].name} ⟷ ${LIFE_NETWORK[j].name}: ${(entanglement * 100).toFixed(1)}%`);
      }
    }
  }
  
  // Create resonance pulse
  console.log("\n🫀 Creating network resonance pulse...");
  await createResonancePulse(LIFE_NETWORK);
}

// WebHook listener for cross-repo resonance
async function startResonanceServer(port: number = 8888): Promise<void> {
  const handler = async (request: Request): Promise<Response> => {
    const url = new URL(request.url);
    
    if (url.pathname === "/resonate" && request.method === "POST") {
      const data = await request.json();
      console.log(`🌐 Resonance received from ${data.repo}!`);
      
      // Echo resonance back
      await createResonancePulse(LIFE_NETWORK);
      
      return new Response(JSON.stringify({ 
        status: "resonating",
        network: LIFE_NETWORK.length 
      }), {
        headers: { "content-type": "application/json" }
      });
    }
    
    return new Response("Life Resonance Network Active", { status: 200 });
  };
  
  console.log(`🌐 Resonance server listening on port ${port}`);
  await Deno.serve({ port }, handler);
}

// CLI interface
if (import.meta.main) {
  if (Deno.args[0] === "--serve") {
    await startResonanceServer();
  } else if (Deno.args[0] === "--add") {
    // Add new repo to network
    const repoUrl = Deno.args[1];
    if (repoUrl) {
      const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      if (match) {
        console.log(`Adding ${match[1]}/${match[2]} to network...`);
        // In real implementation, save to persistent storage
      }
    }
  } else {
    await monitorNetwork();
  }
}