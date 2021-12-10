const fs = require('fs');
const path = require('path');

// create an array recording the number of crabs at each position
const crabs = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split(',')
  .map(n => parseInt(n, 10))
  .reduce((a, p) => {
    a[p] = a[p] == null ? 1 : a[p] + 1;
    return a;
  }, []);

// create a separate array containing a list of the total distance
// traveled to get all crabs to that position
const distances = new Array(crabs.length)
  .fill(0)
  .map((_, d) => {
    return crabs.reduce((distance, crabsAtP, p) => {
      if (crabsAtP == null) {
        return distance;
      }
      return distance + (crabsAtP * Math.abs(p - d));
    }, 0);
  });

console.log(Math.min(...distances));