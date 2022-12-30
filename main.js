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

  return { getSign, updateBoard, getBoard, clearBoard };
};

// const rounds = 5;
const playerX = Player('X');
const playerO = Player('O');

const Round = () => {
  const play = (winner = playerX, looser = playerO) => {
    [winner, looser].forEach((player) => player.clearBoard());
    gameBoard.clearBoard();

    round: for (let i = 0; i < 9; i++) {
      let player;
      if (i % 2 === 0) {
        player = looser;
      } else {
        player = winner;
      }
      let index = prompt('enter location');
      gameBoard.updateBoard(index, player.getSign());
      console.log(gameBoard.getBoard());

      player.updateBoard(Number(index));
      if (i >= 4) {
        let tempBoard = player.getBoard();
        if (checkRows(tempBoard)) {
          winner = player;
          return winner;
        }
      }
    }
    return (winner = 0); //0 means draw, no winner
  };

  const difference = (array) => {
    [a, b, c] = array.sort();
    return c - b === b - a ? c - b : 0;
  };
  const sum = (array) => array.reduce((sum, num) => (sum += num), 0);
  const isWinningRow = function (array) {
    const arrDiff = difference(array);
    if (arrDiff) {
      const arrSum = sum(array);
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
        if (isWinningRow(tempArray)) return tempArray;
      }
    }
    return false;
  };

  return { play, checkRows, isWinningRow };
};

// function evalPlayerMove(player) {
//   if (checkRows(player.getBoard())) {
//     player.updateScore;
//     winner = player;
//     break innerRound;
//   }
// }

const Game = ((rounds = 2) => {
  // variables
  //   const numberOfRounds = rounds;
  let _score = { X: 0, O: 0 };

  const updateScore = (winner) => (_score[winner] += 1);
  const clearScore = () => (_score = 0);
  const getScore = () => _score;

  const play = () => {
    let winner;
    let looser;
    let newRound = Round();
    for (let currentRound = 1; currentRound <= rounds; currentRound++) {
      //   [winner, looser] =
      //     currentRound === 1 ? newRound.play() : newRound.play(winner, looser);
      winner =
        currentRound === 1 ? newRound.play() : newRound.play(winner, looser);
      if (winner) {
        looser = winner == playerX ? playerO : playerX;
        console.log(winner.getSign() + ' won', looser.getSign() + ' lost');
        updateScore(winner.getSign());
      } else {
        console.log("it's a draw");
      }
    }
  };

  return { updateScore, getScore, play };
})();
