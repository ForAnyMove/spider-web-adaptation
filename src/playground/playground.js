import { animator } from "../scripts/animator.js";
import { useHintBooster, useMageBooster, useUndoBooster } from "../scripts/boosters.js";
import { cardCollector } from "../scripts/cardsCollector.js";
import { createTweener } from "../scripts/dotween/dotween.js";
import { CanInteract, disableInteractions, enableInteractions } from "../scripts/globalEvents.js";
import { createElement, createImage, createTextSpan, getElements, getIconByItem, getInputElements, secondsToTime } from "../scripts/helpers.js";
import { createLevel, createSolitaireLevel } from "../scripts/levelCreator.js";
import { ContentType, Pattern, SuitMode } from "../scripts/statics/enums.js";
import { Content, Items, Platform, locales } from "../scripts/statics/staticValues.js";
import { stepRecorder } from "../scripts/stepRecorder.js";

import { fourSuitSpider, fourSuitSpiderLady, oneSuitSpider, oneSuitSpiderLady, selectedRules, twoSuitSpider, twoSuitSpiderLady } from "../scripts/rules/gameRules.js";
import { getBackgroundImage } from "../scripts/data/card_skin_database.js";
import { trialLevelDatabase, storyLevelDatabase } from "../scripts/data/level_databases.js";
import { SolitaireCardColumn } from "../scripts/cardModel.js";
import { completeLevel, completeMode, failLevel, failMode, startLevel } from "../scripts/levelStarter.js";
import { showInterstitial, showRewarded } from "../scripts/sdk/sdk.js";
import DirectionalInput from "../scripts/directionInput.js";
import { StackNavigation, Screen, BackActionHandler } from "../scripts/navigation/navigation.js";
import DynamicFontChanger from "../localization/dynamicFontChanger.js";

input = new DirectionalInput({ element: null });

const navigation = new StackNavigation();

const settingsScreen = new Screen({
  element: document.getElementById('settings'),
  openButtons: getElements(document, { classNames: ['settings-button'] }),
  closeButtons: [document.getElementById('close-popup-settings')],
  onFocus: () => {
    input.updateQueryCustom(getInputElements(settingsScreen.element, { tags: ['button'] }).concat({ element: settingsScreen.closeButtons[0] }), { element: settingsScreen.closeButtons[0] });
  }, onUnfocus: () => {
    const elements = getInputElements(menuScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[0])
  }
});

const languageScreen = new Screen({
  element: document.getElementById('languages'),
  openButtons: [document.getElementById('lang-btn')],
  closeButtons: [document.getElementById('close-popup-languages')],
  onFocus: () => {
    input.updateQueryCustom(getInputElements(languageScreen.element, { classNames: ['language'] }).concat({ element: languageScreen.closeButtons[0] }), { element: languageScreen.closeButtons[0] });
  }, onUnfocus: () => {
    input.updateQueryCustom(getInputElements(settingsScreen.element, { tags: ['button'] }).concat({ element: settingsScreen.closeButtons[0] }), { element: settingsScreen.closeButtons[0] });
  }
});

const menuScreen = new Screen({
  element: document.getElementById('menu'),
  onFocus: () => {
    const elements = getInputElements(menuScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[0]);
  }, onUnfocus: () => { input.loadFromSavedPull('ingame'); }
});

const exitScreen = new Screen({
  element: document.getElementById('exid-game'),
  closeButtons: [document.getElementById('exid-game').getElementsByClassName('exid-no')[0]],
  onFocus: () => {
    const elements = getInputElements(exitScreen.element, { tags: ['button'] });
    input.updateQueryCustom(elements, elements[1]);

  }, onUnfocus: () => {
    input.loadFromSavedPull('ingame');
  }
});

const exitButton = exitScreen.element.getElementsByClassName('exid-yes')[0];
if (exitButton != null) {
  exitButton.onclick = function () { SDK?.dispatchEvent(SDK.EVENTS.EXIT); }
}

navigation.registerScreen(settingsScreen);
navigation.registerScreen(languageScreen);
navigation.registerScreen(menuScreen);
navigation.registerScreen(exitScreen);

