# PocketRuler.app — Master Design, AdSense & SEO Engineering Guidelines

> **AUTHORITATIVE DIRECTIVE:**
> This document defines the engineering, visual design, monetization, accessibility, and search engine optimization standards for the **PocketRuler.app** ecosystem. Every new web application, calculator, marketing page, or architectural update must strictly adhere to these guidelines.

---

## Table of Contents
1. [Core Architectural Principles](#1-core-architectural-principles)
2. [Visual Design System & Design Tokens](#2-visual-design-system--design-tokens)
3. [UI/UX Interaction & Frontend Engineering](#3-uiux-interaction--frontend-engineering)
4. [Web Accessibility (WCAG 2.1/2.2 AA) Standards](#4-web-accessibility-wcag-2122-aa-standards)
5. [Google AdSense High-RPM Monetization Blueprint](#5-google-adsense-high-rpm-monetization-blueprint)
6. [Modern SEO, Core Web Vitals & E-E-A-T Framework](#6-modern-seo-core-web-vitals--e-e-a-t-framework)
7. [Contributor & AI Agent Verification Checklist](#7-contributor--ai-agent-verification-checklist)

---

## 1. Core Architectural Principles

PocketRuler.app is engineered as an open, privacy-first, zero-overhead utility platform:
- **100% Client-Side Privacy**: All mathematical calculations, tax projections, currency conversions, and rate models execute exclusively in the client's browser. Zero user inputs are stored or transmitted.
- **Zero Backend Overhead**: Hosted statically on GitHub Pages with root custom domain mapping (`https://pocketruler.app`). Fast global edge caching, zero database bottlenecks, and infinite scalability.
- **Zero-Friction Access**: No paywalls, no email gates, no mandatory sign-ups. Tools provide immediate utility upon page load.
- **Subfolder Architecture**: Each standalone tool lives in an isolated directory (e.g., `/freelance-calculator/`, `/relocation-calculator/`), inheriting root AdSense approval and domain authority while maintaining modular codebases.

---

## 2. Visual Design System & Design Tokens

### 2.1 Brand Identity & Color Palette
PocketRuler utilizes a slate-neutral surface with purposeful emerald financial accents, conveying precision, stability, and growth.

| Token | Hex (Light) | Hex (Dark) | Tailwind Class | Semantic Use |
| :--- | :--- | :--- | :--- | :--- |
| **Surface Canvas** | `#f8fafc` | `#020617` | `bg-slate-50 dark:bg-slate-950` | Full page background |
| **Card / Surface** | `#ffffff` | `#0f172a` | `bg-white dark:bg-slate-900` | Tool panels, inputs, calculation cards |
| **Border / Divider** | `#e2e8f0` | `#1e293b` | `border-slate-200 dark:border-slate-800` | Container outlines, subtle separators |
| **Text Primary** | `#0f172a` | `#f8fafc` | `text-slate-900 dark:text-slate-100` | Headings, primary figures, labels |
| **Text Secondary** | `#475569` | `#94a3b8` | `text-slate-600 dark:text-slate-400` | Subtext, helper notes, table headers |
| **Text Muted** | `#94a3b8` | `#64748b` | `text-slate-400 dark:text-slate-500` | Disclaimers, ad labels, inactive states |
| **Brand Primary** | `#059669` | `#34d399` | `text-emerald-600 dark:text-emerald-400` | Main CTA, active indicators, brand logo |
| **Brand Primary Surface** | `#ecfdf5` | `#064e3b` | `bg-emerald-50 dark:bg-emerald-950/60` | Success badges, active highlights |
| **Secondary Accent** | `#2563eb` | `#60a5fa` | `text-blue-600 dark:text-blue-400` | Relocation, data charts, informational tags |
| **Warning Accent** | `#d97706` | `#fbbf24` | `text-amber-600 dark:text-amber-400` | Rate health warnings, tax alert badges |
| **Danger Accent** | `#dc2626` | `#f87171` | `text-red-600 dark:text-red-400` | Undercharging alerts, burnout warnings |

### 2.2 Typography Scale
- **Primary Font**: `Plus Jakarta Sans` (Google Font weights: 400, 500, 600, 700, 800, 900).
- **Fallback**: `system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`.
- **Typographic Scale & Hierarchy**:
  - `Display / Hero H1`: `text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.15]`
  - `Section H2`: `text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white`
  - `Card / Feature H3`: `text-lg sm:text-xl font-bold text-slate-900 dark:text-white`
  - `Subheading / Lead`: `text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed`
  - `Body Copy`: `text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-normal`
  - `Form Labels`: `text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200`
  - `Monospace / Numbers`: `font-mono tracking-tight tabular-nums` (prevents jitter during real-time calculations)

### 2.3 Spatial Grid & Layout Tokens
- **8-Point Spatial Grid**: Spacing must use multiples of 4px / 8px:
  - Micro: `4px` (`p-1`, `gap-1`), `8px` (`p-2`, `gap-2`)
  - Component Padding: `16px` (`p-4`), `24px` (`p-6`), `32px` (`p-8`)
  - Section Spacing: `48px` (`py-12`), `64px` (`py-16`), `96px` (`py-24`)
- **Corner Radii**:
  - Buttons / Inputs: `rounded-xl` (`12px`)
  - Cards / Containers: `rounded-2xl` (`16px`)
  - Badges / Pills: `rounded-full` (`9999px`)
- **Elevation & Shadows**:
  - Surface Card: `shadow-xs border border-slate-200/80 dark:border-slate-800`
  - Interactive Hover: `hover:shadow-md hover:-translate-y-0.5 transition-all duration-200`
  - Modals / Overlays: `shadow-2xl border border-slate-200 dark:border-slate-800`

### 2.4 Zero-FOUC Dark Mode Standard
All pages must include the immediate synchronous script in `<head>` before any stylesheet or body rendering:
```html
<script>
  (function() {
    try {
      var t = localStorage.getItem('pocketruler_theme');
      if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {}
  })();
</script>
```

---

## 3. UI/UX Interaction & Frontend Engineering

### 3.1 Real-Time Calculation & Reactive Ergonomics
Calculators must feel instantaneous and alive.
- **`input` Event Binding**: Always bind updates to `input` events rather than `change` or explicit "Calculate" button clicks. Results update as the user types or drags a slider.
- **Synchronized Range + Number Inputs**: Pair range sliders with numeric input fields so users can either drag or type exact numbers.
- **Tabular Figures (`tabular-nums`)**: Apply `font-mono tabular-nums` to calculated figures to eliminate character-width wobble during adjustments.
- **Visual Pulse on Recalculation**: Provide subtle feedback when high-impact numbers recalculate:
```css
@keyframes valuePulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.03); color: #059669; }
  100% { transform: scale(1); }
}
.value-updated {
  animation: valuePulse 0.25s ease-out;
}
```

### 3.2 Form Input Best Practices
- **Numeric Formatting**: Display currency symbols (`$`, `€`, `£`) as positioned prefix adornments inside the input container, not inside the value string itself.
- **Input Types & Mobile Keyboards**:
  - Currency/Salary: `type="number" inputmode="decimal" step="any"`
  - Hours/Days: `type="number" inputmode="numeric" min="1" max="365"`
  - Email: `type="email" inputmode="email" autocomplete="email"`
- **Never Disable Paste**: Users frequently copy financial estimates from spreadsheets or notes.

### 3.3 Native Interactive Primitives
Avoid heavy JavaScript UI libraries. Use native web primitives:
- **Modals**: Native `<dialog>` element with `showModal()`, `close()`, and `<form method="dialog">`.
- **Accordions / FAQs**: Native `<details>` and `<summary>` elements. Group related items with the `name` attribute for exclusive single-open accordions:
```html
<details name="tool-faq" class="group border border-slate-200 dark:border-slate-800 rounded-xl p-4 transition-all">
  <summary class="flex justify-between items-center font-bold text-slate-900 dark:text-white cursor-pointer select-none">
    <span>How is the minimum hourly rate calculated?</span>
    <svg class="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </summary>
  <div class="mt-3 text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
    Our algorithm divides your total required annual gross revenue by your billable hours...
  </div>
</details>
```

### 3.4 Responsive Navigation & Off-Canvas Drawer
- **Desktop Header**: Sticky top header (`sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md`).
- **Mobile Drawer**:
  - Viewports `< 768px` render an accessible hamburger trigger (`aria-expanded="false"`, `aria-controls="mobileDrawer"`).
  - Off-canvas drawer slides smoothly from the right with backdrop overlay.
  - Must support: **ESC key dismissal**, **clicking outside backdrop to close**, and `inert` attribute applied to `<main>` and `<footer>` while drawer is active to prevent background tab focus.

---

## 4. Web Accessibility (WCAG 2.1/2.2 AA) Standards

Every page on PocketRuler.app must pass WCAG 2.1/2.2 AA audits.

### 4.1 Contrast & Readability
- **Standard Text**: Contrast ratio $\ge 4.5:1$ against surface background.
- **Large Text ($\ge 18\text{pt}$ or $\ge 14\text{pt}$ bold)**: Contrast ratio $\ge 3:1$.
- **Interactive Controls & Borders**: Contrast ratio $\ge 3:1$ for slider thumbs, input borders, and icons.

### 4.2 Minimum Touch Targets
- All buttons, links, slider handles, and drawer items must have a minimum interactive tap target of **$44 \times 44\text{px}$** (WCAG 2.5.5 / 2.5.8).
- For smaller visual icons (e.g. 16px chevron), expand the clickable area with padding: `p-2.5 -m-2.5` or `min-h-[44px] min-w-[44px] flex items-center justify-center`.

### 4.3 High-Contrast Focus Indicators
Never use `outline: none` without providing a visible focus ring:
```css
:focus-visible {
  outline: 2px solid #059669;
  outline-offset: 2px;
}
.dark :focus-visible {
  outline: 2px solid #34d399;
  outline-offset: 2px;
}
```

### 4.4 Dynamic Calculation Screen Reader Announcements
Dynamic financial totals that change on user input must be announced by assistive technology using `aria-live="polite"`:
```html
<div class="result-box" aria-live="polite" aria-atomic="true">
  <span class="sr-only">Updated calculation result:</span>
  <span id="outputTargetHourlyRate" class="font-mono text-3xl font-black text-emerald-600 dark:text-emerald-400">$125/hr</span>
</div>
```

### 4.5 Form Labeling & Associations
- Every `<input>`, `<select>`, and `<textarea>` must have a programmatic `<label for="inputId">` or `aria-label`.
- Supplementary helper notes or error states must link to inputs via `aria-describedby="helperId"`.
- Sliders must provide `aria-valuemin`, `aria-valuemax`, and `aria-valuenow`.

---

## 5. Google AdSense High-RPM Monetization Blueprint

### 5.1 Revenue Fundamentals & Active View Optimization
AdSense revenue is governed by:
$$\text{Revenue} = \frac{\text{Page Views} \times \text{Impressions per View} \times \text{Viewability Rate} \times \text{CTR} \times \text{CPC}}{1000}$$
- **Active View Viewability Rate**: An ad is counted as viewable when $\ge 50\%$ of its surface is in the active viewport for $\ge 1$ continuous second.
- **Benchmark Target**: $\ge 70\%$ viewability across all units. High viewability significantly elevates advertiser real-time bids (eCPM) via Google Smart Bidding.

### 5.2 The 3-Slot Strategic Placement Architecture
Each page implements three distinct monetization tiers:

```
+-------------------------------------------------------------+
|               Sticky Header (h-18 / z-40)                  |
+-------------------------------------------------------------+
| Hero Title & Context                                        |
+-------------------------------------------------------------+
| [SLOT 1: Top Context Banner] (min-h-[90px] / zero-CLS)      |
+-------------------------------------------------------------+
| Interactive Calculator Panel (Sliders, Selectors, Inputs)   |
+-------------------------------------------------------------+
| [SLOT 2: Mid-Content / In-Feed Unit] (min-h-[280px])        |
+-------------------------------------------------------------+
| Real-Time Results, Breakdown Cards & Output Charts          |
+-------------------------------------------------------------+
| In-Depth Educational Guide (E-E-A-T Content / Benchmarks)   |
+-------------------------------------------------------------+
| [SLOT 3: Post-Interaction Bottom Unit] (min-h-[90px])       |
+-------------------------------------------------------------+
| FAQ Accordion & Author Methodology Citations                |
+-------------------------------------------------------------+
| Global 4-Column Footer                                      |
+-------------------------------------------------------------+
```

1. **Slot 1 (Top Context Banner)**:
   - Placed directly beneath the page title / subtitle, above the calculator card.
   - Captures immediate above-the-fold viewability.
   - *Rule*: Never let Slot 1 push the top inputs of the tool below the mobile fold.
2. **Slot 2 (Mid-Content / In-Feed Unit)**:
   - Placed between the tool input panel and the calculated results / strategy playbook.
   - Engages users at a natural cognitive pause point as they evaluate their numbers.
   - Highest CTR and view duration.
3. **Slot 3 (Post-Interaction Bottom Unit)**:
   - Placed directly following deep-dive educational content, prior to the FAQ section and footer.
   - Monetizes highly engaged visitors who consumed full guides and methodology.

### 5.3 Zero-CLS Ad Container Markup
To guarantee a Cumulative Layout Shift score of `0.00`, ad slot wrappers must reserve dimension boxes via CSS before Google scripts inject `<iframe>` units:

```html
<!-- ====================================================================
     MONETIZATION SLOT: [SLOT_NAME]
     ==================================================================== -->
<aside role="region" aria-label="Advertisement" class="adsense-slot w-full max-w-4xl mx-auto my-6 px-4">
  <div class="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-1.5 select-none text-center">
    Advertisement
  </div>
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

For Slot 2 (In-Feed Rectangle): Use `min-h-[250px] sm:min-h-[280px]`.

### 5.4 AdSense Policy Compliance & Invalid Traffic Safeguards
- **Clear Separation & Labeling**: Every ad must have an uppercase "Advertisement" or "Sponsored" label. Never disguise ads as navigation buttons or tool outputs.
- **Buffer Zone**: Maintain a **minimum 25px - 30px clear margin** between ad slots and clickable controls (e.g. "Calculate", "Copy Pitch", "Download PDF"). Accidental clicks trigger severe Google invalid traffic penalties.
- **Better Ads Standards (Mobile Ad Density < 30%)**: The combined height of all ads visible on a mobile viewport at any given time must not exceed 30% of screen height.
- **Single Script Execution**: Load the AdSense library script **once** in `<head>` with `async`:
  ```html
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3008088352823319" crossorigin="anonymous"></script>
  ```
- **Authorized Digital Sellers (`ads.txt`)**: Always verify root `ads.txt` presence:
  ```
  google.com, pub-3008088352823319, DIRECT, f08c47fec0942fa0
  ```

---

## 6. Modern SEO, Core Web Vitals & E-E-A-T Framework

### 6.1 Core Web Vitals (CWV) Performance Thresholds

| Metric | Target | Optimization Technique |
| :--- | :--- | :--- |
| **LCP (Largest Contentful Paint)** | **$< 2.5\text{s}$** | Static GitHub Pages CDN; preload critical font (`woff2`); eager load above-the-fold hero logo with `fetchpriority="high"`. |
| **INP (Interaction to Next Paint)** | **$< 200\text{ms}$** | Execute mathematical models synchronously in $< 16\text{ms}$; debounce non-critical UI updates; use passive event listeners on touch/scroll. |
| **CLS (Cumulative Layout Shift)** | **$< 0.1$** (ideal: `0.00`) | Explicit `width` and `height` attributes on all SVGs/images; reserved `min-height` on all AdSense slots; font metric override fallbacks. |

### 6.2 Semantic Document Structure & Crawl Architecture
- **Single `<h1>`**: Exactly one `<h1>` per page capturing high-intent search queries (e.g., "Freelance Rate vs. Retainer Calculator").
- **Strict Heading Hierarchy**: Do not skip levels (`<h1>` $\to$ `<h2>` $\to$ `<h3>`). Never use heading tags purely for visual styling.
- **Self-Referencing Canonical**:
  ```html
  <link rel="canonical" href="https://pocketruler.app/freelance-calculator/" />
  ```
- **Social Graph & Discovery Metadata**:
  - `og:title`, `og:description`, `og:url`, `og:image`, `og:type: website`
  - `twitter:card: summary_large_image`
  - Clean XML sitemap entry in `sitemap.xml` with `<priority>0.9</priority>`.

### 6.3 Schema.org Structured Data (JSON-LD)
Every calculator page must feature dual JSON-LD schemas: `WebApplication` and `FAQPage`.

```html
<!-- Schema 1: WebApplication -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "name": "Freelance Rate vs. Retainer Calculator",
  "url": "https://pocketruler.app/freelance-calculator/",
  "applicationCategory": "FinanceApplication",
  "operatingSystem": "All",
  "browserRequirements": "Requires JavaScript. Requires HTML5.",
  "isAccessibleForFree": true,
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD"
  },
  "creator": {
    "@type": "Organization",
    "name": "PocketRuler.app",
    "url": "https://pocketruler.app/"
  }
}
</script>

<!-- Schema 2: FAQPage -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the formula to convert hourly rates to monthly retainers?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "The standard monthly retainer formula is: (Hourly Rate × Agreed Monthly Dedicated Hours) × (1 - Value Discount Percentage). Retainers guarantee client capacity while securing baseline recurring income for the freelancer."
      }
    }
  ]
}
</script>
```

### 6.4 E-E-A-T & Anti-Thin-Content Standard
Google aggressively devalues standalone "thin calculators" that offer only form inputs. Every tool page on PocketRuler.app must contain **1,500 to 2,500 words of educational content** beneath the calculator, including:
1. **Mathematical Methodology & Formula Breakdown**: Step-by-step documentation of formulas with LaTeX math notation.
2. **Authoritative Source Citations**: Direct attribution to reputable sources (e.g., Numbeo Cost of Living Index, OECD tax brackets, IRS publications).
3. **Strategic Decision Playbooks**: Actionable guidance (e.g., "How to Pitch Retainers to Reluctant Clients", "The 183-Day International Tax Rule Explained").
4. **FAQ Accordion**: 4–8 targeted questions answering long-tail search intent.
5. **Editorial Accountability**: Links to `about.html` (Mission & Team), `methodology.html`, and `contact.html`.

### 6.5 Internal Linking & Topical Clustering
- Every tool page must link back to the Master Tools Hub (`index.html`).
- Every tool page must cross-link to at least 2 relevant sibling calculators or guides (e.g. Freelance Calculator links to Relocation & Expat Tax Calculator to plan location-independent earnings).
- Use descriptive anchor text (avoid generic "click here" or "learn more").

---

## 7. Contributor & AI Agent Verification Checklist

Before submitting code, committing changes, or deploying new tools, verify every item:

### Visual & UX Standards
- [ ] Uses Google Font **Plus Jakarta Sans** with clean fallbacks.
- [ ] Color tokens align with Slate surfaces and Emerald primary accents.
- [ ] Adheres to 8pt spatial grid (`p-4`, `p-6`, `gap-4`, etc.).
- [ ] Responsive navigation header with functioning off-canvas mobile drawer (`< 768px`).
- [ ] Drawer implements ESC key dismiss, backdrop click dismiss, and `inert` on background shell.
- [ ] Light/Dark mode toggles without layout shifts and uses zero-FOUC script.

### Accessibility (WCAG 2.1/2.2 AA)
- [ ] All body text meets $\ge 4.5:1$ contrast ratio; large text meets $\ge 3:1$.
- [ ] Interactive controls, inputs, and buttons meet minimum $44 \times 44\text{px}$ touch targets.
- [ ] Visible, high-contrast `:focus-visible` outline rings present on all interactive elements.
- [ ] Dynamic calculation figures include `aria-live="polite"` and `aria-atomic="true"`.
- [ ] Form inputs have associated `<label for="...">` or `aria-label`.
- [ ] Respects `prefers-reduced-motion` for animations and transitions.

### AdSense Monetization & Policy
- [ ] Contains all 3 standardized ad units: Slot 1 (Top), Slot 2 (Mid-Content), Slot 3 (Bottom).
- [ ] Ad slots reserve minimum dimensions (`min-h-[90px]` or `min-h-[280px]`) for zero CLS.
- [ ] Every ad container is wrapped in `<aside role="region" aria-label="Advertisement">` with an explicit uppercase "Advertisement" label.
- [ ] Minimum 25px clear buffer between ads and interactive buttons or inputs.
- [ ] Mobile ad density does not exceed 30% of viewport.
- [ ] Publisher ID `ca-pub-3008088352823319` matches repository `ads.txt`.

### SEO & Performance
- [ ] Single `<h1>` tag with structured `<h2>` and `<h3>` heading tree.
- [ ] Self-referencing canonical URL (`<link rel="canonical" href="...">`).
- [ ] Open Graph and Twitter Card tags configured with absolute image URLs.
- [ ] Dual JSON-LD Structured Data blocks (`WebApplication` and `FAQPage`) validated.
- [ ] Includes $\ge 1,500$ words of educational content, formula methodology, and FAQ accordion.
- [ ] All images and SVGs have explicit `width` and `height` attributes.
- [ ] Added to `sitemap.xml` with appropriate priority and change frequency.
- [ ] Zero browser console errors, unhandled exceptions, or broken links.
