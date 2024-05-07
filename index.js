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
import { BackActionHandler, Screen, ScreenParameters } from './src/scripts/navigation/navigation.js';
import { load, save } from './src/scripts/save_system/SaveSystem.js';

input ??= new DirectionalInput();
const screenParameters = new ScreenParameters();

screenParameters.defaultSelectedElement = { element: document.getElementsByClassName('main-panel-btn-1')[0] };
screenParameters.selectableElements = getInputElements(document.getElementById('main-screen'), { tags: ['button'] })

const mainScreen = new Screen({
  isMain: true,
  style: 'main.css',
  element: document.getElementById('main-screen'),
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(screenParameters.selectableElements, screenParameters.defaultSelectedElement);

    navigation.registerScreen(achievementsScreen);
    navigation.registerScreen(challengesScreen);
    navigation.registerScreen(storyModeScreen);
    navigation.registerScreen(collectionScreen);
    navigation.registerScreen(playgroundScreen);

    navigation.registerScreen(dailyRewardsScreen);
    navigation.registerScreen(bonusesScreen);
    navigation.registerScreen(settingsScreen);
    navigation.registerScreen(languageScreen);
    navigation.registerScreen(exitScreen);
    navigation.registerScreen(tutorialOffsetScreen);

    backActionHandler.onSigleBack = () => {
      navigation.pop();
    };
    backActionHandler.onDoubleBack = () => {
      navigation.push(exitScreen);
    };
  },
  onUnfocus: () => { }
})

const storyModeRoot = document.getElementById('story-mode-screen');
const storyModeScreen = new Screen({
  style: 'src/StoryMode/storyMode.css',
  element: storyModeRoot,
  openButtons: [mainScreen.element.querySelector('#story-mode-switch-btm')],
  closeButtons: [storyModeRoot.getElementsByClassName('main-screen-switch-btn')[0]],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(storyModeScreen.screenParameters.selectableElements,
      storyModeScreen.screenParameters.defaultSelectedElement);

    storyModeScreen.screenParameters.openCallback?.()
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenParameters: storyMode.screenParameters
})

const challengesRoot = document.getElementById('challenges-test-screen');
const challengesScreen = new Screen({
  style: 'test.css',
  element: challengesRoot,
  openButtons: [mainScreen.element.querySelector('#challenges-switch-btn')],
  closeButtons: [challengesRoot.getElementsByClassName('main-screen-switch-btn')[0]],
  onFocus: () => {
    setTimeout(() => {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          dynamicFontChanger.update();
          if (i == 1) {
          }
        }, i * 500)
      }
    }, 100);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  }, screenParameters: challenges.screenParameters
})

const collectionRoot = document.getElementById('collection-screen');
const collectionScreen = new Screen({
  style: 'src/Collection/collection.css',
  element: collectionRoot,
  openButtons: [mainScreen.element.querySelector('#collection-switch-btn')],
  closeButtons: [collectionRoot.getElementsByClassName('main-screen-switch-btn')[0]],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(collectionScreen.screenParameters.selectableElements,
      collectionScreen.screenParameters.defaultSelectedElement);

    setTimeout(() => {
      dynamicFontChanger.updateTextFont();
    }, 100);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  },
  screenParameters: collection.screenParameters
})

const achievementsRoot = document.getElementById('achievements-screen');
const achievementsScreen = new Screen({
  style: 'src/achievements/achievements.css',
  element: achievementsRoot,
  openButtons: [mainScreen.element.querySelector('#achievements-switch-btn')],
  closeButtons: [achievementsRoot.getElementsByClassName('main-screen-switch-btn')[0]],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(achievementsScreen.screenParameters.selectableElements,
      achievementsScreen.screenParameters.defaultSelectedElement);

    setTimeout(() => {
      dynamicFontChanger.updateTextFont();
    }, 100);
  },
  onUnfocus: () => {
    navigation.push(mainScreen);
  }, screenParameters: achievements.screenParameters
})

const playgroundRoot = document.getElementById('playground-screen');
const playgroundScreen = new Screen({
  id: 'playground',
  style: 'src/playground/playground.css',
  element: playgroundRoot,
  onFocus: () => {
    playgroundScreen.screenParameters.openCallback?.();

    dynamicFontChanger.update();
    input.updateQueryCustom([], null);

    setTimeout(() => {
      dynamicFontChanger.updateTextFont();
    }, 100);
  }, onUnfocus: () => {
    navigation.push(mainScreen);
  }, screenParameters: playground.screenParameters
})

const dailyRewardsRoot = document.getElementById('daily-bonuses');
const dailyRewardsScreen = new Screen({
  isPopup: true,
  element: dailyRewardsRoot,
  openButtons: [document.getElementById('daily-btn')],
  closeButtons: [dailyRewardsRoot.querySelector('#close-popup-daily'), dailyRewardsRoot.querySelector('#popup-fade-close')],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(getInputElements(dailyRewardsScreen.element, { classNames: ['booster', 'close-popup', 'special-booster'], tags: ['button'] }), { element: dailyRewardsScreen.closeButtons[0] });
  },
  onUnfocus: () => { input.updateQuery(); input.select({ element: dailyRewardsScreen.openButtons[0] }); }
});

const bonusesRoot = document.getElementById('regular-bonuses');
const bonusesScreen = new Screen({
  isPopup: true,
  element: bonusesRoot,
  openButtons: [document.getElementById('regular-btn')],
  closeButtons: [bonusesRoot.querySelector('#close-popup-regular'), bonusesRoot.querySelector('#popup-fade-close')],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(getInputElements(bonusesScreen.element, { classNames: ['close-popup'], tags: ['button'] }), { element: bonusesScreen.closeButtons[0] });
  },
  onUnfocus: () => {
    input.updateQuery();
    input.select({ element: bonusesScreen.openButtons[0] });
  }
});

