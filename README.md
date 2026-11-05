# ⚡ AuraTypes - Touch Typing Master & 3D Arcade (Tauri v2 + React)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Tauri v2](https://img.shields.io/badge/Tauri-v2-blue.svg)](https://v2.tauri.app/)
[![React 19](https://img.shields.io/badge/React-19-61dafb.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-blue.svg)](https://www.typescriptlang.org/)

AuraTypes is an open-source, high-performance touch typing mastery simulator and 3D arcade gaming engine featuring mechanical switch sound synthesis, Grade V8.5 certification, and native cross-platform binaries (Windows `.exe` and Linux `.deb`).

---

## 🌟 Key Features

- **35 Comprehensive Progressive Levels:** Dual-hand tactile calibration, anchor bumps, home row symmetry, and dedicated training for the top (QWERTYUIOP) and bottom (ZXCVBNM,.) rows.
- **10 Special C++ Systems Levels:** Real-world programming syntax from beginners to hardcore competitive programmers.
- **Realistic Mechanical Switch Sound Engine:** Authentic acoustics for Cherry MX Blue, Red, Brown, and Crystal Pop switches.
- **3D Arcade Game Arena:** Falling word rain with Three.js rendering and dynamic adaptive difficulty.
- **Stickman Fighter & Multiplayer Arena:** Real-time gamified typing battles.
- **Official Diploma & Certification:** Tamper-proof Grade V8.5 Grandmaster Diploma with cryptographic verification.
- **Privacy-by-Design:** 100% client-side execution with zero keylogging, zero telemetry, and zero ads.

---
## 🚀 Download & Install (For Normal Users)

**Ready to use! No coding required.** Download the latest version for your system directly from the Releases page.

### 🐧 Linux (Debian / Ubuntu)
👉 **[⬇️ Click Here to Download .deb Package](https://github.com/legendslab-official/Aura-Types/releases/latest)**

Open your terminal and run these commands to install:
```bash
cd ~/Downloads
sudo dpkg -i AuraTypes_8.5.0_amd64.deb
sudo apt install -f 

## 💻 Running Locally

### 1. Web Version:
```bash
# Clone the repository
git clone https://github.com/your-username/auratypes.git
cd auratypes

# Install dependencies
npm install

# Start development server
npm run dev
```

### 2. Desktop Version (Tauri v2):
```bash
# Start Tauri in development mode with live reload
npm run tauri:dev
```

---

## 📦 Building Native Binaries

### Windows `.exe` (NSIS Installer):
```bash
npm run build:exe
```
Output: `src-tauri/target/release/bundle/nsis/AuraTypes_8.5.0_x64-setup.exe`

### Linux `.deb` (Debian / Ubuntu Package):
```bash
npm run build:deb
```
Output: `src-tauri/target/release/bundle/deb/auratypes_8.5.0_amd64.deb`

Detailed build instructions are in [`TAURI_BUILD_GUIDE.md`](./TAURI_BUILD_GUIDE.md).

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
Published under the MIT License by the AuraTypes Community.
