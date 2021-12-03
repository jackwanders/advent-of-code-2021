const fs = require('fs');
const path = require('path');

// You're WELCOME :D
const rawInput = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(binaryString => binaryString.split('').map(s => parseInt(s, 10)));

const entryLength = rawInput[0].length;

// If the sum of all bits at an index is gte half the length of the list, the common bit is 1
const mostCommonBits = entries => entries
  .reduce((sums, entry) => sums.map((sum, i) => sum + entry[i]), new Array(entryLength).fill(0))
  .map(sum => sum >= entries.length / 2 ? 1 : 0);

const flipBits = arr => arr.map(n => +!n);

// e.g. [1,0,1,1] => 11
const parseBitArr = bitArr => parseInt(bitArr.join(''), 2);

// get the most common bits and its inverse, then multiply
const partOne = (input) => {
  const gammaArr = mostCommonBits(input);
  const epsilonArr = flipBits(gammaArr);
  return parseBitArr(gammaArr) * parseBitArr(epsilonArr);
}

// narrow down a list of entries to a single candidate by
// iteratively comparing bits at the given index against a
// bit criteria
const getRating = (startingEntries, getBitCriteria) => {
  let candidates = [].concat(startingEntries);
  for (let i = 0; i < entryLength; i++) {
    const bit = getBitCriteria(candidates, i);
    candidates = candidates.filter(c => c[i] === bit);
    if (candidates.length === 1) {
      break;
    }
  }
  return parseBitArr(candidates[0]);
}

const partTwo = (input) => {
  const oxygenRating = getRating(input, (candidates, i) => mostCommonBits(candidates)[i]); // yes, this is inefficient
  const scrubberRating = getRating(input, (candidates, i) => +!(mostCommonBits(candidates)[i]));
  return oxygenRating * scrubberRating;
}

console.log(partOne(rawInput));
console.log(partTwo(rawInput));