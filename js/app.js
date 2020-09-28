'use strict';
const FLAG = 'U+1F605';
const MINE = '&#128169';
const EMPTY = '';
var elMinutes = document.querySelector('.minutes');
var elSeconds = document.querySelector('.seconds');
var gInterval = 0;
var gBombsPoses = [];
var gBoard;
var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
var gLevel = { SIZE: 4, MINES: 2 };

function init() {
  gGame.secsPassed = 0;
  gBoard = buildBoard();
  allocateBombs();
  setMinesNegsCount(gBoard);
  renderBoard(gBoard);
}

function buildBoard() {
  var board = [];
  for (var i = 0; i < gLevel.SIZE; i++) {
    board.push([]);
    for (var j = 0; j < gLevel.SIZE; j++) {
      board[i][j] = {
        minesAroundCount: 0,
        isShown: false,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function allocateBombs() {
  var idx = 0;
  var bombsAllo = gLevel['MINES'];
  while(bombsAllo > 0){
    for (var i = 0; i < gLevel['SIZE']; i++) {
      for (var j = 0; (bombsAllo > 0) && (j < gLevel['SIZE']) && (!gBoard[i][j].isMine); j++) {
        var isfiftyFifyChance = (Math.random() < 0.5) ? 0 : 1;
        if(isfiftyFifyChance){
          gBoard[i][j].isMine = true;
          var posCurrMine = {row: 0, col: 0};
          posCurrMine['row'] = i;
          posCurrMine['col'] = j;
          gBombsPoses.push(posCurrMine);
          console.log(gBombsPoses);
          bombsAllo--;
        }
      }
    }
  }
}

function renderBoard(board, isHidden) {
  var strHTML = '';
  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>';
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      var className = 'cell' + i + '-' + j;
      var content = '';
      if (cell.isShown) {
        if (cell.isMine) {
          content = MINE;
        } else {
          content = cell.minesAroundCount;
        }
      }
      strHTML += '<td class="' + className + '" class="masked" onclick="cellClicked(this, ' + i + ','+ j +')" oncontextmenu="cellMarked(this, ' + i + ','+ j +')"> ' + content + ' </td>';
    }
    strHTML += '</tr>';
  }
  
  var elContainer = document.querySelector(".board");
  elContainer.innerHTML = strHTML;
}

function cellMarked(elCell, i, j){
  if(gInterval === 0){
    gGame.isOn = true;
    gInterval = setInterval(countTime, 1000);
  }
  if (document.addEventListener) {
    document.addEventListener('contextmenu', function (e) {e.preventDefault();}, false);
  } else {
    document.attachEvent('oncontextmenu', function () {window.event.returnValue = false;});
  }
  if (!gBoard[i][j].isShown){
    if(!gBoard[i][j].isMarked){
     gBoard[i][j].isMarked = true;
     gGame.minesCount--;
    } else {
      gBoard[i][j].isMarked = false;
     gGame.minesCount++;
    }
    renderCellFlagged(i,j);
    checkGameOver();
  }
  return false;
}

function cellClicked(elCell, i, j){ 
  if(gInterval === 0){
    gGame.isOn = true;
    gInterval = setInterval(countTime, 1000);
  }
  if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;
  gBoard[i][j].isShown = true;
  if (gBoard[i][j].isMine) playerLost();
  var minesCount = gBoard[i][j].minesAroundCount;
  if (minesCount > 0) renderCell(minesCount, i, j);
  else renderCellMineOrNothing(i, j);
  gGame.shownCount++;
  checkGameOver();
}

function reset(){
  gGame.isOn = false;
  clearInterval(gInterval);
  init();
}

function renderCell(minesCount, i, j) {
  var cellClass = 'cell' + i + '-' + j;
  var cellSelector = '.' +cellClass;
  var elCell = document.querySelector(cellSelector);
  elCell.textContent = minesCount;
}

function renderCellMineOrNothing(i, j) {
  var cellClass = 'cell' + i + '-' + j;
  var cellSelector = '.' +cellClass;
  var elCell = document.querySelector(cellSelector);
  console.log(elCell);
  if (gBoard[i][j].isMine) elCell.innerHTML = MINE;
}

function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      if (!board[i][j].isMine) board[i][j].minesAroundCount = findNegsMines(i, j, board);
    }
  }
}

function findNegsMines(cellI, cellJ, board) {
  var sum = 0;
  for (var i = cellI - 1; i <= cellI + 1; i++) {
    if (i < 0 || i >= board.length) continue;
    for (var j = cellJ - 1; j <= cellJ + 1; j++) {
      if (j < 0 || j >= board[i].length) continue;
      if (i === cellI && j === cellJ) continue;
      if (board[i][j].isMine) sum++;
    }
  }
  return sum;
}

function countTime() {
  gGame.secsPassed++;
  elSeconds.innerHTML = pad(gGame.secsPassed % 60);
  elMinutes.innerHTML = pad(parseInt(gGame.secsPassed / 60));
}

function pad(val) {
  var valString = +val;
  if (valString.length < 2){
   return ('0' + valString);
  }else {
  return valString;
  }
}

function checkGameOver(){
  if(gGame.minesCount === 0){
    var cellsLeft = gBoard.length*gBoard.length - gGame.shownCount - gLevel.MINES;
    if(cellsLeft === 0){
      gGame.isOn = false;
      alert('You WON!');
      clearInterval(gInterval);
    }
  }
}

function playerLost(){
  for (var i = 0; i < gBombsPoses.length; i++) {
    clearInterval(gInterval);
    var currBombPosI = gBombsPoses[i].row;
    var currBombPosj = gBombsPoses[i].col;
    gBoard[currBombPosI][currBombPosj].isShown = true;
    renderCellMineOrNothing(currBombPosI, currBombPosj);
  }
  alert('LOST! Thanks for playing, click RESTART button to try again!');
}

function renderCellFlagged(i,j){
  var cellClass = 'cell' + i + '-' + j;
  var cellSelector = '.' +cellClass;
  var elCell = document.querySelector(cellSelector);
  elCell.innerHTML = FLAG;
}