/**
 * RelocateTrue - Main Application Controller & Reactive UI
 * Connects CITIES_DATA (85+ global cities), Calculator Engine, DOM events,
 * Searchable autocomplete filters, and Universal Custom City Creator.
 */

// Application State
const appState = {
  grossIncome: 95000,
  originCityId: 'new-york',
  destCityId: 'lisbon',
  housingPreference: 'center', // 'center' | 'outside' | 'coliving'
  lifestyleLevel: 'moderate',  // 'frugal' | 'moderate' | 'luxury'
  originSearchTerm: '',
  destSearchTerm: '',
  targetModalRole: 'destination' // 'origin' | 'destination'
};

// Preset configurations for one-click comparisons
const PRESETS = [
  { label: 'NYC ➔ Lisbon', origin: 'new-york', dest: 'lisbon', income: 105000 },
  { label: 'SF ➔ Bali', origin: 'san-francisco', dest: 'bali', income: 125000 },
  { label: 'London ➔ Dubai', origin: 'london', dest: 'dubai', income: 110000 },
  { label: 'Austin ➔ Mexico City', origin: 'austin', dest: 'mexico-city', income: 90000 },
  { label: 'Berlin ➔ Bansko', origin: 'berlin', dest: 'bansko', income: 75000 },
  { label: 'Tokyo ➔ Chiang Mai', origin: 'tokyo', dest: 'chiang-mai', income: 85000 }
];

document.addEventListener('DOMContentLoaded', () => {
  initApp();
});

/**
 * Initializes the web application.
 */
function initApp() {
  readUrlParams();
  populateCityDropdowns();
  populatePresets();
  setupEventListeners();
  updateCalculations();
}

/**
 * Parses URL query params to restore saved state or shared links.
 */
function readUrlParams() {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.has('gross')) {
      const g = parseInt(params.get('gross'), 10);
      if (!isNaN(g) && g >= 20000 && g <= 500000) appState.grossIncome = g;
    }
    if (params.has('origin') && CITIES_DATA.some(c => c.id === params.get('origin'))) {
      appState.originCityId = params.get('origin');
    }
    if (params.has('dest') && CITIES_DATA.some(c => c.id === params.get('dest'))) {
      appState.destCityId = params.get('dest');
    }
    if (params.has('housing') && ['center', 'outside', 'coliving'].includes(params.get('housing'))) {
      appState.housingPreference = params.get('housing');
    }
    if (params.has('lifestyle') && ['frugal', 'moderate', 'luxury'].includes(params.get('lifestyle'))) {
      appState.lifestyleLevel = params.get('lifestyle');
    }
  } catch (e) {
    console.warn('Could not parse query parameters:', e);
  }
}

/**
 * Updates URL search params to enable instant link sharing without reload.
 */
function syncUrlParams() {
  try {
    const params = new URLSearchParams();
    params.set('gross', appState.grossIncome);
    params.set('origin', appState.originCityId);
    params.set('dest', appState.destCityId);
    params.set('housing', appState.housingPreference);
    params.set('lifestyle', appState.lifestyleLevel);

    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  } catch (e) {
    // Graceful fallback in sandboxed environments
  }
}

/**
 * Populates Origin and Destination select elements grouped by Continent,
 * with search-filtering and Custom City trigger.
 */
