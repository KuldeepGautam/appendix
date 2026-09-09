window.UBISIncludes = window.UBISIncludes || {};
(function (includes) {
  const markup = `
    <footer class="border-t border-slate-200 bg-white px-4 py-3 text-center text-[10px] font-medium text-slate-500 lg:px-7">
      Union Budget Information System - Department of Economic Affairs, Ministry of Finance
    </footer>`;

  includes.footer = function () {
    return markup;
  };
})(window.UBISIncludes);
