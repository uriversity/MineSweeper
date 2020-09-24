"use strict";
const MINE = "&#128169";
const EMPTY = " ";
const MANUAL_MINE = "MINE";

var gBoard;

var gGame = { isOn: false, shownCount: 0, markedCount: 0, secsPassed: 0 };
var gLevel = { SIZE: 4, MINES: 2 };

function init() {
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
        isShown: true,
        isMine: false,
        isMarked: false,
      };
    }
  }
  return board;
}

function allocateBombs() {
  var bombsAllo = gLevel['MINES'];
  while(bombsAllo > 0){
    for (var i = 0; i < gLevel['SIZE']; i++) {
      for (var j = 0; (bombsAllo > 0) && (j < gLevel['SIZE']) && (!gBoard[i][j].isMine); j++) {
        var isfiftyFifyChance = (Math.random() < 0.5) ? 0 : 1;
        if(isfiftyFifyChance){
          gBoard[i][j].isMine = true;
          bombsAllo--;
        }
      }
    }
  }
}

function renderBoard(board) {
  var strHTML = "";
  for (var i = 0; i < board.length; i++) {
    strHTML += "<tr>";
    for (var j = 0; j < board[0].length; j++) {
      var cell = board[i][j];
      var className = "cell" + i + "-" + j;
      var content = "";
      if (cell.isShown) {
        if (cell.isMine) {
          content = MINE;
        } else {
          content = cell.minesAroundCount;
        }
      }
      strHTML += '<td class="' + className + '" onclick="cellClicked(this, ' +i+ ','+j+')"> ' + content + " </td>";
    }
    strHTML += "</tr>";
  }
  
  var elContainer = document.querySelector(".board");
  elContainer.innerHTML = strHTML;
}


function cellClicked(elCell, i, j){ 
 // console.log('elcell:', elCell);
 // if (currCell.isMine) gameLost();
 gBoard[i][j].isShown = true;
 var minesCount = gBoard[i][j].minesAroundCount;
 renderCell(minesCount, i, j);
}

function renderCell(minesCount, i, j) {
  var cellClass = 'cell' + i + '-' + j;
  console.log('class name:', cellClass);
  var cellSelector = '.' +cellClass;
  console.log('cellSelector:' ,cellSelector);
  var elCell = document.querySelector(cellSelector);
  console.log(elCell);
  elCell.textContent = minesCount;
}


function setMinesNegsCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board.length; j++) {
      board[i][j].minesAroundCount = findNegsMines(i, j, board);
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



/*
cellMarked(elCell){

}

checkGameOver(){


}

expandShown(board, elCell, i, j){

}




// }


function getRndInteger(min, max) {
	return boardh.floor(boardh.random() * (max - min + 1)) + min;
}
*/