new BackActionHandler(input,
  () => {
    if (navigation.openedScreens.length == 0) {
      navigation.push(menuScreen);
    } else {
      navigation.pop();
    }
  },
  () => {
    navigation.push(exitScreen);
  });

let timer = 0;

showInterstitial();

const hintButtons = document.getElementsByClassName('hint-button');
const mageButtons = document.getElementsByClassName('mage-button');
const undoButtons = document.getElementsByClassName('undo-button');
const timeButtons = document.getElementsByClassName('time-button');

const screenParameters = { rules: oneSuitSpider, decksToWin: 8, onWinCallback: null, onLoseCallback: null, isSolitaire: false, onRestart: null, time: -1 };

function trySelectLevel() {
  const levelTypesList = [
    'level_def_s_',
    'level_def_sl_',
    'level_story_',
    'level_trial_'
  ]
  const urlParams = new URLSearchParams(window.location.search);
  const levelID = urlParams.get('levelID');
  if (levelID == null) return;

  const type = levelID.substring(0, levelID.lastIndexOf('_') + 1);
  const number = parseInt(levelID.substring(type.length, levelID.length));

  function removeBoosters() {
    for (let i = mageButtons.length - 1; i >= 0; i--) {
      const element = mageButtons[i];
      if (element) { element.remove(); }
    }
    for (let i = undoButtons.length - 1; i >= 0; i--) {
      const element = undoButtons[i];
      if (element) { element.remove(); }
    }
    for (let i = timeButtons.length - 1; i >= 0; i--) {
      const element = timeButtons[i];
      if (element) { element.remove(); }
    }
  }

  switch (type) {
    case levelTypesList[0]:
      console.log("Selected [Spider]");
      switch (number) {
        case 1:
          screenParameters.rules = oneSuitSpider;
          break;
        case 2:
          screenParameters.rules = twoSuitSpider;
          break;
        case 4:
          screenParameters.rules = fourSuitSpider;
          break;
      }
      screenParameters.decksToWin = 8;
      screenParameters.onWinCallback = () => {
        completeMode(screenParameters.rules.rule);
      };
      screenParameters.onLoseCallback = () => {
        failMode(screenParameters.rules.rule);
      }
      removeBoosters();
      break
    case levelTypesList[1]:
      console.log("Selected [Spider Lady]");
      switch (number) {
        case 1:
          screenParameters.rules = oneSuitSpiderLady;
          break;
        case 2:
          screenParameters.rules = twoSuitSpiderLady;
          break;
        case 4:
          screenParameters.rules = fourSuitSpiderLady;
          break;
      }
      screenParameters.decksToWin = 4;
      screenParameters.onWinCallback = () => {
        completeMode(screenParameters.rules.rule);
      };
      screenParameters.onLoseCallback = () => {
        failMode(screenParameters.rules.rule);
      }
      removeBoosters();
      break
    case levelTypesList[2]:
      console.log("Selected [Story]");
      const storyLevel = storyLevelDatabase.levels[number];

      switch (storyLevel.gameRule.Pattern) {
        case Pattern.Spider:
          screenParameters.decksToWin = 8;
          switch (storyLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpider;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpider;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpider;
              break
          }
          break;
        case Pattern.SpiderLady:
          screenParameters.decksToWin = 4;
          switch (storyLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpiderLady;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpiderLady;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpiderLady;
              break
          }
          break;
      }
      screenParameters.isSolitaire = true;

      screenParameters.onWinCallback = () => {
        completeLevel();
      };
      screenParameters.onLoseCallback = () => {
        failLevel();
      }
      startLevel(storyLevelDatabase);
      break
    case levelTypesList[3]:
      console.log("Selected [Trial]");

      const trialLevel = trialLevelDatabase.levels[number];
      switch (trialLevel.gameRule.Pattern) {
        case Pattern.Spider:
          switch (trialLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpider;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpider;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpider;
              break
          }
          break;
        case Pattern.SpiderLady:
          switch (trialLevel.gameRule.SuitMode) {
            case SuitMode.OneSuit:
              screenParameters.rules = oneSuitSpiderLady;
              break
            case SuitMode.TwoSuits:
              screenParameters.rules = twoSuitSpiderLady;
              break
            case SuitMode.FourSuits:
              screenParameters.rules = fourSuitSpiderLady;
              break
          }
          break;
      }

      screenParameters.decksToWin = trialLevel.trial.decksToComplete;
      screenParameters.time = trialLevel.time;

      startTimer(trialLevel.time);

      screenParameters.onWinCallback = () => {
        completeLevel();
      };
      screenParameters.onLoseCallback = () => {
        failLevel();
      }
      startLevel(trialLevelDatabase);
      screenParameters.onRestart = () => startTimer(trialLevel.time);
      break
  }
}

