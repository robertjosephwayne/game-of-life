"use strict"

// Retrieve and return an array containing the current generation of cells
function getCurrentGeneration() {
  const localStorage = window.localStorage;
  const currentGenerationJSON = localStorage.getItem('currentGeneration');
  return JSON.parse(currentGenerationJSON);
}

// Takes an array containing the current generation of cells as an argument
// Returns an array containing the next generation of cells
function getNextGeneration(currentGeneration) {
  const rows = currentGeneration.length;
  const columns = currentGeneration[0].length;
  let nextGeneration = [];

  for (let i = 0; i < rows; i++) {
    nextGeneration[i] = []; 
    for (let j = 0; j < columns; j++) {
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

// Updates the variable containing the current generation of cells to the next generation
function setCurrentGeneration(nextGeneration) {
  const localStorage = window.localStorage;
  const nextGenerationJSON = JSON.stringify(nextGeneration);
  localStorage.setItem('currentGeneration', nextGenerationJSON);
}

// Takes an array containing the current generation as an argument
// Also takes a specific cell row and cell column number as arguments
// Returns a boolean value indicating whether the cell will be alive in the next generation
// Returns 1 if the cell will be alive and 0 if the cell will be dead in the next generation
function isAliveNextGeneration(currentGeneration, cellRow, cellColumn) {
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
}

// Takes an array containing the current generation as an argument
// Also takes a specific cell row and cell column number as arguments
// The neighbors are the 8 cells surrounding the cell
// If there is overflow, the pattern is assumed to continue on the other side of the grid
// Returns the number of neighbors that are alive in the current generation
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

// Takes an array containing the next generation as an argument
// Updates the page to display the next generation
function render() {
  const currentGeneration = getCurrentGeneration();
  const gridSize = getGridSize();
  const rows = gridSize;
  const columns = gridSize;
  const gameCells = document.createElement('table');
  gameCells.id = 'game-board';
  gameCells.addEventListener('click', handleCellClick);

  for (let i = 0; i < rows; i++) {
    const currentRow = document.createElement('tr');
    for (let j = 0; j < columns; j++) {
      const cell = document.createElement('td')
      cell.setAttribute("data-row", i);
      cell.setAttribute("data-column", j);
      if (currentGeneration[i][j]) {
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

  renderGenerationCount();
}

// Get the next generation of cells
// Update the current generation to the next generation
// Render the next generation to the page
function tick() {
  const currentGeneration = getCurrentGeneration();
  const nextGeneration = getNextGeneration(currentGeneration);
  setCurrentGeneration(nextGeneration);
  incrementGenerationCount();
  render();
}

function initializeGame() {
  const initialGeneration = getEmptyGeneration();
  initializeGridSize();
  setCurrentGeneration(initialGeneration);
  initializeRandomLife();
  handleTickSpeedSelection();
  resetGenerationCount();
  render();
}

function getPattern(patternName) {
  let pattern = getEmptyGeneration();
  
  switch (patternName) {
    case "glider":
      pattern = getGliderPattern();
      break;
    case "small-exploder":
      pattern = getSmallExploderPattern();
      break;
    case "exploder":
      pattern = getExploderPattern();
      break;
    case "ten-cell-row":
      pattern = getTenCellRowPattern();
      break;
    case "lightweight-spaceship":
      pattern = getLightweightSpaceshipPattern();
      break;
    case "block":
      pattern = getBlockPattern();
      break;
    case "tub":
      pattern = getTubPattern();
      break;
    case "boat":
      pattern = getBoatPattern();
      break;
    default:
      break;
  }

  return pattern;
}

function getEmptyGeneration(rows = 50, columns = 50) {
  const emptyGeneration = [];
  for (let i = 0; i < rows; i++) {
    emptyGeneration[i] = [];
    for (let j = 0; j < columns; j++) {
      emptyGeneration[i][j] = 0;
    }
  }

  return emptyGeneration;
}

function getGliderPattern(startingRow = 8, startingColumn = 8) {
  const gliderPattern = getEmptyGeneration();
  gliderPattern[startingRow][startingColumn + 1] = 1;
  gliderPattern[startingRow + 1][startingColumn + 2] = 1;
  gliderPattern[startingRow + 2][startingColumn] = 1;
  gliderPattern[startingRow + 2][startingColumn + 1] = 1;
  gliderPattern[startingRow + 2][startingColumn + 2] = 1;
  return gliderPattern;
}

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

function getTenCellRowPattern(startingRow = 9, startingColumn = 5) {
  const tenCellRowPattern = getEmptyGeneration();
  const endingColumn = startingColumn + 10;
  for (let i = startingColumn; i < endingColumn; i++) {
    tenCellRowPattern[startingRow][i] = 1;
  }

  return tenCellRowPattern;
}

function getLightweightSpaceshipPattern(startingRow = 8, startingColumn = 8) {
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

function getBlockPattern(startingRow = 9, startingColumn = 9) {
  const blockPattern = getEmptyGeneration();
  blockPattern[startingRow][startingColumn] = 1;
  blockPattern[startingRow][startingColumn + 1] = 1;
  blockPattern[startingRow + 1][startingColumn] = 1;
  blockPattern[startingRow + 1][startingColumn + 1] = 1;
  return blockPattern;
}

function getTubPattern(startingRow = 8, startingColumn = 8) {
  const tubPattern = getEmptyGeneration();
  tubPattern[startingRow][startingColumn + 1] = 1;
  tubPattern[startingRow + 1][startingColumn] = 1;
  tubPattern[startingRow + 1][startingColumn + 2] = 1;
  tubPattern[startingRow + 2][startingColumn + 1] = 1;
  return tubPattern;
}

function getBoatPattern(startingRow = 8, startingColumn = 8) {
  const boatPattern = getEmptyGeneration();
  boatPattern[startingRow][startingColumn + 1] = 1;
  boatPattern[startingRow + 1][startingColumn] = 1;
  boatPattern[startingRow + 1][startingColumn + 2] = 1;
  boatPattern[startingRow + 2][startingColumn + 1] = 1;
  boatPattern[startingRow + 2][startingColumn + 2] = 1;
  return boatPattern;
}

function handleStart() {
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

function handleStop() {
  setActivityStatus('inactive');
}

function handleCellClick(event) {
  const cellRow = event.target.dataset.row;
  const cellColumn = event.target.dataset.column;
  const currentGeneration = getCurrentGeneration();
  let currentValue = currentGeneration[cellRow][cellColumn];
  
  if (currentValue === 1) {
    currentGeneration[cellRow][cellColumn] = 0;
  } else {
    currentGeneration[cellRow][cellColumn] = 1;
  }

  setCurrentGeneration(currentGeneration);
  render();
}

function handleReset() {
  const patternList = document.querySelector('#patterns');
  const activePattern = patternList.value;
  const initialGeneration = getPattern(activePattern);
  setCurrentGeneration(initialGeneration);
  resetGenerationCount();
  render();
}

function handlePatternSelection(event) {
  const patternName = event.target.value;
  const pattern = getPattern(patternName);
  setCurrentGeneration(pattern);
  render();
}

function handleTickSpeedSelection() {
  const localStorage = window.localStorage;
  const tickSpeed = document.querySelector('#tick-speed');
  const rangeMax = tickSpeed.getAttribute('max');
  const rangeValue = tickSpeed.value;
  const newTickInterval = rangeMax - rangeValue;
  setTickInterval(newTickInterval);

  const activityStatus = getActivityStatus();
  if (activityStatus === 'active') handleStart();
}

function handleGridSizeSelection() {
  const gridSize = document.querySelector('#grid-size').value;
  setGridSize(parseInt(gridSize));
  render();
}

function initializeGridSize() {
  const gridSize = document.querySelector('#grid-size').value;
  setGridSize(parseInt(gridSize));
}

function getGridSize() {
  const localStorage = window.localStorage;
  const gridSize = localStorage.getItem('gridSize');
  return parseInt(gridSize);
}

function setGridSize(size) {
  const localStorage = window.localStorage;
  localStorage.setItem('gridSize', size);
}

function incrementGenerationCount() {
  const currentGenerationCount = getCurrentGenerationCount();
  setCurrentGenerationCount(currentGenerationCount + 1);
}

function getCurrentGenerationCount() {
  const localStorage = window.localStorage;
  const currentGenerationCount = localStorage.getItem('currentGenerationCount');
  return parseInt(currentGenerationCount);
}

function setCurrentGenerationCount(newCount) {
  const localStorage = window.localStorage;
  localStorage.setItem('currentGenerationCount', newCount);
}

function renderGenerationCount() {
  const localStorage = window.localStorage;
  const currentGenerationCount = getCurrentGenerationCount();
  const generationCountContainer = document.querySelector('#generation-count');
  generationCountContainer.innerText = currentGenerationCount;
}

function resetGenerationCount() {
  setCurrentGenerationCount(0);
}

function getTickInterval() {
  const localStorage = window.localStorage;
  const tickInterval = localStorage.getItem('tickInterval');
  return parseInt(tickInterval);
}

function setTickInterval(newTickInterval) {
  const localStorage = window.localStorage;
  localStorage.setItem('tickInterval', newTickInterval);
}

function getActivityStatus() {
  const localStorage = window.localStorage;
  return localStorage.getItem('activityStatus');
}

function setActivityStatus(status) {
  const localStorage = window.localStorage;
  localStorage.setItem('activityStatus', status);
}

function initializeRandomLife() {
  const localStorage = window.localStorage;
  localStorage.setItem('randomLifeStatus', 'inactive');
}

function handleRandomLifeSelection(event) {
  const randomLifeStatus = event.target.value;
  setRandomLifeStatus(randomLifeStatus);
}

function getRandomLifeStatus() {
  const localStorage = window.localStorage;
  const randomLifeStatus = localStorage.getItem('randomLifeStatus');
  return randomLifeStatus;
}

function setRandomLifeStatus(status) {
  const localStorage = window.localStorage;
  localStorage.setItem('randomLifeStatus', status);
}

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

initializeGame();

const tickButton = document.querySelector('#tick');
tickButton.addEventListener('click', tick);

const startButton = document.querySelector('#start');
startButton.addEventListener('click', handleStart);

const stopButton = document.querySelector('#stop');
stopButton.addEventListener('click', handleStop);

const resetButton = document.querySelector('#reset');
resetButton.addEventListener('click', handleReset);

const patterns = document.querySelector('#patterns');
patterns.addEventListener('change', handlePatternSelection);

const tickSpeed = document.querySelector('#tick-speed');
tickSpeed.addEventListener('change', handleTickSpeedSelection);

const gridSize = document.querySelector('#grid-size');
gridSize.addEventListener('change', handleGridSizeSelection);

const randomLifeOn = document.querySelector('#random-life-on');
randomLifeOn.addEventListener('click', handleRandomLifeSelection);

const randomLifeOff = document.querySelector('#random-life-off');
randomLifeOff.addEventListener('click', handleRandomLifeSelection);

