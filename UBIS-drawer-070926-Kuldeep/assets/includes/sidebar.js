window.UBISIncludes = window.UBISIncludes || {};

(function (includes) {
  const defaultConfig = {
    brand: { ministry: 'Ministry of Finance', government: 'Government of India' },
    sectionLabel: 'Main Menu',
    items: []
  };

  const escapeHtml = (value) => String(value ?? '').replace(/[&<>"]/g, (character) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;'
  })[character]);

  function renderItem(item) {
    const activeClasses = item.active
      ? 'bg-ubis-tealLight font-semibold text-ubis-navy ring-1 ring-inset ring-teal-100'
      : 'text-slate-600 hover:bg-slate-50';
    const iconClasses = item.active ? 'text-ubis-teal' : '';
    const indicator = item.active ? '<span class="absolute left-0 top-1/2 -translate-y-1/2 h-7 w-1 rounded-r-full bg-ubis-teal"></span>' : '';
    const chevron = item.expandable || item.children?.length
      ? `<i data-lucide="${item.expanded ? 'chevron-up' : 'chevron-down'}" class="sidebar-chevron h-3.5 w-3.5"></i>`
      : '';
    const children = item.children?.length
      ? `<div class="sidebar-label ml-7 space-y-1 border-l border-slate-200 pl-3 pb-1">${item.children.map((child) => `
          <a href="${escapeHtml(child.href || '#')}" class="block rounded-lg px-3 py-2 text-xs ${child.active ? 'bg-white font-semibold text-ubis-blue' : 'text-slate-500 hover:bg-slate-50'}">${escapeHtml(child.label)}</a>`).join('')}
        </div>`
      : '';

    return `
      <a href="${escapeHtml(item.href || '#')}" title="${escapeHtml(item.label)}" class="nav-link relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] ${activeClasses}">
        ${indicator}<i data-lucide="${escapeHtml(item.icon || 'circle')}" class="h-4 w-4 shrink-0 ${iconClasses}"></i>
        <span class="sidebar-label flex-1">${escapeHtml(item.label)}</span>${chevron}
      </a>${children}`;
  }

  includes.sidebar = function () {
    const config = { ...defaultConfig, ...(window.UBISPageConfig?.sidebar || {}) };
    return `<aside id="sidebar" class="sidebar fixed left-0 top-1 bottom-0 z-40 w-[238px] border-r border-slate-200 bg-white transition-all duration-300 lg:translate-x-0">
      <div class="sidebar-brand flex h-[82px] items-center border-b border-slate-100 px-4 transition-all duration-300">
        <div class="sidebar-brand-inner flex items-center gap-3">
          <div class="flex h-11 w-11 shrink-0 items-center justify-center text-ubis-teal"><img src="image/emblem-dark.png" alt="Government of India" width="30" height="30"></div>
          <div class="brand-copy"><p class="text-[10px] font-bold uppercase tracking-[.16em] text-ubis-teal">${escapeHtml(config.brand.ministry)}</p><p class="mt-0.5 text-sm font-bold text-ubis-navy">${escapeHtml(config.brand.government)}</p></div>
        </div>
      </div>
      <nav class="space-y-1 px-3 py-4">
        <p class="sidebar-label mb-2 px-3 text-[10px] font-bold uppercase tracking-[.15em] text-slate-400">${escapeHtml(config.sectionLabel)}</p>
        ${config.items.map(renderItem).join('')}
      </nav>
      <div class="sidebar-support absolute bottom-4 left-3 right-3 rounded-xl border border-slate-200 bg-slate-50 p-3 transition-all duration-300">
        <div class="flex items-center gap-2"><i data-lucide="help-circle" class="h-4 w-4 text-ubis-blue"></i><div class="sidebar-label"><p class="text-[11px] font-semibold text-slate-700">Need assistance?</p><p class="text-[10px] text-slate-500">UBIS Support Desk</p></div></div>
      </div>
    </aside>`;
  };
})(window.UBISIncludes);
