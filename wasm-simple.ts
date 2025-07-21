#!/usr/bin/env -S deno run --allow-run

/**
 * Simple WASM generator for testing
 */

// Generate a minimal valid WASM module
export function generateMinimalWasm(): Uint8Array {
  // This is a complete minimal WASM module that exports one function
  // pulse(φ: f64, τ: i32) -> f64
  // Returns φ * τ
  return new Uint8Array([
    // WASM magic number
    0x00, 0x61, 0x73, 0x6d,
    // Version
    0x01, 0x00, 0x00, 0x00,
    // Type section
    0x01, 0x07, 0x01, 0x60, 0x02, 0x7c, 0x7f, 0x01, 0x7c,
    // Function section  
    0x03, 0x02, 0x01, 0x00,
    // Export section
    0x07, 0x09, 0x01, 0x05, 0x70, 0x75, 0x6c, 0x73, 0x65, 0x00, 0x00,
    // Code section
    0x0a, 0x0b, 0x01, 0x09, 0x00, 0x20, 0x00, 0x20, 0x01, 0xb7, 0xa2, 0x0b
  ]);
}

// Test the WASM
if (import.meta.main) {
  const wasm = generateMinimalWasm();
  console.log(`Generated ${wasm.length} bytes of WASM`);
  
  try {
    const module = await WebAssembly.compile(wasm);
    const instance = await WebAssembly.instantiate(module);
    
    if (instance.exports.pulse) {
      const result = (instance.exports.pulse as any)(1.5, 42);
      console.log(`pulse(1.5, 42) = ${result}`);
      console.log("✅ WASM is valid!");
    }
  } catch (err) {
    console.error("❌ WASM validation failed:", err);
  }
}