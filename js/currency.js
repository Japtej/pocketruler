/**
 * PocketRuler.app - Unified Currency & FX Controller
 * Centralized live exchange rate synchronization via open.er-api.com,
 * localStorage caching with 12-hour TTL, locale-aware formatting,
 * adaptive slider boundaries, and custom event broadcasting.
 */

(function () {
  'use strict';

  const CACHE_KEY = 'pocketruler_fx_cache';
  const CACHE_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours
  const ACTIVE_CURRENCY_KEY = 'pocketruler_active_currency';

  // 15 Flagship Currencies with symbols, display names, fallback rates (1 USD = rate), locales, and adaptive bounds
  const CURRENCIES = {
    USD: {
      code: 'USD',
      symbol: '$',
      name: 'USD ($)',
      flag: '🇺🇸',
      rate: 1.0,
      locale: 'en-US',
      bounds: {
        living: { min: 1000, max: 20000, step: 250, default: 4500 },
        business: { min: 0, max: 10000, step: 100, default: 800 },
        reserves: { min: 1000, max: 150000, step: 1000, default: 35000 },
        hourlyRate: { min: 15, max: 350, step: 5, default: 85 }
      }
    },
    EUR: {
      code: 'EUR',
      symbol: '€',
      name: 'EUR (€)',
      flag: '🇪🇺',
      rate: 0.92,
      locale: 'de-DE',
      bounds: {
        living: { min: 900, max: 18000, step: 250, default: 4000 },
        business: { min: 0, max: 9000, step: 100, default: 750 },
        reserves: { min: 1000, max: 140000, step: 1000, default: 32000 },
        hourlyRate: { min: 15, max: 320, step: 5, default: 80 }
      }
    },
    GBP: {
      code: 'GBP',
      symbol: '£',
      name: 'GBP (£)',
      flag: '🇬🇧',
      rate: 0.79,
      locale: 'en-GB',
      bounds: {
        living: { min: 800, max: 16000, step: 200, default: 3500 },
        business: { min: 0, max: 8000, step: 100, default: 650 },
        reserves: { min: 1000, max: 120000, step: 1000, default: 28000 },
        hourlyRate: { min: 15, max: 280, step: 5, default: 70 }
      }
    },
    CAD: {
      code: 'CAD',
      symbol: 'CA$',
      name: 'CAD (CA$)',
      flag: '🇨🇦',
      rate: 1.36,
      locale: 'en-CA',
      bounds: {
        living: { min: 1400, max: 27000, step: 250, default: 6000 },
        business: { min: 0, max: 13000, step: 100, default: 1100 },
        reserves: { min: 1500, max: 200000, step: 1000, default: 48000 },
        hourlyRate: { min: 20, max: 450, step: 5, default: 115 }
      }
    },
    AUD: {
      code: 'AUD',
      symbol: 'A$',
      name: 'AUD (A$)',
      flag: '🇦🇺',
      rate: 1.52,
      locale: 'en-AU',
      bounds: {
        living: { min: 1500, max: 30000, step: 250, default: 6800 },
        business: { min: 0, max: 15000, step: 100, default: 1200 },
        reserves: { min: 1500, max: 220000, step: 1000, default: 53000 },
        hourlyRate: { min: 25, max: 500, step: 5, default: 130 }
      }
    },
    INR: {
      code: 'INR',
      symbol: '₹',
      name: 'INR (₹)',
      flag: '🇮🇳',
      rate: 83.5,
      locale: 'en-IN',
      bounds: {
        living: { min: 25000, max: 1200000, step: 10000, default: 250000 },
        business: { min: 0, max: 500000, step: 5000, default: 65000 },
        reserves: { min: 50000, max: 10000000, step: 50000, default: 2500000 },
        hourlyRate: { min: 500, max: 25000, step: 250, default: 5000 }
      }
    },
    JPY: {
      code: 'JPY',
      symbol: '¥',
      name: 'JPY (¥)',
      flag: '🇯🇵',
      rate: 155.0,
      locale: 'ja-JP',
      bounds: {
        living: { min: 150000, max: 3000000, step: 25000, default: 650000 },
        business: { min: 0, max: 1500000, step: 10000, default: 120000 },
        reserves: { min: 150000, max: 25000000, step: 100000, default: 5000000 },
        hourlyRate: { min: 2000, max: 50000, step: 500, default: 12000 }
      }
    },
    CHF: {
      code: 'CHF',
      symbol: 'Fr. ',
      name: 'CHF (Fr)',
      flag: '🇨🇭',
      rate: 0.90,
      locale: 'de-CH',
      bounds: {
        living: { min: 1200, max: 22000, step: 250, default: 5500 },
        business: { min: 0, max: 10000, step: 100, default: 900 },
        reserves: { min: 1500, max: 180000, step: 1000, default: 45000 },
        hourlyRate: { min: 20, max: 400, step: 5, default: 110 }
      }
    },
    SGD: {
      code: 'SGD',
      symbol: 'S$',
      name: 'SGD (S$)',
      flag: '🇸🇬',
      rate: 1.35,
      locale: 'en-SG',
      bounds: {
        living: { min: 1400, max: 26000, step: 250, default: 5800 },
        business: { min: 0, max: 12000, step: 100, default: 1000 },
        reserves: { min: 1500, max: 190000, step: 1000, default: 45000 },
        hourlyRate: { min: 20, max: 420, step: 5, default: 115 }
      }
    },
    AED: {
      code: 'AED',
      symbol: 'AED ',
      name: 'AED (د.إ)',
      flag: '🇦🇪',
      rate: 3.67,
      locale: 'ar-AE',
      bounds: {
        living: { min: 4000, max: 75000, step: 500, default: 16500 },
        business: { min: 0, max: 35000, step: 250, default: 3000 },
        reserves: { min: 5000, max: 550000, step: 5000, default: 130000 },
        hourlyRate: { min: 50, max: 1200, step: 25, default: 300 }
      }
    },
    NZD: {
      code: 'NZD',
      symbol: 'NZ$',
      name: 'NZD (NZ$)',
      flag: '🇳🇿',
      rate: 1.65,
      locale: 'en-NZ',
      bounds: {
        living: { min: 1600, max: 32000, step: 250, default: 7200 },
        business: { min: 0, max: 16000, step: 100, default: 1300 },
        reserves: { min: 2000, max: 240000, step: 1000, default: 58000 },
        hourlyRate: { min: 25, max: 520, step: 5, default: 140 }
      }
    },
    BRL: {
      code: 'BRL',
      symbol: 'R$',
      name: 'BRL (R$)',
      flag: '🇧🇷',
      rate: 5.20,
      locale: 'pt-BR',
      bounds: {
        living: { min: 4000, max: 95000, step: 500, default: 22000 },
        business: { min: 0, max: 45000, step: 250, default: 4000 },
        reserves: { min: 5000, max: 700000, step: 5000, default: 175000 },
        hourlyRate: { min: 50, max: 1500, step: 25, default: 400 }
      }
    },
    SEK: {
      code: 'SEK',
      symbol: 'kr ',
      name: 'SEK (kr)',
      flag: '🇸🇪',
      rate: 10.5,
      locale: 'sv-SE',
      bounds: {
        living: { min: 10000, max: 200000, step: 1000, default: 45000 },
        business: { min: 0, max: 95000, step: 500, default: 8000 },
        reserves: { min: 10000, max: 1500000, step: 10000, default: 350000 },
        hourlyRate: { min: 150, max: 3500, step: 50, default: 850 }
      }
    },
    ZAR: {
      code: 'ZAR',
      symbol: 'R ',
      name: 'ZAR (R)',
      flag: '🇿🇦',
      rate: 18.2,
      locale: 'en-ZA',
      bounds: {
        living: { min: 18000, max: 360000, step: 2500, default: 80000 },
        business: { min: 0, max: 170000, step: 1000, default: 15000 },
        reserves: { min: 20000, max: 2500000, step: 20000, default: 600000 },
        hourlyRate: { min: 250, max: 6000, step: 50, default: 1500 }
      }
    },
    PHP: {
      code: 'PHP',
      symbol: '₱',
      name: 'PHP (₱)',
      flag: '🇵🇭',
      rate: 58.0,
      locale: 'en-PH',
      bounds: {
        living: { min: 50000, max: 1100000, step: 5000, default: 240000 },
        business: { min: 0, max: 500000, step: 2500, default: 45000 },
        reserves: { min: 50000, max: 8000000, step: 50000, default: 1900000 },
        hourlyRate: { min: 500, max: 18000, step: 250, default: 4500 }
      }
    }
  };

  let activeCurrencyCode = 'USD';
  let isApiSyncing = false;
  let lastSyncTime = null;

  // Initialize stored active currency if available
  try {
    const saved = localStorage.getItem(ACTIVE_CURRENCY_KEY);
    if (saved && CURRENCIES[saved]) {
      activeCurrencyCode = saved;
    }
  } catch (e) {}

  /**
   * Load cached rates from localStorage or use defaults
   */
  function loadCachedRates() {
    try {
      const raw = localStorage.getItem(CACHE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && parsed.timestamp && (Date.now() - parsed.timestamp < CACHE_TTL_MS) && parsed.rates) {
          applyRates(parsed.rates);
          lastSyncTime = new Date(parsed.timestamp);
          return true;
        }
      }
    } catch (e) {}
    return false;
  }

  /**
   * Apply rates object to currencies definition
   */
  function applyRates(rates) {
    Object.keys(CURRENCIES).forEach(code => {
      if (rates[code] && typeof rates[code] === 'number') {
        CURRENCIES[code].rate = rates[code];
      }
    });
  }

  /**
   * Fetch live rates from open.er-api.com
   */
  async function syncRates(force = false) {
    if (isApiSyncing) return;
    if (!force && loadCachedRates()) {
      return;
    }

    isApiSyncing = true;
    try {
      const resp = await fetch('https://open.er-api.com/v6/latest/USD');
      if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
      const data = await resp.json();

      if (data && data.rates) {
        applyRates(data.rates);
        lastSyncTime = new Date();
        try {
          localStorage.setItem(CACHE_KEY, JSON.stringify({
            timestamp: Date.now(),
            rates: data.rates
          }));
        } catch (e) {}

        // Emit rate update
        window.dispatchEvent(new CustomEvent('currencychange', {
          detail: {
            currency: activeCurrencyCode,
            ratesUpdated: true,
            timestamp: lastSyncTime
          }
        }));
      }
    } catch (err) {
      console.warn('PocketRuler FX sync fallback: using baseline exchange rates.', err);
    } finally {
      isApiSyncing = false;
    }
  }

  /**
   * Get currency definition object
   */
  function getCurrency(code) {
    return CURRENCIES[code] || CURRENCIES.USD;
  }

  /**
   * Convert amount from one currency to another
   */
  function convert(amount, fromCode = 'USD', toCode = 'USD') {
    if (fromCode === toCode) return amount;
    const from = getCurrency(fromCode);
    const to = getCurrency(toCode);
    const inUsd = from.rate > 0 ? (amount / from.rate) : amount;
    return inUsd * to.rate;
  }

  /**
   * Format money in specified or active currency with locale rules
   */
  function format(amount, code = null, decimals = 0) {
    const cur = getCurrency(code || activeCurrencyCode);
    const num = Number(amount) || 0;
    
    // For small decimals (like AI API costs $0.002)
    if (decimals > 0 || (num > 0 && num < 1)) {
      const dec = decimals > 0 ? decimals : (num < 0.01 ? 4 : 2);
      return `${cur.symbol}${num.toLocaleString(cur.locale, {
        minimumFractionDigits: dec,
        maximumFractionDigits: dec
      })}`;
    }

    const rounded = Math.round(num);
    return `${cur.symbol}${rounded.toLocaleString(cur.locale)}`;
  }

  /**
   * Set active currency and broadcast change
   */
  function setActiveCurrency(code) {
    if (!CURRENCIES[code]) return;
    activeCurrencyCode = code;
    try {
      localStorage.setItem(ACTIVE_CURRENCY_KEY, code);
    } catch (e) {}

    window.dispatchEvent(new CustomEvent('currencychange', {
      detail: {
        currency: activeCurrencyCode,
        currencyConfig: CURRENCIES[code],
        ratesUpdated: false
      }
    }));
  }

  /**
   * Populate a <select> element with currency options
   */
  function populateSelector(selectEl, selectedCode = null) {
    if (!selectEl) return;
    const active = selectedCode || activeCurrencyCode;
    selectEl.innerHTML = '';

    Object.values(CURRENCIES).forEach(cur => {
      const opt = document.createElement('option');
      opt.value = cur.code;
      opt.textContent = `${cur.flag} ${cur.name}`;
      if (cur.code === active) {
        opt.selected = true;
      }
      selectEl.appendChild(opt);
    });

    selectEl.addEventListener('change', (e) => {
      setActiveCurrency(e.target.value);
    });
  }

  /**
   * Get adaptive slider boundary presets for this currency
   */
  function getSliderBounds(type, code = null) {
    const cur = getCurrency(code || activeCurrencyCode);
    if (cur.bounds && cur.bounds[type]) {
      return cur.bounds[type];
    }
    const multiplier = cur.rate || 1.0;
    return {
      min: Math.round(100 * multiplier),
      max: Math.round(15000 * multiplier),
      step: multiplier > 20 ? 500 : 50,
      default: Math.round(5000 * multiplier)
    };
  }

  // Public API exposed on window
  window.PocketRulerCurrency = {
    currencies: CURRENCIES,
    getActiveCurrency: () => activeCurrencyCode,
    getActiveConfig: () => getCurrency(activeCurrencyCode),
    getCurrency,
    convert,
    format,
    setActiveCurrency,
    populateSelector,
    getSliderBounds,
    syncRates,
    getLastSyncTime: () => lastSyncTime
  };

  // Kick off background rate sync and initial cache check
  syncRates();

})();
