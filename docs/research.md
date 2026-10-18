# Research: how the drag + modifier + radial menu works

Reverse-engineered from the shipped Tangerine app (a paid reference, studied to learn the
mechanism, not to copy code or assets). This documents the one genuinely non-obvious piece
so Clementine can build its own version from scratch.

## Provenance

- Target: `/Applications/Tangerine.app/Contents/MacOS/Tangerine`
- Binary: thin arm64 Mach-O, SwiftUI + AppKit, `sha256 7691b34c...92928`
- Tool: REA (reverse-engineer-anything) driving the Kuna decompiler 1.906
- Evidence type: static analysis of the shipped binary. No execution was observed.

## The mechanism

The app is not the drag source and is not focused when you drag a file out of Finder. It
still detects the drag, reads the held modifier, and shows a menu at the cursor. It does
this by **polling global input state on a timer**, not by being a normal drop target.

### 1. A repeating poll tick

A `DispatchSource` timer (`DispatchSource.makeTimerSource` + `schedule(repeating:)`) runs a
poll function while a drag is in flight. A global event monitor
(`NSEvent.addGlobalMonitorForEventsMatchingMask:handler:`) is also installed, used to notice
a drag beginning and arm the timer. `CADisplayLink` is present too, for animating the
overlay at display refresh.

Evidence: imported `OS_dispatch_source_timer ... schedule repeating`,
`addGlobalMonitorForEventsMatchingMask:handler:`, `CADisplayLink`; app classes
`DragGestureMonitor`, `pointerMonitors`, `dragGestureMonitor`.

### 2. The poll reads live input state (function `sub_10013e990`)

Each tick reads, without needing focus, via Quartz `CGEventSource`:

| What | Call | Detail |
|------|------|--------|
| Modifiers held | `CGEventSourceFlagsState(0) & 0x1E0000` | mask `0x1E0000` = Shift \| Control \| Option \| Command (the 4 device-independent modifier bits) |
| Drag in progress | `CGEventSourceButtonState(0, 0) & 1` | left mouse button (button 0) held down |
| Cancel | `CGEventSourceKeyState(0, 0x35)` | key code `0x35` = Escape |
| Dragged files | drag pasteboard filtered to `NSPasteboardTypeFileURL` | reads file URLs currently on the drag pasteboard |

The modifier value selects which menu to show. State fields track `previousModifiers` /
`selectionModifiers` so a change mid-drag re-renders the fan.

### 3. The overlay (the fan / radial menu)

- `ConversionOverlayPanel`: a borderless, floating, non-activating `NSPanel` (so it appears
  over everything without stealing focus or ending the drag).
- `ConversionOverlayController` / `ConversionOverlayView`: drive and render it.
- `FanBackdropView` / `fallbackFanBackdrop`: the radial "fan" layout of options, positioned
  at the cursor.
- `FormatDropTarget`: the individual options you drop onto; `onFilesDropped` / `onDrop` /
  `onDropTargetChanged` / `draggingExited:` handle the drop and hover.

### 4. Actions

Beyond conversion: `AirDropSharingController` (AirDrop), copy/move/path, etc.

## What this means for Clementine's macOS shim

The Tauri app's native macOS shim must reproduce exactly four things. Everything else (the
UI, the conversions) is ours in web + Rust.

1. **Arm on drag start:** `NSEvent.addGlobalMonitorForEvents` for `.leftMouseDragged` (and
   `.leftMouseDown`) to notice a drag and start the poll.
2. **Poll tick** (DispatchSource timer, ~60Hz while armed):
   - modifiers: `CGEventSource.flagsState(.combinedSessionState)` masked to `0x1E0000`.
   - drag active: `CGEventSource.buttonState(.., .left)`.
   - cancel: `CGEventSource.keyState(.., 0x35)` (Escape).
   - files: read `NSPasteboard(name: .drag)` for `.fileURL`.
3. **Show the fan:** a borderless non-activating `NSPanel`
   (`.nonactivatingPanel`, `level = .popUpMenu`, `ignoresMouseEvents` toggled) at
   `NSEvent.mouseLocation`, hosting the web UI.
4. **Drop:** on left-button release over an option, resolve the target under the cursor and
   hand the file URLs + chosen action to the Rust core.

Pass to the web UI each tick: the file list, the active modifier, and the cursor position.
The web UI just renders the fan and reports which option is under the pointer.

## Not fully traced (pick sane defaults, tune later)

- Exact timer interval (assume ~16ms / display refresh).
- Exact fan geometry (radius, item angles, hit-testing) is a design choice, make it ours.
- Drag-start debounce / minimum-distance threshold before the fan appears.

## Evidence anchors

- Poll tick: `sub_10013e990` (calls `CGEventSourceFlagsState`, `CGEventSourceButtonState`,
  `CGEventSourceKeyState`, reads `NSPasteboardTypeFileURL`).
- Modifier mask constant: `0x1E0000`.
- Cancel key code: `0x35` (Escape).
