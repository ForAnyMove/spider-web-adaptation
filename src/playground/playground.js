import { animator } from "../scripts/animator.js";
import { useHintBooster, useMageBooster, useUndoBooster } from "../scripts/boosters.js";
import { cardCollector } from "../scripts/cardsCollector.js";
import { createTweener } from "../scripts/dotween/dotween.js";
import { CanInteract, disableInteractions } from "../scripts/globalEvents.js";
import { secondsToTime } from "../scripts/helpers.js";
import { createLevel, createSolitaireLevel } from "../scripts/levelCreator.js";
import { ContentType, Pattern, SuitMode } from "../scripts/statics/enums.js";
import { Content, Items } from "../scripts/statics/staticValues.js";
import { stepRecorder } from "../scripts/stepRecorder.js";

import { fourSuitSpider, fourSuitSpiderLady, oneSuitSpider, oneSuitSpiderLady, twoSuitSpider, twoSuitSpiderLady } from "../scripts/rules/gameRules.js";
import { getBackgroundImage } from "../scripts/data/card_skin_database.js";
import { trialLevelDatabase, storyLevelDatabase } from "../scripts/data/level_databases.js";
import { SolitaireCardColumn } from "../scripts/cardModel.js";
import { completeLevel, completeMode, failLevel, failMode, startLevel } from "../scripts/levelStarter.js";

let timer = 0;

const screenParameters = { rules: oneSuitSpider, decksToWin: 8, onWinCallback: null, onLoseCallback: null, isSolitaire: false, onRestart: null };

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
  }
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
  if (hintButton) {
    const hintCounter = hintButton.getElementsByTagName('span')[0];
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
  if (mageButton) {
    const mageCounter = mageButton.getElementsByTagName('span')[0];
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
  if (timeButton) {
    const timeCounter = timeButton.getElementsByTagName('span')[0];
    timeButton.onclick = function () {
      if (user.hasItems(Items.BoosterTime)) {
        timer += 60;

        user.removeItem(Items.BoosterTime, 1);
      }
    }
    timeCounter.innerText = `x${user.getItemCount(Items.BoosterTime)}`;
  }

  const undoButton = document.getElementById('undo-button');
  if (undoButton) {
    const undoCounter = undoButton.getElementsByTagName('span')[0];
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
    if (hintCounter) hintCounter.innerText = `x${user.getItemCount(Items.BoosterHint)}`;
    if (mageCounter) mageCounter.innerText = `x${user.getItemCount(Items.BoosterMage)}`;
    if (timeCounter) timeCounter.innerText = `x${user.getItemCount(Items.BoosterTime)}`;
    if (undoCounter) undoCounter.innerText = `x${user.getItemCount(Items.BoosterUndo)}`;
  })

  document.getElementById('restart-button').onclick = function () {
    if (!CanInteract) return;

    startCurrentLevel();
  }
}

function checkIfLevelWon(options) {
  console.log(`${options.columnCount}, ${options.collectedCount}`);

  if (options.collectedCount == screenParameters.decksToWin) {
    screenParameters.onWinCallback?.();
    disableInteractions();

    // open win screen with rewards
    const el = document.createElement('span');
    el.innerHTML = "Level completed";

    el.style.fontSize = '50px'
    el.style.textAlign = 'center'
    el.style.color = '#0f0'
    el.style.position = 'absolute';
    el.style.left = window.innerWidth / 2 - 25 * 8 + 'px';
    el.style.top = window.innerHeight / 2 - 10 + 'px';
    document.getElementsByTagName('main')[0].appendChild(el);

  }
}

function levelLostFlow() {
  disableInteractions();

  // open lose screen
  const el = document.createElement('span');
  el.innerHTML = "Level lost";

  el.style.fontSize = '50px'
  el.style.textAlign = 'center'
  el.style.color = '#f00'
  el.style.position = 'absolute';
  el.style.left = window.innerWidth / 2 - 25 * 8 + 'px';
  el.style.top = window.innerHeight / 2 - 10 + 'px';
  document.getElementsByTagName('main')[0].appendChild(el);
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
  }

  document.getElementById('fast-lose').onclick = function () {
    screenParameters.onLoseCallback?.();
  }
}

// setupFastFinish();

updateStepText(0);
setupBackgroundChange();
cardCollector.onCollected.addListener(checkIfLevelWon);