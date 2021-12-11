const fs = require('fs');
const path = require('path');

const grid = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.split('').map(s => parseInt(s, 10)));

const gridSize = grid.flat().length;

/**
 * Given a coordinate, retrieve a list of neighbor coordinates
 * including diagonals. Ignore any out of bounds or undefined
 * coordinates
 *
 * Assumes grid[r][c] is already nullish
 */
 const getNeighborCoords = ([r, c]) => {
  const neighborCoords = [];
  for(let nr of [r-1, r, r+1]) {
    for (let nc of [c-1, c, c+1]) {
      try {
        if (grid[nr][nc] != null) {
          neighborCoords.push([nr, nc]);
        }
      } catch (e) {}
    }
  }
  return neighborCoords;
};

const walkGrid = action => {
  for(let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      action([r, c]);
    }
  }
}

/**
 * Step part A - All octopi go up in energy by 1
 */
const increaseEnergy = () => {
  walkGrid(([r, c]) => grid[r][c] += 1);
}

/**
 * Step part B - All octopi > 9 flash and increase
 * the energy of their 8 neighbors
 * @returns number of octopi that flashed
 */
const flashGrid = () => {
  let flashes = 0;
  walkGrid(([r, c]) => {
    if (grid[r][c] > 9) {
      grid[r][c] = undefined;
      flashes += 1;
      getNeighborCoords([r, c]).forEach(([nr, nc]) => {
        if (grid[nr][nc] != null) {
          grid[nr][nc] += 1;
        }
      });
    }
  });
  return flashes;
}

/**
 * Step part C - all flashed (null) octopi
 * are reset to zero energy
 */
const resetGrid = () => {
  walkGrid(([r, c]) => {
    if (grid[r][c] == null) {
      grid[r][c] = 0;
    }
  });
}

/**
 * Execute all parts of a single 'step'
 */
const step = () => {
  let stepFlashes = 0;

  increaseEnergy();

  let newFlashes = 0;
  do {
    newFlashes = flashGrid();
    stepFlashes += newFlashes
  } while (newFlashes > 0);

  resetGrid();

  return stepFlashes;
}

// step until every octopi in the grid flashes
// on the same step
let s;
let lastStepFlashes = 0;
for(s = 0; lastStepFlashes !== gridSize; s++) {
  lastStepFlashes = step();
}

console.log(s);