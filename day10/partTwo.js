const fs = require('fs');
const path = require('path');

const lines = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n');

const groups = {
  '(': { closer: ')', score: 1 },
  '[': { closer: ']', score: 2 },
  '{': { closer: '}', score: 3 },
  '<': { closer: '>', score: 4 },
};

const openers = Object.keys(groups);

const lineScores = lines
  .reduce((scores, line) => {
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
      // illegal char, ignore line
      return scores;
    }
    return scores.concat([
      lineGroups
        .reverse()
        .map(char => groups[char].score)
        .reduce((total, s) => total * 5 + s, 0)
    ]);
  }, [])
  .sort((a, b) => a - b);

console.log(lineScores[Math.floor(lineScores.length / 2)]);

