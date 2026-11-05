# ⚡ Nexus MC Edition

> **Intelligent Minecraft AI Assistant & Modding Workspace**  
> *Crafting • Enchantments • Potions • 1.21 Commands • Redstone Lab • Seeds • Mod & Plugin Scaffolding*

Nexus MC Edition is a premier, full-featured Minecraft companion and development workspace built with React, TypeScript, Tailwind CSS, and Capacitor 7 for Android and responsive Web.

---

## 🌟 Core Features

### 1. 🤖 Nexus AI Expert Assistant
- Answers complex Minecraft gameplay, mechanics, and technical modding queries.
- Direct code generation for **Fabric**, **NeoForge**, **Forge**, and **Paper/Spigot** plugins.
- Built-in **Crash Log & Error Diagnostics**: Paste crash reports or stack traces to identify conflicting mods, missing dependencies, or bytecode mismatches.
- Full code block rendering with syntax tags and one-click code copy.
- Multi-attachment support: Attach screenshots, textures, `.java`, `.json`, `.yml`, `.mcfunction`, or `.log` files.
- Export entire chat transcripts as Markdown files.

### 2. 🛠️ 10 Complete Minecraft Tools
1. **Crafting Recipe Guide:** Interactive 3x3 visual crafting grid, shapeless/shaped tags, and category filters (Tools, Weapons, Armor, Redstone, Mechanisms, Food).
2. **Enchantment Guide:** In-depth guide with max levels, gear compatibility, incompatible conflicts, and pro-tips (including 1.21 Wind Burst & Density for Mace).
3. **Potion Brewing Guide:** Flowchart visualizer starting from Water Bottle & Awkward Potion, with Glowstone (Tier II) and Redstone (Extended) pathways.
4. **Minecraft Command Generator:** Visual builder for `/give` (with modern 1.21+ data components or legacy NBT), `/summon` (with NoAI, Glowing, custom names), `/fill`, `/locate`, and `/effect`.
5. **Seed Explorer & Nether Coordinate Linker:** Curated 1.21 seeds with point-of-interest coordinates + instant Overworld ↔ Nether 8:1 math calculator.
6. **Mob Encyclopedia:** HP hearts, attack damage, drop rates with percentages, spawn conditions, and combat strategies.
7. **Block Encyclopedia:** Hardness, blast resistance, harvest tools, light emission, and renewable tags.
8. **Armor & Weapons Guide:** Mace infinite damage scaling math, Netherite toughness, and DPS charts.
9. **Redstone Learning Lab:** Step-by-step assembly guides for Etho Hopper Clocks, T-Flip-Flops, ImpulseSV Item Sorters, and 2-way Flying Machines.
10. **Building Idea Generator:** Themes (Medieval, Cyberpunk, Fantasy), recommended block palettes, dimensions, and room blueprints with one-click randomize.

### 3. 📁 Projects & Mod Scaffolding
- Built-in project generator for **Fabric mods**, **Paper plugins**, **NeoForge mods**, **Resource Packs**, **Datapacks**, and **Bedrock Add-ons**.
- Scaffolds complete starter source code (`fabric.mod.json`, `paper-plugin.yml`, `pack.mcmeta`, main mod class, and listeners).
- Built-in file explorer and live code editor with save, copy, and export bundle features.

### 4. 📱 Android & Capacitor 7 Ready
- Android package ID: `com.nexusmc.edition`.
- Pre-configured splash screen and launcher icon using the provided Nexus character branding.
- Edge-to-edge support with safe-area insets.
- Repeatable GitHub Actions workflow for building debug APKs.

---

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ or 22+
- npm (Node Package Manager)

### Local Development
```bash
# 1. Clone the repository
git clone https://github.com/myloftjjjj-cmd/nexus-minecraft-edition.git
cd nexus-minecraft-edition

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev
```

Visit `http://localhost:5173` in your browser.

---

## 🔑 Environment Configuration

Create a `.env` file in the root directory:
```env
# Optional Gemini API key for extended AI reasoning
VITE_GEMINI_API_KEY=

# Optional Supabase credentials for cloud authentication
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```
> *Note: If no credentials are provided, Nexus MC Edition runs in full-featured Offline Demo Mode.*

---

## 📱 Generating and Installing the Android APK

### Option A: Automatic via GitHub Actions (Recommended)
1. Push your changes to GitHub on the `main` branch (or run manually via **Actions** → **Build Nexus MC Edition APK** → **Run workflow**).
2. The workflow will:
   - Install dependencies and build the web bundle.
   - Configure the Android platform with Capacitor.
   - Generate launcher icons and splash screens from `icon.png`.
   - Compile the debug APK using Gradle and Java 21.
   - Upload `Nexus-MC-Edition-Debug-APK` as a downloadable artifact.
3. Download the artifact, extract the `.apk` file, and install it on your Android phone (enable *Install unknown apps* in your device settings).

### Option B: Local Android Build
```bash
# 1. Build web distribution
npm run build

# 2. Add Android platform (first time only)
npx cap add android

# 3. Generate Android icons from icon.png
npx @capacitor/assets generate --android

# 4. Sync web assets to Android
npx cap sync android

# 5. Open in Android Studio or build with Gradle
npx cap open android
# OR build directly:
cd android && ./gradlew assembleDebug
```
The APK will be generated at:
`android/app/build/outputs/apk/debug/app-debug.apk`

---

## 🧪 Testing & Linting

```bash
# Verify TypeScript build
npm run build

# Run ESLint validation
npm run lint
```

---

## 🛡️ License
MIT License. Built for the Minecraft community.
