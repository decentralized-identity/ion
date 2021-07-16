
import '/ion/js/modules/dom.js';

var TabPanels = globalThis.TabPanels = class TabPanels extends HTMLElement {
  constructor() {
    super();
    DOM.delegateEvent('click', 'tab-panels > nav > *', (e, delegate) => {
      let nav = delegate.parentElement;
      if (nav.parentElement === this) {
        this.setAttribute('selected-index', Array.prototype.indexOf.call(nav.children, delegate))
      }
    }, { container: this, passive: true });
  }
  static get observedAttributes() {
    return ['selected-index'];
  }
  attributeChangedCallback(attr, last, current) {
    DOM.ready.then(() => {
      switch(attr) {  
        case 'selected-index':
          let index = current || 0;
          let nav = this.querySelector('nav');
          if (nav.parentElement === this) {
            let tabs = nav.children;
            let selected = tabs[index];
            for (let tab of tabs) tab.removeAttribute('selected');
            if (selected) selected.setAttribute('selected', '');
            let panel = Array.prototype.filter.call(this.children, node => {
              if (node.tagName === 'SECTION') {
                node.removeAttribute('selected');
                return true;
              }
            })[index];
            if (panel) panel.setAttribute('selected', '');
            DOM.fireEvent(this, 'tabselected', { detail: { index: index, tab: selected, panel: panel }});
          }
          break;
      }
    });
  }
};

customElements.define('tab-panels', TabPanels);

export { TabPanels };