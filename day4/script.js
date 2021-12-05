const fs = require('fs');
const path = require('path');

const rawInput = fs
  .readFileSync(path.join(__dirname, 'input'), { encoding: 'utf-8' })
  .split('\n')
  .filter(line => line.length); // drop empty lines

// all the called numbers
const calledNumbers = rawInput
  .splice(0,1)[0]
  .split(',')
  .map(n => parseInt(n, 10));

// all the bingo boards
const bingoBoards = rawInput
  .reduce((boards, line, i) => {
    const row = line.trim()
      .split(/\s+/)
      .map(n => parseInt(n, 10));
    i % 5 ? boards[boards.length - 1].push(row) : boards.push([row]);
    return boards;
  }, []);

// add row/col stats and a winner flag to each board
// once any row/col value hits 5, the board is a winner
const boardsWithStats = bingoBoards.map(board => ({
  board,
  stats: {
    rows: [0,0,0,0,0],
    cols: [0,0,0,0,0],
  },
  isWinner: false,
}));

/**
 * Update a board's stats for the called number
 * 'Mark' a number by setting it to undefined
 */
const updateBoard = (calledNumber, { board, stats, isWinner }) => {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (calledNumber === board[row][col]) {
        stats.rows[row] += 1;
        stats.cols[col] += 1;
        isWinner = stats.rows[row] === 5 || stats.cols[col] === 5;
        board[row][col] = undefined;
        return { board, stats, isWinner };
      }
    }
  }
  return { board, stats, isWinner };
};

/**
 * Iterate over the called numbers, returning the first board
 * that is determined to be a winner by updateBoard
 */
const getWinningBoard = () => {
  for (let i = 0; i < calledNumbers.length; i++) {
    const calledNumber = calledNumbers[i];
    for (let k = 0; k < boardsWithStats.length; k++) {
      boardsWithStats[k] = updateBoard(calledNumber, boardsWithStats[k]);
      if (boardsWithStats[k].isWinner) {
        return { calledNumber, winningBoard: boardsWithStats[k].board };
      }
    }
  }
  throw new Error('No winner');
}

/**
 * Same as before, but this time we want to trash all winning boards
 * until the last board wins, then return it
 */
const getLastWinningBoard = () => {
  for (let i = 0; i < calledNumbers.length; i++) {
    const calledNumber = calledNumbers[i];
    for (let k = 0; k < boardsWithStats.length; ) {
      boardsWithStats[k] = updateBoard(calledNumber, boardsWithStats[k]);
      if (boardsWithStats[k].isWinner) {
        if (boardsWithStats.length === 1) {
          return { calledNumber, winningBoard: boardsWithStats[k].board };
        } else {
          boardsWithStats.splice(k, 1);
        }
      } else {
        k++;
      }
    }
  }
  throw new Error('No winner');
}

/**
 * Sum all the unmarked (i.e. not undefined) numbers on a board
 */
const sumUnmarkedNumbers = board => board
  .flat()
  .filter(n => n !== undefined)
  .reduce((sum, n) => sum + n, 0);

/**
 * Use the provided method to get the desired board, then calculate its "score"
 */
const calculateScore = boardGetter => {
  const { calledNumber, winningBoard } =  boardGetter();
  const unmarkedSum = sumUnmarkedNumbers(winningBoard);
  return calledNumber * unmarkedSum;
}

const partOne = () => calculateScore(getWinningBoard);
const partTwo = () => calculateScore(getLastWinningBoard);

console.log(partOne());
console.log(partTwo());