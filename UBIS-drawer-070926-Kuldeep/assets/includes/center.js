window.UBISIncludes = window.UBISIncludes || {};

(function (includes) {
  const STATUS_STYLES = {
    blue: { badge: 'bg-indigo-100 text-indigo-800 ring-indigo-200', dot: 'bg-blue-500' },
    green: { badge: 'bg-emerald-100 text-emerald-800 ring-emerald-200', dot: 'bg-emerald-500' },
    amber: { badge: 'bg-amber-100 text-amber-800 ring-amber-200', dot: 'bg-amber-500' },
    red: { badge: 'bg-red-100 text-red-800 ring-red-200', dot: 'bg-red-500' },
    slate: { badge: 'bg-slate-100 text-slate-700 ring-slate-200', dot: 'bg-slate-500' }
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[character]);

  function selectControl(field) {
    const options = field.options.map((option) => {
      const item = typeof option === 'string' ? { value: option, label: option } : option;
      return `<option value="${escapeHtml(item.value)}"${item.value === field.selected ? ' selected' : ''}>${escapeHtml(item.label || item.value)}</option>`;
    }).join('');
    return `<label class="block min-w-0"><span class="mb-2 block text-xs font-extrabold uppercase tracking-wide text-slate-500">${escapeHtml(field.label)}</span>
      <div class="relative"><select id="${escapeHtml(field.id)}" class="h-12 w-full appearance-none truncate rounded-lg border border-slate-300 bg-slate-50 px-3.5 pr-10 text-sm font-medium text-slate-700 outline-none transition hover:border-slate-400 focus:border-ubis-teal focus:bg-white focus:ring-4 focus:ring-teal-50" aria-label="${escapeHtml(field.label)}">${options}</select><i data-lucide="chevron-down" class="pointer-events-none absolute right-3.5 top-4 h-4 w-4 text-slate-700"></i></div>
    </label>`;
  }

  function renderStatus(status) {
    const style = STATUS_STYLES[status?.color] || STATUS_STYLES.blue;
    return `<span class="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold ring-1 ring-inset ${style.badge}"><span class="h-1.5 w-1.5 rounded-full ${style.dot}"></span>${escapeHtml(status?.text || 'In Progress')}</span>`;
  }

  includes.center = function () {
    const config = window.UBISPageConfig?.center;
    if (!config) return '';

    const breadcrumb = config.breadcrumb.map((item, index) => `${index ? '<i data-lucide="chevron-right" class="h-3 w-3 text-slate-300"></i>' : ''}<span class="${item.current ? 'rounded-full bg-indigo-100 px-2.5 py-1 font-bold text-indigo-800 ring-1 ring-inset ring-indigo-200' : 'text-slate-400'}">${escapeHtml(item.label)}</span>`).join('');
    const heading = config.heading;
    const action = heading.primaryAction || {};

    return `<!-- Shared, page-configured center content -->
      <div class="mb-4 flex flex-wrap items-center gap-1.5 text-[11px]">${breadcrumb}</div>
      <section class="mb-5 rounded-2xl border border-slate-100 bg-white p-5 shadow-panel"><div class="grid grid-cols-1 gap-4 lg:grid-cols-2">${selectControl(config.demand)}${selectControl(config.appendix)}</div></section>
      <section class="appendix-highlight mb-5 rounded-2xl border p-4"><div class="flex flex-col justify-between gap-4 xl:flex-row xl:items-center"><div class="flex items-start gap-3"><div class="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-cyan-600 text-white shadow-lg shadow-indigo-200"><i data-lucide="${escapeHtml(heading.icon || 'file-spreadsheet')}" class="h-6 w-6"></i></div><div><div class="flex flex-wrap items-center gap-2"><h2 class="text-2xl font-extrabold tracking-tight text-indigo-950">${escapeHtml(heading.title)}</h2><span id="recordCountBadge" class="rounded-full bg-white px-3 py-1 text-[10px] font-bold text-slate-700 shadow-sm ring-1 ring-inset ring-slate-200">${escapeHtml(heading.recordCount || '0 Records')}</span>${renderStatus(heading.status)}</div><p class="mt-1.5 text-sm font-medium text-slate-600">${escapeHtml(heading.description)}</p></div></div><button type="button" data-ubis-center-action="${escapeHtml(action.type || 'drawer')}" data-ubis-center-action-mode="${escapeHtml(action.mode || 'add')}" data-ubis-center-event="${escapeHtml(action.event || '')}" class="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-ubis-navy px-4 text-sm font-semibold text-white shadow-sm transition hover:bg-ubis-dark focus:outline-none focus:ring-4 focus:ring-blue-100"><i data-lucide="${escapeHtml(action.icon || 'plus')}" class="h-4 w-4"></i>${escapeHtml(action.label || 'Add')}</button></div></section>`;
  };

  document.addEventListener('click', (event) => {
    const button = event.target.closest('[data-ubis-center-action]');
    if (!button) return;

    if (button.dataset.ubisCenterAction === 'drawer' && typeof window.openDrawer === 'function') {
      window.openDrawer(button.dataset.ubisCenterActionMode || 'add');
      return;
    }

    if (button.dataset.ubisCenterAction === 'event' && button.dataset.ubisCenterEvent) {
      window.dispatchEvent(new CustomEvent(button.dataset.ubisCenterEvent, {
        detail: { button, center: window.UBISPageConfig?.center }
      }));
    }
  });
})(window.UBISIncludes);