trySelectLevel();

function startTimer(seconds) {
  let container = document.getElementsByClassName('header-timer hidden')[0];
  if (container != null) {
    container.classList.remove('hidden');
  } else {
    container = document.getElementsByClassName('header-timer')[0];
  }

  const textAttribute = container.getElementsByTagName('span')[0] ?? document.createElement('span');
  textAttribute.classList.add('counter-text');
  container.appendChild(textAttribute);

  timer = seconds;

  let lastSecond = 0;
  function request(dt) {
    timer -= dt * 60 / 1000;

    const second = Math.floor(timer);
    if (lastSecond != second) {
      lastSecond = second;
      textAttribute.innerText = secondsToTime(second);

      if (second <= 0) {
        levelLostFlow();
        animator.removeRequest(request);
      }
    }
  }

  animator.addRequest(request);
}

function checkAndMakeSpiderLadyPatternView() {
  if (screenParameters.rules.pattern == Pattern.SpiderLady) {
    const playableCardColumns = document.getElementsByClassName('playable-card-column');
    const collectableCardColumns = document.getElementsByClassName('cards-container');

    for (let i = playableCardColumns.length - 1; i >= 0; i--) {
      if (i == 6) break;
      const element = playableCardColumns[i];
      document.getElementsByClassName('active-cards-zone')[0].removeChild(element);
    }

    for (let i = collectableCardColumns.length - 1; i >= 0; i--) {
      if (i == 3) break;
      const element = collectableCardColumns[i];

      if (i > 5) {
        document.getElementsByClassName('bottom-cards-zone')[0].removeChild(element);
        continue;
      }
      element.classList.add('hidden');
    }

    const main = document.getElementsByTagName('main')[0];
    if (main) {
      // main.style.width = '48vw';
    }
    setSpiderLadyStyles()
  }
}

function setSpiderLadyStyles() {
  const styleElement = document.createElement('style');
  styleElement.textContent = `
  @media only screen and (orientation: portrait) {
    .active-cards-container,
    .cards-container,
    .extra-cards-container,
    .card-element,
    .test-card {
      width: 13.5vw;
      height: 18vw;
    }
    .active-cards-zone,
    .bottom-cards-zone {
      column-gap: 0;
    }
    .bottom-cards-zone:last-child {
      transform: translate(-3%);
    }
    .active-cards-container > .card-element.closed:not(:first-child),
    .active-cards-container > .card-element.first:not(:first-child),
    .active-cards-container > .card-element.opened:not(:first-child),
    .active-cards-container > .card-element.locked:not(:first-child) {
      margin-top: -11.5vw;
    }
    .active-cards-container > .card-element.opened:not(:first-child),
    .active-cards-container > .card-element.first:not(:first-child),
    .active-cards-container > .card-element.locked:not(:first-child) {
      margin-top: -10vw;
    }
    .active-cards-container > .card-element.locked:not(:first-child) {
      margin-top: -12.6vw;
    }
    .bottom-cards-zone>.cards-container {
      transform: translate(15%);
    }
    .bottom-cards-zone>.extra-cards-container {
      transform: translate(200%);
    }
  }
`;
  document.head.appendChild(styleElement);
}

checkAndMakeSpiderLadyPatternView();

let result = null;

