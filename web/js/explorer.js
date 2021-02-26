
import '/js/modules/router.js';
import '/js/modules/dom.js';

var currentDidSearch;
var panels = {
  timeline: false,
  search: false
};

Router.filters = [
  {
    path: '/explorer',
    params: ['view'],
    async listener(state, oldState){
      let lastView = oldState.params.view || 'timeline';
      let currentView = state.params.view || 'timeline';
      //await initializePanel(currentView);
      explorer_panels.open(currentView);
    }
  }
];

Router.setState(location);

async function initializePanel(panel){
  if (panels[panel] === false) {
    try {
      let module = panels[panel] = await import(`./explorer/panels/${panel}.js`);
      if (module.initialize) await panels[panel].initialize();
    }
    catch(e){ console.log(e) }
    panels[panel] = true;
  }
}

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

Highcharts.getJSON('https://demo-live-data.highcharts.com/aapl-c.json', function (data) {

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

});

/* DID Search */


DOM.delegateEvent('transitionend', '[loaders="show"] [loader], [loaders="hide"] [loader]', (e, node) => {
  DOM.fireEvent(e.target, 'loadersready');
});

async function showLoadingUI(container, min = 1500){
  return Promise.all([
    new Promise(resolve => setTimeout(e => resolve(), min)),
    new Promise(resolve => {
      container.addEventListener('loadersready', e => resolve(), { once: true });
      container.setAttribute('loaders', 'show');
    })
  ]);
}

async function hideLoadingUI(container, gap = 0){
  return new Promise(resolve => {
    container.addEventListener('loadersready', e => {
      setTimeout(e => resolve(), gap)
    }, { once: true });
    container.setAttribute('loaders', 'hide');
  })
}

did_search_bar.addEventListener('submit', async e => {
  e.preventDefault();
  let didURI = (did_search_input.value || '').trim();
  if (currentDidSearch !== didURI) {
    await showLoadingUI(search, 1500);
    let result;
    try {
      result = await fetch('https://beta.discover.did.microsoft.com/1.0/identifiers/' + didURI)
        .then(async response => {
          if (response.code >= 400) throw '';
          await hideLoadingUI(search);
          return response.json();
        })
        .catch(e => console.log(e))
      currentDidSearch = didURI;
    }
    catch(e){
      console.log(e);
      return;
    }
    console.log(result);

    let ddo = result.didDocument;
    let meta = result.didDocumentMetadata;
    let services = ddo.service || [];
    let keys = Object.values(ddo).reduce((keys, items) => {
      if (Array.isArray(items)) {
        items.forEach(entry => entry.publicKeyJwk && keys.push(entry));
      }
      return keys;
    }, []);
    
    did_overview.innerHTML = `
      <li>
        <div class="highlighted-box"><svg><use href="#tag-icon"></use></svg> Type</div>
        <strong data-type="${ddo.type || ''}"></strong>
      </li>
      <li>
        <div class="highlighted-box"><svg><use href="#network-icon"></use></svg> Published</div>
        <strong data-published="${meta.method.published}"></strong>
      </li>
      <li>
        <div class="highlighted-box"><svg><use href="#key-icon"></use></svg> Keys</div>
        <strong data-keys="${keys.length}"></strong>
      </li>
      <li>
        <div class="highlighted-box"><svg><use href="#endpoints-icon"></use></svg> Endpoints</div>
        <strong data-services="${services.length}"></strong>
      </li>
    `
    did_document.innerHTML = JSON.stringify(result, null, 2);
    Prism.highlightElement(did_document, true);
  }
})