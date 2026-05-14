// Scroll-reveal animations for Scopal Firm website.
// Loaded as a deferred external script so the CSP (script-src 'self') allows it.
(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  document.querySelectorAll('[data-animate]').forEach(function (el) {
    observer.observe(el);
  });
})();