function startCurrentLevel() {
  const cards = document.getElementsByClassName('card-element');

  for (let i = cards.length - 1; i >= 0; i--) {
    const element = cards[i];
    if (element.classList.contains('sol-slot')) continue;
    element.remove();
  }

  createTweener();
  animator.reset();
  stepRecorder.reset();
  result = screenParameters.isSolitaire ? createSolitaireLevel({ rules: screenParameters.rules }) : createLevel({ rules: screenParameters.rules });
  screenParameters.onRestart?.();

  stepRecorder.stepRecordedEvent.addListener(updateStepText);
  updateStepText(0);

  if (screenParameters.isSolitaire) {
    setupSolitaireLevel();
  } else {
    setupDefaultLevel();
  }

  tryCloseLoseScreen();
}

startCurrentLevel();

function setupDistribution() {
  function distributeDefault() {
    if (result.croupier != null) {
      result.croupier.ingameDistribution();
    }
  }

  // extra-cards-container
  document.getElementById('extra-cards-container').onclick = function () {
    distributeDefault();
  }
}

function setupBackgroundChange() {

  const backgroundImage = document.getElementById('background');

  let usedBackground = user.getContentOfType(ContentType.Background) ?? Content.Background01;

  backgroundImage.style.backgroundImage = getBackgroundImage(usedBackground);

  user.contentUsageChanged.addListener(() => {
    const background = user.getContentOfType(ContentType.Background);

    if (background == usedBackground) return;

    usedBackground = background;
    backgroundImage.style.backgroundImage = getBackgroundImage(usedBackground);
  });
}

function setupButtons() {
  const hintCounters = [];
  for (let i = 0; i < hintButtons.length; i++) {
    const element = hintButtons[i];
    if (element != null) {
      hintCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterHint)) {
          if (useHintBooster(result.playableCardColumns, screenParameters.rules).isTrue) {
            user.removeItem(Items.BoosterHint, 1);
          }
        }
      }
    }
  }
  hintCounters.forEach(element => {
    element.innerText = `x${user.getItemCount(Items.BoosterHint)}`
  });

  const mageCounters = [];
  for (let i = 0; i < mageButtons.length; i++) {
    const element = mageButtons[i];
    if (element != null) {
      mageCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterMage)) {
          if (useMageBooster(result.mainCardColumn, result.playableCardColumns, screenParameters.rules).isTrue) {
            user.removeItem(Items.BoosterMage, 1);
          }
        }
      }
    }
  }
  mageCounters.forEach(element => {
    element.innerText = `x${user.getItemCount(Items.BoosterMage)}`
  });

  const timeCounters = [];
  for (let i = 0; i < timeButtons.length; i++) {
    const element = timeButtons[i];
    if (element != null) {
      timeCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterTime)) {
          timer += 60;

          user.removeItem(Items.BoosterTime, 1);
        }
      }
    }
  }
  timeCounters.forEach(element => {
    element.innerText = `x${user.getItemCount(Items.BoosterTime)}`
  });

  const undoCounters = [];
  for (let i = 0; i < undoButtons.length; i++) {
    const element = undoButtons[i];
    if (element != null) {
      undoCounters.push(element.getElementsByTagName('span')[0]);
      element.onclick = function () {
        if (user.hasItems(Items.BoosterUndo)) {
          if (useUndoBooster()) {
            user.removeItem(Items.BoosterUndo, 1);
          }
        }
      }
    }
  }
  undoCounters.forEach(element => {
    element.innerText = `x${user.getItemCount(Items.BoosterTime)}`
  });

  user.itemListUpdateEvent.addListener(() => {
    if (hintCounters.length > 0) {
      hintCounters.forEach(element => {
        element.innerText = `x${user.getItemCount(Items.BoosterHint)}`
      });
    }
    if (mageCounters.length > 0) {
      mageCounters.forEach(element => {
        element.innerText = `x${user.getItemCount(Items.BoosterMage)}`
      });
    }
    if (timeCounters.length > 0) {
      timeCounters.forEach(element => {
        element.innerText = `x${user.getItemCount(Items.BoosterTime)}`
      });
    }
    if (undoCounters.length > 0) {
      undoCounters.forEach(element => {
        element.innerText = `x${user.getItemCount(Items.BoosterTime)}`
      });
    }
  })

  const restartButtons = document.getElementsByClassName('reset-level-button');
  for (let i = 0; i < restartButtons.length; i++) {
    const element = restartButtons[i];

    element.onclick = function () {
      if (!CanInteract) return;

      startCurrentLevel();
      navigation.pop();
    }
  }

  const continueButton = document.getElementsByClassName('next-ads-btn')[0];

  if (continueButton != null) {
    continueButton.onclick = function () {
      showRewarded(null, null, () => {
        tryCloseLoseScreen();
        startTimer(screenParameters.time);

        enableInteractions();
      }, null);
    }
  }
}

