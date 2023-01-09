const yesPlayBtn = document.querySelector('#yes-play'); //probably unncessary
const noPlayBtn = document.querySelector('#no-play'); //choose functionality
const numRounds = document.querySelector('#select-rounds');
const customRounds = document.querySelector('#cutsom-rounds');
const customRoundsDiv = document.querySelector('.custom-container');

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
  const _getBtnValue = (btns, defaultValue) => {
    return _findCheckedRadioBtn(btns)
      ? _findCheckedRadioBtn(btns).value
      : defaultValue;
  };

  const playerXController = _getBtnValue(playerXControllerBtns, 'human');
  const playerOController = _getBtnValue(playerOControllerBtns, 'human');
  sessionStorage.setItem('numberOfRounds', rounds);
  sessionStorage.setItem('playerXController', playerXController);
  sessionStorage.setItem('playerXController', playerOController);
  location.href = './game.html';
});
