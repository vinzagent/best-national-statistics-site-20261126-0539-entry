// NihonScope data: Japan's national statistics, 1995-2024.
// All figures are rounded published values. Sources per series are named
// in `sources` and on the Sources page; see app/views.js for how they render.
// Population: Statistics Bureau of Japan (Oct 1 estimates; 2020 census).
// GDP: IMF World Economic Outlook. Prices, jobs, births: Statistics Bureau /
// Ministry of Health, Labour and Welfare. Trade: Ministry of Finance.
// Prefectures: Statistics Bureau population estimates, 2024.

export const META = {
  country: 'Japan',
  brand: 'NihonScope',
  tagline: "Japan's national statistics, 1995 to 2024",
  updated: 'November 2026',
  yearNow: 2024,
};

export const YEARS = [1995, 2000, 2005, 2010, 2015, 2020, 2021, 2022, 2023, 2024];

// Each series: { label, unit, source, values (aligned with YEARS), note }
export const SERIES = {
  population: {
    label: 'Total population',
    unit: 'million people',
    source: 'Statistics Bureau of Japan',
    values: [125.57, 126.93, 127.77, 128.06, 127.09, 126.15, 125.5, 124.95, 124.35, 123.97],
    note: 'Population peaked in 2008 at 128.08 million and has fallen every year since.',
  },
  gdp: {
    label: 'Nominal GDP',
    unit: 'US$ trillion',
    source: 'IMF World Economic Outlook',
    values: [5.55, 5.05, 4.83, 5.76, 4.44, 5.06, 5.04, 4.26, 4.21, 4.03],
    note: 'Nominal GDP in US dollars moves with the yen; in yen terms GDP grew every year of this span.',
  },
  gdpPerCapita: {
    label: 'GDP per capita',
    unit: 'US$',
    source: 'IMF World Economic Outlook',
    values: [44200, 39800, 37800, 45000, 34900, 40100, 40200, 34100, 33900, 32500],
    note: 'GDP divided by population; the 2024 figure is about $32,500 per person.',
  },
  unemployment: {
    label: 'Unemployment rate',
    unit: '% of labour force',
    source: 'Statistics Bureau of Japan, Labour Force Survey',
    values: [3.2, 4.7, 4.4, 5.1, 3.4, 2.8, 2.8, 2.6, 2.6, 2.5],
    note: 'Annual average. Japan has run below 3% unemployment since 2017.',
  },
  cpi: {
    label: 'Consumer price inflation',
    unit: '% change on a year earlier',
    source: 'Statistics Bureau of Japan, Consumer Price Index',
    values: [-0.1, -0.7, -0.3, -0.7, 0.8, 0.0, -0.2, 2.5, 3.3, 2.7],
    note: 'Headline CPI. Prices fell or stood still for most of 1995-2021, then rose sharply in 2022-2024.',
  },
  fertility: {
    label: 'Total fertility rate',
    unit: 'children per woman',
    source: 'Ministry of Health, Labour and Welfare',
    values: [1.42, 1.36, 1.26, 1.39, 1.45, 1.33, 1.3, 1.26, 1.2, 1.15],
    note: 'Births per woman over her lifetime at current rates. Replacement level is about 2.1.',
  },
  lifeExpectancy: {
    label: 'Life expectancy at birth',
    unit: 'years',
    source: 'Ministry of Health, Labour and Welfare',
    values: [79.9, 81.1, 82.0, 83.0, 83.9, 84.1, 84.0, 84.0, 84.0, 84.1],
    note: 'Men 81.1 years and women 87.1 years in 2023; Japan has the longest-lived population on earth.',
  },
  medianAge: {
    label: 'Median age',
    unit: 'years',
    source: 'United Nations World Population Prospects',
    values: [40.0, 41.3, 43.1, 45.0, 46.7, 48.4, 48.7, 49.0, 49.3, 49.5],
    note: 'Half the population is older than this age; Japan has the oldest median age of any large country.',
  },
  exports: {
    label: 'Exports of goods',
    unit: '¥ trillion',
    source: 'Ministry of Finance, Trade Statistics of Japan',
    values: [44.3, 51.7, 65.7, 67.4, 75.6, 68.4, 83.1, 98.2, 100.9, 107.9],
    note: 'Cars, machinery and electronics dominate; 2024 exports were a record ¥107.9 trillion.',
  },
  imports: {
    label: 'Imports of goods',
    unit: '¥ trillion',
    source: 'Ministry of Finance, Trade Statistics of Japan',
    values: [31.5, 40.9, 56.9, 60.8, 78.4, 68.0, 84.9, 118.2, 110.2, 112.6],
    note: 'Japan imports nearly all of its oil, gas and coal; the 2022 energy-price spike pushed imports to ¥118.2 trillion.',
  },
  debt: {
    label: 'General government gross debt',
    unit: '% of GDP',
    source: 'IMF World Economic Outlook',
    values: [86.9, 135.4, 169.5, 205.7, 228.4, 258.7, 257.0, 255.2, 252.3, 251.2],
    note: 'The highest public-debt ratio in the developed world, almost all of it owed to domestic holders.',
  },
};

