<div align="center">

# Clementine

**Zero-click file converting and tooling for your desktop.**
Drag a file, hold a key, drop it. That's it.

[![License: MIT](https://img.shields.io/badge/license-MIT-f4c430?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/macOS-13%2B-1b1b1b?style=flat-square&logo=apple)](#install)
[![Built with Tauri](https://img.shields.io/badge/built%20with-Tauri%202-ff8c42?style=flat-square&logo=tauri&logoColor=white)](https://tauri.app)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-support-ff5e5b?logo=kofi&logoColor=white)](https://ko-fi.com/3li7alaki)

</div>

---

## What is this

Clementine is a tiny, fast, offline file tool. You drag a file out of your file manager,
hold a modifier key, and a radial menu blooms under your cursor. Drop onto a format to
convert, or onto an action to crop, compress, trim, and more. No window to open, no upload,
no waiting. Your files never leave the machine.

> **Why another one?** Built in the open, MIT licensed, themeable, and yours to extend.

## Demo

<div align="center">

<!-- Screenshots and a demo GIF land here once the first UI is built. -->
_Screenshots and a demo clip are coming as soon as the first build is clickable._

</div>

## How it works

1. **Grab** a file and start dragging it.
2. **Hold** a modifier mid-drag:
   - `Shift` to convert (images, video, audio, documents).
   - `Cmd` for file tools (compress, crop, trim, split, merge).
   - `Ctrl` for quick actions (copy path, move, share).
3. **Drop** onto the option. The radial menu sits right under the pointer, so it is one
   motion from grab to done.

## Features

- Convert across images, video, audio, documents, and archives.
- File tools: compress, crop, trim, split, merge.
- Everything runs locally on bundled open tools (ffmpeg, exiftool, and friends).
- Themeable UI: colors, favorite formats, your own ordering.
- Your own presets: save a chain of tools as one drop target.

## Install

Early days. Builds are not published yet. Build from source below.

## Build from source

> Prerequisites: [Rust](https://rustup.rs), [Node.js](https://nodejs.org), and the
> [Tauri 2 prerequisites](https://tauri.app/start/prerequisites/) for your OS.

```bash
git clone https://github.com/3li7alaki/clementine.git
cd clementine
# setup + run commands land here with the first Tauri scaffold
```

## Built with

- **[Tauri 2](https://tauri.app)**: Rust core, small native binary.
- **Web UI**: one themeable front end, reused across platforms.
- Open conversion tools (ffmpeg, exiftool, cwebp, and more).

## Roadmap

- [ ] macOS: drag + modifier radial menu
- [ ] Core conversions (image / video / audio / docs)
- [ ] File tools (compress, crop, trim)
- [ ] Themes and custom presets
- [ ] Windows support

## Support

If Clementine saves you time, you can buy me a coffee.

[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/3li7alaki)

## License

MIT. See [LICENSE](LICENSE).
