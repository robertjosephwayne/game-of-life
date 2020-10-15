'use strict';

//1. This section contains general functions for the game.

/** Initializes the game. */
function initializeGame() {
  updateGridSize();
  resetCurrentGeneration();
  initializeRandomLife();
  updateTickInterval();
  resetGenerationCount();
  renderGame();
}

/** Resets the game. */
function resetGame() {
  resetCurrentGeneration();
  resetGenerationCount();
  renderGame();
}

/**
 * Renders the current generation,
 * current generation count,
 * and current live cell count.
 */
function renderGame() {
  renderCurrentGeneration();
  renderGenerationCount();
  renderLiveCellCount();
}

/**
 * Toggles the selected cell between alive and dead.
 * @param {Event} event - Click event on a table cell.
 */
function handleCellClick(event) {
  const cellRow = event.target.dataset.row;
  const cellColumn = event.target.dataset.column;
  const currentGeneration = getCurrentGeneration();
  const currentValue = currentGeneration[cellRow][cellColumn];

  if (currentValue === 1) {
    currentGeneration[cellRow][cellColumn] = 0;
  } else {
    currentGeneration[cellRow][cellColumn] = 1;
  }

  setCurrentGeneration(currentGeneration);
  renderGame();
}

//2. This section contains functions related to the current generation of cells.

/**
 * Retrieves the current generation from local storage.
 * @return {Array} - The current generation of cells.
 */
function getCurrentGeneration() {
  const localStorage = window.localStorage;
  const currentGenerationJSON = localStorage.getItem('currentGeneration');
  return JSON.parse(currentGenerationJSON);
}

/**
 * Updates the current generation in local storage to the next generation.
 * @param {Array} nextGeneration - The next generation of cells.
 */
function setCurrentGeneration(nextGeneration) {
  const localStorage = window.localStorage;
  const nextGenerationJSON = JSON.stringify(nextGeneration);
  localStorage.setItem('currentGeneration', nextGenerationJSON);
  updateLiveCellCount();
}

/** Resets the current generation to the base state of the active pattern. */
function resetCurrentGeneration() {
  const initialGeneration = getActivePattern();
  setCurrentGeneration(initialGeneration);
}

/**
 * Resizes the current generation.
 * @param {number} size - The number of rows and cells for the generation.
 */
function resizeCurrentGeneration(size) {
  const currentGeneration = getCurrentGeneration();
  const currentGenerationSize = currentGeneration.length;
  const currentGenerationResized = [];
  for (let i = 0; i < size; i++) {
    currentGenerationResized[i] = [];
    for (let j = 0; j < size; j++) {
      if (i >= currentGenerationSize || j >= currentGenerationSize) {
        currentGenerationResized[i][j] = 0;
      } else {
        currentGenerationResized[i][j] = currentGeneration[i][j];
      }
    }
  }
  setCurrentGeneration(currentGenerationResized);
}

/** Renders a table containing the current generation of cells. */
function renderCurrentGeneration() {
  const currentGeneration = getCurrentGeneration();
  const gridSize = getGridSize();
  const rows = gridSize;
  const columns = gridSize;
  const newGameGrid = document.createElement('table');
  newGameGrid.id = 'game-grid';
  newGameGrid.addEventListener('mousedown', handleCellClick);

  for (let i = 0; i < rows; i++) {
    const currentRow = document.createElement('tr');
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('td');
      cell.setAttribute('data-row', i);
      cell.setAttribute('data-column', j);
      if (currentGeneration[i][j]) cell.className = 'alive';
      currentRow.appendChild(cell);
    }
    newGameGrid.appendChild(currentRow);
  }

  const oldGameGrid = document.querySelector('#game-grid');
  oldGameGrid.replaceWith(newGameGrid);
}

//3. This section contains functions related to the next generation of cells.

/**
 * Determines which cells will be alive in the next generation
 * and creates the next generation of cells.
 * @return {Array} - The next generation of cells.
 */
function getNextGeneration() {
  const currentGeneration = getCurrentGeneration();
  const gridSize = getGridSize();
  let nextGeneration = [];

  for (let i = 0; i < gridSize; i++) {
    nextGeneration[i] = [];
    for (let j = 0; j < gridSize; j++) {
      const isAlive = isAliveNextGeneration(currentGeneration, i, j);
      nextGeneration[i][j] = isAlive;
    }
  }

  const randomLifeStatus = getRandomLifeStatus();
  if (randomLifeStatus === 'active') {
    nextGeneration = addRandomLife(nextGeneration);
  }

  return nextGeneration;
}

