
import '/js/modules/router.js';

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

var listShift = 0;
var listItemTemplate = data => `
  <strong>Anchor String: </strong><a href="/explorer?view=timeline&anchor=${data.anchor_string}">${data.anchor_string}</a> 
  <strong>Block Number: </strong> <span>${data.block_number}</span>
  <strong>Operation Count: </strong> <span>${data.op_count}</span>
`;
var listItemGenerator = items => items.map(item => {
  let node = document.createElement('li');
  node.innerHTML = listItemTemplate({
    anchor_string: '56g3567h56rnb564r68r68rrn86nr78r6g5wfq32wgw6e7n',
    block_number: item[0],
    op_count: intBetween(1, 10000)
  });
  return node;
})
function addListItems(items){
  timeline_list.style.setProperty('--item-shift', listShift = listShift + items.length);
  let nodes = listItemGenerator(items);
  timeline_list.prepend(...nodes);
}

var lastBlock;
async function getLatestAnchors(){
  if (!chart) return;
  // return fetch(...)
  lastBlock = anchors.slice(-1)[0][0];
  let lastBlockIndex = anchors.length - 1;
  let blockCount = intBetween(1, 6);
  while (blockCount--) { 
    lastBlock = intBetween(lastBlock + 1, lastBlock + intBetween(1, 6));
    let anchor = [lastBlock, intBetween(1, 54)];
    chart.series[0].addPoint(anchor, false);
    //anchors.push(anchor);
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
      backgroundColor: 'var(--body-bk)'
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