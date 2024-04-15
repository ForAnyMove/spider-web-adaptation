import { Items } from './src/scripts/statics/staticValues.js';
import { inDayGameCount } from './src/scripts/ingameDayCounter.js';
import {
  dailyRewards,
  isCompleted,
  tryCompleteDailyReward,
} from './src/scripts/dailyRewards.js';
import { showInterstitial, showRewarded } from './src/scripts/sdk/sdk.js';

const closeDailyPopupButton = document.getElementById('close-popup-daily');
const dailyBonuses = document.getElementById('daily-bonuses');
const dailyBtn = document.getElementById('daily-btn');

dailyBtn.addEventListener('click', () => {
  dailyBonuses.style.display = 'flex';
});

closeDailyPopupButton.addEventListener('click', function () {
  dailyBonuses.style.display = 'none';
});

const closeRegularPopupButton = document.getElementById('close-popup-regular');
const regularBonuses = document.getElementById('regular-bonuses');
const regularBtn = document.getElementById('regular-btn');

regularBtn.addEventListener('click', () => {
  regularBonuses.style.display = 'flex';
});

closeRegularPopupButton.addEventListener('click', function () {
  regularBonuses.style.display = 'none';
});

const closeSettingsPopupButton = document.getElementById(
  'close-popup-settings'
);
const settingsBonuses = document.getElementById('settings');
const settingsBtn = document.getElementById('settings-btn');

settingsBtn.addEventListener('click', () => {
  settingsBonuses.style.display = 'flex';
});

closeSettingsPopupButton.addEventListener('click', function () {
  settingsBonuses.style.display = 'none';
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
        () => user.addItem(itemCountPairs[i].item, itemCountPairs[i].count),
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
            for (let j = 0; j < dailyRewards[i].item.length; j++) {
              const element = dailyRewards[i].item[j];
              user.addItem(element.item, element.count);
            }
          } else {
            user.addItem(dailyRewards[i].item, dailyRewards[i].count);
          }
        }
      };
    }
  }
}

const bountyPopupTriggerBtnListContainer = document.getElementById('daily-bonuses');
const dailyBountyPopupTriggerBtnList = bountyPopupTriggerBtnListContainer.getElementsByClassName('booster');
const bountyPopup = document.getElementById('bounty-popup');
Array.from(dailyBountyPopupTriggerBtnList).forEach((triggerBtn) => {
  triggerBtn.addEventListener('click', () => {
    bountyPopup.style.display = 'flex';

    setTimeout(function () {
      bountyPopup.classList.remove('hidden-popup');
      bountyPopup.classList.add('visible');
    }, 0);
  });
});

const bountyPopupCloseBtn = document.getElementsByClassName('cancel-bounty-btn')[0]
bountyPopupCloseBtn.addEventListener('click', () => {
  bountyPopup.classList.remove('visible');
  bountyPopup.classList.add('hidden-popup');
  setTimeout(() => {
    bountyPopup.style.display = 'none';
  }, 500); // It have to be thee same delay as in CSS transition rules
})

setupDailyRewards();
