/**
 * PocketRuler.app - Unified Header, Footer & Mobile Drawer Components
 * Provides a single source of truth for navigation, branding, and compliance across all pages.
 */

(function () {
  'use strict';

  // Helper to determine root path prefix
  function getRootPath(el) {
    if (el && el.getAttribute('data-root')) {
      return el.getAttribute('data-root');
    }
    const meta = document.querySelector('meta[name="root-path"]');
    if (meta && meta.getAttribute('content')) {
      return meta.getAttribute('content');
    }
    // Auto-detect based on pathname depth
    const path = window.location.pathname.replace(/\\/g, '/');
    if (path.includes('/blog/') && (path.includes('/ai-api-price-collapse') || path.includes('/the-1-person-team'))) {
      return '../../';
    }
    if (path.includes('/freelance-calculator/') ||
        path.includes('/w2-1099-calculator/') ||
        path.includes('/relocation-calculator/') ||
        path.includes('/ai-token-calculator/') ||
        path.includes('/runway-calculator/') ||
        path.includes('/blog/')) {
      return '../';
    }
    return '';
  }

  // Brand Badge Style Mapper
  function getBadgeClasses(color) {
    switch (color) {
      case 'blue':
        return 'bg-blue-50 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'purple':
        return 'bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'emerald':
      default:
        return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
    }
  }

  /**
   * Render Universal Header
   */
  function renderHeader() {
    const header = document.getElementById('site-header');
    if (!header) return;

    const root = getRootPath(header);
    const badgeText = header.getAttribute('data-badge') || 'Free Utilities';
    const badgeColor = header.getAttribute('data-badge-color') || 'emerald';
    const subtitle = header.getAttribute('data-subtitle') || 'A digital pocket knife of handy online tools';
    const activeNav = (header.getAttribute('data-active') || '').toLowerCase();
    const badgeClasses = getBadgeClasses(badgeColor);

    // Save custom controls if already present in header or on page
    let customControls = header.querySelector('#headerCustomControls') || document.getElementById('headerCustomControls');
    if (customControls && customControls.parentNode) {
      customControls = customControls.parentNode.removeChild(customControls);
    }

    header.className = 'w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 sticky top-0 z-40 shadow-xs transition-colors duration-200';

    header.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">
      
      <!-- Brand Logo & Context Title -->
      <div class="flex items-center space-x-3">
        <a href="${root || '/'}" class="flex items-center space-x-3 group" aria-label="PocketRuler.app Home">
          <div class="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 p-1 flex items-center justify-center shadow-xs group-hover:bg-slate-100 dark:group-hover:bg-slate-700 group-hover:border-slate-300 dark:group-hover:border-slate-600 transition-all shrink-0">
            <img src="${root}logo.svg" alt="PocketRuler.app Logo" class="w-7 h-7" width="28" height="28" />
          </div>
          <div>
            <div class="flex items-center space-x-2">
              <span class="text-base sm:text-lg font-black text-slate-900 dark:text-white tracking-tight leading-none">
                PocketRuler<span class="text-emerald-600 dark:text-emerald-400">.app</span>
              </span>
              <span class="text-[10px] ${badgeClasses} font-bold px-2 py-0.5 rounded-full border">${badgeText}</span>
            </div>
            <p class="text-xs text-slate-500 dark:text-slate-400 mt-0.5 hidden sm:block">
              ${subtitle}
            </p>
          </div>
        </a>
      </div>

      <!-- Desktop Navigation Links & Controls -->
      <div class="flex items-center space-x-3 lg:space-x-5">
        <nav class="hidden md:flex items-center space-x-4 lg:space-x-5 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
          
          <!-- All Tools Dropdown -->
          <div class="relative group py-2">
            <button type="button" class="flex items-center gap-1.5 text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-bold transition-colors focus:outline-none" id="toolsMenuBtn" aria-expanded="false" aria-haspopup="true">
              <span>All Tools</span>
              <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div class="absolute left-0 top-full mt-1 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-2 hidden group-hover:block transition-all z-50">
              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1">Active Web Apps</div>
              
              <a href="${root}freelance-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Freelance Rate vs Retainer</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Capacity, burnout &amp; pitch generator</div>
                </div>
              </a>

              <a href="${root}w2-1099-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">W-2 to 1099 Calculator</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Break-even rate &amp; SECA tax converter</div>
                </div>
              </a>

              <a href="${root}relocation-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Expat Tax &amp; Relocation</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">85+ cities &bull; Tax arbitrage simulator</div>
                </div>
              </a>

              <a href="${root}ai-token-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">AI Token &amp; API Cost Calculator</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">GPT-4o, Claude 3.5, Gemini &bull; Caching</div>
                </div>
              </a>

              <a href="${root}runway-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Solopreneur Runway &amp; Burn Rate</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Cash horizon &amp; burnout gauge</div>
                </div>
              </a>

              <a href="${root}budget-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">50/30/20 Budget Splitter</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Paycheck allocation &amp; savings</div>
                </div>
              </a>

              <a href="${root}subscription-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Subscription &amp; Silent Drain Audit</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">SaaS leak &amp; 5-yr growth</div>
                </div>
              </a>

              <a href="${root}debt-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Debt Snowball vs Avalanche</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Interest savings &amp; payoff timeline</div>
                </div>
              </a>

              <a href="${root}side-hustle-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Side Hustle Profit Calculator</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Etsy, eBay, Fiverr &amp; tax cuts</div>
                </div>
              </a>

              <a href="${root}meeting-cost-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Real-Time Meeting Cost Ticker</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Second-by-second burn rate</div>
                </div>
              </a>

              <a href="${root}screen-time-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Screen Time Opportunity Cost</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Lost hours &amp; financial value</div>
                </div>
              </a>

              <a href="${root}playback-speed-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Audiobook &amp; Video Speed Saver</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Exact listening time saved</div>
                </div>
              </a>

              <a href="${root}car-cost-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Car Ownership vs Uber &amp; Transit</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Monthly mobility comparison</div>
                </div>
              </a>

              <a href="${root}sleep-calculator/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Sleep Cycle &amp; REM Optimizer</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Optimal wake &amp; bed times</div>
                </div>
              </a>

              <a href="${root}recipe-scaler/" class="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors mt-0.5">
                <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
                <div>
                  <div class="font-bold text-xs">Recipe Scaler &amp; Unit Converter</div>
                  <div class="text-[11px] text-slate-400 dark:text-slate-500 font-normal">Serving size ingredient scaling</div>
                </div>
              </a>

              <div class="border-t border-slate-100 dark:border-slate-700 my-1"></div>
              <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 py-1">Editorial Guides</div>
              <a href="${root}relocation-calculator/guide.html" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span>📖 Expat Tax &amp; Visa Deep Dive</span>
              </a>
              <a href="${root}relocation-calculator/methodology.html" class="flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700/50 text-xs text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors">
                <span>📐 Methodology &amp; Formulas</span>
              </a>
            </div>
          </div>

          <!-- Direct Links -->
          <a href="${root}freelance-calculator/" class="${activeNav === 'freelance' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-emerald-600 dark:hover:text-emerald-400'} transition-colors">Freelance Tool</a>
          <a href="${root}relocation-calculator/" class="${activeNav === 'relocation' ? 'text-blue-600 dark:text-blue-400 font-bold' : 'hover:text-blue-600 dark:hover:text-blue-400'} transition-colors">Relocation Tool</a>
          <a href="${root}blog/" class="${activeNav === 'blog' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-emerald-600 dark:hover:text-emerald-400'} transition-colors">Blog</a>
          <a href="${root}about.html" class="${activeNav === 'about' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'} transition-colors">About</a>
          <a href="${root}contact.html" class="${activeNav === 'contact' ? 'text-emerald-600 dark:text-emerald-400 font-bold' : 'hover:text-slate-900 dark:hover:text-white'} transition-colors">Contact</a>
        </nav>

        <!-- Dynamic Page Specific Actions Container (e.g. currency select, share) -->
        <div id="headerCustomControlsMount" class="flex items-center space-x-2"></div>

        <!-- Theme Toggle Button -->
        <button type="button" data-theme-toggle class="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 shrink-0" aria-label="Toggle Theme" title="Toggle theme">
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/></svg>
        </button>

        <!-- Mobile Hamburger Button -->
        <div class="flex items-center md:hidden">
          <button type="button" id="openMobileMenuBtn" class="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500" aria-label="Open Mobile Menu" aria-expanded="false" aria-controls="mobileDrawer">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

    </div>
    `;

    // Re-mount custom controls if they existed
    if (customControls) {
      const mount = header.querySelector('#headerCustomControlsMount');
      if (mount) {
        mount.appendChild(customControls);
      }
    }
  }

  /**
   * Render Universal 4-Column Footer
   */
  function renderFooter() {
    const footer = document.getElementById('site-footer');
    if (!footer) return;

    const root = getRootPath(footer);

    footer.className = 'w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-10 text-xs text-slate-500 dark:text-slate-400 transition-colors duration-200 mt-auto';

    footer.innerHTML = `
    <div class="max-w-6xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
      
      <!-- Col 1: Brand & Mission -->
      <div class="space-y-3">
        <div class="flex items-center space-x-2">
          <img src="${root}logo.svg" alt="PocketRuler.app Logo" class="w-5 h-5" width="20" height="20" />
          <span class="text-sm font-black text-slate-900 dark:text-white">PocketRuler<span class="text-emerald-600 dark:text-emerald-400">.app</span></span>
        </div>
        <p class="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
          The one-stop suite of free client-side calculation engines for solopreneurs, digital nomads, and independent consultants. Free forever, browser-powered, zero sign-ups.
        </p>
        <p class="text-[10px] text-slate-400 dark:text-slate-500">
          100% Client-Side Privacy &bull; &copy; 2026 PocketRuler.app. All rights reserved.
        </p>
      </div>

      <!-- Col 2: Active Web Apps -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Web Apps</h4>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li><a href="${root}freelance-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Freelance Rate vs Retainer</a></li>
          <li><a href="${root}w2-1099-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">W-2 to 1099 Calculator</a></li>
          <li><a href="${root}relocation-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Expat Tax &amp; Relocation</a></li>
          <li><a href="${root}ai-token-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Token &amp; API Cost</a></li>
          <li><a href="${root}runway-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Solopreneur Runway &amp; Burn Rate</a></li>
        </ul>
      </div>

      <!-- Col 3: Resources & Guides -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Resources</h4>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li><a href="${root}blog/" class="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors">Blog &amp; Industry Trends</a></li>
          <li><a href="${root}relocation-calculator/guide.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Expat Tax &amp; Visa Guide</a></li>
          <li><a href="${root}relocation-calculator/methodology.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Methodology &amp; Formulas</a></li>
          <li><a href="${root}about.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us &amp; Mission</a></li>
          <li><a href="${root}contact.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact &amp; Feedback</a></li>
        </ul>
      </div>

      <!-- Col 4: Legal & AdSense Compliance -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Legal &amp; Privacy</h4>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li><a href="${root}privacy.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy &amp; Cookies</a></li>
          <li><a href="${root}terms.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</a></li>
          <li><a href="${root}disclaimer.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Financial Disclaimer</a></li>
          <li><a href="${root}ads.txt" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ads.txt (IAB Standard)</a></li>
        </ul>
      </div>

    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
      <p>Precision tools engineered with privacy-first client-side architecture. No tracking of financial figures.</p>
      <div class="flex items-center space-x-4">
        <a href="${root}privacy.html" class="hover:text-slate-600 dark:hover:text-slate-300">Privacy</a>
        <span>&bull;</span>
        <a href="${root}terms.html" class="hover:text-slate-600 dark:hover:text-slate-300">Terms</a>
        <span>&bull;</span>
        <a href="${root}disclaimer.html" class="hover:text-slate-600 dark:hover:text-slate-300">Disclaimer</a>
      </div>
    </div>
    `;
  }

  /**
   * Render Universal Mobile Drawer
   */
  function renderDrawer() {
    let backdrop = document.getElementById('mobileDrawerBackdrop');
    let drawer = document.getElementById('mobileDrawer');

    const root = getRootPath();

    if (!backdrop) {
      backdrop = document.createElement('div');
      backdrop.id = 'mobileDrawerBackdrop';
      backdrop.className = 'fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm opacity-0 hidden transition-opacity duration-300 md:hidden';
      backdrop.setAttribute('aria-hidden', 'true');
      document.body.appendChild(backdrop);
    }

    if (!drawer) {
      drawer = document.createElement('aside');
      drawer.id = 'mobileDrawer';
      drawer.className = 'fixed inset-y-0 right-0 z-50 w-80 max-w-[85vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out hidden md:hidden flex flex-col justify-between';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'Mobile Navigation Menu');
      document.body.appendChild(drawer);
    }

    drawer.innerHTML = `
    <!-- Drawer Header -->
    <div class="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <a href="${root || '/'}" class="flex items-center space-x-2.5">
        <div class="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 p-1 flex items-center justify-center">
          <img src="${root}logo.svg" alt="PocketRuler.app Logo" class="w-5 h-5" width="20" height="20" />
        </div>
        <span class="text-base font-black text-slate-900 dark:text-white tracking-tight">
          PocketRuler<span class="text-emerald-600 dark:text-emerald-400">.app</span>
        </span>
      </a>
      <button type="button" id="closeMobileMenuBtn" class="p-2 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors" aria-label="Close Mobile Navigation">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>

    <!-- Drawer Navigation Content -->
    <div class="p-5 space-y-6 flex-grow overflow-y-auto">
      <!-- Active Web Apps -->
      <div class="space-y-2">
        <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Active Web Apps</div>
        
        <a href="${root}freelance-calculator/" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Freelance Rate vs Retainer</span>
          </div>
          <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">Launch</span>
        </a>

        <a href="${root}w2-1099-calculator/" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>W-2 to 1099 Calculator</span>
          </div>
          <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">Launch</span>
        </a>

        <a href="${root}relocation-calculator/" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-blue-500 shrink-0"></span>
            <span>Expat Tax &amp; Relocation</span>
          </div>
          <span class="text-[10px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full font-bold">Launch</span>
        </a>

        <a href="${root}ai-token-calculator/" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-purple-500 shrink-0"></span>
            <span>AI Token &amp; API Cost Calculator</span>
          </div>
          <span class="text-[10px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-2 py-0.5 rounded-full font-bold">Launch</span>
        </a>

        <a href="${root}runway-calculator/" class="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <div class="flex items-center gap-2.5">
            <span class="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
            <span>Solopreneur Runway &amp; Burn Rate</span>
          </div>
          <span class="text-[10px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-2 py-0.5 rounded-full font-bold">Launch</span>
        </a>
      </div>

      <!-- Editorial & Methodology -->
      <div class="space-y-1">
        <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Guides &amp; Methodology</div>
        <a href="${root}relocation-calculator/guide.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          📖 Expat Tax &amp; Visa Deep Dive
        </a>
        <a href="${root}relocation-calculator/methodology.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          📐 Calculation Methodology &amp; Sources
        </a>
      </div>

      <!-- Suite Directory & Company -->
      <div class="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">PocketRuler Suite</div>
        <a href="${root}blog/" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          📰 Blog &amp; Industry Trends
        </a>
        <a href="${root}about.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          About PocketRuler
        </a>
        <a href="${root}contact.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          Contact &amp; Feedback
        </a>
        <a href="${root}privacy.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          Privacy Policy
        </a>
        <a href="${root}terms.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          Terms of Service
        </a>
        <a href="${root}disclaimer.html" class="block px-3 py-2 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white transition-colors">
          Financial Disclaimer
        </a>
      </div>
    </div>

    <!-- Drawer Footer with Theme Toggle -->
    <div class="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
      <span class="text-xs font-medium text-slate-600 dark:text-slate-300">Theme</span>
      <button type="button" data-theme-toggle class="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-medium text-slate-700 dark:text-slate-200 shadow-2xs hover:bg-slate-50 dark:hover:bg-slate-650 transition">
        <span>Toggle Mode</span>
      </button>
    </div>
    `;
  }

  // Master Initializer
  function init() {
    renderHeader();
    renderFooter();
    renderDrawer();

    // Notify Theme controller if loaded to update icons
    if (window.PocketRulerTheme && typeof window.PocketRulerTheme.applyTheme === 'function') {
      window.PocketRulerTheme.applyTheme(window.PocketRulerTheme.getTheme());
    }
  }

  // Run automatically when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  // Expose global API
  window.PocketRulerComponents = {
    renderHeader: renderHeader,
    renderFooter: renderFooter,
    renderDrawer: renderDrawer,
    init: init
  };

})();
