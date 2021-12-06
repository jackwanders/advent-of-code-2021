const fs = require('fs');
const path = require('path');

// seed a map with each possible 'age' of a fish and a zero count
const emptyMap = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0 };

const rawInput = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split(',')
  .map(n => parseInt(n, 10))
  .reduce((fishMap, fish) => {
    fishMap[fish] = fishMap[fish] + 1;
    return fishMap;
  }, emptyMap);

const processDay = startingFishMap => {
  // create a map to store 'new' fish for each day
  // fish that just reproduced, and thus reset to 6
  // newly produced fish that start at 8
  const newFishMap = {
    6: startingFishMap[0],
    8: startingFishMap[0],
  };

  delete startingFishMap[0];

  // move each bucket of fish down one day
  for (let i = 1; i <= 8; i++) {
    startingFishMap[i-1] = startingFishMap[i];
    delete startingFishMap[i];
  }

  // merge the new fish counts into the map
  startingFishMap[6] = startingFishMap[6] + newFishMap[6];
  startingFishMap[8] = newFishMap[8];

  return startingFishMap;
}

const passTime = days => {
  let workingFishMap = {...rawInput};
  for (let i = 0; i < days; i++) {
    workingFishMap = processDay(workingFishMap);
  }
  return Object.values(workingFishMap)
    .reduce((sum, n) => sum + n, 0);
}

const partOne = () => passTime(80);
const partTwo = () => passTime(256);

console.log(partOne());
console.log(partTwo());
