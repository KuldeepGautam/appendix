window.UBISAppIncludes = window.UBISAppIncludes || {};

(function (ns) {
  var groupedNav = [
     {
      id: "dashboard",
      icon: "layout-dashboard",
      label: "Dashboard",
      children: [
        {
          id: "dashboard-link",
          label: "Dashboard",
          showToggleIcon: false,
          href: "dashboard.html",
        }
      ]
    },
    {
      id: "budget",
      icon: "calendar-days",
      label: "Pre-Budget Meeting",
      children: [
        {
          id: "budget-pre-budget-meeting",
          label: "Pre-Budget Meeting",
          href: "pre-budget-meeting.html",
          showToggleIcon: false
        },
        {
          id: "budget-autonomous-master",
          label: "Autonomous Master/Grantee Name",
          href: "re-meeting/autonomous-master.html",
          showToggleIcon: false
        }
      ]
    },
    {
      id: "DDG",
      icon: "users-round",
      label: "DDG",
      children: [
        {
          id: "ddg-1",
          label: "DDG",
          showToggleIcon: true,
          children: [
            { id: "ddg-1-de", href: "data-entry.html#list", label: "Data Entry DDG(New)" },
            { id: "ddg-1-hoa", href: "edit-hindi-hoa.html#list", label: "Edit Hindi HOA" },
            { id: "ddg-1-transfer-ddg", href: "transfer-ddg-data.html#list", label: "Transfer DDG Data to SBE" }
          ]
        },
        {
          id: "ddg-2",
          label: "DDG Master",
          showToggleIcon: true,
          children: [
            {
              id: "ddg-2",
              label: "DDG",
              showToggleIcon: false,
              href: "Add HOA in ACTDRX",
            }
          ]
        },
        {
          id: "ddg-3",
          label: "Reports",
          showToggleIcon: true,
          children: [
            { id: "ddg-3-generate-ddg", href: "generate-ddg.html", label: "Generate DDG" },
            { id: "ddg-3-mep-qep-report", href: "mep-qep-report.html#list", label: "MEP/QEP Report" },
            { id: "ddg-3-mismatch-summary", href: "mismatch-summary-ddg.html", label: "Mismatch summary of DDg with SBE" },
            { id: "ddg-3-sbe-schemes", href: "sbe-schemes.html", label: "SBE schemes not mapped" },
            { id: "ddg-3-ddg-head-account", href: "ddg-head-account.html", label: "DDG Head of Account not mapped" },
            { id: "ddg-3-hoa-not-ddg", href: "hoa-not-ddg.html", label: "HOA not in DDG" },
            { id: "ddg-3-hoa-pfms", href: "hoa-pfms.html", label: "HOA not in PFMS" },
            { id: "ddg-3-status-ddg-demand", href: "status-ddg-demand.html", label: "Status of DDG Demand" },
            { id: "ddg-3-status-ddg-demand", href: "status-ddg-demand.html", label: "RE and BME sum mismatch for transferring data" },
            { id: "ddg-3-sum-mismatch-ddg-dg", href: "sum-mismatch-ddg-dg.html", label: "Sum Mismatch of DDG with DG" },
            { id: "ddg-3-sum-mismatch-ddg-dg", href: "demand-ceiling-validation.html", label: "Demand Ceiling Validations Checklist" }
          ]
        },
      ]
    },
    {
      id: "ECL",
      icon: "badge-check",
      label: "ECL",
      children: [
        {
          id: "ecl-entry",
          label: "ECL Data Entry",
          showToggleIcon: true,
          children: [
            { id: "ecl-data-entry", href: "ECL/ECLOutlay.html", label: "Add Scheme Outlay" },
            { id: "ecl-actuals-entry", href: "ECL/ECLActualsEntry.html", label: "Add Actuals" }
          ]
        },
        {
          id: "ecl-report",
          label: "ECL Report",
          showToggleIcon: true,
          children: [
            { id: "ecl-report", href: "ECL/ECL-Report.html", label: "Data Analysis" }
          ]
        }
      ]
    },
    {
      id: "Exp Budget (SBE)",
      icon: "indian-rupee",
      label: "Exp Budget (SBE)",
      children: [
        {
          id: "exp-budget-circulars",
          label: "List of circulars",
          showToggleIcon: false,
          href: "exp-budget-SBE/list-circulars.html",
          // children: [
          //   { id: "exp-budget-monthly-open", href: "reports.html#monthly", label: "Monthly Reports" }
          // ]
        },
        {
          id: "exp-budget-data-entry",
          label: "Data Entry",
          showToggleIcon: true,
          children: [
            { id: "data-entry-add-sbe", href: "exp-budget-SBE/add-sbe-forddg.html", label: "Add SBE" },
            { id: "data-entry-sbe-notes", href: "exp-budget-SBE/add-sbenotes.html", label: "SBE Notes" },
            // { id: "data-entry-add-charged", href: "exp-budget-SBE/add-edit-recoveries-data.html", label: "Add Charged/Recoveries" },
            { id: "data-entry-add-pse-category", href: "exp-budget-SBE/pse-category.html", label: "Add PSE Category" },
            { id: "data-entry-invest-pse", href: "exp-budget-SBE/investment-pse.html", label: "Investment in PSE" },
            { id: "data-entry-import-actuals-ddg", href: "exp-budget-SBE/actual-mapping.html", label: "Import Actuals From DDG" },
            { id: "data-entry-renumber-scheme", href: "exp-budget-SBE/renumber-scheme-srno.html", label: "Renumber Scheme Sr. No." },
            { id: "data-entry-renumber-subscheme", href: "exp-budget-SBE/renumber-subscheme-srno.html", label: "Renumber Subscheme Sr No" },
            { id: "data-entry-renumber-pse", href: "exp-budget-SBE/renumber-pseName.html", label: "Renumber PSE Code" },
            { id: "data-entry-renumber-sbe-note", href: "exp-budget-SBE/renumbering-sbenotes.html", label: "Renumber SBE Notes" },   
            { id: "data-entry-renumber-sbe-note", href: "exp-budget-SBE/single-receiptBudget_NTR.html", label: "Add Receipt Budget Details" },          
            // { id: "data-entry-notes-for-ntr", href: "exp-budget-SBE/notes-for-ntr.html", label: "Notes for NTR" },           
            // { id: "data-entry-request-for-ipchange", href: "exp-budget-SBE/section-ipusers.html", label: "Request for IP Change" },   
            { id: "data-entry-sbe-freeze", href: "exp-budget-SBE/sbee.html", label: "SBE Freeze" },  
            // { id: "data-entry-sbe-line-entry-delete-permission", href: "exp-budget-SBE/revoke-scheme.html", label: "SBE Line Entry Delete Permission" },   
          ]
        },
        // {
        //   id: "exp-budget-update-contact",
        //   label: "Update Contact",
        //   showToggleIcon: true,
        //   children: [
        //     { id: "update-contact-nodal-officer", href: "updateinfo.html", label: "Update Contact" },          
        //   ]
        // },

        {
          id: "reports",
          label: "Reports",
          showToggleIcon: true,
          children: [
            { id: "reports-reports-dg", href: "exp-budget-SBE/dg-for-alldemand.html", label: "Generate DG" },
            { id: "reports-generate-sbe-userwise", href: "exp-budget-SBE/rsbe.html", label: "Generate SBE UserWise" },
            { id: "reports-invest-pse-report", href: "exp-budget-SBE/investment-in-pse-report.html", label: "Investment in PSEs Report" },
            { id: "reports-recript-recovery", href: "exp-budget-SBE/receipt-rec-charged-report.html", label: "Receipt/Recovery/Charged Report" },
            // { id: "reports-revoke-scheme-report", href: "revoke-scheme-report.html", label: "SBE Line Entry Delete Permission" },
            { id: "reports-sbe-report-without-data", href: "exp-budget-SBE/demand-wise-sbe-report-without-data.html", label: "SBE Report without Data"},
            // { id: "reports-ntr", href: "NTRReportDemandWise.html", label: "NTR" },
            // { id: "data-entry-renumber-subscheme", href: "renumber-sub-scheme-srno.html", label: "Vote on Account" },
            // { id: "reports-vote-on-accountall", href: "Vote-accountall.html", label: "Demand Ceiling Validations Checklist" },
            // { id: "reports-re-nbe-mismatch", href: "mismatch-nbe-ddg-sbe.html", label: "RE and NBE sum mismatch fro transferring data" },   
          ]
        },
// {
//           id: "VOA",
//           label: "VOA",
//           showToggleIcon: true,
//           children: [
//             { id: "voa-commited-liabilities", href: "voa-commitments.html", label: "Commited Liablities" },
//             { id: "voa-scheme-excluded-voa", href: "scheme-not-included-voa.html", label: "Scheme to be Exclude from VOA" }, 
//           ]
//         },

      ]
    },
       {
      id: "Exp Profile",
      icon: "chart-column",
      label: "Exp Profile",
      children: [
        {
          id: "Statment",
          label: "Statement",
          showToggleIcon: true,
          children: [
            { id: "statment-entry", href: "statment/stat-entry.html", label: "Statment Entry" },
            { id: "statment-add-stat-notes", href: "statment/add-stat-notes.html", label: "Add Statement Notes" },
            { id: "statment-mapping-stat", href: "statment/mapping-stat.html", label: "Mapping of Statment 7,8 and 18" },
            { id: "statment-receipt-layout", href: "statment/receipt-layout.html", label: "Receipt Layout" },
            { id: "statment-receipt-stat-entry", href: "statment/receipt-stat-entry.html", label: "Receipt Statement Entry" }
          ]
        },
        {
          id: "Railways",
          label: "Railways",
          showToggleIcon: true,
          children: [
            { id: "railways-stat-entry", href: "railways/railway-stat-entry.html", label: "Railway Statement Entry" },
            { id: "railways-stat-report", href: "railways/railway-stat-report.html", label: "Railway Statement Report" },
            { id: "railways-operation-ratio", href: "railways/operation-ratio.html", label: "Operation Ratio" },            
          ]
        },
                {
          id: "Stat-Reports",
          label: "Statment Reports",
          showToggleIcon: true,
          children: [
            { id: "statment-reports", href: "stat-reports/stat-reports.html", label: "Statement Reports" },            
          ]
        },
        {
          id: "ecl-report",
          label: "ECL Report",
          showToggleIcon: true,
          children: [
            { id: "ecl-report", href: "ECL/ECL-Report.html", label: "Data Analysis" }
          ]
        }
      ]
    },
  ];

  var utilityNav = [
    // { href: "exp-profile.html", icon: "chart-column", label: "Exp Profile", title: "Exp Profile" },
    { href: "supplementary-budget.html", icon: "file-plus-2", label: "Supplementary Budget", title: "Supplementary Budget" },
    { href: "receipt-budget.html", icon: "receipt", label: "Receipt Budget", title: "Receipt Budget" },
    { href: "reappropriation.html", icon: "user-round", label: "Reappropriation", title: "Reappropriation" },
    { href: "autonomouse-grantee.html", icon: "arrow-right-left", label: "Autonomouse/Grantee Bodies ", title: "Autonomouse/Grantee Bodies" },
    { href: "contigency-advance.html", icon: "shield-alert", label: "Contigency Advance", title: "Contigency Advance" }
  ];

  /*
    Config guide:

    Main only:
    {
      id: "dashboard",
      icon: "layout-dashboard",
      label: "Dashboard",
      href: "dashboard.html"
    }

    Main -> Child direct links:
    {
      id: "budget",
      icon: "calendar-days",
      label: "Pre-Budget Meeting",
      children: [
        { id: "budget-pre-budget-meeting", label: "Pre-Budget Meeting", href: "pre-budget-meeting.html", showToggleIcon: false }
      ]
    }

    Main -> Child -> Sub-child:
    {
      id: "reports",
      icon: "file-text",
      label: "Reports",
      children: [
        {
          id: "reports-monthly",
          label: "Monthly Reports",
          showToggleIcon: true,
          children: [
            { id: "reports-monthly-open", label: "Open Monthly Report", href: "reports.html#monthly" }
          ]
        }
      ]
    }
  */

  function currentLocationState() {
    return {
      page: location.pathname.split("/").pop() || "dashboard.html",
      hash: location.hash || ""
    };
  }

  function hrefState(href) {
    var anchor = document.createElement("a");
    anchor.href = href;

    return {
      page: anchor.pathname.split("/").pop() || "dashboard.html",
      hash: anchor.hash || ""
    };
  }

  function pageMatches(href, current) {
    var target = hrefState(href);
    if (target.page !== current.page) {
      return false;
    }

    return !target.hash || target.hash === current.hash;
  }

  function buildLeafState(item, current) {
    var itemHref = item.href || "";
    return {
      id: item.id,
      href: itemHref,
      label: item.label,
      current: itemHref ? pageMatches(itemHref, current) : false,
      active: itemHref ? pageMatches(itemHref, current) : false
    };
  }

  function buildChildState(child, current) {
    var items = (child.children || []).map(function (item) {
      return buildLeafState(item, current);
    });
    var childHref = child.href || "";
    var isCurrent = childHref ? pageMatches(childHref, current) : false;
    var isActive = isCurrent || items.some(function (item) {
      return item.active;
    });

    return {
      id: child.id,
      label: child.label,
      href: childHref,
      showToggleIcon: child.showToggleIcon,
      active: isActive,
      current: isCurrent,
      directLink: !!childHref && items.length === 0,
      hasChildren: items.length > 0,
      items: items
    };
  }

  function buildGroupState(group, current) {
    var children = (group.children || []).map(function (child) {
      return buildChildState(child, current);
    });
    var groupHref = group.href || "";
    var isCurrent = groupHref ? pageMatches(groupHref, current) : false;
    var isActive = isCurrent || children.some(function (child) {
      return child.active;
    });

    return {
      id: group.id,
      icon: group.icon,
      label: group.label,
      href: groupHref,
      active: isActive,
      current: isCurrent,
      directLink: !!groupHref && children.length === 0,
      children: children
    };
  }

  function buildNavigationState() {
    var current = currentLocationState();

    return groupedNav.map(function (group) {
      return buildGroupState(group, current);
    });
  }

  function renderSubChildren(child) {
    return child.items.map(function (item) {
      return '<a href="' + item.href + '" class="sub-link sidebar-sub-link' + (item.active ? " active-child" : "") + '"' +
        ' data-nav-level="subchild" data-subchild-id="' + item.id + '"' +
        (item.current ? ' aria-current="page"' : "") + ">" + item.label + "</a>";
    }).join("");
  }

  function renderChild(child) {
    if (child.directLink) {
      return '<a href="' + child.href + '" class="sub-link sidebar-child-link' + (child.active ? " active-child" : "") + '"' +
        ' data-nav-level="child" data-child-id="' + child.id + '"' +
        (child.current ? ' aria-current="page"' : "") + ">" +
        '<span>' + child.label + "</span>" +
        "</a>";
    }

    return '<details class="sidebar-child-accordion" data-child-accordion="' + child.id + '"' + (child.active ? " open" : "") + ">" +
      '<summary class="sub-link sub-link-toggle' + (child.active ? " active-child" : "") + '"' +
      ' data-nav-level="child" data-child-id="' + child.id + '" aria-haspopup="true" aria-expanded="' + (child.active ? "true" : "false") + '"' +
      ' aria-controls="sidebar-child-panel-' + child.id + '">' +
      '<span>' + child.label + '</span>' +
      (child.showToggleIcon !== false
        ? '<i data-lucide="chevron-right" class="sidebar-sub-toggle-icon"></i>'
        : '') +
      "</summary>" +
      '<div id="sidebar-child-panel-' + child.id + '" class="sidebar-subchildren">' +
      renderSubChildren(child) +
      "</div>" +
      "</details>";
  }

  function renderGroup(group) {
    if (group.directLink) {
      return '<a href="' + group.href + '" class="nav-section' + (group.active ? " is-current" : "") + '"' +
        ' data-main-link data-main-id="' + group.id + '"' +
        (group.current ? ' aria-current="page"' : "") + ">" +
        '<i data-lucide="' + group.icon + '"></i>' +
        '<span class="sidebar-label">' + group.label + "</span>" +
        "</a>";
    }

    return '<details class="group sidebar-accordion" data-accordion="' + group.id + '"' + (group.active ? " open" : "") + ">" +
      '<summary class="nav-section' + (group.active ? " is-current" : "") + '" data-main-trigger data-main-id="' + group.id + '" aria-haspopup="true" aria-expanded="false" aria-controls="sidebarFloatingMenu">' +
      '<i data-lucide="' + group.icon + '"></i>' +
      '<span class="sidebar-label">' + group.label + "</span>" +
      '<i data-lucide="chevron-down" class="sidebar-label ml-auto h-4 w-4 transition group-open:rotate-180"></i>' +
      "</summary>" +
      '<div class="sidebar-label ml-8 space-y-1 border-l border-slate-200 pl-3 dark:border-slate-800">' +
      group.children.map(renderChild).join("") +
      "</div>" +
      "</details>";
  }

  ns.getSidebarNavigationState = function getSidebarNavigationState() {
    return buildNavigationState();
  };

  ns.renderSidebar = function renderSidebar() {
    var navigationState = buildNavigationState();

    var accordionMarkup = navigationState.map(renderGroup).join("");

    var current = currentLocationState();
    var utilityMarkup = utilityNav.map(function (link) {
      var isActive = pageMatches(link.href, current);
      return '<a href="' + link.href + '" class="nav-link' + (isActive ? " active" : "") + '" title="' + link.title + '"' +
        (isActive ? ' aria-current="page"' : "") + ">" +
        '<i data-lucide="' + link.icon + '"></i><span class="sidebar-label">' + link.label + "</span></a>";
    }).join("");

    return '<aside id="sidebar" class="fixed inset-y-0 left-0 z-40 flex w-72 -translate-x-full flex-col border-r border-slate-200 bg-white shadow-2xl transition-all duration-300 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950">' +
      '<div class="flex h-20 items-center gap-3 border-b border-slate-200 px-5 dark:border-slate-800">' +
      '<div class="emblem xs-small"><img src="images/emblem-dark.png" alt="Government of India" width="30" height="30"></div>' +
      '<div class="sidebar-label min-w-0"><p class="text-xs font-black uppercase text-teal">Ministry of Finance</p><p class="truncate text-lg font-black text-navy dark:text-white">Government of India</p></div>' +
      '<button data-sidebar-mobile class="ml-auto rounded-lg p-2 lg:hidden"><i data-lucide="x"></i></button>' +
      "</div>" +
      '<nav class="flex-1 overflow-y-auto px-3 py-4" aria-label="Primary navigation">' + accordionMarkup + utilityMarkup + "</nav>" +
      "</aside>";
  };
})(window.UBISAppIncludes);
