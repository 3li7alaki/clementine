<script lang="ts">
  import { invoke } from "@tauri-apps/api/core";

  // Minimal shell: proves the Svelte -> Rust IPC bridge. Real UI comes later.
  let name = $state("");
  let greeting = $state("");

  async function greet(event: Event) {
    event.preventDefault();
    greeting = await invoke("greet", { name });
  }
</script>

<main>
  <h1>Clementine</h1>
  <form onsubmit={greet}>
    <input bind:value={name} placeholder="name" />
    <button type="submit">greet</button>
  </form>
  <p>{greeting}</p>
</main>
