/**
 * Creator Brand Sponsorship Rate Engine
 * 100% Client-Side Engine for YouTube, TikTok, Newsletters & Podcasts
 */

(function () {
  'use strict';

  // State
  let state = {
    platform: 'yt_integrated',
    platformLabel: 'YouTube (60s Integration)',
    platformMult: 1.0,
    views: 45000,
    nicheCpm: 45,
    nicheLabel: 'B2B Tech, SaaS & AI',
    geoMult: 1.25,
    geoLabel: 'Tier 1 Heavy (>70% US/UK/CA/AU)',
    whitelistingAdd: 0.30,
    whitelistingLabel: '30-Day Paid Whitelisting',
    exclusivityAdd: 0.25,
    exclusivityLabel: '30-Day Competitor Lockout',
    rushTurnaround: false,
    linkInBio: true
  };

  function formatMoney(amount) {
    return '$' + Math.round(amount).toLocaleString('en-US');
  }

  function showToast(message) {
    const toast = document.getElementById('toastNotification');
    const msg = document.getElementById('toastMessage');
    if (!toast || !msg) return;

    msg.textContent = message || 'Copied to clipboard!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  }

  function calculateRates() {
    // 1. Base Organic Rate
    const baseOrganic = (state.views / 1000) * state.nicheCpm * state.platformMult * state.geoMult;

    // 2. Rights & Multiplier Additions
    let addOns = state.whitelistingAdd + state.exclusivityAdd;
    if (state.rushTurnaround) addOns += 0.25;
    if (state.linkInBio) addOns += 0.10;

    const totalUpliftPercent = Math.round(addOns * 100);
    const recommendedRate = Math.round(baseOrganic * (1 + addOns));
    const floorRate = Math.round(recommendedRate * 0.75);
    const premiumRate = Math.round(recommendedRate * 1.35);

    const effectiveCpm = ((recommendedRate / state.views) * 1000).toFixed(2);

    // Update UI Elements
    const elRec = document.getElementById('rateRecommended');
    if (elRec) elRec.textContent = formatMoney(recommendedRate);

    const elFloor = document.getElementById('rateFloor');
    if (elFloor) elFloor.textContent = formatMoney(floorRate);

    const elPrem = document.getElementById('ratePremium');
    if (elPrem) elPrem.textContent = formatMoney(premiumRate);

    const elCpm = document.getElementById('metricEffectiveCpm');
    if (elCpm) elCpm.textContent = `$${effectiveCpm} CPM`;

    const elUplift = document.getElementById('metricUplift');
    if (elUplift) elUplift.textContent = `+${totalUpliftPercent}% Uplift`;

    // Update Counter-Offer Pitch Memo
    updatePitchMemo(floorRate, recommendedRate, premiumRate);
  }

  function updatePitchMemo(floor, recommended, premium) {
    const memoEl = document.getElementById('memoPreviewText');
    if (!memoEl) return;

    let rightsList = [];
    if (state.whitelistingAdd > 0) rightsList.push(state.whitelistingLabel);
    if (state.exclusivityAdd > 0) rightsList.push(state.exclusivityLabel);
    if (state.linkInBio) rightsList.push('Dedicated Link in Bio / Pinned Comment');
    if (state.rushTurnaround) rightsList.push('Rush <72hr Turnaround');

    const rightsText = rightsList.length > 0 ? rightsList.join(', ') : 'Standard organic release';

    const text = `Hi [Brand / Agency Partner],

Thank you for reaching out! We'd love to explore a partnership that resonates authentically with our audience.

Based on our recent 30-day verified analytics (${state.views.toLocaleString()} median views, ${state.geoLabel}), here are our standard sponsorship packages for ${state.platformLabel}:

• Standard Integration: ${formatMoney(floor)}
  Includes organic integration + standard 1 round of script review.

• Full Commercial Package (Recommended): ${formatMoney(recommended)}
  Includes organic placement + ${rightsText}.

• Extended Brand Partnership: ${formatMoney(premium)}
  Includes 60-day rights amplification, dedicated social amplification, and prominent landing page placement.

Let us know which package fits your current campaign goals best, and we can share our open calendar dates and booking agreement.

Best regards,
[Your Name / Channel Name]`;

    memoEl.textContent = text;
  }

  function init() {
    const viewsSlider = document.getElementById('viewsSlider');
    const viewsDisplay = document.getElementById('viewsValueDisplay');
    const nicheSelect = document.getElementById('nicheSelect');
    const geoSelect = document.getElementById('geoSelect');
    const whitelistingSelect = document.getElementById('whitelistingSelect');
    const exclusivitySelect = document.getElementById('exclusivitySelect');
    const rushCheck = document.getElementById('rushTurnaroundCheck');
    const bioCheck = document.getElementById('linkInBioCheck');

    // Platform Buttons
    document.querySelectorAll('.platform-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.platform-btn').forEach(b => {
          b.classList.remove('active', 'border-purple-600', 'bg-purple-50', 'dark:bg-purple-950/60', 'text-purple-700', 'dark:text-purple-300');
          b.classList.add('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');
        });
        btn.classList.add('active', 'border-purple-600', 'bg-purple-50', 'dark:bg-purple-950/60', 'text-purple-700', 'dark:text-purple-300');
        btn.classList.remove('border-slate-200', 'dark:border-slate-700', 'bg-slate-50', 'dark:bg-slate-800', 'text-slate-700', 'dark:text-slate-300');

        state.platform = btn.getAttribute('data-platform');
        state.platformMult = parseFloat(btn.getAttribute('data-mult')) || 1.0;
        state.platformLabel = btn.querySelector('.text-sm').textContent.trim() + ' (' + btn.querySelector('.text-\\[10px\\]').textContent.trim() + ')';
        calculateRates();
      });
    });

    // Views Slider
    if (viewsSlider) {
      viewsSlider.addEventListener('input', (e) => {
        state.views = parseInt(e.target.value, 10);
        if (viewsDisplay) viewsDisplay.textContent = `${state.views.toLocaleString()} Views`;

        // Clear active preset buttons if custom
        document.querySelectorAll('.view-preset-btn').forEach(b => {
          if (parseInt(b.getAttribute('data-val'), 10) === state.views) {
            b.classList.add('bg-purple-600', 'text-white', 'font-bold');
            b.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
          } else {
            b.classList.remove('bg-purple-600', 'text-white', 'font-bold');
            b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
          }
        });

        calculateRates();
      });
    }

    // View Preset Buttons
    document.querySelectorAll('.view-preset-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const val = parseInt(btn.getAttribute('data-val'), 10);
        state.views = val;
        if (viewsSlider) viewsSlider.value = val;
        if (viewsDisplay) viewsDisplay.textContent = `${val.toLocaleString()} Views`;

        document.querySelectorAll('.view-preset-btn').forEach(b => {
          b.classList.remove('bg-purple-600', 'text-white', 'font-bold');
          b.classList.add('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');
        });
        btn.classList.add('bg-purple-600', 'text-white', 'font-bold');
        btn.classList.remove('bg-slate-100', 'dark:bg-slate-800', 'text-slate-600', 'dark:text-slate-300');

        calculateRates();
      });
    });

    // Niche Select
    if (nicheSelect) {
      nicheSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        state.nicheCpm = parseFloat(opt.getAttribute('data-cpm')) || 45;
        state.nicheLabel = opt.textContent;
        calculateRates();
      });
    }

    // Geo Select
    if (geoSelect) {
      geoSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        state.geoMult = parseFloat(opt.getAttribute('data-mult')) || 1.0;
        state.geoLabel = opt.textContent;
        calculateRates();
      });
    }

    // Whitelisting Select
    if (whitelistingSelect) {
      whitelistingSelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        state.whitelistingAdd = parseFloat(opt.getAttribute('data-add')) || 0;
        state.whitelistingLabel = opt.textContent;
        calculateRates();
      });
    }

    // Exclusivity Select
    if (exclusivitySelect) {
      exclusivitySelect.addEventListener('change', (e) => {
        const opt = e.target.selectedOptions[0];
        state.exclusivityAdd = parseFloat(opt.getAttribute('data-add')) || 0;
        state.exclusivityLabel = opt.textContent;
        calculateRates();
      });
    }

    // Checkboxes
    if (rushCheck) {
      rushCheck.addEventListener('change', (e) => {
        state.rushTurnaround = e.target.checked;
        calculateRates();
      });
    }

    if (bioCheck) {
      bioCheck.addEventListener('change', (e) => {
        state.linkInBio = e.target.checked;
        calculateRates();
      });
    }

    // Copy Memo Button
    const copyBtn = document.getElementById('copyMemoBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const memoEl = document.getElementById('memoPreviewText');
        if (memoEl) {
          navigator.clipboard.writeText(memoEl.textContent).then(() => {
            showToast('Pitch memo copied to clipboard!');
          }).catch(() => {
            showToast('Memo ready to copy.');
          });
        }
      });
    }

    // Initial run
    calculateRates();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
