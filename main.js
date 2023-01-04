let rounds;
const yesPlayBtn = document.querySelector('#yes-play'); //probably unncessary
const noPlayBtn = document.querySelector('#no-play'); //choose functionality
const numRounds = document.querySelector('#select-rounds');
const customRounds = document.querySelector('#cutsom-rounds');

const playerXController = document.querySelector(
  '[name="choose-controller-1"]'
);
const playerOController = document.querySelector(
  '[name="choose-controller-2"]'
);

const playGame = document.querySelector('#start-game-btn');

numRounds.addEventListener('focusout', () => {
  if (numRounds.value === 'custom') {
    customRounds.toggleAttribute('disabled');
    customRounds.addEventListener('focusout', (rounds = customRounds.value));
  } else {
    rounds = numRounds.value;
  }
});
