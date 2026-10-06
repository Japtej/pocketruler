# Technical SEO & Core Web Vitals Audit Checklist (2026)

This checklist provides a systematic pass/fail evaluation for web pages, calculators, and content articles.

---

## 1. Indexing & Canonicalization
- [ ] **HTTP Status**: Page returns `200 OK` directly without redirect chains.
- [ ] **Canonical URL**:
  - Contains `<link rel="canonical" href="https://example.com/path/" />`.
  - Canonical URL uses lowercase, kebab-case, and matches trailing slash convention.
  - Exactly one canonical tag in `<head>`.
- [ ] **Robots Directives**:
  - `robots.txt` does not disallow search engine crawlers (`Googlebot`, `Bingbot`, `OAI-SearchBot`, `PerplexityBot`).
  - No accidental `<meta name="robots" content="noindex" />` on production pages.
- [ ] **XML Sitemap**:
  - Absolute URL listed in `sitemap.xml`.
  - Valid `<lastmod>` date (`YYYY-MM-DD`).
  - Appropriate `<priority>` (`0.8` to `1.0` for tools, `0.7` for blog posts).

---

## 2. Document Head & Metadata
- [ ] **`<title>` Tag**:
  - Length: 50–60 characters (max 65).
  - Target keyword placed near the front.
  - Brand name appended at the end (e.g. `| PocketRuler.app`).
  - Unique across the entire domain.
- [ ] **`<meta name="description">`**:
  - Length: 120–155 characters (max 165).
  - Includes target keyword and clear value proposition.
  - Active call-to-action (e.g., "Calculate your...", "Compare models...").
- [ ] **`<meta name="viewport">`**:
  - Set to `width=device-width, initial-scale=1.0`.
- [ ] **Language Attribute**:
  - Declared on root element: `<html lang="en">`.
- [ ] **Open Graph (Social Cards)**:
  - `og:title` matching or adapting `<title>`.
  - `og:description` matching or adapting `<meta name="description">`.
  - `og:image` pointing to high-resolution visual (1200x630px).
  - `og:url` pointing to canonical URL.
  - `og:type` set to `website` or `article`.
- [ ] **Twitter Card**:
  - `<meta name="twitter:card" content="summary_large_image" />`.
  - `twitter:title` and `twitter:description` present.

---

## 3. Core Web Vitals (CWV)
- [ ] **Largest Contentful Paint (LCP $\le 2.5\text{s}$)**:
  - Preconnect links for external font domains (`fonts.googleapis.com`, `fonts.gstatic.com`).
  - Above-the-fold hero logo/image has `fetchpriority="high"`.
  - Third-party scripts (e.g. AdSense, analytics) use `async` or `defer`.
- [ ] **Interaction to Next Paint (INP $\le 200\text{ms}$)**:
  - Reactive form calculations execute synchronously in $< 16\text{ms}$.
  - Complex chart or canvas drawing is debounced ($100\text{ms}$–$150\text{ms}$).
  - No synchronous long tasks blocking the main thread.
- [ ] **Cumulative Layout Shift (CLS $\le 0.10$, Target: `0.00`)**:
  - All `<img>` and `<svg>` elements declare explicit `width` and `height` attributes.
  - Dynamic ad units and embed containers reserve minimum dimensions using CSS (`min-h-[90px]`, `min-h-[250px]`).
  - Theme switches (Dark/Light) run synchronously before body render to eliminate Flash of Unstyled Content (FOUC).

---

## 4. Semantic Hierarchy & On-Page Content
- [ ] **Heading Structure**:
  - Exactly one `<h1>` per document.
  - `<h1>` reflects user search intent.
  - `<h2>` sections break down tool features, formulas, case studies, and FAQs.
  - `<h3>` subsections follow `<h2>` without skipping levels (no `<h2>` to `<h4>`).
  - Heading tags used only for content hierarchy, not for visual styling.
- [ ] **Content Depth & Anti-Thin-Content**:
  - Interactive tools must feature **1,500 to 2,500+ words** of structured educational copy below the form.
  - Step-by-step mathematical formula explanations rendered with LaTeX notation.
  - Clear real-world case studies or scenario examples.
- [ ] **Internal Linking**:
  - Descriptive anchor text used on all links (no "click here").
  - Bidirectional linking between calculators and companion educational articles.
  - Breadcrumb navigation displayed on the page.

---

## 5. Schema.org Structured Data
- [ ] **JSON-LD Implementation**:
  - Embedded inside `<script type="application/ld+json">`.
  - Valid JSON syntax without unescaped characters or trailing commas.
  - Uses `@context: "https://schema.org"`.
- [ ] **Required Schemas**:
  - Interactive tools: `WebApplication` (or `SoftwareApplication`).
  - FAQ sections: `FAQPage` with question/answer pairs matching page text.
  - Blog articles: `Article` or `BlogPosting` with author, publisher, and dates.
  - Hierarchical pages: `BreadcrumbList`.
