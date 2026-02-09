const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

module.exports = function() {
  const raw = yaml.load(
    fs.readFileSync(path.join(__dirname, 'mygraph.yaml'), 'utf8')
  );

  const nodeTypes = ['roles', 'skills', 'projects', 'philosophies', 'influences', 'education'];
  const singularMap = {
    roles: 'role',
    skills: 'skill',
    projects: 'project',
    philosophies: 'philosophy',
    influences: 'influence',
    education: 'education'
  };

  const nodes = [];
  for (const plural of nodeTypes) {
    const type = singularMap[plural];
    const items = raw[plural] || [];
    for (const item of items) {
      nodes.push({
        ...item,
        type,
        name: item.name || item.title || item.id
      });
    }
  }

  return {
    subject: raw.schema?.subject || {},
    nodes,
    edges: raw.edges || []
  };
};
