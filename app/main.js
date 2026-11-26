// NihonScope app: hash router plus the wiring for every control.
// Routes: #/ overview, #/population, #/economy, #/society,
// #/prefectures, #/compare, #/sources. window.__shotReady is false while a
// page renders and true once it is on screen, so a screenshot script knows
// when to capture.

import { YEARS, SERIES, PREFECTURES } from './data.js';
import { lineChart, barChart } from './charts.js';
import { overview, population, economy, society, prefectures, prefectureRows, compare, sources, missing } from './views.js';

const app = document.getElementById('app');

// UI state kept across renders: chart ranges, chosen indicators, table sort.
const state = {
  fromYear: 1995,
  popIndicator: 'population',
  econIndicator: 'gdp',
  econYear: 9,
  query: '',
  region: 'All regions',
  sortKey: 'pop',
  sortDir: -1,
  compareMetric: 'gdp',
};

function route() {
  const hash = location.hash.replace(/^#\/?/, '');
  return hash.split('/')[0] || '';
}

function $(id) {
  return document.getElementById(id);
}

function on(id, event, fn) {
  const el = $(id);
  if (el) el.addEventListener(event, fn);
}

// Re-render only the chart box of the current page after a control changes.
function redrawChart(boxId, svg) {
  const box = $(boxId);
  if (box) box.innerHTML = svg;
}

function seriesTable(keys, yearIdx) {
  const rows = keys.map((k) => {
    const s = SERIES[k];
    return `<tr><td>${s.label}</td><td class="num">${s.values[yearIdx]}</td><td>${s.unit}</td><td class="src">${s.source}</td></tr>`;
  }).join('');
  return `<table class="data"><thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// Prefecture table: filter by search + region, sort by the chosen column.
function filteredPrefectures() {
  const totalPop = PREFECTURES.reduce((a, p) => a + p.pop, 0);
  let list = PREFECTURES.filter((p) => {
    const q = state.query.trim().toLowerCase();
    const hitQ = !q || p.name.toLowerCase().includes(q) || p.capital.toLowerCase().includes(q);
    const hitR = state.region === 'All regions' || p.region === state.region;
    return hitQ && hitR;
  });
  const dir = state.sortDir;
  const key = state.sortKey;
  list = [...list].sort((a, b) => {
    if (key === 'name' || key === 'capital' || key === 'region') return dir * a[key].localeCompare(b[key]);
    if (key === 'share') return dir * (a.pop - b.pop);
    return dir * (a.pop - b.pop);
  });
  return { list, totalPop };
}

function renderPrefectureTable() {
  const body = $('pref-body');
  const count = $('pref-count');
  if (!body) return;
  const { list, totalPop } = filteredPrefectures();
  body.innerHTML = prefectureRows(list, totalPop);
  if (count) {
    count.textContent = list.length === PREFECTURES.length
      ? `Showing all 47 prefectures, largest first.`
      : `Showing ${list.length} of 47 prefectures.`;
  }
}

function render() {
  window.__shotReady = false;
  const r = route();
  const pages = {
    '': overview,
    population,
    economy,
    society,
    prefectures,
    compare,
    sources,
  };
  const page = pages[r] || missing;
  app.innerHTML = page(state);
  document.title = r ? `${r[0].toUpperCase() + r.slice(1)} | NihonScope — Japan in Numbers` : 'NihonScope — Japan in Numbers';

  // Overview: year range re-draws the population chart.
  on('ov-from', 'change', (e) => {
    state.fromYear = Number(e.target.value);
    redrawChart('ov-chart', lineChart(YEARS, SERIES.population.values, { fromYear: state.fromYear, colour: '#2e5fa3', unit: 'million' }));
  });

  // Population: indicator + year range re-draw the chart.
  const redrawPop = () => {
    const s = SERIES[state.popIndicator];
    redrawChart('pop-chart', lineChart(YEARS, s.values, { fromYear: state.fromYear, colour: '#2e5fa3', unit: s.unit }));
  };
  on('pop-indicator', 'change', (e) => { state.popIndicator = e.target.value; render(); });
  on('pop-from', 'change', (e) => { state.fromYear = Number(e.target.value); redrawPop(); });

  // Economy: indicator + year range re-draw; year select re-draws the table.
  const redrawEcon = () => {
    const s = SERIES[state.econIndicator];
    const isLine = state.econIndicator === 'unemployment';
    const svg = isLine
      ? lineChart(YEARS, s.values, { fromYear: state.fromYear, colour: '#1f7a6d', unit: s.unit })
      : barChart(YEARS, s.values, { fromYear: state.fromYear, colour: '#2e5fa3', unit: s.unit });
    redrawChart('econ-chart', svg);
  };
  on('econ-indicator', 'change', (e) => { state.econIndicator = e.target.value; render(); });
  on('econ-from', 'change', (e) => { state.fromYear = Number(e.target.value); redrawEcon(); });
  on('econ-year', 'change', (e) => {
    state.econYear = Number(e.target.value);
    const box = $('econ-table');
    if (box) box.innerHTML = seriesTable(['gdp', 'gdpPerCapita', 'unemployment', 'cpi', 'exports', 'imports', 'debt'], state.econYear);
  });

  // Prefectures: live search, region filter, sortable headings.
  renderPrefectureTable();
  on('pref-search', 'input', (e) => { state.query = e.target.value; renderPrefectureTable(); });
  on('pref-region', 'change', (e) => { state.region = e.target.value; renderPrefectureTable(); });
  document.querySelectorAll('th[data-sort]').forEach((th) => {
    th.addEventListener('click', () => {
      const key = th.getAttribute('data-sort');
      if (state.sortKey === key) state.sortDir = -state.sortDir;
      else { state.sortKey = key; state.sortDir = key === 'name' || key === 'capital' || key === 'region' ? 1 : -1; }
      renderPrefectureTable();
    });
  });

  // Compare: metric select re-draws the bars.
  on('cmp-metric', 'change', (e) => {
    state.compareMetric = e.target.value;
    render();
  });

  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener('hashchange', render);
render();
