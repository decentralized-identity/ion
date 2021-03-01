
import '/ion/js/modules/dom.js';

var Router = globalThis.Router = Object.assign({
  initialized: false,
  last: {
    __state__: true,
    href: location.href,
    origin: location.origin,
    path: null,
    search: '',
    params: {}
  },
  filters: [
    // {
    //   path: '',
    //   params: ['foo', 'bar']
    // }
  ],
  generateState(location){
    return {
      __state__: true,
      href: location.href,
      origin: location.origin,
      path: location.pathname.replace(/\/$/, ''),
      search: location.search,
      params: Object.fromEntries(new URLSearchParams(location.search))
    }
  },
  modifyState(options = {}) {
    let state = new URL(location.href);
    state.pathname = options.path || location.pathname;
    if (options.params) {
      let params = new URLSearchParams(state.search);
      for (let z in options.params) params.set(z, options.params[z]);
      state.search = params.toString();
    }
    Router.setState(state, options.event || null);
  },
  setState (newState, event){
    console.log(arguments);
    if (!newState.__state__) newState = Router.generateState(newState);
    let routeMatched;
    let oldState = Router.last;
    Router.filters.forEach(filter => {
      let path = filter.path.replace(/\/$/, '');
      console.log(path, newState.path, oldState.path);
      let pathMatched = path && path === newState.path;
      let pathChanged = pathMatched && path !== oldState.path;
      let paramsChanged = filter.params ? filter.params.some(param => {
        return oldState.params[param] !== newState.params[param];
      }) : false;
      if (pathMatched) {
        routeMatched = location.origin === newState.origin;
        if (routeMatched && (pathChanged || paramsChanged) && filter.listener) filter.listener(newState, oldState);
      }
    });
    if (routeMatched) {
      if (event && event.type !== 'popstate') event.preventDefault();
      if (Router.initialized){
        if ((newState.href !== oldState.href) && event && event.type !== 'popstate') {
          history.pushState(newState, 'ION' + (newState.title ? ' - ' + newState.title : ''), newState.search);
        }
      }
      else {
        history.replaceState(newState, 'ION' + (newState.title ? ' - ' + newState.title : ''), newState.search);
      }
      document.documentElement.setAttribute('route', newState.path + newState.search);
      Router.last = newState;
      dispatchEvent(new Event('routechange', {
        detail: {
          current: newState,
          previous: oldState
        }
      }));
    }
    Router.initialized = true;
  }

}, globalThis.Router || {});

globalThis.onpopstate = function(event){
  Router.setState(event.state);
}

DOM.delegateEvent('click', 'a[href]', function(event, delegate){
  Router.setState(delegate, event);
})

document.documentElement.setAttribute('route', globalThis.location.pathname + globalThis.location.search);

export { Router };