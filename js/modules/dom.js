
const createProps = {
  attributes: (node, attr) => { for (let z in attr) node.setAttribute(z, attr[z]) }
};

var DOM = {
  ready: new Promise(resolve => {
    document.addEventListener('DOMContentLoaded', e => resolve(e));
  }),
  create(tag, props = {}){
    let node = document.createElement(tag);
    for (let z in props) {
      if (createProps[z]) createProps[z](node, props[z]);
      else typeof node[z] === 'function' ? node[z](props[z]) : node[z] = props[z];
    }
    return node;
  },
  skipAnimationFrame: fn => requestAnimationFrame(() => requestAnimationFrame(fn)),
  fireEvent(node, type, options = {}){
    return node.dispatchEvent(new CustomEvent(type, Object.assign({
      bubbles: true
    }, options)))
  },
  delegateEvent(type, selector, fn, options = {}){
    let listener = e => {
      let match = e.target.closest(selector);
      if (match) fn(e, match);
    }
    (options.container || document).addEventListener(type, listener, options);
    return listener;
  },
  setOptions(node, options = {}){
    ((node.getAttribute('options') || '').match(/[^\s]+/ig) || []).forEach(option => {
      options[option] = true;
    });
    return node.options = options;
  }
}

globalThis.DOM = DOM;

export { DOM };
