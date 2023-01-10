const numRounds = document.querySelector('#select-rounds');
const customRounds = document.querySelector('#cutsom-rounds');
const customRoundsDiv = document.querySelector('.custom-container');

const playerXAILevelBtns = document.querySelectorAll('[name="choose-level-x"]');
const playerOAILevelBtns = document.querySelectorAll('[name="choose-level-o"]');

const playerXControllerBtns = document.querySelectorAll(
  '[name="choose-controller-x"]'
);
const playerOControllerBtns = document.querySelectorAll(
  '[name="choose-controller-o"]'
);

const playGame = document.querySelector('#start-game-btn');

numRounds.addEventListener('focusout', () => {
  if (numRounds.value === 'custom') {
    customRoundsDiv.hasAttribute('data-visible')
      ? ''
      : customRoundsDiv.toggleAttribute('data-visible');
  } else {
    if (customRoundsDiv.hasAttribute('data-visible')) {
      customRoundsDiv.toggleAttribute('data-visible');
      customRounds.value = '';
    }
  }
});

// [playerOControllerBtns, playerXControllerBtns].forEach((playerBtns) => {
//   playerBtns.pa.addEventListener('click', () => {
//     if (playerBtns.value === 'ai') {
//       console.log(playerBtns.closest('.choose-controller').parentNode);
//     }
//   });
// });

[playerOControllerBtns, playerXControllerBtns].forEach((playerBtns) => {
  playerBtns[0].closest('.choose-controller').addEventListener('click', () => {
    let mybtn = Array.from(playerBtns).find((item) => item.checked);
    let levelDiv = playerBtns[0]
      .closest('.player-container')
      .querySelector('.choose-ai-level');
    if (mybtn.value === 'ai') {
      levelDiv.hasAttribute('data-visible')
        ? ''
        : levelDiv.toggleAttribute('data-visible');
    } else if (mybtn.value === 'human') {
      levelDiv.hasAttribute('data-visible')
        ? levelDiv.toggleAttribute('data-visible')
        : '';
    }
  });
});

playGame.addEventListener('click', () => {
  const defaultNumberOfRounds = 3;
  const rounds =
    numRounds.value !== 'custom'
      ? Number(numRounds.value) === 0
        ? defaultNumberOfRounds
        : Number(numRounds.value)
      : customRounds.value >= 1
      ? Number(customRounds.value)
      : defaultNumberOfRounds;
  const _findCheckedRadioBtn = (btns) => {
    return Array.from(btns).find((item) => item.checked);
  };

  const playerOController = _findCheckedRadioBtn(playerOControllerBtns).value;
  const playerXController = _findCheckedRadioBtn(playerXControllerBtns).value;
  const playerOAILevel = _findCheckedRadioBtn(playerOAILevelBtns).value;
  const playerXAILevel = _findCheckedRadioBtn(playerXAILevelBtns).value;

  console.log(playerOAILevel, playerXAILevel);
  sessionStorage.setItem('numberOfRounds', rounds);
  sessionStorage.setItem('playerXController', playerXController);
  sessionStorage.setItem('playerOController', playerOController);
  sessionStorage.setItem('playerOAILevel', playerOAILevel);
  sessionStorage.setItem('playerXAILevel', playerXAILevel);
  location.href = './game.html';
});
