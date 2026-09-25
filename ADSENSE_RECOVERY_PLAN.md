# PocketRuler.app — Multi-Agent Autonomous Execution Specification & Master Implementation Directive

> **DOCUMENT PURPOSE FOR DELEGATED AI AGENTS & DEVELOPERS:**  
> This specification serves as an explicit, step-by-step technical directive designed for autonomous execution by AI subagents or developers. Every task packet includes exact file paths, mathematical formulas, UX templates, content outlines, and schema requirements.
> 
> **Repository Context:** `PocketRuler.app` — 100% Client-Side Web Application Suite.  
> **Primary Guidelines:** Consult [PROJECT_TEMPLATE.md](PROJECT_TEMPLATE.md) and [DESIGN_GUIDELINES.md](DESIGN_GUIDELINES.md) for design system tokens and HTML/JS standards.

---

## 1. Global Technical & Architecture Standards (Mandatory for All Agents)

Every agent implementing a page or tool MUST strictly follow these rules:

1. **Subfolder Application Routing:** Each tool lives in its own root subfolder containing `index.html` (and `app.js` / `calculator.js` / `css/style.css` as needed).
2. **Zero-FOUC Theme Controller:** Every HTML file must include the synchronous theme script in `<head>` and load `../js/theme.js` before `</body>`.
3. **Global Navigation Component:** Every page must include `<header id="site-header" data-root="../" data-active="TOOL_KEY">` and `<footer id="site-footer"></footer>`, populated dynamically by `../js/components.js`.
4. **Mobile Drawer Rule:** `#mobileDrawerBackdrop` and `#mobileDrawer` are appended dynamically by `components.js` before `</body>`. Do NOT place mobile drawer elements inside `<header>`.
5. **Multi-Currency Engine:** Import `../js/currency.js` and include the standard currency select dropdown `<select id="currencySelect">` in header controls or input panels.
6. **AdSense Placeholder Clean Render:** Do NOT display empty gray ad borders. Use standard `.adsense-card` containers with hidden borders when unfilled.
7. **Content Volume & Schema:** Every tool page MUST include **800–1,200 words of warm, relatable personal advice** (No dense corporate jargon!) and Schema.org `WebApplication` + `FAQPage` JSON-LD blocks in `<head>`.

---

## 2. Agent Task Packets & Work Breakdown

---

### 📦 TASK PACKET 1: Upgrade Existing 5 Tools (Phase 1)
*Assignee Target: Content & UI Refinement Agent*

#### Objective:
Enrich all 5 existing calculator pages with warm, relatable personal finance advice, real-world case studies, and Platform Methodology footers to resolve AdSense "thin content" flags.

#### Files to Modify:
1. `freelance-calculator/index.html`
2. `w2-1099-calculator/index.html`
3. `relocation-calculator/index.html`
4. `ai-token-calculator/index.html`
5. `runway-calculator/index.html`

#### Exact Content Sections to Add to Each Page (800–1,200 Words Total):
- **Section 1: The Human Dilemma & Real-World Reality Check (H2)**  
  *Tone:* Warm, conversational, encouraging.  
  *Focus:* Explain why people struggle with this decision (e.g. unbillable hours, hidden contractor expenses, cost-of-living surprises).
- **Section 2: Step-by-Step Math & Plain-English Formula Breakdown (H2)**  
  *Focus:* Clear breakdown of inputs, mathematical equations, and assumptions without corporate jargon.
- **Section 3: Real Life Case Study / Persona Story (H2)**  
  *Focus:* A 300-word story showing a relatable person (e.g., Sarah the web designer, Alex the software engineer) using the tool to make a life decision.
- **Section 4: Practical Rules of Thumb & Cheat Sheet (H2)**  
  *Focus:* Actionable bullet points, benchmarks, and quick decision trees.
- **Section 5: Expanded FAQ Accordion (H2)**  
  *Focus:* 5–8 practical Q&A items matching `FAQPage` JSON-LD schema in `<head>`.
- **Section 6: Platform Methodology & Data Citations (Footer Region)**  
  *HTML Block:*
  ```html
  <div class="bg-slate-100 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400 mt-8 space-y-1">
    <div class="font-bold text-slate-700 dark:text-slate-300">Methodology & Data Citations</div>
    <p>Calculations execute 100% client-side. Financial benchmarks updated regularly against official datasets (OECD, HMRC, IRS, EU Tax Directives, and Open ER API live exchange rates).</p>
  </div>
  ```

---

### 📦 TASK PACKET 2: Personal Finance Tools (Phase 2)
*Assignee Target: Frontend & Finance Math Agent*

