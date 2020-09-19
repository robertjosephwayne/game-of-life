// Retrieve and return an array containing the current generation of cells
const getCurrentGeneration = () => {
  return currentGeneration;
};

// Takes an array containing the current generation of cells as an argument
// Returns an array containing the next generation of cells
const getNextGeneration = currentGeneration => {
  const rows = currentGeneration.length;
  const columns = currentGeneration[0].length;
  const nextGeneration = [];

  for (let i = 0; i < rows; i++) {
    nextGeneration[i] = []; 
    for (let j = 0; j < columns; j++) {
      const isAlive = isAliveNextGeneration(currentGeneration, i, j);
      nextGeneration[i][j] = isAlive;
    }
  }

  return nextGeneration;
};

// Updates the variable containing the current generation of cells to the next generation
const setCurrentGeneration = nextGeneration => {
  currentGeneration = nextGeneration;
};

// Takes an array containing the current generation as an argument
// Also takes a specific cell row and cell column number as arguments
// Returns a boolean value indicating whether the cell will be alive in the next generation
// Returns 1 if the cell will be alive and 0 if the cell will be dead in the next generation
const isAliveNextGeneration = (currentGeneration, cellRow, cellColumn) => {
  const liveNeighbors = countLiveNeighbors(currentGeneration, cellRow, cellColumn);
  let isAlive = currentGeneration[cellRow][cellColumn];

  if (isAlive) {
    if (liveNeighbors !== 2 && liveNeighbors !== 3) {
      isAlive = 0;
    }
  } else {
    if (liveNeighbors === 3) {
      isAlive = 1;
    }
  }

  return isAlive;
};

// Takes an array containing the current generation as an argument
// Also takes a specific cell row and cell column number as arguments
// The neighbors are the 8 cells surrounding the cell
// If there is overflow, the pattern is assumed to continue on the other side of the grid
// Returns the number of neighbors that are alive in the current generation
const countLiveNeighbors = (currentGeneration, cellRow, cellColumn) => {
  const lastRow = currentGeneration.length - 1;
  const lastColumn = currentGeneration[0].length - 1;
  let liveNeighbors = 0;

  for (let i = cellRow - 1; i <= cellRow + 1; i++) {
    let neighborRow = i;
    if (i === -1) {
      neighborRow = lastRow;
    } else if (i === lastRow + 1) {
      neighborRow = 0;
    }

    for (let j = cellColumn - 1; j <= cellColumn + 1; j++) {
      let neighborColumn = j;
      if (j === -1) {
        neighborColumn = lastColumn;
      } else if (j === lastColumn + 1) {
        neighborColumn = 0;
      }

      if (i === cellRow && j === cellColumn) continue;
      liveNeighbors += currentGeneration[neighborRow][neighborColumn];
    }
  }

  return liveNeighbors;
};

// Takes an array containing the next generation as an argument
// Updates the page to display the next generation
const render = nextGeneration => {
  const rows = nextGeneration.length;
  const columns = nextGeneration[0].length;
  const gameCells = document.createElement('table');

  for (let i = 0; i < rows; i++) {
    const currentRow = document.createElement('tr');
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('td')
      if (nextGeneration[i][j]) {
        cell.className = 'alive';
      } else {
        cell.className = 'dead';
      }
      currentRow.appendChild(cell);
    }

    gameCells.appendChild(currentRow);
  }

  const gameDisplay = document.querySelector('#game-display');
  gameDisplay.innerHTML = '';
  gameDisplay.appendChild(gameCells);
};

// Get the next generation of cells
// Update the current generation to the next generation
// Render the next generation to the page
const tick = () => {
  const currentGeneration = getCurrentGeneration();
  const nextGeneration = getNextGeneration(currentGeneration);
  setCurrentGeneration(nextGeneration);
  render(nextGeneration);
};

const initializeGame = initialGeneration => {
  currentGeneration = initialGeneration;
  render(currentGeneration);
};

