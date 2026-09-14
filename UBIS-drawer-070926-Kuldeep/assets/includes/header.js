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

if (typeof window.toggleProfileMenu !== 'function') {
  window.toggleProfileMenu = function (e) {
    if (e) e.stopPropagation();
    const menu = document.getElementById('profileMenu');
    const btn = document.getElementById('profileDropdownBtn');
    const chevron = document.getElementById('profileChevron');
    if (!menu) return;
    const isHidden = menu.classList.contains('hidden');
    if (isHidden) {
      menu.classList.remove('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'true');
      if (chevron) chevron.style.transform = 'rotate(180deg)';
      if (window.lucide) window.lucide.createIcons();
    } else {
      menu.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = '';
    }
  };

  document.addEventListener('click', function (e) {
    const container = document.getElementById('profileDropdownContainer');
    const menu = document.getElementById('profileMenu');
    const chevron = document.getElementById('profileChevron');
    const btn = document.getElementById('profileDropdownBtn');
    if (container && !container.contains(e.target) && menu && !menu.classList.contains('hidden')) {
      menu.classList.add('hidden');
      if (btn) btn.setAttribute('aria-expanded', 'false');
      if (chevron) chevron.style.transform = '';
    }
  });
}

if (typeof window.handleSignOut !== 'function') {
  window.handleSignOut = function (e) {
    if (e) e.preventDefault();
    if (confirm('Are you sure you want to sign out from UBIS?')) {
      if (typeof window.showToast === 'function') {
        window.showToast('You have been signed out successfully.', 'Session Ended');
      } else {
        alert('You have been signed out successfully.');
      }
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

        <!-- User Profile Dropdown -->
        <div class="relative" id="profileDropdownContainer">
          <button id="profileDropdownBtn" type="button" onclick="toggleProfileMenu(event)"
            class="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-2.5 hover:bg-slate-50 cursor-pointer transition focus:outline-none focus:ring-2 focus:ring-teal-100"
            aria-expanded="false" aria-haspopup="true" aria-label="User profile">
            <span
              class="flex h-8 w-8 items-center justify-center rounded-full bg-ubis-navy text-xs font-bold text-white shadow-sm">AG</span>
            <span class="user-copy hidden text-left sm:block">
              <span class="block text-[11px] font-bold text-slate-700 leading-tight">AGRICOOP</span>
              <span class="block text-[9px] text-slate-500 leading-tight">Data Operator</span>
            </span>
            <i id="profileChevron" data-lucide="chevron-down" class="user-copy h-3.5 w-3.5 text-slate-400 transition-transform duration-200"></i>
          </button>

          <!-- Profile Dropdown Menu -->
          <div id="profileMenu" class="absolute right-0 top-12 z-50 hidden w-60 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl ring-1 ring-black/5">
            <!-- Profile Info Card -->
            <div class="rounded-xl bg-slate-50 p-3 border border-slate-100 mb-1.5">
              <div class="flex items-center gap-2.5">
                <span class="flex h-9 w-9 items-center justify-center rounded-full bg-ubis-navy text-xs font-bold text-white shadow">AG</span>
                <div class="min-w-0 flex-1">
                  <p class="text-xs font-bold text-slate-800 truncate">AGRICOOP</p>
                  <p class="text-[10px] text-slate-500 truncate">Dept. of Agriculture &amp; Farmers Welfare</p>
                </div>
              </div>
              <div class="mt-2 flex items-center justify-between border-t border-slate-200/60 pt-2">
                <span class="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[9px] font-bold text-emerald-800">
                  <span class="h-1.5 w-1.5 rounded-full bg-emerald-500"></span> Active
                </span>
                <span class="text-[10px] font-medium text-slate-500">Data Operator</span>
              </div>
            </div>

            <!-- Action Links -->
            <div class="space-y-0.5 text-xs">
              <a href="#" class="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-ubis-navy transition">
                <i data-lucide="user" class="h-4 w-4 text-slate-400"></i>
                <span>My Profile</span>
              </a>
              <a href="#" class="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-ubis-navy transition">
                <i data-lucide="shield-check" class="h-4 w-4 text-slate-400"></i>
                <span>Change Password</span>
              </a>
              <a href="#" class="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-ubis-navy transition">
                <i data-lucide="settings-2" class="h-4 w-4 text-slate-400"></i>
                <span>Preferences</span>
              </a>
              <a href="#" class="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-slate-700 hover:bg-slate-50 hover:text-ubis-navy transition">
                <i data-lucide="history" class="h-4 w-4 text-slate-400"></i>
                <span>Activity &amp; Logs</span>
              </a>
              <div class="my-1 border-t border-slate-100"></div>
              <a href="#" onclick="handleSignOut(event)" class="flex items-center gap-2.5 rounded-lg px-3 py-2 font-medium text-red-600 hover:bg-red-50 transition">
                <i data-lucide="log-out" class="h-4 w-4 text-red-500"></i>
                <span>Sign Out</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>`;
  };
})(window.UBISIncludes);