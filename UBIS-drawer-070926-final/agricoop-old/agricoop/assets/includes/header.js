window.UBISAppIncludes = window.UBISAppIncludes || {};

(function (ns) {
  ns.renderHeader = function renderHeader() {
    return '<header class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">' +
      '<div class="border-t-4 border-ambergov"></div>' +
      '<div class="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">' +
      '<div class="flex items-center gap-3"><button data-sidebar-mobile class="rounded-lg p-2 text-navy lg:hidden"><i data-lucide="menu"></i></button><button id="sidebarToggle" class="hidden rounded-lg p-2 text-navy hover:bg-cyan-50 lg:inline-flex dark:text-sky-200 dark:hover:bg-slate-900" title="Collapse sidebar"><i data-lucide="panel-left-close"></i></button><div class="emblem hidden sm:flex"><img src="images/ubis_Logo.png" alt="Union Budget Information System"></div><div><h1 class="text-2xl font-black text-navy dark:text-white">Union Budget Information System</h1><p class="text-xs font-bold text-slate-500">Department of Economic Affairs, Ministry of Finance</p></div></div>' +
      // '<div class="hidden flex-1 justify-center md:flex"><label class="relative w-full max-w-md"><i data-lucide="search" class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"></i><input class="input pl-10" placeholder="Search budget, schemes, users..." aria-label="Global search" /></label></div>' +
      '<div class="flex items-center gap-2"><button id="themeToggle" class="icon-btn" aria-label="Toggle theme"><i data-lucide="sun-moon"></i></button><button class="icon-btn relative" aria-label="Notifications"><i data-lucide="bell"></i><span class="absolute -right-1 -top-1 rounded-full bg-red-600 px-1.5 text-xs font-bold text-white">4</span></button><details class="relative"><summary class="flex cursor-pointer list-none items-center gap-2 rounded-lg p-1 hover:bg-cyan-50 dark:hover:bg-slate-900"><span class="hidden text-right text-xs sm:block"><b>AGRICOOP</b><br><span class="text-slate-500">Data Operator</span></span><span class="grid h-9 w-9 place-items-center rounded-full bg-navy text-sm font-black text-white">AG</span></summary><div class="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900"><a class="menu-pop" href="profile.html">Profile</a><a class="menu-pop" href="settings.html">Settings</a><a class="menu-pop" href="index.html">Logout</a></div></details></div>' +
      "</div>" +
      // '<div class="bg-teal px-4 sm:px-6 lg:px-8"><div class="flex items-center gap-2 overflow-x-auto text-white"><a class="top-tab" href="dashboard.html">Dashboard</a><a class="top-tab" href="reports.html">RE Meeting</a><a class="top-tab" href="help.html">FAQ</a></div></div>' +
      "</header>";
  };
})(window.UBISAppIncludes);

