import { animator } from "../scripts/animator.js";
import { useHintBooster, useMageBooster, useUndoBooster } from "../scripts/boosters.js";
import { cardCollector } from "../scripts/cardsCollector.js";
import { createTweener } from "../scripts/dotween/dotween.js";
import { CanInteract, disableInteractions, enableInteractions } from "../scripts/globalEvents.js";
import { createElement, createImage, createTextSpan, getIconByItem, secondsToTime } from "../scripts/helpers.js";
import { createLevel, createSolitaireLevel } from "../scripts/levelCreator.js";
import { ContentType, Pattern, SuitMode } from "../scripts/statics/enums.js";
import { Content, Items, locales } from "../scripts/statics/staticValues.js";
import { stepRecorder } from "../scripts/stepRecorder.js";

import { fourSuitSpider, fourSuitSpiderLady, oneSuitSpider, oneSuitSpiderLady, selectedRules, twoSuitSpider, twoSuitSpiderLady } from "../scripts/rules/gameRules.js";
import { getBackgroundImage } from "../scripts/data/card_skin_database.js";
import { trialLevelDatabase, storyLevelDatabase } from "../scripts/data/level_databases.js";
import { SolitaireCardColumn } from "../scripts/cardModel.js";
import { completeLevel, completeMode, failLevel, failMode, startLevel } from "../scripts/levelStarter.js";
import { showInterstitial, showRewarded } from "../scripts/sdk/sdk.js";
import DirectionalInput from "../scripts/directionInput.js";

input = new DirectionalInput({ element: null });

input.addGlobalKeyHandle('Escape', () => {
  console.log("Try invoke menu");


  // input.backupCurrentState();

});

let timer = 0;

showInterstitial();

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
    document.getElementById('mage-button')?.remove();
    document.getElementById('undo-button')?.remove();
    document.getElementById('time-button')?.remove();
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
  const hintButton = document.getElementById('hint-button');
  let hintCounter = null;
  if (hintButton) {
    hintCounter = hintButton.getElementsByTagName('span')[0];
    hintButton.onclick = function () {
      if (user.hasItems(Items.BoosterHint)) {
        if (useHintBooster(result.playableCardColumns, screenParameters.rules).isTrue) {
          user.removeItem(Items.BoosterHint, 1);
        }
      }
    }
    hintCounter.innerText = `x${user.getItemCount(Items.BoosterHint)}`;
  }


  const mageButton = document.getElementById('mage-button');
  let mageCounter = null;
  if (mageButton) {
    mageCounter = mageButton.getElementsByTagName('span')[0];
    mageButton.onclick = function () {
      if (user.hasItems(Items.BoosterMage)) {
        if (useMageBooster(result.mainCardColumn, result.playableCardColumns, screenParameters.rules).isTrue) {
          user.removeItem(Items.BoosterMage, 1);
        }
      }
    }
    mageCounter.innerText = `x${user.getItemCount(Items.BoosterMage)}`;
  }

  const timeButton = document.getElementById('time-button');
  let timeCounter = null;
  if (timeButton) {
    timeCounter = timeButton.getElementsByTagName('span')[0];
    timeButton.onclick = function () {
      if (user.hasItems(Items.BoosterTime)) {
        timer += 60;

        user.removeItem(Items.BoosterTime, 1);
      }
    }
    timeCounter.innerText = `x${user.getItemCount(Items.BoosterTime)}`;
  }

  const undoButton = document.getElementById('undo-button');
  let undoCounter = null;
  if (undoButton) {
    undoCounter = undoButton.getElementsByTagName('span')[0];
    undoButton.onclick = function () {
      if (user.hasItems(Items.BoosterUndo)) {
        if (useUndoBooster()) {
          user.removeItem(Items.BoosterUndo, 1);
        }
      }
    }
    undoCounter.innerText = `x${user.getItemCount(Items.BoosterUndo)}`;
  }

  user.itemListUpdateEvent.addListener(() => {
    if (hintCounter != null) hintCounter.innerText = `x${user.getItemCount(Items.BoosterHint)}`;
    if (mageCounter != null) mageCounter.innerText = `x${user.getItemCount(Items.BoosterMage)}`;
    if (timeCounter != null) timeCounter.innerText = `x${user.getItemCount(Items.BoosterTime)}`;
    if (undoCounter != null) undoCounter.innerText = `x${user.getItemCount(Items.BoosterUndo)}`;
  })

  const restartButtons = document.getElementsByClassName('reset-level-button');
  for (let i = 0; i < restartButtons.length; i++) {
    const element = restartButtons[i];

    element.onclick = function () {
      if (!CanInteract) return;

      startCurrentLevel();
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

  const buttonContainer = document.getElementsByClassName('footer-control-panel')[0];
  if (buttonContainer != null) {
    buttonContainer.classList.remove('hidden');
  }
}

function setupSolitaireLevel() {
  const buttonContainer = document.getElementsByClassName('footer-control-panel')[0];
  if (buttonContainer != null) {
    if (!buttonContainer.classList.contains('hidden')) {
      buttonContainer.classList.add('hidden');
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

function setupFastFinish() {
  document.getElementById('fast-win').onclick = function () {
    screenParameters.onWinCallback?.();
    checkIfLevelWon({ collectedCount: 10 });
  }

  document.getElementById('fast-lose').onclick = function () {
    screenParameters.onLoseCallback?.();
    showLoseScreen();
  }
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

setupFastFinish();

const closeSettingsFullPopupButton = document.getElementById('close-popup-settings');
const settingsFullPopup = document.getElementById('settings');
const settingsBtnFull = document.getElementById('settings-btn-full');

settingsBtnFull.addEventListener('click', () => {
  settingsFullPopup.style.display = 'flex';
});

closeSettingsFullPopupButton.addEventListener('click', function () {
  settingsFullPopup.style.display = 'none';
});

const closeLanguagesPopupButton = document.getElementById('close-popup-languages');
const languagesPopup = document.getElementById('languages');
const languagesBtn = document.getElementById('languages-btn');

languagesBtn.addEventListener('click', () => {
  languagesPopup.style.display = 'flex';
});

closeLanguagesPopupButton.addEventListener('click', function () {
  languagesPopup.style.display = 'none';
});

// setupFastFinish();

updateStepText(0);
setupBackgroundChange();
cardCollector.onCollected.addListener(checkIfLevelWon);

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

  input.updateQueryCustom(selectables, selectables[0])
});


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

export { setupLanguageSelector }