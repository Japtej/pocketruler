# PocketRuler AdSense Approval — Complete Implementation Plan

> **Goal:** Pass Google AdSense "Low Value Content" review by achieving 25+ indexed, high-quality articles + full tool coverage in GSC.
> **Current State:** 7 blog articles, 21 tool pages (11 were missing from sitemap — **now fixed**), all mandatory pages present.
> **Target:** 25+ articles (need 18 more), all 21 tools indexed, organic traffic signals.

---

## Phase 0: Quick Wins ✅ COMPLETED

| Task | Status |
|------|--------|
| Add 11 missing calculator pages to sitemap.xml | ✅ Done |
| Verify all mandatory pages (Privacy, About, Contact, Terms, Disclaimer) | ✅ Present & linked |
| Verify AdSense cookie disclosure in Privacy Policy | ✅ Lines 116-131 |
| Verify all tool pages have FAQ schema | ✅ Present |
| Verify no broken internal links / lorem ipsum | ✅ Clean |
| Verify mobile-responsive, HTTPS, canonical URLs | ✅ All pass |

---

## Phase 1: Technical SEO Foundation (Week 1)

### 1.1 Google Search Console Setup
- [ ] **Submit updated sitemap.xml** (31 URLs) in GSC
- [ ] **Request indexing** for all 21 tool pages + blog index
- [ ] **Check Coverage report** — resolve any "Crawled - currently not indexed" or "Discovered - currently not indexed"
- [ ] **Verify robots.txt** allows all content:
  ```
  User-agent: *
  Allow: /
  Sitemap: https://pocketruler.app/sitemap.xml
  ```

### 1.2 Indexing Monitoring Dashboard
Create a simple tracking sheet (Google Sheets) with columns:
| URL | Type | Submitted | Indexed (Y/N) | Date Indexed | GSC Status |
|-----|------|-----------|---------------|--------------|------------|
| /ai-token-calculator/ | Tool | 2026-09-25 | | | |
| /budget-calculator/ | Tool | 2026-09-25 | | | |
| ... | ... | ... | | | |

### 1.3 Core Web Vitals Baseline
- Run PageSpeed Insights on 5 representative pages (home, blog index, article, calculator, methodology)
- Target: LCP < 2.5s, CLS < 0.1, INP < 200ms
- Document any regressions from Tailwind/Chart.js CDN loads

---

## Phase 2: Content Production Pipeline (Weeks 2-7)

### 2.1 Article Production Targets
**Goal:** 18 new articles in 6 weeks = **3 articles/week**

| Week | Articles | Topics | Target Calculator |
|------|----------|--------|-------------------|
| 2 | 3 | Freelance Rate Setting (Design vs Dev), True Hourly Rate W-2/1099, Digital Nomad Visa Comparison | freelance-calculator, w2-1099-calculator, relocation-calculator |
| 3 | 3 | Spain vs Portugal vs Dubai Tax, Startup Runway 18-Month Rule, Bootstrapped vs VC Burn Rates | relocation-calculator, runway-calculator, runway-calculator |
| 4 | 3 | AI API Cost Optimization, Local LLM vs Cloud Break-Even, 50/30/20 Budget in High COL | ai-token-calculator, ai-token-calculator, budget-calculator |
| 5 | 3 | Debt Avalanche vs Snowball, Side Hustle Tax Set-Aside, Platform Fee Comparison 2026 | debt-calculator, side-hustle-calculator, side-hustle-calculator |
| 6 | 3 | $50K Meeting Waste, Screen Time Opportunity Cost, Audiobook Speed Retention | meeting-cost-calculator, screen-time-calculator, playback-speed-calculator |
| 7 | 3 | Car Ownership vs Uber 10 Cities, Sleep Cycle Math, Subscription Audit $2,400/Year | car-cost-calculator, sleep-calculator, subscription-calculator |

### 2.2 Article Quality Standards (Non-Negotiable)
Every article MUST pass this checklist before publish:

| Criterion | Minimum | Verification |
|-----------|---------|--------------|
| Word count | 800+ words | `wc -w` |
| Original analysis/data | ≥3 unique data points | Manual review |
| Calculator integration | ≥2 contextual links to relevant tool | grep for calculator URL |
| FAQ Schema | 3-5 questions with real search volume | Schema validator |
| Author attribution | "PocketRuler [Topic] Desk" | Byline present |
| Internal links | ≥2 to other articles/tools | Manual count |
| Meta description | 150-160 chars, unique | `<meta name="description">` |
| OG/Twitter cards | Image + title + description | Social debugger |
| Last Updated date | Today's date in header | Visible on page |
| No AI boilerplate | Zero "In today's world", "delve", "tapestry" | Manual scan |

