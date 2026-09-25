/**
 * PocketRuler.app - Unified Theme Controller
 * Supports OS preference detection (prefers-color-scheme), real-time system changes,
 * manual toggle persistence via localStorage, zero-FOUC sync, and custom event dispatch.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'pocketruler_theme';

  // Sun and Moon SVG icons for toggles
  const ICONS = {
    sun: `<svg class="w-5 h-5 text-amber-400 transition-transform duration-300 rotate-0 hover:rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>`,
    moon: `<svg class="w-5 h-5 text-slate-600 dark:text-slate-300 transition-transform duration-300 -rotate-12 hover:rotate-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>`
  };

  /**
   * Determine the active theme based on localStorage and OS preference
   * @returns {'dark' | 'light'}
   */
  function getEffectiveTheme() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === 'dark' || stored === 'light') {
        return stored;
      }
    } catch (e) {
      // localStorage might be unavailable in private browsing mode
    }

    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  /**
   * Apply theme to <html> tag, update UI toggle buttons, and emit event
   * @param {'dark' | 'light'} theme
   */
  function applyTheme(theme) {
    const root = document.documentElement;
    const isDark = theme === 'dark';

    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
      root.style.colorScheme = 'light';
    }

    // Update all theme toggle buttons across the page
    const toggleButtons = document.querySelectorAll('[data-theme-toggle]');
    toggleButtons.forEach(btn => {
      // In dark mode, show Sun icon (to switch to light); in light mode, show Moon icon (to switch to dark)
      btn.innerHTML = isDark ? ICONS.sun : ICONS.moon;
      btn.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('title', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    });

    // Dispatch custom event for charts, canvas, and third-party components
    window.dispatchEvent(new CustomEvent('themechange', {
      detail: { theme, isDark }
    }));
  }

  /**
   * Toggle between light and dark themes and persist choice
   */
  function toggleTheme() {
    const currentTheme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    try {
      localStorage.setItem(STORAGE_KEY, newTheme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }

    applyTheme(newTheme);
  }

  // Expose global controller
  window.PocketRulerTheme = {
    getTheme: getEffectiveTheme,
    applyTheme: applyTheme,
    toggleTheme: toggleTheme
  };

  // Immediate initialization in case inline script didn't run
  const initialTheme = getEffectiveTheme();
  applyTheme(initialTheme);

  // Setup DOM listeners once document is ready
  function initThemeControls() {
    // Re-apply to populate buttons once DOM exists
    applyTheme(getEffectiveTheme());

    // Bind click events on all theme toggle elements
    document.addEventListener('click', function (e) {
      const toggleBtn = e.target.closest('[data-theme-toggle]');
      if (toggleBtn) {
        e.preventDefault();
        toggleTheme();
      }
    });

    // Mobile drawer controls with dynamic event delegation
    function getDrawerElements() {
      return {
        drawer: document.getElementById('mobileDrawer'),
        backdrop: document.getElementById('mobileDrawerBackdrop')
      };
    }

    function openDrawer() {
      const { drawer, backdrop } = getDrawerElements();
      if (!drawer) return;
      drawer.classList.remove('hidden');
      if (backdrop) backdrop.classList.remove('hidden');
      setTimeout(() => {
        drawer.classList.remove('translate-x-full');
        drawer.classList.add('translate-x-0');
        if (backdrop) {
          backdrop.classList.remove('opacity-0');
          backdrop.classList.add('opacity-100');
        }
      }, 10);
      document.body.classList.add('overflow-hidden');
    }

    function closeDrawer() {
      const { drawer, backdrop } = getDrawerElements();
      if (!drawer) return;
      drawer.classList.remove('translate-x-0');
      drawer.classList.add('translate-x-full');
      if (backdrop) {
        backdrop.classList.remove('opacity-100');
        backdrop.classList.add('opacity-0');
      }
      setTimeout(() => {
        drawer.classList.add('hidden');
        if (backdrop) backdrop.classList.add('hidden');
        document.body.classList.remove('overflow-hidden');
      }, 300);
    }

    // Expose drawer controls globally
    window.PocketRulerDrawer = {
      open: openDrawer,
      close: closeDrawer
    };

    // Delegated click listener for drawer triggers
    document.addEventListener('click', function (e) {
      if (e.target.closest('#openMobileMenuBtn') || e.target.closest('#mobileMenuToggle')) {
        e.preventDefault();
        openDrawer();
      } else if (e.target.closest('#closeMobileMenuBtn') || e.target.closest('#mobileDrawerClose')) {
        e.preventDefault();
        closeDrawer();
      } else if (e.target.id === 'mobileDrawerBackdrop') {
        e.preventDefault();
        closeDrawer();
      }
    });

    // Escape key closes mobile drawer
    document.addEventListener('keydown', function (e) {
      const { drawer } = getDrawerElements();
      if (e.key === 'Escape' && drawer && !drawer.classList.contains('hidden')) {
        closeDrawer();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initThemeControls);
  } else {
    initThemeControls();
  }

  // Real-time listener for OS/Windows theme changes (Night Light, System Dark Mode toggle)
  if (window.matchMedia) {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    mediaQuery.addEventListener('change', function (e) {
      let stored = null;
      try {
        stored = localStorage.getItem(STORAGE_KEY);
      } catch (err) {}

      // If user hasn't set an explicit manual override, follow the OS dynamically
      if (!stored) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  }

  // Cross-tab synchronization
  window.addEventListener('storage', function (e) {
    if (e.key === STORAGE_KEY && (e.newValue === 'dark' || e.newValue === 'light')) {
      applyTheme(e.newValue);
    }
  });

})();
