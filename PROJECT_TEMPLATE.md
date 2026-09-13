# PocketRuler.app — Project Operating Plan & AI Agent Template

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & CONTRIBUTORS:**
> Before proposing or implementing any modifications, additions, or new tools in the `PocketRuler.app` repository, **read and strictly adhere to this operating plan and the master [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md)**. These documents serve as the authoritative single source of truth for repository architecture, visual design tokens, WCAG 2.1/2.2 AA accessibility, monetization compliance, Core Web Vitals, SEO structure, testing protocols, and git workflows.

---

## 1. Vision & Architectural Charter

### The Mission
**PocketRuler.app** is engineered to be the definitive, **one-stop suite of free, client-side web applications and precision financial calculators** for freelancers, consultants, digital nomads, and independent solopreneurs worldwide.

### Core Architectural Principles
1. **100% Client-Side Privacy**: All mathematical modeling, data transformations, currency conversions, and tax calculations must execute purely in the user's browser. No user-entered financial or confidential data may be transmitted or logged to external servers.
2. **Zero Backend Overhead**: Hosted statically on GitHub Pages with custom domain binding (`pocketruler.app`). Zero server maintenance, zero database bottlenecks, infinite scalability.
3. **Subfolder Application Routing**: Every standalone tool or calculator resides in its own isolated subfolder (e.g., `/freelance-calculator/`, `/relocation-calculator/`, `/invoice-generator/`) with its own `index.html` and supporting assets.
4. **Instant Monetization Inheritance**: Under Google AdSense policies, subfolders of an approved root domain (`pocketruler.app`) automatically inherit monetization approval.
5. **No Paywalls or Friction**: Essential career mathematics and utilities must remain free forever without email gating, sign-up requirements, or credit card forms.

---

## 2. Navigation & UI/UX Standards

Every page across PocketRuler.app must maintain strict design consistency, mobile responsiveness, and WCAG 2.1/2.2 AA accessibility. For the complete specification of color tokens, typography scales, reactive forms, micro-interactions, and accessibility standards, consult the master [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md).

### Global Header Specifications
- **Fixed/Sticky Height**: `h-16` to `h-18` sticky header (`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs`).
- **Brand Identity**: PocketRuler Modular Cross logo (`logo.svg`), "PocketRuler.app" wordmark, and a context badge (e.g., `<span class="badge">Tools Hub</span>` or active category).
- **Navigation Links**:
  - Direct links to flagship tools (Desktop).
  - Quick "All Tools" switcher dropdown or direct modal to switch between tools from any page.
  - Links to "About" and "Contact".
- **Theme Toggle Button**:
  - Every header and mobile drawer footer must feature a `<button type="button" data-theme-toggle ...>` element with accessible labels and dynamic Sun/Moon icon swapping.
- **Mobile Responsive Drawer & Desktop Defect Prevention**:
  - **STRICT ARCHITECTURAL RULE**: `#mobileDrawer` and `#mobileDrawerBackdrop` must **NEVER** be placed inside `<header>` or in normal document flow. Doing so will cause layout breaking on desktop viewports.
  - Always place `#mobileDrawerBackdrop` and `#mobileDrawer` directly at the bottom of `<body>`, immediately before `</body>`.
  - Must always have `hidden md:hidden` hard-coded in class attributes.
  - Global stylesheets enforce `@media (min-width: 768px) { #mobileDrawer, .mobile-nav-drawer { display: none !important; } }`.
  - Hamburger button uses `id="openMobileMenuBtn"` (`aria-expanded="false"`, `aria-controls="mobileDrawer"`).
  - Drawer close button uses `id="closeMobileMenuBtn"`.
  - Drawer must support: ESC key to close, backdrop click to dismiss, and focus retention.

### Dark & Light Theme System Architecture
All pages must implement full dual-theme support adhering to industry conventions:
1. **OS / System Preference Auto-Detection**:
   - Defaults automatically to the user's OS / Windows configuration via CSS media query `prefers-color-scheme`.
   - Dynamic real-time listener updates the theme instantly when OS theme toggles (e.g. Windows Night Light / Dark Mode) without page reload.
2. **Manual User Override**:
   - Tapping `[data-theme-toggle]` cycles between Dark and Light mode.
   - User preference persists in `localStorage` under key `pocketruler_theme` (`'dark'` or `'light'`).
3. **Zero Flash of Unstyled Content (Zero-FOUC)**:
   - `<meta name="color-scheme" content="light dark" />` in `<head>`.
   - Inline anti-FOUC script placed directly at the top of `<head>` to evaluate `localStorage` and `prefers-color-scheme` before HTML render.
   - Tailwind configured with `darkMode: 'class'`.