/**
 * Determines if a specific cell will be alive in the next generation.
 * @param {Array} currentGeneration - The current generation of cells.
 * @param {number} cellRow - The row number of a specific cell to check.
 * @param {number} cellColumn - The column number of a specific cell to check.
 * @return {boolean} - True if the cell will be alive in the next generation.
 */
function isAliveNextGeneration(currentGeneration, cellRow, cellColumn) {
  const liveNeighbors = countLiveNeighbors(
      currentGeneration,
      cellRow,
      cellColumn);
  let isAlive = currentGeneration[cellRow][cellColumn];

  if (isAlive && liveNeighbors !== 2 && liveNeighbors !== 3) {
    isAlive = 0;
  } else if (liveNeighbors === 3) {
    isAlive = 1;
  }

  return isAlive;
}

/**
 * Counts the number of live neighbors around a specific cell.
 * @param {Array} currentGeneration - The current generation of cells.
 * @param {number} cellRow - The row number of a specific cell to check.
 * @param {number} cellColumn - The column number of a specific cell to check.
 * @return {number} - The number of live neighbors around the specified cell.
 */
function countLiveNeighbors(currentGeneration, cellRow, cellColumn) {
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
}

//4. This section contains functions related to ticking.

/**
 * Retrieves the current tick interval from local storage.
 * @return {number} - The current tick interval.
 */
function getTickInterval() {
  const localStorage = window.localStorage;
  const tickInterval = localStorage.getItem('tickInterval');
  return parseInt(tickInterval);
}

/**
 * Sets the tick interval value in local storage to a new interval.
 * @param {number} newTickInterval - The new tick interval.
 */
function setTickInterval(newTickInterval) {
  const localStorage = window.localStorage;
  localStorage.setItem('tickInterval', newTickInterval);
}

/**
 * Updates the tick interval based on the tick speed selected by the user.
 */
function updateTickInterval() {
  const tickSpeed = document.querySelector('#tick-speed');
  const rangeMax = tickSpeed.getAttribute('max');
  const rangeValue = tickSpeed.value;
  const newTickInterval = rangeMax - rangeValue;
  setTickInterval(newTickInterval);

  const activityStatus = getActivityStatus();
  if (activityStatus === 'active') startTicking();
}

/**
 * Updates the current generation to the next generation,
 * increments the generation count, and renders the next generation.
 * Stops ticking if the next generation is empty.
 */
function tick() {
  const nextGeneration = getNextGeneration();
  setCurrentGeneration(nextGeneration);
  incrementGenerationCount();

  const liveCells = getLiveCellCount();
  if (liveCells === 0) {
    const stopButton = document.querySelector('#stop');
    stopButton.click();
  }

  renderGame();
}

/**
 * Initiates ticks to begin repeating at the specified interval.
 */
function startTicking() {
  const tickInterval = getTickInterval();
  const ticker = setInterval(tick, tickInterval);
  const startButton = document.querySelector('#start');
  const stopButton = document.querySelector('#stop');
  const tickSpeed = document.querySelector('#tick-speed');
  startButton.addEventListener('click', () => clearInterval(ticker));
  stopButton.addEventListener('click', () => clearInterval(ticker));
  tickSpeed.addEventListener('change', () => clearInterval(ticker));
  setActivityStatus('active');
}

/**
 * Sets the activity status to inactive.
 */
function stopTicking() {
  setActivityStatus('inactive');
}

//5. This section contains functions related to the grid size.

/**
 * Retrieves the current grid size from local storage.
 * @return {number} - The current grid size.
 */
function getGridSize() {
  const localStorage = window.localStorage;
  const gridSize = +localStorage.getItem('gridSize');
  return gridSize;
}

/**
 * Sets the grid size value in local storage to a new size.
 * @param {number} size - The new grid size.
*/
function setGridSize(size) {
  const localStorage = window.localStorage;
  localStorage.setItem('gridSize', size);
}

/**
 * Updates the grid size to the size selected by the user.
 */
function updateGridSize() {
  const gridSize = +document.querySelector('#grid-size').value;
  console.log(gridSize);
  setGridSize(gridSize);
}

/**
 * Updates the grid size to the size selected by the user,
 * resizes the current generation to the selected size,
 * renders the game using the new grid.
 */
function handleGridSizeSelection() {
  updateGridSize();
  const gridSize = getGridSize();
  resizeCurrentGeneration(gridSize);
  renderGame();
}

//6. This section contains functions related to the generation count.

