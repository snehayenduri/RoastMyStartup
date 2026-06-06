// /* ============================================================
//    IdeaRoast AI — Dashboard JS
//    Idea CRUD, comparison mode, filtering/sorting
//    ============================================================ */

// window.DashboardManager = (function () {
//   const STORAGE_KEY = 'idearoast_ideas';

//   // ─── Store ─────────────────────────────────────────────────
//   function getIdeas() {
//     try {
//       return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
//     } catch { return []; }
//   }

//   function saveIdeas(ideas) {
//     localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
//   }

//   function saveIdea(formData, report) {
//     const ideas = getIdeas();
//     const id = 'idea_' + Date.now();
//     ideas.unshift({
//       id,
//       formData: { ...formData },
//       report: { ...report },
//       createdAt: new Date().toISOString(),
//     });
//     saveIdeas(ideas);
//     return id;
//   }

//   function deleteIdea(id) {
//     const ideas = getIdeas().filter(i => i.id !== id);
//     saveIdeas(ideas);
//   }

//   function getIdea(id) {
//     return getIdeas().find(i => i.id === id);
//   }

//   // ─── State ─────────────────────────────────────────────────
//   let filterVerdict  = 'all';
//   let sortBy         = 'date';
//   let selectedIds    = new Set();

//   function applyFilters(ideas) {
//     let filtered = [...ideas];
//     if (filterVerdict !== 'all') {
//       filtered = filtered.filter(i => i.report?.verdict === filterVerdict);
//     }
//     filtered.sort((a, b) => {
//       if (sortBy === 'score') return (b.report?.scores?.overall || 0) - (a.report?.scores?.overall || 0);
//       if (sortBy === 'name') return a.formData.startupName.localeCompare(b.formData.startupName);
//       return new Date(b.createdAt) - new Date(a.createdAt);
//     });
//     return filtered;
//   }

//   // ─── Render ────────────────────────────────────────────────
//   function getVerdictBadge(verdict) {
//     const map = {
//       'GO':              { cls: 'badge-go',      label: '✅ GO' },
//       'GO_WITH_CHANGES': { cls: 'badge-caution', label: '⚡ GO WITH CHANGES' },
//       'DONT_BUILD':      { cls: 'badge-stop',    label: '🛑 DON\'T BUILD' },
//     };
//     const v = map[verdict] || { cls: 'badge-info', label: verdict };
//     return `<span class="badge ${v.cls}">${v.label}</span>`;
//   }

//   function formatDate(iso) {
//     return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
//   }

//   function renderIdeaCard(idea) {
//     const score = idea.report?.scores?.overall || '--';
//     const scoreColor = score >= 70 ? 'var(--color-go)' : score >= 50 ? 'var(--color-caution)' : 'var(--color-stop)';
//     const isSelected = selectedIds.has(idea.id);

//     return `
//       <div class="idea-card ${isSelected ? 'selected' : ''}" data-id="${idea.id}">
//         <div class="idea-card-select" data-select="${idea.id}" title="Select for comparison"></div>
//         <div class="idea-card-name">${escHtml(idea.formData.startupName)}</div>
//         <div class="idea-card-tagline">${escHtml(idea.formData.oneLiner)}</div>
//         <div class="idea-card-meta">
//           <div>
//             <div class="idea-card-score" style="color: ${scoreColor}">${score}</div>
//             <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">/ 100</div>
//           </div>
//           ${getVerdictBadge(idea.report?.verdict)}
//         </div>
//         <div class="idea-card-date">${formatDate(idea.createdAt)}</div>
//         <div class="idea-card-actions">
//           <button class="btn btn-ghost btn-sm" data-action="view" data-id="${idea.id}" title="View report">
//             📊 Report
//           </button>
//           <button class="btn btn-ghost btn-sm" data-action="rerun" data-id="${idea.id}" title="Re-run analysis">
//             🔄 Re-run
//           </button>
//           <button class="btn btn-danger btn-sm btn-icon-sm" data-action="delete" data-id="${idea.id}" title="Delete">
//             🗑
//           </button>
//         </div>
//       </div>
//     `;
//   }

