
import '/ion/js/modules/dom.js';

var ModalOverlay = globalThis.ModalOverlay = class ModalOverlay extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();
    
    this.addEventListener('pointerup', e => {
      if (e.target === this || e.target.hasAttribute('modal-close')) this.close();
    });

    this.addEventListener('transitionend', e => {
      if (e.target === this && e.propertyName === 'opacity') {
        DOM.fireEvent(this, this.isOpen ? 'modalopened' : 'modalclosed')
      }
    });
  }
  get isOpen (){
    return this.hasAttribute('open');
  }
  open (){
    this.setAttribute('open', '');
  }
  close (){
    this.removeAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open':
        DOM.ready.then(e => {
          DOM.fireEvent(this, current !== null ? 'modalopen' : 'modalclose')
        })
      }
    }
};

customElements.define('modal-overlay', ModalOverlay)

export { ModalOverlay };