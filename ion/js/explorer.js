
import '/ion/js/modules/router.js';
import '/ion/js/modules/dom.js';

var currentDidSearch;
var panels = {
  timeline: async () => {},
  search: async () => {},
  create: async () => {
    return import('/ion/js/modules/ion.js');
  }
};

async function initializePanel(currentView){
  if (panels[currentView]) {
    await panels[currentView]();
    delete panels[currentView];
  }
};

Router.filters = [
  {
    path: '/ion/explorer',
    params: ['view'],
    async listener(state, oldState){
      let lastView = oldState.params.view || 'search';
      let currentView = state.params.view || 'search';
      //await initializePanel(currentView);
      if (state.params.did) {
        did_search_input.value = state.params.did;
        if (currentView === 'search') searchForDID();
      }
      explorer_panels.open(currentView);
    }
  }
];

Router.setState(location);

addEventListener('routechange', e => {
  let params = e.detail?.current?.params;
  if (params?.did) {
    did_search_input.value = params.did;
    searchForDID();
  }
})

var chart;
var anchors = [
  [1000, 4],
  [1234, 8],
  [1290, 7],
  [1543, 4],
  [1648, 1],
  [1729, 8],
  [1843, 4],
  [1940, 3],
  [2379, 4],
  [2438, 3],
  [2502, 4],
  [2656, 1],
  [2739, 3],
  [2861, 6],
  [2995, 4],
  [3456, 3],
  [3678, 7],
  [7909, 9],
  [9125, 2],
  [10500, 1]
];

