# PocketRuler.app — Project Operating Plan & AI Agent Template

> **CRITICAL DIRECTIVE FOR ALL AI AGENTS & CONTRIBUTORS:**
> Before proposing or implementing any modifications, additions, or new tools in the `PocketRuler.app` repository, **read and strictly adhere to this operating plan**. This document serves as the single source of truth for repository architecture, design standards, monetization compliance, testing protocols, and git workflows.

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

Every page across PocketRuler.app must maintain strict design and navigation consistency.

### Global Header Specifications
- **Fixed/Sticky Height**: `h-16` to `h-18` sticky header (`sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs`).
- **Brand Identity**: PocketRuler Modular Cross logo (`logo.svg`), "PocketRuler.app" wordmark, and a context badge (e.g., `<span class="badge">Tools Hub</span>` or active category).
- **Navigation Links**:
  - Direct links to flagship tools (Desktop).
  - Quick "All Tools" switcher dropdown or direct modal to switch between tools from any page.
  - Links to "About" and "Contact".
- **Mobile Responsive Drawer**:
  - On viewports `< 768px` (`md`), standard desktop links collapse into an accessible hamburger button (`aria-expanded="false"`, `aria-controls="mobileDrawer"`).
  - Tapping the hamburger opens an off-canvas drawer or slide-down navigation panel with high-contrast links to all tools, resources, and legal pages.
  - Drawer must support: ESC key to close, click outside/backdrop to dismiss, and focus retention.

### Design System & Typography
- **Font Family**: Google Font **Plus Jakarta Sans** (`weights: 400, 500, 600, 700, 800, 900`).
- **Color Palette**:
  - Slate Background: `bg-slate-50` (`#f8fafc`).
  - Card & Container Surfaces: `bg-white` (`#ffffff`) with `border-slate-200` (`#e2e8f0`).
  - Text Primary: `text-slate-900` (`#0f172a`).
  - Text Secondary: `text-slate-600` / `text-slate-500`.
  - Brand Primary Accent: Emerald (`text-emerald-600` / `bg-emerald-600` / `#059669`).
  - Secondary Tool Accents: Blue (`#2563eb`), Indigo (`#6366f1`), Amber (`#d97706`).
- **Cards & Shadows**: `rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition-all`.

### Global Footer Specifications
- Four standard columns on desktop, stacking gracefully on mobile:
  1. **Brand & Mission**: Logo, copyright, data refresh disclaimer.
  2. **Active Tools Hub**: Direct deep links to every live calculator/utility.
  3. **Resources & Guides**: Educational guides, methodology, and documentation.
  4. **Legal & Compliance**: About, Contact, Privacy Policy (GDPR/AdSense compliant), Terms of Service, Disclaimer.

---

## 3. Google AdSense Monetization Blueprint

Every single page on `pocketruler.app` must include standardized AdSense placement sections designed for maximum viewability, high RPM, and strict policy compliance.

### Standardized Ad Unit Placements

| Placement ID | Role / Device Context | Dimensions / Format | Target Location |
| :--- | :--- | :--- | :--- |
| **Slot 1 (Top Banner)** | High viewability header banner | Responsive Leaderboard (`728x90` desktop / `320x100` mobile) | Immediately below hero title or page header |
| **Slot 2 (Mid-Content)** | High engagement in-feed unit | Fluid Native / Responsive Rectangle (`336x280` / `300x250`) | Between tool inputs & results, or between article sections |
| **Slot 3 (Bottom Unit)** | Post-interaction viewability | Responsive Leaderboard / Large Mobile Banner | Directly above footer / legal links |

### AdSense Section Markup Template
All ad placements use the following zero-CLS standard markup powered by active publisher ID `ca-pub-3008088352823319`:

**In `<head>` of every HTML page:**
```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3008088352823319" crossorigin="anonymous"></script>
```

**In-page Ad Placement:**
```html
<!-- ====================================================================
     MONETIZATION SLOT [N]: [SLOT_NAME]
     ==================================================================== -->
<aside role="region" aria-label="Advertisement" class="adsense-slot w-full max-w-4xl mx-auto my-6">
  <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5 select-none">Advertisement</div>
  <div class="adsense-card w-full">
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

### Policy Compliance Requirements
- **No Deceptive Layouts**: Ad units must never mimic tool controls, buttons, or calculator outputs.
- **Labeling**: Every placeholder/unit must be enclosed in an `<aside role="region" aria-label="Advertisement">` with visible "Advertisement" label.
- **Zero-CLS Container**: Every ad slot must use `.adsense-card` with `min-height: 90px;` to reserve space and avoid layout shifts.
- **ads.txt**: Maintained in repository root with authorized publisher credentials (`google.com, pub-3008088352823319, DIRECT, f08c47fec0942fa0`).
- **Privacy & Cookie Consent**: All pages must feature GDPR / Google DART cookie disclosures linking to `/privacy.html`.

---

## 4. Blueprint for Adding New Web Apps

PocketRuler is built to expand rapidly. When adding a new tool (e.g. `invoice-generator`, `runway-calculator`, `time-tracker`), follow this 8-step blueprint:

1. **Create Subfolder**: `mkdir <app-slug>/` containing:
   - `index.html`: Main markup, inputs, and results.
   - `app.js` (or `<tool>.js`): Modular, zero-dependency client-side calculation logic.
   - `css/style.css` (optional): Custom component styles if needed beyond Tailwind.
2. **Implement Unified Header & Navigation**:
   - Copy the standard PocketRuler header with mobile drawer and tool switcher.
   - Mark the new tool as active in the navigation.
3. **Include 3 AdSense Units**:
   - Insert Slot 1 (Top Banner), Slot 2 (Mid-Form/In-feed), and Slot 3 (Bottom).
4. **Implement Educational / E-E-A-T Content**:
   - Below the interactive tool, include:
     - "How to use this tool" guide.
     - Frequently Asked Questions (FAQ) in an accordion `<details>` element with schema markup.
     - Industry benchmarks or formula breakdown.
5. **SEO & Structured Data**:
   - Unique `<title>`, `<meta name="description">`, canonical URL (`https://pocketruler.app/<app-slug>/`).
   - Schema.org `WebApplication` and `FAQPage` JSON-LD structured data.
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
- [ ] **Mobile & Desktop Layout**: Verify responsive rendering on mobile (`360px`), tablet (`768px`), and desktop (`1280px`).
- [ ] **Navigation & Mobile Drawer**: Verify drawer toggles smoothly, links navigate correctly, and ESC/backdrop close works.
- [ ] **Calculator Correctness**: Test edge cases (zero values, negative numbers, extreme figures, special characters).
- [ ] **Zero Console Errors**: Inspect browser developer console to ensure zero JavaScript runtime exceptions, 404s, or broken assets.
- [ ] **AdSense Placeholders**: Confirm all 3 ad placement slots are properly nested and do not cause Cumulative Layout Shift (CLS).
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
