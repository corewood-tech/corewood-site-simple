const all = [
  { tld: 'io', url: 'https://corewood.io', label: 'corewood.io' },
  { tld: 'tech', url: 'https://corewood.tech', label: 'corewood.tech' },
  { tld: 'cloud', url: 'https://corewood.cloud', label: 'corewood.cloud' },
  { tld: 'info', url: 'https://corewood.info', label: 'corewood.info' }
];

const current = process.env.ELEVENTY_BASE_URL || 'https://corewood.io';

module.exports = {
  all,
  current,
  siblings: all.filter(d => d.url !== current)
};
