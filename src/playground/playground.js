import { animator } from "../scripts/animator.js";
import { useHintBooster, useMageBooster, useUndoBooster } from "../scripts/boosters.js";
import { cardCollector } from "../scripts/cardsCollector.js";
import { createTweener } from "../scripts/dotween/dotween.js";
import { CanInteract, disableInteractions } from "../scripts/globalEvents.js";
import { secondsToTime } from "../scripts/helpers.js";
import { createLevel } from "../scripts/levelCreator.js";
import { ContentType, Pattern, SuitMode } from "../scripts/statics/enums.js";
import { Content, Items } from "../scripts/statics/staticValues.js";
import { stepRecorder } from "../scripts/stepRecorder.js";

import { fourSuitSpider, fourSuitSpiderLady, oneSuitSpider, oneSuitSpiderLady, twoSuitSpider, twoSuitSpiderLady } from "../scripts/rules/gameRules.js";
import { getBackgroundImage } from "../scripts/data/card_skin_database.js";
import { trialLevelDatabase } from "../scripts/data/level_databases.js";

let timer = 0;

const screenParameters = { rules: oneSuitSpider, decksToWin: 8 };

// GET level ID from the link
// document.addEventListener("DOMContentLoaded", function () {
//   const levelTypesList = [
//     'level_def_s_',
//     'level_def_sl_',
//     'level_story_',
//     'level_trial_'
//   ]
//   const urlParams = new URLSearchParams(window.location.search);
//   const levelID = urlParams.get('levelID');

//   console.log('Picked level ID:', levelID);
//   console.log('Picked level type:', levelTypesList.some((type) => levelID.includes(type)));
// });


function trySelectLevel() {
  const levelTypesList = [
    'level_def_s_',
    'level_def_sl_',
    'level_story_',
    'level_trial_'
  ]
  const urlParams = new URLSearchParams(window.location.search);
  const levelID = urlParams.get('levelID');
  console.log('Picked level ID:', levelID);
  console.log('Picked level type:', levelTypesList.some((type) => levelID.includes(type)));

  const type = levelID.substring(0, levelID.lastIndexOf('_') + 1);
  const number = parseInt(levelID.substring(type.length, levelID.length));

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
      break
    case levelTypesList[2]:
      console.log("Selected [Story]");
      break
    case levelTypesList[3]:
      console.log("Selected [Trial]");

      const level = trialLevelDatabase.levels[number];
      switch (level.gameRule.Pattern) {
        case Pattern.Spider:
          switch (level.gameRule.SuitMode) {
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
          switch (level.gameRule.SuitMode) {
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

      screenParameters.decksToWin = level.trial.decksToComplete;

      startTimer(level.time);
      break
  }
}

trySelectLevel();

createTweener();


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

let result = createLevel({ rules: screenParameters.rules });


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
  document.getElementById('hint-button').onclick = function () {
    if (user.hasItems(Items.BoosterHint)) {
      if (useHintBooster(result.playableCardColumns, screenParameters.rules).isTrue) {
        user.removeItem(Items.BoosterHint, 1);
      }
    }
  }

  document.getElementById('mage-button').onclick = function () {
    if (user.hasItems(Items.BoosterMage)) {
      if (useMageBooster(result.mainCardColumn, result.playableCardColumns, screenParameters.rules).isTrue) {
        user.removeItem(Items.BoosterMage, 1);
      }
    }
  }

  document.getElementById('time-button').onclick = function () {
    if (user.hasItems(Items.BoosterTime)) {
      timer += 60;

      user.removeItem(Items.BoosterTime, 1);
    }
  }

  document.getElementById('undo-button').onclick = function () {
    if (user.hasItems(Items.BoosterUndo)) {
      if (useUndoBooster()) {
        user.removeItem(Items.BoosterUndo, 1);
      }
    }
  }

  document.getElementById('restart-button').onclick = function () {
    if (!CanInteract) return;

    const cards = document.getElementsByClassName('card-element');

    for (let i = cards.length - 1; i >= 0; i--) {
      const element = cards[i];
      element.remove();
    }

    createTweener();
    animator.reset();
    stepRecorder.reset();
    result = createLevel({ rules: screenParameters.rules });
    startTimer(600);

    stepRecorder.stepRecordedEvent.addListener(updateStepText);
    updateStepText(0);
  }
}

function checkIfLevelWon(options) {
  console.log(`${options.columnCount}, ${options.collectedCount}`);

  if (options.collectedCount == screenParameters.decksToWin) {
    const el = document.createElement('span');
    el.innerHTML = "Level completed";

    el.style.fontSize = '50px'
    el.style.textAlign = 'center'
    el.style.color = '#0f0'
    el.style.position = 'absolute';
    el.style.left = window.innerWidth / 2 - 25 * 8 + 'px';
    el.style.top = window.innerHeight / 2 - 10 + 'px';
    document.getElementsByTagName('main')[0].appendChild(el);

    disableInteractions();
  }
}

function levelLostFlow() {
  const el = document.createElement('span');
  el.innerHTML = "Level lost";

  el.style.fontSize = '50px'
  el.style.textAlign = 'center'
  el.style.color = '#f00'
  el.style.position = 'absolute';
  el.style.left = window.innerWidth / 2 - 25 * 8 + 'px';
  el.style.top = window.innerHeight / 2 - 10 + 'px';
  document.getElementsByTagName('main')[0].appendChild(el);

  disableInteractions();
}

function updateStepText(stepCount) {
  document.getElementById('step-counter').innerText = stepCount;
}

setupDistribution();
setupButtons();
updateStepText(0);
setupBackgroundChange();
cardCollector.onCollected.addListener(checkIfLevelWon);
stepRecorder.stepRecordedEvent.addListener(updateStepText)
