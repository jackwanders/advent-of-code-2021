const fs = require('fs');
const path = require('path');

/**
 * Convert each line of shape
 * m,n -> x,y
 * to an object of shape:
 * {
 *   from: {
 *     col: m,
 *     row: n,
 *   },
 *   to: {
 *     col: x,
 *     row: y,
 *   },
 *   type: 'row' | 'col' | 'diagonal',
 *   vert?: 'up' | 'down',
 *   horz?: 'right' | 'left',
 * }
 *
 * This shape will simplify the iteration of the cursor from the start coordinate
 * to the end coordinate while mapping the floor
 */
const processLine = line => {
  const [a, b] = line
    .split(' -> ')
    .map(coord => coord.split(',').map(c => parseInt(c, 10)));

  const from = { col: a[0], row: a[1] };
  const to = { col: b[0], row: b[1] };
  const type = from.col === to.col ? 'col' : from.row === to.row ? 'row' : 'diagonal';
  const vert = from.row < to.row ? 'down' : from.row > to.row ? 'up' : undefined;
  const horz = from.col < to.col ? 'right' : from.col > to.col ? 'left' : undefined;
  return { from , to, type, vert, horz };
}

const rawInput = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(processLine);

/**
 * draw each line onto the map of the floor by iterating from each line's
 * starting (from) coordinate to its end (to) coordinate.
 *
 * Lines are assumed to be horizontal, vertical, or 45 degree diagonal lines
 */
const drawFloor = (types) => rawInput
  .reduce((floor, line) => {
    const { from, to, type, vert, horz } = line;

    // only draw a line if it's of a type we are interested in
    if (types.includes(type)) {
      let coord = {...from};
      let shouldContinue = true;
      while (shouldContinue) {
        const { row, col } = coord;
        shouldContinue = col !== to.col || row !== to.row;

        // start a new row on the map if we need it
        if (!floor[row]) {
          floor[row] = [];
        }

        floor[row][col] = typeof floor[row][col] === 'number' ? floor[row][col] + 1 : 1;

        // update the coordinate based on direction of the line
        coord = {
          col: horz === 'right' ? col + 1 : horz === 'left' ? col - 1 : col,
          row: vert === 'down' ? row + 1 : vert === 'up' ? row - 1 : row,
        };
      }
    }
    return floor;
  }, []);

/**
 * Find the number of coordinates on the floor map that were
 * touched by more than 1 line (i.e. their value is > 1)
 */
const calculateOverlaps = (types) => drawFloor(types)
  .flat()
  .filter(coord => typeof coord === 'number' && coord > 1)
  .length;

const partOne = () => calculateOverlaps(['row', 'col']);
const partTwo = () => calculateOverlaps(['row', 'col', 'diagonal']);

console.log(partOne());
console.log(partTwo());