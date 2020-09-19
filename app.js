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

let currentGeneration = [];

for (let i = 0; i < 10; i++) {
  currentGeneration[i] = [];

  for (let j = 0; j < 10; j++) {
    currentGeneration[i][j] = 0;
  }
}

currentGeneration[0][1] = 1;
currentGeneration[1][2] = 1;
currentGeneration[2][0] = 1;
currentGeneration[2][1] = 1;
currentGeneration[2][2] = 1;

render(currentGeneration);
const tickButton = document.querySelector('#tick');
tickButton.addEventListener('click', tick);