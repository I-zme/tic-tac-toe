const gameBoard = (() => {})();

const Player = (sign, controller = 'human') => {
  let _score = 0;

  const playerBoard = (board) => {
    board.reduce(function (list, cell, index) {
      if (cell === sign) list.push(index);
      return list;
    }, []);
  };

  const updateScore = () => (_score += 1);
  const clearScore = () => (_score = 0);
  const getScore = () => _score;
  return { getScore, updateScore, clearScore };
};

const Game = (() => {
  // variables
  //   const numberOfRounds = rounds;
  let currentRound = 1;

  //   utility functions
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
  };

  return { checkRows };
})();

console.log(Game.checkRows([0, 1, 4, 6, 5, 3]));
