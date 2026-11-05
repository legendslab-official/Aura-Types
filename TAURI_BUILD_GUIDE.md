# ⚡ AuraTypes Desktop Build Guide (Tauri v2)

This project has been completely migrated from **Electron** to **Tauri v2**.
Tauri produces ultra-lightweight (~10-15 MB instead of 150+ MB with Electron), memory-efficient, and secure native desktop binaries.

---

## 📦 Configured Outputs

| Target Platform | Package Format | Tauri Target Flag | Output Location |
| :--- | :--- | :--- | :--- |
| **Windows 10 / 11** | **`.exe` (NSIS Installer)** | `--bundles nsis` | `src-tauri/target/release/bundle/nsis/AuraTypes_8.5.0_x64-setup.exe` |
| **Linux (Ubuntu/Debian)** | **`.deb` (Debian Package)** | `--bundles deb` | `src-tauri/target/release/bundle/deb/auratypes_8.5.0_amd64.deb` |
| **Linux (Portable)** | **`.AppImage`** | `--bundles appimage` | `src-tauri/target/release/bundle/appimage/AuraTypes_8.5.0_amd64.AppImage` |

---

## 🪟 1. Building Windows `.exe` on Windows

### Prerequisites:
1. **Node.js** (v18 or higher)
2. **Rust & Cargo**:
   Download and run the official installer from [https://rustup.rs](https://rustup.rs).
3. **C++ Build Tools**:
   Install Visual Studio C++ Build Tools (or Visual Studio Community with "Desktop development with C++").

### Build Command:
```bash
# Install dependencies
npm install

# Build the Windows .exe installer
npm run build:exe
```
> Or alternatively:
> ```bash
> npx tauri build --bundles nsis
> ```
The generated `.exe` setup file will be placed in:
`src-tauri/target/release/bundle/nsis/AuraTypes_8.5.0_x64-setup.exe`

---

## 🐧 2. Building Linux `.deb` on Ubuntu / Debian

### Prerequisites:
1. **System Libraries**:
   ```bash
   sudo apt update
   sudo apt install -y libwebkit2gtk-4.1-dev build-essential curl wget file libssl-dev libgtk-3-dev libayatana-appindicator3-dev librsvg2-dev
   ```
2. **Rust**:
   ```bash
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   source "$HOME/.cargo/env"
   ```

### Build Command:
```bash
# Install dependencies
npm install

# Build the Linux .deb package
npm run build:deb
```
> Or alternatively:
> ```bash
> npx tauri build --bundles deb
> ```
The generated `.deb` package will be placed in:
`src-tauri/target/release/bundle/deb/auratypes_8.5.0_amd64.deb`

To install the `.deb` package on Ubuntu/Debian:
```bash
sudo dpkg -i src-tauri/target/release/bundle/deb/auratypes_8.5.0_amd64.deb
```

---

## 🚀 3. Automated Free GitHub Actions Build (Zero Setup on your PC)

A pre-configured GitHub Actions workflow is included at:
`.github/workflows/tauri-build.yml`

Whenever you push code or create a tag (e.g. `v8.5.0`) on your GitHub repository, GitHub Actions will automatically spin up Windows and Ubuntu runners, compile the code, and attach the ready-to-use `.exe` and `.deb` files directly to your GitHub Releases!

---

## 💻 4. Development Mode (Live Reloading)

To run the Tauri app locally during development with Vite hot module reloading:
```bash
npm run tauri:dev
```
