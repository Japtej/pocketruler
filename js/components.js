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
    // Always use site root
    return '/';
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
        <nav class="hidden md:flex items-center space-x-4 lg:space-x-6 text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300">
          
          <!-- All Tools Mega Dropdown -->
          <div class="relative group py-2">
            <button type="button" class="flex items-center gap-1.5 text-slate-800 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 font-extrabold transition-colors focus:outline-none" id="toolsMenuBtn" aria-expanded="false" aria-haspopup="true">
              <svg class="w-4 h-4 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" /></svg>
              <span>All Tools (18)</span>
              <svg class="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-transform group-hover:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg>
            </button>
            <div class="absolute -left-20 sm:-left-36 lg:-left-44 top-full mt-1 w-[820px] max-w-[92vw] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-5 hidden group-hover:block transition-all z-50">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
                
                <!-- Col 1: Money, Freelance & Rates -->
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span class="w-2 h-2 rounded-full bg-emerald-500"></span>
                    <span>Finance &amp; Rates</span>
                  </div>
                  <a href="${root}freelance-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Freelance Rate vs Retainer</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Hourly, day rate &amp; pitch memo</div>
                    </div>
                  </a>
                  <a href="${root}w2-1099-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">W-2 to 1099 Converter</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Break-even solver &amp; SECA tax</div>
                    </div>
                  </a>
                  <a href="${root}invoice-generator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs flex items-center gap-1">
                        Private Invoice Generator
                        <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1 py-0.2 rounded font-bold">New</span>
                      </div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">100% in-browser vector PDF</div>
                    </div>
                  </a>
                  <a href="${root}budget-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">50/30/20 Budget Splitter</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Paycheck take-home allocations</div>
                    </div>
                  </a>
                  <a href="${root}runway-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Solopreneur Runway</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Net burn &amp; survival horizon</div>
                    </div>
                  </a>
                  <a href="${root}debt-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Debt Snowball vs Avalanche</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Interest savings payoff matrix</div>
                    </div>
                  </a>
                  <a href="${root}subscription-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Subscription Silent Drain</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">SaaS leak &amp; 5-yr growth loss</div>
                    </div>
                  </a>
                  <a href="${root}side-hustle-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-700 dark:text-slate-200 hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Side Hustle Profit Margin</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Etsy, eBay, Fiverr &amp; true cuts</div>
                    </div>
                  </a>
                </div>

                <!-- Col 2: Global Work & Teams -->
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span class="w-2 h-2 rounded-full bg-blue-500"></span>
                    <span>Global Work &amp; Teams</span>
                  </div>
                  <a href="${root}timezone-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs flex items-center gap-1">
                        Team Timezone Overlap
                        <span class="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1 py-0.2 rounded font-bold">New</span>
                      </div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Golden hour matrix &amp; invite</div>
                    </div>
                  </a>
                  <a href="${root}relocation-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Expat Tax &amp; Relocation</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">85+ cities &bull; Tax arbitrage</div>
                    </div>
                  </a>
                  <a href="${root}meeting-cost-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Meeting Cost Ticker</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Live per-second burn ticker</div>
                    </div>
                  </a>
                  <a href="${root}screen-time-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Screen Time Cost</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Lost hours &amp; financial impact</div>
                    </div>
                  </a>
                  <a href="${root}car-cost-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-700 dark:text-slate-200 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Car vs Transit &amp; Uber</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Total mobility true cost</div>
                    </div>
                  </a>
                </div>

                <!-- Col 3: Creators & Everyday Math -->
                <div class="space-y-1.5">
                  <div class="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 pb-1 border-b border-slate-100 dark:border-slate-800">
                    <span class="w-2 h-2 rounded-full bg-purple-500"></span>
                    <span>Creators &amp; Everyday Math</span>
                  </div>
                  <a href="${root}creator-rate-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs flex items-center gap-1">
                        Creator Sponsorship Rates
                        <span class="text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1 py-0.2 rounded font-bold">New</span>
                      </div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Brand deal pricing &amp; rights memo</div>
                    </div>
                  </a>
                  <a href="${root}ai-token-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">AI Token &amp; API Cost</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">GPT-4o, Claude 3.5, Gemini, DeepSeek</div>
                    </div>
                  </a>
                  <a href="${root}playback-speed-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Playback Speed Saver</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Audiobook &amp; video time saved</div>
                    </div>
                  </a>
                  <a href="${root}sleep-calculator/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Sleep Cycle &amp; REM Clock</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">90-minute sleep cycle timing</div>
                    </div>
                  </a>
                  <a href="${root}recipe-scaler/" class="flex items-start gap-2 p-1.5 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-700 dark:text-slate-200 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                    <div>
                      <div class="font-bold text-xs">Recipe Scaler &amp; Units</div>
                      <div class="text-[10px] text-slate-400 dark:text-slate-500">Serving scaling &amp; baker grams</div>
                    </div>
                  </a>
                </div>

              </div>

              <!-- Mega Dropdown Footer -->
              <div class="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                <span class="flex items-center gap-1.5">
                  <svg class="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/></svg>
                  100% Client-Side Calculations &bull; Zero Data Collected
                </span>
                <div class="flex items-center gap-3 font-semibold">
                  <a href="${root}editorial-standards.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Editorial Standards</a>
                  <span>&bull;</span>
                  <a href="${root}relocation-calculator/methodology.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Methodology</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Direct Navigation Links -->
          <a href="${root}blog/" class="${activeNav === 'blog' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'hover:text-emerald-600 dark:hover:text-emerald-400'} transition-colors">Blog</a>
          <a href="${root}editorial-standards.html" class="${activeNav === 'editorial' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'} transition-colors">Editorial</a>
          <a href="${root}about.html" class="${activeNav === 'about' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'} transition-colors">About</a>
          <a href="${root}contact.html" class="${activeNav === 'contact' ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : 'hover:text-slate-900 dark:hover:text-white'} transition-colors">Contact</a>
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
          The everyday digital pocket knife: fast, client-side calculation engines for remote workers, creators, and freelancers. Free forever, browser-powered, zero data tracking.
        </p>
        <p class="text-[10px] text-slate-400 dark:text-slate-500">
          100% Client-Side Privacy &bull; &copy; 2026 PocketRuler.app. All rights reserved.
        </p>
      </div>

      <!-- Col 2: Finance & Rates -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Finance &amp; Rates</h4>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li><a href="${root}freelance-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Freelance Rate vs Retainer</a></li>
          <li><a href="${root}w2-1099-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">W-2 to 1099 Converter</a></li>
          <li><a href="${root}invoice-generator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Private Invoice Generator</a></li>
          <li><a href="${root}budget-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">50/30/20 Budget Splitter</a></li>
          <li><a href="${root}runway-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Solopreneur Runway</a></li>
          <li><a href="${root}debt-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Debt Snowball vs Avalanche</a></li>
          <li><a href="${root}side-hustle-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Side Hustle Profit Margin</a></li>
        </ul>
      </div>

      <!-- Col 3: Teams, Creators & Math -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Remote &amp; Everyday</h4>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li><a href="${root}timezone-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Team Timezone Overlap Matrix</a></li>
          <li><a href="${root}relocation-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Expat Tax &amp; Relocation</a></li>
          <li><a href="${root}creator-rate-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Creator Brand Sponsorship Rates</a></li>
          <li><a href="${root}ai-token-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">AI Token &amp; API Cost</a></li>
          <li><a href="${root}meeting-cost-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Meeting Cost Burn Ticker</a></li>
          <li><a href="${root}screen-time-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Screen Time Opportunity Cost</a></li>
          <li><a href="${root}sleep-calculator/" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Sleep Cycle &amp; REM Clock</a></li>
        </ul>
      </div>

      <!-- Col 4: Resources & Compliance -->
      <div class="space-y-2.5">
        <h4 class="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Editorial &amp; Legal</h4>
        <ul class="space-y-1.5 text-slate-600 dark:text-slate-300">
          <li><a href="${root}blog/" class="hover:text-emerald-600 dark:hover:text-emerald-400 font-semibold transition-colors">Blog &amp; Industry Trends</a></li>
          <li><a href="${root}editorial-standards.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Editorial Standards</a></li>
          <li><a href="${root}relocation-calculator/methodology.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Formulas &amp; Methodology</a></li>
          <li><a href="${root}about.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">About Us</a></li>
          <li><a href="${root}contact.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Contact &amp; Feedback</a></li>
          <li><a href="${root}privacy.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Privacy Policy</a></li>
          <li><a href="${root}terms.html" class="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">Terms of Service</a></li>
          <li><a href="${root}ads.txt" class="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">ads.txt (IAB Standard)</a></li>
        </ul>
      </div>

    </div>

    <div class="max-w-6xl mx-auto px-4 sm:px-6 pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400 dark:text-slate-500">
      <p>Precision calculation engines running 100% client-side in your browser. Zero tracking of private inputs.</p>
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
      drawer.className = 'fixed inset-y-0 right-0 z-50 w-84 max-w-[88vw] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl transform translate-x-full transition-transform duration-300 ease-in-out hidden md:hidden flex flex-col justify-between';
      drawer.setAttribute('role', 'dialog');
      drawer.setAttribute('aria-modal', 'true');
      drawer.setAttribute('aria-label', 'Mobile Navigation Menu');
      document.body.appendChild(drawer);
    }

    drawer.innerHTML = `
    <!-- Drawer Header -->
    <div class="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
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
    <div class="p-4 space-y-5 flex-grow overflow-y-auto">
      
      <!-- Category 1: Finance & Rates -->
      <div class="space-y-1.5">
        <div class="text-[10px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400 px-1">
          Finance &amp; Rates (8)
        </div>
        <a href="${root}freelance-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Freelance Rate vs Retainer</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}w2-1099-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>W-2 to 1099 Converter</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}invoice-generator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span class="flex items-center gap-1.5">
            Private Invoice Generator
            <span class="text-[8px] bg-emerald-600 text-white px-1 py-0.2 rounded font-bold">NEW</span>
          </span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}budget-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>50/30/20 Budget Splitter</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}runway-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Solopreneur Runway</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}debt-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Debt Snowball vs Avalanche</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}subscription-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Subscription Silent Drain</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}side-hustle-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Side Hustle Profit Margin</span>
          <span class="text-[9px] bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
      </div>

      <!-- Category 2: Global Work & Teams -->
      <div class="space-y-1.5">
        <div class="text-[10px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 px-1">
          Global Work &amp; Teams (5)
        </div>
        <a href="${root}timezone-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span class="flex items-center gap-1.5">
            Team Timezone Overlap
            <span class="text-[8px] bg-blue-600 text-white px-1 py-0.2 rounded font-bold">NEW</span>
          </span>
          <span class="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}relocation-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Expat Tax &amp; Relocation</span>
          <span class="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}meeting-cost-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Meeting Cost Burn Ticker</span>
          <span class="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}screen-time-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Screen Time Cost</span>
          <span class="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}car-cost-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-blue-50 dark:hover:bg-blue-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Car vs Transit &amp; Uber</span>
          <span class="text-[9px] bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
      </div>

      <!-- Category 3: Creators & Everyday Math -->
      <div class="space-y-1.5">
        <div class="text-[10px] font-black uppercase tracking-wider text-purple-600 dark:text-purple-400 px-1">
          Creators &amp; Everyday Math (5)
        </div>
        <a href="${root}creator-rate-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span class="flex items-center gap-1.5">
            Creator Sponsorship Rates
            <span class="text-[8px] bg-purple-600 text-white px-1 py-0.2 rounded font-bold">NEW</span>
          </span>
          <span class="text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}ai-token-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>AI Token &amp; API Cost</span>
          <span class="text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}playback-speed-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Audio &amp; Video Speed Saver</span>
          <span class="text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}sleep-calculator/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Sleep Cycle &amp; REM Clock</span>
          <span class="text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
        <a href="${root}recipe-scaler/" class="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 hover:bg-purple-50 dark:hover:bg-purple-950/40 text-slate-800 dark:text-slate-200 font-bold text-xs transition-colors border border-slate-200/60 dark:border-slate-700">
          <span>Recipe Scaler &amp; Units</span>
          <span class="text-[9px] bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 px-1.5 py-0.5 rounded font-bold">Open</span>
        </a>
      </div>

      <!-- Suite Directory & Company -->
      <div class="space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800">
        <div class="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-1">Resources &amp; Legal</div>
        <a href="${root}blog/" class="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          📰 Blog &amp; Insights
        </a>
        <a href="${root}editorial-standards.html" class="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          📐 Editorial Standards &amp; Data
        </a>
        <a href="${root}about.html" class="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          About PocketRuler
        </a>
        <a href="${root}contact.html" class="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Contact &amp; Feedback
        </a>
        <a href="${root}privacy.html" class="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Privacy Policy
        </a>
        <a href="${root}terms.html" class="block px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          Terms of Service
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
