/**
 * PocketRuler.app - Solopreneur Cash Runway & Burn Rate Calculator
 * Client-Side Financial Engineering Engine
 * 
 * Features:
 * - Real-time synchronized dual inputs (ranges + numbers)
 * - Net burn rate & Zero Cash Date horizon projection
 * - 'Panic Mode' survival toggle (cuts discretionary to 0)
 * - International client retainer arbitrage via PocketRulerCurrency.convert
 * - 24-Month 3-scenario Cash Depletion Decay Curves (Chart.js)
 * - Burnout Capacity Barometer (<22h green, 23-32h amber, >32h red)
 * - Milestone Safety Buffers (3-Month, 6-Month, 12-Month)
 * - Full multi-currency adaptive slider bounds & formatting
 * - Dynamic theme listener (dark/light mode Chart.js updates)
 * - URL state sharing & instant preset configuration
 */

(function () {
  'use strict';

  // --- DOM Element References ---
  const currencySelect = document.getElementById('currencySelect');
  const btnShare = document.getElementById('btnShare');
  const btnReset = document.getElementById('btnReset');
  const toastNotification = document.getElementById('toastNotification');
  const toastMessage = document.getElementById('toastMessage');

  // Reserves Elements
  const inputPersonalSavings = document.getElementById('inputPersonalSavings');
  const sliderPersonalSavings = document.getElementById('sliderPersonalSavings');
  const inputBusinessReserves = document.getElementById('inputBusinessReserves');
  const sliderBusinessReserves = document.getElementById('sliderBusinessReserves');
  const inputAccountsReceivable = document.getElementById('inputAccountsReceivable');
  const sliderAccountsReceivable = document.getElementById('sliderAccountsReceivable');
  const sliderArConfidence = document.getElementById('sliderArConfidence');
  const labelArConfidence = document.getElementById('labelArConfidence');
  const outputArRealized = document.getElementById('outputArRealized');
  const summaryLiquidCash = document.getElementById('summaryLiquidCash');

  // Inflow Elements
  const inputRetainers = document.getElementById('inputRetainers');
  const sliderRetainers = document.getElementById('sliderRetainers');
  const inputProjects = document.getElementById('inputProjects');
  const sliderProjects = document.getElementById('sliderProjects');
  const toggleArbitrage = document.getElementById('toggleArbitrage');
  const arbitrageFields = document.getElementById('arbitrageFields');
  const inputForeignRetainer = document.getElementById('inputForeignRetainer');
  const foreignCurrencySelect = document.getElementById('foreignCurrencySelect');
  const outputForeignConverted = document.getElementById('outputForeignConverted');
  const summaryMonthlyInflow = document.getElementById('summaryMonthlyInflow');

  // Outflow Elements
  const inputEssentialExpenses = document.getElementById('inputEssentialExpenses');
  const sliderEssentialExpenses = document.getElementById('sliderEssentialExpenses');
  const inputDiscretionaryExpenses = document.getElementById('inputDiscretionaryExpenses');
  const sliderDiscretionaryExpenses = document.getElementById('sliderDiscretionaryExpenses');
  const inputBusinessOverhead = document.getElementById('inputBusinessOverhead');
  const sliderBusinessOverhead = document.getElementById('sliderBusinessOverhead');
  const sliderTaxReserve = document.getElementById('sliderTaxReserve');
  const labelTaxRate = document.getElementById('labelTaxRate');
  const outputTaxReserveAmount = document.getElementById('outputTaxReserveAmount');
  const summaryMonthlyOutflow = document.getElementById('summaryMonthlyOutflow');

  // Capacity & Burnout Elements
  const inputHourlyRate = document.getElementById('inputHourlyRate');
  const sliderHourlyRate = document.getElementById('sliderHourlyRate');
  const inputBillableHours = document.getElementById('inputBillableHours');
  const sliderBillableHours = document.getElementById('sliderBillableHours');
  const labelBillableHours = document.getElementById('labelBillableHours');
  const inputAdminHours = document.getElementById('inputAdminHours');
  const sliderAdminHours = document.getElementById('sliderAdminHours');
  const labelAdminHours = document.getElementById('labelAdminHours');
  const summaryHourlyRate = document.getElementById('summaryHourlyRate');

  // Hero Output Elements
  const outputRunwayMonths = document.getElementById('outputRunwayMonths');
  const outputRunwayUnit = document.getElementById('outputRunwayUnit');
  const outputZeroCashDate = document.getElementById('outputZeroCashDate');
  const zeroCashDateText = document.getElementById('zeroCashDateText');
  const runwayStatusPill = document.getElementById('runwayStatusPill');
  const outputNetBurn = document.getElementById('outputNetBurn');
  const outputTotalReserves = document.getElementById('outputTotalReserves');
  const outputTotalOutflow = document.getElementById('outputTotalOutflow');

  // Panic Mode
  const panicModeToggle = document.getElementById('panicModeToggle');
  const panicModeAlert = document.getElementById('panicModeAlert');
  let cachedDiscretionaryValue = 900;

  // Burnout Gauge Elements
  const burnoutBadge = document.getElementById('burnoutBadge');
  const burnoutRequiredHours = document.getElementById('burnoutRequiredHours');
  const burnoutBreakEvenOutflow = document.getElementById('burnoutBreakEvenOutflow');
  const burnoutNeedle = document.getElementById('burnoutNeedle');
  const burnoutBillableDisplay = document.getElementById('burnoutBillableDisplay');
  const burnoutAdminDisplay = document.getElementById('burnoutAdminDisplay');
  const burnoutTotalHours = document.getElementById('burnoutTotalHours');
  const burnoutAdvice = document.getElementById('burnoutAdvice');

  // Milestone Elements
  const milestone3Target = document.getElementById('milestone3Target');
  const milestone3Bar = document.getElementById('milestone3Bar');
  const milestone3Status = document.getElementById('milestone3Status');
  const milestone6Target = document.getElementById('milestone6Target');
  const milestone6Bar = document.getElementById('milestone6Bar');
  const milestone6Status = document.getElementById('milestone6Status');
  const milestone12Target = document.getElementById('milestone12Target');
  const milestone12Bar = document.getElementById('milestone12Bar');
  const milestone12Status = document.getElementById('milestone12Status');

  // Chart Scenarios Badges
  const chartLabelTrajectory = document.getElementById('chartLabelTrajectory');
  const chartLabelShock = document.getElementById('chartLabelShock');
  const chartLabelZero = document.getElementById('chartLabelZero');

  // Chart instance
  let decayChart = null;

  // Month names for date projection
  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  /**
   * Format helper utilizing PocketRulerCurrency
   */
  function formatMoney(amount, code = null) {
    if (window.PocketRulerCurrency && typeof window.PocketRulerCurrency.format === 'function') {
      return window.PocketRulerCurrency.format(amount, code);
    }
    const rounded = Math.round(Number(amount) || 0);
    return `$${rounded.toLocaleString('en-US')}`;
  }

  /**
   * Get active currency code
   */
  function getActiveCurrency() {
    if (window.PocketRulerCurrency && typeof window.PocketRulerCurrency.getActiveCurrency === 'function') {
      return window.PocketRulerCurrency.getActiveCurrency();
    }
    return currencySelect ? currencySelect.value : 'USD';
  }

  /**
   * Synchronize input field and range slider pair
   */
  function bindSync(inputEl, sliderEl, callback) {
    if (!inputEl || !sliderEl) return;

    sliderEl.addEventListener('input', () => {
      inputEl.value = sliderEl.value;
      if (callback) callback();
    });

    inputEl.addEventListener('input', () => {
      const val = Number(inputEl.value);
      if (!isNaN(val)) {
        // Expand slider max if input exceeds it
        if (val > Number(sliderEl.max)) {
          sliderEl.max = Math.round(val * 1.5);
        }
        sliderEl.value = val;
      }
      if (callback) callback();
    });
  }

  /**
   * Update currency symbols across all UI labels
   */
  function updateCurrencySymbols() {
    const code = getActiveCurrency();
    let symbol = '$';
    if (window.PocketRulerCurrency && typeof window.PocketRulerCurrency.getCurrency === 'function') {
      const cur = window.PocketRulerCurrency.getCurrency(code);
      if (cur) symbol = cur.symbol.trim();
    }

    document.querySelectorAll('.currency-symbol').forEach(el => {
      el.textContent = symbol;
    });
  }

  /**
   * Update slider bounds dynamically when currency changes
   */
  function adaptSliderBoundsToCurrency() {
    if (!window.PocketRulerCurrency || typeof window.PocketRulerCurrency.getSliderBounds !== 'function') return;

    const resBounds = window.PocketRulerCurrency.getSliderBounds('reserves');
    const livBounds = window.PocketRulerCurrency.getSliderBounds('living');
    const bizBounds = window.PocketRulerCurrency.getSliderBounds('business');
    const hrBounds = window.PocketRulerCurrency.getSliderBounds('hourlyRate');

    // Personal Savings & Business
    if (sliderPersonalSavings) {
      sliderPersonalSavings.max = resBounds.max;
      sliderPersonalSavings.step = resBounds.step;
      inputPersonalSavings.step = resBounds.step;
    }
    if (sliderBusinessReserves) {
      sliderBusinessReserves.max = Math.round(resBounds.max * 0.7);
      sliderBusinessReserves.step = resBounds.step;
      inputBusinessReserves.step = resBounds.step;
    }
    if (sliderAccountsReceivable) {
      sliderAccountsReceivable.max = Math.round(resBounds.max * 0.35);
      sliderAccountsReceivable.step = Math.round(resBounds.step / 2);
    }

    // Inflows
    if (sliderRetainers) {
      sliderRetainers.max = Math.round(livBounds.max * 1.5);
      sliderRetainers.step = livBounds.step;
    }
    if (sliderProjects) {
      sliderProjects.max = livBounds.max;
      sliderProjects.step = livBounds.step;
    }

    // Outflows
    if (sliderEssentialExpenses) {
      sliderEssentialExpenses.min = livBounds.min;
      sliderEssentialExpenses.max = livBounds.max;
      sliderEssentialExpenses.step = livBounds.step;
    }
    if (sliderDiscretionaryExpenses) {
      sliderDiscretionaryExpenses.max = Math.round(livBounds.max * 0.6);
      sliderDiscretionaryExpenses.step = Math.round(livBounds.step / 2);
    }
    if (sliderBusinessOverhead) {
      sliderBusinessOverhead.max = bizBounds.max;
      sliderBusinessOverhead.step = bizBounds.step;
    }

    // Hourly Rate
    if (sliderHourlyRate) {
      sliderHourlyRate.min = hrBounds.min;
      sliderHourlyRate.max = hrBounds.max;
      sliderHourlyRate.step = hrBounds.step;
      inputHourlyRate.min = hrBounds.min;
      inputHourlyRate.step = hrBounds.step;
    }
  }

  /**
   * Main calculation engine
   */
  function calculateRunway() {
    const activeCurr = getActiveCurrency();

    // 1. Liquid Reserves & Accounts Receivable
    const personalSavings = Math.max(0, Number(inputPersonalSavings.value) || 0);
    const businessReserves = Math.max(0, Number(inputBusinessReserves.value) || 0);
    const accountsReceivable = Math.max(0, Number(inputAccountsReceivable.value) || 0);
    const arConfidence = Math.max(0, Math.min(100, Number(sliderArConfidence.value) || 0));
    
    labelArConfidence.textContent = `${arConfidence}%`;
    const realizedAr = accountsReceivable * (arConfidence / 100);
    outputArRealized.textContent = `+${formatMoney(realizedAr, activeCurr)} counted`;

    const totalLiquidReserves = personalSavings + businessReserves + realizedAr;
    summaryLiquidCash.textContent = formatMoney(totalLiquidReserves, activeCurr);

    // 2. Inflows
    const baseRetainers = Math.max(0, Number(inputRetainers.value) || 0);
    const avgProjects = Math.max(0, Number(inputProjects.value) || 0);
    let foreignInflowConverted = 0;

    if (toggleArbitrage && toggleArbitrage.checked) {
      arbitrageFields.classList.remove('hidden');
      const foreignAmount = Math.max(0, Number(inputForeignRetainer.value) || 0);
      const foreignCurr = foreignCurrencySelect.value;
      if (window.PocketRulerCurrency && typeof window.PocketRulerCurrency.convert === 'function') {
        foreignInflowConverted = window.PocketRulerCurrency.convert(foreignAmount, foreignCurr, activeCurr);
      } else {
        foreignInflowConverted = foreignAmount;
      }
      outputForeignConverted.textContent = `+${formatMoney(foreignInflowConverted, activeCurr)}/mo`;
    } else if (arbitrageFields) {
      arbitrageFields.classList.add('hidden');
    }

    const totalGrossInflow = baseRetainers + avgProjects + foreignInflowConverted;
    summaryMonthlyInflow.textContent = `${formatMoney(totalGrossInflow, activeCurr)}/mo`;

    // 3. Outflows & Tax Reserve
    const essentialExpenses = Math.max(0, Number(inputEssentialExpenses.value) || 0);
    const isPanic = panicModeToggle && panicModeToggle.checked;
    
    let discretionaryExpenses = Math.max(0, Number(inputDiscretionaryExpenses.value) || 0);
    if (isPanic) {
      discretionaryExpenses = 0;
      panicModeAlert.classList.remove('hidden');
    } else {
      panicModeAlert.classList.add('hidden');
    }

    const businessOverhead = Math.max(0, Number(inputBusinessOverhead.value) || 0);
    const taxRatePercent = Math.max(0, Math.min(50, Number(sliderTaxReserve.value) || 25));
    labelTaxRate.textContent = `${taxRatePercent}%`;

    // Taxes scale with income
    const monthlyTaxReserve = totalGrossInflow * (taxRatePercent / 100);
    outputTaxReserveAmount.textContent = `${formatMoney(monthlyTaxReserve, activeCurr)}/mo`;

    const totalOutflow = essentialExpenses + discretionaryExpenses + businessOverhead + monthlyTaxReserve;
    summaryMonthlyOutflow.textContent = `${formatMoney(totalOutflow, activeCurr)}/mo`;

    // 4. Net Monthly Burn Rate & Runway Horizon
    const netMonthlyBurn = totalOutflow - totalGrossInflow; // Positive = draining, Negative = saving
    outputNetBurn.textContent = `${formatMoney(Math.abs(netMonthlyBurn), activeCurr)}/mo ${netMonthlyBurn <= 0 ? 'Surplus' : 'Burn'}`;
    outputTotalReserves.textContent = formatMoney(totalLiquidReserves, activeCurr);
    outputTotalOutflow.textContent = `${formatMoney(totalOutflow, activeCurr)}/mo`;

    let runwayMonths = 0;
    const now = new Date();

    if (netMonthlyBurn <= 0) {
      // Cash Flow Positive -> Infinite Runway!
      outputRunwayMonths.textContent = '∞';
      outputRunwayUnit.textContent = 'Infinite';
      outputZeroCashDate.innerHTML = `Zero Cash Date: <span class="font-bold text-emerald-400">Never (Cash Flow Positive +${formatMoney(Math.abs(netMonthlyBurn), activeCurr)}/mo)</span>`;
      runwayStatusPill.textContent = 'Cash Flow Positive';
      runwayStatusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      chartLabelTrajectory.textContent = '∞ (Surplus)';
    } else {
      runwayMonths = totalLiquidReserves > 0 ? (totalLiquidReserves / netMonthlyBurn) : 0;
      const formattedMonths = runwayMonths >= 100 ? '99+' : (runwayMonths < 0.1 ? '0.0' : runwayMonths.toFixed(1));
      outputRunwayMonths.textContent = formattedMonths;
      outputRunwayUnit.textContent = Number(formattedMonths) === 1.0 ? 'Month' : 'Months';

      // Compute zero cash date
      const zeroCashDate = new Date(now.getFullYear(), now.getMonth() + Math.floor(runwayMonths), 1);
      const zeroMonthName = MONTH_NAMES[zeroCashDate.getMonth()];
      const zeroYear = zeroCashDate.getFullYear();
      outputZeroCashDate.innerHTML = `Zero Cash Date: <span class="font-bold text-white underline decoration-emerald-500 underline-offset-4">${zeroMonthName} ${zeroYear}</span>`;

      // Status pill classification
      if (runwayMonths >= 12) {
        runwayStatusPill.textContent = 'Anti-Fragile (12+ Mos)';
        runwayStatusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30';
      } else if (runwayMonths >= 6) {
        runwayStatusPill.textContent = 'Resilient (6-12 Mos)';
        runwayStatusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-blue-500/20 text-blue-300 border border-blue-500/30';
      } else if (runwayMonths >= 3) {
        runwayStatusPill.textContent = 'Cautious (3-6 Mos)';
        runwayStatusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-500/20 text-amber-300 border border-amber-500/30';
      } else {
        runwayStatusPill.textContent = 'Critical Alert (< 3 Mos)';
        runwayStatusPill.className = 'px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-500/20 text-rose-300 border border-rose-500/30 animate-pulse';
      }
      chartLabelTrajectory.textContent = `${formattedMonths} Mos`;
    }

    // 5. Burnout Capacity Modeling
    const hourlyRate = Math.max(1, Number(inputHourlyRate.value) || 1);
    const targetBillable = Math.max(1, Number(inputBillableHours.value) || 25);
    const adminHours = Math.max(0, Number(inputAdminHours.value) || 10);
    labelBillableHours.textContent = `${targetBillable} hrs/wk`;
    labelAdminHours.textContent = `${adminHours} hrs/wk`;
    summaryHourlyRate.textContent = `${formatMoney(hourlyRate, activeCurr)}/hr`;

    // Weekly billable hours needed to break even with total monthly burn rate
    // Formula: monthly_outflow / (hourly_rate * 4.3333 weeks/month)
    const requiredWeeklyBillable = totalOutflow / (hourlyRate * 4.3333);
    const totalWeeklyWorkload = requiredWeeklyBillable + adminHours;

    burnoutBreakEvenOutflow.textContent = formatMoney(totalOutflow, activeCurr);
    burnoutRequiredHours.textContent = `${requiredWeeklyBillable.toFixed(1)} hrs/wk`;
    burnoutBillableDisplay.textContent = `${requiredWeeklyBillable.toFixed(1)} hrs/wk`;
    burnoutAdminDisplay.textContent = `+ ${adminHours.toFixed(1)} hrs/wk`;
    burnoutTotalHours.textContent = `${totalWeeklyWorkload.toFixed(1)} hrs/wk`;

    // Speedometer needle position: 0h = 0%, 22h = 55%, 32h = 80%, 45h = 100%
    let needlePercent = 0;
    if (requiredWeeklyBillable <= 22) {
      needlePercent = (requiredWeeklyBillable / 22) * 55;
    } else if (requiredWeeklyBillable <= 32) {
      needlePercent = 55 + ((requiredWeeklyBillable - 22) / 10) * 25;
    } else {
      needlePercent = Math.min(100, 80 + ((requiredWeeklyBillable - 32) / 13) * 20);
    }
    burnoutNeedle.style.left = `${needlePercent}%`;

    if (requiredWeeklyBillable <= 22) {
      burnoutBadge.textContent = 'Sustainable';
      burnoutBadge.className = 'text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800';
      burnoutAdvice.innerHTML = `✅ <strong>Sustainable Workload:</strong> Requiring only <strong>${requiredWeeklyBillable.toFixed(1)} hrs/wk</strong> of billable work to break even gives you generous cognitive bandwidth for deep work, rest, and business development.`;
    } else if (requiredWeeklyBillable <= 32) {
      burnoutBadge.textContent = 'Strained';
      burnoutBadge.className = 'text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800';
      burnoutAdvice.innerHTML = `⚠️ <strong>Strained Workload:</strong> At <strong>${requiredWeeklyBillable.toFixed(1)} hrs/wk</strong> of billable time plus admin overhead, you are near cognitive fatigue. Consider increasing your hourly rate by 15% to 25% to recover breathing room.`;
    } else {
      burnoutBadge.textContent = 'Burnout Risk';
      burnoutBadge.className = 'text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800 animate-pulse';
      burnoutAdvice.innerHTML = `🚨 <strong>High Burnout Risk:</strong> Demanding <strong>${requiredWeeklyBillable.toFixed(1)} hrs/wk</strong> of billable execution is mathematically unsustainable long-term. Your pricing or overhead must be restructured immediately.`;
    }

    // 6. Milestone Safety Buffers
    const survivalTarget = essentialExpenses * 3;
    const resilientTarget = (essentialExpenses + businessOverhead) * 6;
    const antiFragileTarget = (essentialExpenses + discretionaryExpenses + businessOverhead) * 12;

    milestone3Target.textContent = formatMoney(survivalTarget, activeCurr);
    milestone6Target.textContent = formatMoney(resilientTarget, activeCurr);
    milestone12Target.textContent = formatMoney(antiFragileTarget, activeCurr);

    updateMilestoneBar(milestone3Bar, milestone3Status, totalLiquidReserves, survivalTarget, activeCurr);
    updateMilestoneBar(milestone6Bar, milestone6Status, totalLiquidReserves, resilientTarget, activeCurr);
    updateMilestoneBar(milestone12Bar, milestone12Status, totalLiquidReserves, antiFragileTarget, activeCurr);

    // 7. Calculate Scenarios for Chart
    // 0% Inflow Burn: Essential + Discretionary + Business (no tax on 0 income)
    const zeroRevBurn = essentialExpenses + discretionaryExpenses + businessOverhead;
    const zeroRevMonths = zeroRevBurn > 0 ? (totalLiquidReserves / zeroRevBurn) : 0;
    chartLabelZero.textContent = `${zeroRevMonths.toFixed(1)} Mos`;

    // 50% Inflow Burn: Outflows with 50% tax reserve minus 50% gross inflow
    const shockInflow = totalGrossInflow * 0.5;
    const shockTax = shockInflow * (taxRatePercent / 100);
    const shockOutflow = essentialExpenses + discretionaryExpenses + businessOverhead + shockTax;
    const shockBurn = shockOutflow - shockInflow;
    const shockMonths = shockBurn <= 0 ? 99 : (totalLiquidReserves / shockBurn);
    chartLabelShock.textContent = shockBurn <= 0 ? '∞ (Surplus)' : `${shockMonths.toFixed(1)} Mos`;

    // Update Chart.js Decay Curve
    updateDecayChart(totalLiquidReserves, zeroRevBurn, shockBurn, netMonthlyBurn, activeCurr);
  }

  /**
   * Helper to format milestone progress bar
   */
  function updateMilestoneBar(barEl, statusEl, reserves, target, currencyCode) {
    if (!barEl || !statusEl) return;
    if (target <= 0) {
      barEl.style.width = '100%';
      statusEl.textContent = 'Achieved';
      return;
    }

    const pct = Math.round((reserves / target) * 100);
    barEl.style.width = `${Math.min(100, Math.max(0, pct))}%`;

    if (reserves >= target) {
      const surplus = reserves - target;
      statusEl.textContent = `Achieved (+${formatMoney(surplus, currencyCode)})`;
      statusEl.className = 'font-semibold text-emerald-600 dark:text-emerald-400';
      barEl.className = 'bg-emerald-500 h-full rounded-full transition-all duration-300';
    } else {
      const gap = target - reserves;
      statusEl.textContent = `${pct}% (${formatMoney(gap, currencyCode)} gap)`;
      statusEl.className = 'font-semibold text-slate-500 dark:text-slate-400';
      barEl.className = pct >= 60 ? 'bg-amber-500 h-full rounded-full transition-all duration-300' : 'bg-rose-500 h-full rounded-full transition-all duration-300';
    }
  }

  /**
   * Render or Update the 24-Month Cash Depletion Decay Curve
   */
  function updateDecayChart(initialReserves, zeroBurn, shockBurn, normalBurn, currencyCode) {
    const canvas = document.getElementById('decayCurveCanvas');
    if (!canvas) return;

    const isDark = document.documentElement.classList.contains('dark');
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';
    const textColor = isDark ? '#94a3b8' : '#64748b';

    const labels = [];
    const dataZero = [];
    const dataShock = [];
    const dataNormal = [];

    const now = new Date();
    const monthsToShow = 24;

    for (let t = 0; t <= monthsToShow; t++) {
      if (t === 0) {
        labels.push('Now');
      } else {
        const d = new Date(now.getFullYear(), now.getMonth() + t, 1);
        const mon = MONTH_NAMES[d.getMonth()].substring(0, 3);
        const yr = String(d.getFullYear()).slice(-2);
        labels.push(`${mon} '${yr}`);
      }

      // 1. Zero revenue scenario (burns at zeroBurn each month)
      const balZero = Math.max(0, initialReserves - (t * zeroBurn));
      dataZero.push(balZero);

      // 2. 50% revenue shock scenario
      const balShock = shockBurn <= 0 
        ? initialReserves + (t * Math.abs(shockBurn))
        : Math.max(0, initialReserves - (t * shockBurn));
      dataShock.push(balShock);

      // 3. Current trajectory
      const balNormal = normalBurn <= 0
        ? initialReserves + (t * Math.abs(normalBurn))
        : Math.max(0, initialReserves - (t * normalBurn));
      dataNormal.push(balNormal);
    }

    if (decayChart) {
      decayChart.data.labels = labels;
      decayChart.data.datasets[0].data = dataZero;
      decayChart.data.datasets[1].data = dataShock;
      decayChart.data.datasets[2].data = dataNormal;
      decayChart.options.scales.x.grid.color = gridColor;
      decayChart.options.scales.x.ticks.color = textColor;
      decayChart.options.scales.y.grid.color = gridColor;
      decayChart.options.scales.y.ticks.color = textColor;
      decayChart.update('none');
      return;
    }

    if (typeof Chart === 'undefined') {
      console.warn('Chart.js not yet loaded.');
      return;
    }

    const ctx = canvas.getContext('2d');
    decayChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: '0% Revenue (Complete Freeze)',
            data: dataZero,
            borderColor: '#f43f5e', // Rose 500
            backgroundColor: 'rgba(244, 63, 94, 0.05)',
            borderWidth: 2.5,
            borderDash: [5, 5],
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0.25,
            fill: false
          },
          {
            label: '50% Revenue Shock',
            data: dataShock,
            borderColor: '#f59e0b', // Amber 500
            backgroundColor: 'rgba(245, 158, 11, 0.05)',
            borderWidth: 2.5,
            borderDash: [3, 3],
            pointRadius: 2,
            pointHoverRadius: 5,
            tension: 0.25,
            fill: false
          },
          {
            label: 'Current Trajectory',
            data: dataNormal,
            borderColor: '#10b981', // Emerald 500
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            borderWidth: 3,
            pointRadius: 2,
            pointHoverRadius: 6,
            tension: 0.3,
            fill: true
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
              boxWidth: 12,
              usePointStyle: true,
              color: textColor,
              font: {
                family: 'Plus Jakarta Sans',
                size: 11,
                weight: '600'
              }
            }
          },
          tooltip: {
            backgroundColor: isDark ? 'rgba(15, 23, 42, 0.95)' : 'rgba(255, 255, 255, 0.95)',
            titleColor: isDark ? '#f8fafc' : '#0f172a',
            bodyColor: isDark ? '#cbd5e1' : '#334155',
            borderColor: isDark ? '#334155' : '#e2e8f0',
            borderWidth: 1,
            padding: 10,
            cornerRadius: 10,
            callbacks: {
              label: function (context) {
                const val = context.raw || 0;
                return ` ${context.dataset.label}: ${formatMoney(val, currencyCode)}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                family: 'Plus Jakarta Sans',
                size: 10
              },
              maxRotation: 45
            }
          },
          y: {
            grid: {
              color: gridColor,
              drawBorder: false
            },
            ticks: {
              color: textColor,
              font: {
                family: 'Plus Jakarta Sans',
                size: 10
              },
              callback: function (val) {
                return formatMoney(val, currencyCode);
              }
            }
          }
        }
      }
    });
  }

  /**
   * Set up all bi-directional synchronized input controls
   */
  function setupInputBindings() {
    bindSync(inputPersonalSavings, sliderPersonalSavings, calculateRunway);
    bindSync(inputBusinessReserves, sliderBusinessReserves, calculateRunway);
    bindSync(inputAccountsReceivable, sliderAccountsReceivable, calculateRunway);

    if (sliderArConfidence) {
      sliderArConfidence.addEventListener('input', calculateRunway);
    }

    bindSync(inputRetainers, sliderRetainers, calculateRunway);
    bindSync(inputProjects, sliderProjects, calculateRunway);

    if (toggleArbitrage) {
      toggleArbitrage.addEventListener('change', calculateRunway);
    }
    if (inputForeignRetainer) {
      inputForeignRetainer.addEventListener('input', calculateRunway);
    }
    if (foreignCurrencySelect) {
      foreignCurrencySelect.addEventListener('change', calculateRunway);
    }

    bindSync(inputEssentialExpenses, sliderEssentialExpenses, calculateRunway);
    bindSync(inputDiscretionaryExpenses, sliderDiscretionaryExpenses, () => {
      if (!panicModeToggle.checked) {
        cachedDiscretionaryValue = Number(inputDiscretionaryExpenses.value) || 0;
      }
      calculateRunway();
    });
    bindSync(inputBusinessOverhead, sliderBusinessOverhead, calculateRunway);

    if (sliderTaxReserve) {
      sliderTaxReserve.addEventListener('input', calculateRunway);
    }

    bindSync(inputHourlyRate, sliderHourlyRate, calculateRunway);
    bindSync(inputBillableHours, sliderBillableHours, calculateRunway);
    bindSync(inputAdminHours, sliderAdminHours, calculateRunway);

    // Panic Mode Toggle
    if (panicModeToggle) {
      panicModeToggle.addEventListener('change', () => {
        if (panicModeToggle.checked) {
          cachedDiscretionaryValue = Number(inputDiscretionaryExpenses.value) || 0;
          inputDiscretionaryExpenses.value = 0;
          sliderDiscretionaryExpenses.value = 0;
          inputDiscretionaryExpenses.disabled = true;
          sliderDiscretionaryExpenses.disabled = true;
        } else {
          inputDiscretionaryExpenses.value = cachedDiscretionaryValue;
          sliderDiscretionaryExpenses.value = cachedDiscretionaryValue;
          inputDiscretionaryExpenses.disabled = false;
          sliderDiscretionaryExpenses.disabled = false;
        }
        calculateRunway();
      });
    }
  }

  /**
   * Apply instant persona presets
   */
  function applyPreset(name) {
    const cur = getActiveCurrency();
    const multiplier = window.PocketRulerCurrency ? (window.PocketRulerCurrency.getCurrency(cur).rate || 1.0) : 1.0;

    if (panicModeToggle && panicModeToggle.checked) {
      panicModeToggle.checked = false;
      inputDiscretionaryExpenses.disabled = false;
      sliderDiscretionaryExpenses.disabled = false;
    }

    switch (name) {
      case 'bootstrapping':
        inputPersonalSavings.value = Math.round(15000 * multiplier);
        inputBusinessReserves.value = Math.round(5000 * multiplier);
        inputAccountsReceivable.value = Math.round(2000 * multiplier);
        sliderArConfidence.value = 85;
        inputRetainers.value = Math.round(1500 * multiplier);
        inputProjects.value = Math.round(1000 * multiplier);
        if (toggleArbitrage) toggleArbitrage.checked = false;
        inputEssentialExpenses.value = Math.round(2400 * multiplier);
        inputDiscretionaryExpenses.value = Math.round(600 * multiplier);
        inputBusinessOverhead.value = Math.round(300 * multiplier);
        sliderTaxReserve.value = 25;
        inputHourlyRate.value = Math.max(15, Math.round(75 * multiplier));
        inputBillableHours.value = 20;
        inputAdminHours.value = 10;
        break;

      case 'consultant':
        inputPersonalSavings.value = Math.round(30000 * multiplier);
        inputBusinessReserves.value = Math.round(15000 * multiplier);
        inputAccountsReceivable.value = Math.round(8000 * multiplier);
        sliderArConfidence.value = 90;
        inputRetainers.value = Math.round(5000 * multiplier);
        inputProjects.value = Math.round(2500 * multiplier);
        if (toggleArbitrage) toggleArbitrage.checked = false;
        inputEssentialExpenses.value = Math.round(3500 * multiplier);
        inputDiscretionaryExpenses.value = Math.round(1500 * multiplier);
        inputBusinessOverhead.value = Math.round(600 * multiplier);
        sliderTaxReserve.value = 30;
        inputHourlyRate.value = Math.max(20, Math.round(125 * multiplier));
        inputBillableHours.value = 25;
        inputAdminHours.value = 12;
        break;

      case 'nomad':
        inputPersonalSavings.value = Math.round(22000 * multiplier);
        inputBusinessReserves.value = Math.round(6000 * multiplier);
        inputAccountsReceivable.value = Math.round(3500 * multiplier);
        sliderArConfidence.value = 80;
        inputRetainers.value = Math.round(1000 * multiplier);
        inputProjects.value = Math.round(800 * multiplier);
        if (toggleArbitrage) {
          toggleArbitrage.checked = true;
          inputForeignRetainer.value = 2500;
          foreignCurrencySelect.value = 'USD';
        }
        inputEssentialExpenses.value = Math.round(1800 * multiplier);
        inputDiscretionaryExpenses.value = Math.round(700 * multiplier);
        inputBusinessOverhead.value = Math.round(350 * multiplier);
        sliderTaxReserve.value = 20;
        inputHourlyRate.value = Math.max(15, Math.round(85 * multiplier));
        inputBillableHours.value = 20;
        inputAdminHours.value = 8;
        break;

      case 'survival':
        inputPersonalSavings.value = Math.round(6000 * multiplier);
        inputBusinessReserves.value = Math.round(2000 * multiplier);
        inputAccountsReceivable.value = Math.round(1500 * multiplier);
        sliderArConfidence.value = 50;
        inputRetainers.value = 0;
        inputProjects.value = Math.round(500 * multiplier);
        if (toggleArbitrage) toggleArbitrage.checked = false;
        inputEssentialExpenses.value = Math.round(2200 * multiplier);
        inputDiscretionaryExpenses.value = Math.round(400 * multiplier);
        inputBusinessOverhead.value = Math.round(250 * multiplier);
        sliderTaxReserve.value = 20;
        inputHourlyRate.value = Math.max(15, Math.round(65 * multiplier));
        inputBillableHours.value = 30;
        inputAdminHours.value = 10;
        break;
    }

    // Synchronize sliders
    sliderPersonalSavings.value = inputPersonalSavings.value;
    sliderBusinessReserves.value = inputBusinessReserves.value;
    sliderAccountsReceivable.value = inputAccountsReceivable.value;
    sliderRetainers.value = inputRetainers.value;
    sliderProjects.value = inputProjects.value;
    sliderEssentialExpenses.value = inputEssentialExpenses.value;
    sliderDiscretionaryExpenses.value = inputDiscretionaryExpenses.value;
    sliderBusinessOverhead.value = inputBusinessOverhead.value;
    sliderHourlyRate.value = inputHourlyRate.value;
    sliderBillableHours.value = inputBillableHours.value;
    sliderAdminHours.value = inputAdminHours.value;

    calculateRunway();
  }

  /**
   * Reset all fields to smart defaults based on active currency
   */
  function resetDefaults() {
    applyPreset('consultant');
  }

  /**
   * Serialize current calculator state into URL query parameters
   */
  function serializeStateToUrl() {
    const params = new URLSearchParams();
    params.set('curr', getActiveCurrency());
    params.set('ps', inputPersonalSavings.value);
    params.set('bb', inputBusinessReserves.value);
    params.set('ar', inputAccountsReceivable.value);
    params.set('arc', sliderArConfidence.value);
    params.set('ret', inputRetainers.value);
    params.set('proj', inputProjects.value);
    if (toggleArbitrage && toggleArbitrage.checked) {
      params.set('arb', '1');
      params.set('fa', inputForeignRetainer.value);
      params.set('fc', foreignCurrencySelect.value);
    }
    params.set('ee', inputEssentialExpenses.value);
    params.set('de', inputDiscretionaryExpenses.value);
    params.set('bo', inputBusinessOverhead.value);
    params.set('tr', sliderTaxReserve.value);
    params.set('hr', inputHourlyRate.value);
    params.set('bh', inputBillableHours.value);
    params.set('ah', inputAdminHours.value);
    if (panicModeToggle && panicModeToggle.checked) {
      params.set('panic', '1');
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  /**
   * Load state from URL parameters if present
   */
  function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (!params.has('ps') && !params.has('ret')) return false;

    if (params.has('curr') && window.PocketRulerCurrency) {
      window.PocketRulerCurrency.setActiveCurrency(params.get('curr'));
      if (currencySelect) currencySelect.value = params.get('curr');
    }

    if (params.has('ps')) inputPersonalSavings.value = params.get('ps');
    if (params.has('bb')) inputBusinessReserves.value = params.get('bb');
    if (params.has('ar')) inputAccountsReceivable.value = params.get('ar');
    if (params.has('arc')) sliderArConfidence.value = params.get('arc');
    if (params.has('ret')) inputRetainers.value = params.get('ret');
    if (params.has('proj')) inputProjects.value = params.get('proj');

    if (params.has('arb') && params.get('arb') === '1') {
      if (toggleArbitrage) toggleArbitrage.checked = true;
      if (params.has('fa')) inputForeignRetainer.value = params.get('fa');
      if (params.has('fc')) foreignCurrencySelect.value = params.get('fc');
    }

    if (params.has('ee')) inputEssentialExpenses.value = params.get('ee');
    if (params.has('de')) inputDiscretionaryExpenses.value = params.get('de');
    if (params.has('bo')) inputBusinessOverhead.value = params.get('bo');
    if (params.has('tr')) sliderTaxReserve.value = params.get('tr');
    if (params.has('hr')) inputHourlyRate.value = params.get('hr');
    if (params.has('bh')) inputBillableHours.value = params.get('bh');
    if (params.has('ah')) inputAdminHours.value = params.get('ah');

    if (params.has('panic') && params.get('panic') === '1' && panicModeToggle) {
      panicModeToggle.checked = true;
      inputDiscretionaryExpenses.disabled = true;
      sliderDiscretionaryExpenses.disabled = true;
    }

    // Sync sliders
    sliderPersonalSavings.value = inputPersonalSavings.value;
    sliderBusinessReserves.value = inputBusinessReserves.value;
    sliderAccountsReceivable.value = inputAccountsReceivable.value;
    sliderRetainers.value = inputRetainers.value;
    sliderProjects.value = inputProjects.value;
    sliderEssentialExpenses.value = inputEssentialExpenses.value;
    sliderDiscretionaryExpenses.value = inputDiscretionaryExpenses.value;
    sliderBusinessOverhead.value = inputBusinessOverhead.value;
    sliderHourlyRate.value = inputHourlyRate.value;
    sliderBillableHours.value = inputBillableHours.value;
    sliderAdminHours.value = inputAdminHours.value;

    return true;
  }

  /**
   * Share calculation handler (URL copy)
   */
  function handleShare() {
    const shareUrl = serializeStateToUrl();
    window.history.replaceState({}, '', shareUrl);

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(shareUrl).then(showToast).catch(() => {
        prompt('Copy your calculation URL:', shareUrl);
      });
    } else {
      prompt('Copy your calculation URL:', shareUrl);
    }
  }

  /**
   * Display toast notification
   */
  function showToast(msg) {
    if (!toastNotification) return;
    if (toastMessage && typeof msg === 'string') toastMessage.textContent = msg;
    toastNotification.classList.add('show');
    setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 2800);
  }

  /**
   * Initialize on DOM ready
   */
  function init() {
    // 1. Populate Currency Selector
    if (window.PocketRulerCurrency && currencySelect) {
      window.PocketRulerCurrency.populateSelector(currencySelect);
    }

    // 2. Setup Input sync
    setupInputBindings();

    // 3. Preset Buttons
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        applyPreset(e.currentTarget.getAttribute('data-preset'));
      });
    });

    // 4. Share & Reset buttons
    if (btnShare) btnShare.addEventListener('click', handleShare);
    if (btnReset) btnReset.addEventListener('click', resetDefaults);

    // 5. Load State from URL or load defaults
    const loadedFromUrl = loadStateFromUrl();
    if (!loadedFromUrl) {
      // adapt bounds to active currency
      adaptSliderBoundsToCurrency();
    }

    updateCurrencySymbols();
    calculateRunway();

    // 6. Currency Change Listener
    window.addEventListener('currencychange', (e) => {
      updateCurrencySymbols();
      adaptSliderBoundsToCurrency();
      calculateRunway();
    });

    // 7. Theme Change Listener (Chart.js color re-rendering)
    window.addEventListener('themechange', () => {
      if (decayChart) {
        decayChart.destroy();
        decayChart = null;
      }
      calculateRunway();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