function intBetween(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var maxLengths = {
  block: 0,
  txn: 0,
  op: 0
};

function addListItems(items) {
  let nodes = items.reduce((acc, item) => {
    let opCount = intBetween(1, 600000);
    let box = document.createElement('detail-box');
        box.setAttribute('data-txns', item[1]);
        box.innerHTML = `
          <header class="highlighted-box">
            <div><svg><use href="#box-icon"></use></svg>Block: <strong>${item[0]}</strong></div>
            <div><svg><use href="#hexagons-icon"></use></svg>Transactions: <strong>${item[1]}</strong></div>
            <div><svg><use href="#puzzle-icon"></use></svg>Operations: <strong>${opCount}</strong></div>
          </header>
          <section></section>
        `;
    if (item[0] > maxLengths.block) maxLengths.block = item[0];
    if (item[1] > maxLengths.txn) maxLengths.txn = item[1];
    if (opCount > maxLengths.op) maxLengths.op = opCount;
    acc.unshift(box);
    return acc;
  }, []);
  for (let z in maxLengths) timeline_list.style.setProperty('--max-' + z, String(maxLengths[z]).length + 'ch');
  timeline_list.prepend(...nodes);
};

var lastBlock;
async function getLatestAnchors(){
  if (!chart) return;
  // return fetch(...)
  lastBlock = anchors.slice(-1)[0][0];
  let lastBlockIndex = anchors.length - 1;
  let blockCount = intBetween(1, 6);
  while (blockCount--) { 
    lastBlock = intBetween(lastBlock + 1, lastBlock + intBetween(1, 6));
    let anchor = [lastBlock, intBetween(1, 10)];
    chart.series[0].addPoint(anchor, false);
  }
  chart.redraw();
  addListItems(anchors.slice(lastBlockIndex));
}


var textBright = '#fff';
const axisLabels = {
  format: '{value}',
  style: {
    color: textBright
  }
};

chart = Highcharts.stockChart('timeline_chart', {
  chart: {
    backgroundColor: 'var(--darker-grey)'
  },
  rangeSelector: {
    enabled: false
  },
  scrollbar: {
    enabled: false
  },
  tooltip: {
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    style: {
      color: textBright
    },
    formatter: function() {
      return `${this.y} anchors in block ${this.x}`
    }
  },
  colors: [
    '#a6f0ff',
    '#70d49e',
    '#e898a5',
    '#007faa',
    '#f9db72',
    '#f45b5b',
    '#1e824c',
    '#e7934c',
    '#dadfe1',
    '#a0618b'
  ],
  series: [
    {
      data: anchors,
      shadow: true,
      lineWidth: 0,
      marker: {
        enabled: true,
        radius: 4
      },
      states: {
        hover: {
          lineWidthPlus: 0
        }
      },
    }
  ],
  xAxis: {
    title: {
      text: 'Bitcoin Block Number',
      style: {
          color: textBright
      }
    },
    crosshair: {
      width: 24,
      color: 'rgba(255,255,255, 0.075)'
    },
    range: anchors.slice(-1)[0][0] - anchors.slice(-5, -4)[0][0],
    minRange: 10,
    gridLineColor: '#707073',
    labels: axisLabels,
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',
  },
  yAxis: {
    title: {
      text: 'ION Anchors',
      style: {
        color: textBright
      }
    },
    gridLineColor: '#707073',
    labels: axisLabels,
    lineColor: '#707073',
    minorGridLineColor: '#505053',
    tickColor: '#707073',

  },
  plotOptions: {
    series: {
      dataLabels: {
        color: textBright
      },
      marker: {
        lineColor: '#333'
      }
    },
    boxplot: {
      fillColor: '#505053'
    },
    candlestick: {
      lineColor: 'white'
    },
    errorbar: {
      color: 'white'
    },
    map: {
      nullColor: '#353535'
    }
  },
  labels: {
    style: {
      color: '#707073'
    }
  },
  drilldown: {
    activeAxisLabelStyle: {
      color: textBright
    },
    activeDataLabelStyle: {
      color: textBright
    }
  },
  navigator: {
    height: 75,
    adaptToUpdatedData: true,
    handles: {
      backgroundColor: '#666',
      borderColor: '#AAA'
    },
    outlineColor: '#CCC',
    maskFill: 'rgba(180,180,255,0.1)',
    series: {
      color: '#7798BF',
      lineColor: '#A6C7ED'
    },
    xAxis: {
      gridLineColor: '#505053',
      labels: {
        formatter: entry => entry.value
      }
    }
  }

});

function getTestData(){
  setTimeout(() => {
    getLatestAnchors();
    getTestData();
  }, intBetween(5000, 15000))
}

//getTestData();

addListItems(anchors);

moar_data.addEventListener('pointerup', e => {
  getLatestAnchors();
})

DOM.delegateEvent('pointerup', '[timeline-action]', (e, node) => {
  let attr = (node.getAttribute('timeline-action') || '').split(/\s+/);
  if (attr.includes('zoom-out')){
    chart.zoomOut();
  }
  else if (attr.includes('zoom-latest')) {
    chart.xAxis[0].setExtremes(anchors.slice(-5, -4)[0][0])
  }
});

/* DID Search */


DOM.delegateEvent('transitionend', '[loaders="show"] [loader], [loaders="hide"] [loader]', (e, node) => {
  DOM.fireEvent(e.target, 'loadersready');
});

async function showLoadingUI(container, min = 1500){
  return Promise.all([
    new Promise(resolve => setTimeout(e => resolve(), min)),
    new Promise(resolve => {
      container.addEventListener('loadersready', e => {
        container.setAttribute('loaders', 'showing');
        resolve();
      }, { once: true });
      container.setAttribute('loaders', 'show');
    })
  ]);
}

async function hideLoadingUI(container, gap = 0){
  return new Promise(resolve => {
    container.addEventListener('loadersready', e => {
      setTimeout(e => {
        container.setAttribute('loaders', 'hidden');
        resolve()
      }, gap)
    }, { once: true });
    container.setAttribute('loaders', 'hide');
  })
}

function clearSearchUI(){
  did_overview.innerHTML = '';
  did_document.innerHTML = '';
  did_code_viewer.removeAttribute('linked-domains');
  linked_domains_tabs.innerHTML = '<nav id="linked_domains_nav"></nav>';
}

async function searchForDID(){
  let didURI = (did_search_input.value || '').trim();
  if (!didURI.match('did:ion:') || currentDidSearch === didURI) return;
  search.removeAttribute('status');
  await showLoadingUI(search);
  clearSearchUI();
  let result;
  try {
    result = await fetch('https://beta.discover.did.microsoft.com/1.0/identifiers/' + didURI).then(async response => {
      search.setAttribute('status', response.status);
      if (response.status >= 400) throw '';
      currentDidSearch = didURI;
      return response.json();
    });
  }
  catch(e){
    hideLoadingUI(search);
    return;
  }
  renderSearch(result);
  hideLoadingUI(search);
}

function renderSearch(result){
  let ddo = result.didDocument;
  let meta = result.didDocumentMetadata;
  let services = ddo.service || [];
  let domains = services.reduce((origins, entry) => {
    if (entry.type === 'LinkedDomains') {
      let endpoint = entry.serviceEndpoint;
      if (typeof endpoint === 'string') origins.push(endpoint);
      else return origins.concat(endpoint.origins || endpoint);
    }
    return origins;
  }, []);
  let keys = Object.values(ddo).reduce((keys, items) => {
    if (Array.isArray(items)) {
      items.forEach(entry => entry.publicKeyJwk && keys.push(entry));
    }
    return keys;
  }, []);
  
  did_overview.innerHTML = `
    <li>
      <div class="highlighted-box"><svg><use href="#tag-icon"></use></svg></div>
      <span>Type<strong data-type="${ddo.type || ''}"></strong></span>
    </li>
    <li>
      <div class="highlighted-box"><svg><use href="#network-icon"></use></svg></div>
      <span>Published<strong data-published="${meta.method.published}"></strong></span>
    </li>
    <li>
      <div class="highlighted-box"><svg><use href="#key-icon"></use></svg></div>
      <span>Keys<strong data-keys="${keys.length}"></strong></span>
    </li>
    <li>
      <div class="highlighted-box"><svg><use href="#endpoints-icon"></use></svg></div>
      <span>Endpoints<strong data-services="${services.length}"></strong></span>
    </li>
    <li>
      <div class="highlighted-box"><svg><use href="#dot-com-icon"></use></svg></div>
      <span>Linked Domains<strong data-domains="${domains.length}"></strong></span>
    </li>
  `;
  
  did_code_viewer.setAttribute('linked-domains', domains.length);
  linked_domains_nav.innerHTML = domains.map(domain => `<li data-origin="${domain}">${domain}</li>`);
  linked_domains_tabs.append(...domains.map(() => document.createElement('section')));
  did_document.innerHTML = JSON.stringify(result, null, 2);

  Prism.highlightElement(did_document, true);
}

did_search_bar.addEventListener('submit', async e => {
  e.preventDefault();
  Router.setState(location, false, { params: { did: did_search_input.value } });
  searchForDID();
})

linked_domains_tabs.addEventListener('tabselected', async e => {
  let tab = e.detail.tab;
  let panel = e.detail.panel;
  if (!panel || panel.hasAttribute('data-status')) return;
  let origin = (tab.getAttribute('data-origin') || '').trim();
  panel.setAttribute('data-status', 'loading');
  try {
    let path = origin + (origin.match(/\/$/) ? '' : '/') + '.well-known/did-configuration.json';
    let json = await fetch(path, { mode: 'cors' }).then(raw => raw.json());
    panel.innerHTML = `
      <button clipboard>Copy to Clipboard</button>
      <pre class="language-json" data-src="${path}">${JSON.stringify(json, null, 2)}</pre>
    `;
    Prism.highlightElement(panel.lastElementChild, true);
    panel.setAttribute('data-status', 'loaded');
  }
  catch(e){
    panel.setAttribute('data-status', 'unresolvable');
    panel.innerHTML = `<svg><use href="#doc-error-icon"></use></svg>`;
  }
});

DOM.delegateEvent('click', 'button[clipboard]', (e, node) => {
  navigator.clipboard.writeText(node.nextElementSibling.textContent).then(() => {
    new NoticeBar({
      type: 'success',
      title: 'Copied to clipboard!'
    }).notify();
  }, () => {
    new NoticeBar({
      type: 'error',
      title: "Copy to clipboard failed 😭"
    }).notify();
  });
});