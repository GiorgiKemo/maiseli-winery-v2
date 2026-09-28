// Vintage, alcohol and bottle numbers are read from the supplied label photography.
// placeholder: stand-in bottle (real Rkatsiteli bottle, label reprinted) until the French Oak photo is supplied.
window.MAISELI_COLLECTIONS = {
  qvevri: {
    name: 'Traditional Qvevri',
    text: 'Made by the ancient Georgian method in qvevri buried in the earth, where the wine naturally develops and matures.'
  },
  heritage: {
    name: 'Our Heritage',
    text: 'Made in qvevri by the traditional method, then further aged in French oak barrels — Georgian identity with added depth, structure and complexity.'
  },
  semisweet: {
    name: 'Naturally Semi-Sweet',
    text: 'One of Georgia’s distinctive traditions: natural sweetness, varietal aromas and refined balance in harmony.'
  }
};

window.MAISELI_WINES = [
  {
    id: 'saperavi-qvevri', name: 'Saperavi Qvevri', sub: 'Red · Qvevri', collection: 'qvevri',
    vintage: '2025', abv: '13.0%', grape: 'Saperavi', img: 'assets/img/bottle-saperavi-qvevri.webp',
    hue: '#6b1426', glow: '#b3263f',
    desc: 'Georgia’s great red grape, fermented and matured the ancestral way — in qvevri buried in the earth — to keep the natural character of the variety and the place it comes from.'
  },
  {
    id: 'kisi-qvevri', name: 'Kisi Qvevri', sub: 'White · Qvevri', collection: 'qvevri',
    vintage: '2025', abv: '13.0%', grape: 'Kisi', img: 'assets/img/bottle-kisi-qvevri.webp',
    hue: '#8a4d17', glow: '#e59a3a',
    desc: 'An indigenous Georgian white from our own vineyard, made in earth-buried qvevri where the wine develops and matures naturally.'
  },
  {
    id: 'rkatsiteli-qvevri', name: 'Rkatsiteli Qvevri', sub: 'White · Qvevri', collection: 'qvevri',
    vintage: '2025', abv: '12.0%', grape: 'Rkatsiteli', img: 'assets/img/bottle-rkatsiteli-qvevri.webp',
    hue: '#7b5a1c', glow: '#e0b451',
    desc: 'One of Georgia’s ancient white varieties, made the traditional qvevri way to preserve the authentic character of the grape and its origin.'
  },
  {
    id: 'tsolikouri-qvevri', name: 'Tsolikouri Qvevri', sub: 'White · Qvevri', collection: 'qvevri',
    vintage: '2025', abv: '13.0%', grape: 'Tsolikouri', img: 'assets/img/bottle-tsolikouri-qvevri.webp',
    hue: '#6e6420', glow: '#d8c35a',
    desc: 'An indigenous white variety crafted in qvevri buried in the earth — honest, natural and true to Georgian winemaking.'
  },
  {
    id: 'saperavi-reserve', name: 'Saperavi Reserve', sub: 'Saperavi Qvevri · French Oak', collection: 'heritage',
    vintage: '2020', abv: '14.5%', grape: 'Saperavi', img: 'assets/img/bottle-saperavi-reserve.webp',
    hue: '#4a0d1b', glow: '#9c1f38',
    desc: 'Made in qvevri by the traditional method, then further aged in French oak. The qvevri keeps its Georgian identity; the oak brings depth, structure and complexity.'
  },
  {
    id: 'rkatsiteli-oak', name: 'Rkatsiteli Qvevri', sub: 'Rkatsiteli Qvevri · French Oak', collection: 'heritage',
    vintage: null, abv: null, grape: 'Rkatsiteli', img: 'assets/img/bottle-rkatsiteli-oak.webp', placeholder: true,
    hue: '#6a4a18', glow: '#d29a45',
    desc: 'Rkatsiteli made in qvevri by the traditional method and further aged in French oak — a meeting of heritage and contemporary vision.'
  },
  {
    id: 'kindzmarauli', name: 'Kindzmarauli', sub: 'Naturally Semi-Sweet Red', collection: 'semisweet',
    vintage: '2023', abv: '12.5%', grape: 'Saperavi', img: 'assets/img/bottle-kindzmarauli.webp',
    hue: '#5c0f2a', glow: '#c23458',
    desc: 'A naturally semi-sweet red in which natural sweetness, varietal aromas and refined balance come together harmoniously.'
  },
  {
    id: 'tvishi', name: 'Tvishi', sub: 'Naturally Semi-Sweet White', collection: 'semisweet',
    vintage: '2023', abv: '11.0%', grape: 'Tsolikouri', img: 'assets/img/bottle-tvishi.webp',
    hue: '#7a5a14', glow: '#f0c45e',
    desc: 'A naturally semi-sweet white that keeps the natural character and individuality of its grape, reflecting its origin and Georgia’s winemaking culture.'
  }
];
