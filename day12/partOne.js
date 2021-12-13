const fs = require('fs');
const path = require('path');

const createCave = c => ({
  name: c,
  size: /^[A-Z]+$/.test(c) ? 'l' : 's',
});

const edges = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.split('-').map(createCave));

// Create a list of all nodes, including a list of adjacent node names
const nodes = edges.reduce((g, e) => {
  const [n1, n2] = e;
  g[n1.name] ? g[n1.name].adjacents.push(n2.name) : g[n1.name] = { ...n1, adjacents: [n2.name] };
  g[n2.name] ? g[n2.name].adjacents.push(n1.name) : g[n2.name] = { ...n2, adjacents: [n1.name] };
  return g;
}, {});

/**
 * given a path and a node name, return a list of all paths from nodeName to 'end'
 * (prepended by current path)
 */
const getPaths = (currentPath, nodeName) => {
  currentPath.push(nodeName);

  const nextNodes = nodes[nodeName]
    .adjacents
    .map(name => nodes[name])
    .filter(nn => nn.size === 'l' || !currentPath.includes(nn.name));

  if (nextNodes.length === 0) {
    return [];
  }

  return nextNodes.map(nextNode => {
    // if the next node is 'end', there is only one path
    if (nextNode.name === 'end') {
      return [[nodeName, nextNode.name]];
    }
    // get all paths from this node,
    return getPaths([...currentPath], nextNode.name)
      .filter(path => path.length)
      .map(path => {
        return [nodeName, ...path]
      });
  }).flat();
}

const paths = getPaths([], nodes.start.name);

console.log(paths.length);