#### 1. 50/30/20 Budget & Paycheck Splitter (`/budget-calculator/`)
- **File Path:** `budget-calculator/index.html`, `budget-calculator/app.js`
- **Math Engine:**
  $$\text{Needs (50\%)} = \text{Net Income} \times 0.50$$
  $$\text{Wants (30\%)} = \text{Net Income} \times 0.30$$
  $$\text{Savings/Debt (20\%)} = \text{Net Income} \times 0.20$$
- **UI Inputs:** Monthly net income field, currency selector, custom percentage sliders.
- **UI Outputs:** Interactive pie chart (Chart.js), category breakdown cards, 1-Click "Save Budget PDF" button.

#### 2. Subscription & Silent Drain Audit (`/subscription-calculator/`)
- **File Path:** `subscription-calculator/index.html`, `subscription-calculator/app.js`
- **Math Engine:**
  $$\text{Annual Drain} = \sum (\text{Monthly Subscription}) \times 12$$
  $$\text{Hours Worked to Pay} = \frac{\text{Annual Drain}}{\text{Hourly Take-Home Rate}}$$
  $$\text{5-Year Invested Potential} = \text{Annual Drain} \times \frac{(1 + r)^5 - 1}{r} \quad (r = 7\%)$$
- **UI Inputs:** Multi-select presets (Netflix, Spotify, Gym, iCloud, ChatGPT, Adobe, Substack) + custom sub builder.
- **UI Outputs:** Annual total banner, hours of work required display, 5-year compound growth forecast.

#### 3. Debt Snowball vs. Avalanche Payoff Planner (`/debt-calculator/`)
- **File Path:** `debt-calculator/index.html`, `debt-calculator/app.js`
- **Math Engine:**
  - *Snowball:* Sort debts ascending by balance. Allocate extra payment to smallest balance.
  - *Avalanche:* Sort debts descending by APR. Allocate extra payment to highest APR.
- **UI Inputs:** Add debt rows (Name, Balance, Interest Rate %, Min Payment), Extra Monthly Cash field.
- **UI Outputs:** Side-by-side comparison matrix (Debt-Free Month, Total Interest Paid, Total Time Saved).

#### 4. Side Hustle & Platform Fee Profit Calculator (`/side-hustle-calculator/`)
- **File Path:** `side-hustle-calculator/index.html`, `side-hustle-calculator/app.js`
- **Math Engine:**
  $$\text{Net Profit} = \text{Gross Sales} - \text{Platform Fee} - \text{Payment Fee} - \text{Shipping/COGS} - \text{Estimated Income Tax}$$
- **UI Inputs:** Platform presets (Etsy 6.5%, eBay 13.25%, Fiverr 20%, Airbnb 3%, Uber 25%, Custom %), Gross Sales, Expenses.
- **UI Outputs:** Net take-home margin %, total fee cut breakdown, hourly equivalent rate.

---

### 📦 TASK PACKET 3: Work & Productivity Tools (Phase 3)
*Assignee Target: Productivity & Ticker Agent*

#### 1. Real-Time Meeting Cost Ticker (`/meeting-cost-calculator/`)
- **File Path:** `meeting-cost-calculator/index.html`, `meeting-cost-calculator/app.js`
- **Math Engine:**
  $$\text{Cost Per Second} = \frac{\text{Number of Attendees} \times \text{Average Hourly Rate}}{3600}$$
- **UI Features:**
  - Inputs: Number of attendees, Average hourly wage, Planned duration.
  - Live Ticker: Real-time counter updating every second ($0.00 -> $14.50 -> $120.00).
  - Ticker Controls: Start Meeting, Pause, Reset, Share Cost Ticker Summary.

#### 2. Screen Time & Opportunity Cost Converter (`/screen-time-calculator/`)
- **File Path:** `screen-time-calculator/index.html`, `screen-time-calculator/app.js`
- **Math Engine:**
  $$\text{Annual Hours Lost} = \text{Daily Screen Time (Hours)} \times 365$$
  $$\text{Financial Value Lost} = \text{Annual Hours Lost} \times \text{Hourly Wage Goal}$$
- **UI Inputs:** Daily phone/social media hours slider, Hourly wage goal.
- **UI Outputs:** Annual lost time card, lost financial value display, books you could have read counter.

#### 3. Audiobook & Video Speed Time Saver (`/playback-speed-calculator/`)
- **File Path:** `playback-speed-calculator/index.html`, `playback-speed-calculator/app.js`
- **Math Engine:**
  $$\text{Actual Listening Time} = \frac{\text{Original Duration (Hours)}}{Speed}$$
  $$\text{Time Saved} = \text{Original Duration} - \text{Actual Listening Time}$$
