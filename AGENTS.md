# Joshua Portfolio — AGENTS.md
> Master Directive & Taste Protocol for Autonomous Coding Agents
> Derived from [Leonxlnx/taste-skill](https://github.com/Leonxlnx/taste-skill) (`skills-lock.json`)

---

## 1. Project Mission & Identity

- **Project**: Joshua's Personal Portfolio & Engineering Showcase (`portofolio-joshua`).
- **Archetype**: Premium Utilitarian Minimalism & Editorial Portfolio (Document / Archive Style).
- **Core Narrative Spine**: *Archive / Dossier* & *Precision Instrument* — celebrating deliberate craft, high-caliber engineering, technical rigor, and tasteful restrained aesthetics.
- **Governing Skills** (from `.agents/` and `skills-lock.json`):
  1. `minimalist-ui` (Leonxlnx/taste-skill: `skills/minimalist-skill/SKILL.md`)
  2. `imagegen-frontend-web` (Leonxlnx/taste-skill: `skills/imagegen-frontend-web/SKILL.md`)
  3. `full-output-enforcement` (Leonxlnx/taste-skill: `skills/output-skill/SKILL.md`)

---

## 2. Hard Anti-Patterns & Negative Constraints (Banned Elements)

Any agent generating UI, copy, markup, or style rules must strictly enforce these negative constraints:

### A. Typography & Text Banned
- ❌ **NO generic web fonts**: Never use `Inter`, `Roboto`, `Open Sans`, or `Arial`.
- ❌ **NO AI Copywriting Clichés**: Strictly banned words: `"Elevate"`, `"Seamless"`, `"Unleash"`, `"Next-Gen"`, `"Game-changer"`, `"Delve"`, `"Transformative"`, `"Passionate engineer crafting digital experiences"`. Write concise, honest, human, and technically grounded copy.
- ❌ **NO Emojis**: Never use emojis anywhere in UI, navigation, tags, code, or headings (e.g. 🚀, 💻, ✨, 🔥). Use custom SVG primitives, Phosphor icons, or Radix icons.
- ❌ **NO Placeholder Slop**: Never use `"John Doe"`, `"Acme Corp"`, `"Lorem Ipsum"`, or `"Project 1"`. Always write realistic, contextual, production-level project information.

### B. Visual & Layout Banned
- ❌ **NO Tailwind heavy drop shadows**: Banned `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`. Shadows must be practically non-existent or ultra-diffuse low-opacity (`rgba(0,0,0,0.03)` to `0.05`).
- ❌ **NO AI Gradient Slop**: Never use purple/blue meshes, saturated neon halos, glowing card borders, or rainbow buttons.
- ❌ **NO Primary/Loud Colored Backgrounds**: No bright blue, green, or red hero or section backgrounds.
- ❌ **NO Pill Shapes for Containers**: Never use `rounded-full` for cards, modals, or primary buttons (reserve pills strictly for micro status badges and small tags).
- ❌ **NO Habitual Left-Text / Right-Image Heroes**: Break the default AI hero template. Use off-grid editorial offsets, bottom-left typography over subtle background framing, or mini minimalist hero scales.
- ❌ **NO Generic Icon Libraries**: Never use generic thin icons like Lucide, Feather, or standard Heroicons. Use Phosphor Icons (Bold/Fill/Regular with uniform stroke) or Radix UI Icons.

---

## 3. Design System & Taste Specifications

### A. Color Palette (Warm Monochrome + Spot Pastels)
Color is treated as a scarce, deliberate resource.
- **Canvas / Page Background**: Pure White `#FFFFFF` or Warm Bone / Off-White `#F7F6F3` / `#FBFBFA`.
- **Card & Surface Background**: `#FFFFFF` or `#F9F9F8`.
- **Primary Ink (Headings & Body)**: Off-black / Charcoal `#111111` or `#2F3437` (never pure `#000000`).
- **Muted / Secondary Text**: `#787774` or `#6B6B6B`.
- **Structural Dividers & Borders**: Exactly `1px solid #EAEAEA` or `rgba(0, 0, 0, 0.06)`.
- **Semantic Muted Pastel Accents** (strictly for status pills, tag backgrounds, or micro accents):
  - *Pale Blue*: Background `#E1F3FE` | Text `#1F6C9F`
  - *Pale Green*: Background `#EDF3EC` | Text `#346538`
  - *Pale Red*: Background `#FDEBEC` | Text `#9F2F2D`
  - *Pale Yellow / Amber*: Background `#FBF3DB` | Text `#956400`

### B. Typographic Architecture
Extreme typographic contrast between high-editorial headings, disciplined functional sans-serif body, and technical monospace metadata:
1. **Hero & Section Display Titles (Editorial Serif)**:
   - Target Fonts: `'Instrument Serif'`, `'Newsreader'`, `'Playfair Display'`, or `'Lyon Text'`.
   - Tuning: Letter-spacing `-0.02em` to `-0.04em`, line-height `1.05` to `1.15`, medium or normal weight.
2. **Interface, Body & Navigation (Clean Grotesk Sans)**:
   - Target Fonts: `'Geist Sans'`, `'SF Pro Display'`, `'Switzer'`, or `'Helvetica Neue'`.
   - Tuning: Regular weight, line-height `1.6`, text color `#111111`.
3. **Metadata, Metrics, Keystrokes, Code (Technical Mono)**:
   - Target Fonts: `'Geist Mono'`, `'JetBrains Mono'`, or `'SF Mono'`.
   - Tuning: Small uppercase or tabular numerals, tracking `0.05em`.

### C. Structural Layout & Macro-Whitespace
- **Vertical Spacing**: Generous macro-whitespace (`py-24` to `py-36` / `6rem` to `9rem`) between sections.
- **Content Boundary**: Main container constrained to `max-w-5xl` or `max-w-6xl` with `px-6` to `px-8` margin gutters.
- **Asymmetrical Bento Grids**:
  - Varied aspect ratios and column spans (`col-span-12`, `col-span-7`, `col-span-5`, etc.).
  - Card borders: crisp `border border-[#EAEAEA]`.
  - Card border-radius: `8px` or `12px` maximum. No bloated curves.
  - Generous internal padding: `p-6` to `p-10`.
- **Keystroke Micro-UI**:
  - Render shortcuts/tags using `<kbd>` with `border: 1px solid #EAEAEA`, `border-radius: 4px`, `background: #F7F6F3`, font monospace.

### D. Subtle Motion & Micro-Interactions
- Motion must be invisible and quiet, never distracting.
- **Scroll Reveals**: Translate `translateY(12px)` + `opacity: 0` resolving over `600ms` with `cubic-bezier(0.16, 1, 0.3, 1)` via `IntersectionObserver`.
- **Card Hover**: Subtle lift with diffuse elevation transition (`box-shadow: 0 2px 8px rgba(0,0,0,0.04)`) over `200ms`.
- **Buttons**:
  - Primary button: Solid `#111111`, text `#FFFFFF`, radius `4px` to `6px`, no heavy shadow.
  - Active state: `transform: scale(0.98)`.

---

## 4. Recommended Portfolio Architecture & Sections

1. **Top Bar / Navigation**:
   - Fixed or sticky, ultra-minimalist, border-b `1px solid #EAEAEA`, subtle backdrop blur (`bg-white/80 backdrop-blur-md`).
   - Left: Name & Location/Time (e.g. `Joshua — Jakarta, ID [19:04 WIB]`).
   - Right: Clean anchor links (`Work`, `About`, `Writing / Notes`, `Colophon`, `Contact / Status`).
2. **Hero Section (Mini Minimalist or Off-Grid Editorial)**:
   - Strong editorial headline (5–9 words), no generic fluff.
   - High typographic contrast (Editorial serif + technical mono status).
   - Real availability indicator (e.g. green status dot with pale green tag: `AVAILABLE FOR SELECT ROLES / ADVISORY`).
3. **Selected Projects (Asymmetric Bento Grid & Case Studies)**:
   - Not identical card repeats. Mix 1 large flagship case study with 2 smaller technical experiments.
   - Showcase real technical metrics, live link, GitHub link, architecture tags, and high-fidelity mockups.
   - Faux-OS window chrome for code/UI previews (3 discreet light-gray dots, clean white bar).
4. **Technical Philosophy & Stack (Dossier Layout)**:
   - Categorized index tables or two-column dossiers (Frontend Architecture, Systems & Backend, Tooling, Taste & Aesthetics).
   - Keystroke micro-UIs and monospace spec lines.
5. **Career & Milestones / Experience**:
   - Clean tabular timeline with clean border-b hairlines, date in mono, role in serif/sans, impact in muted charcoal.
6. **Colophon & Footer**:
   - Technical transparency: typography used, hosting, license, year, and a clean contact CTA (Email, X/Twitter, GitHub, LinkedIn).

---

## 5. Full-Output Enforcement (Code Quality Protocol)

Based on `.agents/skills/full-output-enforcement/SKILL.md`:

1. **Zero-Placeholder Guarantee**:
   - 🚫 **STRICTLY FORBIDDEN**: `// ...`, `// rest of code`, `// implement here`, `// TODO`, `/* ... */`, `// similar to above`, `// add more items as needed`.
   - Never output skeletons or truncated files when building or editing components.
2. **Exhaustive Deliverables**:
   - Every file created or updated must be completely written, syntactically valid, and ready to run immediately.
   - All icons, mock data, types, styling, and hooks must be fully implemented.
3. **Production-First Standards**:
   - Responsive across mobile, tablet, and widescreen.
   - Full TypeScript strict typing (no lazy `any`).
   - Proper semantic HTML (`<main>`, `<header>`, `<article>`, `<section>`, `<nav>`, `<footer>`).

---

## 6. Execution Command Reference

When starting or updating the project:
```bash
# Recommended Modern Tech Stack:
# Next.js (App Router) + TypeScript + Tailwind CSS + Lucide replacement (Phosphor/Radix) + Motion
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

# Preferred Icon & Animation Packages:
npm install @phosphor-icons/react clsx tailwind-merge framer-motion
```

---
*Follow this document as the single source of truth for all code, design, and content generation tasks.*

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