function populateCityDropdowns() {
  const originSelect = document.getElementById('origin-city-select');
  const destSelect = document.getElementById('dest-city-select');
  if (!originSelect || !destSelect) return;

  const continents = ['North America', 'Europe', 'Asia-Pacific', 'Latin America', 'Middle East & Africa'];
  
  function buildOptionsHtml(selectedId, filterTerm = '') {
    const query = filterTerm.trim().toLowerCase();
    let html = `<option value="ADD_CUSTOM_CITY" class="font-bold text-blue-600 bg-blue-50">+ Add Any Custom City on Earth...</option>`;

    continents.forEach(continent => {
      const citiesInContinent = CITIES_DATA.filter(c => {
        const matchesContinent = c.continent === continent || (continent === 'Europe' && c.continent === 'Europe');
        if (!query) return matchesContinent;
        return matchesContinent && (
          c.name.toLowerCase().includes(query) ||
          c.country.toLowerCase().includes(query)
        );
      });

      if (citiesInContinent.length > 0) {
        html += `<optgroup label="--- ${continent} ---">`;
        citiesInContinent.forEach(city => {
          const isSelected = city.id === selectedId ? 'selected' : '';
          html += `<option value="${city.id}" ${isSelected}>${city.name}, ${city.country}</option>`;
        });
        html += `</optgroup>`;
      }
    });

    // Also include any user-created custom cities under 'Custom' group
    const customCities = CITIES_DATA.filter(c => c.id.startsWith('custom-'));
    if (customCities.length > 0) {
      html += `<optgroup label="--- User Custom Cities ---">`;
      customCities.forEach(city => {
        const isSelected = city.id === selectedId ? 'selected' : '';
        html += `<option value="${city.id}" ${isSelected}>${city.name}, ${city.country}</option>`;
      });
      html += `</optgroup>`;
    }

    return html;
  }

  originSelect.innerHTML = buildOptionsHtml(appState.originCityId, appState.originSearchTerm);
  destSelect.innerHTML = buildOptionsHtml(appState.destCityId, appState.destSearchTerm);
}

/**
 * Renders quick preset buttons.
 */
function populatePresets() {
  const presetContainer = document.getElementById('preset-buttons');
  if (!presetContainer) return;

  presetContainer.innerHTML = PRESETS.map(preset => `
    <button type="button" 
            class="preset-btn text-xs font-medium px-3 py-1.5 rounded-full bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-700 border border-slate-200 transition"
            data-origin="${preset.origin}"
            data-dest="${preset.dest}"
            data-income="${preset.income}">
      ${preset.label}
    </button>
  `).join('');

  presetContainer.querySelectorAll('.preset-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const target = e.currentTarget;
      appState.originCityId = target.getAttribute('data-origin');
      appState.destCityId = target.getAttribute('data-dest');
      appState.grossIncome = parseInt(target.getAttribute('data-income'), 10);
      
      syncControls();
      updateCalculations();
      syncUrlParams();
    });
  });
}

/**
 * Binds DOM event listeners for interactive inputs.
 */