- **UI Inputs:** Original audio/video duration (Hours & Mins), Speed selector (1.0x, 1.25x, 1.5x, 1.75x, 2.0x, 2.5x).
- **UI Outputs:** Hours & minutes saved, finish date estimator.

---

### 📦 TASK PACKET 4: Travel & Lifestyle Tools (Phase 4)
*Assignee Target: Lifestyle & Utilities Agent*

#### 1. Car Ownership vs. Uber & Public Transit (`/car-cost-calculator/`)
- **File Path:** `car-cost-calculator/index.html`, `car-cost-calculator/app.js`
- **Math Engine:**
  $$\text{Car Total/Mo} = \text{Loan/Lease} + \text{Gas/Charging} + \text{Insurance} + \text{Maintenance} + \text{Parking} + \text{Depreciation}$$
  $$\text{Transit Total/Mo} = (\text{Monthly Rideshares}) + \text{Public Transit Pass}$$
- **UI Inputs:** Car expenses inputs vs. Uber & Transit inputs.
- **UI Outputs:** Side-by-side annual cost comparison, 5-year difference, savings investment potential.

#### 2. Sleep Cycle & REM Optimizer (`/sleep-calculator/`)
- **File Path:** `sleep-calculator/index.html`, `sleep-calculator/app.js`
- **Math Engine:**
  - REM Cycle = 90 Minutes.
  - Average time to fall asleep = 14 Minutes.
  - Optimal Wake Times = $\text{Bedtime} + 14\text{m} + (N \times 90\text{m})$ for $N = 4, 5, 6$.
- **UI Inputs:** Mode Switch ("I want to wake up at..." vs "I am going to sleep now..."), Time picker.
- **UI Outputs:** Color-coded suggested wake/bed times (4 cycles = 6h, 5 cycles = 7.5h, 6 cycles = 9h).

#### 3. Recipe Scaler & Culinary Unit Converter (`/recipe-scaler/`)
- **File Path:** `recipe-scaler/index.html`, `recipe-scaler/app.js`
- **Math Engine:**
  $$\text{Scaled Quantity} = \text{Original Quantity} \times \frac{\text{Target Servings}}{\text{Original Servings}}$$
- **UI Inputs:** Original servings, Target servings, Add ingredient rows (Name, Quantity, Unit).
- **UI Outputs:** Instant scaled ingredient list, 1-Click "Copy Grocery List" button, Unit converter widget (grams to cups, °C to °F).

---

### 📦 TASK PACKET 5: Master Dashboard, Blog Engine & Sitemap (Phase 5)
*Assignee Target: Integration & Publishing Agent*

#### 1. Master Hub Dashboard Redesign (`index.html`)
- Update `index.html` with category tabs: **All Tools**, **Personal Finance**, **Work & Productivity**, **Everyday Lifestyle**.
- Include search filter bar to instantly filter cards by keyphrase.
- Display 15 tool launch cards with category badges and direct launch buttons.

#### 2. Initial Blog Launch Batch (8 Articles in `/blog/`)
Publish 8 long-form markdown/HTML articles under subfolders:
1. `blog/how-much-should-i-charge-freelance-guide/index.html`
2. `blog/should-i-quit-my-job-to-freelance-checklist/index.html`
3. `blog/full-time-salary-vs-contractor-rate-explained/index.html`
4. `blog/chatgpt-plus-vs-api-tokens-cost-comparison/index.html`
5. `blog/how-to-build-a-3-month-emergency-fund/index.html`
6. `blog/best-affordable-cities-for-remote-workers-2026/index.html`
7. `blog/how-to-handle-unpaid-vacation-as-a-freelancer/index.html`
8. `blog/how-to-avoid-freelancer-burnout/index.html`

#### 3. XML Sitemap & Robots Update
- Update `sitemap.xml` to list all 15 tool URLs and 10 blog URLs with accurate `<lastmod>` timestamps.

---

## 3. Verification & Quality Assurance Protocol

Before submitting any task packet as complete:
1. **Zero-FOUC Verification:** Verify theme toggle switches between dark and light mode seamlessly without screen flashes.
2. **Mobile Responsive Check:** Open mobile drawer on 375px viewport to ensure menu links render cleanly and `#mobileDrawer` remains outside `<header>`.
3. **Reactive Math Verification:** Test that numbers update instantly on `input` events without requiring page refreshes.
4. **Console Log Cleanliness:** Verify 0 JavaScript errors in Chrome DevTools console.

---

*Master Directive generated for PocketRuler.app multi-agent delegation.*
