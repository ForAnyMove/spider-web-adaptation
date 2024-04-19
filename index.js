import { Items, locales } from './src/scripts/statics/staticValues.js';
import { inDayGameCount } from './src/scripts/ingameDayCounter.js';
import {
  dailyRewards,
  isCompleted,
  tryCompleteDailyReward,
} from './src/scripts/dailyRewards.js';
import { showRewarded } from './src/scripts/sdk/sdk.js';
import('./src/scripts/rewardReceiverView.js');

import DirectionalInput from './src/scripts/directionInput.js';
import DynamicFontChanger from './src/localization/dynamicFontChanger.js';
import { getInputElements } from './src/scripts/helpers.js';
import { BackActionHandler, Screen, StackNavigation } from './src/scripts/navigation/navigation.js';

const defaultSelectedButton = document.getElementsByClassName('main-panel-btn-1')[0];
input ??= new DirectionalInput({ element: defaultSelectedButton });
const dynamicFontChanger = new DynamicFontChanger();

const navigation = new StackNavigation();

const dailyRewardsScreen = new Screen({
  element: document.getElementById('daily-bonuses'),
  openButtons: [document.getElementById('daily-btn')],
  closeButtons: [document.getElementById('close-popup-daily')],
  onFocus: () => { input.updateQueryCustom(getInputElements(dailyRewardsScreen.element, { classNames: ['booster', 'close-popup', 'special-booster'], tags: ['button'] }), { element: dailyRewardsScreen.closeButtons[0] }); },
  onUnfocus: () => { input.updateQuery(); input.select({ element: dailyRewardsScreen.openButtons[0] }); }
});

const bonusesScreen = new Screen({
  element: document.getElementById('regular-bonuses'),
  openButtons: [document.getElementById('regular-btn')],
  closeButtons: [document.getElementById('close-popup-regular')],
  onFocus: () => { input.updateQueryCustom(getInputElements(bonusesScreen.element, { classNames: ['close-popup'], tags: ['button'] }), { element: bonusesScreen.closeButtons[0] }); },
  onUnfocus: () => { input.updateQuery(); input.select({ element: bonusesScreen.openButtons[0] }); }
});

const settingsScreen = new Screen({
  element: document.getElementById('settings'),
  openButtons: [document.getElementById('settings-btn')],
  closeButtons: [document.getElementById('close-popup-settings')],
  onFocus: () => { input.updateQueryCustom(getInputElements(settingsScreen.element, { classNames: ['close-popup'], tags: ['button'] }), { element: settingsScreen.closeButtons[0] }) },
  onUnfocus: () => { input.updateQuery(); input.select({ element: settingsScreen.openButtons[0] }); }
});

const languageScreen = new Screen({
  element: document.getElementById('languages'),
  openButtons: [document.getElementById('lang-btn')],
  closeButtons: [document.getElementById('close-popup-languages')],
  onFocus: () => { input.updateQueryCustom(getInputElements(languageScreen.element, { classNames: ['close-popup', 'language-container'] }), { element: languageScreen.closeButtons[0] }) },
  onUnfocus: () => { }
});

const exitScreen = new Screen({
  element: document.getElementById('exid-game'),
  closeButtons: [document.getElementById('exid-game').getElementsByClassName('exid-no')[0]],
  onFocus: () => {
    const elements = getInputElements(exitScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[1]);
  }, onUnfocus: () => { input.updateQuery(); input.select({ element: defaultSelectedButton }); }
});

const exitButton = exitScreen.element.getElementsByClassName('exid-yes')[0];
if (exitButton != null) {
  exitButton.onclick = function () { SDK?.dispatchEvent(SDK.EVENTS.EXIT); }
}

navigation.registerScreen(dailyRewardsScreen);
navigation.registerScreen(bonusesScreen);
navigation.registerScreen(settingsScreen);
navigation.registerScreen(languageScreen);
navigation.registerScreen(exitScreen);

new BackActionHandler(input, () => {
  navigation.pop();
}, () => {
  navigation.push(exitScreen);
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

function setupLanguageSelector(initialLocale) {
  const selectors = document.getElementsByClassName('language-container');

  const languageSelectorStructs = [];

  for (let i = 0; i < selectors.length; i++) {
    const selector = selectors[i];
    const check = selector.getElementsByClassName('accept-checkbox-icon')[0];

    const selectorStruct = {
      locale: locales[i],
      selector: selector,
      check: check,
      select: () => {
        for (let j = 0; j < languageSelectorStructs.length; j++) {
          const element = languageSelectorStructs[j];
          if (element == selectorStruct) {
            element.check.classList.remove('hidden');
          } else if (!element.check.classList.contains('hidden')) {
            element.check.classList.add('hidden');
          }
        }

        languageChangeEvent.invoke(selectorStruct.locale);
      }
    };

    selector.onclick = () => {
      selectorStruct.select();
    };

    languageSelectorStructs.push(selectorStruct)
  }

  for (let i = 0; i < languageSelectorStructs.length; i++) {
    const element = languageSelectorStructs[i];
    if (element.locale == initialLocale) {
      element.select();
      break;
    }
  }
}

setupDailyRewards();

export { setupLanguageSelector }
import('./src/localization/testingLangChanger.js');