// Headline indicators shown on the overview page (2024 values).
export const HEADLINES = [
  { key: 'population', value: '124.0m', change: '-0.38m on 2023', label: 'Population' },
  { key: 'gdp', value: '$4.03tn', change: 'World No. 4', label: 'Nominal GDP' },
  { key: 'lifeExpectancy', value: '84.1 yrs', change: 'Longest-lived nation', label: 'Life expectancy' },
  { key: 'unemployment', value: '2.5%', change: 'Lowest since 2019', label: 'Unemployment' },
  { key: 'cpi', value: '+2.7%', change: 'CPI, 2024', label: 'Inflation' },
  { key: 'medianAge', value: '49.5', change: 'Oldest median age', label: 'Median age' },
  { key: 'fertility', value: '1.15', change: 'Record low, 2024', label: 'Fertility rate' },
  { key: 'debt', value: '251%', change: 'of GDP', label: 'Public debt' },
];

// Age structure: share of population by broad age band, selected years.
export const AGE_STRUCTURE = [
  { year: 1995, young: 15.9, working: 69.5, old: 14.6 },
  { year: 2005, young: 13.8, working: 66.1, old: 20.1 },
  { year: 2015, young: 12.6, working: 60.8, old: 26.6 },
  { year: 2024, young: 11.2, working: 59.5, old: 29.3 },
];

// Five-year age bands, 2024, millions of people (Statistics Bureau estimate).
export const AGE_PYRAMID = [
  { band: '0-4', men: 2.0, women: 1.9 },
  { band: '5-9', men: 2.35, women: 2.25 },
  { band: '10-14', men: 2.55, women: 2.45 },
  { band: '15-19', men: 2.8, women: 2.7 },
  { band: '20-24', men: 3.1, women: 3.0 },
  { band: '25-29', men: 3.25, women: 3.15 },
  { band: '30-34', men: 3.5, women: 3.4 },
  { band: '35-39', men: 3.75, women: 3.65 },
  { band: '40-44', men: 4.05, women: 3.95 },
  { band: '45-49', men: 4.6, women: 4.5 },
  { band: '50-54', men: 4.7, women: 4.6 },
  { band: '55-59', men: 4.0, women: 4.0 },
  { band: '60-64', men: 3.6, women: 3.7 },
  { band: '65-69', men: 3.4, women: 3.6 },
  { band: '70-74', men: 3.9, women: 4.4 },
  { band: '75-79', men: 3.5, women: 4.2 },
  { band: '80-84', men: 2.6, women: 3.4 },
  { band: '85+', men: 2.3, women: 4.2 },
];