//   function renderGrid() {
//     const grid = document.getElementById('dashboard-idea-grid');
//     const emptyState = document.getElementById('dashboard-empty');
//     if (!grid) return;

//     const ideas = applyFilters(getIdeas());

//     if (!ideas.length) {
//       grid.style.display = 'none';
//       if (emptyState) emptyState.style.display = '';
//       return;
//     }

//     grid.style.display = '';
//     if (emptyState) emptyState.style.display = 'none';
//     grid.innerHTML = ideas.map(renderIdeaCard).join('');

//     // Update count
//     const countEl = document.getElementById('dashboard-count');
//     if (countEl) countEl.textContent = `${ideas.length} idea${ideas.length !== 1 ? 's' : ''}`;

//     wireCardEvents(grid);
//     updateCompareBar();
//   }

//   function wireCardEvents(container) {
//     // Card click → view report
//     container.querySelectorAll('.idea-card').forEach(card => {
//       card.addEventListener('click', (e) => {
//         if (e.target.closest('[data-action]') || e.target.closest('[data-select]')) return;
//         const id = card.dataset.id;
//         const idea = getIdea(id);
//         if (!idea) return;
//         window.ReportManager?.render(idea.formData, idea.report);
//         window.navigateTo?.('report');
//       });
//     });

//     // Action buttons
//     container.querySelectorAll('[data-action]').forEach(btn => {
//       btn.addEventListener('click', (e) => {
//         e.stopPropagation();
//         const action = btn.dataset.action;
//         const id = btn.dataset.id;
//         const idea = getIdea(id);

//         if (action === 'view' && idea) {
//           window.ReportManager?.render(idea.formData, idea.report);
//           window.navigateTo?.('report');
//         }
//         if (action === 'rerun' && idea) {
//           window.WizardManager?.reset(idea.formData);
//           window.navigateTo?.('wizard');
//         }
//         if (action === 'delete') {
//           deleteIdea(id);
//           window.showToast?.('Idea deleted', 'info');
//           renderGrid();
//         }
//       });
//     });

//     // Select checkboxes
//     container.querySelectorAll('[data-select]').forEach(dot => {
//       dot.addEventListener('click', (e) => {
//         e.stopPropagation();
//         const id = dot.dataset.select;
//         if (selectedIds.has(id)) selectedIds.delete(id);
//         else if (selectedIds.size < 3) selectedIds.add(id);
//         else {
//           window.showToast?.('You can compare up to 3 ideas at once', 'info');
//           return;
//         }
//         renderGrid();
//       });
//     });
//   }

//   // ─── Compare Bar ──────────────────────────────────────────
//   function updateCompareBar() {
//     const bar = document.getElementById('compare-bar');
//     if (!bar) return;
//     if (selectedIds.size >= 2) {
//       bar.classList.add('visible');
//       const countEl = bar.querySelector('#compare-count');
//       if (countEl) countEl.textContent = selectedIds.size;
//     } else {
//       bar.classList.remove('visible');
//     }
//   }

//   function showCompareView() {
//     if (selectedIds.size < 2) return;
//     const ideas = [...selectedIds].map(id => getIdea(id)).filter(Boolean);
//     renderComparePanel(ideas);
//   }

//   function renderComparePanel(ideas) {
//     const panel = document.getElementById('compare-panel');
//     if (!panel) return;

//     const metrics = ['problem', 'market', 'competition', 'founderFit', 'distribution', 'aiNecessity', 'overall'];
//     const metricLabels = {
//       problem: 'Problem', market: 'Market', competition: 'Competition',
//       founderFit: 'Founder Fit', distribution: 'Distribution', aiNecessity: 'AI Necessity', overall: 'Overall'
//     };