function checkIfLevelWon(options) {

  if (options.collectedCount >= screenParameters.decksToWin) {
    const winScreen = document.getElementById('win-screen-popup');

    winScreen.classList.add('visible');
    winScreen.classList.remove('hidden-popup');
  }
}

function showLoseScreen() {
  const loseScreen = document.getElementById('lose-screen-popup');

  loseScreen.classList.add('visible');
  loseScreen.classList.remove('hidden-popup');
}

function tryCloseLoseScreen() {
  const loseScreen = document.getElementById('lose-screen-popup');

  loseScreen.classList.remove('visible');
  if (!loseScreen.classList.contains('hidden-popup')) {
    loseScreen.classList.add('hidden-popup');
  }
}

function levelLostFlow() {
  disableInteractions();

  showLoseScreen();
}

function updateStepText(stepCount) {
  document.getElementById('step-counter').innerText = stepCount;
}

function setupDefaultLevel() {
  setupDistribution();
  setupButtons();
  stepRecorder.stepRecordedEvent.addListener(updateStepText);

  const buttonContainers = document.getElementsByClassName('footer-control-panel');
  for (let i = 0; i < buttonContainers.length; i++) {
    const element = buttonContainers[i];
    element.classList.remove('hidden');
  }
}

function setupSolitaireLevel() {
  const buttonContainers = document.getElementsByClassName('footer-control-panel');
  for (let i = 0; i < buttonContainers.length; i++) {
    const element = buttonContainers[i];
    if (!element.classList.contains('hidden')) {
      element.classList.add('hidden');
    }
  }

  const solitaireSlots = document.getElementsByClassName('sol-slot');

  const cardColumns = [];

  for (let i = 0; i < solitaireSlots.length; i++) {
    {
      const element = solitaireSlots[i];
      const elementNumer = parseInt(element.id.substring(element.id.lastIndexOf('-') + 1, element.id.lastIndexOf('-') + 3));
      let overlapArray = null;

      if (element.id.includes('<')) {
        let arrayText = element.id.substring(element.id.indexOf('['), element.id.indexOf(']') + 1);
        arrayText = arrayText.replace(' ', '').replace('[0', '[').replace(',0', ',');
        overlapArray = JSON.parse(arrayText);
      }

      const cardColumn = new SolitaireCardColumn(element, elementNumer, overlapArray, element.classList.contains('closed'));
      cardColumns.push(cardColumn);
    }
  }

  result.croupier.onDistributionFinished.addListener(() => {
    result.croupier.onDistributionFinished.removeAllListeners();
    let unlockedCount = 0;

    for (let i = 0; i < result.playableCardColumns.length; i++) {
      const element = result.playableCardColumns[i];
      element.cardAddedEvent.addListener(() => {
        unlockedCount++;
        if (unlockedCount == result.playableCardColumns.length) {
          setupDefaultLevel();

          for (let j = 0; j < result.playableCardColumns.length; j++) {
            const element = result.playableCardColumns[j];
            element.setCanRemove();
            element.setCanPlace();
          }
        }
      });
      element.lock();
    }

    function transitionFinishedCallback() {
      for (let i = 0; i < cardColumns.length; i++) {
        const column = cardColumns[i];

        if (column.overlapArray == null) continue;
        for (let j = 0; j < cardColumns.length; j++) {
          if (i == j) continue;
          const other = cardColumns[j];

          if (column.overlapArray.includes(other.number)) {
            column.addOverlapColumns(other);
          }
        }
      }
    }

    for (let i = 0; i < cardColumns.length; i++) {
      const column = cardColumns[i];
      const card = result.solitaireCards[i];

      column.translateCardsToColumn([card], () => {
        if (i == 0) {
          transitionFinishedCallback();
        }
        if (column.isClosed) {
          card.close();
        } else {
          card.open();
        }
      })
    }
  })
}

