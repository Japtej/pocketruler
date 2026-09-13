# Freelance Rate vs. Retainer Calculator

> A free, responsive static web utility designed for freelancers, solopreneurs, and independent contractors to accurately compare **Hourly Project Rates against Recurring Monthly Retainers**. Built for $0 static hosting and passive monetization via Google AdSense.

---

## Features

- **Side-by-Side Model Comparison**: Directly compares hourly rate, day rate, and client capacity against monthly recurring retainers.
- **Dynamic Live FX Currency API**: Automatically syncs real-time exchange rates on initial load via `open.er-api.com` with support for 15 global currencies and live international USD benchmarking.
- **"Rate Health" Diagnostic Score**: Instant visual feedback evaluating utilization, capacity limits, and tax buffer adequacy to protect freelancers from burnout and undercharging.
- **1-Click "Client Retainer Pitch" Email Generator**: Dynamically crafts a ready-to-send proposal email tailored to the user's active numbers, with one-click clipboard copying.
- **Interactive Revenue Allocation Doughnut Chart**: High-performance Chart.js visualization displaying the distribution between take-home pay, taxes, expenses, and safety reserves.
- **Zero Dependencies / Pure Static Architecture**: Written in standard HTML5, Tailwind CSS, and vanilla JavaScript. Runs anywhere without Node.js or build steps.
- **AdSense & SEO Optimized**:
  - 3 high-viewability Google AdSense placement slots (`Top Leaderboard 728x90`, `In-Feed Native Unit`, and `Bottom Leaderboard`).
  - Pre-written **Privacy Policy** (with Google DART cookies clause) and **Terms of Service** modals required for AdSense publisher approval.
  - `schema.org/WebApplication` and `schema.org/FAQPage` structured JSON-LD data for Google search carousel rich snippets.
  - Built-in embed widget generator to earn dofollow backlinks from finance blogs.

---

## File Structure

```
.
├── .github/
│   └── workflows/
│       └── deploy.yml      # Automated GitHub Pages deployment workflow
├── css/
│   └── style.css           # Custom range sliders, health badges, and modal styles
├── .gitignore              # Ignored files and OS artifacts
├── calculator.js           # Vanilla JS calculation engine, Live API sync & Chart.js logic
├── index.html              # Responsive semantic HTML5 layout & AdSense slots
└── README.md               # Documentation & setup instructions
```

---

## Deployment to GitHub Pages

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### Quick Setup:
1. Push this repository to GitHub.
2. In your GitHub repository, go to **Settings** &rarr; **Pages**.
3. Under **Build and deployment > Source**, ensure **GitHub Actions** is selected.
4. Your website will be automatically deployed and updated upon every push to the `main` branch!

---

## How to Add Google AdSense

1. Open `index.html`.
2. Add your AdSense verification script inside `<head>...</head>`:
   ```html
   <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
   ```
3. Once approved, replace the 3 AdSense placeholder comments in `index.html`:
   - `MONETIZATION SLOT 1` (Top Leaderboard)
   - `MONETIZATION SLOT 2` (In-Feed Unit)
   - `MONETIZATION SLOT 3` (Bottom Leaderboard)

---

## License

MIT License. Free for personal and commercial use.