function setupEventListeners() {
  const incomeSlider = document.getElementById('income-slider');
  const incomeInput = document.getElementById('income-input');
  const originSelect = document.getElementById('origin-city-select');
  const destSelect = document.getElementById('dest-city-select');
  const originSearch = document.getElementById('origin-city-search');
  const destSearch = document.getElementById('dest-city-search');
  const swapBtn = document.getElementById('swap-cities-btn');
  const shareBtn = document.getElementById('share-btn');
  const printBtn = document.getElementById('print-report-btn');

  // Custom City Modal controls
  const customCityModal = document.getElementById('custom-city-modal');
  const openCustomOriginBtn = document.getElementById('open-custom-origin-btn');
  const openCustomDestBtn = document.getElementById('open-custom-dest-btn');
  const closeCustomModalBtn = document.getElementById('close-custom-modal-btn');
  const cancelCustomModalBtn = document.getElementById('cancel-custom-modal-btn');
  const customCityForm = document.getElementById('custom-city-form');

  // Synchronized Income Slider & Input
  if (incomeSlider && incomeInput) {
    incomeSlider.value = appState.grossIncome;
    incomeInput.value = appState.grossIncome;

    incomeSlider.addEventListener('input', (e) => {
      const val = parseInt(e.target.value, 10);
      appState.grossIncome = val;
      incomeInput.value = val;
      updateCalculations();
      syncUrlParams();
    });

    incomeInput.addEventListener('input', (e) => {
      let val = parseInt(e.target.value, 10);
      if (isNaN(val)) val = 30000;
      appState.grossIncome = val;
      incomeSlider.value = Math.min(Math.max(val, 30000), 350000);
      updateCalculations();
      syncUrlParams();
    });
  }

  // Fast Filter Search for Origin City
  if (originSearch) {
    originSearch.addEventListener('input', (e) => {
      appState.originSearchTerm = e.target.value;
      populateCityDropdowns();
    });
  }

  // Fast Filter Search for Destination City
  if (destSearch) {
    destSearch.addEventListener('input', (e) => {
      appState.destSearchTerm = e.target.value;
      populateCityDropdowns();
    });
  }

  // City selections
  if (originSelect) {
    originSelect.addEventListener('change', (e) => {
      if (e.target.value === 'ADD_CUSTOM_CITY') {
        openCustomModal('origin');
        originSelect.value = appState.originCityId; // revert until added
        return;
      }
      appState.originCityId = e.target.value;
      updateCalculations();
      syncUrlParams();
    });
  }

  if (destSelect) {
    destSelect.addEventListener('change', (e) => {
      if (e.target.value === 'ADD_CUSTOM_CITY') {
        openCustomModal('destination');
        destSelect.value = appState.destCityId; // revert until added
        return;
      }
      appState.destCityId = e.target.value;
      updateCalculations();
      syncUrlParams();
    });
  }

  // Direct buttons to open custom city modal
  if (openCustomOriginBtn) {
    openCustomOriginBtn.addEventListener('click', () => openCustomModal('origin'));
  }
  if (openCustomDestBtn) {
    openCustomDestBtn.addEventListener('click', () => openCustomModal('destination'));
  }

  // Modal close handlers
  if (closeCustomModalBtn) {
    closeCustomModalBtn.addEventListener('click', closeCustomModal);
  }
  if (cancelCustomModalBtn) {
    cancelCustomModalBtn.addEventListener('click', closeCustomModal);
  }

  // Custom City Form Submission
  if (customCityForm) {
    customCityForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('custom-city-name').value.trim();
      const country = document.getElementById('custom-city-country').value.trim();
      const rent = parseInt(document.getElementById('custom-city-rent').value, 10);
      const taxRatePct = parseFloat(document.getElementById('custom-city-tax').value);
      const currencySymbol = document.getElementById('custom-city-currency').value.trim() || '$';

      if (!name || !country || isNaN(rent)) {
        alert('Please provide city name, country, and estimated monthly rent.');
        return;
      }

      const effectiveTaxRate = isNaN(taxRatePct) ? 0.20 : (taxRatePct / 100);

      const created = createCustomCity({
        name,
        country,
        continent: 'Custom',
        rentCenter: rent,
        effectiveTaxRate,
        currencySymbol,
        currencyCode: 'LOCAL',
        exchangeRateToUSD: 1.0,
        minIncome: Math.round(rent * 2.5)
      });

      if (appState.targetModalRole === 'origin') {
        appState.originCityId = created.id;
      } else {
        appState.destCityId = created.id;
      }

      closeCustomModal();
      populateCityDropdowns();
      syncControls();
      updateCalculations();
      syncUrlParams();

      // Clear form inputs
      customCityForm.reset();
    });
  }

  // Swap Cities Button
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const temp = appState.originCityId;
      appState.originCityId = appState.destCityId;
      appState.destCityId = temp;

      if (originSelect) originSelect.value = appState.originCityId;
      if (destSelect) destSelect.value = appState.destCityId;

      updateCalculations();
      syncUrlParams();
    });
  }

  // Housing preference buttons
  const housingRadios = document.querySelectorAll('input[name="housing"]');
  housingRadios.forEach(radio => {
    if (radio.value === appState.housingPreference) radio.checked = true;
    radio.addEventListener('change', (e) => {
      appState.housingPreference = e.target.value;
      updateCalculations();
      syncUrlParams();
    });
  });

  // Lifestyle tier buttons
  const lifestyleRadios = document.querySelectorAll('input[name="lifestyle"]');
  lifestyleRadios.forEach(radio => {
    if (radio.value === appState.lifestyleLevel) radio.checked = true;
    radio.addEventListener('change', (e) => {
      appState.lifestyleLevel = e.target.value;
      updateCalculations();
      syncUrlParams();
    });
  });

  // Share calculation button
  if (shareBtn) {
    shareBtn.addEventListener('click', async () => {
      const url = window.location.href;
      try {
        if (navigator.clipboard) {
          await navigator.clipboard.writeText(url);
          const origText = shareBtn.innerHTML;
          shareBtn.innerHTML = `✓ Link Copied!`;
          setTimeout(() => { shareBtn.innerHTML = origText; }, 2000);
        } else {
          prompt('Copy this link to share your calculation:', url);
        }
      } catch (err) {
        prompt('Copy this link to share your calculation:', url);
      }
    });
  }

  // Print button
  if (printBtn) {
    printBtn.addEventListener('click', () => {
      window.print();
    });
  }
}

