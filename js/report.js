/* ============================================================
   IdeaRoast AI — Report JS
   Report renderer, Chart.js, PDF export, scrollspy
   ============================================================ */

window.ReportManager = (function () {
  let currentFormData = null;
  let currentReport   = null;
  let radarChart      = null;
  let probChart       = null;

  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  // ─── Verdict helpers ──────────────────────────────────────
  function verdictClass(v) {
    if (v === 'GO') return 'go';
    if (v === 'GO_WITH_CHANGES') return 'changes';
    return 'stop';
  }
  function verdictLabel(v) {
    if (v === 'GO') return '✅ GO';
    if (v === 'GO_WITH_CHANGES') return '⚡ GO WITH CHANGES';
    return '🛑 DON\'T BUILD';
  }
  function verdictColor(v) {
    if (v === 'GO') return 'var(--color-go)';
    if (v === 'GO_WITH_CHANGES') return 'var(--color-caution)';
    return 'var(--color-stop)';
  }

  function scoreColor(n) {
    if (n >= 70) return 'high';
    if (n >= 45) return 'mid';
    return 'low';
  }

  function threatClass(t) {
    if (t === 'high') return 'threat-high';
    if (t === 'medium') return 'threat-med';
    return 'threat-low';
  }

  // ─── Build HTML for each section ─────────────────────────

  function buildExecutiveSummary(report) {
    return `
      <div class="report-section" id="rs-executive">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--brand-primary-dim);">📋</div>
          <div>
            <div class="report-section-title">Executive Summary</div>
            <div class="report-section-subtitle">The 30-second verdict</div>
          </div>
        </div>
        <div class="executive-summary-card">
          <p class="executive-summary-text">${escHtml(report.executiveSummary)}</p>
          <div style="margin-top: var(--space-5); padding-top: var(--space-5); border-top: 1px solid var(--border); display: flex; align-items: center; gap: var(--space-3);">
            <span class="text-sm text-muted">Verdict:</span>
            <span class="report-verdict-banner ${verdictClass(report.verdict)}">${verdictLabel(report.verdict)}</span>
            <span class="text-sm text-muted" style="flex: 1;">${escHtml(report.verdictReason)}</span>
          </div>
        </div>
      </div>`;
  }

  function buildScorecard(report) {
    const s = report.scores || {};
    const metrics = [
      { key: 'problem',    label: 'Problem Severity' },
      { key: 'market',     label: 'Market Opportunity' },
      { key: 'competition',label: 'Competition Moat' },
      { key: 'founderFit', label: 'Founder-Market Fit' },
      { key: 'distribution', label: 'Distribution Potential' },
      { key: 'aiNecessity', label: 'AI Necessity' },
    ];
    return `
      <div class="report-section" id="rs-scorecard">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--brand-primary-dim);">📊</div>
          <div>
            <div class="report-section-title">Startup Scorecard</div>
            <div class="report-section-subtitle">Multi-dimensional analysis across 6 vectors</div>
          </div>
        </div>
        <div class="scorecard-grid">
          <div class="score-bars">
            ${metrics.map(m => `
              <div class="score-bar-item">
                <div class="score-bar-header">
                  <span class="score-bar-label">${m.label}</span>
                  <span class="score-bar-value">${s[m.key] || 0}</span>
                </div>
                <div class="score-bar-track">
                  <div class="score-bar-fill ${scoreColor(s[m.key] || 0)}"
                       style="--bar-width: ${s[m.key] || 0}%"
                       data-width="${s[m.key] || 0}"></div>
                </div>
              </div>
            `).join('')}
          </div>
          <div class="score-radar-container">
            <div class="text-label text-muted mb-3" style="text-align: center;">RADAR VIEW</div>
            <canvas id="radar-chart"></canvas>
            <div style="margin-top: var(--space-5); text-align: center;">
              <div class="stat-number" style="font-size: 44px; color: ${verdictColor(report.verdict)};">${s.overall || 0}</div>
              <div class="stat-label">Overall Score</div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildRoastSection(report) {
    const r = report.brutalRoast || {};
    const renderItems = (items, label) => `
      <div class="roast-subsection">
        <div class="roast-subsection-title">🔥 ${label}</div>
        ${(items || []).map(item => `
          <div class="roast-item">
            <div class="roast-item-bullet">✕</div>
            <span>${escHtml(item)}</span>
          </div>
        `).join('')}
      </div>`;

    return `
      <div class="report-section" id="rs-roast">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--color-stop-dim);">🔥</div>
          <div>
            <div class="report-section-title">The Brutal Roast</div>
            <div class="report-section-subtitle">What could kill this startup</div>
          </div>
        </div>
        <div class="roast-card">
          ${renderItems(r.topRisks, 'Top Risks')}
          ${renderItems(r.weakAssumptions, 'Weak Assumptions')}
          ${renderItems(r.failureReasons, 'Likely Failure Reasons')}
        </div>
      </div>`;
  }

  function buildSignalsSection(report) {
    const s = report.positiveSignals || {};
    const renderItems = (items, label, color = 'var(--color-go)') => `
      <div style="margin-bottom: var(--space-5);">
        <div class="roast-subsection-title" style="color: ${color}; margin-bottom: var(--space-3);">✓ ${label}</div>
        ${(items || []).map(item => `
          <div class="signal-item">
            <div class="signal-bullet">✓</div>
            <span>${escHtml(item)}</span>
          </div>
        `).join('')}
      </div>`;

    return `
      <div class="report-section" id="rs-signals">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--color-go-dim);">💚</div>
          <div>
            <div class="report-section-title">Positive Signals</div>
            <div class="report-section-subtitle">Reasons this could work</div>
          </div>
        </div>
        <div class="signals-card">
          ${renderItems(s.opportunities, 'Market Opportunities')}
          ${renderItems(s.founderStrengths, 'Founder Strengths')}
          ${renderItems(s.timingAdvantages, 'Timing Advantages')}
        </div>
      </div>`;
  }

  function buildCompetitors(report) {
    const comps = report.competitorAnalysis || [];
    return `
      <div class="report-section" id="rs-competitors">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: rgba(56,189,248,0.1);">⚔️</div>
          <div>
            <div class="report-section-title">Competitor Analysis</div>
            <div class="report-section-subtitle">The battlefield landscape</div>
          </div>
        </div>
        <div class="competitor-grid">
          ${comps.map(c => `
            <div class="competitor-card">
              <div class="competitor-name">${escHtml(c.name)}</div>
              <div class="competitor-desc">${escHtml(c.description)}</div>
              <div class="competitor-threat ${threatClass(c.threat)}">
                ${c.threat === 'high' ? '🔴' : c.threat === 'medium' ? '🟡' : '🟢'} ${c.threat} threat
              </div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function buildGTM(report) {
    const g = report.goToMarket || {};
    return `
      <div class="report-section" id="rs-gtm">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: rgba(245,158,11,0.1);">🚀</div>
          <div>
            <div class="report-section-title">Go-To-Market Strategy</div>
            <div class="report-section-subtitle">How to get your first customers</div>
          </div>
        </div>
        <div class="gtm-steps">
          ${[['first10','First 10 Customers','🎯'], ['first100','First 100 Customers','📈'], ['first1000','First 1,000 Customers','⚡']].map(([key, label, emoji]) => `
            <div class="gtm-step-card">
              <div class="gtm-step-badge">${emoji} ${label}</div>
              <div class="gtm-step-text">${escHtml(g[key] || '')}</div>
            </div>
          `).join('')}
        </div>
      </div>`;
  }

  function buildMVP(report) {
    const m = report.mvpRecommendation || {};
    return `
      <div class="report-section" id="rs-mvp">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--brand-accent-dim);">🛠️</div>
          <div>
            <div class="report-section-title">MVP Recommendation</div>
            <div class="report-section-subtitle">What to build, skip, and avoid</div>
          </div>
        </div>
        <div class="mvp-grid">
          <div class="mvp-col">
            <div class="mvp-col-header text-go">✅ Must Build</div>
            ${(m.mustBuild || []).map(f => `<div class="mvp-item"><span style="color: var(--color-go); flex-shrink:0">▸</span>${escHtml(f)}</div>`).join('')}
          </div>
          <div class="mvp-col">
            <div class="mvp-col-header text-caution">🔸 Nice to Have</div>
            ${(m.niceToHave || []).map(f => `<div class="mvp-item"><span style="color: var(--color-caution); flex-shrink:0">▸</span>${escHtml(f)}</div>`).join('')}
          </div>
          <div class="mvp-col">
            <div class="mvp-col-header text-stop">🚫 Avoid</div>
            ${(m.avoid || []).map(f => `<div class="mvp-item"><span style="color: var(--color-stop); flex-shrink:0">✕</span>${escHtml(f)}</div>`).join('')}
          </div>
        </div>
      </div>`;
  }

  function buildRevenue(report) {
    return `
      <div class="report-section" id="rs-revenue">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--color-go-dim);">💰</div>
          <div>
            <div class="report-section-title">Revenue Strategy</div>
            <div class="report-section-subtitle">How to make money</div>
          </div>
        </div>
        <div class="revenue-card">
          <p class="revenue-text">${escHtml(report.revenueStrategy || '')}</p>
        </div>
      </div>`;
  }

  function buildProbability(report) {
    const p = report.successProbability || {};
    const pct = p.percentage || 0;
    const color = pct >= 60 ? 'var(--color-go)' : pct >= 35 ? 'var(--color-caution)' : 'var(--color-stop)';
    return `
      <div class="report-section" id="rs-probability">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: rgba(139,92,246,0.1);">🎲</div>
          <div>
            <div class="report-section-title">Success Probability</div>
            <div class="report-section-subtitle">Statistical likelihood of venture-scale success</div>
          </div>
        </div>
        <div class="probability-card">
          <div class="probability-donut">
            <canvas id="prob-chart"></canvas>
            <div class="probability-center-text">
              <div class="probability-percent" style="color: ${color}">${pct}%</div>
              <div class="probability-label">Success</div>
            </div>
          </div>
          <div>
            <p class="probability-rationale">${escHtml(p.rationale || '')}</p>
            <div style="margin-top: var(--space-5);">
              <div class="text-label text-muted mb-2">Industry Benchmark</div>
              <div style="display: flex; gap: var(--space-4); flex-wrap: wrap;">
                <div><span style="color: var(--text-muted); font-size: 12px;">All Startups</span><br><strong style="color: var(--text-primary);">~10%</strong></div>
                <div><span style="color: var(--text-muted); font-size: 12px;">VC-Backed</span><br><strong style="color: var(--text-primary);">~25%</strong></div>
                <div><span style="color: var(--text-muted); font-size: 12px;">Your Idea</span><br><strong style="color: ${color}">${pct}%</strong></div>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  function buildRebuild(report) {
    const rb = report.rebuildMode || {};
    const renderCards = (items) => (items || []).map((item, i) => `
      <div class="rebuild-card">
        <div class="rebuild-card-num">Option ${i + 1}</div>
        <div class="rebuild-card-title">${escHtml(item.title)}</div>
        <div class="rebuild-card-desc">${escHtml(item.description)}</div>
      </div>
    `).join('');

    return `
      <div class="report-section" id="rs-rebuild">
        <div class="report-section-header">
          <div class="report-section-icon" style="background: var(--brand-primary-dim);">🔮</div>
          <div>
            <div class="report-section-title">Rebuild Mode</div>
            <div class="report-section-subtitle">Alternative directions that might work better</div>
          </div>
        </div>
        <div class="rebuild-tabs">
          <button class="rebuild-tab active" data-tab="stronger">💪 Stronger Versions</button>
          <button class="rebuild-tab" data-tab="niche">🎯 Niche Versions</button>
          <button class="rebuild-tab" data-tab="pivot">🔄 Pivot Opportunities</button>
        </div>
        <div class="rebuild-panel active" id="rebuild-stronger">${renderCards(rb.strongerVersions)}</div>
        <div class="rebuild-panel" id="rebuild-niche">${renderCards(rb.nicheVersions)}</div>
        <div class="rebuild-panel" id="rebuild-pivot">${renderCards(rb.pivotOpportunities)}</div>
      </div>`;
  }

  // ─── Charts ───────────────────────────────────────────────
  function initCharts(report) {
    const s = report.scores || {};

    // Cleanup existing charts
    if (radarChart) { radarChart.destroy(); radarChart = null; }
    if (probChart)  { probChart.destroy(); probChart = null; }

    // Wait for DOM
    setTimeout(() => {
      // Radar Chart
      const radarEl = document.getElementById('radar-chart');
      if (radarEl && window.Chart) {
        const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
        const gridColor = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';
        const labelColor = isDark ? '#8B95A9' : '#475569';

        radarChart = new Chart(radarEl, {
          type: 'radar',
          data: {
            labels: ['Problem', 'Market', 'Competition', 'Founder Fit', 'Distribution', 'AI Necessity'],
            datasets: [{
              data: [s.problem, s.market, s.competition, s.founderFit, s.distribution, s.aiNecessity],
              backgroundColor: 'rgba(99,102,241,0.15)',
              borderColor: 'rgba(99,102,241,0.8)',
              borderWidth: 2,
              pointBackgroundColor: '#6366F1',
              pointBorderColor: '#6366F1',
              pointRadius: 4,
            }]
          },
          options: {
            responsive: true,
            scales: {
              r: {
                min: 0, max: 100,
                ticks: { display: false },
                grid: { color: gridColor },
                angleLines: { color: gridColor },
                pointLabels: { color: labelColor, font: { size: 10, weight: '600' } },
              }
            },
            plugins: { legend: { display: false } },
            animation: { duration: 1200, easing: 'easeInOutQuart' },
          }
        });
      }

      // Probability Donut
      const probEl = document.getElementById('prob-chart');
      const pct = report.successProbability?.percentage || 0;
      if (probEl && window.Chart) {
        const color = pct >= 60 ? '#10B981' : pct >= 35 ? '#F59E0B' : '#EF4444';
        probChart = new Chart(probEl, {
          type: 'doughnut',
          data: {
            datasets: [{
              data: [pct, 100 - pct],
              backgroundColor: [color, 'rgba(255,255,255,0.05)'],
              borderColor: 'transparent',
              borderWidth: 0,
              hoverBackgroundColor: [color, 'rgba(255,255,255,0.08)'],
            }]
          },
          options: {
            responsive: false,
            cutout: '75%',
            plugins: { legend: { display: false }, tooltip: { enabled: false } },
            animation: { duration: 1500, easing: 'easeInOutQuart' },
          }
        });
      }

      // Animate score bars
      document.querySelectorAll('.score-bar-fill[data-width]').forEach(bar => {
        const target = bar.dataset.width;
        requestAnimationFrame(() => {
          bar.style.width = target + '%';
        });
      });

    }, 100);
  }

  // ─── Rebuild Tabs ─────────────────────────────────────────
  function initRebuildTabs() {
    document.querySelectorAll('.rebuild-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        document.querySelectorAll('.rebuild-tab').forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const panelId = 'rebuild-' + tab.dataset.tab;
        document.querySelectorAll('.rebuild-panel').forEach(p => {
          p.classList.toggle('active', p.id === panelId);
        });
      });
    });
  }

  // ─── PDF Export ───────────────────────────────────────────
  function exportPDF() {
    if (!window.html2pdf) {
      window.showToast?.('PDF library loading, please try again in a moment', 'info');
      return;
    }
    const reportEl = document.getElementById('report-content');
    if (!reportEl) return;

    window.showToast?.('Generating PDF...', 'info');

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `IdeaRoast_${(currentFormData?.startupName || 'Report').replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.95 },
      html2canvas: { scale: 2, useCORS: true, letterRendering: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(reportEl).save().then(() => {
      window.showToast?.('PDF exported! ✅', 'success');
    });
  }

  // ─── Share ────────────────────────────────────────────────
  function shareReport() {
    const title = currentFormData?.startupName || 'My Startup Idea';
    const text  = `Check out my IdeaRoast AI report for "${title}" — Score: ${currentReport?.scores?.overall || '--'}/100`;
    if (navigator.share) {
      navigator.share({ title: 'IdeaRoast AI Report', text, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href).then(() => {
        window.showToast?.('Report link copied! 📋', 'success');
      });
    }
  }

  // ─── Main Render ──────────────────────────────────────────
  function render(formData, report) {
    currentFormData = formData;
    currentReport   = report;

    const container = document.getElementById('report-content');
    if (!container) return;

    const personality = window.AIManager?.PERSONALITIES?.[formData.personality];

    // Build full report HTML
    container.innerHTML = `
      <!-- Report Hero -->
      <div class="report-hero">
        <div class="container">
          <a class="report-back-btn" href="#" data-nav="dashboard">← Back to Dashboard</a>
          <div class="report-hero-top">
            <div>
              <div class="text-label text-muted mb-2">
                ${personality ? `Reviewed by ${personality.name}` : 'AI Analysis'} · ${formData.roastLevel?.toUpperCase()} mode
              </div>
              <h1 class="report-title">${escHtml(formData.startupName)}</h1>
              <p class="report-meta">${escHtml(formData.oneLiner)}</p>
            </div>
            <div style="display: flex; flex-direction: column; align-items: flex-end; gap: var(--space-3);">
              <div class="report-overall-score">
                <div class="score-number" style="color: ${verdictColor(report.verdict)}">${report.scores?.overall || '--'}</div>
                <div class="score-label">/ 100 overall</div>
              </div>
              <span class="report-verdict-banner ${verdictClass(report.verdict)}">${verdictLabel(report.verdict)}</span>
            </div>
          </div>
          <!-- Action Buttons -->
          <div class="report-actions">
            <button class="btn btn-ghost btn-sm" id="report-rerun-btn">🔄 Re-run Analysis</button>
            <button class="btn btn-ghost btn-sm" id="report-pdf-btn">📥 Export PDF</button>
            <button class="btn btn-ghost btn-sm" id="report-share-btn">🔗 Share</button>
            <button class="btn btn-primary btn-sm" id="report-save-btn">💾 Save to Dashboard</button>
          </div>
        </div>
      </div>

      <!-- Scrollspy Sub-nav -->
      <nav class="report-subnav" role="navigation" aria-label="Report sections">
        <div class="container">
          <div class="report-subnav-inner">
            ${[
              ['rs-executive', 'Summary'],
              ['rs-scorecard', 'Scorecard'],
              ['rs-roast', '🔥 Roast'],
              ['rs-signals', 'Signals'],
              ['rs-competitors', 'Competitors'],
              ['rs-gtm', 'GTM'],
              ['rs-mvp', 'MVP'],
              ['rs-revenue', 'Revenue'],
              ['rs-probability', 'Probability'],
              ['rs-rebuild', 'Rebuild Mode'],
            ].map(([id, label]) => `
              <a class="report-subnav-item" href="#${id}" data-target="${id}"
                 onclick="event.preventDefault(); document.getElementById('${id}')?.scrollIntoView({behavior:'smooth',block:'start'})">${label}</a>
            `).join('')}
          </div>
        </div>
      </nav>

      <!-- Report Body -->
      <div class="report-body">
        <div class="container container-lg">
          ${buildExecutiveSummary(report)}
          ${buildScorecard(report)}
          ${buildRoastSection(report)}
          ${buildSignalsSection(report)}
          ${buildCompetitors(report)}
          ${buildGTM(report)}
          ${buildMVP(report)}
          ${buildRevenue(report)}
          ${buildProbability(report)}
          ${buildRebuild(report)}
        </div>
      </div>
    `;

    // Wire report action buttons
    container.querySelector('#report-rerun-btn')?.addEventListener('click', () => {
      window.WizardManager?.reset(formData);
      window.navigateTo?.('wizard');
    });
    container.querySelector('#report-pdf-btn')?.addEventListener('click', exportPDF);
    container.querySelector('#report-share-btn')?.addEventListener('click', shareReport);
    container.querySelector('#report-save-btn')?.addEventListener('click', () => {
      window.DashboardManager?.saveIdea(formData, report);
      window.showToast?.('Saved to dashboard! ✅', 'success');
    });
    container.querySelector('[data-nav="dashboard"]')?.addEventListener('click', (e) => {
      e.preventDefault();
      window.navigateTo?.('dashboard');
    });

    // Init interactive components
    initCharts(report);
    initRebuildTabs();
    initScrollspy('.report-subnav-item[data-target]', '.report-section[id]');
  }

  function initScrollspy(navSel, sectionSel) {
    const navItems = document.querySelectorAll(navSel);
    const sections = document.querySelectorAll(sectionSel);
    if (!navItems.length || !sections.length) return;
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const id = e.target.id;
          navItems.forEach(item => item.classList.toggle('active', item.dataset.target === id));
        }
      });
    }, { threshold: 0.2, rootMargin: '-130px 0px -50% 0px' });
    sections.forEach(s => obs.observe(s));
  }

  function init() {} // Called from app.js on load

  return { render, exportPDF, init };
})();
