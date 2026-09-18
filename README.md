# 🐾 NekoType - Original Anime Typing Desktop Companion for Ubuntu GNOME

A lightweight, production-grade native desktop companion widget inspired by the "Bongo Cat" concept, featuring an **original chibi anime cat character** ("Neko") sitting behind a miniature mechanical keyboard beside the bottom Ubuntu dock.

Designed specifically to match modern pink/purple/cyan anime desktop aesthetics on Ubuntu GNOME (X11 & Wayland).

---

## ✨ Features

- **100% Transparent Desktop Integration**:
  - Frameless, zero window borders, zero titlebar, 100% transparent background.
  - Automatically aligns beside the Ubuntu dock at the bottom-right (or bottom-center / bottom-left).
  - Configured with `skip_taskbar: true` (no dock/alt-tab clutter) and `always_on_top: true`.
  - Non-intrusive: clicking the widget does not steal keyboard focus from your active code editor or terminal.
- **Original Anime Chibi Character**:
  - High-precision vector SVG rig with crisp rendering at any display scaling (75%, 100%, 125%, 150%).
  - 7 animated states:
    1. `IDLE`: Gentle breathing cycle, natural blinking, ear twitches, mouse cursor tracking.
    2. `TYPING_LEFT`: Left paw tap down, depressed keycap, cute focused gaze.
    3. `TYPING_RIGHT`: Right paw tap down, depressed keycap.
    4. `FAST_TYPING`: Rhythmic paw flurry, determined anime sparkle eyes, tiny pastel star sparkles.
    5. `SLEEPING`: Head resting down, closed serene eyes, drifting "Zzz" bubble particles after 20s inactivity.
    6. `HAPPY`: Smiling arch eyes (`^ω^`), cute cheek blush, floating mini heart on click/pet.
    7. `SURPRISED`: Dilated starry pupils, perked ears, cute "!" reaction mark on sudden typing after sleep.
- **Global Keyboard Detection**:
  - Event-driven X11 XRecord background listener (`rdev`).
  - Zero root/sudo permissions needed on standard Ubuntu X11 sessions.
  - Keystrokes per second (KPS) calculation with key-repeat throttling.
- **Interactive Glassmorphic Menu**:
  - Click the cat to open an acrylic blurred floating settings menu.
  - Switch palettes: **Sakura Dream**, **Cyber Midnight**, **Calico Peach**, **Caramel Latte**.
  - Change scale (75% / 100% / 125% / 150%).
  - Change dock position (Left / Center / Right).
  - Toggle typing animation, visual effects, always-on-top, and autostart on Ubuntu boot.
- **Ultra-low Resource Consumption**:
  - Rust backend + WebKitGTK with hardware-accelerated CSS transforms.
  - Idle CPU usage < 0.3%, memory footprint < 40MB.

---

## 🚀 Quick Start

### 1. Run the Widget
```bash
./run.sh
```

### 2. Development Mode
```bash
pnpm run dev
# In another terminal:
export PATH="$HOME/.cargo/bin:$PATH"
pnpm run tauri dev
```

### 3. Build Production Binary
```bash
pnpm tauri build --no-bundle
```
The optimized standalone binary (with embedded frontend) will be created at:
`src-tauri/target/release/bongo-cat`

---

## 🛠️ System Architecture

```
bongo-cat/
├── run.sh                     # Convenient single-click launcher
├── package.json               # Frontend dependencies (Tauri API, Vite, TypeScript)
├── vite.config.ts             # Vite bundler configuration
├── index.html                 # App shell & mounting nodes
├── src/
│   ├── main.ts                # App initialization & Tauri IPC event bridges
│   ├── character/
│   │   ├── assets.ts          # Original vector SVG definitions (cat rig & keyboard)
│   │   ├── rig.ts             # Layered SVG rig controller (paws, eyes, mouth, keys)
│   │   └── themes.ts          # 4 colorway theme palettes & CSS variables
│   ├── animation/
│   │   └── state_machine.ts   # State controller, transitions, inactivity timers
│   ├── effects/
│   │   └── particles.ts       # Canvas particle engine (Zzz, sparkles, hearts, '!')
│   ├── menu/
│   │   └── context_menu.ts    # Glassmorphic floating context menu
│   └── styles/
│       ├── main.css           # Base styles & layout
│       ├── character.css      # Hardware-accelerated CSS animations
│       └── menu.css           # Glassmorphic acrylic blur & controls
└── src-tauri/
    ├── Cargo.toml             # Rust dependencies (tauri, rdev, x11, serde)
    ├── tauri.conf.json        # Transparent frameless window & capabilities
    ├── icons/                 # Original anime desktop icons
    └── src/
        ├── lib.rs             # Tauri application builder & IPC command handlers
        ├── main.rs            # Binary entry point
        ├── keyboard.rs        # Dedicated X11 global keyboard hook thread
        ├── dock_detector.rs   # GNOME workarea & dock position engine
        ├── config.rs          # Settings persistence (~/.config/bongo-cat/settings.json)
        ├── autostart.rs       # XDG autostart manager (~/.config/autostart/)
        └── window.rs          # Window dimensions, positioning & GTK properties
```

---

## 🔍 How It Works

### Global Keyboard Detection
- Under **X11** (`XDG_SESSION_TYPE=x11`), the app runs a background listener thread using the `rdev` crate connected to the X11 `XRecord` extension (`libxtst`).
- This allows passive capture of raw keypresses across all system windows without grabbing keyboard input or blocking typing.
- No `sudo` or `root` permissions are required.
- Under **Wayland**, Linux isolates input by default; global input requires reading `/dev/input/event*` which requires adding your user to the `input` group: `sudo usermod -aG input $USER`.

### Ubuntu GNOME Dock Alignment
- The widget inspects the `_NET_WORKAREA` X11 property to determine the exact screen boundaries excluding the top panel and the bottom dock.
- On standard Ubuntu 24.04 with Dash-to-Dock, the widget automatically anchors itself right above the dock in the bottom-right corner with a comfortable 20px padding.

---

## ⚙️ Configuration

Settings are saved locally in:
`~/.config/bongo-cat/settings.json`

Autostart desktop entry is managed in:
`~/.config/autostart/bongo-cat-widget.desktop`