/**
 * Opens Custom City Modal
 */
function openCustomModal(role = 'destination') {
  appState.targetModalRole = role;
  const modal = document.getElementById('custom-city-modal');
  const roleTitle = document.getElementById('modal-role-title');
  if (roleTitle) {
    roleTitle.textContent = role === 'origin' ? 'Base / Origin City' : 'Relocation Destination';
  }
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    const firstInput = document.getElementById('custom-city-name');
    if (firstInput) setTimeout(() => firstInput.focus(), 100);
  }
}

/**
 * Closes Custom City Modal
 */
function closeCustomModal() {
  const modal = document.getElementById('custom-city-modal');
  if (modal) {
    modal.classList.add('hidden');
    modal.classList.remove('flex');
  }
}

/**
 * Synchronizes controls to match the current appState.
 */
function syncControls() {
  const incomeSlider = document.getElementById('income-slider');
  const incomeInput = document.getElementById('income-input');
  const originSelect = document.getElementById('origin-city-select');
  const destSelect = document.getElementById('dest-city-select');

  if (incomeSlider) incomeSlider.value = appState.grossIncome;
  if (incomeInput) incomeInput.value = appState.grossIncome;
  if (originSelect) originSelect.value = appState.originCityId;
  if (destSelect) destSelect.value = appState.destCityId;
}

/**
 * Main recalculation cycle - computes all metrics and re-renders the DOM.
 */
function updateCalculations() {
  const originCity = getCityById(appState.originCityId);
  const destCity = getCityById(appState.destCityId);

  const report = calculateArbitrage(
    appState.grossIncome,
    originCity,
    destCity,
    appState.housingPreference,
    appState.lifestyleLevel
  );

  const visaCheck = checkNomadVisaEligibility(appState.grossIncome, destCity);

  renderHeroMetrics(report);
  renderComparisonCards(report);
  renderVisaCard(visaCheck, destCity);
  renderChartVisualization(report);
  renderCategoryBreakdown(report);
}

/**
 * Renders the top Hero Arbitrage metric cards.
 */
function renderHeroMetrics(report) {
  const monthlySurplusEl = document.getElementById('stat-monthly-surplus');
  const annualSurplusEl = document.getElementById('stat-annual-surplus');
  const runwayMultiplierEl = document.getElementById('stat-runway-multiplier');
  const colDifferenceEl = document.getElementById('stat-col-difference');
  const equivalentSalaryEl = document.getElementById('stat-equivalent-salary');

  const arb = report.arbitrage;
  const isPositive = arb.monthlyDiscretionarySurplus >= 0;

  if (monthlySurplusEl) {
    monthlySurplusEl.textContent = `${isPositive ? '+' : ''}${formatUSD(arb.monthlyDiscretionarySurplus)}/mo`;
    monthlySurplusEl.className = isPositive 
      ? 'text-3xl sm:text-4xl font-extrabold text-emerald-400 tracking-tight'
      : 'text-3xl sm:text-4xl font-extrabold text-rose-400 tracking-tight';
  }

  if (annualSurplusEl) {
    annualSurplusEl.textContent = `${isPositive ? '+' : ''}${formatUSD(arb.annualDiscretionarySurplus)}/yr extra savings`;
    annualSurplusEl.className = isPositive ? 'text-xs font-semibold text-emerald-300' : 'text-xs font-semibold text-rose-300';
  }

  if (runwayMultiplierEl) {
    runwayMultiplierEl.textContent = `${arb.runwayMonths} months`;
  }

  if (colDifferenceEl) {
    const isCheaper = arb.costOfLivingDiffPct <= 0;
    colDifferenceEl.textContent = `${isCheaper ? '' : '+'}${arb.costOfLivingDiffPct}%`;
    colDifferenceEl.className = isCheaper 
      ? 'text-2xl font-bold text-emerald-400'
      : 'text-2xl font-bold text-rose-400';
  }

  if (equivalentSalaryEl) {
    equivalentSalaryEl.textContent = formatUSD(arb.equivalentGrossAnnualUSD);
  }
}

