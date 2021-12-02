const fs = require('fs');
const path = require('path');

const input = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(rawEntry => rawEntry.split(' '))
  .map(([command, valueString]) => [command].concat([parseInt(valueString, 10)]));

const partOne = (input) => {
  const { forward, up, down } = input
    .reduce((map, [command, value]) => {
      map[command] += value;
      return map;
    }, { forward: 0, up: 0, down: 0 });
  return  forward * (down - up);
}

const partTwo = (input) => {
  const { x, y } = input
    .reduce(({ x, y, aim }, [command, value]) => {
      command === 'forward'
        ? ((x += value) && (y += value * aim))
        : (aim += (command === 'down' ? value : -value))
      return { x, y, aim };
    }, { x: 0, y: 0, aim: 0 });
  return x * y;
}

console.log(partOne(input));
console.log(partTwo(input));