// Society in 2024: births, deaths, marriages and households.
export const SOCIETY_2024 = [
  { label: 'Births', value: '720,988', note: 'Fewest since records began in 1899; down 5.7% on 2023.' },
  { label: 'Deaths', value: '1,618,684', note: 'Natural decrease of about 898,000 people in one year.' },
  { label: 'Marriages', value: '485,000', note: 'Couples married in 2024, up slightly on 2023.' },
  { label: 'Households', value: '56.0m', note: 'Average household size 2.25 people (2020 census).' },
  { label: 'One-person households', value: '38.0%', note: 'Share of all households; the most common household type.' },
  { label: 'Tertiary education, age 25-34', value: '65%', note: 'Share with a university or college degree (OECD).' },
  { label: 'Internet users', value: '86.2%', note: 'Share of individuals using the internet (2023, MIC).' },
  { label: 'Foreign residents', value: '3.77m', note: 'Registered foreign residents at end-2024, a record high.' },
];

// All 47 prefectures: 2024 estimated population (millions), capital, region.
// Source: Statistics Bureau of Japan, population estimates.
export const PREFECTURES = [
  { name: 'Tokyo', capital: 'Tokyo', region: 'Kanto', pop: 14.1 },
  { name: 'Kanagawa', capital: 'Yokohama', region: 'Kanto', pop: 9.24 },
  { name: 'Osaka', capital: 'Osaka', region: 'Kansai', pop: 8.78 },
  { name: 'Aichi', capital: 'Nagoya', region: 'Chubu', pop: 7.48 },
  { name: 'Saitama', capital: 'Saitama', region: 'Kanto', pop: 7.35 },
  { name: 'Chiba', capital: 'Chiba', region: 'Kanto', pop: 6.28 },
  { name: 'Hyogo', capital: 'Kobe', region: 'Kansai', pop: 5.38 },
  { name: 'Hokkaido', capital: 'Sapporo', region: 'Hokkaido', pop: 5.1 },
  { name: 'Fukuoka', capital: 'Fukuoka', region: 'Kyushu', pop: 5.1 },
  { name: 'Shizuoka', capital: 'Shizuoka', region: 'Chubu', pop: 3.52 },
  { name: 'Ibaraki', capital: 'Mito', region: 'Kanto', pop: 2.84 },
  { name: 'Hiroshima', capital: 'Hiroshima', region: 'Chugoku', pop: 2.75 },
  { name: 'Kyoto', capital: 'Kyoto', region: 'Kansai', pop: 2.55 },
  { name: 'Miyagi', capital: 'Sendai', region: 'Tohoku', pop: 2.26 },
  { name: 'Niigata', capital: 'Niigata', region: 'Chubu', pop: 2.1 },
  { name: 'Nagano', capital: 'Nagano', region: 'Chubu', pop: 2.0 },
  { name: 'Gifu', capital: 'Gifu', region: 'Chubu', pop: 1.92 },
  { name: 'Gunma', capital: 'Maebashi', region: 'Kanto', pop: 1.91 },
  { name: 'Tochigi', capital: 'Utsunomiya', region: 'Kanto', pop: 1.89 },
  { name: 'Okayama', capital: 'Okayama', region: 'Chugoku', pop: 1.85 },
  { name: 'Fukushima', capital: 'Fukushima', region: 'Tohoku', pop: 1.76 },
  { name: 'Mie', capital: 'Tsu', region: 'Kansai', pop: 1.73 },
  { name: 'Kumamoto', capital: 'Kumamoto', region: 'Kyushu', pop: 1.71 },
  { name: 'Kagoshima', capital: 'Kagoshima', region: 'Kyushu', pop: 1.56 },
  { name: 'Okinawa', capital: 'Naha', region: 'Kyushu', pop: 1.47 },
  { name: 'Shiga', capital: 'Otsu', region: 'Kansai', pop: 1.41 },
  { name: 'Yamaguchi', capital: 'Yamaguchi', region: 'Chugoku', pop: 1.28 },
  { name: 'Ehime', capital: 'Matsuyama', region: 'Shikoku', pop: 1.28 },
  { name: 'Nara', capital: 'Nara', region: 'Kansai', pop: 1.29 },
  { name: 'Nagasaki', capital: 'Nagasaki', region: 'Kyushu', pop: 1.25 },
  { name: 'Aomori', capital: 'Aomori', region: 'Tohoku', pop: 1.18 },
  { name: 'Iwate', capital: 'Morioka', region: 'Tohoku', pop: 1.16 },
  { name: 'Ishikawa', capital: 'Kanazawa', region: 'Chubu', pop: 1.1 },
  { name: 'Oita', capital: 'Oita', region: 'Kyushu', pop: 1.09 },
  { name: 'Miyazaki', capital: 'Miyazaki', region: 'Kyushu', pop: 1.05 },
  { name: 'Yamagata', capital: 'Yamagata', region: 'Tohoku', pop: 1.02 },
  { name: 'Toyama', capital: 'Toyama', region: 'Chubu', pop: 1.0 },
  { name: 'Kagawa', capital: 'Takamatsu', region: 'Shikoku', pop: 0.91 },
  { name: 'Akita', capital: 'Akita', region: 'Tohoku', pop: 0.91 },
  { name: 'Wakayama', capital: 'Wakayama', region: 'Kansai', pop: 0.89 },
  { name: 'Saga', capital: 'Saga', region: 'Kyushu', pop: 0.8 },
  { name: 'Yamanashi', capital: 'Kofu', region: 'Chubu', pop: 0.8 },
  { name: 'Fukui', capital: 'Fukui', region: 'Chubu', pop: 0.75 },
  { name: 'Tokushima', capital: 'Tokushima', region: 'Shikoku', pop: 0.69 },
  { name: 'Kochi', capital: 'Kochi', region: 'Shikoku', pop: 0.67 },
  { name: 'Shimane', capital: 'Matsue', region: 'Chugoku', pop: 0.65 },
  { name: 'Tottori', capital: 'Tottori', region: 'Chugoku', pop: 0.54 },
];