function createRewardView(data) {
  const container = createElement('div', ['bounty'], { scale: 1, marginLeft: '1vh', marginRight: '1vh' });
  {
    createImage(['bounty-icon'], null, container, getIconByItem(data.type));
    if (data.count > 1) createTextSpan(['bounty-title'], null, container, `x${data.count}`);
  }

  return container;
}

user.onItemsPublicReceive.addListener((data) => {
  const { items } = data;
  const parent = document.getElementById('win-screen-rewards');

  for (let i = 0; i < items.length; i++) {
    const element = items[i];
    parent.appendChild(createRewardView(element));
  }
});

updateStepText(0);
setupBackgroundChange();
cardCollector.onCollected.addListener(checkIfLevelWon);

if (platform == Platform.TV) {
  result.croupier.onDistributionFinished.addListener(() => {
    const selectables = [];

    for (let i = 0; i < result.playableCardColumns.length; i++) {
      const element = result.playableCardColumns[i];
      const selectable = {
        customData: {
          selectedLevel: 1, clearAllSelection: () => {
            const cards = element.getRangeFromEnd(selectable.customData.selectedLevel, false).reverse();
            for (let i = 0; i < cards.length - 1; i++) {
              const element = cards[i];
              element.domElement.classList.remove('selected-card');

            }
            selectable.customData.selectedLevel = 1;
          }
        },
        element: element.domElement,
        onLeft: () => {
          selectable.customData.clearAllSelection();
        },
        onRight: () => {
          selectable.customData.clearAllSelection();
        },
        onSubmit: () => {
          const cards = element.getRangeFromEnd(selectable.customData.selectedLevel, false).reverse();
          if (cards != null && cards.length > 0) {
            cards[0].domElement.click();
          }
        },
        onUp: () => {
          const cards = element.getRangeFromEnd(selectable.customData.selectedLevel + 1, false).reverse();
          if (selectedRules.isCanRemove(cards)) {
            cards[0].domElement.classList.add('selected-card');
            selectable.customData.selectedLevel++;

            return { preventDefault: true }
          }
        },
        onDown: () => {
          if (selectable.customData.selectedLevel > 1) {
            const cards = element.getRangeFromEnd(selectable.customData.selectedLevel, false).reverse();
            cards[0].domElement.classList.remove('selected-card');
            selectable.customData.selectedLevel--;

            return { preventDefault: true }
          }
        },
      };

      selectables.push(selectable);
    }

    selectables.push({
      element: result.mainCardColumn.domElement, onSubmit: () => {
        for (let i = 0; i < input.selectableElements.length; i++) {
          const element = input.selectableElements[i];
          if (element.customData != null) {
            element.customData.clearAllSelection();
          }
        }
      }
    })

    input.saveSelectableState('ingame', selectables, selectables[0]);
    input.updateQueryCustom(selectables, selectables[0])
  });
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
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const isTutorial = params.get('isTutorial');
const tutorialTab = document.getElementById('tutorial')
if (isTutorial) {
  tutorialTab.style.display = 'flex'
}
const tutorialScreens = Array.from(document.getElementsByClassName('tutorial-screen'))
const nextTutorialScreenBtn = document.getElementById('next-tutorial-screen-btn')
let tutorialStep = 0;
nextTutorialScreenBtn.addEventListener('click', () => {
  if (tutorialStep < 6) {
    tutorialScreens[tutorialStep].style.display = 'none'
    tutorialStep++
    tutorialScreens[tutorialStep].style.display = 'flex'
  } else {
    tutorialTab.style.display = 'none'
    window.location.href = '../../index.html';
  }
})

const skinsCollectionBackBtn = document.getElementById('skins-collection-back-btn')
const skinsCollectionSliderTab = document.getElementById('skins-collection-slider-tab')
skinsCollectionBackBtn.addEventListener('click', () => {
  skinsCollectionSliderTab.style.display = 'none'
})

export { setupLanguageSelector }
import('../localization/testingLangChanger.js');
const dynamicFontChanger = new DynamicFontChanger();