/**
 * Retrieves the current generation count from local storage.
 * @return {number} - The current generation count.
 */
function getCurrentGenerationCount() {
  const localStorage = window.localStorage;
  const currentGenerationCount = +localStorage.getItem('currentGenerationCount');
  return currentGenerationCount;
}

/**
 * Sets the current generation count in local storage to a new count.
 * @param {number} newCount - The new generation count.
 */
function setCurrentGenerationCount(newCount) {
  const localStorage = window.localStorage;
  localStorage.setItem('currentGenerationCount', newCount);
}

/**
 * Sets the current generation count to zero.
 */
function resetGenerationCount() {
  setCurrentGenerationCount(0);
}

/**
 * Increments the current generation count.
 */
function incrementGenerationCount() {
  const currentGenerationCount = getCurrentGenerationCount();
  setCurrentGenerationCount(currentGenerationCount + 1);
}

/**
 * Renders the current generation count.
 */
function renderGenerationCount() {
  const currentGenerationCount = getCurrentGenerationCount();
  const generationCountContainer = document.querySelector('#generation-count');
  generationCountContainer.innerText = currentGenerationCount;
}

//7. This section contains functions related to the live cell count.

/**
 * Retrieves the current live cell count from local storage.
 * @return {number} - The current live cell count.
 */
function getLiveCellCount() {
  const localStorage = window.localStorage;
  const liveCellCount = +localStorage.getItem('liveCellCount');
  return liveCellCount;
}

/**
 * Sets the current live cell count in local storage to a new count.
 * @param {number} newCount - The new live cell count.
 */
function setLiveCellCount(newCount) {
  const localStorage = window.localStorage;
  localStorage.setItem('liveCellCount', newCount);
}

/**
 * Counts the number of live cells in the current generation
 * and updates the live cell count.
 */
function updateLiveCellCount() {
  const currentGeneration = getCurrentGeneration();
  const liveCellCount = countLiveCells(currentGeneration);
  setLiveCellCount(liveCellCount);
}

/**
 * Renders the current live cell count.
 */
function renderLiveCellCount() {
  const liveCellCount = getLiveCellCount();
  const liveCellCountContainer = document.querySelector('#live-cell-count');
  liveCellCountContainer.innerText = liveCellCount;
}

/**
 * Counts the number of live cells in the given generation.
 * @param {Array} generation - The generation of cells to check.
 * @return {number} - The number of live cells in the specified generation.
 */
function countLiveCells(generation) {
  const rows = generation.length;
  const columns = generation[0].length;
  let liveCells = 0;

  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      liveCells += generation[i][j];
    }
  }

  return liveCells;
}

//8. This section contains functions related to the game's activity status.

/**
 * Retrieves the current activity status from local storage.
 * @return {string} - The current activity status.
 */
function getActivityStatus() {
  const localStorage = window.localStorage;
  return localStorage.getItem('activityStatus');
}

/**
 * Sets the current activity status in local storage to a new status.
 * @param {string} status - The new activity status.
 */
function setActivityStatus(status) {
  const localStorage = window.localStorage;
  localStorage.setItem('activityStatus', status);
}

//9. This section contains functions related to random generation of live cells.

/**
 * Sets the random life status in local storage to 'inactive'.
 */
function initializeRandomLife() {
  const localStorage = window.localStorage;
  localStorage.setItem('randomLifeStatus', 'inactive');
}

/**
 * Retrieves the current random life status from local storage.
 * @return {string} - The current random life status.
 */
function getRandomLifeStatus() {
  const localStorage = window.localStorage;
  const randomLifeStatus = localStorage.getItem('randomLifeStatus');
  return randomLifeStatus;
}

/**
 * Sets the current random life status in local storage to a new status.
 * @param {string} status - The new random life status.
 */
function setRandomLifeStatus(status) {
  const localStorage = window.localStorage;
  localStorage.setItem('randomLifeStatus', status);
}

/**
 * Randomly adds a live cell to the specified generation.
 * @param {Array} generation - The generation to add a random live cell to.
 * @return {Array} - The modified generation containing a new live cell.
*/
function addRandomLife(generation) {
  const gridSize = getGridSize();
  const randomRow = Math.floor(Math.random() * gridSize);
  const randomColumn = Math.floor(Math.random() * gridSize);
  const currentCellValue = generation[randomRow][randomColumn];
  if (currentCellValue) {
    return addRandomLife(generation);
  } else {
    generation[randomRow][randomColumn] = 1;
    return generation;
  }
}

/**
 * Sets the random life status based on user selection.
 * @param {Event} event - Click event when user toggles random life.
 */
