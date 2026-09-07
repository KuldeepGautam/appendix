window.UBISAppIncludes = window.UBISAppIncludes || {};

(function (ns) {
  ns.renderCenterIntro = function renderCenterIntro(meta) {
    var title = meta && meta.title ? meta.title : "Dashboard";
    var homeHref = meta && meta.homeHref ? meta.homeHref : "dashboard.html";
    var breadcrumb = meta && meta.breadcrumb ? meta.breadcrumb : title;

    return '<nav class="mb-5 text-sm text-slate-500" aria-label="Breadcrumb"><a href="' + homeHref + '" class="hover:text-navy">Home</a><span class="mx-2">/</span><span class="font-bold text-slate-700 dark:text-slate-200">' + breadcrumb + "</span></nav>" +
      '<div class="mb-5 rounded-t-lg text-center text-3xl font-black tracking-tight text-white">' + "</div>";
  };
})(window.UBISAppIncludes);
