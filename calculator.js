/**
 * Freelance Rate vs. Retainer Calculator
 * Pure Vanilla JavaScript Module with Live FX API, Rate Health Diagnostic, and Client Pitch Generator
 */

(function () {
  'use strict';

  // 15 Supported Currencies with base reference rates (1 USD = rate), locales, and adaptive slider boundaries
  const currencies = {
    USD: { symbol: '$', name: 'USD ($)', rate: 1.0, locale: 'en-US', minTakeHome: 1500, maxTakeHome: 20000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 3000, stepExpenses: 50 },
    EUR: { symbol: '€', name: 'EUR (€)', rate: 0.92, locale: 'de-DE', minTakeHome: 1400, maxTakeHome: 19000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 2800, stepExpenses: 50 },
    GBP: { symbol: '£', name: 'GBP (£)', rate: 0.79, locale: 'en-GB', minTakeHome: 1200, maxTakeHome: 16000, stepTakeHome: 200, minExpenses: 0, maxExpenses: 2400, stepExpenses: 50 },
    CAD: { symbol: 'CA$', name: 'CAD (CA$)', rate: 1.36, locale: 'en-CA', minTakeHome: 2000, maxTakeHome: 28000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 4000, stepExpenses: 50 },
    AUD: { symbol: 'A$', name: 'AUD (A$)', rate: 1.52, locale: 'en-AU', minTakeHome: 2200, maxTakeHome: 30000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 4500, stepExpenses: 50 },
    INR: { symbol: '₹', name: 'INR (₹)', rate: 83.5, locale: 'en-IN', minTakeHome: 100000, maxTakeHome: 1800000, stepTakeHome: 10000, minExpenses: 0, maxExpenses: 250000, stepExpenses: 5000 },
    JPY: { symbol: '¥', name: 'JPY (¥)', rate: 155.0, locale: 'ja-JP', minTakeHome: 200000, maxTakeHome: 3200000, stepTakeHome: 25000, minExpenses: 0, maxExpenses: 450000, stepExpenses: 10000 },
    CHF: { symbol: 'CHF ', name: 'CHF (Fr)', rate: 0.90, locale: 'de-CH', minTakeHome: 1350, maxTakeHome: 18000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 2700, stepExpenses: 50 },
    SGD: { symbol: 'S$', name: 'SGD (S$)', rate: 1.35, locale: 'en-SG', minTakeHome: 2000, maxTakeHome: 28000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 4000, stepExpenses: 50 },
    AED: { symbol: 'AED ', name: 'AED (د.إ)', rate: 3.67, locale: 'ar-AE', minTakeHome: 5500, maxTakeHome: 75000, stepTakeHome: 500, minExpenses: 0, maxExpenses: 11000, stepExpenses: 250 },
    NZD: { symbol: 'NZ$', name: 'NZD (NZ$)', rate: 1.65, locale: 'en-NZ', minTakeHome: 2500, maxTakeHome: 33000, stepTakeHome: 250, minExpenses: 0, maxExpenses: 5000, stepExpenses: 50 },
    BRL: { symbol: 'R$', name: 'BRL (R$)', rate: 5.20, locale: 'pt-BR', minTakeHome: 7500, maxTakeHome: 100000, stepTakeHome: 500, minExpenses: 0, maxExpenses: 15000, stepExpenses: 250 },
    SEK: { symbol: 'kr ', name: 'SEK (kr)', rate: 10.5, locale: 'sv-SE', minTakeHome: 15000, maxTakeHome: 210000, stepTakeHome: 1000, minExpenses: 0, maxExpenses: 30000, stepExpenses: 500 },
    ZAR: { symbol: 'R ', name: 'ZAR (R)', rate: 18.2, locale: 'en-ZA', minTakeHome: 25000, maxTakeHome: 360000, stepTakeHome: 2500, minExpenses: 0, maxExpenses: 55000, stepExpenses: 1000 },
    PHP: { symbol: '₱', name: 'PHP (₱)', rate: 58.0, locale: 'en-PH', minTakeHome: 80000, maxTakeHome: 1200000, stepTakeHome: 5000, minExpenses: 0, maxExpenses: 175000, stepExpenses: 2500 },
  };

  // Industry Persona Presets (USD Baseline)
  const presets = {
    developer: { takeHome: 7500, nonBillable: 12, taxRate: 28, expenses: 600, retainerHours: 25 },
    designer: { takeHome: 6000, nonBillable: 14, taxRate: 25, expenses: 450, retainerHours: 20 },
    consultant: { takeHome: 9000, nonBillable: 10, taxRate: 30, expenses: 850, retainerHours: 15 },
    copywriter: { takeHome: 5500, nonBillable: 12, taxRate: 22, expenses: 300, retainerHours: 20 },
  };

  // Calculator State
  const state = {
    currency: 'USD',
    apiLoaded: false,
    apiLastUpdated: null,
    
    // Sliders & Values
    targetTakeHome: 6000,      // Monthly take home target
    nonBillableHours: 12,      // Hours/week spent on admin/sales/unbillable
    taxRate: 25,               // Expected tax & self-employment %
    monthlyExpenses: 500,      // Monthly business overhead
    retainerHours: 20,         // Hours per month committed in client retainer
    retainerDiscount: 5,       // % incentive offered for upfront monthly guarantee
    
    // Fixed standard baseline
    weeklyHours: 40,           // Standard total working hours / week
    vacationWeeks: 4,          // Weeks off per year (48 working weeks)
  };

  let chartInstance = null;

  // DOM Elements Cache
  const el = {
    currencySelect: document.getElementById('currencySelect'),
    takeHomeCurrencySymbol: document.getElementById('takeHomeCurrencySymbol'),
    expensesCurrencySymbol: document.getElementById('expensesCurrencySymbol'),
    
    // Live API Elements
    apiStatusDot: document.getElementById('apiStatusDot'),
    apiStatusText: document.getElementById('apiStatusText'),
    apiRateBadge: document.getElementById('apiRateBadge'),
    apiUpdatedBadge: document.getElementById('apiUpdatedBadge'),
    btnRefreshApi: document.getElementById('btnRefreshApi'),
    tableApiIndicator: document.getElementById('tableApiIndicator'),

    // Rate Health Diagnostic
    healthBadge: document.getElementById('healthBadge'),
    healthTitle: document.getElementById('healthTitle'),
    healthDesc: document.getElementById('healthDesc'),

    // Sliders & Inputs
    takeHomeSlider: document.getElementById('takeHomeSlider'),
    takeHomeInput: document.getElementById('takeHomeInput'),
    nonBillableSlider: document.getElementById('nonBillableSlider'),
    nonBillableInput: document.getElementById('nonBillableInput'),
    taxRateSlider: document.getElementById('taxRateSlider'),
    taxRateInput: document.getElementById('taxRateInput'),
    expensesSlider: document.getElementById('expensesSlider'),
    expensesInput: document.getElementById('expensesInput'),
    retainerHoursSlider: document.getElementById('retainerHoursSlider'),
    retainerHoursInput: document.getElementById('retainerHoursInput'),

    // Comparison Outputs: Hourly
    hourlyRateDisplay: document.getElementById('hourlyRateDisplay'),
    dayRateDisplay: document.getElementById('dayRateDisplay'),
    hourlyMonthlyTargetDisplay: document.getElementById('hourlyMonthlyTargetDisplay'),
    billableHoursWeekDisplay: document.getElementById('billableHoursWeekDisplay'),

    // Comparison Outputs: Retainer
    retainerFeeDisplay: document.getElementById('retainerFeeDisplay'),
    retainerEffectiveRateDisplay: document.getElementById('retainerEffectiveRateDisplay'),
    retainerClientsNeededDisplay: document.getElementById('retainerClientsNeededDisplay'),
    retainerMonthlyHoursDisplay: document.getElementById('retainerMonthlyHoursDisplay'),

    // Comparison Table Values
    tableHourlyRate: document.getElementById('tableHourlyRate'),
    tableRetainerRate: document.getElementById('tableRetainerRate'),
    tableHourlyMonth: document.getElementById('tableHourlyMonth'),
    tableRetainerMonth: document.getElementById('tableRetainerMonth'),
    tableClientsHourly: document.getElementById('tableClientsHourly'),
    tableClientsRetainer: document.getElementById('tableClientsRetainer'),
    tableUsdHourlyEquiv: document.getElementById('tableUsdHourlyEquiv'),
    tableUsdRetainerEquiv: document.getElementById('tableUsdRetainerEquiv'),

    // Retainer Pitch Box
    pitchEmailText: document.getElementById('pitchEmailText'),
    btnCopyPitch: document.getElementById('btnCopyPitch'),

    // Breakdown stats
    grossRevenueDisplay: document.getElementById('grossRevenueDisplay'),
    legendTakeHome: document.getElementById('legendTakeHome'),
    legendTaxes: document.getElementById('legendTaxes'),
    legendExpenses: document.getElementById('legendExpenses'),
    legendBuffer: document.getElementById('legendBuffer'),

    // Chart Canvas
    chartCanvas: document.getElementById('breakdownChart'),

    // Modals
    embedModal: document.getElementById('embedModal'),
    embedCodeSnippet: document.getElementById('embedCodeSnippet'),
    btnOpenEmbed: document.getElementById('btnOpenEmbed'),
    btnCopyEmbed: document.getElementById('btnCopyEmbed'),
    policyModal: document.getElementById('policyModal'),
    policyModalTitle: document.getElementById('policyModalTitle'),
    policyModalContent: document.getElementById('policyModalContent'),
    btnFooterPrivacy: document.getElementById('btnFooterPrivacy'),
    btnFooterTerms: document.getElementById('btnFooterTerms'),

    // Reset & Copy
    btnReset: document.getElementById('btnReset'),
    btnCopy: document.getElementById('btnCopy'),
    toast: document.getElementById('toastNotification'),
    toastMsg: document.getElementById('toastMessage'),

    // Cookie Consent
    cookieConsentBanner: document.getElementById('cookieConsentBanner'),
    btnAcceptCookies: document.getElementById('btnAcceptCookies'),
    btnRejectCookies: document.getElementById('btnRejectCookies'),
  };

  /**
   * Currency Formatter Helper
   */
  function formatMoney(amount, decimals = 0) {
    const cfg = currencies[state.currency] || currencies.USD;
    const rounded = Math.round(amount);
    return `${cfg.symbol}${rounded.toLocaleString(cfg.locale)}`;
  }

  function formatUsd(amount) {
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD`;
  }

  /**
   * Fetch Live Rates from free open exchange API at load time
   */
  async function fetchLiveExchangeRates(isUserInitiated = false) {
    if (el.apiStatusDot) {
      el.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping shrink-0';
    }
    if (el.apiStatusText) {
      el.apiStatusText.textContent = 'Pulling live exchange rates from Open Exchange API...';
    }

    try {
      const response = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const data = await response.json();
      if (data && data.rates) {
        Object.keys(currencies).forEach((code) => {
          if (data.rates[code]) {
            currencies[code].rate = data.rates[code];
          }
        });

        state.apiLoaded = true;
        state.apiLastUpdated = data.time_last_update_utc ? new Date(data.time_last_update_utc) : new Date();

        if (el.apiStatusDot) {
          el.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0';
        }
        if (el.apiStatusText) {
          el.apiStatusText.textContent = 'Live FX API Connected (open.er-api.com)';
        }
        if (el.apiUpdatedBadge) {
          const timeStr = state.apiLastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          el.apiUpdatedBadge.textContent = `Synced: ${timeStr}`;
        }
        if (el.tableApiIndicator) {
          el.tableApiIndicator.textContent = 'Live API Synced';
          el.tableApiIndicator.className = 'text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full font-semibold';
        }

        updateApiRateBadge();
        updateUI();

        if (isUserInitiated) {
          showToast('Updated live exchange rates from API!');
        }
      }
    } catch (err) {
      console.warn('Exchange API fetch error, falling back to cached reference rates:', err);
      if (el.apiStatusDot) {
        el.apiStatusDot.className = 'w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0';
      }
      if (el.apiStatusText) {
        el.apiStatusText.textContent = 'Offline (Using verified baseline rates)';
      }
      if (el.tableApiIndicator) {
        el.tableApiIndicator.textContent = 'Baseline Rates (Offline)';
        el.tableApiIndicator.className = 'text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-semibold';
      }
      updateApiRateBadge();
      updateUI();
    }
  }

  function updateApiRateBadge() {
    if (!el.apiRateBadge) return;
    const currentRate = currencies[state.currency]?.rate || 1;
    el.apiRateBadge.textContent = `1 USD = ${currentRate.toFixed(currentRate > 10 ? 2 : 4)} ${state.currency}`;
  }

  /**
   * Currency Conversion Handler
   */
  function handleCurrencyConversion(newCurrency) {
    if (!currencies[newCurrency] || newCurrency === state.currency) return;

    const oldCurrency = state.currency;
    const oldRate = currencies[oldCurrency].rate;
    const newRate = currencies[newCurrency].rate;
    const ratio = newRate / oldRate;

    let newTakeHome = state.targetTakeHome * ratio;
    let newExpenses = state.monthlyExpenses * ratio;
    const newCfg = currencies[newCurrency];

    if (newRate >= 100) {
      newTakeHome = Math.round(newTakeHome / 500) * 500;
      newExpenses = Math.round(newExpenses / 100) * 100;
    } else if (newRate >= 10) {
      newTakeHome = Math.round(newTakeHome / 100) * 100;
      newExpenses = Math.round(newExpenses / 50) * 50;
    } else {
      newTakeHome = Math.round(newTakeHome / 25) * 25;
      newExpenses = Math.round(newExpenses / 10) * 10;
    }

    state.targetTakeHome = Math.max(newCfg.minTakeHome, newTakeHome);
    state.monthlyExpenses = Math.max(newCfg.minExpenses, newExpenses);
    state.currency = newCurrency;

    if (el.takeHomeSlider && el.takeHomeInput) {
      el.takeHomeSlider.min = newCfg.minTakeHome;
      el.takeHomeSlider.max = newCfg.maxTakeHome;
      el.takeHomeSlider.step = newCfg.stepTakeHome;
      el.takeHomeSlider.value = state.targetTakeHome;

      el.takeHomeInput.min = newCfg.minTakeHome;
      el.takeHomeInput.max = newCfg.maxTakeHome * 2;
      el.takeHomeInput.step = newCfg.stepTakeHome;
      el.takeHomeInput.value = state.targetTakeHome;
    }

    if (el.expensesSlider && el.expensesInput) {
      el.expensesSlider.min = newCfg.minExpenses;
      el.expensesSlider.max = newCfg.maxExpenses;
      el.expensesSlider.step = newCfg.stepExpenses;
      el.expensesSlider.value = state.monthlyExpenses;

      el.expensesInput.min = newCfg.minExpenses;
      el.expensesInput.max = newCfg.maxExpenses * 2;
      el.expensesInput.step = newCfg.stepExpenses;
      el.expensesInput.value = state.monthlyExpenses;
    }

    if (el.takeHomeCurrencySymbol) el.takeHomeCurrencySymbol.textContent = newCfg.symbol;
    if (el.expensesCurrencySymbol) el.expensesCurrencySymbol.textContent = newCfg.symbol;

    updateApiRateBadge();
    updateUI();
    showToast(`Converted to ${newCfg.name} (Live Rate: 1 USD ≈ ${newRate.toFixed(2)} ${newCurrency})`);
  }

  /**
   * Apply Industry Persona Preset
   */
  function applyPreset(presetKey) {
    const p = presets[presetKey];
    if (!p) return;

    const rate = currencies[state.currency]?.rate || 1.0;
    state.targetTakeHome = Math.round((p.takeHome * rate) / 25) * 25;
    state.monthlyExpenses = Math.round((p.expenses * rate) / 10) * 10;
    state.nonBillableHours = p.nonBillable;
    state.taxRate = p.taxRate;
    state.retainerHours = p.retainerHours;

    if (el.takeHomeSlider) el.takeHomeSlider.value = state.targetTakeHome;
    if (el.takeHomeInput) el.takeHomeInput.value = state.targetTakeHome;
    if (el.nonBillableSlider) el.nonBillableSlider.value = state.nonBillableHours;
    if (el.nonBillableInput) el.nonBillableInput.value = state.nonBillableHours;
    if (el.taxRateSlider) el.taxRateSlider.value = state.taxRate;
    if (el.taxRateInput) el.taxRateInput.value = state.taxRate;
    if (el.expensesSlider) el.expensesSlider.value = state.monthlyExpenses;
    if (el.expensesInput) el.expensesInput.value = state.monthlyExpenses;
    if (el.retainerHoursSlider) el.retainerHoursSlider.value = state.retainerHours;
    if (el.retainerHoursInput) el.retainerHoursInput.value = state.retainerHours;

    updateUI();
    showToast(`Loaded Profile: ${presetKey.charAt(0).toUpperCase() + presetKey.slice(1)}`);
  }

  /**
   * Rate Health Score Diagnostic Engine (The Viral Engagement Hook)
   */
  function evaluateRateHealth(billableHoursPerWeek) {
    if (!el.healthBadge || !el.healthTitle || !el.healthDesc) return;

    // Condition 1: Burnout Risk (Trying to bill > 32h/wk out of 40h)
    if (billableHoursPerWeek > 32) {
      el.healthBadge.className = 'p-3.5 rounded-xl border health-badge-warning flex items-start space-x-3 text-xs';
      el.healthTitle.textContent = 'High Burnout Risk (Capacity > 80%)';
      el.healthDesc.textContent = `You are planning to bill ${billableHoursPerWeek} hrs/week with only ${state.nonBillableHours} hrs for marketing and admin. Over 30 billable hrs/week causes severe fatigue and leaves no time to pitch next month's clients.`;
      return;
    }

    // Condition 2: Under-buffered for Taxes & SECA (< 20%)
    if (state.taxRate < 20) {
      el.healthBadge.className = 'p-3.5 rounded-xl border health-badge-danger flex items-start space-x-3 text-xs';
      el.healthTitle.textContent = 'Under-Buffered for Self-Employment Taxes';
      el.healthDesc.textContent = `A ${state.taxRate}% tax buffer is dangerously low for contractors. Most 1099 freelancers owe 25%–35% in combined self-employment (FICA) and income taxes.`;
      return;
    }

    // Condition 3: Sustainable & Scalable
    el.healthBadge.className = 'p-3.5 rounded-xl border health-badge-good flex items-start space-x-3 text-xs';
    el.healthTitle.textContent = 'Healthy & Sustainable Workload';
    el.healthDesc.textContent = `Excellent balance! You have ${state.nonBillableHours} hrs/week dedicated to business development, a solid ${state.taxRate}% tax buffer, and a healthy emergency reserve.`;
  }

  /**
   * Core Financial Calculations
   */
  function calculate() {
    const workingWeeksPerYear = Math.max(1, 52 - state.vacationWeeks); // 48
    const billableHoursPerWeek = Math.max(1, state.weeklyHours - state.nonBillableHours); // e.g. 28 hrs/wk
    const annualBillableHours = billableHoursPerWeek * workingWeeksPerYear; // e.g. 1,344 hrs/yr
    const monthlyBillableHours = annualBillableHours / 12;

    const annualTakeHome = state.targetTakeHome * 12;
    const annualExpenses = state.monthlyExpenses * 12;
    const taxDecimal = Math.min(0.7, Math.max(0, state.taxRate / 100));
    
    // Pre-Tax Income needed to net targetTakeHome
    const annualPreTax = annualTakeHome / (1 - taxDecimal);
    const annualTaxes = annualPreTax - annualTakeHome;

    // 10% safety buffer for contractor resilience
    const bufferDecimal = 0.10;
    const annualGrossRevenue = (annualPreTax + annualExpenses) / (1 - bufferDecimal);
    const annualBuffer = annualGrossRevenue * bufferDecimal;
    const monthlyGrossTarget = annualGrossRevenue / 12;

    // Hourly Rate
    const hourlyRate = annualBillableHours > 0 ? annualGrossRevenue / annualBillableHours : 0;
    const dayRate = hourlyRate * 8;

    // Retainer Model
    const discountFactor = 1 - (state.retainerDiscount / 100);
    const retainerEffectiveHourly = hourlyRate * discountFactor;
    const monthlyRetainerFee = state.retainerHours * retainerEffectiveHourly;

    // Clients needed
    const retainerClientsNeeded = monthlyRetainerFee > 0 ? (monthlyGrossTarget / monthlyRetainerFee) : 0;
    const hourlyClientsNeeded = (monthlyBillableHours / Math.max(1, state.retainerHours));

    // Dynamic conversion to USD benchmark
    const currentRate = currencies[state.currency]?.rate || 1.0;
    const usdHourlyEquiv = currentRate > 0 ? hourlyRate / currentRate : hourlyRate;
    const usdRetainerEquiv = currentRate > 0 ? monthlyRetainerFee / currentRate : monthlyRetainerFee;

    return {
      annualTakeHome,
      annualTaxes,
      annualExpenses,
      annualBuffer,
      annualGrossRevenue,
      monthlyGrossTarget,
      billableHoursPerWeek,
      annualBillableHours,
      monthlyBillableHours,
      hourlyRate,
      dayRate,
      monthlyRetainerFee,
      retainerEffectiveHourly,
      retainerClientsNeeded,
      hourlyClientsNeeded,
      usdHourlyEquiv,
      usdRetainerEquiv,
    };
  }

  /**
   * Update visual progress on range slider tracks
   */
  function updateSliderFill(slider) {
    if (!slider) return;
    const min = parseFloat(slider.min) || 0;
    const max = parseFloat(slider.max) || 100;
    const val = parseFloat(slider.value) || 0;
    const pct = ((val - min) / (max - min)) * 100;
    slider.style.background = `linear-gradient(to right, #059669 0%, #10b981 ${pct}%, #e2e8f0 ${pct}%, #e2e8f0 100%)`;
  }

  /**
   * Update the 1-Click "Client Retainer Pitch" Email Generator
   */
  function updatePitchGenerator(res) {
    if (!el.pitchEmailText) return;
    const feeStr = formatMoney(res.monthlyRetainerFee);
    const hourlyStr = formatMoney(res.hourlyRate);
    const effStr = formatMoney(res.retainerEffectiveHourly);

    const pitchTemplate = 
`Subject: Proposal: Ongoing Dedicated Support & Monthly Retainer

Hi [Client Name],

I've really enjoyed partnering with you on our recent deliverables!

To help streamline your roadmap and guarantee dedicated bandwidth each month without the hassle of individual scoping calls or invoice friction, I'd love to propose transitioning to a dedicated monthly retainer.

Here is what the arrangement looks like:
• Guaranteed Capacity: ${state.retainerHours} hours reserved exclusively for your team each month.
• Priority Turnaround: Guaranteed 48-hour SLA response for sprint tasks.
• Value Incentive: Billed at ${feeStr}/month (an effective rate of ${effStr}/hr, saving you ${state.retainerDiscount}% off my standard ${hourlyStr}/hr ad-hoc rate).
• Predictable Invoicing: Clean monthly recurring billing on the 1st of each month.

If this aligns with your goals for the coming quarter, let me know and I will send over a simple 1-page retainer agreement so we can lock in your calendar slot!

Best regards,
[Your Name]`;

    el.pitchEmailText.value = pitchTemplate.trim();
  }

  /**
   * Update the UI
   */
  function updateUI() {
    const res = calculate();

    // 1. Hourly Column
    if (el.hourlyRateDisplay) el.hourlyRateDisplay.textContent = `${formatMoney(res.hourlyRate)}/hr`;
    if (el.dayRateDisplay) el.dayRateDisplay.textContent = formatMoney(res.dayRate);
    if (el.hourlyMonthlyTargetDisplay) el.hourlyMonthlyTargetDisplay.textContent = formatMoney(res.monthlyGrossTarget);
    if (el.billableHoursWeekDisplay) el.billableHoursWeekDisplay.textContent = `${res.billableHoursPerWeek} hrs/wk`;

    // 2. Retainer Column
    if (el.retainerFeeDisplay) el.retainerFeeDisplay.textContent = `${formatMoney(res.monthlyRetainerFee)}/mo`;
    if (el.retainerEffectiveRateDisplay) el.retainerEffectiveRateDisplay.textContent = `${formatMoney(res.retainerEffectiveHourly)}/hr (${state.retainerDiscount}% discount)`;
    if (el.retainerClientsNeededDisplay) el.retainerClientsNeededDisplay.textContent = `${res.retainerClientsNeeded.toFixed(1)} clients`;
    if (el.retainerMonthlyHoursDisplay) el.retainerMonthlyHoursDisplay.textContent = `${state.retainerHours} hrs/mo`;

    // 3. Dynamic Calculation Table
    if (el.tableHourlyRate) el.tableHourlyRate.textContent = `${formatMoney(res.hourlyRate)} / hr`;
    if (el.tableRetainerRate) el.tableRetainerRate.textContent = `${formatMoney(res.retainerEffectiveHourly)} / hr (Guaranteed)`;

    if (el.tableHourlyMonth) el.tableHourlyMonth.textContent = `${formatMoney(res.hourlyRate * state.retainerHours)} (Variable)`;
    if (el.tableRetainerMonth) el.tableRetainerMonth.textContent = `${formatMoney(res.monthlyRetainerFee)} (Paid 1st of month)`;

    if (el.tableClientsHourly) el.tableClientsHourly.textContent = `~${Math.ceil(res.hourlyClientsNeeded)} separate projects`;
    if (el.tableClientsRetainer) el.tableClientsRetainer.textContent = `~${Math.ceil(res.retainerClientsNeeded)} recurring clients`;

    if (el.tableUsdHourlyEquiv) el.tableUsdHourlyEquiv.textContent = `${formatUsd(res.usdHourlyEquiv)}/hr`;
    if (el.tableUsdRetainerEquiv) el.tableUsdRetainerEquiv.textContent = `${formatUsd(res.usdRetainerEquiv)}/mo`;

    // 4. Rate Health Diagnostic
    evaluateRateHealth(res.billableHoursPerWeek);

    // 5. Client Pitch Generator
    updatePitchGenerator(res);

    // 6. Breakdown legend
    if (el.grossRevenueDisplay) el.grossRevenueDisplay.textContent = formatMoney(res.monthlyGrossTarget);
    if (el.legendTakeHome) el.legendTakeHome.textContent = formatMoney(state.targetTakeHome);
    if (el.legendTaxes) el.legendTaxes.textContent = formatMoney(res.annualTaxes / 12);
    if (el.legendExpenses) el.legendExpenses.textContent = formatMoney(state.monthlyExpenses);
    if (el.legendBuffer) el.legendBuffer.textContent = formatMoney(res.annualBuffer / 12);

    // Update Slider track fills
    [
      el.takeHomeSlider,
      el.nonBillableSlider,
      el.taxRateSlider,
      el.expensesSlider,
      el.retainerHoursSlider,
    ].forEach(updateSliderFill);

    // Update Chart
    updateChart(res);
  }

  /**
   * Chart.js dynamic doughnut chart
   */
  function initChart() {
    if (!el.chartCanvas) return;
    const ctx = el.chartCanvas.getContext('2d');
    if (!ctx) return;

    const res = calculate();

    chartInstance = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Take-Home Pay', 'Taxes & SE Buffer', 'Business Expenses', 'Safety Buffer'],
        datasets: [
          {
            data: [
              state.targetTakeHome,
              res.annualTaxes / 12,
              state.monthlyExpenses,
              res.annualBuffer / 12,
            ],
            backgroundColor: [
              '#10b981', // Emerald
              '#f59e0b', // Amber
              '#3b82f6', // Blue
              '#8b5cf6', // Violet
            ],
            borderWidth: 2,
            borderColor: '#ffffff',
            hoverOffset: 4,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '70%',
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            backgroundColor: '#0f172a',
            padding: 10,
            cornerRadius: 6,
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const pct = total > 0 ? Math.round((val / total) * 100) : 0;
                return ` ${context.label}: ${formatMoney(val)}/mo (${pct}%)`;
              },
            },
          },
        },
      },
    });
  }

  function updateChart(res) {
    if (!chartInstance) return;
    chartInstance.data.datasets[0].data = [
      state.targetTakeHome,
      res.annualTaxes / 12,
      state.monthlyExpenses,
      res.annualBuffer / 12,
    ];
    chartInstance.update();
  }

  /**
   * Sync slider and text input
   */
  function syncInput(slider, input, stateKey, min, max) {
    if (!slider || !input) return;

    slider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      state[stateKey] = isNaN(val) ? min : val;
      input.value = state[stateKey];
      updateUI();
    });

    input.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) return;
      const currentMax = parseInt(slider.max, 10) * 1.5;
      const currentMin = parseInt(slider.min, 10);
      val = Math.max(currentMin, Math.min(currentMax, val));
      state[stateKey] = val;
      slider.value = Math.min(val, parseInt(slider.max, 10));
      updateUI();
    });

    input.addEventListener('blur', (e) => {
      let val = parseInt(e.target.value, 10);
      const currentMin = parseInt(slider.min, 10);
      if (isNaN(val) || val < currentMin) val = currentMin;
      state[stateKey] = val;
      input.value = val;
      slider.value = Math.min(val, parseInt(slider.max, 10));
      updateUI();
    });
  }

  /**
   * Toast Notification helper
   */
  let toastTimer = null;
  function showToast(msg) {
    if (!el.toast || !el.toastMsg) return;
    el.toastMsg.textContent = msg;
    el.toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      el.toast.classList.remove('show');
    }, 2500);
  }

  /**
   * Clipboard Helper
   */
  function copyTextToClipboard(text, successMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(() => showToast(successMsg));
    } else {
      const ta = document.createElement('textarea');
      ta.value = text;
      ta.style.position = 'fixed';
      ta.style.left = '-9999px';
      document.body.appendChild(ta);
      ta.focus();
      ta.select();
      try {
        document.execCommand('copy');
        showToast(successMsg);
      } catch (e) {
        showToast('Copied to clipboard!');
      }
      document.body.removeChild(ta);
    }
  }

  /**
   * Modal Management
   */
  function openModal(modal) {
    if (modal) modal.classList.add('active');
  }

  function closeModal(modal) {
    if (modal) modal.classList.remove('active');
  }

  function initModals() {
    document.querySelectorAll('.modal-overlay').forEach((m) => {
      m.addEventListener('click', (e) => {
        if (e.target === m || e.target.closest('.modal-close')) {
          closeModal(m);
        }
      });
    });

    // Embed Code
    const embedUrl = 'https://pocketruler.app/';
    const embedCode = `<iframe src="${embedUrl}" width="100%" height="850" style="border:0; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.08);" title="PocketRuler Freelance Rate vs. Retainer Calculator" loading="lazy"></iframe><p style="font-size:12px;text-align:center;margin-top:8px;color:#64748b;">Free tool by <a href="${embedUrl}" target="_blank" rel="noopener noreferrer" style="color:#059669;text-decoration:underline;">PocketRuler.app</a></p>`;
    
    if (el.embedCodeSnippet) el.embedCodeSnippet.value = embedCode;

    if (el.btnOpenEmbed) {
      el.btnOpenEmbed.addEventListener('click', () => {
        openModal(el.embedModal);
        if (el.embedCodeSnippet) el.embedCodeSnippet.select();
      });
    }

    if (el.btnCopyEmbed) {
      el.btnCopyEmbed.addEventListener('click', () => {
        copyTextToClipboard(el.embedCodeSnippet.value, 'Embed code copied to clipboard!');
        closeModal(el.embedModal);
      });
    }

    // Policy Modals (Required for Google AdSense Compliance)
    const policyContent = {
      privacy: {
        title: 'Privacy Policy',
        html: `
          <h4 class="font-bold text-slate-800 text-sm mb-1">Information &amp; Browser Execution</h4>
          <p class="mb-3">This website operates 100% client-side in your browser. We do not require account creation, login credentials, or store your financial calculations on our servers.</p>
          
          <h4 class="font-bold text-slate-800 text-sm mb-1">Google AdSense &amp; DoubleClick DART Cookies</h4>
          <p class="mb-3">Google, as a third-party advertising vendor, uses cookies to serve ads on this website. Google's use of the DART cookie enables it to serve ads to our users based on their visits to this site and other sites on the internet. Users may opt out of personalized advertising by visiting Google Ad Settings.</p>
          
          <h4 class="font-bold text-slate-800 text-sm mb-1">GDPR &amp; CCPA Compliance</h4>
          <p>We respect the data protection rights of our users under the General Data Protection Regulation (GDPR) and California Consumer Privacy Act (CCPA). No personal identity records are ever collected, sold, or shared.</p>
        `,
      },
      terms: {
        title: 'Terms of Service',
        html: `
          <h4 class="font-bold text-slate-800 text-sm mb-1">1. Informational Purposes Only</h4>
          <p class="mb-3">This calculator is provided free of charge for general financial planning and estimation purposes only. It does not constitute certified accounting, formal tax consultation, or legal advice.</p>
          
          <h4 class="font-bold text-slate-800 text-sm mb-1">2. No Warranties</h4>
          <p class="mb-3">This static website is provided "as is", without warranty of any kind, express or implied. The creators are not liable for business decisions made based on calculated rates.</p>
        `,
      },
    };

    function showPolicy(type) {
      const data = policyContent[type];
      if (!data || !el.policyModal) return;
      el.policyModalTitle.textContent = data.title;
      el.policyModalContent.innerHTML = data.html;
      openModal(el.policyModal);
    }

    if (el.btnFooterPrivacy) el.btnFooterPrivacy.addEventListener('click', () => showPolicy('privacy'));
    if (el.btnFooterTerms) el.btnFooterTerms.addEventListener('click', () => showPolicy('terms'));
  }

  /**
   * Cookie Consent Banner (GDPR & Google EU User Consent Policy)
   */
  function initCookieConsent() {
    if (!el.cookieConsentBanner) return;
    const consent = localStorage.getItem('pocketruler_cookie_consent');
    if (consent) {
      el.cookieConsentBanner.classList.add('hidden');
      return;
    }

    if (el.btnAcceptCookies) {
      el.btnAcceptCookies.addEventListener('click', () => {
        localStorage.setItem('pocketruler_cookie_consent', 'accepted');
        el.cookieConsentBanner.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => el.cookieConsentBanner.classList.add('hidden'), 300);
      });
    }

    if (el.btnRejectCookies) {
      el.btnRejectCookies.addEventListener('click', () => {
        localStorage.setItem('pocketruler_cookie_consent', 'essential');
        el.cookieConsentBanner.classList.add('opacity-0', 'translate-y-4');
        setTimeout(() => el.cookieConsentBanner.classList.add('hidden'), 300);
      });
    }
  }

  /**
   * Reset to default values
   */
  function resetDefaults() {
    state.currency = 'USD';
    state.targetTakeHome = 6000;
    state.nonBillableHours = 12;
    state.taxRate = 25;
    state.monthlyExpenses = 500;
    state.retainerHours = 20;

    if (el.currencySelect) el.currencySelect.value = 'USD';
    const cfg = currencies.USD;

    el.takeHomeSlider.min = cfg.minTakeHome;
    el.takeHomeSlider.max = cfg.maxTakeHome;
    el.takeHomeSlider.step = cfg.stepTakeHome;
    el.takeHomeSlider.value = 6000;
    el.takeHomeInput.value = 6000;

    el.expensesSlider.min = cfg.minExpenses;
    el.expensesSlider.max = cfg.maxExpenses;
    el.expensesSlider.step = cfg.stepExpenses;
    el.expensesSlider.value = 500;
    el.expensesInput.value = 500;

    el.nonBillableSlider.value = 12;
    el.nonBillableInput.value = 12;
    el.taxRateSlider.value = 25;
    el.taxRateInput.value = 25;
    el.retainerHoursSlider.value = 20;
    el.retainerHoursInput.value = 20;

    if (el.takeHomeCurrencySymbol) el.takeHomeCurrencySymbol.textContent = '$';
    if (el.expensesCurrencySymbol) el.expensesCurrencySymbol.textContent = '$';

    updateApiRateBadge();
    updateUI();
    showToast('Reset to defaults.');
  }

  /**
   * Setup Event Listeners & Initialize
   */
  function init() {
    // Inputs sync
    syncInput(el.takeHomeSlider, el.takeHomeInput, 'targetTakeHome', 1000, 50000);
    syncInput(el.nonBillableSlider, el.nonBillableInput, 'nonBillableHours', 0, 35);
    syncInput(el.taxRateSlider, el.taxRateInput, 'taxRate', 5, 50);
    syncInput(el.expensesSlider, el.expensesInput, 'monthlyExpenses', 0, 10000);
    syncInput(el.retainerHoursSlider, el.retainerHoursInput, 'retainerHours', 5, 60);

    // Currency selector
    if (el.currencySelect) {
      el.currencySelect.addEventListener('change', (e) => {
        handleCurrencyConversion(e.target.value);
      });
    }

    // Persona Presets
    document.querySelectorAll('[data-preset]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-preset');
        applyPreset(key);
      });
    });

    // Refresh API button
    if (el.btnRefreshApi) {
      el.btnRefreshApi.addEventListener('click', () => {
        fetchLiveExchangeRates(true);
      });
    }

    // 1-Click Pitch Copy
    if (el.btnCopyPitch) {
      el.btnCopyPitch.addEventListener('click', () => {
        copyTextToClipboard(el.pitchEmailText.value, 'Retainer pitch email copied to clipboard!');
      });
    }

    // Reset & Copy Summary
    if (el.btnReset) el.btnReset.addEventListener('click', resetDefaults);
    if (el.btnCopy) {
      el.btnCopy.addEventListener('click', () => {
        const res = calculate();
        const text = `Freelance Rate vs. Retainer Summary (${state.currency})
------------------------------------------------------
Target Take-Home: ${formatMoney(state.targetTakeHome)}/mo
Hourly Rate: ${formatMoney(res.hourlyRate)}/hr
Monthly Retainer (${state.retainerHours}h/mo): ${formatMoney(res.monthlyRetainerFee)}/mo
Clients Needed: Just ${res.retainerClientsNeeded.toFixed(1)} retainer clients covers 100% of your income goal!`;
        copyTextToClipboard(text, 'Comparison summary copied to clipboard!');
      });
    }

    initModals();
    initCookieConsent();
    initChart();
    updateUI();

    // DYNAMIC LIVE API CALL ON LOAD
    fetchLiveExchangeRates();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
