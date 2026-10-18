import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// Tauri sets this when targeting a physical device over the network.
const host = process.env.TAURI_DEV_HOST;

// https://vite.dev/config/
export default defineConfig(() => ({
  plugins: [svelte()],

  // Tauri-tailored dev options (only applied under `tauri dev` / `tauri build`):
  // 1. don't let Vite clear the screen and hide Rust errors
  clearScreen: false,
  server: {
    // 2. Tauri needs a fixed port; fail if it is taken
    port: 1420,
    strictPort: true,
    host: host || "127.0.0.1",
    hmr: host ? { protocol: "ws", host, port: 1421 } : undefined,
    // 3. don't watch the Rust sources
    watch: { ignored: ["**/src-tauri/**"] },
  },
}));
