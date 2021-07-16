
import('/ion/js/modules/router.js');

(function(){

  const $ = s => document.querySelector(s);
  const $$ = s => document.querySelectorAll(s);
  const skipFrame = fn => requestAnimationFrame(() => requestAnimationFrame(fn));

  /* Scroll Detection */

  let scrollThrottle = null;

  function scrollThrottleFn() {
    if (window.scrollY > 90) {
      document.body.setAttribute('scrolled', '');
    }
    else {
      document.body.removeAttribute('scrolled');
    }
    scrollThrottle = clearInterval(scrollThrottle);
  };

  window.onscroll = (e) => {
    if (!scrollThrottle) {
      scrollThrottleFn();
      scrollThrottle = setInterval(() => scrollThrottleFn(), 50);
    }
  };

  scrollThrottleFn();

  /* Element Press */

  document.addEventListener('pointerdown', e => {
    e.target.setAttribute('pressed', true);
  }, { passive: true });

  window.addEventListener('pointerup', e => {
    $$('[pressed]').forEach(node => node.removeAttribute('pressed'));
  }, { passive: true });

  skipFrame(() => document.documentElement.setAttribute('ready', ''));

  document.documentElement.setAttribute('origin', location.origin);

})();