/**
 * Renders side-by-side Origin vs Destination cards.
 */
function renderComparisonCards(report) {
  const { origin, destination } = report;

  // Origin elements
  setText('origin-name-title', `${origin.city.name}, ${origin.city.country}`);
  setText('origin-tax-rate', `${(origin.tax.effectiveTaxRate * 100).toFixed(1)}%`);
  setText('origin-tax-annual', `-${formatUSD(origin.tax.totalTaxAnnual)}/yr`);
  setText('origin-tax-regime', origin.city.taxRegimeName);
  setText('origin-net-takehome', `${formatUSD(origin.netMonthly)}/mo`);
  setText('origin-net-annual', `${formatUSD(origin.netAnnual)}/yr take-home`);
  setText('origin-monthly-expenses', `-${formatUSD(origin.expenses.totalMonthly)}/mo`);
  setText('origin-rent-cost', formatUSD(origin.expenses.rent));
  setText('origin-food-cost', formatUSD(origin.expenses.groceries + origin.expenses.dining));
  setText('origin-discretionary', `${formatUSD(origin.discretionaryMonthly)}/mo`);

  // Destination elements
  setText('dest-name-title', `${destination.city.name}, ${destination.city.country}`);
  setText('dest-tax-rate', `${(destination.tax.effectiveTaxRate * 100).toFixed(1)}%`);
  setText('dest-tax-annual', `-${formatUSD(destination.tax.totalTaxAnnual)}/yr`);
  setText('dest-tax-regime', destination.city.taxRegimeName);
  setText('dest-net-takehome', `${formatUSD(destination.netMonthly)}/mo`);
  setText('dest-net-annual', `${formatUSD(destination.netAnnual)}/yr take-home`);
  setText('dest-monthly-expenses', `-${formatUSD(destination.expenses.totalMonthly)}/mo`);
  setText('dest-rent-cost', formatUSD(destination.expenses.rent));
  setText('dest-food-cost', formatUSD(destination.expenses.groceries + destination.expenses.dining));
  setText('dest-discretionary', `${formatUSD(destination.discretionaryMonthly)}/mo`);

  // Local currency conversions
  const destLocalDisposable = formatLocalCurrency(destination.discretionaryMonthly, destination.city);
  setText('dest-local-currency-badge', `≈ ${destLocalDisposable}/mo locally`);
}

/**
 * Renders the Digital Nomad Visa Check Card.
 */
function renderVisaCard(visaCheck, destCity) {
  const badgeEl = document.getElementById('visa-badge');
  const titleEl = document.getElementById('visa-name');
  const minIncomeEl = document.getElementById('visa-min-income');
  const userIncomeEl = document.getElementById('visa-user-income');
  const verdictEl = document.getElementById('visa-verdict');
  const detailsEl = document.getElementById('visa-details');
  const officialLinkEl = document.getElementById('visa-official-link');

  if (!badgeEl || !titleEl) return;

  userIncomeEl.textContent = `${formatUSD(visaCheck.userMonthlyGross)}/mo`;

  if (!visaCheck.available) {
    badgeEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700';
    badgeEl.textContent = 'Standard Visa Rules';
    titleEl.textContent = `${destCity.name} Immigration Framework`;
    minIncomeEl.textContent = 'No specific remote visa';
    verdictEl.className = 'text-sm font-medium text-slate-600 mt-2';
    verdictEl.textContent = visaCheck.path;
    detailsEl.textContent = visaCheck.taxIncentive || 'Requires local work permit, EU citizenship, or standard residence path.';
    if (officialLinkEl) {
      officialLinkEl.href = destCity.digitalNomadVisa?.officialUrl || '#';
      officialLinkEl.textContent = 'View Official Guidelines →';
    }
    return;
  }

  titleEl.textContent = visaCheck.name;
  minIncomeEl.textContent = `${formatUSD(visaCheck.minMonthlyIncomeUSD)}/mo minimum`;

  if (visaCheck.eligible) {
    badgeEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800';
    badgeEl.textContent = '✓ Income Qualified';
    verdictEl.className = 'text-sm font-semibold text-emerald-700 mt-2';
    verdictEl.textContent = `Qualified! Your gross monthly income exceeds the minimum requirement by ${formatUSD(visaCheck.surplus)}/month.`;
  } else {
    badgeEl.className = 'px-2.5 py-1 text-xs font-semibold rounded-full bg-amber-100 text-amber-800';
    badgeEl.textContent = '⚠ Below Threshold';
    verdictEl.className = 'text-sm font-semibold text-amber-700 mt-2';
    verdictEl.textContent = `Shortfall of ${formatUSD(visaCheck.shortfall)}/month under the official requirement (${formatUSD(visaCheck.minMonthlyIncomeUSD)}/mo required).`;
  }

  detailsEl.textContent = `${visaCheck.path}. Duration: ${visaCheck.durationMonths} months. Tax Incentive: ${visaCheck.taxIncentive}.`;
  
  if (officialLinkEl && visaCheck.officialUrl) {
    officialLinkEl.href = visaCheck.officialUrl;
    officialLinkEl.target = '_blank';
    officialLinkEl.rel = 'noopener noreferrer';
    officialLinkEl.textContent = `Official ${destCity.country} Visa Portal →`;
  }
}

