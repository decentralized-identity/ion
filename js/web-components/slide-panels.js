
import '/ion/js/modules/dom.js';

var SlidePanels = globalThis.SlidePanels = class SlidePanels extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();
    
    this.addEventListener('pointerup', e => {
      if (e.target === this) this.close();
    });
    this.addEventListener('transitionend', e => {
      if (e.target.parentElement === this && e.propertyName === 'opacity') {
        DOM.fireEvent(this, this.id === this.active ? 'panelopened' : 'panelclosed')
      }
    });
  }
  get active (){
    return this.getAttribute('open');
  }
  toggle(panel){
    this.active === panel ? this.close() : this.open(panel)
  }
  open (panel){
    this.setAttribute('open', panel);
  }
  close (){
    this.removeAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open': for (let child of this.children) {
        if (child.id === current) {
          DOM.fireEvent(child, 'panelopen');
          child.setAttribute('open', '');
        }
        else if (child.hasAttribute('open')) {
          DOM.fireEvent(child, 'panelclose');
          child.removeAttribute('open', '');
        }
      }
      break;
    }
  }
}

customElements.define('slide-panels', SlidePanels);

export { SlidePanels };