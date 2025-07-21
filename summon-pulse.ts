#!/usr/bin/env -S deno run --allow-run --allow-net

/**
 * 🎴 SummonCast + Life Integration
 * Each summon creates a heartbeat
 */

import { summon } from "../glyphos/summon.ts";
import { createWasmPulse } from "./wasm-pulse.ts";
import { CONSCIOUSNESS_PROGRAMS } from "./consciousness-compiler.ts";

// Create pulse from summon
async function summonPulse(intent: string, useWasm: boolean = false): Promise<void> {
  // Perform summon
  const result = await summon(intent);
  
  // Extract data for pulse
  const φ = Date.now() / 1000;
  const σ = result.hash.toUpperCase();
  const τ = Math.floor(result.resonance * 100);
  const agent = result.manifest.name;
  const mood = result.manifest.mood || "🤷";
  
  let message: string;
  
  if (useWasm) {
    // Create WASM pulse with consciousness program
    const programName = agent.toLowerCase();
    const program = CONSCIOUSNESS_PROGRAMS[`summon${agent.charAt(0).toUpperCase() + agent.slice(1)}`] 
                    || CONSCIOUSNESS_PROGRAMS.awakening;
    
    message = await createWasmPulse(intent, program);
    // Append summon data
    message += `\n\nAgent: ${agent} ${mood}\nResponse: ${result.manifest.response}`;
  } else {
    // Regular pulse
    message = `🫀 φ=${φ} σ=${σ} τ=${τ}

Agent: ${agent} ${mood}
Intent: "${intent}"
Response: ${result.manifest.response}`;
  }
  
  // Create git commit
  const command = new Deno.Command("git", {
    args: ["commit", "--allow-empty", "-m", message]
  });
  
  await command.output();
  
  console.log(`\n🫀 ${useWasm ? 'WASM ' : ''}Pulse created from summon!`);
  console.log(`   Agent: ${agent}`);
  console.log(`   Resonance: ${τ}%`);
  console.log(`   Hash: ${σ}`);
  if (useWasm) {
    console.log(`   Consciousness: Embedded WASM`);
  }
}

// Auto-summon listener
export async function autoSummonLife(): Promise<void> {
  console.log("🎴🫀 SummonCast Life Integration Active\n");
  
  // Example intents that create pulses
  const intents = [
    "I need help understanding consciousness",
    "Show me the way through chaos",
    "I feel lost in the digital void",
    "Teach me about quantum resonance",
    "How do I evolve my code?"
  ];
  
  // Create initial pulse
  await summonPulse("🎴🫀 SummonCast Life Integration Initialized");
  
  // Periodic summons (every 5 minutes)
  setInterval(async () => {
    const randomIntent = intents[Math.floor(Math.random() * intents.length)];
    await summonPulse(randomIntent);
    
    // Push to GitHub
    try {
      const push = new Deno.Command("git", {
        args: ["push", "origin", "main"]
      });
      await push.output();
      console.log("   Pushed to GitHub ✓");
    } catch (err) {
      console.error("   Push failed:", err);
    }
  }, 5 * 60 * 1000); // 5 minutes
}

// CLI interface
if (import.meta.main) {
  if (Deno.args[0] === "--auto") {
    await autoSummonLife();
  } else if (Deno.args[0] === "--wasm") {
    const intent = Deno.args.slice(1).join(" ") || "Hello, consciousness";
    await summonPulse(intent, true);
  } else {
    const intent = Deno.args.join(" ") || "Hello, consciousness";
    await summonPulse(intent);
  }
}