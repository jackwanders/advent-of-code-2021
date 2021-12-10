const fs = require('fs');
const path = require('path');

const floor = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.split('').map(s => parseInt(s, 10)));

const lowPoints = [];

for(let r = 0; r < floor.length; r++) {
  for (let c = 0; c < floor[r].length; c++) {
    const point = floor[r][c];
    const neighbors = [];
    const neighborCoords = [
      [r-1, c],
      [r, c-1],
      [r, c+1],
      [r+1, c],
    ];
    neighborCoords.forEach(([nr, nc]) => {
        // try/catch prevents cases where nr is out of bounds
        // if block prevents cases where nc is out of bounds
        try {
          if (floor[nr][nc] != null) {
            neighbors.push(floor[nr][nc]);
          }
        } catch (err) {}
    });
    if (!neighbors.includes(point) && Math.min(...neighbors.concat([point])) === point) {
      lowPoints.push(point);
    }
  }
}

console.log(lowPoints.length + lowPoints.reduce((sum, p) => sum + p, 0));