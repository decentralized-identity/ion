
import '/ion/js/modules/dom.js';

var DetailBox = globalThis.DetailBox = class DetailBox extends HTMLElement {
  static get observedAttributes() {
    return ['open'];
  }
  constructor() {
    super();   
    
    this.addEventListener('pointerup', e => {
      if (e.target.hasAttribute('detail-box-toggle')) {
        e.stopPropagation();
        this.toggle();   
      }
    });

    this.addEventListener('transitionend', e => {
      let node = e.target;
      if (node.parentElement === this && node.tagName === 'SECTION' && e.propertyName === 'height') {
        node.style.height = this.hasAttribute('open') ? 'auto' : null;
      }
    });
  }
  open (){
    this.setAttribute('open', '')
  }
  close (){
    this.removeAttribute('open');
  }
  toggle(){
    this.toggleAttribute('open');
  }
  attributeChangedCallback(attr, last, current) {
    switch(attr) {
      case 'open':
        DOM.ready.then(e => {
          for (let node of this.children) {
            if (node.tagName === 'SECTION') {
              if (current !== null) {   
                if (node.offsetHeight < node.scrollHeight) {
                  node.style.height = node.scrollHeight + 'px';
                  DOM.fireEvent(this, 'detailboxtoggle', { detail: { open: true } });
                }
              }
              else if (node.offsetHeight > 0) {
                node.style.height = node.offsetHeight + 'px';
                let scroll = this.scrollHeight;
                node.style.height = 0;
                DOM.fireEvent(this, 'detailboxtoggle', { detail: { open: false } });
              }
              break;
            }
          }
        });
    }
  }
};

customElements.define('detail-box', DetailBox);

export { DetailBox };