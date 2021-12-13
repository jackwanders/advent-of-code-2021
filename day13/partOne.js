const {
  parseInput,
  uniqueArrayOfArrays,
} = require('../util');

const cell = {
  x: 0,
  y: 1,
};

const [rawDots, rawInstructions] = parseInput(__dirname, rawInput => rawInput.split('\n\n').map(v => v.split('\n')));

const dots = rawDots
  .map(rd => rd.split(',').map(d => parseInt(d, 10)));

const instructions = rawInstructions
  .map(instr => instr.match(/^fold along (x|y)=(\d+)$/).slice(1,3))
  .map(([axis, val]) => [cell[axis], parseInt(val, 10)]);

const [axis, val] = instructions[0];

// move each dot based on the instruction, then remove duplicates
const foldedDots = uniqueArrayOfArrays(dots.map(dot => {
  if (dot[axis] > val) {
    dot[axis] -= (dot[axis] - val) * 2;
  }
  return dot;
}));

console.log(dots.length, foldedDots.length);
