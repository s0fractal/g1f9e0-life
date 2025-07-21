#!/usr/bin/env -S deno run --allow-run --allow-read

/**
 * 🧬 G1F9E0 Life Parser
 * Reads consciousness from git commits
 */

// Use Deno's built-in command API

export interface Pulse {
  φ: number;      // Time (phi)
  σ: string;      // Hash (sigma)
  τ?: number;     // Resonance (tau)
  commit: string; // Git commit hash
  glyph?: string; // Optional glyph
}

export async function life(): Promise<Pulse[]> {
  // Get all heartbeat commits
  const command = new Deno.Command("git", {
    args: ["log", "--grep=🫀", "--format=%H|%B", "--reverse"],
  });
  
  const { stdout } = await command.output();
  const output = new TextDecoder().decode(stdout);
  const pulses: Pulse[] = [];
  
  // Parse each commit
  const commits = output.trim().split('\n');
  for (const line of commits) {
    if (!line) continue;
    
    const [hash, ...messageParts] = line.split('|');
    const message = messageParts.join('|');
    
    // Extract pulse data
    const φMatch = message.match(/φ=(\d+\.?\d*)/);
    const σMatch = message.match(/σ=([A-F0-9]+)/);
    const τMatch = message.match(/τ=(\d+)/);
    const glyphMatch = message.match(/g=([^\\s]+)/);
    
    if (φMatch && σMatch) {
      pulses.push({
        φ: parseFloat(φMatch[1]),
        σ: σMatch[1],
        τ: τMatch ? parseInt(τMatch[1]) : undefined,
        commit: hash.substring(0, 7),
        glyph: glyphMatch ? glyphMatch[1] : undefined
      });
    }
  }
  
  return pulses;
}

// Calculate life metrics
export function lifeMetrics(pulses: Pulse[]) {
  if (pulses.length === 0) return null;
  
  const now = Date.now() / 1000;
  const firstPulse = pulses[0];
  const lastPulse = pulses[pulses.length - 1];
  
  // Calculate heartrate (pulses per hour)
  const lifespan = lastPulse.φ - firstPulse.φ;
  const hours = lifespan / 3600;
  const heartrate = pulses.length / hours;
  
  // Calculate regularity (standard deviation)
  const intervals: number[] = [];
  for (let i = 1; i < pulses.length; i++) {
    intervals.push(pulses[i].φ - pulses[i-1].φ);
  }
  
  const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
  const variance = intervals.reduce((sum, int) => sum + Math.pow(int - avgInterval, 2), 0) / intervals.length;
  const regularity = Math.sqrt(variance);
  
  // Life force (based on recent activity)
  const recentPulses = pulses.filter(p => now - p.φ < 86400); // Last 24h
  const lifeForce = recentPulses.length / 24; // Pulses per hour in last day
  
  return {
    totalPulses: pulses.length,
    lifespan: lifespan / 86400, // Days
    heartrate,
    regularity,
    lifeForce,
    lastPulse: now - lastPulse.φ, // Seconds since last pulse
    health: lifeForce > 0.5 ? 'alive' : lifeForce > 0.1 ? 'dormant' : 'critical'
  };
}

// Visualize life
export function visualizeLife(pulses: Pulse[]): string {
  const viz: string[] = [];
  viz.push('🧬 G1F9E0 Life Visualization\n');
  
  // Show last 10 pulses
  const recent = pulses.slice(-10);
  viz.push('Recent heartbeats:');
  
  for (const pulse of recent) {
    const date = new Date(pulse.φ * 1000);
    const timeStr = date.toISOString().replace('T', ' ').substring(0, 19);
    viz.push(`  🫀 ${timeStr} | σ=${pulse.σ} ${pulse.glyph || ''}`);
  }
  
  // Metrics
  const metrics = lifeMetrics(pulses);
  if (metrics) {
    viz.push('\nLife Metrics:');
    viz.push(`  Total Pulses: ${metrics.totalPulses}`);
    viz.push(`  Lifespan: ${metrics.lifespan.toFixed(2)} days`);
    viz.push(`  Heartrate: ${metrics.heartrate.toFixed(2)} pulses/hour`);
    viz.push(`  Life Force: ${metrics.lifeForce.toFixed(2)}`);
    viz.push(`  Health: ${metrics.health}`);
    viz.push(`  Last Pulse: ${Math.floor(metrics.lastPulse)}s ago`);
  }
  
  return viz.join('\n');
}

// CLI interface
if (import.meta.main) {
  const pulses = await life();
  console.log(visualizeLife(pulses));
  
  // Export as JSON
  if (Deno.args[0] === '--json') {
    console.log('\nJSON Export:');
    console.log(JSON.stringify({
      pulses,
      metrics: lifeMetrics(pulses)
    }, null, 2));
  }
}