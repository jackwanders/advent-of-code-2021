/*
  Dijkstra to the rescue!
*/
const {
  parseInput,
} = require('../util');

const subgrid = parseInput(__dirname, data => data
  .split('\n')
  .map((r) => r.split('').map(c => parseInt(c, 10)))
);

const grid = new Array(subgrid.length * 5).fill().map(_ => new Array(subgrid[0].length * 5));

for(let r = 0; r < grid.length; r++) {
  for (let c= 0; c < grid[r].length; c++) {
    const [sgr, sgc] = [
      r % subgrid.length,
      c % subgrid[r % subgrid.length].length,
    ];
    const baseDistance = subgrid[sgr][sgc];
    const rm = Math.floor(r / subgrid.length);
    const cm = Math.floor(c / subgrid[r % subgrid.length].length);
    const distance = (baseDistance + (1 * (rm + cm))) % 9;

    grid[r][c] = {
      coord: [r, c],
      distance: distance ? distance : 9,
      risk: Number.MAX_SAFE_INTEGER,
      visited: false,
    }
  }
}

// console.log(grid.map(r => r.map(n => n.distance).join('')).join('\n'));

const endNode = grid[grid.length - 1][grid[grid.length - 1].length - 1];

/**
 * Given a coordinate, retrieve a list of non-null, unvisited
 * neighbor  nodes (no diagonals)
 */
 const getNeighborNodes = (node) => {
  const { coord: [r, c] } = node;
  const neighborNodes = [];
  const candidates = [
    [r-1, c],
    [r, c-1],
    [r, c+1],
    [r+1, c],
  ];
  for(let [nr, nc] of candidates) {
    try {
      const node = grid[nr][nc];
      if (node != null && !node.visited) {
        neighborNodes.push(grid[nr][nc]);
      }
    } catch (e) {}
  }
  return neighborNodes;
};

// Start at 0,0, set its risk to 0
let currentNode = grid[0][0];
currentNode.risk = 0;

// Keep going until we've visited the end node
while(!endNode.visited) {
  currentNode.visited = true;
  const neighborNodes = getNeighborNodes(currentNode);

  // update the total tentative risk of each neighbor based on the cumulative risk of the
  // current node. Select the lower of its current risk and that given by the path through
  // the current node
  for(let u = 0; u < neighborNodes.length; u++) {
    const neighborNode = neighborNodes[u];
    neighborNode.risk = Math.min(neighborNode.risk, currentNode.risk + neighborNode.distance);
  }

  // Move to the unvisited node with the lowest total risk so far
  currentNode = grid
    .flat()
    .filter(n => !n.visited && n.risk != Number.MAX_SAFE_INTEGER)
    .sort((a, b) => a.risk - b.risk)
    [0];

  console.log(currentNode.coord);
}

console.log(endNode.risk);

