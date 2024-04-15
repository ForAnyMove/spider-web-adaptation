import { Items } from './src/scripts/statics/staticValues.js';
import { inDayGameCount } from './src/scripts/ingameDayCounter.js';
import {
  dailyRewards,
  isCompleted,
  tryCompleteDailyReward,
} from './src/scripts/dailyRewards.js';
import { showRewarded } from './src/scripts/sdk/sdk.js';
import('./src/scripts/rewardReceiverView.js');

import DirectionalInput from './src/scripts/directionInput.js';
import { getInputElements } from './src/scripts/helpers.js';

const defaultSelectedButton = document.getElementsByClassName('main-panel-btn-1')[0];
input ??= new DirectionalInput({ element: defaultSelectedButton });

const closeDailyPopupButton = document.getElementById('close-popup-daily');
const dailyBonuses = document.getElementById('daily-bonuses');
const dailyBtn = document.getElementById('daily-btn');

dailyBtn.addEventListener('click', () => {
  dailyBonuses.style.display = 'flex';

  input.updateQueryCustom(getInputElements(dailyBonuses, { classNames: ['booster', 'close-popup', 'special-booster'], tags: ['button'] }), { element: closeDailyPopupButton });
});

closeDailyPopupButton.addEventListener('click', function () {
  dailyBonuses.style.display = 'none';

  input.updateQuery();
  input.select({ element: defaultSelectedButton });
});

const closeRegularPopupButton = document.getElementById('close-popup-regular');
const regularBonuses = document.getElementById('regular-bonuses');
const regularBtn = document.getElementById('regular-btn');

regularBtn.addEventListener('click', () => {
  regularBonuses.style.display = 'flex';

  input.updateQueryCustom(getInputElements(regularBonuses, { classNames: ['close-popup'], tags: ['button'] }), { element: closeRegularPopupButton });
});

closeRegularPopupButton.addEventListener('click', function () {
  regularBonuses.style.display = 'none';

  input.updateQuery();
  input.select({ element: defaultSelectedButton });
});

const closeSettingsPopupButton = document.getElementById(
  'close-popup-settings'
);
const settingsBonuses = document.getElementById('settings');
const settingsBtn = document.getElementById('settings-btn');

settingsBtn.addEventListener('click', () => {
  settingsBonuses.style.display = 'flex';

  input.updateQueryCustom(getInputElements(settingsBonuses, { classNames: ['close-popup'], tags: ['button'] }), { element: closeSettingsPopupButton });
});

closeSettingsPopupButton.addEventListener('click', function () {
  settingsBonuses.style.display = 'none';

  input.updateQuery();
  input.select({ element: defaultSelectedButton });
});

function setupReqularBonusesButtons() {
  const itemCountPairs = [
    { item: Items.Energy, count: 5 },
    { item: Items.BoosterHint, count: 4 },
    { item: Items.BoosterMage, count: 2 },
    { item: Items.BoosterUndo, count: 5 },
    { item: Items.BoosterTime, count: 1 },
  ];

  const buttons = document
    .getElementsByClassName('regular-boosters-container')[0]
    .getElementsByClassName('start-level-btn');

  for (let i = 0; i < buttons.length; i++) {
    const button = buttons[i];
    button.onclick = function () {
      showRewarded(
        null,
        null,
        () => user.addItem(itemCountPairs[i].item, itemCountPairs[i].count, { isTrue: true, isMonetized: false }),
        null
      );
    };
  }
}
setupReqularBonusesButtons();

const dayInGame = inDayGameCount();

function setupDailyRewards() {
  const commonDays = document
    .getElementsByClassName('daily-boosters-container')[0]
    .getElementsByClassName('booster');
  const allDays = [];

  for (let i = 0; i < commonDays.length; i++) {
    const element = commonDays[i];
    allDays.push(element);
  }

  allDays.push(document.getElementsByClassName('special-booster')[0]);

  for (let i = 0; i < allDays.length; i++) {
    const element = allDays[i];

    if (isCompleted(i)) {
      element.classList.add('completed');
      continue;
    }

    if (dayInGame - 1 >= i) {
      // dailyBonuses.style.display = 'flex'; // if tutorial popup was showen and just once per session
      element.classList.add('ready');
      element.onclick = function () {
        if (tryCompleteDailyReward(i)) {
          element.classList.remove('ready');
          element.classList.add('completed');

          if (typeof dailyRewards[i].item == 'object') {
            const items = [];
            for (let j = 0; j < dailyRewards[i].item.length; j++) {
              const element = dailyRewards[i].item[j];
              items.push({ type: element.item, count: element.count })
            }
            user.addItems(items, { isTrue: true, isMonetized: true });
          } else {
            user.addItem(dailyRewards[i].item, dailyRewards[i].count, { isTrue: true, isMonetized: true });
          }
        }
      };
    }
  }
}


setupDailyRewards();