//     panel.innerHTML = `
//       <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
//         <h3 class="text-h3">Comparing ${ideas.length} ideas</h3>
//         <button class="btn btn-ghost btn-sm" id="close-compare">✕ Close</button>
//       </div>
//       <div style="overflow-x: auto;">
//         <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
//           <thead>
//             <tr>
//               <th style="text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted); font-weight: 600;">Metric</th>
//               ${ideas.map(i => `<th style="text-align: center; padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-primary); font-weight: 700;">${escHtml(i.formData.startupName)}</th>`).join('')}
//             </tr>
//           </thead>
//           <tbody>
//             <tr>
//               <td style="padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted);">Verdict</td>
//               ${ideas.map(i => `<td style="text-align: center; padding: 12px 16px; border-bottom: 1px solid var(--border);">${getVerdictBadge(i.report?.verdict)}</td>`).join('')}
//             </tr>
//             ${metrics.map(m => `
//               <tr>
//                 <td style="padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted);">${metricLabels[m]}</td>
//                 ${ideas.map(i => {
//                   const score = i.report?.scores?.[m] || 0;
//                   const color = score >= 70 ? 'var(--color-go)' : score >= 50 ? 'var(--color-caution)' : 'var(--color-stop)';
//                   const isWinner = Math.max(...ideas.map(x => x.report?.scores?.[m] || 0)) === score;
//                   return `<td style="text-align: center; padding: 12px 16px; border-bottom: 1px solid var(--border); font-weight: ${isWinner ? '700' : '400'}; color: ${isWinner ? color : 'var(--text-secondary)'};">${score}</td>`;
//                 }).join('')}
//               </tr>
//             `).join('')}
//           </tbody>
//         </table>
//       </div>
//     `;
//     panel.style.display = '';
//     panel.querySelector('#close-compare')?.addEventListener('click', () => {
//       panel.style.display = 'none';
//     });
//   }

//   // ─── Filter/Sort Controls ─────────────────────────────────
//   function initControls() {
//     document.querySelectorAll('[data-filter-verdict]').forEach(btn => {
//       btn.addEventListener('click', () => {
//         filterVerdict = btn.dataset.filterVerdict;
//         document.querySelectorAll('[data-filter-verdict]').forEach(b =>
//           b.classList.toggle('active', b.dataset.filterVerdict === filterVerdict)
//         );
//         renderGrid();
//       });
//     });

//     document.getElementById('dashboard-sort')?.addEventListener('change', (e) => {
//       sortBy = e.target.value;
//       renderGrid();
//     });

//     document.getElementById('compare-bar-btn')?.addEventListener('click', showCompareView);
//     document.getElementById('compare-cancel-btn')?.addEventListener('click', () => {
//       selectedIds.clear();
//       renderGrid();
//     });
//   }

//   // ─── Init ──────────────────────────────────────────────────
//   function init() {
//     initControls();
//     renderGrid();
//   }

//   function refresh() {
//     renderGrid();
//   }

//   function escHtml(str) {
//     return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
//   }

//   return { init, refresh, saveIdea, getIdeas, deleteIdea };
// })();

// // Alias for internal use
// function escHtml(str) {
//   return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
// }


/* ============================================================
   IdeaRoast AI — Dashboard JS
   Idea CRUD, comparison mode, filtering/sorting
   ============================================================ */

