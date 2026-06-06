/* ============================================================
   IdeaRoast AI — Wizard JS
   3-step form logic, validation, state management
   ============================================================ */

window.WizardManager = (function () {
  let currentStep = 1;
  const TOTAL_STEPS = 3;

  // ─── State ────────────────────────────────────────────────
  let formData = {
    // Step 1
    startupName: '',
    oneLiner: '',
    problem: '',
    targetCustomer: '',
    revenueModel: '',
    // Step 2
    whyNow: '',
    competitors: '',
    founderBackground: '',
    customerValidation: 'no',
    currentStage: 'idea',
    // Step 3
    roastLevel: 'brutal',
    personality: 'vc',
  };

  function loadSaved() {
    try {
      const saved = sessionStorage.getItem('idearoast_wizard');
      if (saved) formData = { ...formData, ...JSON.parse(saved) };
    } catch (e) {}
  }

  function saveProgress() {
    sessionStorage.setItem('idearoast_wizard', JSON.stringify(formData));
  }

  // ─── DOM helpers ──────────────────────────────────────────
  const $ = id => document.getElementById(id);

  function showStep(n) {
    currentStep = n;
    [1, 2, 3].forEach(i => {
      const panel = $(`wizard-step-${i}`);
      if (panel) {
        panel.style.display = i === n ? '' : 'none';
        if (i === n) {
          panel.classList.remove('view-enter');
          void panel.offsetWidth; // reflow
          panel.classList.add('view-enter');
          setTimeout(() => panel.classList.remove('view-enter'), 500);
        }
      }
    });
    updateStepIndicator();
    updateNavButtons();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function updateStepIndicator() {
    [1, 2, 3].forEach(i => {
      const bubble = $(`step-bubble-${i}`);
      const connector = $(`step-connector-${i}`);
      if (!bubble) return;

      bubble.classList.remove('active', 'done');
      if (i < currentStep) bubble.classList.add('done');
      else if (i === currentStep) bubble.classList.add('active');

      if (connector) {
        connector.classList.toggle('done', i < currentStep);
      }
    });

    // Update step labels
    const labels = { 1: 'Idea Basics', 2: 'Context', 3: 'Roast Level' };
    [1, 2, 3].forEach(i => {
      const label = $(`step-label-${i}`);
      if (label) {
        label.style.color = i === currentStep ? 'var(--text-primary)' : '';
      }
    });
  }

  function updateNavButtons() {
    const backBtn = $('wizard-back-btn');
    const nextBtn = $('wizard-next-btn');
    const submitBtn = $('wizard-submit-btn');

    if (backBtn) backBtn.style.display = currentStep > 1 ? '' : 'none';
    if (nextBtn) nextBtn.style.display = currentStep < TOTAL_STEPS ? '' : 'none';
    if (submitBtn) submitBtn.style.display = currentStep === TOTAL_STEPS ? '' : 'none';
  }

  // ─── Validation ───────────────────────────────────────────
  function validateStep(step) {
    const errors = [];

    if (step === 1) {
      if (!formData.startupName.trim()) errors.push({ field: 'startupName', msg: 'Startup name is required' });
      if (!formData.oneLiner.trim()) errors.push({ field: 'oneLiner', msg: 'One-line idea is required' });
      if (formData.oneLiner.length > 200) errors.push({ field: 'oneLiner', msg: 'Keep it under 200 characters' });
      if (!formData.problem.trim()) errors.push({ field: 'problem', msg: 'Problem statement is required' });
      if (!formData.targetCustomer.trim()) errors.push({ field: 'targetCustomer', msg: 'Target customer is required' });
      if (!formData.revenueModel.trim()) errors.push({ field: 'revenueModel', msg: 'Revenue model is required' });
    }

    if (step === 2) {
      if (!formData.whyNow.trim()) errors.push({ field: 'whyNow', msg: 'Please explain the timing' });
    }

    return errors;
  }

  function showFieldErrors(errors) {
    // Clear all errors first
    document.querySelectorAll('.form-error').forEach(el => {
      el.textContent = '';
      el.classList.remove('visible');
    });
    document.querySelectorAll('.form-input.error, .form-textarea.error').forEach(el =>
      el.classList.remove('error')
    );

    errors.forEach(({ field, msg }) => {
      const input = document.querySelector(`[name="${field}"]`);
      const errEl = document.querySelector(`[data-error="${field}"]`);
      if (input) input.classList.add('error');
      if (errEl) { errEl.textContent = msg; errEl.classList.add('visible'); }
    });

    // Focus first error
    if (errors.length > 0) {
      document.querySelector('.form-input.error, .form-textarea.error')?.focus();
    }
  }

  // ─── Collect form values ──────────────────────────────────
  function collectStep(step) {
    if (step === 1) {
      formData.startupName    = $('field-startupName')?.value.trim() || '';
      formData.oneLiner       = $('field-oneLiner')?.value.trim() || '';
      formData.problem        = $('field-problem')?.value.trim() || '';
      formData.targetCustomer = $('field-targetCustomer')?.value.trim() || '';
      formData.revenueModel   = $('field-revenueModel')?.value.trim() || '';
    }
    if (step === 2) {
      formData.whyNow             = $('field-whyNow')?.value.trim() || '';
      formData.competitors        = $('field-competitors')?.value.trim() || '';
      formData.founderBackground  = $('field-founderBackground')?.value.trim() || '';
      formData.customerValidation = $('field-customerValidation')?.value || 'no';
      formData.currentStage       = $('field-currentStage')?.value || 'idea';
    }
    saveProgress();
  }

  // ─── Fill saved values into form ─────────────────────────
  function populateForm() {
    const fields = [
      'startupName', 'oneLiner', 'problem', 'targetCustomer', 'revenueModel',
      'whyNow', 'competitors', 'founderBackground'
    ];
    fields.forEach(f => {
      const el = $(`field-${f}`);
      if (el && formData[f]) el.value = formData[f];
    });

    const cvEl = $('field-customerValidation');
    const stageEl = $('field-currentStage');
    if (cvEl) cvEl.value = formData.customerValidation;
    if (stageEl) stageEl.value = formData.currentStage;

    // Roast level
    document.querySelectorAll('.roast-card-option').forEach(card => {
      const val = card.dataset.value;
      card.classList.toggle('selected', val === formData.roastLevel);
    });

    // Personality
    document.querySelectorAll('.personality-chip').forEach(chip => {
      const val = chip.dataset.value;
      chip.classList.toggle('selected', val === formData.personality);
    });
  }

  // ─── Character counters ───────────────────────────────────
  function initCharCounters() {
    document.querySelectorAll('[data-maxlength]').forEach(input => {
      const maxlen = parseInt(input.dataset.maxlength);
      const countEl = document.querySelector(`[data-charcount="${input.id}"]`);
      if (!countEl) return;
      countEl.textContent = `0 / ${maxlen}`;
      input.addEventListener('input', () => {
        const len = input.value.length;
        countEl.textContent = `${len} / ${maxlen}`;
        countEl.style.color = len > maxlen * 0.9 ? 'var(--color-caution)' : '';
      });
    });
  }

  // ─── Roast Level & Personality Selectors ─────────────────
  function initSelectors() {
    // Roast level cards
    document.querySelectorAll('.roast-card-option').forEach(card => {
      card.addEventListener('click', () => {
        document.querySelectorAll('.roast-card-option').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        formData.roastLevel = card.dataset.value;
        saveProgress();
      });
    });

    // Personality chips
    document.querySelectorAll('.personality-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        document.querySelectorAll('.personality-chip').forEach(c => c.classList.remove('selected'));
        chip.classList.add('selected');
        formData.personality = chip.dataset.value;
        saveProgress();
      });
    });
  }

  // ─── Navigation ───────────────────────────────────────────
  function goBack() {
    if (currentStep > 1) {
      collectStep(currentStep);
      showStep(currentStep - 1);
      populateForm();
    }
  }

  function goNext() {
    collectStep(currentStep);
    const errors = validateStep(currentStep);
    if (errors.length) {
      showFieldErrors(errors);
      return;
    }
    if (currentStep < TOTAL_STEPS) {
      showStep(currentStep + 1);
    }
  }

  async function submit() {
    collectStep(currentStep);

    if (!window.AuthManager?.canRoast()) {
      window.showToast?.('You\'ve used all your free roasts. Upgrade to Pro for unlimited!', 'error');
      window.AuthManager?.showUpgrade();
      return;
    }

    // Show loading screen
    showGenerating();

    try {
      const result = await window.AIManager?.generateReport(formData);
      if (!result) throw new Error('No response from AI');

      // Consume a roast credit
      window.AuthManager?.consumeRoast();

      // Save to dashboard
      window.DashboardManager?.saveIdea(formData, result);

      // Show report
      window.ReportManager?.render(formData, result);
      window.navigateTo?.('report');

    } catch (err) {
      hideGenerating();
      console.error(err);
      window.showToast?.('Generation failed: ' + (err.message || 'Unknown error'), 'error');
    }
  }

  // ─── Generating UI ────────────────────────────────────────
  const loadingMessages = [
    '🔍 Analyzing market landscape...',
    '💰 Consulting the VC agent...',
    '🧠 Running competitor intelligence...',
    '🔥 Calibrating roast intensity...',
    '📊 Building your scorecard...',
    '🚀 Generating go-to-market strategy...',
    '⚡ Finalizing your report...',
  ];

  let loadingInterval = null;

  function showGenerating() {
    const wizard = $('view-wizard');
    const gen = $('wizard-generating');
    if (!wizard || !gen) return;

    $('wizard-form-area').style.display = 'none';
    gen.style.display = '';

    let msgIdx = 0;
    const statusEl = gen.querySelector('.report-loading-status');
    const progressFill = gen.querySelector('.progress-track-fill');

    const updateMessage = () => {
      if (statusEl) statusEl.textContent = loadingMessages[msgIdx % loadingMessages.length];
      if (progressFill) {
        const pct = Math.min(90, 10 + (msgIdx / loadingMessages.length) * 80);
        progressFill.style.width = pct + '%';
      }
      msgIdx++;
    };
    updateMessage();
    loadingInterval = setInterval(updateMessage, 2200);
  }

  function hideGenerating() {
    clearInterval(loadingInterval);
    $('wizard-form-area').style.display = '';
    const gen = $('wizard-generating');
    if (gen) gen.style.display = 'none';
  }

  // ─── Reset wizard ─────────────────────────────────────────
  function reset(prefillData = null) {
    if (prefillData) {
      formData = { ...formData, ...prefillData };
    } else {
      formData = {
        startupName: '', oneLiner: '', problem: '', targetCustomer: '', revenueModel: '',
        whyNow: '', competitors: '', founderBackground: '',
        customerValidation: 'no', currentStage: 'idea',
        roastLevel: 'brutal', personality: 'vc',
      };
    }
    sessionStorage.removeItem('idearoast_wizard');
    showStep(1);
    populateForm();
    hideGenerating();
  }

  // ─── Init ──────────────────────────────────────────────────
  function init() {
    loadSaved();
    populateForm();
    initCharCounters();
    initSelectors();
    showStep(1);

    $('wizard-back-btn')?.addEventListener('click', goBack);
    $('wizard-next-btn')?.addEventListener('click', goNext);
    $('wizard-submit-btn')?.addEventListener('click', submit);
    $('wizard-cancel-btn')?.addEventListener('click', () => window.navigateTo?.('landing'));

    // Live update formData on input (auto-save)
    document.querySelectorAll('#view-wizard input, #view-wizard textarea, #view-wizard select').forEach(el => {
      el.addEventListener('input', () => {
        if (el.name) formData[el.name] = el.value;
        saveProgress();
        // Clear error on edit
        el.classList.remove('error');
        const errEl = document.querySelector(`[data-error="${el.name}"]`);
        if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
      });
    });
  }

  return { init, reset, getFormData: () => ({ ...formData }) };
})();