const getEmptyGeneration = (rows = 20, columns = 20) => {
  const emptyGeneration = [];
  for (let i = 0; i < rows; i++) {
    emptyGeneration[i] = [];
    for (let j = 0; j < columns; j++) {
      emptyGeneration[i][j] = 0;
    }
  }

  return emptyGeneration;
};

const getGliderPattern = () => {
  const gliderPattern = getEmptyGeneration();
  gliderPattern[3][4] = 1;
  gliderPattern[4][5] = 1;
  gliderPattern[5][3] = 1;
  gliderPattern[5][4] = 1;
  gliderPattern[5][5] = 1;
  return gliderPattern;
};

const getSmallExploderPattern = () => {
  const smallExploderPattern = getEmptyGeneration();
  smallExploderPattern[8][9] = 1;
  smallExploderPattern[9][8] = 1;
  smallExploderPattern[9][9] = 1;
  smallExploderPattern[9][10] = 1;
  smallExploderPattern[10][8] = 1;
  smallExploderPattern[10][10] = 1;
  smallExploderPattern[11][9] = 1;
  return smallExploderPattern;
};

const getExploderPattern = () => {
  const exploderPattern = getEmptyGeneration();
  exploderPattern[7][7] = 1;
  exploderPattern[7][9] = 1;
  exploderPattern[7][11] = 1;
  exploderPattern[8][7] = 1;
  exploderPattern[8][11] = 1;
  exploderPattern[9][7] = 1;
  exploderPattern[9][11] = 1;
  exploderPattern[10][7] = 1;
  exploderPattern[10][11] = 1;
  exploderPattern[11][7] = 1;
  exploderPattern[11][9] = 1;
  exploderPattern[11][11] = 1;
  return exploderPattern;
};

const getTenCellRowPattern = () => {
  const tenCellRowPattern = getEmptyGeneration();
  const startingRow = 9;
  const startingColumn = 5;
  const endingColumn = startingColumn + 10;
  for (let i = startingColumn; i < endingColumn; i++) {
    tenCellRowPattern[startingRow][i] = 1;
  }

  return tenCellRowPattern;
};

const getLightweightSpaceshipPattern = (startingRow = 0, startingColumn = 0) => {
  const lightweightSpaceshipPattern = getEmptyGeneration();
  lightweightSpaceshipPattern[startingRow][startingColumn + 1] = 1
  lightweightSpaceshipPattern[startingRow][startingColumn + 2] = 1
  lightweightSpaceshipPattern[startingRow][startingColumn + 3] = 1
  lightweightSpaceshipPattern[startingRow][startingColumn + 4] = 1
  lightweightSpaceshipPattern[startingRow + 1][startingColumn] = 1
  lightweightSpaceshipPattern[startingRow + 1][startingColumn + 4] = 1
  lightweightSpaceshipPattern[startingRow + 2][startingColumn + 4] = 1
  lightweightSpaceshipPattern[startingRow + 3][startingColumn] = 1
  lightweightSpaceshipPattern[startingRow + 3][startingColumn + 3] = 1
  return lightweightSpaceshipPattern;
}

const getBlockPattern = () => {
  const blockPattern = getEmptyGeneration();
  blockPattern[4][4] = 1;
  blockPattern[4][5] = 1;
  blockPattern[5][4] = 1;
  blockPattern[5][5] = 1;
  return blockPattern;
};

const getTubPattern = () => {
  const tubPattern = getEmptyGeneration();
  tubPattern[3][4] = 1;
  tubPattern[4][3] = 1;
  tubPattern[4][5] = 1;
  tubPattern[5][4] = 1;
  return tubPattern;
};

const getBoatPattern = () => {
  const boatPattern = getEmptyGeneration();
  boatPattern[4][5] = 1;
  boatPattern[5][4] = 1;
  boatPattern[5][6] = 1;
  boatPattern[6][5] = 1;
  boatPattern[6][6] = 1;
  return boatPattern;
};

let currentGeneration = getEmptyGeneration();
const startingGeneration = getLightweightSpaceshipPattern(8, 8);
initializeGame(startingGeneration);

const tickButton = document.querySelector('#tick');
tickButton.addEventListener('click', tick);