/* ============================================================
   IdeaRoast AI — App JS
   Router, ThemeManager, Toast system, App init
   ============================================================ */

// ─── Router ───────────────────────────────────────────────
class Router {
  constructor() {
    this.views = {};
    this.currentView = null;
    this.beforeEach = null;
  }

  register(name, el) {
    this.views[name] = el;
    el.style.display = 'none';
  }

  navigate(name, params = {}) {
    if (this.beforeEach) {
      const shouldContinue = this.beforeEach(name, params);
      if (!shouldContinue) return;
    }

    // Fade out current view
    if (this.currentView && this.views[this.currentView]) {
      const prev = this.views[this.currentView];
      prev.classList.add('view-exit');
      setTimeout(() => {
        prev.style.display = 'none';
        prev.classList.remove('view-exit');
      }, 250);
    }

    // Show new view
    const next = this.views[name];
    if (!next) return;

    this.currentView = name;
    next.style.display = '';
    next.classList.add('view-enter');
    requestAnimationFrame(() => {
      next.classList.add('view-enter');
    });
    setTimeout(() => next.classList.remove('view-enter'), 500);

    // Update hash
    const hash = name === 'landing' ? '' : `#${name}`;
    window.history.pushState({ view: name, params }, '', hash || window.location.pathname);

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'instant' });

    // Emit event
    window.dispatchEvent(new CustomEvent('routechange', { detail: { view: name, params } }));
  }

  init() {
    // Parse initial view from hash
    const hash = window.location.hash.replace('#', '');
    const initialView = hash && this.views[hash] ? hash : 'landing';
    this.navigate(initialView);

    // Handle back/forward
    window.addEventListener('popstate', (e) => {
      if (e.state?.view) {
        this.navigate(e.state.view, e.state.params || {});
      } else {
        this.navigate('landing');
      }
    });
  }
}

// ─── ThemeManager ─────────────────────────────────────────
class ThemeManager {
  constructor() {
    this.current = localStorage.getItem('idearoast_theme') || 'dark';
    this.apply();
  }

  apply() {
    document.documentElement.setAttribute('data-theme', this.current);
    const icon = document.getElementById('theme-icon');
    if (icon) icon.textContent = this.current === 'dark' ? '☀️' : '🌙';
  }

  toggle() {
    this.current = this.current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('idearoast_theme', this.current);
    this.apply();
  }
}

// ─── Toast System ─────────────────────────────────────────
class Toast {
  static container = null;

  static init() {
    this.container = document.getElementById('toast-container');
  }

  static show(message, type = 'info', duration = 4000) {
    const icons = { success: '✅', error: '❌', info: 'ℹ️', warning: '⚠️' };
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <span class="toast-icon">${icons[type] || 'ℹ️'}</span>
      <span class="toast-text">${message}</span>
    `;
    this.container.appendChild(toast);

    setTimeout(() => {
      toast.classList.add('exit');
      setTimeout(() => toast.remove(), 280);
    }, duration);

    return toast;
  }
}

// ─── Counter Animation ─────────────────────────────────────
function animateCounter(el, target, duration = 2000, suffix = '') {
  const start = performance.now();
  const startVal = 0;
  const update = (ts) => {
    const elapsed = ts - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(startVal + eased * (target - startVal));
    el.textContent = current.toLocaleString() + suffix;
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target.toLocaleString() + suffix;
  };
  requestAnimationFrame(update);
}

// ─── Scroll Animations ─────────────────────────────────────
function initScrollAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        // Counter animation
        if (entry.target.dataset.counter) {
          const target = parseInt(entry.target.dataset.counter);
          const suffix = entry.target.dataset.suffix || '';
          animateCounter(entry.target, target, 1800, suffix);
          observer.unobserve(entry.target);
        }
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.scroll-reveal, [data-counter]').forEach(el => observer.observe(el));
}

// ─── Scrollspy for Report Subnav ──────────────────────────
function initScrollspy(navSelector, sectionSelector) {
  const navItems = document.querySelectorAll(navSelector);
  const sections = document.querySelectorAll(sectionSelector);
  if (!navItems.length || !sections.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navItems.forEach(item => {
          item.classList.toggle('active', item.dataset.target === id);
        });
      }
    });
  }, { threshold: 0.3, rootMargin: '-120px 0px -60% 0px' });

  sections.forEach(s => observer.observe(s));
}

// ─── Mobile Nav ───────────────────────────────────────────
function initMobileNav() {
  const hamburger = document.getElementById('nav-hamburger');
  const drawer = document.getElementById('mobile-nav-drawer');
  if (!hamburger || !drawer) return;

  hamburger.addEventListener('click', () => {
    drawer.classList.toggle('open');
    const spans = hamburger.querySelectorAll('span');
    if (drawer.classList.contains('open')) {
      spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
      spans[1].style.opacity = '0';
      spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
    } else {
      spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
  });

  drawer.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      drawer.classList.remove('open');
      hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
  });
}

// ─── App ──────────────────────────────────────────────────
class App {
  constructor() {
    this.router = new Router();
    this.theme = new ThemeManager();
  }

  init() {
    Toast.init();

    // Register views
    ['landing', 'wizard', 'report', 'dashboard'].forEach(name => {
      const el = document.getElementById(`view-${name}`);
      if (el) this.router.register(name, el);
    });

    // Init modules
    if (window.AuthManager)     window.AuthManager.init();
    if (window.WizardManager)   window.WizardManager.init();
    if (window.DashboardManager) window.DashboardManager.init();

    // Route guard: require API key before wizard
    this.router.beforeEach = (name) => {
      if (name === 'wizard') {
        const apiKey = localStorage.getItem('idearoast_apikey');
        if (!apiKey) {
          document.getElementById('apikey-dialog')?.showModal();
          return false;
        }
      }
      return true;
    };

    this.router.init();

    // Global nav events
    document.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate(el.dataset.nav);
      });
    });

    // Theme toggle
    document.getElementById('theme-toggle')?.addEventListener('click', () => this.theme.toggle());

    initMobileNav();
    initScrollAnimations();

    // Auth-gated CTA buttons
    document.querySelectorAll('[data-cta="roast"]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('wizard');
      });
    });

    // Dashboard nav
    document.querySelectorAll('[data-nav="dashboard"]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        this.router.navigate('dashboard');
        if (window.DashboardManager) window.DashboardManager.refresh();
      });
    });

    // Smooth scroll for in-page anchors (landing)
    document.querySelectorAll('a[href^="#section-"]').forEach(a => {
      a.addEventListener('click', (e) => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // Hero float animation on scroll
    const heroCard = document.querySelector('.hero-float-card');
    if (heroCard) {
      window.addEventListener('scroll', () => {
        const scrolled = window.scrollY;
        heroCard.style.transform = `translateY(${scrolled * 0.05}px)`;
      }, { passive: true });
    }
  }
}

// ─── Boot ─────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  window.APP = new App();
  window.APP.init();
  window.ROUTER = window.APP.router;
  window.TOAST = Toast;
});

// Expose helpers globally
window.navigateTo = (view, params) => window.APP?.router.navigate(view, params);
window.showToast  = (msg, type)     => Toast.show(msg, type);
