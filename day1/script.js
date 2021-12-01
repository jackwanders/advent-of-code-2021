const fs = require('fs');
const path = require('path');

const input = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(n => parseInt(n, 10))

const partOne = (input) => input
  .reduce((res, _, i, arr) => (i > 0 && arr[i-1] < arr[i]) ? res + 1 : res, 0);

const partTwo = (input) => input
  .reduce((windows, _, i, arr) => i < 2 ? windows : windows.concat([arr[i] + arr[i-1] + arr[i-2]]), [])
  .reduce((res, _, i, arr) => (i > 0 && arr[i-1] < arr[i]) ? res + 1 : res, 0);

console.log(partOne(input));
console.log(partTwo(input));

