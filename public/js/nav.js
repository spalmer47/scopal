// Header navigation interactions for Scopal Firm website.
// Loaded as a deferred external script so the CSP (script-src 'self') allows it.
(function () {

  // Hamburger / mobile nav toggle
  var hamburger = document.getElementById('hamburger');
  var mobileNav = document.getElementById('mobile-nav');

  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', function () {
      var isOpen = hamburger.getAttribute('aria-expanded') === 'true';
      hamburger.setAttribute('aria-expanded', String(!isOpen));
      hamburger.setAttribute(
        'aria-label',
        isOpen ? 'Open navigation menu' : 'Close navigation menu'
      );
      mobileNav.classList.toggle('hidden');
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.setAttribute('aria-label', 'Open navigation menu');
        mobileNav.classList.add('hidden');
        hamburger.focus();
      }
    });
  }

  // Practice Areas desktop dropdown
  var practiceBtn = document.getElementById('practice-btn');
  var practiceDropdown = document.getElementById('practice-dropdown');

  if (practiceBtn && practiceDropdown) {
    practiceBtn.addEventListener('click', function () {
      var isOpen = practiceBtn.getAttribute('aria-expanded') === 'true';
      practiceBtn.setAttribute('aria-expanded', String(!isOpen));
      practiceDropdown.hidden = isOpen;
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (
        !practiceBtn.contains(e.target) &&
        !practiceDropdown.contains(e.target)
      ) {
        practiceBtn.setAttribute('aria-expanded', 'false');
        practiceDropdown.hidden = true;
      }
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && practiceBtn.getAttribute('aria-expanded') === 'true') {
        practiceBtn.setAttribute('aria-expanded', 'false');
        practiceDropdown.hidden = true;
        practiceBtn.focus();
      }
    });
  }

})();
