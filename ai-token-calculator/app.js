/**
 * PocketRuler.app - AI Token & API Cost Calculator
 * Pure vanilla JavaScript module for modeling frontier LLM API costs,
 * token economics, prompt caching discounts, batch API savings,
 * foreign transaction (FX) bank fees, and local VAT/GST taxes.
 * Fully integrated with PocketRulerCurrency and PocketRulerTheme.
 */

(function () {
  'use strict';

  // =========================================================================
  // 1. 2025/2026 FRONTIER MODEL PRICING CATALOG ($ / 1,000,000 Tokens)
  // =========================================================================
  const MODEL_CATALOG = [
    {
      id: 'gpt-4o',
      name: 'OpenAI GPT-4o',
      shortName: 'GPT-4o',
      provider: 'OpenAI',
      badge: 'Frontier Flagship',
      badgeClass: 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800',
      inputPrice: 2.50,       // $2.50 / 1M input tokens
      outputPrice: 10.00,     // $10.00 / 1M output tokens
      cachedPrice: 1.25,      // $1.25 / 1M cached input (50% discount)
      color: '#10a37f',
      isReasoning: false
    },
    {
      id: 'gpt-4o-mini',
      name: 'OpenAI GPT-4o-mini',
      shortName: 'GPT-4o-mini',
      provider: 'OpenAI',
      badge: 'High Efficiency',
      badgeClass: 'bg-teal-100 dark:bg-teal-950/60 text-teal-800 dark:text-teal-300 border-teal-200 dark:border-teal-800',
      inputPrice: 0.15,       // $0.15 / 1M
      outputPrice: 0.60,      // $0.60 / 1M
      cachedPrice: 0.075,     // $0.075 / 1M
      color: '#0d9488',
      isReasoning: false
    },
    {
      id: 'o1',
      name: 'OpenAI o1',
      shortName: 'o1',
      provider: 'OpenAI',
      badge: 'Deep Reasoning',
      badgeClass: 'bg-purple-100 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800',
      inputPrice: 15.00,      // $15.00 / 1M
      outputPrice: 60.00,     // $60.00 / 1M
      cachedPrice: 7.50,      // $7.50 / 1M
      color: '#7c3aed',
      isReasoning: true
    },
    {
      id: 'o3-mini',
      name: 'OpenAI o3-mini',
      shortName: 'o3-mini',
      provider: 'OpenAI',
      badge: 'Reasoning Efficient',
      badgeClass: 'bg-violet-100 dark:bg-violet-950/60 text-violet-800 dark:text-violet-300 border-violet-200 dark:border-violet-800',
      inputPrice: 1.10,       // $1.10 / 1M
      outputPrice: 4.40,      // $4.40 / 1M
      cachedPrice: 0.55,      // $0.55 / 1M
      color: '#8b5cf6',
      isReasoning: true
    },
    {
      id: 'claude-3-5-sonnet',
      name: 'Anthropic Claude 3.5 Sonnet',
      shortName: 'Claude 3.5 Sonnet',
      provider: 'Anthropic',
      badge: 'Coding & Vision SOTA',
      badgeClass: 'bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800',
      inputPrice: 3.00,       // $3.00 / 1M
      outputPrice: 15.00,     // $15.00 / 1M
      cachedPrice: 0.30,      // $0.30 / 1M (90% discount on cache reads)
      color: '#d97706',
      isReasoning: false
    },
    {
      id: 'claude-3-5-haiku',
      name: 'Anthropic Claude 3.5 Haiku',
      shortName: 'Claude 3.5 Haiku',
      provider: 'Anthropic',
      badge: 'Ultra Fast Agentic',
      badgeClass: 'bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 border-orange-200 dark:border-orange-800',
      inputPrice: 0.80,       // $0.80 / 1M
      outputPrice: 4.00,      // $4.00 / 1M
      cachedPrice: 0.08,      // $0.08 / 1M (90% discount)
      color: '#f97316',
      isReasoning: false
    },
    {
      id: 'gemini-2-0-flash',
      name: 'Google Gemini 2.0 Flash',
      shortName: 'Gemini 2.0 Flash',
      provider: 'Google',
      badge: 'Multimodal Speed SOTA',
      badgeClass: 'bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800',
      inputPrice: 0.10,       // $0.10 / 1M
      outputPrice: 0.40,      // $0.40 / 1M
      cachedPrice: 0.025,     // $0.025 / 1M (75% discount)
      color: '#2563eb',
      isReasoning: false
    },
    {
      id: 'gemini-1-5-pro',
      name: 'Google Gemini 1.5 Pro',
      shortName: 'Gemini 1.5 Pro',
      provider: 'Google',
      badge: '2M Token Context',
      badgeClass: 'bg-sky-100 dark:bg-sky-950/60 text-sky-800 dark:text-sky-300 border-sky-200 dark:border-sky-800',
      inputPrice: 1.25,       // $1.25 / 1M
      outputPrice: 5.00,      // $5.00 / 1M
      cachedPrice: 0.3125,    // $0.3125 / 1M
      color: '#0284c7',
      isReasoning: false
    },
    {
      id: 'deepseek-v3',
      name: 'DeepSeek V3',
      shortName: 'DeepSeek V3',
      provider: 'DeepSeek',
      badge: 'MoE Value King',
      badgeClass: 'bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 border-cyan-200 dark:border-cyan-800',
      inputPrice: 0.14,       // $0.14 / 1M
      outputPrice: 0.28,      // $0.28 / 1M
      cachedPrice: 0.014,     // $0.014 / 1M (90% discount)
      color: '#06b6d4',
      isReasoning: false
    },
    {
      id: 'deepseek-r1',
      name: 'DeepSeek R1',
      shortName: 'DeepSeek R1',
      provider: 'DeepSeek',
      badge: 'Open Reasoning',
      badgeClass: 'bg-indigo-100 dark:bg-indigo-950/60 text-indigo-800 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
      inputPrice: 0.55,       // $0.55 / 1M
      outputPrice: 2.19,      // $2.19 / 1M
      cachedPrice: 0.14,      // $0.14 / 1M
      color: '#4f46e5',
      isReasoning: true
    },
    {
      id: 'llama-3-3-70b',
      name: 'Groq Llama 3.3 70B',
      shortName: 'Llama 3.3 70B (Groq)',
      provider: 'Groq',
      badge: 'LPU Real-Time',
      badgeClass: 'bg-rose-100 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-200 dark:border-rose-800',
      inputPrice: 0.59,       // $0.59 / 1M
      outputPrice: 0.79,      // $0.79 / 1M
      cachedPrice: 0.59,      // $0.59 / 1M (no cache discount on Groq)
      color: '#e11d48',
      isReasoning: false
    }
  ];

  // =========================================================================
  // 2. USE CASE PRESETS
  // =========================================================================
  const PRESETS = {
    support: {
      name: 'SaaS Customer Support Bot',
      mau: 5000,
      queries: 10,
      inputWords: 500,
      outputWords: 200,
      cacheHitRate: 50,
      batchApi: false,
      fxMarkup: 0,
      vatRate: 0,
      primaryModelId: 'gpt-4o-mini'
    },
    rag: {
      name: 'Document & PDF RAG Analyzer',
      mau: 1000,
      queries: 2,
      inputWords: 12000,
      outputWords: 400,
      cacheHitRate: 70,
      batchApi: false,
      fxMarkup: 0,
      vatRate: 0,
      primaryModelId: 'claude-3-5-sonnet'
    },
    coding: {
      name: 'AI Coding Assistant & Agent',
      mau: 500,
      queries: 25,
      inputWords: 8000,
      outputWords: 1200,
      cacheHitRate: 80,
      batchApi: false,
      fxMarkup: 0,
      vatRate: 0,
      primaryModelId: 'claude-3-5-sonnet'
    },
    seo: {
      name: 'SEO & Article Content Generator',
      mau: 2000,
      queries: 5,
      inputWords: 800,
      outputWords: 2200,
      cacheHitRate: 20,
      batchApi: true,
      fxMarkup: 0,
      vatRate: 0,
      primaryModelId: 'gpt-4o'
    }
  };

  // Conversion ratio: 1 word ≈ 1.333333 tokens (English text average)
  const TOKENS_PER_WORD = 1.333333;

  // =========================================================================
  // 3. APPLICATION STATE
  // =========================================================================
  const state = {
    mau: 5000,
    queriesPerUser: 10,
    inputWords: 500,
    inputTokens: Math.round(500 * TOKENS_PER_WORD),
    outputWords: 200,
    outputTokens: Math.round(200 * TOKENS_PER_WORD),
    cacheHitRate: 50,
    batchApi: false,
    fxMarkup: 0,
    vatRate: 0,
    primaryModelId: 'gpt-4o'
  };

  let spendChart = null;

  // =========================================================================
  // 4. MATHEMATICAL ENGINE & COST COMPUTATION
  // =========================================================================

  /**
   * Calculate exact costs for a given model under current state
   */
  function calculateModelCost(model, currentState) {
    const totalMonthlyQueries = currentState.mau * currentState.queriesPerUser;
    const totalInputTokens = totalMonthlyQueries * currentState.inputTokens;
    const totalOutputTokens = totalMonthlyQueries * currentState.outputTokens;

    const cacheRate = Math.min(Math.max(currentState.cacheHitRate, 0), 90) / 100;
    const cachedInputTokens = totalInputTokens * cacheRate;
    const uncachedInputTokens = totalInputTokens * (1 - cacheRate);

    // Raw input cost: uncached at full price + cached at discount price
    const uncachedInputCostUSD = (uncachedInputTokens / 1_000_000) * model.inputPrice;
    const cachedInputCostUSD = (cachedInputTokens / 1_000_000) * model.cachedPrice;
    const inputCostUSD = uncachedInputCostUSD + cachedInputCostUSD;

    // Output cost
    const outputCostUSD = (totalOutputTokens / 1_000_000) * model.outputPrice;

    // Gross cost before batch & tax
    const grossCostUSD = inputCostUSD + outputCostUSD;

    // Prompt cache savings compared to 0% caching
    const fullInputCostUSD = (totalInputTokens / 1_000_000) * model.inputPrice;
    const promptCacheSavingsUSD = Math.max(0, fullInputCostUSD - inputCostUSD);

    // Batch API discount (50% discount)
    const batchMultiplier = currentState.batchApi ? 0.50 : 1.00;
    const costAfterBatchUSD = grossCostUSD * batchMultiplier;
    const savingsFromBatchUSD = grossCostUSD - costAfterBatchUSD;

    // Foreign Credit Card FX Markup
    const fxMultiplier = 1 + (currentState.fxMarkup / 100);
    const costAfterFxUSD = costAfterBatchUSD * fxMultiplier;
    const fxFeeAmountUSD = costAfterFxUSD - costAfterBatchUSD;

    // Local VAT / GST Tax
    const vatMultiplier = 1 + (currentState.vatRate / 100);
    const finalMonthlyCostUSD = costAfterFxUSD * vatMultiplier;
    const vatAmountUSD = finalMonthlyCostUSD - costAfterFxUSD;

    // Unit Economics
    const costPerUserUSD = currentState.mau > 0 ? (finalMonthlyCostUSD / currentState.mau) : 0;
    const costPerQueryUSD = totalMonthlyQueries > 0 ? (finalMonthlyCostUSD / totalMonthlyQueries) : 0;
    const costPer1kQueriesUSD = costPerQueryUSD * 1000;

    return {
      model,
      totalMonthlyQueries,
      totalInputTokens,
      totalOutputTokens,
      cachedInputTokens,
      uncachedInputTokens,
      uncachedInputCostUSD,
      cachedInputCostUSD,
      inputCostUSD: inputCostUSD * batchMultiplier * fxMultiplier * vatMultiplier,
      outputCostUSD: outputCostUSD * batchMultiplier * fxMultiplier * vatMultiplier,
      promptCacheSavingsUSD: promptCacheSavingsUSD * batchMultiplier * fxMultiplier * vatMultiplier,
      savingsFromBatchUSD: savingsFromBatchUSD * fxMultiplier * vatMultiplier,
      fxFeeAmountUSD,
      vatAmountUSD,
      finalMonthlyCostUSD,
      costPerUserUSD,
      costPerQueryUSD,
      costPer1kQueriesUSD
    };
  }

  /**
   * Helper to format a USD value into both active local currency and USD base
   */
  function formatDualCurrency(amountUSD, decimals = 2) {
    if (typeof window.PocketRulerCurrency === 'undefined') {
      return {
        local: `$${amountUSD.toFixed(decimals)}`,
        usd: `$${amountUSD.toFixed(decimals)} USD`,
        activeCode: 'USD',
        isUSD: true
      };
    }

    const activeCode = window.PocketRulerCurrency.getActiveCurrency();
    const isUSD = activeCode === 'USD';
    const localAmount = window.PocketRulerCurrency.convert(amountUSD, 'USD', activeCode);
    const localFormatted = window.PocketRulerCurrency.format(localAmount, activeCode, decimals);

    // Format USD reference
    const usdFormatted = `$${amountUSD.toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    })} USD`;

    return {
      local: localFormatted,
      usd: usdFormatted,
      activeCode,
      isUSD
    };
  }

  // =========================================================================
  // 5. DOM ELEMENT REFERENCES
  // =========================================================================
  let dom = {};

  function cacheDomElements() {
    dom = {
      // Inputs & Sliders
      mauRange: document.getElementById('mauRange'),
      mauInput: document.getElementById('mauInput'),
      queriesRange: document.getElementById('queriesRange'),
      queriesInput: document.getElementById('queriesInput'),
      inputWordsInput: document.getElementById('inputWordsInput'),
      inputTokensInput: document.getElementById('inputTokensInput'),
      outputWordsInput: document.getElementById('outputWordsInput'),
      outputTokensInput: document.getElementById('outputTokensInput'),
      cacheRange: document.getElementById('cacheRange'),
      cacheValueText: document.getElementById('cacheValueText'),
      batchToggle: document.getElementById('batchToggle'),
      fxSelect: document.getElementById('fxSelect'),
      vatSelect: document.getElementById('vatSelect'),

      // Summary Top Cards
      summaryMonthlyCostLocal: document.getElementById('summaryMonthlyCostLocal'),
      summaryMonthlyCostUSD: document.getElementById('summaryMonthlyCostUSD'),
      summaryCostPerUserLocal: document.getElementById('summaryCostPerUserLocal'),
      summaryCostPerUserUSD: document.getElementById('summaryCostPerUserUSD'),
      summaryCostPerQueryLocal: document.getElementById('summaryCostPerQueryLocal'),
      summaryCostPerQueryUSD: document.getElementById('summaryCostPerQueryUSD'),
      summaryCacheSavingsLocal: document.getElementById('summaryCacheSavingsLocal'),
      summaryCacheSavingsPercent: document.getElementById('summaryCacheSavingsPercent'),
      selectedModelBadge: document.getElementById('selectedModelBadge'),
      selectedModelNameText: document.getElementById('selectedModelNameText'),

      // Metrics Pill
      metricTotalQueries: document.getElementById('metricTotalQueries'),
      metricTotalTokens: document.getElementById('metricTotalTokens'),
      metricInputTokens: document.getElementById('metricInputTokens'),
      metricOutputTokens: document.getElementById('metricOutputTokens'),

      // Leaderboard Container
      leaderboardBody: document.getElementById('leaderboardBody'),

      // Arbitrage Alert Box
      arbitrageSavingsLocal: document.getElementById('arbitrageSavingsLocal'),
      arbitrageSavingsUSD: document.getElementById('arbitrageSavingsUSD'),
      arbitrageSavingsPct: document.getElementById('arbitrageSavingsPct'),
      arbitrageAnnualLocal: document.getElementById('arbitrageAnnualLocal'),
      arbitrageFrontierName: document.getElementById('arbitrageFrontierName'),
      arbitrageRoutingDetails: document.getElementById('arbitrageRoutingDetails'),

      // Action Buttons
      btnShareCalc: document.getElementById('btnShareCalc'),
      btnResetCalc: document.getElementById('btnResetCalc'),
      currencySelect: document.getElementById('currencySelect'),
      toastNotification: document.getElementById('toastNotification'),
      toastMessage: document.getElementById('toastMessage'),

      // Chart Canvas
      spendChartCanvas: document.getElementById('spendChartCanvas')
    };
  }

  // =========================================================================
  // 6. UI RENDERERS & DATA UPDATERS
  // =========================================================================

  /**
   * Main render loop: recomputes all figures, updates UI and chart
   */
  function renderAll() {
    // 1. Calculate costs for all models
    const results = MODEL_CATALOG.map(model => calculateModelCost(model, state));

    // Sort models by final cost ascending
    const sortedResults = [...results].sort((a, b) => a.finalMonthlyCostUSD - b.finalMonthlyCostUSD);
    const cheapestResult = sortedResults[0];

    // Find the currently selected primary model (or default to GPT-4o)
    let primaryResult = results.find(r => r.model.id === state.primaryModelId);
    if (!primaryResult) {
      primaryResult = results.find(r => r.model.id === 'gpt-4o') || results[0];
      state.primaryModelId = primaryResult.model.id;
    }

    // 2. Update Metrics Pill
    const totalQueries = state.mau * state.queriesPerUser;
    const totalInputTok = totalQueries * state.inputTokens;
    const totalOutputTok = totalQueries * state.outputTokens;
    const totalTok = totalInputTok + totalOutputTok;

    if (dom.metricTotalQueries) dom.metricTotalQueries.textContent = totalQueries.toLocaleString();
    if (dom.metricTotalTokens) dom.metricTotalTokens.textContent = formatTokensShort(totalTok);
    if (dom.metricInputTokens) dom.metricInputTokens.textContent = formatTokensShort(totalInputTok);
    if (dom.metricOutputTokens) dom.metricOutputTokens.textContent = formatTokensShort(totalOutputTok);

    // 3. Update Primary Highlight Cards
    updatePrimaryCards(primaryResult);

    // 4. Update Leaderboard Table
    updateLeaderboard(results, primaryResult.model.id, cheapestResult.model.id);

    // 5. Update Smart Arbitrage Alert Box
    updateArbitrageAlert(primaryResult, results);

    // 6. Update Spend Bar Chart
    updateChart(results);
  }

  /**
   * Format numbers into compact token strings (e.g., 1.5M, 320k)
   */
  function formatTokensShort(num) {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(2) + 'B';
    }
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(2) + 'M';
    }
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + 'k';
    }
    return num.toLocaleString();
  }

  /**
   * Update top KPI summary cards
   */
  function updatePrimaryCards(result) {
    const monthlyCost = formatDualCurrency(result.finalMonthlyCostUSD, 2);
    const costPerUser = formatDualCurrency(result.costPerUserUSD, result.costPerUserUSD < 0.01 ? 4 : 2);
    const costPerQuery = formatDualCurrency(result.costPerQueryUSD, 4);
    const cacheSavings = formatDualCurrency(result.promptCacheSavingsUSD, 2);

    if (dom.summaryMonthlyCostLocal) dom.summaryMonthlyCostLocal.textContent = monthlyCost.local;
    if (dom.summaryMonthlyCostUSD) {
      dom.summaryMonthlyCostUSD.textContent = monthlyCost.isUSD ? 'Base Reference' : monthlyCost.usd;
    }

    if (dom.summaryCostPerUserLocal) dom.summaryCostPerUserLocal.textContent = costPerUser.local;
    if (dom.summaryCostPerUserUSD) {
      dom.summaryCostPerUserUSD.textContent = costPerUser.isUSD ? 'Per active user/mo' : `${costPerUser.usd} / user`;
    }

    if (dom.summaryCostPerQueryLocal) dom.summaryCostPerQueryLocal.textContent = costPerQuery.local;
    if (dom.summaryCostPerQueryUSD) {
      dom.summaryCostPerQueryUSD.textContent = costPerQuery.isUSD ? 'Per API query' : `${costPerQuery.usd} / query`;
    }

    if (dom.summaryCacheSavingsLocal) dom.summaryCacheSavingsLocal.textContent = cacheSavings.local;
    if (dom.summaryCacheSavingsPercent) {
      const grossBeforeCache = result.finalMonthlyCostUSD + result.promptCacheSavingsUSD;
      const pct = grossBeforeCache > 0 ? ((result.promptCacheSavingsUSD / grossBeforeCache) * 100).toFixed(0) : '0';
      dom.summaryCacheSavingsPercent.textContent = `${pct}% reduction`;
    }

    if (dom.selectedModelBadge) {
      dom.selectedModelBadge.textContent = result.model.badge;
      dom.selectedModelBadge.className = `text-[10px] font-bold px-2 py-0.5 rounded-full border ${result.model.badgeClass}`;
    }

    if (dom.selectedModelNameText) {
      dom.selectedModelNameText.textContent = result.model.name;
    }
  }

  /**
   * Update the Multi-Model Spend Leaderboard
   */
  function updateLeaderboard(results, activeModelId, cheapestModelId) {
    if (!dom.leaderboardBody) return;

    dom.leaderboardBody.innerHTML = '';

    // Sort by final cost ascending
    const sorted = [...results].sort((a, b) => a.finalMonthlyCostUSD - b.finalMonthlyCostUSD);

    sorted.forEach((res) => {
      const isSelected = res.model.id === activeModelId;
      const isCheapest = res.model.id === cheapestModelId;
      const costDual = formatDualCurrency(res.finalMonthlyCostUSD, 2);
      const userCostDual = formatDualCurrency(res.costPerUserUSD, res.costPerUserUSD < 0.01 ? 4 : 2);
      const queryCostDual = formatDualCurrency(res.costPerQueryUSD, 4);
      const cacheSavingsDual = formatDualCurrency(res.promptCacheSavingsUSD, 2);

      const tr = document.createElement('tr');
      tr.className = `border-b border-slate-200/80 dark:border-slate-800 transition-colors cursor-pointer hover:bg-slate-50/80 dark:hover:bg-slate-800/50 ${
        isSelected ? 'bg-emerald-50/70 dark:bg-emerald-950/30 font-semibold' : ''
      }`;
      tr.setAttribute('data-model-id', res.model.id);

      tr.innerHTML = `
        <td class="py-3.5 px-4">
          <div class="flex items-center gap-2.5">
            <div class="w-3 h-3 rounded-full shrink-0" style="background-color: ${res.model.color}"></div>
            <div>
              <div class="flex items-center gap-2">
                <span class="font-bold text-slate-900 dark:text-white text-xs sm:text-sm hover:text-emerald-600 dark:hover:text-emerald-400">
                  ${res.model.name}
                </span>
                ${isCheapest ? '<span class="text-[9px] bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 font-extrabold px-1.5 py-0.5 rounded border border-emerald-300 dark:border-emerald-700">LOWEST COST</span>' : ''}
                ${isSelected ? '<span class="text-[9px] bg-blue-100 dark:bg-blue-950/80 text-blue-800 dark:text-blue-300 font-extrabold px-1.5 py-0.5 rounded border border-blue-300 dark:border-blue-700">SELECTED</span>' : ''}
              </div>
              <div class="text-[11px] text-slate-500 dark:text-slate-400">
                In: $${res.model.inputPrice.toFixed(2)} &bull; Out: $${res.model.outputPrice.toFixed(2)} &bull; Cache: $${res.model.cachedPrice.toFixed(3)}
              </div>
            </div>
          </div>
        </td>
        <td class="py-3.5 px-3 text-right">
          <div class="font-black font-mono text-slate-900 dark:text-white text-xs sm:text-sm tabular-nums">
            ${costDual.local}
          </div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            ${costDual.isUSD ? 'USD' : costDual.usd}
          </div>
        </td>
        <td class="py-3.5 px-3 text-right hidden sm:table-cell">
          <div class="font-mono text-xs text-slate-700 dark:text-slate-300 tabular-nums">
            ${userCostDual.local}
          </div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            ${userCostDual.isUSD ? '' : userCostDual.usd}
          </div>
        </td>
        <td class="py-3.5 px-3 text-right hidden md:table-cell">
          <div class="font-mono text-xs text-slate-700 dark:text-slate-300 tabular-nums">
            ${queryCostDual.local}
          </div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            ${queryCostDual.isUSD ? '' : queryCostDual.usd}
          </div>
        </td>
        <td class="py-3.5 px-3 text-right hidden lg:table-cell">
          <div class="font-mono text-xs text-emerald-600 dark:text-emerald-400 tabular-nums font-semibold">
            ${cacheSavingsDual.local}
          </div>
          <div class="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
            ${cacheSavingsDual.isUSD ? '' : cacheSavingsDual.usd}
          </div>
        </td>
        <td class="py-3.5 px-3 text-center">
          <button type="button" class="select-model-btn px-2.5 py-1 text-xs font-bold rounded-lg border transition-all ${
            isSelected
              ? 'bg-emerald-600 border-emerald-600 text-white shadow-xs'
              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700'
          }" data-model-id="${res.model.id}">
            ${isSelected ? 'Active' : 'Select'}
          </button>
        </td>
      `;

      tr.addEventListener('click', () => {
        state.primaryModelId = res.model.id;
        renderAll();
      });

      dom.leaderboardBody.appendChild(tr);
    });
  }

  /**
   * Update the Smart Model Routing Arbitrage Alert Box
   * Compares frontier models (e.g. GPT-4o, Claude 3.5 Sonnet) with 70% routing to Gemini 2.0 Flash or GPT-4o-mini
   */
  function updateArbitrageAlert(primaryResult, results) {
    if (!dom.arbitrageSavingsLocal) return;

    // Fast sub-tier model to route simple queries to
    const flashModel = results.find(r => r.model.id === 'gemini-2-0-flash') || results.find(r => r.model.id === 'gpt-4o-mini');
    const frontierModel = primaryResult.model.inputPrice > 0.5
      ? primaryResult
      : (results.find(r => r.model.id === 'gpt-4o') || results.find(r => r.model.id === 'claude-3-5-sonnet') || primaryResult);

    if (dom.arbitrageFrontierName) {
      dom.arbitrageFrontierName.textContent = frontierModel.model.name;
    }

    // Routing hypothesis: 70% queries routed to Flash/Mini, 30% queries kept on Frontier
    const blendedCostUSD = (flashModel.finalMonthlyCostUSD * 0.70) + (frontierModel.finalMonthlyCostUSD * 0.30);
    const baselineCostUSD = frontierModel.finalMonthlyCostUSD;
    const monthlySavingsUSD = Math.max(0, baselineCostUSD - blendedCostUSD);
    const annualSavingsUSD = monthlySavingsUSD * 12;
    const savingsPct = baselineCostUSD > 0 ? ((monthlySavingsUSD / baselineCostUSD) * 100).toFixed(1) : '0';

    const savingsDual = formatDualCurrency(monthlySavingsUSD, 2);
    const annualDual = formatDualCurrency(annualSavingsUSD, 0);

    dom.arbitrageSavingsLocal.textContent = savingsDual.local;
    if (dom.arbitrageSavingsUSD) {
      dom.arbitrageSavingsUSD.textContent = savingsDual.isUSD ? 'monthly savings' : `${savingsDual.usd} / mo`;
    }
    if (dom.arbitrageSavingsPct) {
      dom.arbitrageSavingsPct.textContent = `${savingsPct}%`;
    }
    if (dom.arbitrageAnnualLocal) {
      dom.arbitrageAnnualLocal.textContent = annualDual.local;
    }

    if (dom.arbitrageRoutingDetails) {
      dom.arbitrageRoutingDetails.innerHTML = `
        By implementing a <strong>Cascading Classifier</strong> that sends 70% of routine intents, classification, and summaries to <strong>${flashModel.model.name}</strong> ($0.10/1M) and reserves <strong>${frontierModel.model.name}</strong> for the 30% high-complexity reasoning steps, your organization saves <strong>${savingsDual.local}</strong> every month with zero loss in output quality.
      `;
    }
  }

  // =========================================================================
  // 7. CHART.JS 4.4.4 VISUALIZATION
  // =========================================================================

  function getChartThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    return {
      textColor: isDark ? '#94a3b8' : '#64748b',
      gridColor: isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.7)',
      fontFamily: '"Plus Jakarta Sans", sans-serif'
    };
  }

  function initOrUpdateChart(results) {
    if (!dom.spendChartCanvas) return;
    const ctx = dom.spendChartCanvas.getContext('2d');
    const themeColors = getChartThemeColors();

    const activeCurrency = typeof window.PocketRulerCurrency !== 'undefined'
      ? window.PocketRulerCurrency.getActiveCurrency()
      : 'USD';

    // Top representative models to keep chart uncluttered
    const displayModelIds = [
      'gpt-4o', 'gpt-4o-mini', 'o3-mini', 'claude-3-5-sonnet',
      'claude-3-5-haiku', 'gemini-2-0-flash', 'gemini-1-5-pro',
      'deepseek-v3', 'deepseek-r1', 'llama-3-3-70b'
    ].map(s => s.toLowerCase());

    const filtered = results.filter(r => displayModelIds.includes(r.model.id.toLowerCase()));

    const labels = filtered.map(r => r.model.shortName);

    // Convert input and output costs to active currency
    const inputCosts = filtered.map(r => {
      const converted = typeof window.PocketRulerCurrency !== 'undefined'
        ? window.PocketRulerCurrency.convert(r.inputCostUSD, 'USD', activeCurrency)
        : r.inputCostUSD;
      return Number(converted.toFixed(2));
    });

    const outputCosts = filtered.map(r => {
      const converted = typeof window.PocketRulerCurrency !== 'undefined'
        ? window.PocketRulerCurrency.convert(r.outputCostUSD, 'USD', activeCurrency)
        : r.outputCostUSD;
      return Number(converted.toFixed(2));
    });

    const cacheSavings = filtered.map(r => {
      const converted = typeof window.PocketRulerCurrency !== 'undefined'
        ? window.PocketRulerCurrency.convert(r.promptCacheSavingsUSD, 'USD', activeCurrency)
        : r.promptCacheSavingsUSD;
      return Number(converted.toFixed(2));
    });

    if (spendChart) {
      spendChart.data.labels = labels;
      spendChart.data.datasets[0].data = inputCosts;
      spendChart.data.datasets[0].label = `Input Cost (${activeCurrency})`;
      spendChart.data.datasets[1].data = outputCosts;
      spendChart.data.datasets[1].label = `Output Cost (${activeCurrency})`;
      spendChart.data.datasets[2].data = cacheSavings;
      spendChart.data.datasets[2].label = `Cache Savings (${activeCurrency})`;

      spendChart.options.scales.x.ticks.color = themeColors.textColor;
      spendChart.options.scales.x.grid.color = themeColors.gridColor;
      spendChart.options.scales.y.ticks.color = themeColors.textColor;
      spendChart.options.scales.y.grid.color = themeColors.gridColor;
      spendChart.options.plugins.legend.labels.color = themeColors.textColor;
      spendChart.update();
      return;
    }

    spendChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: `Input Cost (${activeCurrency})`,
            data: inputCosts,
            backgroundColor: '#3b82f6', // blue
            borderRadius: 6,
            stack: 'spend'
          },
          {
            label: `Output Cost (${activeCurrency})`,
            data: outputCosts,
            backgroundColor: '#8b5cf6', // purple
            borderRadius: 6,
            stack: 'spend'
          },
          {
            label: `Cache Savings (${activeCurrency})`,
            data: cacheSavings,
            backgroundColor: '#10b981', // emerald
            borderRadius: 6,
            stack: 'savings'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: themeColors.textColor,
              font: {
                family: themeColors.fontFamily,
                size: 11,
                weight: '600'
              },
              usePointStyle: true,
              boxWidth: 8
            }
          },
          tooltip: {
            backgroundColor: 'rgba(15, 23, 42, 0.95)',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            borderColor: 'rgba(51, 65, 85, 0.6)',
            borderWidth: 1,
            padding: 12,
            boxPadding: 6,
            usePointStyle: true,
            titleFont: { family: themeColors.fontFamily, size: 12, weight: 'bold' },
            bodyFont: { family: themeColors.fontFamily, size: 11 },
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                const formatted = typeof window.PocketRulerCurrency !== 'undefined'
                  ? window.PocketRulerCurrency.format(val, activeCurrency, 2)
                  : `$${val.toFixed(2)}`;
                return ` ${context.dataset.label}: ${formatted}`;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            ticks: {
              color: themeColors.textColor,
              font: { family: themeColors.fontFamily, size: 10, weight: '600' },
              maxRotation: 45,
              minRotation: 20
            },
            grid: {
              display: false
            }
          },
          y: {
            stacked: false,
            ticks: {
              color: themeColors.textColor,
              font: { family: themeColors.fontFamily, size: 10 },
              callback: function (val) {
                if (typeof window.PocketRulerCurrency !== 'undefined') {
                  const symbol = window.PocketRulerCurrency.getActiveConfig().symbol || '$';
                  return `${symbol}${val >= 1000 ? (val / 1000).toFixed(0) + 'k' : val}`;
                }
                return `$${val}`;
              }
            },
            grid: {
              color: themeColors.gridColor
            }
          }
        }
      }
    });
  }

  function updateChart(results) {
    initOrUpdateChart(results);
  }

  // =========================================================================
  // 8. EVENT BINDINGS & TWO-WAY SYNCHRONIZATION
  // =========================================================================

  function syncWordsAndTokens(source) {
    if (source === 'inputWords') {
      state.inputWords = Math.max(1, parseInt(dom.inputWordsInput.value, 10) || 1);
      state.inputTokens = Math.round(state.inputWords * TOKENS_PER_WORD);
      if (dom.inputTokensInput) dom.inputTokensInput.value = state.inputTokens;
    } else if (source === 'inputTokens') {
      state.inputTokens = Math.max(1, parseInt(dom.inputTokensInput.value, 10) || 1);
      state.inputWords = Math.round(state.inputTokens / TOKENS_PER_WORD);
      if (dom.inputWordsInput) dom.inputWordsInput.value = state.inputWords;
    } else if (source === 'outputWords') {
      state.outputWords = Math.max(1, parseInt(dom.outputWordsInput.value, 10) || 1);
      state.outputTokens = Math.round(state.outputWords * TOKENS_PER_WORD);
      if (dom.outputTokensInput) dom.outputTokensInput.value = state.outputTokens;
    } else if (source === 'outputTokens') {
      state.outputTokens = Math.max(1, parseInt(dom.outputTokensInput.value, 10) || 1);
      state.outputWords = Math.round(state.outputTokens / TOKENS_PER_WORD);
      if (dom.outputWordsInput) dom.outputWordsInput.value = state.outputWords;
    }
  }

  function setupInputListeners() {
    // MAU Slider + Number Input sync
    if (dom.mauRange && dom.mauInput) {
      dom.mauRange.addEventListener('input', (e) => {
        state.mau = parseInt(e.target.value, 10);
        dom.mauInput.value = state.mau;
        renderAll();
      });
      dom.mauInput.addEventListener('input', (e) => {
        state.mau = Math.max(1, parseInt(e.target.value, 10) || 1);
        dom.mauRange.value = Math.min(100000, state.mau);
        renderAll();
      });
    }

    // Queries per user Slider + Number Input sync
    if (dom.queriesRange && dom.queriesInput) {
      dom.queriesRange.addEventListener('input', (e) => {
        state.queriesPerUser = parseInt(e.target.value, 10);
        dom.queriesInput.value = state.queriesPerUser;
        renderAll();
      });
      dom.queriesInput.addEventListener('input', (e) => {
        state.queriesPerUser = Math.max(1, parseInt(e.target.value, 10) || 1);
        dom.queriesRange.value = Math.min(200, state.queriesPerUser);
        renderAll();
      });
    }

    // Input Words & Tokens sync
    if (dom.inputWordsInput) {
      dom.inputWordsInput.addEventListener('input', () => {
        syncWordsAndTokens('inputWords');
        renderAll();
      });
    }
    if (dom.inputTokensInput) {
      dom.inputTokensInput.addEventListener('input', () => {
        syncWordsAndTokens('inputTokens');
        renderAll();
      });
    }

    // Output Words & Tokens sync
    if (dom.outputWordsInput) {
      dom.outputWordsInput.addEventListener('input', () => {
        syncWordsAndTokens('outputWords');
        renderAll();
      });
    }
    if (dom.outputTokensInput) {
      dom.outputTokensInput.addEventListener('input', () => {
        syncWordsAndTokens('outputTokens');
        renderAll();
      });
    }

    // Prompt Caching Hit Rate Slider
    if (dom.cacheRange) {
      dom.cacheRange.addEventListener('input', (e) => {
        state.cacheHitRate = parseInt(e.target.value, 10);
        if (dom.cacheValueText) dom.cacheValueText.textContent = `${state.cacheHitRate}%`;
        renderAll();
      });
    }

    // Batch API Toggle (50% discount)
    if (dom.batchToggle) {
      dom.batchToggle.addEventListener('change', (e) => {
        state.batchApi = e.target.checked;
        renderAll();
      });
    }

    // FX Markup Select
    if (dom.fxSelect) {
      dom.fxSelect.addEventListener('change', (e) => {
        state.fxMarkup = parseFloat(e.target.value) || 0;
        renderAll();
      });
    }

    // VAT / GST Select
    if (dom.vatSelect) {
      dom.vatSelect.addEventListener('change', (e) => {
        state.vatRate = parseFloat(e.target.value) || 0;
        renderAll();
      });
    }

    // Preset Buttons
    const presetButtons = document.querySelectorAll('[data-preset]');
    presetButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const presetKey = btn.getAttribute('data-preset');
        applyPreset(presetKey);
      });
    });

    // Share Calculation Button
    if (dom.btnShareCalc) {
      dom.btnShareCalc.addEventListener('click', shareCalculation);
    }

    // Reset Button
    if (dom.btnResetCalc) {
      dom.btnResetCalc.addEventListener('click', resetToDefaults);
    }
  }

  /**
   * Apply predefined workload preset
   */
  function applyPreset(key) {
    const p = PRESETS[key];
    if (!p) return;

    state.mau = p.mau;
    state.queriesPerUser = p.queries;
    state.inputWords = p.inputWords;
    state.inputTokens = Math.round(p.inputWords * TOKENS_PER_WORD);
    state.outputWords = p.outputWords;
    state.outputTokens = Math.round(p.outputWords * TOKENS_PER_WORD);
    state.cacheHitRate = p.cacheHitRate;
    state.batchApi = p.batchApi;
    state.fxMarkup = p.fxMarkup;
    state.vatRate = p.vatRate;
    state.primaryModelId = p.primaryModelId;

    // Update DOM input controls
    if (dom.mauRange) dom.mauRange.value = Math.min(100000, state.mau);
    if (dom.mauInput) dom.mauInput.value = state.mau;
    if (dom.queriesRange) dom.queriesRange.value = Math.min(200, state.queriesPerUser);
    if (dom.queriesInput) dom.queriesInput.value = state.queriesPerUser;
    if (dom.inputWordsInput) dom.inputWordsInput.value = state.inputWords;
    if (dom.inputTokensInput) dom.inputTokensInput.value = state.inputTokens;
    if (dom.outputWordsInput) dom.outputWordsInput.value = state.outputWords;
    if (dom.outputTokensInput) dom.outputTokensInput.value = state.outputTokens;
    if (dom.cacheRange) dom.cacheRange.value = state.cacheHitRate;
    if (dom.cacheValueText) dom.cacheValueText.textContent = `${state.cacheHitRate}%`;
    if (dom.batchToggle) dom.batchToggle.checked = state.batchApi;
    if (dom.fxSelect) dom.fxSelect.value = state.fxMarkup.toString();
    if (dom.vatSelect) dom.vatSelect.value = state.vatRate.toString();

    // Active styling on preset buttons
    document.querySelectorAll('[data-preset]').forEach(b => {
      if (b.getAttribute('data-preset') === key) {
        b.classList.add('bg-emerald-600', 'text-white', 'border-emerald-600');
        b.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
      } else {
        b.classList.remove('bg-emerald-600', 'text-white', 'border-emerald-600');
        b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-200');
      }
    });

    renderAll();
    showToast(`Loaded Preset: ${p.name}`);
  }

  /**
   * Reset inputs to factory baseline
   */
  function resetToDefaults() {
    applyPreset('support');
    showToast('Reset to default values');
  }

  /**
   * Show animated toast feedback
   */
  function showToast(message) {
    if (!dom.toastNotification) return;
    if (dom.toastMessage) dom.toastMessage.textContent = message;
    dom.toastNotification.classList.remove('opacity-0', 'translate-y-4', 'pointer-events-none');
    dom.toastNotification.classList.add('opacity-100', 'translate-y-0');

    setTimeout(() => {
      dom.toastNotification.classList.remove('opacity-100', 'translate-y-0');
      dom.toastNotification.classList.add('opacity-0', 'translate-y-4', 'pointer-events-none');
    }, 2800);
  }

  // =========================================================================
  // 9. URL SERIALIZATION & SHARE ENGINE
  // =========================================================================

  function serializeStateToUrl() {
    const params = new URLSearchParams();
    params.set('mau', state.mau);
    params.set('q', state.queriesPerUser);
    params.set('inW', state.inputWords);
    params.set('outW', state.outputWords);
    params.set('cache', state.cacheHitRate);
    if (state.batchApi) params.set('batch', '1');
    if (state.fxMarkup > 0) params.set('fx', state.fxMarkup);
    if (state.vatRate > 0) params.set('vat', state.vatRate);
    if (state.primaryModelId) params.set('model', state.primaryModelId);

    if (typeof window.PocketRulerCurrency !== 'undefined') {
      params.set('curr', window.PocketRulerCurrency.getActiveCurrency());
    }

    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    let changed = false;

    if (params.has('mau')) {
      const v = parseInt(params.get('mau'), 10);
      if (!isNaN(v) && v > 0) { state.mau = v; changed = true; }
    }
    if (params.has('q')) {
      const v = parseInt(params.get('q'), 10);
      if (!isNaN(v) && v > 0) { state.queriesPerUser = v; changed = true; }
    }
    if (params.has('inW')) {
      const v = parseInt(params.get('inW'), 10);
      if (!isNaN(v) && v > 0) {
        state.inputWords = v;
        state.inputTokens = Math.round(v * TOKENS_PER_WORD);
        changed = true;
      }
    }
    if (params.has('outW')) {
      const v = parseInt(params.get('outW'), 10);
      if (!isNaN(v) && v > 0) {
        state.outputWords = v;
        state.outputTokens = Math.round(v * TOKENS_PER_WORD);
        changed = true;
      }
    }
    if (params.has('cache')) {
      const v = parseInt(params.get('cache'), 10);
      if (!isNaN(v) && v >= 0 && v <= 90) { state.cacheHitRate = v; changed = true; }
    }
    if (params.has('batch')) {
      state.batchApi = params.get('batch') === '1' || params.get('batch') === 'true';
      changed = true;
    }
    if (params.has('fx')) {
      const v = parseFloat(params.get('fx'));
      if (!isNaN(v)) { state.fxMarkup = v; changed = true; }
    }
    if (params.has('vat')) {
      const v = parseFloat(params.get('vat'));
      if (!isNaN(v)) { state.vatRate = v; changed = true; }
    }
    if (params.has('model')) {
      const m = params.get('model');
      if (MODEL_CATALOG.some(item => item.id === m)) {
        state.primaryModelId = m;
        changed = true;
      }
    }
    if (params.has('curr') && typeof window.PocketRulerCurrency !== 'undefined') {
      const c = params.get('curr').toUpperCase();
      if (window.PocketRulerCurrency.currencies[c]) {
        window.PocketRulerCurrency.setActiveCurrency(c);
      }
    }

    if (changed) {
      // Sync DOM controls
      if (dom.mauRange) dom.mauRange.value = Math.min(100000, state.mau);
      if (dom.mauInput) dom.mauInput.value = state.mau;
      if (dom.queriesRange) dom.queriesRange.value = Math.min(200, state.queriesPerUser);
      if (dom.queriesInput) dom.queriesInput.value = state.queriesPerUser;
      if (dom.inputWordsInput) dom.inputWordsInput.value = state.inputWords;
      if (dom.inputTokensInput) dom.inputTokensInput.value = state.inputTokens;
      if (dom.outputWordsInput) dom.outputWordsInput.value = state.outputWords;
      if (dom.outputTokensInput) dom.outputTokensInput.value = state.outputTokens;
      if (dom.cacheRange) dom.cacheRange.value = state.cacheHitRate;
      if (dom.cacheValueText) dom.cacheValueText.textContent = `${state.cacheHitRate}%`;
      if (dom.batchToggle) dom.batchToggle.checked = state.batchApi;
      if (dom.fxSelect) dom.fxSelect.value = state.fxMarkup.toString();
      if (dom.vatSelect) dom.vatSelect.value = state.vatRate.toString();
    }
  }

  function shareCalculation() {
    const url = serializeStateToUrl();
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(url).then(() => {
        showToast('Sharable calculation link copied!');
      }).catch(() => {
        prompt('Copy your calculation URL:', url);
      });
    } else {
      prompt('Copy your calculation URL:', url);
    }
  }

  // =========================================================================
  // 10. LIFECYCLE & INITIALIZATION
  // =========================================================================

  function init() {
    cacheDomElements();

    // 1. Initialize Currency Selector
    if (typeof window.PocketRulerCurrency !== 'undefined' && dom.currencySelect) {
      window.PocketRulerCurrency.populateSelector(dom.currencySelect);
    }

    // 2. Listen to 'currencychange' to re-render all values
    window.addEventListener('currencychange', () => {
      renderAll();
    });

    // 3. Listen to 'themechange' to adapt Chart.js colors
    window.addEventListener('themechange', () => {
      if (spendChart) {
        const themeColors = getChartThemeColors();
        spendChart.options.scales.x.ticks.color = themeColors.textColor;
        spendChart.options.scales.x.grid.color = themeColors.gridColor;
        spendChart.options.scales.y.ticks.color = themeColors.textColor;
        spendChart.options.scales.y.grid.color = themeColors.gridColor;
        spendChart.options.plugins.legend.labels.color = themeColors.textColor;
        spendChart.update();
      }
    });

    // 4. Setup DOM input listeners
    setupInputListeners();

    // 5. Restore URL state if present
    loadStateFromUrl();

    // 6. Initial render
    renderAll();
  }

  // Run on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose API for testing & external programmatic access
  window.PocketRulerAITokenCalc = {
    state,
    models: MODEL_CATALOG,
    presets: PRESETS,
    calculateModelCost,
    applyPreset,
    renderAll
  };

})();
