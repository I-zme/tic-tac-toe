const gameBoard = (() => {
  let _board = [0, 0, 0, 0, 0, 0, 0, 0, 0];

  const updateBoard = (index, sign) => (_board[index] = sign);
  const clearBoard = () => _board.fill(0);
  const getBoard = () => _board;

  // calculating and checking board rows
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
  const checkRows = (fullArray) => {
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

  return { getBoard, clearBoard, updateBoard, checkRows };
})();

const Player = (sign, controller, level) => {
  const _controller = controller;
  const _AILevel = level;

  const _sign = sign;
  const getSign = () => _sign;

  const _board = [];
  const updateBoard = (index) => _board.push(index);
  const getBoard = () => _board;
  const clearBoard = () => _board.splice(0, _board.length);

  /*  HUMAN MOVEMENTS AND FUNCS
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

  // AI MOVEMENTS AND FUNCS
  const _randomMove = (options) => {
    let index = options[Math.floor(Math.random() * options.length)];
    // let gridCell = displayController.fillCell(
    //   document.querySelector(`[data-id="${index}"]`),
    //   _sign
    // );
    return index;
  };

  const checkOptions = (playerBoard, options) => {
    for (let i = 0; i <= options.length; i++) {
      let optionalArray = [...playerBoard, options[i]];
      if (gameBoard.checkRows(optionalArray)) return optionalArray;
    }
  };

  const _AIMove = async () => {
    await timeout(500);
    let index;
    let boardOptions = gameBoard.getBoard().reduce(function (a, e, i) {
      if (e === 0) a.push(i);
      return a;
    }, []);
    // it's possible to add other levels of difficulty here
    if (_AILevel === 'easy') {
      index = _randomMove(boardOptions);
    } else if (_AILevel === 'medium') {
      if (getBoard().length >= 2) {
        let oppositeBoard =
          _sign === 'X' ? playerO.getBoard() : playerX.getBoard();
        let playerWinningRow = checkOptions(getBoard(), boardOptions);
        let oppositeWinningRow = checkOptions(oppositeBoard, boardOptions);
        if (playerWinningRow) {
          index = playerWinningRow.pop();
        } else if (oppositeWinningRow) {
          index = oppositeWinningRow.pop();
        } else {
          index = _randomMove(boardOptions);
        }
      } else {
        index = _randomMove(boardOptions);
      }
    }
    let gridCell = displayController.fillCell(
      document.querySelector(`[data-id="${index}"]`),
      _sign
    );
    await timeout(500);
    return index;
  };

  const move = async function () {
    if (_controller === 'human') {
      return _humanMove();
    } else if (_controller === 'ai') {
      return _AIMove();
    } else {
      console.log('problem with controller');
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
  let currentTurnSign;
  const play = async (winner = playerX, looser = playerO) => {
    [winner, looser].forEach((player) => player.clearBoard());
    gameBoard.clearBoard();
    displayController.clearCellClasses();
    displayController.clearGlow();

    round: for (let i = 0; i < 9; i++) {
      let index;
      let player;
      if (i % 2 === 0) {
        player = looser;
      } else {
        player = winner;
      }
      currentTurnSign = player.getSign();
      displayController.toggleGlow(currentTurnSign);
      index = await player.move();

      gameBoard.updateBoard(index, currentTurnSign);
      player.updateBoard(Number(index));
      if (i >= 4) {
        let tempBoard = player.getBoard();
        if (gameBoard.checkRows(tempBoard)) {
          winner = player;
          return winner;
        }
      }
      displayController.toggleGlow(currentTurnSign);
    }
    return (winner = 0); //0 means draw, no winner
  };

  return { play };
};

const Game = (() => {
  let _score = { X: 0, O: 0 };
  const _updateScore = (winner) => (_score[winner] += 1);
  const clearScore = () => (_score = { X: 0, O: 0 });

  const play = async (rounds) => {
    displayController.clearDisplayResult();
    displayController.updateDetails(displayController.totalRounds, rounds);
    [displayController.scoreO, displayController.scoreX].forEach((box) =>
      displayController.updateDetails(box, 0)
    );
    let winner;
    let looser;
    let newRound = Round();
    for (let currentRound = 1; currentRound <= rounds; currentRound++) {
      let msg;
      displayController.updateDetails(
        displayController.currentRound,
        currentRound
      );
      winner =
        currentRound === 1
          ? await newRound.play()
          : await newRound.play(winner, looser);
      if (winner) {
        msg = `${winner.getSign()} won this round!`;
        looser = winner == playerX ? playerO : playerX;
        _updateScore(winner.getSign());
        displayController.updateDetails(displayController.scoreO, _score.O);
        displayController.updateDetails(displayController.scoreX, _score.X);
      } else {
        // choose randomly which one will play first next round
        winner = [playerX, playerO][Math.floor(Math.random() * 2)];
        looser = winner == playerX ? playerO : playerX;
        msg = "It's a tie!";
      }
      displayController.displayResult(msg);
      setTimeout(() => {
        displayController.clearDisplayResult();
      }, 1000);
    }
    let msg;
    if (_score.O > _score.X) {
      msg = 'O won the game!';
    } else if (_score.X > _score.O) {
      msg = 'X won the game!';
    } else {
      msg = "It's a tie!";
    }
    displayController.displayResult(msg);
  };

  return { play, clearScore };
})();

const displayController = (() => {
  //user interact with the interface
  const gridItems = document.querySelectorAll('.grid-item');
  const restartBtn = document.querySelector('.restart');
  const menuBtn = document.querySelector('.menu');

  restartBtn.addEventListener('click', () => {
    Game.clearScore();
    Game.play(rounds);
  });

  menuBtn.addEventListener('click', () => {
    sessionStorage.clear();
    location.href = './index.html';
  });

  // update and display info
  const scoreX = document.querySelector('#score-x-num');
  const scoreO = document.querySelector('#score-o-num');
  const totalRounds = document.querySelector('#total-rounds');
  const currentRound = document.querySelector('#current-round');
  const resultDiv = document.querySelector('#result-msg');

  const updateDetails = (htmlBox, num) => {
    htmlBox.textContent = num;
  };

  const fillCell = (cell, sign) => {
    cell.classList.add('filled', `display-${sign}`);
  };

  const clearCellClasses = () => {
    gridItems.forEach((cell) => (cell.className = 'grid-item |'));
  };

  const displayResult = (msg) => {
    resultDiv.textContent = msg;
  };
  const clearDisplayResult = () => {
    resultDiv.textContent = '';
  };

  const signX = document.querySelector('#sign-x');
  const signO = document.querySelector('#sign-o');
  const toggleGlow = (sign) => {
    let elem = sign === 'X' ? signX : signO;
    elem.toggleAttribute('data-glow');
  };

  const clearGlow = () => {
    [signO, signX].forEach((sign) =>
      sign.hasAttribute('data-glow') ? sign.toggleAttribute('data-glow') : ''
    );
  };

  return {
    fillCell,
    clearCellClasses,
    updateDetails,
    displayResult,
    clearDisplayResult,
    toggleGlow,
    clearGlow,
    totalRounds,
    currentRound,
    scoreO,
    scoreX,
    signX,
    signO,
  };
})();

const rounds = sessionStorage.getItem('numberOfRounds');
const playerOController = sessionStorage.getItem('playerOController');
const playerXController = sessionStorage.getItem('playerXController');
const playerXAILevel = sessionStorage.getItem('playerXAILevel');
const playerOAILevel = sessionStorage.getItem('playerOAILevel');
const playerX = Player('X', playerXController, playerXAILevel);
const playerO = Player('O', playerOController, playerOAILevel);
Game.play(rounds);
