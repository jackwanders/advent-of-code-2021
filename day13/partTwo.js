const {
  parseInput,
  uniqueArrayOfArrays,
} = require('../util');

const cell = {
  x: 0,
  y: 1,
};

const buildGrid = dotList => {
  // get the width and height of the grid for a nice printout
  const [width, height] = dotList.reduce(([w, h], [c, r]) => [Math.max(w, c), Math.max(h, r)], [0, 0]);

  // need to map to fill the rows. .fill(new Array()) puts the same array (by reference) in every row
  const emptyGrid = new Array(height + 1).fill().map(_ => new Array(width + 1).fill('.'));

  return dotList.reduce((g, [c, r]) => {
    g[r][c] = '#';
    return [...g];
  }, emptyGrid);
};

const printGrid = grid => console.log(grid.map(row => row.join('')).join('\n'), '\n\n');

const [rawDots, rawInstructions] = parseInput(__dirname, rawInput => rawInput.split('\n\n').map(v => v.split('\n')));

const dots = rawDots
  .map(rd => rd.split(',').map(d => parseInt(d, 10)));

// map 'x' and 'y' to array indices for simplicity
const instructions = rawInstructions
  .map(instr => instr.match(/^fold along (x|y)=(\d+)$/).slice(1,3))
  .map(([axis, val]) => [cell[axis], parseInt(val, 10)]);

// for each instruction, 'fold' all dots that are past the fold line
// by subtracting the appropriate value by twice the distance past the fold
const finalDots = instructions
  .reduce((workingDots, [axis, val]) => uniqueArrayOfArrays(
    workingDots.map(dot => {
      if (dot[axis] > val) {
        dot[axis] -= (dot[axis] - val) * 2;
      }
      return dot;
    })
  ), dots);

printGrid(buildGrid(finalDots));