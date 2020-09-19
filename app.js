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
  
};

// Takes an array containing the current generation as an argument
// Also takes a specific cell row and cell column number as arguments
// Returns a boolean value indicating whether the cell will be alive in the next generation
// Returns 1 if the cell will be alive and 0 if the cell will be dead in the next generation
const isAliveNextGeneration = (currentGeneration, cellRow, cellColumn) => {
  
};

// Takes an array containing the current generation as an argument
// Also takes a specific cell row and cell column number as arguments
// The neighbors are the 8 cells surrounding the cell
// If there is overflow, the pattern is assumed to continue on the other side of the grid
// Returns the number of neighbors that are alive in the current generation
const countLiveNeighbors = (currentGeneration, cellRow, cellColumn) => {
  
};

// Takes an array containing the next generation as an argument
// Updates the page to display the next generation
const render = nextGeneration => {
  
};

// Get the next generation of cells
// Update the current generation to the next generation
// Render the next generation to the page
const tick = () => {
  
};