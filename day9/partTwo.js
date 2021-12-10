const fs = require('fs');
const path = require('path');

const floor = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.split('').map(s => parseInt(s, 10)));

const isUnvisitedBasinCoord = ([r, c]) => floor[r][c] != null && floor[r][c] !== 9;
/**
 * Given a coordinate, retrieve a list of neighbor coordinates
 * that are unvisited (non-null) basin (< 9) coordinates
 */
const getNeighborCoords = ([r, c]) => {
  const neighborCoords = [];
  const candidates = [
    [r-1, c],
    [r, c-1],
    [r, c+1],
    [r+1, c],
  ];
  candidates.forEach(([nr, nc]) => {
      // try/catch prevents cases where nr is out of bounds
      // if block prevents cases where nc is out of bounds
      try {
        if (isUnvisitedBasinCoord([nr, nc])) {
          neighborCoords.push([nr, nc]);
        }
      } catch (err) {}
  });
  return neighborCoords;
};

/**
 * Find index of an array in a list of arrays, by value (yuck)
 */
const indexOf = (arr, valArr) => {
  const valArrStr = valArr.join('|');
  return arr
    .map(v => v.join('|'))
    .indexOf(valArrStr);
}

const basins = [];

for(let r = 0; r < floor.length; r++) {
  for (let c = 0; c < floor[r].length; c++) {
    // skip over peaks and any cells already assigned to a basin
    if (!isUnvisitedBasinCoord([r, c])) {
      continue;
    }

    // initialize a new basin
    const basin = [[r, c]];
    floor[r][c] = undefined;

    // start 'flowing' through the basin until we hit edges & peaks
    let neighborCoords = getNeighborCoords([r, c]);
    while (neighborCoords.length > 0) {
      // add all valid neighbors to basin
      basin.push(...neighborCoords);
      neighborCoords.forEach(([nr, nc]) => (floor[nr][nc] = undefined));

      // get new neighbor coordinates
      neighborCoords = neighborCoords
        .map(getNeighborCoords)
        .flat()
        .filter((v, index, self) => indexOf(self, v) === index)
    }
    basins.push(basin);
  }
}

// multiply the lengths of the 3 largest basins
const result = basins
  .sort((a, b) => b.length - a.length)
  .slice(0, 3)
  .map(basin => basin.length)
  .reduce((product, len) => product * len, 1);

console.log(result);