function handleRandomLifeSelection(event) {
  const randomLifeActive = event.target.checked;
  if (randomLifeActive) {
    setRandomLifeStatus('active');
  } else {
    setRandomLifeStatus('inactive');
  }
}

//10. This section contains functions related to the predefined patterns.

/**
 * Sets the current generation to the selected pattern
 * and renders the pattern.
 * @param {Event} event - Selection of pattern.
 */
function handlePatternSelection(event) {
  const patternName = event.target.value;
  const pattern = getPattern(patternName);
  setCurrentGeneration(pattern);
  renderGame();
}

/**
 * @param {string} patternName - The name of a pattern.
 * @return {Array} - The initial state of the specified pattern.
 */
function getPattern(patternName) {
  let pattern = getEmptyGeneration();

  switch (patternName) {
    case 'glider':
      pattern = getGliderPattern();
      break;
    case 'small-exploder':
      pattern = getSmallExploderPattern();
      break;
    case 'exploder':
      pattern = getExploderPattern();
      break;
    case 'ten-cell-row':
      pattern = getTenCellRowPattern();
      break;
    case 'lightweight-spaceship':
      pattern = getLightweightSpaceshipPattern();
      break;
    case 'block':
      pattern = getBlockPattern();
      break;
    case 'tub':
      pattern = getTubPattern();
      break;
    case 'boat':
      pattern = getBoatPattern();
      break;
    default:
      break;
  }

  return pattern;
}

/**
 * @return {Array} - The initial state of the currently selected pattern.
 */
function getActivePattern() {
  const patternList = document.querySelector('#patterns');
  const activePatternSelection = patternList.value;
  const activePattern = getPattern(activePatternSelection);
  return activePattern;
}

/**
 * Creates an empty generation using the current grid size.
 * @return {Array} - An empty generation.
 */
function getEmptyGeneration() {
  const gridSize = getGridSize();
  const emptyGeneration = [];

  for (let i = 0; i < gridSize; i++) {
    emptyGeneration[i] = [];
    for (let j = 0; j < gridSize; j++) {
      emptyGeneration[i][j] = 0;
    }
  }

  return emptyGeneration;
}

/**
 * Creates and returns a glider pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A glider pattern.
 */
function getGliderPattern(startingRow = 8, startingColumn = 8) {
  const gliderPattern = getEmptyGeneration();
  gliderPattern[startingRow][startingColumn + 1] = 1;
  gliderPattern[startingRow + 1][startingColumn + 2] = 1;
  gliderPattern[startingRow + 2][startingColumn] = 1;
  gliderPattern[startingRow + 2][startingColumn + 1] = 1;
  gliderPattern[startingRow + 2][startingColumn + 2] = 1;
  return gliderPattern;
}

/**
 * Creates and returns a small exploder pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A small exploder pattern.
 */
function getSmallExploderPattern(startingRow = 7, startingColumn = 9) {
  const smallExploderPattern = getEmptyGeneration();
  smallExploderPattern[startingRow][startingColumn + 1] = 1;
  smallExploderPattern[startingRow + 1][startingColumn] = 1;
  smallExploderPattern[startingRow + 1][startingColumn + 1] = 1;
  smallExploderPattern[startingRow + 1][startingColumn + 2] = 1;
  smallExploderPattern[startingRow + 2][startingColumn] = 1;
  smallExploderPattern[startingRow + 2][startingColumn + 2] = 1;
  smallExploderPattern[startingRow + 3][startingColumn + 1] = 1;
  return smallExploderPattern;
}

/**
 * Creates and returns an exploder pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - An exploder pattern.
 */
function getExploderPattern(startingRow = 8, startingColumn = 8) {
  const exploderPattern = getEmptyGeneration();
  exploderPattern[startingRow][startingColumn] = 1;
  exploderPattern[startingRow][startingColumn + 2] = 1;
  exploderPattern[startingRow][startingColumn + 4] = 1;
  exploderPattern[startingRow + 1][startingColumn] = 1;
  exploderPattern[startingRow + 1][startingColumn + 4] = 1;
  exploderPattern[startingRow + 2][startingColumn] = 1;
  exploderPattern[startingRow + 2][startingColumn + 4] = 1;
  exploderPattern[startingRow + 3][startingColumn] = 1;
  exploderPattern[startingRow + 3][startingColumn + 4] = 1;
  exploderPattern[startingRow + 4][startingColumn] = 1;
  exploderPattern[startingRow + 4][startingColumn + 2] = 1;
  exploderPattern[startingRow + 4][startingColumn + 4] = 1;
  return exploderPattern;
}