// Japan against six other large economies, 2024 (IMF / UN, rounded).
export const COMPARE = [
  { country: 'Japan', pop: 124.0, gdp: 4.03, perCapita: 32500, life: 84.1, medianAge: 49.5, fertility: 1.15, self: true },
  { country: 'United States', pop: 340.0, gdp: 29.18, perCapita: 85800, life: 78.4, medianAge: 38.9, fertility: 1.62 },
  { country: 'China', pop: 1408.0, gdp: 18.53, perCapita: 13300, life: 78.6, medianAge: 39.7, fertility: 1.0 },
  { country: 'Germany', pop: 84.7, gdp: 4.66, perCapita: 55400, life: 81.2, medianAge: 46.4, fertility: 1.35 },
  { country: 'United Kingdom', pop: 69.3, gdp: 3.64, perCapita: 52600, life: 79.3, medianAge: 40.6, fertility: 1.44 },
  { country: 'France', pop: 68.4, gdp: 3.16, perCapita: 46200, life: 83.3, medianAge: 42.5, fertility: 1.62 },
  { country: 'South Korea', pop: 51.7, gdp: 1.87, perCapita: 36100, life: 83.5, medianAge: 45.6, fertility: 0.72 },
];

export const SOURCES = [
  { name: 'Statistics Bureau of Japan', what: 'Population estimates, census, Labour Force Survey, Consumer Price Index', url: 'stat.go.jp' },
  { name: 'Ministry of Health, Labour and Welfare', what: 'Vital statistics (births, deaths, marriages), life expectancy, fertility', url: 'mhlw.go.jp' },
  { name: 'IMF World Economic Outlook', what: 'Nominal GDP, GDP per capita, government debt', url: 'imf.org' },
  { name: 'Ministry of Finance, Japan', what: 'Trade Statistics of Japan (exports and imports)', url: 'mof.go.jp' },
  { name: 'United Nations World Population Prospects', what: 'Median age and age structure', url: 'population.un.org' },
  { name: 'OECD', what: 'Tertiary education attainment, age 25-34', url: 'oecd.org' },
];
