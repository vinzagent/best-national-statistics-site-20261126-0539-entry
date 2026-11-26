// NihonScope views: HTML for each page. Every value is escaped before it
// goes into the page. Pages are plain functions of (data, state); main.js
// wires the controls after each render.

import { META, HEADLINES, SERIES, YEARS, AGE_STRUCTURE, AGE_PYRAMID, SOCIETY_2024, PREFECTURES, COMPARE, SOURCES } from './data.js';
import { lineChart, barChart, pyramid, ageStack, compareBars } from './charts.js';

const esc = (s) => String(s).replace(/[&<>"]/g, (c) => `&#${c.charCodeAt(0)};`);

export const NAV = [
  { route: '', label: 'Overview' },
  { route: 'population', label: 'Population' },
  { route: 'economy', label: 'Economy' },
  { route: 'society', label: 'Society' },
  { route: 'prefectures', label: 'Prefectures' },
  { route: 'compare', label: 'Compare' },
  { route: 'sources', label: 'Sources' },
];

function header(active) {
  const links = NAV.map(
    (n) => `<a href="#/${n.route}" class="${active === n.route ? 'active' : ''}">${esc(n.label)}</a>`,
  ).join('');
  return `<header class="site-head"><div class="wrap head-in">
    <a class="brand" href="#/"><span class="mark">日</span> ${esc(META.brand)}</a>
    <nav>${links}</nav>
  </div></header>`;
}

function footer() {
  return `<footer class="site-foot"><div class="wrap">
    <p><strong>${esc(META.brand)}</strong> — ${esc(META.tagline)}. Figures are rounded published values;
    see <a href="#/sources">Sources</a> for where each number comes from. Updated ${esc(META.updated)}.</p>
    <p class="fine">An independent statistics explorer. Not affiliated with the Statistics Bureau of Japan or any government body.</p>
  </div></footer>`;
}

function shell(active, inner) {
  return header(active) + `<main class="wrap">${inner}</main>` + footer();
}

function kpiCards() {
  return `<section class="kpis">${HEADLINES.map(
    (k) => `<article class="kpi"><p class="kpi-label">${esc(k.label)}</p>
      <p class="kpi-value">${esc(k.value)}</p><p class="kpi-change">${esc(k.change)}</p></article>`,
  ).join('')}</section>`;
}

function yearRangeSelect(id, fromYear) {
  return `<label class="ctl">Show from
    <select id="${id}">
      <option value="1995"${fromYear === 1995 ? ' selected' : ''}>1995</option>
      <option value="2005"${fromYear === 2005 ? ' selected' : ''}>2005</option>
      <option value="2015"${fromYear === 2015 ? ' selected' : ''}>2015</option>
    </select></label>`;
}

function seriesTable(keys, yearIdx) {
  const rows = keys.map((k) => {
    const s = SERIES[k];
    return `<tr><td>${esc(s.label)}</td><td class="num">${esc(String(s.values[yearIdx]))}</td><td>${esc(s.unit)}</td><td class="src">${esc(s.source)}</td></tr>`;
  }).join('');
  return `<table class="data"><thead><tr><th>Indicator</th><th>Value</th><th>Unit</th><th>Source</th></tr></thead><tbody>${rows}</tbody></table>`;
}

export function overview(state) {
  const pop = SERIES.population;
  const inner = `
  <section class="hero">
    <p class="eyebrow">National statistics &middot; ${esc(META.country)} &middot; 1995&ndash;2024</p>
    <h1>Japan in numbers: a country getting smaller, older &mdash; and living longer.</h1>
    <p class="lede">Population peaked in 2008 and has fallen every year since. Life expectancy is the
    longest on earth, the median age is the oldest of any large country, and unemployment sits at 2.5%.
    Explore 12 indicators over 30 years, all 47 prefectures, and Japan against the world.</p>
    <p class="hero-links">
      <a class="btn" href="#/population">Population &rarr;</a>
      <a class="btn" href="#/economy">Economy &rarr;</a>
      <a class="btn" href="#/prefectures">47 prefectures &rarr;</a>
    </p>
  </section>
  ${kpiCards()}
  <section class="panel">
    <div class="panel-head"><h2>Population, 1995&ndash;2024</h2>${yearRangeSelect('ov-from', state.fromYear)}</div>
    <div id="ov-chart">${lineChart(YEARS, pop.values, { fromYear: state.fromYear, colour: '#2e5fa3', unit: 'million' })}</div>
    <p class="note">${esc(pop.note)} Source: ${esc(pop.source)}.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Japan in 2024, at a glance</h2></div>
    ${seriesTable(['population', 'gdp', 'gdpPerCapita', 'unemployment', 'cpi', 'fertility', 'lifeExpectancy', 'medianAge'], 9)}
    <p class="note">Values for 2024, the latest year published for each series. Full series on the
    <a href="#/population">Population</a> and <a href="#/economy">Economy</a> pages.</p>
  </section>
  <section class="facts">
    <article><h3>29.3% are 65 or older</h3><p>Nearly one person in three is past retirement age &mdash; the highest share in the world.</p></article>
    <article><h3>Tokyo holds 1 in 9 people</h3><p>14.1 million live in Tokyo prefecture; the greater Tokyo area holds about 37 million.</p></article>
    <article><h3>251% of GDP in debt</h3><p>The highest public-debt ratio in the developed world, owed almost entirely at home.</p></article>
  </section>`;
  return shell('', inner);
}

const POP_INDICATORS = [
  { key: 'population', label: 'Total population' },
  { key: 'fertility', label: 'Fertility rate' },
  { key: 'lifeExpectancy', label: 'Life expectancy' },
  { key: 'medianAge', label: 'Median age' },
];

export function population(state) {
  const key = state.popIndicator || 'population';
  const s = SERIES[key];
  const options = POP_INDICATORS.map(
    (o) => `<option value="${o.key}"${o.key === key ? ' selected' : ''}>${esc(o.label)}</option>`,
  ).join('');
  const inner = `
  <section class="page-head"><p class="eyebrow">People</p>
    <h1>Population</h1>
    <p class="lede">Japan's population is shrinking by about 900,000 people a year: births at a record low,
    deaths at a record high. The charts below show the long slide and the age pyramid it produces.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>${esc(s.label)}</h2>
      <span class="ctl-row"><label class="ctl">Indicator
        <select id="pop-indicator">${options}</select></label>
      ${yearRangeSelect('pop-from', state.fromYear)}</span></div>
    <div id="pop-chart">${lineChart(YEARS, s.values, { fromYear: state.fromYear, colour: '#2e5fa3', unit: s.unit })}</div>
    <p class="note">${esc(s.note)} Source: ${esc(s.source)}.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Who is Japan? Age pyramid, 2024</h2></div>
    ${pyramid(AGE_PYRAMID)}
    <p class="note">Men on the left, women on the right. Source: Statistics Bureau of Japan.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Japan is ageing fast</h2></div>
    ${ageStack(AGE_STRUCTURE)}
    <p class="note">In 1995 one person in seven was 65 or older; in 2024 it is almost one in three.
    Source: United Nations World Population Prospects.</p>
  </section>`;
  return shell('population', inner);
}

const ECON_INDICATORS = [
  { key: 'gdp', label: 'Nominal GDP', chart: 'bar' },
  { key: 'gdpPerCapita', label: 'GDP per capita', chart: 'bar' },
  { key: 'unemployment', label: 'Unemployment rate', chart: 'line' },
  { key: 'cpi', label: 'Inflation (CPI)', chart: 'bar' },
  { key: 'exports', label: 'Exports of goods', chart: 'bar' },
  { key: 'imports', label: 'Imports of goods', chart: 'bar' },
  { key: 'debt', label: 'Public debt (% of GDP)', chart: 'bar' },
];

export function economy(state) {
  const key = state.econIndicator || 'gdp';
  const def = ECON_INDICATORS.find((d) => d.key === key);
  const s = SERIES[key];
  const options = ECON_INDICATORS.map(
    (o) => `<option value="${o.key}"${o.key === key ? ' selected' : ''}>${esc(o.label)}</option>`,
  ).join('');
  const chart = def.chart === 'line'
    ? lineChart(YEARS, s.values, { fromYear: state.fromYear, colour: '#1f7a6d', unit: s.unit })
    : barChart(YEARS, s.values, { fromYear: state.fromYear, colour: '#2e5fa3', unit: s.unit });
  const yearOpts = YEARS.map((y, i) => `<option value="${i}"${i === state.econYear ? ' selected' : ''}>${y}</option>`).join('');
  const inner = `
  <section class="page-head"><p class="eyebrow">Money</p>
    <h1>Economy</h1>
    <p class="lede">The world's fourth-largest economy: $4.03 trillion in 2024, with unemployment at 2.5%
    and inflation back after 25 years of flat prices. Pick an indicator to see its 30-year path.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>${esc(s.label)}</h2>
      <span class="ctl-row"><label class="ctl">Indicator
        <select id="econ-indicator">${options}</select></label>
      ${yearRangeSelect('econ-from', state.fromYear)}</span></div>
    <div id="econ-chart">${chart}</div>
    <p class="note">${esc(s.note)} Source: ${esc(s.source)}.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>All indicators in one year</h2>
      <label class="ctl">Year <select id="econ-year">${yearOpts}</select></label></div>
    <div id="econ-table">${seriesTable(['gdp', 'gdpPerCapita', 'unemployment', 'cpi', 'exports', 'imports', 'debt'], state.econYear)}</div>
    <p class="note">Trade in yen; GDP in US dollars. Sources are named per row.</p>
  </section>`;
  return shell('economy', inner);
}

export function society(state) {
  const cards = SOCIETY_2024.map(
    (c) => `<article class="kpi"><p class="kpi-label">${esc(c.label)}</p>
      <p class="kpi-value">${esc(c.value)}</p><p class="kpi-change">${esc(c.note)}</p></article>`,
  ).join('');
  const inner = `
  <section class="page-head"><p class="eyebrow">Daily life</p>
    <h1>Society</h1>
    <p class="lede">Fewer babies, more single-person households, and a record 3.77 million foreign
    residents: Japan's society in 2024, in eight numbers.</p>
  </section>
  <section class="kpis">${cards}</section>
  <section class="panel">
    <div class="panel-head"><h2>The year in lives: births vs deaths</h2></div>
    ${barChart([2020, 2021, 2022, 2023, 2024], [840835, 811622, 770759, 727277, 720988], { colour: '#1f7a6d', unit: 'births' })}
    <p class="note">Births per year, 2020&ndash;2024. Deaths in 2024 (1,618,684) were more than twice births.
    Source: Ministry of Health, Labour and Welfare.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Ageing, again</h2></div>
    ${ageStack(AGE_STRUCTURE)}
    <p class="note">The 65+ share doubled from 14.6% in 1995 to 29.3% in 2024.</p>
  </section>`;
  return shell('society', inner);
}

export function prefectureRows(list, totalPop) {
  return list.map((p, i) => `<tr><td class="num">${i + 1}</td><td><strong>${esc(p.name)}</strong></td>
    <td>${esc(p.capital)}</td><td>${esc(p.region)}</td>
    <td class="num">${p.pop.toFixed(2)}</td><td class="num">${((p.pop / totalPop) * 100).toFixed(1)}%</td></tr>`).join('');
}

export function prefectures(state) {
  const totalPop = PREFECTURES.reduce((a, p) => a + p.pop, 0);
  const regions = [...new Set(PREFECTURES.map((p) => p.region))];
  const regionOpts = ['All regions', ...regions].map(
    (r) => `<option value="${esc(r)}"${state.region === r ? ' selected' : ''}>${esc(r)}</option>`,
  ).join('');
  const inner = `
  <section class="page-head"><p class="eyebrow">Places</p>
    <h1>47 prefectures</h1>
    <p class="lede">Every prefecture, from Tokyo's 14.1 million people to Tottori's 540,000.
    Search, filter by region, or sort the table by tapping a column heading.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Population by prefecture, 2024</h2>
      <span class="ctl-row">
        <label class="ctl">Search <input id="pref-search" type="search" placeholder="e.g. Kyoto" value="${esc(state.query || '')}"></label>
        <label class="ctl">Region <select id="pref-region">${regionOpts}</select></label>
      </span></div>
    <p class="note" id="pref-count"></p>
    <table class="data"><thead><tr>
      <th data-sort="rank">#</th><th data-sort="name">Prefecture &#8597;</th><th data-sort="capital">Capital &#8597;</th>
      <th data-sort="region">Region &#8597;</th><th data-sort="pop">Population (m) &#8597;</th><th data-sort="share">Share &#8597;</th>
    </tr></thead><tbody id="pref-body"></tbody></table>
    <p class="note">Population in millions, 2024 estimates. Source: Statistics Bureau of Japan.
    The 47 rounded prefecture figures sum to ${totalPop.toFixed(1)} million, within rounding of the national total of 124.0 million.</p>
  </section>
  <section class="facts">
    <article><h3>Tokyo: 14.1m</h3><p>More people than the 15 smallest prefectures combined.</p></article>
    <article><h3>Tottori: 0.54m</h3><p>The smallest prefecture, on the Sea of Japan coast.</p></article>
    <article><h3>Hokkaido: 62/km&sup2;</h3><p>The largest prefecture by area, and the emptiest per square kilometre.</p></article>
  </section>`;
  return shell('prefectures', inner);
}

const COMPARE_METRICS = [
  { key: 'pop', label: 'Population (millions)' },
  { key: 'gdp', label: 'Nominal GDP (US$ trillion)' },
  { key: 'perCapita', label: 'GDP per capita (US$)' },
  { key: 'life', label: 'Life expectancy (years)' },
  { key: 'medianAge', label: 'Median age (years)' },
  { key: 'fertility', label: 'Fertility rate' },
];

export function compare(state) {
  const key = state.compareMetric || 'gdp';
  const unit = { pop: 'm', gdp: '$tn', perCapita: '$', life: 'yrs', medianAge: 'yrs', fertility: '' }[key];
  const options = COMPARE_METRICS.map(
    (o) => `<option value="${o.key}"${o.key === key ? ' selected' : ''}>${esc(o.label)}</option>`,
  ).join('');
  const rows = COMPARE.map((c) => `<tr${c.self ? ' class="self"' : ''}><td><strong>${esc(c.country)}</strong>${c.self ? ' &#8592; this site' : ''}</td>
    <td class="num">${c.pop.toFixed(1)}</td><td class="num">${c.gdp.toFixed(2)}</td><td class="num">${c.perCapita.toLocaleString('en-US')}</td>
    <td class="num">${c.life.toFixed(1)}</td><td class="num">${c.medianAge.toFixed(1)}</td><td class="num">${c.fertility.toFixed(2)}</td></tr>`).join('');
  const inner = `
  <section class="page-head"><p class="eyebrow">The world</p>
    <h1>Japan against the world</h1>
    <p class="lede">Japan is the oldest, longest-lived large country in this group &mdash; and the
    fourth-largest economy. Switch the metric to see where it stands on each measure.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>${esc(COMPARE_METRICS.find((m) => m.key === key).label)}</h2>
      <label class="ctl">Metric <select id="cmp-metric">${options}</select></label></div>
    <div id="cmp-chart">${compareBars(COMPARE, key, unit)}</div>
    <p class="note">2024, rounded. Sources: IMF World Economic Outlook; United Nations World Population Prospects.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>All seven countries, all six measures</h2></div>
    <table class="data"><thead><tr><th>Country</th><th>Population (m)</th><th>GDP ($tn)</th><th>GDP per capita ($)</th><th>Life exp. (yrs)</th><th>Median age</th><th>Fertility</th></tr></thead>
    <tbody>${rows}</tbody></table>
  </section>`;
  return shell('compare', inner);
}

export function sources(state) {
  const rows = SOURCES.map((s) => `<tr><td><strong>${esc(s.name)}</strong></td><td>${esc(s.what)}</td><td>${esc(s.url)}</td></tr>`).join('');
  const inner = `
  <section class="page-head"><p class="eyebrow">Provenance</p>
    <h1>Sources &amp; method</h1>
    <p class="lede">Every number on this site comes from a published official source. Figures are
    rounded for readability; where a series was revised, the latest published vintage is used.</p>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Where the numbers come from</h2></div>
    <table class="data"><thead><tr><th>Source</th><th>What it supplied</th><th>Site</th></tr></thead><tbody>${rows}</tbody></table>
  </section>
  <section class="panel">
    <div class="panel-head"><h2>Method notes</h2></div>
    <ul class="notes">
      <li>Population is the Statistics Bureau's October 1 estimate; the 2020 figure is the census count.</li>
      <li>GDP is nominal, in US dollars, from the IMF World Economic Outlook; yen-denominated GDP grew in every year shown.</li>
      <li>Prefecture populations are 2024 estimates and sum to the national total (rounding aside).</li>
      <li>Life expectancy, births, deaths and marriages are from the Ministry of Health, Labour and Welfare's vital statistics.</li>
      <li>Comparison figures for other countries are 2024 IMF and UN estimates, rounded.</li>
      <li>This site stores nothing and fetches nothing: all data is in its own files, and every chart is drawn in the browser.</li>
    </ul>
  </section>`;
  return shell('sources', inner);
}

export function missing() {
  return shell('', `<section class="page-head"><h1>Page not found</h1>
    <p class="lede">There is no page at this address. <a href="#/">Back to the overview</a>.</p></section>`);
}
