# PocketRuler.app — Solopreneur & Freelance Tools Hub

> A suite of responsive, high-performance web utilities for freelancers, solopreneurs, and independent contractors. Free static hosting on GitHub Pages, zero backend maintenance, and engineered for Google AdSense monetization.

**Live Domain:** [https://pocketruler.app](https://pocketruler.app)

---

## 🚀 Active Tools

1. **Freelance Rate vs. Retainer Calculator** (`/` root):
   - Side-by-side hourly, day rate, and client capacity vs. monthly retainers.
   - Dynamic real-time exchange rates via `open.er-api.com` across 15 global currencies.
   - Real-time "Rate Health" diagnostic assessment (burnout & undercharging warnings).
   - 1-Click dynamic "Client Retainer Pitch" proposal email generator.
   - Revenue breakdown doughnut chart (Chart.js) showing take-home, taxes, overhead, and emergency buffer.
   - Embeddable widget snippet for backlink distribution.

---

## 📁 Repository Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages deployment pipeline
├── css/
│   └── style.css               # Range sliders, diagnostics, and modal design
├── CNAME                       # Custom domain binding for pocketruler.app
├── .gitignore                  # Git ignore rules
├── calculator.js               # Calculation engine, Live FX fetch, and Chart.js logic
├── index.html                  # Main responsive layout, AdSense slots, and FAQ schema
└── README.md                   # Project documentation & configuration guide
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
