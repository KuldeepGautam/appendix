window.UBISIncludes = window.UBISIncludes || {};

if (typeof window.toggleSidebar !== 'function') {
  window.toggleSidebar = function () {
    const isCollapsed = document.body.classList.toggle('nav-collapsed');
    try {
      localStorage.setItem('ubis-sidebar-collapsed', isCollapsed ? 'true' : 'false');
    } catch (e) {}

    const toggleBtns = document.querySelectorAll('#sidebarToggleBtn, [onclick*="toggleSidebar"]');
    toggleBtns.forEach(btn => {
      btn.setAttribute('title', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
      btn.setAttribute('aria-label', isCollapsed ? 'Expand sidebar' : 'Collapse sidebar');
      btn.innerHTML = `<i data-lucide="${isCollapsed ? 'panel-left-open' : 'panel-left-close'}" class="h-4 w-4"></i>`;
    });

    if (window.lucide) {
      window.lucide.createIcons();
    }
  };
}

(function (includes) {
  includes.header = function () {
    let isCollapsed = false;
    try {
      isCollapsed = document.body.classList.contains('nav-collapsed') ||
                    localStorage.getItem('ubis-sidebar-collapsed') === 'true';
    } catch (e) {}
    const iconName = isCollapsed ? 'panel-left-open' : 'panel-left-close';
    const label = isCollapsed ? 'Expand sidebar' : 'Collapse sidebar';

    return `<header
      class="sticky top-1 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-5 backdrop-blur lg:px-7">
      <div class="flex min-w-0 items-center gap-4">
        <button id="sidebarToggleBtn" onclick="toggleSidebar()"
          class="hidden h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 cursor-pointer lg:flex transition-colors"
          title="${label}" aria-label="${label}">
          <i id="sidebarToggleIcon" data-lucide="${iconName}" class="h-4 w-4"></i>
        </button>
        <button onclick="toggleMobileNav()"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 cursor-pointer lg:hidden transition-colors"
          title="Toggle navigation" aria-label="Toggle navigation">
          <i data-lucide="menu" class="h-5 w-5"></i>
        </button>

        <div class="flex min-w-0 items-center gap-3">
          <div
            class="flex h-23 w-23 items-center justify-center border-slate-200 bg-white text-ubis-teal shadow-sm">
                <img src="image/ubis_Logo.png" alt="Government of India" width="150" height="150">
          </div>
          <div class="min-w-0">
            <h1 class="truncate text-[17px] font-bold tracking-tight text-ubis-navy">Union Budget Information System
            </h1>
            <p class="truncate text-[10px] font-medium text-slate-500">Department of Economic Affairs, Ministry of
              Finance</p>
          </div>
        </div>
      </div>

      <div class="flex shrink-0 items-center gap-2">
        <button
          class="hidden h-9 w-9 items-center justify-center rounded-full border border-slate-200 text-slate-500 hover:bg-slate-50 sm:flex"
          title="Accessibility">
          <i data-lucide="sun-moon" class="h-4 w-4"></i>
        </button>

        <button
          class="relative flex h-9 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 shadow-sm hover:bg-slate-50">
          <i data-lucide="bell" class="h-4 w-4"></i>
          <span class="hidden sm:inline">Alerts</span>
          <span
            class="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-bold text-white">4</span>
        </button>

        <button
          class="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 hover:bg-slate-50">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full bg-ubis-navy text-xs font-bold text-white">AG</span>
          <span class="user-copy hidden text-left sm:block">
            <span class="block text-[11px] font-bold text-slate-700">AGRICOOP</span>
            <span class="block text-[9px] text-slate-500">Data Operator</span>
          </span>
          <i data-lucide="chevron-down" class="user-copy h-3.5 w-3.5 text-slate-400"></i>
        </button>
      </div>
    </header>`;
  };
})(window.UBISIncludes);