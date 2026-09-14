window.UBISIncludes = window.UBISIncludes || {};

(function (includes) {
  const components = [
    ['sidebar', 'sidebar'],
    ['header', 'header'],
    ['center', 'center'],
    ['footer', 'footer']
  ];

  function renderComponent(name, method) {
    const target = document.querySelector(`[data-ubis-include="${name}"]`);
    if (target && typeof includes[method] === 'function') {
      target.outerHTML = includes[method]();
    }
  }

  function initialize() {
    try {
      if (localStorage.getItem('ubis-sidebar-collapsed') === 'true') {
        document.body.classList.add('nav-collapsed');
      }
    } catch (e) {}

    components.forEach(([name, method]) => renderComponent(name, method));

    if (window.lucide) {
      window.lucide.createIcons();
    }
  }

  initialize();
})(window.UBISIncludes);
