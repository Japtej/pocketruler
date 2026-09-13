# PocketRuler.app — Multi-Tool Suite for Solopreneurs & Remote Professionals

> A suite of responsive, high-performance web utilities for freelancers, solopreneurs, and digital nomads. Free static hosting on GitHub Pages, zero backend maintenance, and engineered for Google AdSense monetization.

**Live Domain:** [https://pocketruler.app](https://pocketruler.app)

---

## 🚀 Active Flagship Tools

1. **Master Homepage Dashboard** (`/` root &rarr; [`index.html`](https://pocketruler.app/)):
   - Unified suite landing hub with direct launcher cards, platform guarantees, and AdSense units.

2. **Freelance Rate vs. Retainer Calculator** (`/freelance-calculator/`):
   - Side-by-side hourly, day rate, and client capacity vs. monthly retainers.
   - Dynamic real-time exchange rates via `open.er-api.com` across 15 global currencies.
   - Real-time "Rate Health" diagnostic assessment (burnout & undercharging warnings).
   - 1-Click dynamic "Client Retainer Pitch" proposal email generator.
   - Revenue breakdown doughnut chart (Chart.js) and 3-Tier retainer packaging playbook.

3. **Remote Work Relocation & Expat Tax Arbitrage Calculator** (`/relocation-calculator/`):
   - Real-time statutory expat tax calculations across 85+ global remote hubs.
   - Models special expat regimes (Spain Beckham Law, Portugal IFICI, Dubai 0% Tax, Bansko 10%).
   - Purchasing power parity (PPP) arbitrage score and Digital Nomad Visa qualification checker.
   - Custom City Engine & in-depth 2,000+ word Expat Tax & Visa Guide (`/relocation-calculator/guide.html`).

---

## 📁 Repository Structure

```
.
├── .github/workflows/deploy.yml          # Automated GitHub Pages deployment pipeline
├── CNAME                                 # Custom domain binding for pocketruler.app
├── index.html                            # Master Homepage Dashboard
├── freelance-calculator/                 # [Tool 1] Freelance Rate Calculator
│   ├── index.html                        # Calculator layout & benchmarks
│   ├── calculator.js                     # FX sync, formulas, and doughnut chart
│   └── css/style.css                     # Sliders, status glow, and modal styles
├── relocation-calculator/                # [Tool 2] Expat Tax & Relocation Calculator
│   ├── index.html                        # RelocateTrue calculation engine
│   ├── guide.html                        # Comprehensive Expat Tax & Visa Guide
│   ├── css/custom.css                    # Comparison table and UI styles
│   └── js/
│       ├── data.js                       # 85+ Global cities cost & tax datasets
│       ├── calculator.js                 # Geoarbitrage & tax algorithm
│       └── app.js                        # Dynamic rendering & search autocomplete
├── about.html                            # Centralized E-E-A-T Publisher & Mission page
├── contact.html                          # Centralized Support & Feedback portal
├── privacy.html                          # Centralized GDPR & Google AdSense Privacy Policy
├── terms.html                            # Centralized Terms of Service
├── disclaimer.html                       # Centralized Financial & Estimation Disclaimer
├── robots.txt                            # Search engine & AdSense crawler directives
├── sitemap.xml                           # XML Sitemap indexing all tools and pages
├── ads.txt                               # IAB standard AdSense seller authorization
└── README.md                             # Project documentation & configuration guide
```

---

## 🌐 Custom Domain & DNS Setup (pocketruler.app)

To point `pocketruler.app` to this GitHub Pages repository:

### 1. DNS Records
In your domain registrar's DNS management panel (Cloudflare, Spaceship, Namecheap, etc.), add the following records:

| Type | Name / Host | Value / Target | TTL |
| :--- | :--- | :--- | :--- |
| **A** | `@` | `185.199.108.153` | Automatic / 300s |
| **A** | `@` | `185.199.109.153` | Automatic / 300s |
| **A** | `@` | `185.199.110.153` | Automatic / 300s |
| **A** | `@` | `185.199.111.153` | Automatic / 300s |
| **CNAME** | `www` | `japtej.github.io` | Automatic / 300s |

> [!NOTE]
> If using Cloudflare DNS, set the Proxy status to **DNS only** (gray cloud) during initial SSL certificate provisioning by GitHub, or use **Proxied** (orange cloud) with SSL mode set to **Full (Strict)**.

### 2. GitHub Pages Settings
1. Go to your repository on GitHub: `https://github.com/Japtej/pocketruler`
2. Navigate to **Settings** &rarr; **Pages**.
3. Under **Custom domain**, ensure `pocketruler.app` is listed and saved.
4. Check **Enforce HTTPS** (GitHub will provision a free Let's Encrypt SSL certificate once DNS records resolve, usually 5–20 minutes).

---

## 🗂️ Adding New Pages & Features to PocketRuler.app

Because `pocketruler.app` is the root custom domain, you can easily add multiple micro-tools and calculators to this repository without any hosting fees:

### Subfolder Pattern (Recommended)
Create a new directory for each tool:
```
pocketruler.app/
├── index.html                  # Freelance Rate vs. Retainer Calculator
├── invoice-generator/
│   └── index.html              # PocketRuler Invoice & Scope Estimator
├── runway-calculator/
│   └── index.html              # PocketRuler Emergency Buffer Calculator
└── contract-clauses/
    └── index.html              # PocketRuler Contract Terms Builder
```
- Each sub-page is immediately accessible at `https://pocketruler.app/invoice-generator/`.
- **AdSense Advantage**: Once Google AdSense approves the root domain `pocketruler.app`, every sub-tool automatically inherits monetization approval without requiring separate review!

---

## 💰 Google AdSense Monetization

This repository is pre-configured with high-converting AdSense slots and compliance assets:

1. **Submit Domain**: Once DNS resolves, add `https://pocketruler.app` to your Google AdSense account (**Sites** &rarr; **Add Site**).
2. **Verification Tag**: Add your AdSense publisher client ID inside `<head>` in `index.html`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. **Activate Ad Units**: Replace the 3 placeholder comments in `index.html`:
   - `MONETIZATION SLOT 1`: Top Leaderboard (728x90 desktop / 320x100 mobile)
   - `MONETIZATION SLOT 2`: Mid-page In-Feed native unit
   - `MONETIZATION SLOT 3`: Bottom sticky responsive unit
4. **AdSense Compliance**:
   - Legal Privacy Policy with Google DART cookie declaration included in footer modal.
   - Terms of Service modal included.
   - Structured JSON-LD schema included.

---

## 📄 License

MIT License. Open for personal and commercial deployment.
