window.UBISAppIncludes = window.UBISAppIncludes || {};

(function (ns) {
  ns.renderShell = function renderShell() {
    var body = document.body;
    if (!body || body.dataset.shell !== "app") {
      return;
    }

    var sidebarHost = document.querySelector('[data-include="sidebar"]');
    var headerHost = document.querySelector('[data-include="header"]');
    var centerHost = document.querySelector('[data-include="center"]');
    var footerHost = document.querySelector('[data-include="footer"]');

    if (sidebarHost && ns.renderSidebar) {
      sidebarHost.outerHTML = ns.renderSidebar();
    }

    if (headerHost && ns.renderHeader) {
      headerHost.outerHTML = ns.renderHeader();
    }

    if (centerHost && ns.renderCenterIntro) {
      centerHost.outerHTML = ns.renderCenterIntro({
        title: body.dataset.pageTitle,
        breadcrumb: body.dataset.breadcrumb,
        homeHref: body.dataset.homeHref
      });
    }

    if (footerHost && ns.renderFooter) {
      footerHost.outerHTML = ns.renderFooter();
    }
  };
})(window.UBISAppIncludes);
