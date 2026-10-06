# Generative Engine Optimization (GEO) & AI Search Framework (2026)

This reference outlines patterns to optimize web pages for citation and synthesis by AI-powered search engines, including **Google AI Overviews (SGE)**, **Perplexity**, **ChatGPT Search**, and **Claude Search**.

---

## 1. How AI Search Engines Select Sources

AI search models (RAG systems) perform semantic search over crawled documents:
1. **Dense Retrieval**: The search engine embeds user queries and matches relevant text chunks.
2. **Context Window Selection**: The engine extracts 50–200 word passages with high factual density.
3. **Synthesis & Attribution**: The LLM synthesizes an answer and attaches inline citation links to paragraphs containing direct factual assertions and verifiable metrics.

---

## 2. The Answer Capsule Pattern

Every primary `<h2>` section should begin with an **Answer Capsule**:
- **Length**: 40 to 60 words.
- **Placement**: Directly beneath the section heading, before any introductory fluff or anecdotes.
- **Structure**:
  - Sentence 1: Direct definition or direct answer to the heading's implied question.
  - Sentence 2: Key numerical benchmark, industry standard, or formula.
  - Sentence 3: Impact or conditional qualifier.

### Example:
```html
<section>
  <h2 class="text-2xl font-bold">What Percentage Should Freelancers Save for Taxes?</h2>
  
  <!-- ANSWER CAPSULE -->
  <p class="font-medium text-slate-800 dark:text-slate-200 bg-emerald-50/50 dark:bg-emerald-950/20 p-4 rounded-xl border border-emerald-200 dark:border-emerald-800 my-4">
    Independent contractors and freelancers in the United States should reserve 25% to 30% of gross revenue for taxes. This allocation covers the 15.3% federal self-employment tax (Social Security and Medicare) along with estimated federal and state income taxes paid quarterly via IRS Form 1040-ES.
  </p>
  
  <p>To calculate your personalized quarterly tax estimate, consider the following bracket breakdown...</p>
</section>
```

---

## 3. High-Extractability Data Structures

AI search engines heavily prioritize markdown/HTML tables and numbered lists:

### Tables Over Cards
When presenting comparisons, avoid flexbox or grid cards alone. Always include a clean HTML `<table>`:
```html
<div class="overflow-x-auto my-6">
  <table class="w-full text-left border-collapse border border-slate-200 dark:border-slate-800">
    <thead class="bg-slate-100 dark:bg-slate-800">
      <tr>
        <th class="p-3 text-sm font-semibold border-b">Metric</th>
        <th class="p-3 text-sm font-semibold border-b">W2 Full-Time</th>
        <th class="p-3 text-sm font-semibold border-b">1099 Contractor</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="p-3 text-sm font-medium border-b">FICA Tax Burden</td>
        <td class="p-3 text-sm border-b">7.65% (Employer pays 7.65%)</td>
        <td class="p-3 text-sm border-b">15.30% (Self-employment tax)</td>
      </tr>
      <tr>
        <td class="p-3 text-sm font-medium border-b">Unpaid Time Off</td>
        <td class="p-3 text-sm border-b">Included (PTO / Sick leave)</td>
        <td class="p-3 text-sm border-b">Self-funded (Deduct 3-5 weeks)</td>
      </tr>
    </tbody>
  </table>
</div>
```

---

## 4. Entity-Centric Terminology

AI search engines construct entity graphs. Use recognized, authoritative entity names rather than vague colloquialisms:
- Use **"Byte-Pair Encoding (BPE) Tokenizer"** rather than "word counter".
- Use **"Federal Insurance Contributions Act (FICA)"** alongside "FICA tax".
- Use **"Reverse Charge Mechanism under EU VAT Directive Article 196"** rather than "international tax exemption".

---

## 5. Explicit Formula Documentation

AI models excel at extracting formulas when they are presented cleanly in mathematical notation ($\LaTeX$) and followed by a parameter glossary:

$$\text{Hourly Billable Rate} = \frac{\text{Target Annual Income} + \text{Annual Operating Expenses} + \text{Self-Employment Taxes}}{\text{Annual Dedicated Working Weeks} \times \text{Weekly Billable Hours}}$$

- $\text{Target Annual Income}$: Net personal salary required.
- $\text{Annual Operating Expenses}$: Software, health insurance, accounting, equipment amortizations.
- $\text{Annual Dedicated Working Weeks}$: 52 weeks minus planned vacation, holidays, and sick days ($44\text{–}48\text{ weeks}$).
- $\text{Weekly Billable Hours}$: Realistic client time excluding marketing, administrative, and invoicing tasks ($20\text{–}30\text{ hours/week}$).