### 2.3 Content Brief Template (Per Article)
```
# Content Brief: [Article Title]

**Target Keyword:** [Primary + 2 secondary]
**Search Intent:** [Informational/Commercial/Transactional]
**Target Calculator:** [URL + specific feature to highlight]
**Competitor Gap:** [What top 3 results miss that we'll cover]
**Unique Data/Analysis:** [Original calculation, survey, or synthesis]
**FAQ Questions:** [3-5 from People Also Ask + AnswerThePublic]
**Internal Link Targets:** [2+ existing URLs]
**Word Target:** 1000-1500
**Author:** PocketRuler [Topic] Desk
**Schema:** Article + FAQPage
**Images:** 2-3 custom (charts/screenshots from calculator)
```

### 2.4 Publishing Workflow
1. **Research** (Day 1): Keyword data, competitor analysis, calculator screenshots
2. **Draft** (Day 2): Write to brief, embed calculator links naturally
3. **Technical** (Day 3): Add FAQ schema, meta tags, OG image, internal links
4. **Review** (Day 3): Checklist pass → publish
5. **Index** (Day 3): Submit URL in GSC → request indexing
6. **Track**: Log in monitoring sheet

---

## Phase 3: E-A-T & Trust Amplification (Week 3-4, parallel)

### 3.1 Editorial Standards Page
**New page:** `/editorial-standards.html` (linked in footer)
- Content sourcing methodology
- Calculator verification process
- Correction/updates policy
- Author credentials

### 3.2 Author Bio Component
Add to each article footer:
```html
<div class="author-bio">
  <img src="/assets/authors/financial-desk.svg" alt="" width="48" height="48">
  <div>
    <strong>PocketRuler Financial Desk</strong>
    <p>10+ years fintech product & strategy. Calculations verified against IRS, OECD, Numbeo, and primary SaaS pricing pages.</p>
    <a href="/editorial-standards.html">Our methodology →</a>
  </div>
</div>
```

### 3.3 "How We Calculate" Links
Each calculator page already has methodology links — ensure they're prominent:
- Add "📖 How this works" button in calculator hero section
- Link to `/relocation-calculator/methodology.html` pattern (create for other tools)

### 3.4 Trust Badges (Footer)
```
✓ 100% Client-Side — No data leaves your browser
✓ Calculations verified against [IRS/OECD/Numbeo/SaaS pricing]
✓ Updated monthly with latest rates
✓ No login, no tracking, no cookies required
```

---

## Phase 4: Content Freshness & Authority Signals (Ongoing)

### 4.1 Publication Cadence
- **Weeks 2-7:** 3 articles/week (18 total)
- **Weeks 8+:** 2 articles/week (sustain momentum)
- **Monthly:** Update 2-3 existing articles with fresh data

### 4.2 Content Update Protocol
When updating any page:
1. Change `<lastmod>` in sitemap.xml
2. Update "Last Updated" visible date on page
3. Add changelog note: "Updated [date]: [what changed]"
4. Resubmit URL in GSC

### 4.3 Internal Link Audit (Monthly)
- Run `grep -r "href=\"/blog/" --include="*.html" | sort | uniq -c`
- Ensure new articles link to ≥2 older articles
- Ensure older articles link to new relevant content
- Fix orphan pages (pages with <2 internal inbound links)

---

## Phase 5: Pre-Resubmission Audit (Week 8)

### 5.1 GSC Health Check
| Metric | Target | Tool |
|--------|--------|------|
| Pages indexed | ≥45 (21 tools + 24 articles) | GSC Coverage |
| Crawl errors | 0 | GSC Coverage |
| Manual actions | None | GSC Security & Manual Actions |
| Organic clicks (28 days) | ≥50 | GSC Performance |
| Organic impressions (28 days) | ≥500 | GSC Performance |
| Average position | <50 | GSC Performance |

### 5.2 Content Audit
- [ ] All 25+ articles: 800+ words, FAQ schema, calculator links
- [ ] All 21 tool pages: functional, FAQ schema, methodology linked
- [ ] No thin/placeholder pages remain
- [ ] All images have alt text

### 5.3 Technical Audit
- [ ] robots.txt clean
- [ ] sitemap.xml submitted & processed
- [ ] All canonical URLs self-referencing
- [ ] No mixed content (HTTPS everywhere)
- [ ] Mobile usability: 0 errors in GSC
- [ ] Page speed: no "Poor" URLs in Core Web Vitals

