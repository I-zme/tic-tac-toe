const yesPlayBtn = document.querySelector('#yes-play'); //probably unncessary
const noPlayBtn = document.querySelector('#no-play'); //choose functionality
const numRounds = document.querySelector('#select-rounds');
const customRounds = document.querySelector('#cutsom-rounds');

const playerXControllerBtns = document.querySelectorAll(
  '[name="choose-controller-x"]'
);
const playerOControllerBtns = document.querySelectorAll(
  '[name="choose-controller-o"]'
);

const playGame = document.querySelector('#start-game-btn');

numRounds.addEventListener('focusout', () => {
  if (numRounds.value === 'custom') {
    customRounds.hasAttribute('disabled')
      ? customRounds.toggleAttribute('disabled')
      : '';
  } else {
    if (!customRounds.hasAttribute('disabled')) {
      customRounds.toggleAttribute('disabled');
      customRounds.value = '';
    }
  }
});

playGame.addEventListener('click', () => {
  const rounds =
    numRounds.value !== 'custom'
      ? Number(numRounds.value) === 0
        ? 1
        : Number(numRounds.value)
      : customRounds.value >= 1
      ? Number(customRounds.value)
      : 1;
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
