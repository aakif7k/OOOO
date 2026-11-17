# 🚇 Our Metro Journey — Cinematic Proposal Experience 💕

> **"Next stop: Final Stop · இறுதி நிறுத்தம்"**  
> A mobile-first romantic proposal experience set inside a modern stylized metro train ride, built with **Vite + React 18 + TypeScript**, **Tailwind CSS**, and **Framer Motion**.

---

## 🚪 Creative Metro Door System (`CreativeMetroDoors.tsx`)

A custom-engineered metro door component that delivers a tactile, cinematic transit feel:

- **Double-Glazed Observation Windows with Condensation**:
  - Realistic rounded window frames with rubber seal trims and interior shadows.
  - Frosted mist vignette across the glass panes.
  - **Interactive Finger-Drawn Heart (❤️)**: Hand-drawn sketched heart on the foggy right window that pulses gently. Tapping or clicking the window generates glowing particle sparkles and triggers a heart pulse.
  - Rushing scenery and tunnel light streaks are visibly seen moving through the door glass during travel.
- **Overhead LED Transom Warning Marquee**:
  - State-aware glowing LED indicator:
    - *Closing:* `⚠ DOORS CLOSING · கதவுகள் மூடுகின்றன ⚠` with pulsing alert bulb.
    - *Cruising:* `EN ROUTE · [STATION NAME]` with calm cyan illumination.
    - *Opening:* `✓ DOORS OPENING · கதவுகள் திறக்கின்றன ✓` with radiant green glow.
- **Pneumatic Mechanics & Procedural Web Audio**:
  - Heavy pneumatic spring damping (`stiffness: 220`, `damping: 26`).
  - Procedural Web Audio API sound effects:
    - `playPneumaticHiss()`: Pressurized air whoosh upon unlatching/sealing.
    - `playDoorLatch()`: Solid mechanical latch thud when the doors compress together.
    - Dual-tone melodic arrival chime on opening.
- **Volumetric Light Spill**:
  - When doors slide open, a radial burst of warm golden platform light floods into the carriage from the center opening.

---

## 📱 Mobile-First Architecture & Design Principles

Designed specifically for **smartphones (390×844 primary)** with seamless responsiveness from compact screens (**360×640**) to large devices (**430×932**). On desktop browsers, it cleanly presents as a centered mobile experience (`max-w-[480px]`) with a soft atmospheric backdrop.

### 🚫 Non-Negotiable Constraints Met
1. **Zero Photos:** No personal photo dependencies, broken image links, or photo upload requirements. 100% vector illustrations, kinetic typography, and icons.
2. **Zero Overlap or Clipped Text:** Viewport-bounded layouts utilizing `100dvh`, fluid `clamp()` typography, safe-area padding (`env(safe-area-inset-bottom)`), and soft fade masks on long text.
3. **Zero Random Mascots:** No cartoon animals or space themes. Features a clean, flat-vector commuter couple holding hands.
4. **Forbidden Words Checked:** Strictly zero usage of forbidden terms anywhere in the codebase, UI, comments, or documentation.
5. **No Neon Clashes:** Uses soft romantic pastels (cream `#FFF7F0`, blush pink `#FFAFCC`, lavender `#CDB4DB`, baby blue `#BDE0FE`, and deep ink `#2B2A4C`).

---

## 🚉 The 5 Metro Stations (Chapters)

1. **Station 01: The Beginning · தொடக்கம்**  
   - Scene: Pastel dawn sunrise with kapaleeshwarar-style temple gopuram silhouette and fluttering birds.
   - Tagline: *"Every beautiful story begins somewhere."*
2. **Station 02: Little Things · சின்ன சின்ன விஷயங்கள்**  
   - Scene: Bright daylight with coconut palms, elevated viaduct, and auto-rickshaw silhouette.
   - Tagline: *"Sometimes, the smallest things mean the most."*
   - Ending Line: *"Funny how someone can become so special without even trying. ❤️"*
3. **Station 03: Our Little World · நமது உலகம்**  
   - Scene: Golden hour sunset with shoreline, lighthouse with rotating light beam, and beach kites.
   - Tagline: *"Some dreams are too beautiful to stay dreams."*
4. **Station 04: My Confession · மனம் திறந்து**  
   - Scene: Dusk to evening twilight with clock tower, glowing city windows, and jasmine garlands.
   - Tagline: *"Some feelings are too beautiful to keep hidden."*
   - **Cinematic Reveal:** The lights dim, rail sound drops to near silence, a slow heartbeat sounds, and **"I LIKE YOU. ❤️"** appears letter-by-letter with a warm glowing bloom and heart shockwaves.
5. **Station 05: Final Stop · இறுதி நிறுத்தம்**  
   - Scene: Starry night with full glowing moon, shooting stars, and warm glowing platform lanterns.
   - Tagline: *"Maybe the end of this journey could be the beginning of something beautiful."*
   - Proposal question: *"Will you give me a chance to turn my little dream into our reality? ❤️"*

---

## 💍 Proposal & Celebration Interaction

- **YES ❤️ Button:** Prominent, pulsing, and glowing. Clicking triggers synthesized celebration fanfare, multi-angle colorful canvas confetti, floating hearts, and the celebration card featuring the commuter couple holding hands.
- **NO 🙈 Button:** Playfully dodges away within safe bounds on hover/tap, updates pleading copy (*"Are you sure? 🥺"*, *"Konjam yosichu paaru 💭"*, *"Please? 🌸"*), shrinks slightly while YES grows, and eventually morphs into YES.
- **Replay Journey ↺:** Allows seamless replay from the beginning.

---

## 🚀 Development & Production

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build

# Preview production build locally
npm run preview
```
