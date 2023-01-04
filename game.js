const gameBoard = (() => {
  let _board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const updateBoard = (index, sign) => (_board[index] = sign);
  const clearBoard = () => _board.fill(0);
  const getBoard = () => _board;

  return { getBoard, clearBoard, updateBoard };
})();

const Player = (sign, controller = 'human') => {
  const _sign = sign;
  const getSign = () => _sign;

  const _board = [];
  const updateBoard = (index) => _board.push(index);
  const getBoard = () => _board;
  const clearBoard = () => _board.splice(0, _board.length);

  /*  
    the code for timeout, waitUserInput and base structure of _humanMove are based on code from this stack overflow question: https://stackoverflow.com/questions/51013412/how-to-use-javascript-await-on-user-input-in-an-async-function
   */
  let _moveCell;
  let _next = false; // this is to be changed on user input
  const timeout = async (ms) => new Promise((res) => setTimeout(res, ms));
  async function waitUserInput() {
    while (_next === false) await timeout(50); // pauses script
    _next = false; // reset var
  }
  const _handler = function (e) {
    if (
      e.target.closest('#game-grid') &&
      !e.target.closest('.grid-item').classList.contains('filled')
    ) {
      _next = true;
      _moveCell = e.target.closest('.grid-item');
    }
  };

  const _humanMove = async function () {
    _next = false;
    document.addEventListener('click', (e) => {
      _handler(e);
    });
    await waitUserInput();
    let gridCell = _moveCell;
    displayController.fillCell(gridCell, _sign);
    let index = gridCell.getAttribute('data-id');
    document.removeEventListener('click', (e) => {
      _handler(e);
    });
    return index;
  };
  const _AIMove = () => {};

  const move = async function () {
    if (controller === 'human') {
      return _humanMove();
    } else {
      console.log('ai');
    }
  };

  return {
    getSign,
    updateBoard,
    getBoard,
    clearBoard,
    move,
  };
};

const Round = () => {
  const _difference = (array) => {
    [a, b, c] = array.sort();
    return c - b === b - a ? c - b : 0;
  };
  const _sum = (array) => array.reduce((sum, num) => (sum += num), 0);
  const _isWinningRow = function (array) {
    const arrDiff = _difference(array);
    if (arrDiff) {
      const arrSum = _sum(array);
      if (
        arrSum === 12 ||
        (arrDiff === 1 && (arrSum === 3 || arrSum === 21)) ||
        (arrDiff === 3 && (arrSum === 9 || arrSum === 15))
      ) {
        return true;
      }
    }
    return false;
  };
  const _checkRows = (fullArray) => {
    // iterating over the array with every new addition to it, to check the rows enabled by this new addition. so if the array is [1,2,3,4] it will check [1,2,4],[1,3,4],[2,3,4] but not [1,2,3], under the assumption that that had been checked previously, to avoid doing the same calculations over again.
    for (let i = 0; i < fullArray.length; i++) {
      for (let j = i + 1; j < fullArray.length - 1; j++) {
        let tempArray = [
          fullArray[i],
          fullArray[j],
          fullArray[fullArray.length - 1],
        ];
        if (_isWinningRow(tempArray)) return tempArray;
      }
    }
    return false;
  };

  let currentTurnSign;
  const play = async (winner = playerX, looser = playerO) => {
    [winner, looser].forEach((player) => player.clearBoard());
    gameBoard.clearBoard();
    displayController.clearCellClasses();

    round: for (let i = 0; i < 9; i++) {
      let index;
      let player;
      if (i % 2 === 0) {
        player = looser;
      } else {
        player = winner;
      }
      currentTurnSign = player.getSign();
      index = await player.move();

      gameBoard.updateBoard(index, currentTurnSign);
      player.updateBoard(Number(index));
      if (i >= 4) {
        let tempBoard = player.getBoard();
        if (_checkRows(tempBoard)) {
          winner = player;
          return winner;
        }
      }
    }
    return (winner = 0); //0 means draw, no winner
  };

  return { play };
};

const Game = (() => {
  // variables
  //   const numberOfRounds = rounds;
  let _score = { X: 0, O: 0 };

  const _updateScore = (winner) => (_score[winner] += 1);
  const clearScore = () => (_score = 0); //is needed?
  const _getScore = (sign) => _score[sign]; //is needed?

  const play = async (rounds) => {
    displayController.updateDetails(displayController.totalRounds, rounds);
    [displayController.scoreO, displayController.scoreX].forEach((box) =>
      displayController.updateDetails(box, 0)
    );
    let winner;
    let looser;
    let newRound = Round();
    for (let currentRound = 1; currentRound <= rounds; currentRound++) {
      displayController.updateDetails(
        displayController.currentRound,
        currentRound
      );
      winner =
        currentRound === 1
          ? await newRound.play()
          : await newRound.play(winner, looser);
      if (winner) {
        looser = winner == playerX ? playerO : playerX;
        console.log(winner.getSign() + ' won', looser.getSign() + ' lost');
        _updateScore(winner.getSign());
        displayController.updateDetails(displayController.scoreO, _score.O);
        displayController.updateDetails(displayController.scoreX, _score.X);
      } else {
        console.log("it's a draw");
        // choose randomly which one will play first next round
        winner = [playerX, playerO][Math.floor(Math.random() * 2)];
        looser = winner == playerX ? playerO : playerX;
      }
    }
  };

  return { play };
})();

const displayController = (() => {
  const gridItems = document.querySelectorAll('.grid-item');
  const restartBtn = document.querySelector('.restart');
  const menuBtn = document.querySelector('.menu');
  menuBtn.addEventListener('click', () => {
    sessionStorage.clear();
    location.href = './index.html';
  });

  const scoreX = document.querySelector('#score-x-num');
  const scoreO = document.querySelector('#score-o-num');
  const totalRounds = document.querySelector('#total-rounds');
  const currentRound = document.querySelector('#current-round');

  const updateDetails = (htmlBox, num) => {
    htmlBox.textContent = num;
  };

  const clearCellClasses = () => {
    gridItems.forEach((cell) => (cell.className = 'grid-item |'));
  };

  const fillCell = (cell, sign) => {
    cell.classList.add('filled', `display-${sign}`);
  };

  return {
    fillCell,
    clearCellClasses,
    updateDetails,
    totalRounds,
    currentRound,
    scoreO,
    scoreX,
  };
})();

const rounds = sessionStorage.getItem('numberOfRounds');
const playerOController = sessionStorage.getItem('playerOController');
const playerXController = sessionStorage.getItem('playerXController');
const playerX = Player('X');
const playerO = Player('O');
Game.play(rounds);