window.DashboardManager = (function () {
  const STORAGE_KEY = 'idearoast_ideas';

  // ─── Store ─────────────────────────────────────────────────
  function getIdeas() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch { return []; }
  }

  function saveIdeas(ideas) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ideas));
  }

  function saveIdea(formData, report) {
    const ideas = getIdeas();
    const id = 'idea_' + Date.now();
    ideas.unshift({
      id,
      formData: { ...formData },
      report: { ...report },
      createdAt: new Date().toISOString(),
    });
    saveIdeas(ideas);
    return id;
  }

  function deleteIdea(id) {
    const ideas = getIdeas().filter(i => i.id !== id);
    saveIdeas(ideas);
  }

  function getIdea(id) {
    return getIdeas().find(i => i.id === id);
  }

  // ─── State ─────────────────────────────────────────────────
  let filterVerdict  = 'all';
  let sortBy         = 'date';
  let selectedIds    = new Set();

  function applyFilters(ideas) {
    let filtered = [...ideas];
    if (filterVerdict !== 'all') {
      filtered = filtered.filter(i => i.report?.verdict === filterVerdict);
    }
    filtered.sort((a, b) => {
      if (sortBy === 'score') return (b.report?.scores?.overall || 0) - (a.report?.scores?.overall || 0);
      if (sortBy === 'name') return a.formData.startupName.localeCompare(b.formData.startupName);
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
    return filtered;
  }

  // ─── Render ────────────────────────────────────────────────
  function getVerdictBadge(verdict) {
    const map = {
      'GO':              { cls: 'badge-go',      label: '✅ GO' },
      'GO_WITH_CHANGES': { cls: 'badge-caution', label: '⚡ GO WITH CHANGES' },
      'DONT_BUILD':      { cls: 'badge-stop',    label: '🛑 DON\'T BUILD' },
    };
    const v = map[verdict] || { cls: 'badge-info', label: verdict };
    return `<span class="badge ${v.cls}">${v.label}</span>`;
  }

  function formatDate(iso) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function renderIdeaCard(idea) {
    const score = idea.report?.scores?.overall || '--';
    const scoreColor = score >= 70 ? 'var(--color-go)' : score >= 50 ? 'var(--color-caution)' : 'var(--color-stop)';
    const isSelected = selectedIds.has(idea.id);

    return `
      <div class="idea-card ${isSelected ? 'selected' : ''}" data-id="${idea.id}">
        <div class="idea-card-select" data-select="${idea.id}" title="Select for comparison"></div>
        <div class="idea-card-name">${escHtml(idea.formData.startupName)}</div>
        <div class="idea-card-tagline">${escHtml(idea.formData.oneLiner)}</div>
        <div class="idea-card-meta">
          <div>
            <div class="idea-card-score" style="color: ${scoreColor}">${score}</div>
            <div style="font-size: 10px; color: var(--text-muted); margin-top: 2px;">/ 100</div>
          </div>
          ${getVerdictBadge(idea.report?.verdict)}
        </div>
        <div class="idea-card-date">${formatDate(idea.createdAt)}</div>
        <div class="idea-card-actions">
          <button class="btn btn-ghost btn-sm" data-action="view" data-id="${idea.id}" title="View report">
            📊 Report
          </button>
          <button class="btn btn-ghost btn-sm" data-action="rerun" data-id="${idea.id}" title="Re-run analysis">
            🔄 Re-run
          </button>
          <button class="btn btn-danger btn-sm btn-icon-sm" data-action="delete" data-id="${idea.id}" title="Delete">
            🗑
          </button>
        </div>
      </div>
    `;
  }

  function renderGrid() {
    const grid = document.getElementById('dashboard-idea-grid');
    const emptyState = document.getElementById('dashboard-empty');
    if (!grid) return;

    const ideas = applyFilters(getIdeas());

    if (!ideas.length) {
      grid.innerHTML = '';
      grid.style.display = 'none';

      if (emptyState) {
        emptyState.style.display = 'block';
      }

      const countEl = document.getElementById('dashboard-count');
      if (countEl) countEl.textContent = '0 ideas';

      updateCompareBar();
      return;
    }

    grid.style.display = 'grid';
    if (emptyState) emptyState.style.display = 'none';
    grid.innerHTML = ideas.map(renderIdeaCard).join('');

    // Update count
    const countEl = document.getElementById('dashboard-count');
    if (countEl) countEl.textContent = `${ideas.length} idea${ideas.length !== 1 ? 's' : ''}`;

    wireCardEvents(grid);
    updateCompareBar();
  }

  function wireCardEvents(container) {
    // Card click → view report
    container.querySelectorAll('.idea-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('[data-action]') || e.target.closest('[data-select]')) return;
        const id = card.dataset.id;
        const idea = getIdea(id);
        if (!idea) return;
        window.ReportManager?.render(idea.formData, idea.report);
        window.navigateTo?.('report');
      });
    });

    // Action buttons
    container.querySelectorAll('[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const action = btn.dataset.action;
        const id = btn.dataset.id;
        const idea = getIdea(id);

        if (action === 'view' && idea) {
          window.ReportManager?.render(idea.formData, idea.report);
          window.navigateTo?.('report');
        }
        if (action === 'rerun' && idea) {
          window.WizardManager?.reset(idea.formData);
          window.navigateTo?.('wizard');
        }
        if (action === 'delete') {
          deleteIdea(id);
          window.showToast?.('Idea deleted', 'info');
          renderGrid();
        }
      });
    });

    // Select checkboxes
    container.querySelectorAll('[data-select]').forEach(dot => {
      dot.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = dot.dataset.select;
        if (selectedIds.has(id)) selectedIds.delete(id);
        else if (selectedIds.size < 3) selectedIds.add(id);
        else {
          window.showToast?.('You can compare up to 3 ideas at once', 'info');
          return;
        }
        renderGrid();
      });
    });
  }

  // ─── Compare Bar ──────────────────────────────────────────
  function updateCompareBar() {
    const bar = document.getElementById('compare-bar');
    if (!bar) return;
    if (selectedIds.size >= 2) {
      bar.classList.add('visible');
      const countEl = bar.querySelector('#compare-count');
      if (countEl) countEl.textContent = selectedIds.size;
    } else {
      bar.classList.remove('visible');
    }
  }

  function showCompareView() {
    if (selectedIds.size < 2) return;
    const ideas = [...selectedIds].map(id => getIdea(id)).filter(Boolean);
    renderComparePanel(ideas);
  }

  function renderComparePanel(ideas) {
    const panel = document.getElementById('compare-panel');
    if (!panel) return;

    const metrics = ['problem', 'market', 'competition', 'founderFit', 'distribution', 'aiNecessity', 'overall'];
    const metricLabels = {
      problem: 'Problem', market: 'Market', competition: 'Competition',
      founderFit: 'Founder Fit', distribution: 'Distribution', aiNecessity: 'AI Necessity', overall: 'Overall'
    };

    panel.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
        <h3 class="text-h3">Comparing ${ideas.length} ideas</h3>
        <button class="btn btn-ghost btn-sm" id="close-compare">✕ Close</button>
      </div>
      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px;">
          <thead>
            <tr>
              <th style="text-align: left; padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted); font-weight: 600;">Metric</th>
              ${ideas.map(i => `<th style="text-align: center; padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-primary); font-weight: 700;">${escHtml(i.formData.startupName)}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style="padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted);">Verdict</td>
              ${ideas.map(i => `<td style="text-align: center; padding: 12px 16px; border-bottom: 1px solid var(--border);">${getVerdictBadge(i.report?.verdict)}</td>`).join('')}
            </tr>
            ${metrics.map(m => `
              <tr>
                <td style="padding: 12px 16px; border-bottom: 1px solid var(--border); color: var(--text-muted);">${metricLabels[m]}</td>
                ${ideas.map(i => {
                  const score = i.report?.scores?.[m] || 0;
                  const color = score >= 70 ? 'var(--color-go)' : score >= 50 ? 'var(--color-caution)' : 'var(--color-stop)';
                  const isWinner = Math.max(...ideas.map(x => x.report?.scores?.[m] || 0)) === score;
                  return `<td style="text-align: center; padding: 12px 16px; border-bottom: 1px solid var(--border); font-weight: ${isWinner ? '700' : '400'}; color: ${isWinner ? color : 'var(--text-secondary)'};">${score}</td>`;
                }).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    panel.style.display = '';
    panel.querySelector('#close-compare')?.addEventListener('click', () => {
      panel.style.display = 'none';
    });
  }

  // ─── Filter/Sort Controls ─────────────────────────────────
  function initControls() {
    document.querySelectorAll('[data-filter-verdict]').forEach(btn => {
      btn.addEventListener('click', () => {
        filterVerdict = btn.dataset.filterVerdict;
        document.querySelectorAll('[data-filter-verdict]').forEach(b =>
          b.classList.toggle('active', b.dataset.filterVerdict === filterVerdict)
        );
        renderGrid();
      });
    });

    document.getElementById('dashboard-sort')?.addEventListener('change', (e) => {
      sortBy = e.target.value;
      renderGrid();
    });

    document.getElementById('compare-bar-btn')?.addEventListener('click', showCompareView);
    document.getElementById('compare-cancel-btn')?.addEventListener('click', () => {
      selectedIds.clear();
      renderGrid();
    });
  }

  // ─── Init ──────────────────────────────────────────────────
  function init() {
    initControls();
    renderGrid();
  }

  function refresh() {
    renderGrid();
  }

  function escHtml(str) {
    return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  return { init, refresh, saveIdea, getIdeas, deleteIdea };
})();

// Alias for internal use
function escHtml(str) {
  return String(str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
