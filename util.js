const fs = require('fs');
const path = require('path');

module.exports.parseInput = (dirname, parser) => parser(fs.readFileSync(path.join(dirname, 'input'), { encoding: 'utf-8' }));

/**
 * Find index of an array in a list of arrays, by value (yuck)
 */
 module.exports.indexOfArray = (arr, valArr) => {
  const valArrStr = valArr.join('|');
  return arr
    .map(v => v.join('|'))
    .indexOf(valArrStr);
}

module.exports.uniqueArrayOfArrays = arr => arr.filter((v, index, self) => module.exports.indexOfArray(self, v) === index)