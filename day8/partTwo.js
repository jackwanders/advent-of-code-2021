const fs = require('fs');
const path = require('path');

const inputs = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .map(line => line.split(' | '))
  .map(([signalString, outputString]) => [
    signalString.split(' '),
    outputString.split(' ')
  ]);

// 'Correct' ordering of segments
const fullSegment = 'abcdefg';

/**
 * Generate a list of all permutations of the characters in a string
 */
const permutator = str => {
  const result = [];

  const permute = (arr, m = []) => {
    if (arr.length === 0) {
      result.push(m.join(''))
    } else {
      for (let i = 0; i < arr.length; i++) {
        const curr = [...arr];
        const next = curr.splice(i, 1);
        permute([...curr], [...m, ...next]);
      }
    }
  }

  permute(str.split(''))

  return result;
}

// a list of the active segments for each digit
const segmentCharacters = [
  'abcefg',   // 0
  'cf',       // 1
  'acdeg',    // 2
  'acdfg',    // 3
  'bcdf',     // 4
  'abdfg',    // 5
  'abdefg',   // 6
  'acf',      // 7
  'abcdefg',  // 8
  'abcdfg'    // 9
];

// convert each string of active segments to an array of segment indices
// 'ab' => [2, 5]
const segmentIndices = segmentCharacters.map(as => as.split('').map(s => fullSegment.indexOf(s)));

// generate a list of ALL possible wirings
const allWirings = permutator(fullSegment);

// filter down the list of possible wirings by taking the current signal, fetching
// the digits it MAY represent based on the # of active segments, and then checking
// which of the possible wirings would allow for that signal to represent that digit
const outputs = inputs.map(([signals, display]) => {
  // Right now, we only care about signals that uniquely identify a single digit
  const uniqueSignals = signals.filter(signal => [2,3,4,7].includes(signal.length));

  // for each unique signal, filter out any possible wirings that don't allow
  // the signal to represent its corresponding digit
  // e.g.:
  // - signal is 'cf'
  // - 1 is the only digit with two segments
  // - 1 is represented by segments at indexes 2 and 5
  // - filter out all wirings where 'c' and 'f' aren't at indices 2 and 5 (order irrelevant)
  const possibleWirings = uniqueSignals
    .reduce((pw, signal) => {
      let newPw = [...pw];
      const indices = segmentIndices.filter(asi => asi.length === signal.length);
      indices.forEach(indexList => {
        indexList.forEach(i => {
          newPw = newPw.filter(wiring => signal.includes(wiring[i]));
        });
      });
      return newPw;
    }, [...allWirings]);

  // Take all remaining wirings and parse the display using its segment mapping
  // Find the first wiring that results in all output values being actual digits
  // Join the result and parse it to result in an integer
  return parseInt(possibleWirings
    .map(wiring => display
      .map(output => output.split('').map(from => fullSegment.charAt(wiring.indexOf(from))).sort().join(''))
      .map(output => segmentCharacters.indexOf(output))
    )
    .find(possibleOutput => possibleOutput.indexOf(-1) === -1)
    .join(''), 10);
});

console.log(outputs.reduce((sum, o) => sum + o, 0));