/**
 * Pure SVG Stacked Bar Comparison Chart (Origin vs Destination).
 */
function renderChartVisualization(report) {
  const container = document.getElementById('chart-container');
  if (!container) return;

  const { origin, destination, grossAnnualUSD } = report;
  const grossMonthly = Math.round(grossAnnualUSD / 12);

  const oTax = origin.tax.totalTaxMonthly;
  const oExp = origin.expenses.totalMonthly;
  const oDisc = Math.max(0, origin.discretionaryMonthly);

  const dTax = destination.tax.totalTaxMonthly;
  const dExp = destination.expenses.totalMonthly;
  const dDisc = Math.max(0, destination.discretionaryMonthly);

  const maxVal = Math.max(grossMonthly, oTax + oExp + oDisc, dTax + dExp + dDisc) * 1.05;

  const svgWidth = 500;
  const svgHeight = 260;
  const barWidth = 90;
  const chartBottom = 200;
  const chartHeight = 160;

  function getY(val) {
    return Math.round(chartBottom - (val / maxVal) * chartHeight);
  }

  function getH(val) {
    return Math.max(2, Math.round((val / maxVal) * chartHeight));
  }

  const oTaxH = getH(oTax);
  const oTaxY = chartBottom - oTaxH;
  const oExpH = getH(oExp);
  const oExpY = oTaxY - oExpH;
  const oDiscH = getH(oDisc);
  const oDiscY = oExpY - oDiscH;

  const dTaxH = getH(dTax);
  const dTaxY = chartBottom - dTaxH;
  const dExpH = getH(dExp);
  const dExpY = dTaxY - dExpH;
  const dDiscH = getH(dDisc);
  const dDiscY = dExpY - dDiscH;

  container.innerHTML = `
    <svg viewBox="0 0 ${svgWidth} ${svgHeight}" class="w-full h-auto overflow-visible select-none" xmlns="http://www.w3.org/2000/svg">
      <line x1="30" y1="${chartBottom}" x2="470" y2="${chartBottom}" stroke="#e2e8f0" stroke-width="1.5" />
      <line x1="30" y1="${getY(maxVal * 0.5)}" x2="470" y2="${getY(maxVal * 0.5)}" stroke="#f1f5f9" stroke-dasharray="4" stroke-width="1" />
      <line x1="30" y1="${getY(maxVal * 0.9)}" x2="470" y2="${getY(maxVal * 0.9)}" stroke="#f1f5f9" stroke-dasharray="4" stroke-width="1" />

      <!-- Origin Stack -->
      <rect x="110" y="${oTaxY}" width="${barWidth}" height="${oTaxH}" rx="4" fill="#f43f5e" class="chart-bar">
        <title>Origin Taxes: ${formatUSD(oTax)}/mo</title>
      </rect>
      <rect x="110" y="${oExpY}" width="${barWidth}" height="${oExpH}" rx="4" fill="#f59e0b" class="chart-bar">
        <title>Origin Living Expenses: ${formatUSD(oExp)}/mo</title>
      </rect>
      <rect x="110" y="${oDiscY}" width="${barWidth}" height="${oDiscH}" rx="4" fill="#10b981" class="chart-bar">
        <title>Origin Discretionary Savings: ${formatUSD(oDisc)}/mo</title>
      </rect>
      <text x="155" y="${Math.min(oDiscY - 8, 50)}" text-anchor="middle" font-size="12" font-weight="700" fill="#334155">${formatUSD(oDisc)}/mo</text>
      <text x="155" y="${chartBottom + 20}" text-anchor="middle" font-size="13" font-weight="600" fill="#0f172a">${origin.city.name}</text>
      <text x="155" y="${chartBottom + 35}" text-anchor="middle" font-size="10" fill="#64748b">Origin City</text>

      <!-- Destination Stack -->
      <rect x="300" y="${dTaxY}" width="${barWidth}" height="${dTaxH}" rx="4" fill="#f43f5e" class="chart-bar">
        <title>Destination Taxes: ${formatUSD(dTax)}/mo</title>
      </rect>
      <rect x="300" y="${dExpY}" width="${barWidth}" height="${dExpH}" rx="4" fill="#f59e0b" class="chart-bar">
        <title>Destination Living Expenses: ${formatUSD(dExp)}/mo</title>
      </rect>
      <rect x="300" y="${dDiscY}" width="${barWidth}" height="${dDiscH}" rx="4" fill="#10b981" class="chart-bar">
        <title>Destination Discretionary Savings: ${formatUSD(dDisc)}/mo</title>
      </rect>
      <text x="345" y="${Math.min(dDiscY - 8, 50)}" text-anchor="middle" font-size="12" font-weight="700" fill="#059669">${formatUSD(dDisc)}/mo</text>
      <text x="345" y="${chartBottom + 20}" text-anchor="middle" font-size="13" font-weight="600" fill="#0f172a">${destination.city.name}</text>
      <text x="345" y="${chartBottom + 35}" text-anchor="middle" font-size="10" fill="#64748b">Destination</text>
    </svg>
  `;
}

