
import '/ion/js/modules/dom.js';

var NoticeBar = globalThis.NoticeBar = class NoticeBar extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor(options = {}) {
    super();
    this.options = options;
    this.addEventListener('transitionend', e => {
      if (e.target === this && e.propertyName === 'transform') {
        let showing = this.getAttribute('notice-state') === 'show';
        if (showing) this.setAttribute('notice-state', 'hide');
        else if (!this.options.retain && this.parentElement) this.parentElement.removeChild(this);
        DOM.fireEvent(this, showing ? 'noticeshow' : 'noticehide');
      }
    });
    this.addEventListener('pointerenter', e => this.setAttribute('notice-interaction', ''));
  }
  render(options){
    this.setAttribute('notice-type', options.type || 'default');
    this.innerHTML = `<header>${options.title || ''}</header>
                      <section>${options.body || ''}</section>
                      <footer>${options.footer || ''}</footer>`;
    (options.container || document.body || document.documentElement).appendChild(this);
  }
  notify (options){
    this.options = options || this.options;
    this.render(this.options);
    DOM.skipAnimationFrame(() => this.setAttribute('notice-state', 'show'));
  }
};

customElements.define('notice-bar', NoticeBar)

export { NoticeBar };