const settingsRoot = document.getElementById('settings');
const settingsScreen = new Screen({
  isPopup: true,
  element: settingsRoot,
  openButtons: [document.getElementById('settings-btn')],
  closeButtons: [settingsRoot.querySelector('#close-popup-settings'), settingsRoot.querySelector('#popup-fade-close')],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(getInputElements(settingsScreen.element, { classNames: ['close-popup'], tags: ['button'] }), { element: settingsScreen.closeButtons[0] })
  },
  onUnfocus: () => {
    input.updateQuery();
    input.select({ element: settingsScreen.openButtons[0] });
  }
});

const languageRoot = document.getElementById('languages');
const languageScreen = new Screen({
  isPopup: true,
  element: languageRoot,
  openButtons: [document.getElementById('lang-btn')],
  closeButtons: [languageRoot.querySelector('#close-popup-languages'), languageRoot.querySelector('#popup-fade-close')],
  onFocus: () => {
    dynamicFontChanger.update();
    input.updateQueryCustom(getInputElements(languageScreen.element, { classNames: ['close-popup', 'language-container'] }), { element: languageScreen.closeButtons[0] })
  },
  onUnfocus: () => { }
});

const exitScreen = new Screen({
  isPopup: true,
  element: document.getElementById('exid-game'),
  closeButtons: [document.getElementById('exid-game').getElementsByClassName('exid-no')[0]],
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(exitScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[1]);
  }, onUnfocus: () => { }
});

const tutorialOffsetScreen = new Screen({
  isPopup: true,
  element: document.getElementById('tutorial-offer'),
  closeButtons: [document.getElementById('tutorial-offer').getElementsByClassName('exid-no')[0]],
  onFocus: () => {
    dynamicFontChanger.update();
    const elements = getInputElements(tutorialOffsetScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[0]);
  }, onUnfocus: () => { }
});

const exitButton = exitScreen.element.getElementsByClassName('exid-yes')[0];
if (exitButton != null) {
  exitButton.onclick = function () { SDK?.dispatchEvent(SDK.EVENTS.EXIT); }
}

const tutorialButton = settingsRoot.querySelector('.tutorial-btn');
if (tutorialButton) {
  tutorialButton.onclick = function () {
    navigation.pop();
    levelParameter = `level_def_s_1&isTutorial=true`;
    navigation.createNewRouteFromID('playground');
  }
}

if (load('tutorial-offer', false) == false) {
  tutorialOffsetScreen.element.getElementsByTagName('button')[0].onclick = function () {
    navigation.pop();
    levelParameter = `level_def_s_1&isTutorial=true`;
    navigation.createNewRouteFromID('playground');
  }

  setTimeout(() => { navigation.push(tutorialOffsetScreen) }, 400)
  save('tutorial-offer', true);
}

navigation.push(mainScreen);

backActionHandler = new BackActionHandler(input);

mainMenuNavigateFunction = () => {
  navigation.clear();
  navigation.openedScreens.push(playgroundScreen);
  navigation.pop();
}

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

      audioManager.addClickableToPull(element);
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
    audioManager.addClickableToPull(selector);

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

function setupEnergyView() {
  const elements = document.getElementsByClassName('energy-text');
  const additionalElements = document.getElementsByClassName('challenge-energy-text')

  for (let i = 0; i < elements.length; i++) {
    const element = elements[i];
    if (element != null) {
      element.innerText = user.getItemCount(Items.Energy);

      user.itemListUpdateEvent.addListener(() => {
        element.innerText = user.getItemCount(Items.Energy);
      })
    }
  }

  for (let i = 0; i < additionalElements.length; i++) {
    const element = additionalElements[i];
    if (element != null) {
      element.innerText = user.getItemCount(Items.Energy);

      user.itemListUpdateEvent.addListener(() => {
        element.innerText = user.getItemCount(Items.Energy);
      })
    }
  }
}

setupEnergyView();

function setupBoostersHint() {
  const boostersType = bonusesRoot.querySelectorAll('.booster-type>img');
  const boosterHints = bonusesRoot.querySelectorAll('.booster-type>.booster-prompt-container');

  for (let i = 0; i < boostersType.length; i++) {
    const element = boostersType[i];
    element.onmouseover = () => {
      boosterHints[i].style.display = 'flex';
      dynamicFontChanger.updateContainer(boosterHints[i]);
    };

    element.onmouseout = () => {
      boosterHints[i].style.display = 'none';
    };
  }
}

function setupDefaultLevelTransitions() {
  const structs = [
    {
      button: document.getElementsByClassName('main-panel-btn-1')[0],
      parameter: 'level_def_s_1'
    }, {
      button: document.getElementsByClassName('main-panel-btn-2')[0],
      parameter: 'level_def_s_2'
    }, {
      button: document.getElementsByClassName('main-panel-btn-3')[0],
      parameter: 'level_def_s_4'
    }, {
      button: document.getElementsByClassName('main-panel-btn-4')[0],
      parameter: 'level_def_sl_1'
    }, {
      button: document.getElementsByClassName('main-panel-btn-5')[0],
      parameter: 'level_def_sl_2'
    }, {
      button: document.getElementsByClassName('main-panel-btn-6')[0],
      parameter: 'level_def_sl_4'
    }
  ]

  for (let i = 0; i < structs.length; i++) {
    const struct = structs[i];
    struct.button.onclick = function () {
      levelParameter = struct.parameter;
      navigation.createNewRouteFromID('playground');
    }
  }
}

setupDefaultLevelTransitions();
setupBoostersHint();

setupDailyRewards();

export { setupLanguageSelector }
dynamicFontChanger = new DynamicFontChanger();