/**
 * Renders detailed itemized comparison table.
 */
function renderCategoryBreakdown(report) {
  const container = document.getElementById('category-breakdown-tbody');
  if (!container) return;

  const o = report.origin.expenses;
  const d = report.destination.expenses;

  const categories = [
    { label: 'Housing / Rent', icon: '🏠', originVal: o.rent, destVal: d.rent },
    { label: 'Groceries & Markets', icon: '🛒', originVal: o.groceries, destVal: d.groceries },
    { label: 'Dining Out & Leisure', icon: '☕', originVal: o.dining, destVal: d.dining },
    { label: 'Utilities & Gigabit Internet', icon: '⚡', originVal: o.utilities, destVal: d.utilities },
    { label: 'Local Transport & Mobility', icon: '🚇', originVal: o.transport, destVal: d.transport },
    { label: 'Estimated Taxes & Levies', icon: '🏛️', originVal: report.origin.tax.totalTaxMonthly, destVal: report.destination.tax.totalTaxMonthly }
  ];

  container.innerHTML = categories.map(cat => {
    const diff = cat.destVal - cat.originVal;
    const diffPct = cat.originVal > 0 ? Math.round((diff / cat.originVal) * 100) : 0;
    const isCheaper = diff <= 0;

    return `
      <tr class="border-b border-slate-100 hover:bg-slate-50/70 transition">
        <td class="py-3 px-4 flex items-center gap-2 font-medium text-slate-800">
          <span>${cat.icon}</span> <span>${cat.label}</span>
        </td>
        <td class="py-3 px-4 text-right text-slate-700">${formatUSD(cat.originVal)}</td>
        <td class="py-3 px-4 text-right text-slate-800 font-semibold">${formatUSD(cat.destVal)}</td>
        <td class="py-3 px-4 text-right">
          <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${isCheaper ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}">
            ${isCheaper ? '' : '+'}${diffPct}% (${isCheaper ? '-' : '+'}${formatUSD(Math.abs(diff))})
          </span>
        </td>
      </tr>
    `;
  }).join('');
}

// Utility helper for safe inner text replacement
function setText(id, text) {
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}
