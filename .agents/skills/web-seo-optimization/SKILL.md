---
name: web-seo-optimization
description: >-
  Audits, enhances, and optimizes web pages, interactive tools, and calculators for modern Technical SEO, Core Web Vitals (LCP, INP, CLS), Schema.org structured data (JSON-LD), and Generative Engine Optimization (GEO/AI Search citations). Use when creating new pages, auditing existing URLs, fixing indexing issues, or adding schema markup.
---

# Web SEO & Generative Engine Optimization (GEO) Skill

This skill guides you through auditing, refining, and engineering web pages to maximize organic search rankings, Core Web Vitals performance, and AI Search citation frequency (Google AI Overviews, Perplexity, ChatGPT Search).

---

## 1. Quick Reference & Core Tools

When applying this skill, leverage the bundled utilities and references:
- **Audit Script**: Run `python .agents/skills/web-seo-optimization/scripts/audit_page_seo.py <path-to-html-file>` to instantly evaluate on-page SEO, headings, canonicals, Schema JSON-LD, and Core Web Vitals shift risks.
- **Checklist**: [Technical SEO Checklist](./references/technical-seo-checklist.md)
- **Schema Templates**: [Schema.org JSON-LD Templates](./references/schema-templates.md)
- **AI Search Optimization**: [GEO & AI Search Guide](./references/geo-ai-search-optimization.md)
- **Master Guidelines**: [Master SEO & GEO Guide](../../../SEO_OPTIMIZATION_GUIDE.md)

---

## 2. Standard Optimization Procedure

When assigned to optimize an existing page or create a new page, follow these 5 phases:

### Phase 1: Automated Audit & Baseline Assessment
1. Run the local audit script against the target file:
   ```bash
   python .agents/skills/web-seo-optimization/scripts/audit_page_seo.py path/to/page/index.html
   ```
2. Note any critical issues (missing title, duplicate H1, missing canonical, broken JSON-LD) and warnings (description length, missing image alt/dimensions, thin content).

### Phase 2: Metadata & Canonical Engineering
1. **Title Tag**:
   - Ensure format: `[Primary Keyword / Value Proposition] | [Brand Name]`
   - Verify character count is between 50 and 60 characters.
2. **Meta Description**:
   - Ensure character count is between 120 and 155 characters.
   - Front-load actionable intent ("Calculate...", "Compare...", "Forecast...").
3. **Canonical URL**:
   - Add `<link rel="canonical" href="https://pocketruler.app/[slug]/" />`.
   - Verify trailing slash consistency.
4. **Social Graph**:
   - Set `og:title`, `og:description`, `og:image`, `og:url`, `og:type`.
   - Set `<meta name="twitter:card" content="summary_large_image" />`.

### Phase 3: Semantic Heading & Document Hierarchy
1. **H1 Discipline**:
   - Verify there is **exactly one** `<h1>` element on the page.
   - The `<h1>` must contain the primary search phrase.
2. **H2 & H3 Hierarchy**:
   - Nest headings sequentially: `<h1>` $\to$ `<h2>` $\to$ `<h3>`.
   - Never skip heading levels.
   - Use natural language question headings for educational sections (`<h2>How Do Caching Discounts Work?</h2>`).

### Phase 4: Schema.org Structured Data Injection
1. Select appropriate schemas from [schema-templates.md](./references/schema-templates.md):
   - Interactive tools / calculators: `WebApplication`
   - FAQ sections: `FAQPage`
   - Educational articles: `Article`
   - Navigational hierarchy: `BreadcrumbList`
2. Embed the JSON-LD script blocks directly in `<head>`.
3. Validate that question/answer pairs in `FAQPage` match the on-page text verbatim.

### Phase 5: Generative Engine Optimization (GEO) & Content Depth
1. **Anti-Thin-Content Check**:
   - Ensure calculator pages feature 1,500+ words of explanatory methodology, formulas, and FAQs.
2. **Answer Capsules**:
   - Ensure each primary `<h2>` section opens with a 40–60 word direct factual definition or benchmark before continuing into long-form copy.
3. **Structured Tables**:
   - Present comparative data in clean HTML `<table>` elements rather than CSS-only cards.
4. **Mathematical Precision**:
   - Format formulas using clear LaTeX notation ($\LaTeX$).

### Phase 6: Core Web Vitals (CWV) Safeguards
1. **LCP**:
   - Verify preconnect tags exist for font/CDN origins.
   - Ensure hero logo has `fetchpriority="high"`.
2. **INP**:
   - Verify calculation logic runs synchronously without unnecessary microtask delays or async locks.
   - Debounce canvas / chart re-renders.
3. **CLS**:
   - Confirm all `<img>` and `<svg>` tags have hardcoded `width` and `height` attributes.
   - Confirm dynamic ad slots have `min-height` reservation wrappers (e.g., `min-h-[90px]`, `min-h-[250px]`).

---

## 3. Verification & Acceptance Criteria

Before completing an SEO task, confirm:
1. `audit_page_seo.py` returns an overall score $\ge 90/100$ with **zero critical issues**.
2. Page URL is registered in `sitemap.xml` with current `<lastmod>`.
3. Schema markup parses cleanly without JSON syntax errors.
4. All images have descriptive `alt` tags and explicit dimensions.