### 5.4 Policy Compliance
- [ ] Privacy Policy explicitly names Google AdSense + third-party cookies
- [ ] Contact form functional (mailto works)
- [ ] No prohibited content (gambling, adult, weapons, etc.)
- [ ] Ad density: ≤3 ad units/page (currently 3 — OK)
- [ ] Ads labeled "Advertisement" or "Sponsored"

---

## Phase 6: Resubmission & Monitoring (Week 8+)

### 6.1 Resubmission Checklist
- [ ] All Phase 5 checks pass
- [ ] 14+ days since last rejection (AdSense policy)
- [ ] Screenshot GSC performance graph showing growth
- [ ] Submit review request in AdSense console

### 6.2 Post-Approval Monitoring
- Week 1: Daily AdSense policy center check
- Month 1: Weekly content + technical audit
- Ongoing: Maintain 2 articles/week cadence

---

## Resource Requirements

### Content Production
| Resource | Quantity | Notes |
|----------|----------|-------|
| Writer/Subject Expert | 1 (you) | 3 articles/week sustainable? |
| Calculator Screenshots | ~50 | Automate with headless browser? |
| Custom Charts | ~36 | 2/article — use Chart.js + export PNG |
| Schema Validator | 1 | Use Google Rich Results Test |

### Technical
| Task | Effort | Owner |
|------|--------|-------|
| GSC setup & monitoring | 2 hrs | You |
| Editorial standards page | 3 hrs | You |
| Author bio component | 1 hr | You |
| "How We Calculate" pages (10 tools) | 10 hrs | You |
| Internal link audit script | 2 hrs | You |

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| GSC indexing slow | Medium | High | Submit URLs manually daily; use IndexNow if available |
| Article quality inconsistent | Medium | High | Strict checklist + peer review |
| AdSense rejects again | Low (if plan followed) | Critical | Exceed minimums: 30 articles, 500+ GSC clicks |
| Tool pages flagged as "thin" | Low | Medium | Each has 1000+ words explanation + FAQ + methodology |
| Content velocity unsustainable | Medium | Medium | Batch research; reuse calculator outputs; template system |

---

## Success Metrics (Definition of Done)

| Metric | Target | Measurement |
|--------|--------|-------------|
| Total indexed articles | ≥25 | GSC Coverage |
| Total indexed tool pages | 21 | GSC Coverage |
| Organic clicks (28-day) | ≥100 | GSC Performance |
| Average article word count | ≥1000 | Content audit |
| FAQ schema coverage | 100% articles | Rich Results Test |
| AdSense approval | ✅ Approved | AdSense dashboard |

---

## File/Asset Checklist for Production

### New Files to Create
- [ ] `/editorial-standards.html`
- [ ] `/assets/authors/financial-desk.svg` (and variants)
- [ ] 18 article directories under `/blog/` with `index.html`
- [ ] 10 methodology pages (one per calculator family)
- [ ] `content-briefs/` folder with 18 brief markdown files

### Files to Modify
- [ ] `sitemap.xml` — append new article URLs as published
- [ ] `components.js` — add author bio component
- [ ] `footer` partial (in components.js) — add Editorial Standards link
- [ ] Each calculator `index.html` — add "How this works" button

---

## Timeline Summary

```
Week 1:  Technical SEO (GSC, sitemap, indexing, baseline CWV)
Week 2:  Articles 1-3  + Editorial Standards page
Week 3:  Articles 4-6  + Author bios + "How We Calculate" pages (batch 1)
Week 4:  Articles 7-9  + "How We Calculate" pages (batch 2)
Week 5:  Articles 10-12 + Internal link audit
Week 6:  Articles 13-15 + Content freshness updates
Week 7:  Articles 16-18 + Final content audit
Week 8:  Full GSC/Technical/Policy audit → Resubmit AdSense
```

---

## Next Immediate Actions

1. **Set up GSC tracking sheet** (5 min)
2. **Submit sitemap.xml** in GSC (2 min)
3. **Request indexing** for 21 tool pages (5 min)
4. **Create content brief** for Article 1: "Freelance Rate Setting for Designers vs Developers" (30 min)
5. **Write Article 1** using brief + freelance-calculator screenshots (2-3 hrs)

---

*Plan created: 2026-09-27 | Next review: 2026-10-04 (Week 1 checkpoint)*