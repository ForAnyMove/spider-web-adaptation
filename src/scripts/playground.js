import { animator } from "./animator.js";
import { useHintBooster, useMageBooster } from "./boosters.js";
import { cardCollector } from "./cardsCollector.js";
import { createTweener } from "./dotween/dotween.js";
import { disableInteractions } from "./globalEvents.js";
import { secondsToTime } from "./helpers.js";
import { createLevel } from "./levelCreator.js";
import { fourSuitSpider, fourSuitSpiderLady, oneSuitSpider, oneSuitSpiderLady } from "./rules/gameRules.js";
import { Pattern } from "./statics/enums.js";
import { Items } from "./statics/staticValues.js";
import { user } from "./userData.js"

const screenParameters = { rules: oneSuitSpider };

user.addItem(Items.BoosterHint, 10);
user.addItem(Items.BoosterMage, 10);
user.addItem(Items.BoosterTime, 10);

createTweener();

let timer = 0;

function startTimer(seconds) {
  const container = document.getElementsByClassName('header-timer hidden')[0];
  container.classList.remove('hidden');
  const textAttribute = document.createElement('span');
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

startTimer(600);


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
    main.style.width = '48vw';
  }
}

const result = createLevel({ rules: screenParameters.rules });

function distributeDefault() {
  if (result.croupier != null) {
    result.croupier.ingameDistribution();
  }
}

document.getElementById('extra-cards-container').onclick = function (params) {
  distributeDefault();
}

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

function checkIfLevelWon(options) {
  console.log(`${options.columnCount}, ${options.collectedCount}`);

  if (options.collectedCount == 2) {
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

const el = document.createElement('span');
el.innerHTML = "Task: collect 2 decks";

el.style.fontSize = '24px'
el.style.color = '#fff'
el.style.position = 'absolute';
el.style.left = '4vw';
el.style.top = '0.8vw';
document.getElementsByTagName('main')[0].appendChild(el);

cardCollector.onCollected.addListener(checkIfLevelWon);