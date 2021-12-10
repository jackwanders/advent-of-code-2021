const fs = require('fs');
const path = require('path');

const lines = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n');

const groups = {
  '(': { closer: ')', score:     3 },
  '[': { closer: ']', score:    57 },
  '{': { closer: '}', score:  1197 },
  '<': { closer: '>', score: 25137 },
};

const openers = Object.keys(groups);

const score = lines
  .map(line => {
    const lineGroups = [];
    const chars = line.split('');
    for (let c = 0; c < chars.length; c++) {
      const char = chars[c];
      if (openers.includes(char)) {
        lineGroups.push(char);
        continue;
      }
      if (groups[lineGroups[lineGroups.length - 1]].closer === char) {
        lineGroups.pop();
        continue;
      }
      return Object.values(groups).find(({ closer }) => closer === char).score;
    }
    // complete and incomplete lines score zero
    return 0;
  })
  .reduce((sum, s) => sum + s, 0);

console.log(score);

