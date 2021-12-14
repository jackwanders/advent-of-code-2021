// Part One: node script.js 10
// Part Two: node script.js 40

const {
  loop,
  parseInput,
} = require('../util');

const args = process.argv.slice(2);
const insertCount = parseInt(args[0], 10);

/**
 * Increment the value at a particular key
 * if it exists, otherwise assign it
 */
const increment = (o, k, v) => {
  o[k] = o[k] == null ? v : o[k] + v;
}

const [rawTemplate, rawRules] = parseInput(__dirname, rawInput => rawInput.split('\n\n'));

// Because we only care about counts (i.e. order doesn't matter)
// we can track a map of each element pair and how often it occurs
const template = rawTemplate
  .split('')
  .reduce((t, _, i, rt) => {
    if (i === rt.length - 1) {
      return t;
    }
    const key = `${rt[i]}${rt[i+1]}`;
    increment(t, key, 1);
    return t;
  }, {});

const rules = rawRules
  .split('\n')
  .map(r => r.match(/^([A-Z]{2}) -> ([A-Z)])$/).slice(1, 3))
  .reduce((m, [pair, insertion]) => {
    m[pair] = insertion;
    return m;
  }, {});

/**
 * Iterate through all the element pairs one time,
 * applying all appropriate rules to generate
 * a new element pair map
 */
const insert = polymer => Object.entries(polymer)
  .reduce((p, [pair, count]) => {
    if (rules[pair] == null) {
      increment(p, pair, count);
      return p;
    }
    const insertion = rules[pair];
    const newPairs = [
      `${pair.charAt(0)}${insertion}`,
      `${insertion}${pair.charAt(1)}`,
    ];
    newPairs.forEach(newPair => increment(p, newPair, count));
    return p;
  }, {});

const finalPolymer = loop(insertCount, p => insert(p), template);

// Break down element pair map into a map of individual
// elements and their counts
// NOTE - this will double count all elements except for those
//        at the beginning and end of the polymer
const elements = Object.entries(finalPolymer)
  .reduce((result, [pair, count]) => {
    pair.split('').forEach(e => increment(result, e, count));
    return result;
  }, {});

// Get an ordered list of all element counts
// We need to divide by 2 and round up (see above note)
const finalCounts = Object.values(elements)
  .sort((a,b) => b - a)
  .map(v => Math.ceil(v/2));

console.log(finalCounts[0] - finalCounts[finalCounts.length - 1]);

