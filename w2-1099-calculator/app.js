/**
 * PocketRuler.app - W-2 vs 1099 Calculator Calculation Engine & UI Controller
 * 100% Client-Side Financial Engineering & Tax Modeling
 */

(function () {
  'use strict';

  // --- IRS Tax Constants (2024 / 2025 Tax Year Standard) ---
  const TAX_CONSTANTS = {
    STANDARD_DEDUCTION_SINGLE: 14600,
    SS_WAGE_CAP: 168600,
    ADDITIONAL_MEDICARE_THRESHOLD: 200000,
    W2_SS_RATE: 0.062,
    W2_MEDICARE_RATE: 0.0145,
    SECA_NET_FACTOR: 0.9235,
    SECA_SS_RATE: 0.124,
    SECA_MEDICARE_RATE: 0.029,
    ADDITIONAL_MEDICARE_RATE: 0.009,
    QBI_RATE: 0.20,
    QBI_SSTB_PHASEOUT_START: 191950,
    QBI_SSTB_PHASEOUT_END: 241950,
  };

  // Federal Progressive Tax Brackets (Single Filer)
  const FEDERAL_BRACKETS_SINGLE = [
    { limit: 11600, rate: 0.10 },
    { limit: 47150, rate: 0.12 },
    { limit: 100525, rate: 0.22 },
    { limit: 191950, rate: 0.24 },
    { limit: 243725, rate: 0.32 },
    { limit: 609350, rate: 0.35 },
    { limit: Infinity, rate: 0.37 },
  ];

  // State Tax Models
  const STATE_TAX_CONFIGS = {
    generic: {
      name: 'US Average (5.0%)',
      type: 'flat',
      rate: 0.05,
      deduction: 10000,
    },
    CA: {
      name: 'California',
      type: 'progressive',
      deduction: 5363,
      brackets: [
        { limit: 10412, rate: 0.01 },
        { limit: 24684, rate: 0.02 },
        { limit: 38959, rate: 0.04 },
        { limit: 54081, rate: 0.06 },
        { limit: 68350, rate: 0.08 },
        { limit: 349137, rate: 0.093 },
        { limit: 418961, rate: 0.103 },
        { limit: 698271, rate: 0.113 },
        { limit: 1000000, rate: 0.123 },
        { limit: Infinity, rate: 0.133 },
      ],
    },
    NY: {
      name: 'New York',
      type: 'progressive',
      deduction: 8000,
      brackets: [
        { limit: 8500, rate: 0.04 },
        { limit: 11700, rate: 0.045 },
        { limit: 13900, rate: 0.0525 },
        { limit: 80650, rate: 0.055 },
        { limit: 215400, rate: 0.06 },
        { limit: 1077550, rate: 0.0685 },
        { limit: 5000000, rate: 0.0965 },
        { limit: Infinity, rate: 0.109 },
      ],
    },
    TX: {
      name: 'Texas (0%)',
      type: 'none',
      rate: 0,
      deduction: 0,
    },
    FL: {
      name: 'Florida (0%)',
      type: 'none',
      rate: 0,
      deduction: 0,
    },
    WA: {
      name: 'Washington (0%)',
      type: 'none',
      rate: 0,
      deduction: 0,
    },
    IL: {
      name: 'Illinois (4.95%)',
      type: 'flat',
      rate: 0.0495,
      deduction: 2775,
    },
    NC: {
      name: 'North Carolina (4.5%)',
      type: 'flat',
      rate: 0.045,
      deduction: 12750,
    },
  };

  // State Management
  const state = {
    mode: 'equivalent', // 'equivalent' or 'comparison'
    w2Salary: 120000,
    w2HealthSubsidy: 550, // $/month
    w2MatchPercent: 4.0, // %
    w2VacationDays: 15,
    w2Holidays: 10,
    cWeeklyBillable: 28,
    cWeeklyUnbillable: 12,
    cOverheadAnnual: 6000,
    cHealthCostMonthly: 650, // $/month
    stateCode: 'generic',
    qbiEnabled: true,
    cDirectHourlyRate: 95, // only in comparison mode
    cDirectHoursBasis: 'billable', // 'billable' or 'custom'
  };

  let chartInstance = null;

  // --- Mathematical & Tax Core ---

  /**
   * Compute progressive tax across brackets
   */
  function computeProgressiveTax(taxableIncome, brackets) {
    if (taxableIncome <= 0) return 0;
    let tax = 0;
    let prevLimit = 0;
    for (let i = 0; i < brackets.length; i++) {
      const b = brackets[i];
      if (taxableIncome > prevLimit) {
        const chunk = Math.min(taxableIncome, b.limit) - prevLimit;
        tax += chunk * b.rate;
        prevLimit = b.limit;
      } else {
        break;
      }
    }
    return Math.max(0, tax);
  }

  /**
   * Federal Income Tax for Single Filer
   */
  function calcFederalIncomeTax(taxableIncome) {
    return computeProgressiveTax(taxableIncome, FEDERAL_BRACKETS_SINGLE);
  }

  /**
   * State Income Tax calculation
   */
  function calcStateTax(agi, stateCode) {
    const config = STATE_TAX_CONFIGS[stateCode] || STATE_TAX_CONFIGS.generic;
    if (config.type === 'none') return 0;
    const taxable = Math.max(0, agi - config.deduction);
    if (config.type === 'flat') {
      return taxable * config.rate;
    }
    if (config.type === 'progressive') {
      return computeProgressiveTax(taxable, config.brackets);
    }
    return 0;
  }

  /**
   * Calculate W-2 compensation package and tax deductions
   */
  function calculateW2(salary, healthSubsidyMonthly, matchPercent, vacationDays, holidays, stateCode) {
    // FICA
    const ssTax = TAX_CONSTANTS.W2_SS_RATE * Math.min(salary, TAX_CONSTANTS.SS_WAGE_CAP);
    const medTax = TAX_CONSTANTS.W2_MEDICARE_RATE * salary;
    const addlMedTax = TAX_CONSTANTS.ADDITIONAL_MEDICARE_RATE * Math.max(0, salary - TAX_CONSTANTS.ADDITIONAL_MEDICARE_THRESHOLD);
    const ficaTotal = ssTax + medTax + addlMedTax;

    // Federal Taxable
    const fedTaxable = Math.max(0, salary - TAX_CONSTANTS.STANDARD_DEDUCTION_SINGLE);
    const fedTax = calcFederalIncomeTax(fedTaxable);

    // State Taxable
    const stateTax = calcStateTax(salary, stateCode);

    // Net Spendable Take-Home
    const totalTaxes = ficaTotal + fedTax + stateTax;
    const netSpendable = salary - totalTaxes;

    // Fringe Benefits Value
    const annualHealthSubsidy = healthSubsidyMonthly * 12;
    const annual401kMatch = salary * (matchPercent / 100);
    const totalPtoDays = vacationDays + holidays;
    const ptoMonetaryValue = (salary / 260) * totalPtoDays; // 260 working weekdays/yr
    const totalEconomicPackage = netSpendable + annualHealthSubsidy + annual401kMatch;

    return {
      salary,
      ssTax,
      medTax,
      addlMedTax,
      ficaTotal,
      fedTaxable,
      fedTax,
      stateTax,
      totalTaxes,
      netSpendable,
      annualHealthSubsidy,
      annual401kMatch,
      totalPtoDays,
      ptoMonetaryValue,
      totalEconomicPackage,
      effectiveTaxRate: salary > 0 ? (totalTaxes / salary) * 100 : 0,
    };
  }

  /**
   * Calculate 1099 Independent Contractor tax and cash flow for any given gross revenue
   */
  function calculate1099(grossRevenue, overheadAnnual, healthCostMonthly, qbiEnabled, stateCode) {
    const netProfit = Math.max(0, grossRevenue - overheadAnnual);

    // SECA Base: 92.35% of Schedule C Net Profit
    const secaBase = netProfit * TAX_CONSTANTS.SECA_NET_FACTOR;

    // SECA Taxes (15.3% + 0.9% addl Medicare over $200k)
    const secaSS = TAX_CONSTANTS.SECA_SS_RATE * Math.min(secaBase, TAX_CONSTANTS.SS_WAGE_CAP);
    const secaMed = TAX_CONSTANTS.SECA_MEDICARE_RATE * secaBase;
    const secaAddlMed = TAX_CONSTANTS.ADDITIONAL_MEDICARE_RATE * Math.max(0, secaBase - TAX_CONSTANTS.ADDITIONAL_MEDICARE_THRESHOLD);
    const totalSECA = secaSS + secaMed + secaAddlMed;

    // Deductible one-half of SECA tax on Schedule 1 Line 15
    const halfSECA = 0.5 * (secaSS + secaMed);

    // Self-Employed Health Insurance Deduction (Schedule 1 Line 17)
    const annualHealth = healthCostMonthly * 12;
    const healthDeduction = Math.min(annualHealth, Math.max(0, netProfit - halfSECA));

    // AGI
    const agi = Math.max(0, netProfit - halfSECA - healthDeduction);

    // Section 199A QBI Deduction
    let qbiDeduction = 0;
    if (qbiEnabled && netProfit > 0) {
      const qbiBase = Math.max(0, netProfit - halfSECA - healthDeduction);
      const preliminaryQBI = qbiBase * TAX_CONSTANTS.QBI_RATE;

      // Taxable income before QBI
      const taxableBeforeQBI = Math.max(0, agi - TAX_CONSTANTS.STANDARD_DEDUCTION_SINGLE);

      if (taxableBeforeQBI <= TAX_CONSTANTS.QBI_SSTB_PHASEOUT_START) {
        qbiDeduction = Math.min(preliminaryQBI, taxableBeforeQBI * TAX_CONSTANTS.QBI_RATE);
      } else if (taxableBeforeQBI >= TAX_CONSTANTS.QBI_SSTB_PHASEOUT_END) {
        qbiDeduction = 0; // SSTB threshold cap
      } else {
        // Phase-out zone
        const phaseRange = TAX_CONSTANTS.QBI_SSTB_PHASEOUT_END - TAX_CONSTANTS.QBI_SSTB_PHASEOUT_START;
        const reductionRatio = (taxableBeforeQBI - TAX_CONSTANTS.QBI_SSTB_PHASEOUT_START) / phaseRange;
        const phasedDeduction = preliminaryQBI * (1 - reductionRatio);
        qbiDeduction = Math.max(0, Math.min(phasedDeduction, taxableBeforeQBI * TAX_CONSTANTS.QBI_RATE));
      }
    }

    // Federal Taxable Income
    const fedTaxable = Math.max(0, agi - TAX_CONSTANTS.STANDARD_DEDUCTION_SINGLE - qbiDeduction);
    const fedTax = calcFederalIncomeTax(fedTaxable);

    // State Tax
    const stateTax = calcStateTax(agi, stateCode);

    // Total Taxes & Cash Flow
    const totalTaxes = totalSECA + fedTax + stateTax;
    const totalBusinessCosts = overheadAnnual + annualHealth;
    const netSpendable = grossRevenue - totalBusinessCosts - totalTaxes;

    // Form 1040-ES Quarterly Tax Reserve
    const quarterlyTax = totalTaxes / 4;
    const suggestedReservePct = grossRevenue > 0 ? (totalTaxes / grossRevenue) * 100 : 0;

    return {
      grossRevenue,
      netProfit,
      secaBase,
      secaSS,
      secaMed,
      secaAddlMed,
      totalSECA,
      halfSECA,
      annualHealth,
      healthDeduction,
      agi,
      qbiDeduction,
      fedTaxable,
      fedTax,
      stateTax,
      totalTaxes,
      totalBusinessCosts,
      netSpendable,
      quarterlyTax,
      suggestedReservePct,
      effectiveTaxRate: grossRevenue > 0 ? (totalTaxes / grossRevenue) * 100 : 0,
    };
  }

  /**
   * Compute Annual Billable Hours given vacation days, holidays, and weekly billable hours
   */
  function calcAnnualCapacity(vacationDays, holidays, weeklyBillable, weeklyUnbillable) {
    const totalPtoDays = vacationDays + holidays;
    const weeksOff = totalPtoDays / 5;
    const billableWeeks = Math.max(1, 52 - weeksOff);
    const annualBillableHours = billableWeeks * weeklyBillable;
    const annualUnbillableHours = billableWeeks * weeklyUnbillable;
    const totalHoursWorked = annualBillableHours + annualUnbillableHours;
    return {
      weeksOff,
      billableWeeks,
      annualBillableHours,
      annualUnbillableHours,
      totalHoursWorked,
    };
  }

  /**
   * High-precision Binary Search Solver to find 1099 Gross Revenue that matches W-2 Economic Standard
   */
  function solveEquivalentGross(targetNetSpendable, overheadAnnual, healthCostMonthly, qbiEnabled, stateCode) {
    let low = 0;
    let high = 1500000;
    let bestGross = low;

    // 40 bisection steps achieves < $0.01 precision
    for (let i = 0; i < 40; i++) {
      const mid = (low + high) / 2;
      const res = calculate1099(mid, overheadAnnual, healthCostMonthly, qbiEnabled, stateCode);
      if (res.netSpendable < targetNetSpendable) {
        low = mid;
      } else {
        high = mid;
        bestGross = mid;
      }
    }
    return bestGross;
  }

  // --- UI Formatting Helpers ---
  function formatCurrency(val, decimals = 0) {
    if (isNaN(val) || !isFinite(val)) return '$0';
    return '$' + Math.round(val).toLocaleString('en-US');
  }

  function formatRate(val) {
    if (isNaN(val) || !isFinite(val)) return '$0.00';
    return '$' + Number(val).toFixed(2);
  }

  function formatPercent(val) {
    if (isNaN(val) || !isFinite(val)) return '0.0%';
    return Number(val).toFixed(1) + '%';
  }

  // --- Core Recalculate & Render Pipeline ---
  function recalculate() {
    const capacity = calcAnnualCapacity(
      state.w2VacationDays,
      state.w2Holidays,
      state.cWeeklyBillable,
      state.cWeeklyUnbillable
    );

    const w2Result = calculateW2(
      state.w2Salary,
      state.w2HealthSubsidy,
      state.w2MatchPercent,
      state.w2VacationDays,
      state.w2Holidays,
      state.stateCode
    );

    // Target 1099 Net Cash to match W-2 purchasing power:
    // W-2 Net Spendable + lost 401(k) match
    const targetNetCash = w2Result.netSpendable + w2Result.annual401kMatch;

    let cResult = null;
    let equivalentGross = 0;
    let equivalentHourlyRate = 0;

    if (state.mode === 'equivalent') {
      equivalentGross = solveEquivalentGross(
        targetNetCash,
        state.cOverheadAnnual,
        state.cHealthCostMonthly,
        state.qbiEnabled,
        state.stateCode
      );
      equivalentHourlyRate = capacity.annualBillableHours > 0 ? equivalentGross / capacity.annualBillableHours : 0;
      cResult = calculate1099(
        equivalentGross,
        state.cOverheadAnnual,
        state.cHealthCostMonthly,
        state.qbiEnabled,
        state.stateCode
      );
    } else {
      // Comparison Mode: User sets explicit 1099 rate
      const directGross = state.cDirectHourlyRate * capacity.annualBillableHours;
      cResult = calculate1099(
        directGross,
        state.cOverheadAnnual,
        state.cHealthCostMonthly,
        state.qbiEnabled,
        state.stateCode
      );
      equivalentGross = directGross;
      equivalentHourlyRate = state.cDirectHourlyRate;
    }

    renderHeadline(equivalentHourlyRate, equivalentGross, capacity, w2Result, cResult);
    renderComparisonTable(w2Result, cResult, capacity);
    renderQuarterlyCard(cResult);
    renderChart(w2Result, cResult);
    renderPitch(w2Result, cResult, equivalentHourlyRate, equivalentGross, capacity);
  }

  // --- Render Functions ---

  function renderHeadline(rate, gross, capacity, w2, c1099) {
    const elRate = document.getElementById('outputEquivalentHourlyRate');
    const elGross = document.getElementById('outputEquivalentAnnualGross');
    const elHoursSub = document.getElementById('outputBillableHoursContext');
    const elDiffBadge = document.getElementById('outputDiffBadge');
    const elModeTag = document.getElementById('outputModeSubtitle');

    if (elRate) elRate.textContent = formatRate(rate) + '/hr';
    if (elGross) elGross.textContent = formatCurrency(gross) + ' / yr';
    if (elHoursSub) {
      elHoursSub.textContent = `Based on ${Math.round(capacity.annualBillableHours).toLocaleString()} billable hrs/yr (${capacity.billableWeeks.toFixed(1)} active weeks × ${state.cWeeklyBillable} hrs/wk).`;
    }

    // Trigger subtle value pulse
    [elRate, elGross].forEach(el => {
      if (!el) return;
      el.classList.remove('value-updated');
      void el.offsetWidth; // trigger reflow
      el.classList.add('value-updated');
    });

    if (state.mode === 'equivalent') {
      if (elModeTag) elModeTag.textContent = 'Required 1099 compensation to match your W-2 standard of living:';
      if (elDiffBadge) {
        const rateMultiplier = (gross / (w2.salary || 1)).toFixed(2);
        elDiffBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
        elDiffBadge.innerHTML = `<span>⚖️ Break-Even Multiplier: <strong>${rateMultiplier}x</strong> of W-2 Base Salary</span>`;
      }
    } else {
      if (elModeTag) elModeTag.textContent = 'Head-to-head cash flow variance between W-2 and 1099 offer:';
      if (elDiffBadge) {
        const delta = c1099.netSpendable - (w2.netSpendable + w2.annual401kMatch);
        if (delta >= 0) {
          elDiffBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800';
          elDiffBadge.innerHTML = `<span>🚀 1099 Advantage: <strong>+${formatCurrency(delta)}/yr</strong> net purchasing power</span>`;
        } else {
          elDiffBadge.className = 'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800';
          elDiffBadge.innerHTML = `<span>⚠️ W-2 Advantage: <strong>+${formatCurrency(Math.abs(delta))}/yr</strong> (1099 rate undercompensates benefits/tax)</span>`;
        }
      }
    }
  }

  function renderComparisonTable(w2, c1099, capacity) {
    const rows = [
      { id: 'tbGross', w2: formatCurrency(w2.salary), c: formatCurrency(c1099.grossRevenue), delta: c1099.grossRevenue - w2.salary, sign: '+' },
      { id: 'tbFicaSeca', w2: '-' + formatCurrency(w2.ficaTotal), c: '-' + formatCurrency(c1099.totalSECA), delta: -(c1099.totalSECA - w2.ficaTotal), isExpense: true },
      { id: 'tbFedTax', w2: '-' + formatCurrency(w2.fedTax), c: '-' + formatCurrency(c1099.fedTax), delta: -(c1099.fedTax - w2.fedTax), isExpense: true },
      { id: 'tbStateTax', w2: '-' + formatCurrency(w2.stateTax), c: '-' + formatCurrency(c1099.stateTax), delta: -(c1099.stateTax - w2.stateTax), isExpense: true },
      { id: 'tbOverhead', w2: '$0 (Company Paid)', c: '-' + formatCurrency(state.cOverheadAnnual), delta: -state.cOverheadAnnual, isExpense: true },
      { id: 'tbHealth', w2: `+${formatCurrency(w2.annualHealthSubsidy)} (Employer)`, c: '-' + formatCurrency(c1099.annualHealth), delta: -(c1099.annualHealth + w2.annualHealthSubsidy), isExpense: true },
      { id: 'tbMatch', w2: `+${formatCurrency(w2.annual401kMatch)} (${state.w2MatchPercent}%)`, c: '$0 (Self-Funded)', delta: -w2.annual401kMatch, isExpense: true },
      { id: 'tbNetCash', w2: formatCurrency(w2.netSpendable), c: formatCurrency(c1099.netSpendable), delta: c1099.netSpendable - w2.netSpendable, highlight: true },
      { id: 'tbEffectiveTax', w2: formatPercent(w2.effectiveTaxRate), c: formatPercent(c1099.effectiveTaxRate), deltaText: formatPercent(c1099.effectiveTaxRate - w2.effectiveTaxRate) },
    ];

    rows.forEach(r => {
      const cellW2 = document.getElementById(r.id + 'W2');
      const cellC = document.getElementById(r.id + '1099');
      const cellDelta = document.getElementById(r.id + 'Delta');

      if (cellW2) cellW2.textContent = r.w2;
      if (cellC) cellC.textContent = r.c;
      if (cellDelta) {
        if (r.deltaText) {
          cellDelta.textContent = r.deltaText;
        } else if (r.delta !== undefined) {
          const isPos = r.delta >= 0;
          cellDelta.textContent = (isPos ? '+' : '') + formatCurrency(r.delta);
          cellDelta.className = isPos
            ? 'font-mono text-emerald-600 dark:text-emerald-400 font-bold'
            : 'font-mono text-amber-600 dark:text-amber-400 font-bold';
        }
      }
    });

    // QBI Badge in Table
    const elQbiNote = document.getElementById('tbQbiNote');
    if (elQbiNote) {
      if (state.qbiEnabled && c1099.qbiDeduction > 0) {
        elQbiNote.textContent = `(Includes §199A QBI deduction of -${formatCurrency(c1099.qbiDeduction)} off taxable income)`;
        elQbiNote.classList.remove('hidden');
      } else {
        elQbiNote.classList.add('hidden');
      }
    }
  }

  function renderQuarterlyCard(c1099) {
    const elQPayment = document.getElementById('outputQuarterlyPayment');
    const elAnnualTax = document.getElementById('outputAnnualTaxReserve');
    const elReservePct = document.getElementById('outputReservePct');

    if (elQPayment) elQPayment.textContent = formatCurrency(c1099.quarterlyTax);
    if (elAnnualTax) elAnnualTax.textContent = formatCurrency(c1099.totalTaxes);
    if (elReservePct) elReservePct.textContent = formatPercent(c1099.suggestedReservePct);
  }

  // --- Chart.js Waterfall / Stacked Comparison Chart ---
  function renderChart(w2, c1099) {
    const canvas = document.getElementById('taxWaterfallChart');
    if (!canvas || typeof Chart === 'undefined') return;

    const isDark = document.documentElement.classList.contains('dark');
    const textColor = isDark ? '#cbd5e1' : '#475569';
    const gridColor = isDark ? 'rgba(51, 65, 85, 0.4)' : 'rgba(226, 232, 240, 0.8)';

    const data = {
      labels: ['W-2 Employee Package', '1099 Independent Contractor'],
      datasets: [
        {
          label: 'Net Spendable Cash',
          data: [Math.max(0, w2.netSpendable), Math.max(0, c1099.netSpendable)],
          backgroundColor: isDark ? '#34d399' : '#059669',
          borderRadius: 6,
        },
        {
          label: 'FICA / SECA Payroll Tax',
          data: [w2.ficaTotal, c1099.totalSECA],
          backgroundColor: isDark ? '#fbbf24' : '#d97706',
          borderRadius: 6,
        },
        {
          label: 'Income Taxes (Fed + State)',
          data: [w2.fedTax + w2.stateTax, c1099.fedTax + c1099.stateTax],
          backgroundColor: isDark ? '#60a5fa' : '#2563eb',
          borderRadius: 6,
        },
        {
          label: 'Overhead & Healthcare',
          data: [0, state.cOverheadAnnual + c1099.annualHealth],
          backgroundColor: isDark ? '#94a3b8' : '#64748b',
          borderRadius: 6,
        },
        {
          label: 'Employer Benefits Subsidy (401k+Health)',
          data: [w2.annualHealthSubsidy + w2.annual401kMatch, 0],
          backgroundColor: isDark ? '#a78bfa' : '#7c3aed',
          borderRadius: 6,
        },
      ],
    };

    if (chartInstance) {
      chartInstance.data = data;
      chartInstance.options.scales.x.ticks.color = textColor;
      chartInstance.options.scales.y.ticks.color = textColor;
      chartInstance.options.scales.y.grid.color = gridColor;
      chartInstance.options.scales.x.grid.color = gridColor;
      chartInstance.options.plugins.legend.labels.color = textColor;
      chartInstance.update();
      return;
    }

    const ctx = canvas.getContext('2d');
    chartInstance = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: gridColor },
            ticks: { color: textColor, font: { family: '"Plus Jakarta Sans", sans-serif', weight: 'bold', size: 12 } },
          },
          y: {
            stacked: true,
            grid: { color: gridColor },
            ticks: {
              color: textColor,
              font: { family: '"Plus Jakarta Sans", sans-serif', size: 11 },
              callback: val => '$' + (val / 1000).toLocaleString() + 'k',
            },
          },
        },
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: textColor,
              font: { family: '"Plus Jakarta Sans", sans-serif', size: 11, weight: '500' },
              boxWidth: 12,
              padding: 15,
            },
          },
          tooltip: {
            callbacks: {
              label: ctx => ` ${ctx.dataset.label}: ${formatCurrency(ctx.raw)}`,
            },
          },
        },
      },
    });
  }

  // --- Rate Justification Pitch Generator ---
  function renderPitch(w2, c1099, rate, gross, capacity) {
    const textarea = document.getElementById('pitchSnippetText');
    if (!textarea) return;

    const formattedRate = formatRate(rate);
    const formattedGross = formatCurrency(gross);
    const formattedSalary = formatCurrency(state.w2Salary);
    const formattedOverhead = formatCurrency(state.cOverheadAnnual);
    const formattedHealth = formatCurrency(c1099.annualHealth);

    const pitchText = `Subject: Rate Structure & Consulting Engagement Proposal

Hi [Client/Hiring Manager Name],

Thank you for discussing the opportunity with your team. Regarding compensation structure for this engagement:

For an independent 1099 contractor arrangement, my professional billable rate is ${formattedRate}/hr (targeting an annualized contract gross of ${formattedGross}).

To provide full transparency on how this aligns with an equivalent W-2 salary of ${formattedSalary}:

1. Self-Employment Tax (SECA): As a 1099 contractor, I absorb the full 15.3% Social Security & Medicare tax burden (${formatCurrency(c1099.totalSECA)}/yr), replacing the 7.65% employer payroll tax match your company would otherwise pay.
2. Self-Funded Healthcare & Retirement: I self-fund 100% of my comprehensive private health coverage (${formattedHealth}/yr) and retirement contributions with zero employer match or administrative overhead for your HR department.
3. Equipment, Tooling & Insurance: I supply all dedicated commercial workstations, licensed engineering software, home office infrastructure, and professional liability coverage (${formattedOverhead}/yr).
4. Realistic Delivery Capacity: Based on ${capacity.billableWeeks.toFixed(0)} productive delivery weeks and ${state.cWeeklyBillable} billable hours/week, this rate accounts for the administrative and project coordination hours required to execute high-impact work.

From a company standpoint, this 1099 agreement eliminates:
• Fringe benefit liabilities and healthcare enrollment costs
• Employer payroll tax matching (7.65% W-2 FICA savings)
• Severance risk and unemployment insurance obligations
• Long-term headcount commitments

I am prepared to start immediately under this scope. Please let me know if you would like me to transmit our standard Statement of Work (SOW).

Best regards,
[Your Name]
[Your Title / Portfolio URL]`;

    textarea.value = pitchText;
  }

  // --- Toast Notification System ---
  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const toastMsg = document.getElementById('toastMessage');
    if (!toast || !toastMsg) return;

    toastMsg.textContent = message;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  // --- URL State Serialization & Loading ---
  function serializeStateToUrl() {
    const params = new URLSearchParams();
    params.set('mode', state.mode);
    params.set('salary', state.w2Salary);
    params.set('w2health', state.w2HealthSubsidy);
    params.set('match', state.w2MatchPercent);
    params.set('vacation', state.w2VacationDays);
    params.set('holidays', state.w2Holidays);
    params.set('billable', state.cWeeklyBillable);
    params.set('unbillable', state.cWeeklyUnbillable);
    params.set('overhead', state.cOverheadAnnual);
    params.set('chealth', state.cHealthCostMonthly);
    params.set('state', state.stateCode);
    params.set('qbi', state.qbiEnabled ? '1' : '0');
    if (state.mode === 'comparison') {
      params.set('rate', state.cDirectHourlyRate);
    }
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function loadStateFromUrl() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('mode')) state.mode = params.get('mode') === 'comparison' ? 'comparison' : 'equivalent';
    if (params.has('salary')) state.w2Salary = parseFloat(params.get('salary')) || state.w2Salary;
    if (params.has('w2health')) state.w2HealthSubsidy = parseFloat(params.get('w2health')) || state.w2HealthSubsidy;
    if (params.has('match')) state.w2MatchPercent = parseFloat(params.get('match')) || state.w2MatchPercent;
    if (params.has('vacation')) state.w2VacationDays = parseInt(params.get('vacation'), 10) || state.w2VacationDays;
    if (params.has('holidays')) state.w2Holidays = parseInt(params.get('holidays'), 10) || state.w2Holidays;
    if (params.has('billable')) state.cWeeklyBillable = parseFloat(params.get('billable')) || state.cWeeklyBillable;
    if (params.has('unbillable')) state.cWeeklyUnbillable = parseFloat(params.get('unbillable')) || state.cWeeklyUnbillable;
    if (params.has('overhead')) state.cOverheadAnnual = parseFloat(params.get('overhead')) || state.cOverheadAnnual;
    if (params.has('chealth')) state.cHealthCostMonthly = parseFloat(params.get('chealth')) || state.cHealthCostMonthly;
    if (params.has('state')) state.stateCode = params.get('state') || state.stateCode;
    if (params.has('qbi')) state.qbiEnabled = params.get('qbi') === '1';
    if (params.has('rate')) state.cDirectHourlyRate = parseFloat(params.get('rate')) || state.cDirectHourlyRate;
  }

  // --- Input Sync & Event Binding ---
  function syncPair(numberInputId, rangeInputId, stateKey, parser = parseFloat) {
    const numEl = document.getElementById(numberInputId);
    const rangeEl = document.getElementById(rangeInputId);

    if (!numEl && !rangeEl) return;

    if (numEl) numEl.value = state[stateKey];
    if (rangeEl) rangeEl.value = state[stateKey];

    const handler = (e) => {
      const val = parser(e.target.value);
      if (!isNaN(val)) {
        state[stateKey] = val;
        if (numEl && e.target !== numEl) numEl.value = val;
        if (rangeEl && e.target !== rangeEl) rangeEl.value = val;
        recalculate();
      }
    };

    if (numEl) numEl.addEventListener('input', handler);
    if (rangeEl) rangeEl.addEventListener('input', handler);
  }

  function setupInputs() {
    // Mode switcher buttons
    const btnModeEquiv = document.getElementById('btnModeEquivalent');
    const btnModeCompare = document.getElementById('btnModeComparison');
    const comparisonRatePanel = document.getElementById('comparisonRatePanel');

    function updateModeUI() {
      if (state.mode === 'equivalent') {
        btnModeEquiv?.classList.add('bg-emerald-600', 'text-white', 'shadow-xs');
        btnModeEquiv?.classList.remove('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
        btnModeCompare?.classList.remove('bg-emerald-600', 'text-white', 'shadow-xs');
        btnModeCompare?.classList.add('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
        comparisonRatePanel?.classList.add('hidden');
      } else {
        btnModeCompare?.classList.add('bg-emerald-600', 'text-white', 'shadow-xs');
        btnModeCompare?.classList.remove('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
        btnModeEquiv?.classList.remove('bg-emerald-600', 'text-white', 'shadow-xs');
        btnModeEquiv?.classList.add('bg-transparent', 'text-slate-600', 'dark:text-slate-300');
        comparisonRatePanel?.classList.remove('hidden');
      }
      recalculate();
    }

    if (btnModeEquiv) {
      btnModeEquiv.addEventListener('click', () => {
        state.mode = 'equivalent';
        updateModeUI();
      });
    }

    if (btnModeCompare) {
      btnModeCompare.addEventListener('click', () => {
        state.mode = 'comparison';
        updateModeUI();
      });
    }

    // Synchronize Form Pairs
    syncPair('inputW2Salary', 'rangeW2Salary', 'w2Salary', parseFloat);
    syncPair('inputW2HealthSubsidy', 'rangeW2HealthSubsidy', 'w2HealthSubsidy', parseFloat);
    syncPair('inputW2MatchPercent', 'rangeW2MatchPercent', 'w2MatchPercent', parseFloat);
    syncPair('inputW2VacationDays', 'rangeW2VacationDays', 'w2VacationDays', parseInt);
    syncPair('inputW2Holidays', 'rangeW2Holidays', 'w2Holidays', parseInt);

    syncPair('inputWeeklyBillable', 'rangeWeeklyBillable', 'cWeeklyBillable', parseFloat);
    syncPair('inputWeeklyUnbillable', 'rangeWeeklyUnbillable', 'cWeeklyUnbillable', parseFloat);
    syncPair('inputOverheadAnnual', 'rangeOverheadAnnual', 'cOverheadAnnual', parseFloat);
    syncPair('inputHealthCostMonthly', 'rangeHealthCostMonthly', 'cHealthCostMonthly', parseFloat);

    // Direct comparison rate pair
    syncPair('inputDirectHourlyRate', 'rangeDirectHourlyRate', 'cDirectHourlyRate', parseFloat);

    // State Selector
    const stateSelect = document.getElementById('selectStateTax');
    if (stateSelect) {
      stateSelect.value = state.stateCode;
      stateSelect.addEventListener('change', (e) => {
        state.stateCode = e.target.value;
        recalculate();
      });
    }

    // Section 199A QBI Checkbox
    const qbiCheckbox = document.getElementById('toggleQBI');
    if (qbiCheckbox) {
      qbiCheckbox.checked = state.qbiEnabled;
      qbiCheckbox.addEventListener('change', (e) => {
        state.qbiEnabled = e.target.checked;
        recalculate();
      });
    }

    // Pitch Modal and Copy Pitch Button
    const btnOpenPitch = document.getElementById('btnOpenPitch');
    const pitchModal = document.getElementById('pitchModal');
    const btnClosePitch = document.querySelectorAll('.pitch-modal-close');
    const btnCopyPitch = document.getElementById('btnCopyPitch');

    if (btnOpenPitch && pitchModal) {
      btnOpenPitch.addEventListener('click', () => {
        pitchModal.classList.remove('hidden');
        pitchModal.classList.add('flex');
      });
    }

    btnClosePitch.forEach(btn => {
      btn.addEventListener('click', () => {
        pitchModal?.classList.add('hidden');
        pitchModal?.classList.remove('flex');
      });
    });

    if (btnCopyPitch) {
      btnCopyPitch.addEventListener('click', () => {
        const textarea = document.getElementById('pitchSnippetText');
        if (textarea) {
          navigator.clipboard.writeText(textarea.value).then(() => {
            showToast('Negotiation pitch copied to clipboard!');
          }).catch(() => {
            textarea.select();
            document.execCommand('copy');
            showToast('Negotiation pitch copied to clipboard!');
          });
        }
      });
    }

    // Share Calculation Button
    const btnShare = document.getElementById('btnShareCalc');
    if (btnShare) {
      btnShare.addEventListener('click', () => {
        const shareUrl = serializeStateToUrl();
        navigator.clipboard.writeText(shareUrl).then(() => {
          showToast('Share link copied to clipboard!');
        }).catch(() => {
          showToast('URL updated with your calculation parameters.');
        });
        window.history.replaceState(null, '', shareUrl);
      });
    }

    // Reset Defaults Button
    const btnReset = document.getElementById('btnResetCalc');
    if (btnReset) {
      btnReset.addEventListener('click', () => {
        state.mode = 'equivalent';
        state.w2Salary = 120000;
        state.w2HealthSubsidy = 550;
        state.w2MatchPercent = 4.0;
        state.w2VacationDays = 15;
        state.w2Holidays = 10;
        state.cWeeklyBillable = 28;
        state.cWeeklyUnbillable = 12;
        state.cOverheadAnnual = 6000;
        state.cHealthCostMonthly = 650;
        state.stateCode = 'generic';
        state.qbiEnabled = true;
        state.cDirectHourlyRate = 95;

        // Sync back into form
        setupInputs();
        updateModeUI();
        showToast('Calculator reset to default benchmarks.');
      });
    }

    // Embed Widget Modal
    const btnOpenEmbed = document.getElementById('btnOpenEmbed');
    const embedModal = document.getElementById('embedModal');
    const btnCloseEmbed = document.querySelectorAll('.embed-modal-close');
    const btnCopyEmbed = document.getElementById('btnCopyEmbed');
    const embedSnippet = document.getElementById('embedSnippet');

    if (embedSnippet) {
      embedSnippet.value = `<iframe src="https://pocketruler.app/w2-1099-calculator/" width="100%" height="850" frameborder="0" style="border-radius:16px;border:1px solid #e2e8f0;"></iframe>`;
    }

    if (btnOpenEmbed && embedModal) {
      btnOpenEmbed.addEventListener('click', () => {
        embedModal.classList.remove('hidden');
        embedModal.classList.add('flex');
      });
    }

    btnCloseEmbed.forEach(btn => {
      btn.addEventListener('click', () => {
        embedModal?.classList.add('hidden');
        embedModal?.classList.remove('flex');
      });
    });

    if (btnCopyEmbed && embedSnippet) {
      btnCopyEmbed.addEventListener('click', () => {
        navigator.clipboard.writeText(embedSnippet.value).then(() => {
          showToast('Embed code copied to clipboard!');
        });
      });
    }

    updateModeUI();
  }

  // --- Theme Change Listener ---
  window.addEventListener('themechange', () => {
    if (chartInstance) {
      chartInstance.destroy();
      chartInstance = null;
      recalculate();
    }
  });

  // --- Initialization ---
  function init() {
    loadStateFromUrl();
    setupInputs();
    recalculate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
