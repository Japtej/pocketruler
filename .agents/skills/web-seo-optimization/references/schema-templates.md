# Schema.org JSON-LD Production Templates

These templates adhere to Schema.org standards and Google Search Central specifications.

---

## 1. WebApplication Schema (Calculators & Web Apps)

Use on all interactive utilities, rate estimators, and calculators:

```html
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
  },
  "description": "Free interactive financial calculator to convert target annual income into hourly rates, daily rates, and monthly client retainers with self-employment tax and business overhead modeling."
}
</script>
```

---

## 2. FAQPage Schema (Rich Result Q&A)

Pair this with visible FAQ accordions. The text in `acceptedAnswer.text` must match the visible text on the page:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What is the difference between an hourly rate and a monthly retainer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "An hourly rate bills clients retrospectively for each individual hour logged. A monthly retainer is an upfront recurring agreement where the client pays a fixed monthly fee to secure a dedicated block of hours or predefined monthly deliverables, providing guaranteed capacity and predictable cash flow."
      }
    },
    {
      "@type": "Question",
      "name": "How should freelancers account for unpaid time off and sick days?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Freelancers should deduct non-billable vacation weeks (typically 3 to 5 weeks per year) and 5 to 10 federal holidays from their total annual working weeks (52 weeks) before calculating their target hourly billable rate. Dividing required annual revenue by 44 to 47 working weeks ensures overhead and time off are fully covered."
      }
    }
  ]
}
</script>
```

---

## 3. Article / BlogPosting Schema

Use on educational guides, analyses, and blog posts:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Full-Time Salary vs Contractor Rate Explained",
  "url": "https://pocketruler.app/blog/full-time-salary-vs-contractor-rate-explained/",
  "image": "https://pocketruler.app/assets/og-salary-vs-contractor.png",
  "datePublished": "2026-09-28T00:00:00+00:00",
  "dateModified": "2026-09-28T00:00:00+00:00",
  "author": {
    "@type": "Organization",
    "name": "PocketRuler Editorial Team",
    "url": "https://pocketruler.app/about.html"
  },
  "publisher": {
    "@type": "Organization",
    "name": "PocketRuler.app",
    "url": "https://pocketruler.app/",
    "logo": {
      "@type": "ImageObject",
      "url": "https://pocketruler.app/logo.svg"
    }
  },
  "description": "Comprehensive guide breaking down how to convert W2 full-time salary to a 1099 hourly contractor rate, accounting for taxes, benefits, and unbillable hours."
}
</script>
```

---

## 4. BreadcrumbList Schema

Use to generate breadcrumb navigation trails in search snippets:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "https://pocketruler.app/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Tools",
      "item": "https://pocketruler.app/#tools"
    },
    {
      "@type": "ListItem",
      "position": 3,
      "name": "Freelance Calculator",
      "item": "https://pocketruler.app/freelance-calculator/"
    }
  ]
}
</script>
```

---

## 5. Organization Schema (Root Domain & E-E-A-T)

Embed on the home page and `/about.html`:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "PocketRuler.app",
  "url": "https://pocketruler.app/",
  "logo": "https://pocketruler.app/logo.svg",
  "sameAs": [
    "https://github.com/Japtej/pocketruler"
  ],
  "description": "Free, privacy-first client-side financial modeling and productivity calculators for independent knowledge workers."
}
</script>
```