/**
 * Creates and returns a ten cell row pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A ten cell row pattern.
 */
function getTenCellRowPattern(startingRow = 9, startingColumn = 5) {
  const tenCellRowPattern = getEmptyGeneration();
  const endingColumn = startingColumn + 10;
  for (let i = startingColumn; i < endingColumn; i++) {
    tenCellRowPattern[startingRow][i] = 1;
  }

  return tenCellRowPattern;
}

/**
 * Creates and returns a lightweight spaceship pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A lightweight spaceship pattern.
 */
function getLightweightSpaceshipPattern(startingRow = 8, startingColumn = 8) {
  const lightweightSpaceshipPattern = getEmptyGeneration();
  lightweightSpaceshipPattern[startingRow][startingColumn + 1] = 1;
  lightweightSpaceshipPattern[startingRow][startingColumn + 2] = 1;
  lightweightSpaceshipPattern[startingRow][startingColumn + 3] = 1;
  lightweightSpaceshipPattern[startingRow][startingColumn + 4] = 1;
  lightweightSpaceshipPattern[startingRow + 1][startingColumn] = 1;
  lightweightSpaceshipPattern[startingRow + 1][startingColumn + 4] = 1;
  lightweightSpaceshipPattern[startingRow + 2][startingColumn + 4] = 1;
  lightweightSpaceshipPattern[startingRow + 3][startingColumn] = 1;
  lightweightSpaceshipPattern[startingRow + 3][startingColumn + 3] = 1;
  return lightweightSpaceshipPattern;
}

/**
 * Creates and returns a block pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A block pattern.
 */
function getBlockPattern(startingRow = 9, startingColumn = 9) {
  const blockPattern = getEmptyGeneration();
  blockPattern[startingRow][startingColumn] = 1;
  blockPattern[startingRow][startingColumn + 1] = 1;
  blockPattern[startingRow + 1][startingColumn] = 1;
  blockPattern[startingRow + 1][startingColumn + 1] = 1;
  return blockPattern;
}

/**
 * Creates and returns a tub pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A tub pattern.
 */
function getTubPattern(startingRow = 8, startingColumn = 8) {
  const tubPattern = getEmptyGeneration();
  tubPattern[startingRow][startingColumn + 1] = 1;
  tubPattern[startingRow + 1][startingColumn] = 1;
  tubPattern[startingRow + 1][startingColumn + 2] = 1;
  tubPattern[startingRow + 2][startingColumn + 1] = 1;
  return tubPattern;
}

/**
 * Creates and returns a boat pattern.
 * @param {number} startingRow - An optional starting row for the pattern.
 * @param {number} startingColumn - An optional starting column for the pattern.
 * @return {Array} - A boat pattern.
 */
function getBoatPattern(startingRow = 8, startingColumn = 8) {
  const boatPattern = getEmptyGeneration();
  boatPattern[startingRow][startingColumn + 1] = 1;
  boatPattern[startingRow + 1][startingColumn] = 1;
  boatPattern[startingRow + 1][startingColumn + 2] = 1;
  boatPattern[startingRow + 2][startingColumn + 1] = 1;
  boatPattern[startingRow + 2][startingColumn + 2] = 1;
  return boatPattern;
}

// The user can click this button to manually trigger a tick.
const tickButton = document.querySelector('#tick');
tickButton.addEventListener('click', tick);

// The start button initiates automatic ticking at the specified interval.
const startButton = document.querySelector('#start');
startButton.addEventListener('click', startTicking);

// The stop button stops the automatic ticking.
const stopButton = document.querySelector('#stop');
stopButton.addEventListener('click', stopTicking);

// The reset button resets the game to the initial generation.
const resetButton = document.querySelector('#reset');
resetButton.addEventListener('click', resetGame);

// The user can select a predefined pattern.
const patterns = document.querySelector('#patterns');
patterns.addEventListener('change', handlePatternSelection);

// The user can set a tickspeed to modify the automatic ticking interval.
const tickSpeed = document.querySelector('#tick-speed');
tickSpeed.addEventListener('change', updateTickInterval);

// The user can modify the dimensions of the grid.
const gridSize = document.querySelector('#grid-size');
gridSize.addEventListener('change', handleGridSizeSelection);

// Toggles random generation of live cells.
const randomLife = document.querySelector('#random-life');
randomLife.addEventListener('click', handleRandomLifeSelection);

// Initializes the game.
initializeGame();
