const fs = require('fs');
const path = require('path');

const outputs = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.split(' | ')[1].split(' '));

const uniqueSegments = [2,4,3,7];

const numUniqueOutputs = outputs
  .flat()
  .reduce((sum, output) => {
    return sum + +uniqueSegments.includes(output.length);
  }, 0);


console.log(numUniqueOutputs);