4. **Central Controller (`js/theme.js`)**:
   - Handled uniformly across all root and subfolder pages via `<script src="js/theme.js"></script>` or `../js/theme.js`.
   - Dispatches a custom window event `window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))` so dynamic components (e.g., Chart.js canvas elements) can re-render colors seamlessly.

### Design System & Typography
- **Authoritative Design Tokens**: See [DESIGN_GUIDELINES.md Section 2](DESIGN_GUIDELINES.md#2-visual-design-system--design-tokens).
- **Font Family**: Google Font **Plus Jakarta Sans** (`weights: 400, 500, 600, 700, 800, 900`) with system fallback.
- **Color Palette**:
  - Surface Background: `bg-slate-50 dark:bg-slate-950` (`#f8fafc` / `#020617`).
  - Card Surfaces: `bg-white dark:bg-slate-900` (`#ffffff` / `#0f172a`) with `border-slate-200 dark:border-slate-800`.
  - Text Primary: `text-slate-900 dark:text-slate-100` (`#0f172a` / `#f8fafc`).
  - Text Secondary: `text-slate-600 dark:text-slate-400` (`#475569` / `#94a3b8`).
  - Brand Primary Accent: Emerald (`text-emerald-600 dark:text-emerald-400` / `#059669` / `#34d399`).
  - Secondary Tool Accents: Blue (`#2563eb`), Amber (`#d97706`), Red (`#dc2626`).
- **Cards & Shadows**: `rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all`.
- **Accessibility & Touch Targets**: Minimum $44 \times 44\text{px}$ interactive hit areas and high-contrast `:focus-visible` outline rings. Dynamic outputs must feature `aria-live="polite"`.

### Global Footer Specifications
- Four standard columns on desktop, stacking gracefully on mobile:
  1. **Brand & Mission**: Logo, copyright, data refresh disclaimer.
  2. **Active Tools Hub**: Direct deep links to every live calculator/utility.
  3. **Resources & Guides**: Educational guides, methodology, and documentation.
  4. **Legal & Compliance**: About, Contact, Privacy Policy (GDPR/AdSense compliant), Terms of Service, Disclaimer.

---

## 3. Google AdSense Monetization Blueprint

Every single page on `pocketruler.app` must include standardized AdSense placement sections designed for maximum viewability (>70%), high RPM, zero layout shift (CLS = 0), and strict policy compliance. Detailed architecture and policy rules are provided in [DESIGN_GUIDELINES.md Section 5](DESIGN_GUIDELINES.md#5-google-adsense-high-rpm-monetization-blueprint).

### Standardized Ad Unit Placements

| Placement ID | Role / Device Context | Dimensions / Format | Target Location |
| :--- | :--- | :--- | :--- |
| **Slot 1 (Top Banner)** | High viewability header banner | Responsive Leaderboard (`728x90` desktop / `320x100` mobile) | Immediately below hero title or page header |
| **Slot 2 (Mid-Content)** | High engagement in-feed unit | Fluid Native / Responsive Rectangle (`336x280` / `300x250`) | Between tool inputs & results, or between article sections |
| **Slot 3 (Bottom Unit)** | Post-interaction viewability | Responsive Leaderboard / Large Mobile Banner | Directly above footer / legal links |

### AdSense Section Markup Template
All ad placements use the following zero-CLS standard markup powered by active publisher ID `ca-pub-3008088352823319`:

**In `<head>` of every HTML page (loaded once with async):**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3008088352823319" crossorigin="anonymous"></script>
```

**In-page Ad Placement:**
```html
<!-- ====================================================================
     MONETIZATION SLOT [N]: [SLOT_NAME]
     ==================================================================== -->
<aside role="region" aria-label="Advertisement" class="adsense-slot w-full max-w-4xl mx-auto my-6 px-4">
  <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 select-none text-center">Advertisement</div>
  <div class="adsense-card w-full min-h-[90px] sm:min-h-[100px] flex items-center justify-center bg-slate-100/50 dark:bg-slate-900/50 rounded-xl border border-slate-200/60 dark:border-slate-800">
    <ins class="adsbygoogle"
         style="display:block; width:100%; min-height:90px;"
         data-ad-client="ca-pub-3008088352823319"
         data-ad-format="auto"
         data-full-width-responsive="true"></ins>
    <script>
      try { (adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {}
    </script>
  </div>
</aside>
```
*(Note: For Slot 2 In-Feed, use `min-h-[250px] sm:min-h-[280px]`)*

### Policy Compliance Requirements
- **Clear Labeling & Semantic Tag**: Every placeholder/unit must be enclosed in an `<aside role="region" aria-label="Advertisement">` with visible uppercase "Advertisement" text.
- **Accidental Click Buffer**: Maintain a minimum 25px clear margin between ad containers and any interactive buttons or input sliders.
- **Mobile Density < 30%**: Ad content must never occupy more than 30% of the visible mobile viewport height (Better Ads Standards).
- **Zero-CLS Container**: Every ad slot must reserve dimension bounds before script execution.
- **ads.txt**: Maintained in repository root with authorized publisher credentials (`google.com, pub-3008088352823319, DIRECT, f08c47fec0942fa0`).
- **Privacy & Cookie Consent**: All pages must feature GDPR / Google DART cookie disclosures linking to `/privacy.html`.

---

## 4. Blueprint for Adding New Web Apps

PocketRuler is built to expand rapidly. When adding a new tool (e.g. `invoice-generator`, `runway-calculator`, `time-tracker`), follow this 8-step blueprint and verify against [DESIGN_GUIDELINES.md Section 7](DESIGN_GUIDELINES.md#7-contributor--ai-agent-verification-checklist):

1. **Create Subfolder**: `mkdir <app-slug>/` containing:
   - `index.html`: Main semantic markup, inputs, and results.
   - `app.js` (or `<tool>.js`): Modular, zero-dependency client-side calculation logic (synchronous execution < 16ms).
   - `css/style.css` (optional): Custom component styles if needed beyond Tailwind.
2. **Implement Unified Header & Navigation**:
   - Copy the standard PocketRuler header with mobile drawer and tool switcher.
   - Mark the new tool as active in the navigation.
3. **Include 3 AdSense Units**:
   - Insert Slot 1 (Top Banner), Slot 2 (Mid-Form/In-feed), and Slot 3 (Bottom) with zero-CLS containers.
4. **Implement Educational / E-E-A-T Content ($\ge 1,500$ words)**:
   - Below the interactive tool, include:
     - "How to use this tool" step-by-step guide.
     - Frequently Asked Questions (FAQ) in an accordion `<details name="...">` element.
     - Industry benchmarks, methodology formulas (with LaTeX notation), and source citations.
5. **SEO & Structured Data**:
   - Unique `<title>`, `<meta name="description">`, canonical URL (`https://pocketruler.app/<app-slug>/`).
   - Dual JSON-LD Structured Data blocks: Schema.org `WebApplication` and `FAQPage`.
6. **Update Master Homepage Dashboard (`index.html`)**:
   - Add new tool card to the Flagship Tools Grid.
   - Assign appropriate category tag (`finance`, `tax-relocation`, `operations`).
   - Update total tool counter.
7. **Update Sitemap & Robots**:
   - Add `<url>` block with priority `0.9` to `sitemap.xml`.
8. **Update Documentation**:
   - Update `README.md` and this `PROJECT_TEMPLATE.md`.

---

## 5. Testing & Verification Protocol

Before any code modifications or new features are pushed to production, perform internal verification:

### Testing Checklist
- [ ] **Design Guidelines Conformance**: Review against [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md) tokens and rules.
- [ ] **Mobile & Desktop Layout**: Verify responsive rendering on mobile (`360px`), tablet (`768px`), and desktop (`1280px`).
- [ ] **Navigation & Mobile Drawer**: Verify drawer toggles smoothly, links navigate correctly, and ESC/backdrop close works with `inert` background handling.
- [ ] **WCAG 2.1/2.2 AA Accessibility**: Check $\ge 4.5:1$ contrast, $44 \times 44\text{px}$ touch targets, visible `:focus-visible` rings, and `aria-live="polite"` on calculation outputs.
- [ ] **Core Web Vitals**: Ensure LCP < 2.5s, INP < 200ms, and CLS < 0.1 (pre-allocated ad bounding boxes).
- [ ] **Calculator Correctness**: Test edge cases (zero values, negative numbers, extreme figures, special characters).
- [ ] **Zero Console Errors**: Inspect browser developer console to ensure zero JavaScript runtime exceptions, 404s, or broken assets.
- [ ] **AdSense Placeholders**: Confirm all 3 ad placement slots are properly nested, 25px clear of controls, and do not cause Cumulative Layout Shift (CLS).
- [ ] **Internal Links & Canonicals**: Verify all hyperlinks use relative paths or `pocketruler.app` URLs with no dead links.

---

## 6. Git Commit & Release Guidelines

- Maintain a clean working directory.
- Keep commits atomic and descriptive, following conventional prefixes:
  - `feat: ...` for new web apps or major UI features.
  - `fix: ...` for calculation corrections or layout fixes.
  - `docs: ...` for documentation, template, and guide updates.
  - `style: ...` for styling, responsive polish, and visual adjustments.
- Always commit tested changes to `main` to trigger automated deployment via `.github/workflows/deploy.yml`.
