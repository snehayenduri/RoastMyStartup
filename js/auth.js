/* ============================================================
   IdeaRoast AI — Auth JS
   Auth modal UI, localStorage state management
   ============================================================ */

window.AuthManager = (function () {
  // ─── State ────────────────────────────────────────────────
  let state = {
    user: null,
    roastsUsed: 0,
    plan: 'free',
  };

  const ROAST_LIMIT = { free: 3, pro: Infinity, team: Infinity };

  function loadState() {
    try {
      const saved = localStorage.getItem('idearoast_user');
      if (saved) state = { ...state, ...JSON.parse(saved) };
    } catch (e) {}
  }

  function saveState() {
    localStorage.setItem('idearoast_user', JSON.stringify(state));
  }

  function getUser()      { return state.user; }
  function isLoggedIn()   { return !!state.user; }
  function getRoastsLeft(){ return Math.max(0, ROAST_LIMIT[state.plan] - state.roastsUsed); }
  function canRoast()     { return ROAST_LIMIT[state.plan] === Infinity || state.roastsUsed < ROAST_LIMIT[state.plan]; }
  function consumeRoast() { state.roastsUsed++; saveState(); updateUI(); }

  // ─── DOM Refs ─────────────────────────────────────────────
  const $ = id => document.getElementById(id);

  // ─── Update Nav UI ─────────────────────────────────────────
  function updateUI() {
    const authButtons  = $('nav-auth-buttons');
    const userChip     = $('nav-user-chip');
    const userNameEl   = $('nav-user-name');
    const userAvatarEl = $('nav-user-avatar');
    const usageMeter   = document.querySelector('.sidebar-usage-meter');

    if (isLoggedIn()) {
      authButtons?.classList.add('hidden');
      userChip?.classList.remove('hidden');
      if (userNameEl) userNameEl.textContent = state.user.name.split(' ')[0];
      if (userAvatarEl) userAvatarEl.textContent = state.user.name.slice(0, 2).toUpperCase();

      // Usage in sidebar
      if (usageMeter && state.plan === 'free') {
        const used = state.roastsUsed;
        const limit = ROAST_LIMIT['free'];
        usageMeter.innerHTML = `
          <div class="usage-meter-label">Free plan usage</div>
          <div class="usage-meter-count">${used} / ${limit} roasts used</div>
          <div class="usage-meter-track">
            <div class="usage-meter-fill" style="width: ${(used / limit) * 100}%"></div>
          </div>
          <button class="btn btn-primary btn-sm w-full mt-3" onclick="AuthManager.showUpgrade()">Upgrade to Pro</button>
        `;
        usageMeter.style.display = '';
      } else if (usageMeter) {
        usageMeter.innerHTML = `
          <div class="usage-meter-label">✨ Pro — Unlimited roasts</div>
        `;
      }
    } else {
      authButtons?.classList.remove('hidden');
      userChip?.classList.add('hidden');
      if (usageMeter) usageMeter.style.display = 'none';
    }
  }

  // ─── Login ─────────────────────────────────────────────────
  function login(email, password) {
    // Mock auth — in production, use Firebase Auth
    if (!email || !password) return { error: 'Please enter email and password' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters' };

    const name = email.split('@')[0].replace(/[^a-zA-Z ]/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
    state.user = { email, name, id: btoa(email) };
    saveState();
    updateUI();
    return { success: true };
  }

  // ─── Signup ────────────────────────────────────────────────
  function signup(email, password, name) {
    if (!email || !password || !name) return { error: 'All fields required' };
    if (password.length < 6) return { error: 'Password must be at least 6 characters' };

    state.user = { email, name, id: btoa(email) };
    state.roastsUsed = 0;
    state.plan = 'free';
    saveState();
    updateUI();
    return { success: true };
  }

  // ─── Logout ────────────────────────────────────────────────
  function logout() {
    state.user = null;
    saveState();
    updateUI();
    window.navigateTo?.('landing');
    window.showToast?.('Signed out successfully', 'info');
  }

  // ─── Modal Logic ───────────────────────────────────────────
  function showLogin() {
    const dialog = $('auth-dialog');
    if (!dialog) return;
    renderLoginForm(dialog);
    dialog.showModal();
  }

  function showSignup() {
    const dialog = $('auth-dialog');
    if (!dialog) return;
    renderSignupForm(dialog);
    dialog.showModal();
  }

  function showUpgrade() {
    window.navigateTo?.('landing');
    setTimeout(() => {
      document.querySelector('#section-pricing')?.scrollIntoView({ behavior: 'smooth' });
    }, 300);
  }

  function renderLoginForm(dialog) {
    dialog.querySelector('.auth-dialog-inner').innerHTML = `
      <div class="auth-dialog-header">
        <div class="auth-dialog-icon">🔥</div>
        <h2 class="auth-dialog-title">Welcome back</h2>
        <p class="auth-dialog-sub">Sign in to your IdeaRoast AI account</p>
      </div>

      <button class="btn-google" id="auth-google-btn">
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </button>

      <div class="auth-divider">or continue with email</div>

      <form id="auth-form" novalidate>
        <div class="form-group mb-4">
          <label class="form-label" for="auth-email">Email</label>
          <input class="form-input" type="email" id="auth-email" placeholder="you@example.com" autocomplete="email" required>
          <span class="form-error" id="auth-email-error"></span>
        </div>
        <div class="form-group mb-5">
          <label class="form-label" for="auth-password">Password</label>
          <input class="form-input" type="password" id="auth-password" placeholder="••••••••" autocomplete="current-password" minlength="6" required>
          <span class="form-error" id="auth-pass-error"></span>
        </div>
        <button type="submit" class="btn btn-primary w-full btn-lg">
          <span class="btn-text">Sign In</span>
        </button>
      </form>
      <p class="auth-switch">Don't have an account? <a id="switch-to-signup">Sign up free</a></p>
    `;
    wireAuthForm(dialog, 'login');
  }

  function renderSignupForm(dialog) {
    dialog.querySelector('.auth-dialog-inner').innerHTML = `
      <div class="auth-dialog-header">
        <div class="auth-dialog-icon">🚀</div>
        <h2 class="auth-dialog-title">Create your account</h2>
        <p class="auth-dialog-sub">Get 3 free startup roasts — no credit card required</p>
      </div>

      <button class="btn-google" id="auth-google-btn">
        <svg width="18" height="18" viewBox="0 0 18 18"><path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/><path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/><path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"/><path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z"/></svg>
        Continue with Google
      </button>

      <div class="auth-divider">or create with email</div>

      <form id="auth-form" novalidate>
        <div class="form-group mb-4">
          <label class="form-label" for="auth-name">Full name</label>
          <input class="form-input" type="text" id="auth-name" placeholder="Jane Smith" autocomplete="name" required>
          <span class="form-error" id="auth-name-error"></span>
        </div>
        <div class="form-group mb-4">
          <label class="form-label" for="auth-email">Email</label>
          <input class="form-input" type="email" id="auth-email" placeholder="you@example.com" autocomplete="email" required>
          <span class="form-error" id="auth-email-error"></span>
        </div>
        <div class="form-group mb-5">
          <label class="form-label" for="auth-password">Password</label>
          <input class="form-input" type="password" id="auth-password" placeholder="Min. 6 characters" autocomplete="new-password" minlength="6" required>
          <span class="form-error" id="auth-pass-error"></span>
        </div>
        <button type="submit" class="btn btn-primary w-full btn-lg">
          <span class="btn-text">Create Free Account</span>
        </button>
      </form>
      <p class="auth-switch">Already have an account? <a id="switch-to-login">Sign in</a></p>
    `;
    wireAuthForm(dialog, 'signup');
  }

  function wireAuthForm(dialog, mode) {
    const form = dialog.querySelector('#auth-form');
    const googleBtn = dialog.querySelector('#auth-google-btn');

    // Google mock
    googleBtn?.addEventListener('click', () => {
      const mockEmail = 'demo@idearoast.ai';
      const result = mode === 'login'
        ? login(mockEmail, 'demo123')
        : signup(mockEmail, 'demo123', 'Demo User');
      if (result.success) {
        dialog.close();
        window.showToast?.('Signed in with Google! 🎉', 'success');
      }
    });

    // Switch mode
    dialog.querySelector('#switch-to-signup')?.addEventListener('click', () => renderSignupForm(dialog));
    dialog.querySelector('#switch-to-login')?.addEventListener('click', () => renderLoginForm(dialog));

    // Form submit
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      clearErrors(form);

      const email    = form.querySelector('#auth-email')?.value.trim();
      const password = form.querySelector('#auth-password')?.value;
      const name     = form.querySelector('#auth-name')?.value.trim();

      let result;
      if (mode === 'login') {
        result = login(email, password);
      } else {
        result = signup(email, password, name);
      }

      if (result.error) {
        const errEl = form.querySelector('#auth-email-error') || form.querySelector('#auth-pass-error');
        if (errEl) { errEl.textContent = result.error; errEl.classList.add('visible'); }
        return;
      }

      dialog.close();
      window.showToast?.(`Welcome${state.user?.name ? ', ' + state.user.name.split(' ')[0] : ''}! 🎉`, 'success');
    });
  }

  function clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
    form.querySelectorAll('.form-input.error').forEach(el => el.classList.remove('error'));
  }

  // ─── API Key Dialog ────────────────────────────────────────
  function initApiKeyDialog() {
    const dialog = $('apikey-dialog');
    if (!dialog) return;

    const form = dialog.querySelector('#apikey-form');
    form?.addEventListener('submit', (e) => {
      e.preventDefault();
      const key = dialog.querySelector('#apikey-input')?.value.trim();
      if (!key) {
        window.showToast?.('Please enter a valid OPENAI API key (starts with "AI")', 'error');
        return;
      }
      localStorage.setItem('idearoast_apikey', key);
      dialog.close();
      window.showToast?.('API key saved! ✅', 'success');
      // Now navigate to wizard
      setTimeout(() => window.navigateTo?.('wizard'), 100);
    });

    // Allow light-dismiss fallback
    const addLightDismiss = (dlg) => {
      if (!('closedBy' in HTMLDialogElement.prototype)) {
        dlg.addEventListener('click', (event) => {
          if (event.target !== dlg) return;
          const rect = dlg.getBoundingClientRect();
          const isContent = (
            rect.top <= event.clientY && event.clientY <= rect.top + rect.height &&
            rect.left <= event.clientX && event.clientX <= rect.left + rect.width
          );
          if (!isContent) dlg.close();
        });
      }
    };

    addLightDismiss(dialog);
    const authDlg = $('auth-dialog');
    if (authDlg) addLightDismiss(authDlg);
  }

  // ─── Init ──────────────────────────────────────────────────
  function init() {
    loadState();
    updateUI();
    initApiKeyDialog();

    $('btn-login')?.addEventListener('click', showLogin);
    $('btn-signup')?.addEventListener('click', showSignup);
    $('btn-login-mobile')?.addEventListener('click', showLogin);
    $('btn-signup-mobile')?.addEventListener('click', showSignup);
    $('nav-user-logout')?.addEventListener('click', logout);
    $('nav-user-chip')?.addEventListener('click', () => {
      $('user-dropdown')?.classList.toggle('visible');
    });

    // Close dropdown on outside click
    document.addEventListener('click', (e) => {
      if (!e.target.closest('#nav-user-chip')) {
        $('user-dropdown')?.classList.remove('visible');
      }
    });
  }

  return { init, login, signup, logout, showLogin, showSignup, showUpgrade,
    getUser, isLoggedIn, canRoast, consumeRoast, getRoastsLeft };
})();
