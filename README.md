# PocketRuler.app — Everyday Digital Pocket Knife for Web & Life

> A fast, clean set of client-side web tools and calculators for everyday life, work, and math. Hosted statically on GitHub Pages with zero server maintenance, unified responsive navigation, and standardized Google AdSense monetization across all pages.

**Live Domain:** [https://pocketruler.app](https://pocketruler.app)  
**Primary Architecture Guide:** [PROJECT_TEMPLATE.md](PROJECT_TEMPLATE.md) *(Mandatory reading for any developer or AI agent before making changes)*  
**Master Design, AdSense & SEO Guidelines:** [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md) *(Design system tokens, WCAG 2.1/2.2 AA, AdSense viewability >70%, and Core Web Vitals)*

---

## 🧭 Platform Mission & Architecture

PocketRuler.app is designed as a **digital pocket knife**:
- **Zero Backend / 100% Client-Side:** Calculations happen entirely in the user's browser. Zero private financial or personal numbers are stored or transmitted.
- **Unified Navigation & Drawer Architecture:** Every page features a sticky top header, "All Tools" dropdown, and an isolated responsive mobile navigation drawer (`mobileDrawer`).
- **OS-Aware Dark & Light Theming:** Standardized theme controller (`js/theme.js`) automatically adapting to user OS preference (`prefers-color-scheme`), with live system change listeners and manual toggle button (`data-theme-toggle`).
- **Standardized AdSense Monetization:** Every page implements standardized ad placeholder regions (Top Slot 1, Mid Slot 2, Bottom Slot 3) ready for Google AdSense (`ca-pub-3008088352823319`).
- **Scalable Multi-Tool Umbrella:** Micro-apps share the root domain `pocketruler.app`, allowing new tools (financial, everyday math, design, productivity) to launch quickly under a single high-authority domain.

---

## 🚀 Active Web Apps & Pages

1. **Master Tools Hub Dashboard** (`/` root &rarr; [`index.html`](https://pocketruler.app/)):
   - Interactive search and filterable directory (All, Finance & Rates, Taxes & Relocation, Legal & Contracts, Productivity).
   - Live app launch cards with feature tags and direct calculators.
   - Upcoming tools roadmap cards with direct feedback triggers.
   - Platform guarantee badges & interactive FAQ accordion.
   - 3 AdSense slots (Top, In-Feed, Bottom) and 4-column footer.

2. **Freelance Rate vs. Retainer Calculator** (`/freelance-calculator/`):
   - Side-by-side hourly, day rate, and client capacity vs. monthly retainers.
   - Dynamic real-time exchange rates via `open.er-api.com` across 15 global currencies.
   - Real-time "Rate Health" diagnostic assessment (burnout & undercharging warnings).
   - 1-Click dynamic "Client Retainer Pitch" proposal email generator.
   - Revenue breakdown doughnut chart (Chart.js) dynamically adapting to dark/light theme.
   - Integrated with unified header, mobile drawer, and 3 AdSense slots.

3. **Remote Work Relocation & Expat Tax Arbitrage Calculator** (`/relocation-calculator/`):
   - Real-time statutory expat tax calculations across 85+ global remote hubs.
   - Models special expat regimes (Spain Beckham Law, Portugal IFICI, Dubai 0% Tax, Bansko 10%, etc.).
   - Purchasing power parity (PPP) arbitrage score and Digital Nomad Visa qualification checker.
   - Custom Destination Simulator for comparing non-listed destinations.
   - Integrated with unified header, mobile drawer, and 3 AdSense slots.

4. **Deep-Dive Knowledge Base & Transparency Pages**:
   - **Expat Tax & Visa Guide** (`/relocation-calculator/guide.html`): 2,000+ word structured guide on tax treaties, nomad visas, and 183-day residency rules.
   - **Methodology & Formulas** (`/relocation-calculator/methodology.html`): Mathematical formulas, cost-of-living basket weights, and Numbeo/OECD source citations.
   - **About Us & Mission** (`/about.html`): E-E-A-T publisher credibility statement, editorial standards, and suite roadmap.
   - **Contact & Feedback** (`/contact.html`): Interactive pre-filled email routing for suggestions, bug reports, and partnership inquiries.
   - **Legal Compliance Suite**: [`privacy.html`](privacy.html) (GDPR, CCPA, Google AdSense DART cookies), [`terms.html`](terms.html), [`disclaimer.html`](disclaimer.html), and [`ads.txt`](ads.txt).

---

## 📁 Repository Structure

```
.
├── .github/workflows/deploy.yml          # Automated GitHub Pages deployment pipeline
├── CNAME                                 # Custom domain binding for pocketruler.app
├── DESIGN_GUIDELINES.md                  # Master Design System, AdSense, SEO & UI/UX Standards
├── PROJECT_TEMPLATE.md                   # Operational standards, AdSense rules & dev blueprint
├── README.md                             # Repository documentation & guide
├── index.html                            # Master Tools Hub Dashboard
├── favicon.svg                           # High-res SVG favicon (ruler motif)
├── logo.svg                              # Brand identity logo
├── js/
│   └── theme.js                          # Universal OS & manual dark/light theme controller & mobile drawer handler
├── css/
│   └── style.css                         # Shared CSS, mobile drawer, filters & AdSense styling
├── freelance-calculator/                 # [Web App 1] Freelance Rate vs. Retainer
│   ├── index.html                        # Calculator interface & 3 AdSense slots
│   ├── calculator.js                     # FX sync, capacity math & Chart.js integration
│   └── css/style.css                     # Calculator slider & status styling
├── relocation-calculator/                # [Web App 2] Expat Tax & Relocation
│   ├── index.html                        # Relocation arbitrage engine & 3 AdSense slots
│   ├── guide.html                        # Comprehensive Expat Tax & Visa Guide
│   ├── methodology.html                  # Math formulas & data source citations
│   ├── about.html                        # Legacy redirect to methodology.html
│   ├── privacy.html                      # Legacy redirect to /privacy.html
│   ├── terms.html                        # Legacy redirect to /terms.html
│   ├── css/custom.css                    # Comparison table, drawer & mobile styles
│   └── js/
│       ├── data.js                       # 85+ Global cities cost & tax datasets
│       ├── calculator.js                 # Geoarbitrage & tax algorithm
│       └── app.js                        # Dynamic rendering & search autocomplete
├── about.html                            # Centralized About & Editorial Standards
├── contact.html                          # Centralized Feedback & Tool Suggestion Portal
├── privacy.html                          # Centralized GDPR & Google AdSense Privacy Policy
├── terms.html                            # Centralized Terms of Service
├── disclaimer.html                       # Centralized Financial & Estimation Disclaimer
├── robots.txt                            # Search engine & AdSense crawler directives
├── sitemap.xml                           # XML Sitemap indexing all tools and pages
└── ads.txt                               # IAB standard AdSense seller authorization
```

---

## 💰 Google AdSense Monetization Standard

All pages adhere to the 3-Slot monetization pattern detailed in [PROJECT_TEMPLATE.md](PROJECT_TEMPLATE.md) and [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md):

1. **Slot 1: Top Leaderboard Banner**
   - Position: Below top header, above primary interactive tool/content.
   - Recommended dimensions: Responsive (728x90 desktop / 320x100 mobile).
2. **Slot 2: Mid-Content / In-Feed Native Unit**
   - Position: Between tool calculation results and secondary educational/table content.
   - Recommended dimensions: Fluid In-Article / In-Feed responsive unit (`min-height: 280px;`).
3. **Slot 3: Bottom High-Viewability Banner**
   - Position: Directly above the 4-column footer on all pages.
   - Recommended dimensions: Responsive auto-ad display (`min-height: 90px;`).

### Active Publisher ID & Monetization Setup
AdSense is implemented across all pages with active publisher ID `ca-pub-3008088352823319`:
- **Head Script**: Pre-loaded in `<head>` of every HTML file for responsive Auto Ads & fast CDN serving.
- **In-Page Units**: Placed in standardized zero-CLS `.adsense-card` containers (`min-height: 90px;` or `min-height: 280px;`).
- **Policy Compliance**: Strict >70% viewability architecture, mobile ad density <30%, and 25px clear button margins (see [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md)).
- **ads.txt**: Verified and committed with authorized record:
  ```
  google.com, pub-3008088352823319, DIRECT, f08c47fec0942fa0
  ```

---

## 🛠️ Adding a New Web App to PocketRuler.app

Follow the 8-step blueprint outlined in **[PROJECT_TEMPLATE.md](PROJECT_TEMPLATE.md)** and verify against the **[DESIGN_GUIDELINES.md Checklist](DESIGN_GUIDELINES.md#7-contributor--ai-agent-verification-checklist)**:
1. Create a dedicated subfolder (e.g., `pocketruler.app/invoice-generator/`).
2. Add standalone `index.html` adhering to the PocketRuler Design System (Tailwind + Plus Jakarta Sans + WCAG 2.1/2.2 AA).
3. Include the standard PocketRuler sticky header with "All Tools" dropdown and accessible mobile drawer (`inert` supported).
4. Insert zero-CLS AdSense Slot 1, Slot 2, and Slot 3 placeholders with 25px control margins.
5. Include $\ge 1,500$ words of educational E-E-A-T content, formula breakdowns, and JSON-LD structured data (`WebApplication` & `FAQPage`).
6. Add the unified 4-column footer.
7. Register the new app in `index.html` (hub cards) and the "All Tools" dropdowns.
8. Add the URL to `sitemap.xml` and verify in responsive viewports before committing to `git`.

---

## 🌐 Domain & Hosting Verification

- **Domain:** `pocketruler.app`
- **DNS Host:** Configured with GitHub Pages A-records (`185.199.108.153` - `185.199.111.153`) and CNAME `www` &rarr; `japtej.github.io`.
- **Enforce HTTPS:** Active with automatic Let's Encrypt certificates.

---

## 📄 License

MIT License. Open for personal and commercial deployment.
