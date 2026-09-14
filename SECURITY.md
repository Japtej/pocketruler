# Security Design Document & Development Guidelines

**Project:** PocketRuler.app  
**Applies to:** All existing tools, sub-calculators, and future modules  
**Last Updated:** September 2026  

---

## 1. Core Architecture & Threat Model

PocketRuler.app is designed as a **client-side, zero-knowledge financial utility suite**. All computational logic, tax estimations, runway forecasts, and proposal drafts run strictly inside the user's browser sandbox.

### Core Security Guarantees
1. **Zero Data Exfiltration:** Under no circumstances should user-entered financial figures (incomes, rates, cash reserves, tax rates, expenses) be transmitted to any remote backend, telemetry server, or logging endpoint.
2. **Stateless Financial Privacy:** Financial numbers must never be persisted in browser `localStorage`, `sessionStorage`, or cookies without explicit user encryption. Storage is reserved strictly for operational non-sensitive UX flags (e.g., active theme, active currency code).
3. **Defense-in-Depth:** All dynamic client-side rendering must treat URL parameters, external exchange rates, and user inputs as untrusted data.

---

## 2. DOM-Based XSS Prevention Standards

DOM-based Cross-Site Scripting (XSS) is the most critical vulnerability class for client-side JavaScript applications. All engineers and AI contributors must adhere to the following rules:

### Rule 2.1: Ban on Raw HTML Interpolation of Untrusted Data
- **NEVER** pass untrusted input (URL query parameters, hash fragments, user text inputs, or external API responses) directly into:
  - `element.innerHTML`
  - `element.outerHTML`
  - `element.insertAdjacentHTML()`
  - `document.write()`
- **ALWAYS** use safe DOM properties:
  - Use `element.textContent = data` for plain text.
  - Use `input.value = data` for form inputs.
  - Use `document.createElement()` and `appendChild()` for dynamic UI construction.

### Rule 2.2: Mandatory Validation for URL Query Parameters (`URLSearchParams`)
When deserializing application state from `window.location.search`:
- **Numbers:** Always parse via `parseInt(val, 10)` or `parseFloat(val)` and verify with `!isNaN(val)`. Enforce bounds checks:
  ```javascript
  if (params.has('salary')) {
    const s = parseFloat(params.get('salary'));
    if (!isNaN(s) && s >= 0 && s <= 10000000) {
      state.salary = s;
    }
  }
  ```
- **Strings & Enumerations:** Validate against an explicit whitelist array or catalog. Never assign arbitrary query strings to state:
  ```javascript
  const ALLOWED_MODES = ['equivalent', 'comparison'];
  if (params.has('mode') && ALLOWED_MODES.includes(params.get('mode'))) {
    state.mode = params.get('mode');
  }
  ```
- **Object Key Lookups:** Always guard against prototype property traversal by using `Object.hasOwn()`:
  ```javascript
  // SAFE:
  const config = (key && Object.hasOwn(STATE_TAX_CONFIGS, key)) 
    ? STATE_TAX_CONFIGS[key] 
    : DEFAULT_CONFIG;

  // UNSAFE (resolves prototype methods like 'toString', 'constructor'):
  const config = STATE_TAX_CONFIGS[key] || DEFAULT_CONFIG;
  ```

---

## 3. Third-Party Dependencies & Supply Chain Security

### Rule 3.1: Subresource Integrity (SRI) Mandatory
Every external script or stylesheet loaded from a CDN (such as jsDelivr or cdnjs) **must** specify:
1. An explicit, pinned semantic version (e.g., `chart.js@4.4.4`, never `@latest`).
2. The `integrity` cryptographic hash (`sha384-...` or `sha512-...`).
3. `crossorigin="anonymous"`.

**Example:**
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.4/dist/chart.umd.min.js"
        integrity="sha384-zbvBLvdqUgPz5N2hAbl5BvFlSNsLpWdGqE7Z/tP+ZtY/G3r/qfT5M3bYy78="
        crossorigin="anonymous"></script>
```

### Rule 3.2: Avoid Development-Only CDNs in Production
The Tailwind Play CDN (`https://cdn.tailwindcss.com`) is strictly for prototyping. Production pages must utilize pre-compiled, minified stylesheets or have strict CSP controls to minimize runtime script execution overhead and supply chain vulnerability.

---

## 4. Content Security Policy (CSP) & HTTP Security Meta Tags

Every HTML file in PocketRuler must include standard security meta tags within `<head>`:

```html
<!-- Security & Defense-in-Depth Meta Tags -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta name="referrer" content="strict-origin-when-cross-origin" />
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' https://cdn.tailwindcss.com https://cdn.jsdelivr.net https://pagead2.googlesyndication.com https://ep2.adtrafficquality.google;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://open.er-api.com https://pagead2.googlesyndication.com https://ep2.adtrafficquality.google;
  frame-src 'self' https://googleads.g.doubleclick.net;
" />
```

---

## 5. Reverse Tabnabbing & Link Isolation

Any hyperlinked tag using `target="_blank"` must include `rel="noopener noreferrer"` to prevent the target window from accessing `window.opener.location`:

```html
<!-- Required format for all outbound links -->
<a href="https://example.com" target="_blank" rel="noopener noreferrer">External Resource</a>
```

This rule applies to:
- Static HTML anchors.
- Dynamic DOM anchors generated in JavaScript.
- Copyable embed code snippets generated for external users.

---

## 6. Privacy, Cookies & Ad Compliance (GDPR / IAB TCF 2.2)

1. **Google EU User Consent Policy:** Google AdSense publishers serving traffic to the EEA and UK must use a Google-certified Consent Management Platform (CMP) implementing the IAB TCF v2.2 framework.
2. **Consent Precedence:** Third-party tracking or advertising scripts must not collect behavioral data or drop non-essential cookies before affirmative user consent is gathered.
3. **No Hidden Tracking:** PocketRuler does not implement hidden fingerprinting, session replay software (e.g., Hotjar/FullStory), or silent analytics beacons.

---

## 7. Deployment & CI/CD Pipeline Hygiene

The GitHub Actions deployment workflow (`.github/workflows/deploy.yml`) must never expose internal documentation, prompts, templates, or private generation engines.
- Public build output must contain only static web distributables (`.html`, `.js`, `.css`, `.svg`, `CNAME`, `robots.txt`, `ads.txt`, `sitemap.xml`).
- Internal development files (`DESIGN_GUIDELINES.md`, `PROJECT_TEMPLATE.md`, `README.md`, `SECURITY.md`, `scripts/`) must be filtered out of the deployment artifact bundle.

---

## 8. Secure Development Checklist for New Tools

Before any new calculator or page is merged to `main`:
- [ ] Are all inputs from `window.location.search` bounded and type-validated?
- [ ] Is `innerHTML` completely avoided for untrusted data?
- [ ] Are all `target="_blank"` links secured with `rel="noopener noreferrer"`?
- [ ] Do all external CDN scripts have pinned versions and SRI hashes?
- [ ] Are security meta tags (`X-Content-Type-Options`, `referrer`, `CSP`) present in `<head>`?
- [ ] Is `localStorage` free of private financial metrics?
- [ ] Does the page compile cleanly with zero browser console errors?

---

## 9. Security Vulnerability Reporting

If you discover a security vulnerability or security bug in PocketRuler.app, please report it privately via email:
- **Security Contact:** `support@pocketruler.app`
- **Response SLA:** Inquiries acknowledged within 48 business hours.
