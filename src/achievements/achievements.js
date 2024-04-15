import { statistics } from '../scripts/gameStatistics.js';
import {
  createButton,
  createElement,
  createImage,
  createTextSpan,
  secondsToTime,
} from '../scripts/helpers.js';
import { LevelType } from '../scripts/statics/enums.js';
import { IconsByItem } from '../scripts/statics/staticValues.js';

function getIconByItem(itemType) {
  for (let i = 0; i < IconsByItem.length; i++) {
    const element = IconsByItem[i];
    if (element.type == itemType) return element.url;
  }
}

const achievementsParent = document.getElementById('achievements');
const statisticsParent = document.getElementById('statistics');

const tabScreens = [achievementsParent, statisticsParent];

function setupStatistics() {
  const gameCountText = document.getElementById('st-game-count');
  const winCountText = document.getElementById('st-win-count');
  const wiPercentText = document.getElementById('st-win-percent');
  const fastestWinText = document.getElementById('st-fastest-win');
  const leastStepsText = document.getElementById('st-least-steps');
  const completedTrialsText = document.getElementById('st-completed-trials');
  const playedTrialsText = document.getElementById('st-played-trials');

  gameCountText.innerText = statistics.gameCount.overall;
  winCountText.innerText = statistics.winCount.overall;
  wiPercentText.innerText =
    (statistics.gameCount.overall == 0
      ? 0
      : Math.floor(
          (statistics.winCount.overall / statistics.gameCount.overall) * 100
        )) + '%';
  fastestWinText.innerText =
    statistics.leastTime == 9999999 ? '∞' : secondsToTime(statistics.leastTime);
  leastStepsText.innerText =
    statistics.leastSteps == 9999999 ? '∞' : statistics.leastSteps;

  for (let i = 0; i < statistics.winCount.byLevelType.length; i++) {
    const element = statistics.winCount.byLevelType[i];
    if (element.type == LevelType.Trial) {
      completedTrialsText.innerText = element.count;
      break;
    }
  }

  for (let i = 0; i < statistics.gameCount.byLevelType.length; i++) {
    const element = statistics.gameCount.byLevelType[i];
    if (element.type == LevelType.Trial) {
      playedTrialsText.innerText = element.count;
      break;
    }
  }
}

function createAchievementInstance(data) {
  const completed = data.completed;

  const plane = createElement('div', ['achievement']);

  const lable = createElement('div', ['achievement-lable'], null, plane);
  createImage(['achievement-icon'], null, lable, data.icon);
  createTextSpan(['achievement-title'], null, lable, data.title);

  if (data.allTrialsCompleted) return plane;

  const valueText = data.getValueText();
  const progress = `${data.getCompletionPercent()}%`;

  const status = createElement('div', ['achievement-status'], null, plane);

  //if achievement uncompleted
  if (!completed) {
    const statusPlane = createElement('div', ['status-panel'], null, status);
    const statusSlider = createElement(
      'div',
      ['status-slider'],
      {
        width: progress,
      },
      statusPlane
    );
    const statusInfo = createTextSpan(
      ['status-info'],
      null,
      statusPlane,
      valueText
    );
  }

  const rewardContainer = createButton(['energy-btn'], null, status);
  createImage(
    ['energy-icon'],
    null,
    rewardContainer,
    getIconByItem(data.trials[data.completedIndex].reward.type)
  );
  createTextSpan(['energy-btn-title'], null, rewardContainer, '1');

  const bountyPopup = document.getElementById('bounty-popup');
  rewardContainer.addEventListener('click', () => {
    bountyPopup.style.display = 'flex';

    setTimeout(function () {
      bountyPopup.classList.remove('hidden-popup');
      bountyPopup.classList.add('visible');
      setTimeout(() => {
        bountyPopup.classList.remove('visible');
        bountyPopup.classList.add('hidden-popup');
        setTimeout(() => {
          bountyPopup.style.display = 'none';
        }, 500); // It have to be thee same delay as in CSS transition rules
      }, 2000);
    }, 0);
  });

  if (completed) {
    // // if achievement completed
    const claimButton = createButton(['get-btn'], null, status, () => {
      const reward = data.tryCompleteCurrentTrial();
      if (reward) {
        user.addItem(reward.type, reward.count);

        achievementsParent.insertBefore(createAchievementInstance(data), plane);
        plane.remove();
      }
    });
    createTextSpan(['get-btn-title'], null, claimButton, 'Получить');
  }

  return plane;
}

function createAchievementInstances() {
  for (let i = 0; i < user.achievements.length; i++) {
    const achievement = user.achievements[i];
    achievementsParent.appendChild(createAchievementInstance(achievement));
  }
}

function setupTabSwitch() {
  function changeTabsVisibility(index) {
    if (index > tabScreens.length - 1 || index < 0) return;

    for (let i = 0; i < tabScreens.length; i++) {
      const screen = tabScreens[i];

      if (i == index) {
        if (!screen.classList.contains('hidden')) return false;
        screen.classList.remove('hidden');
      } else if (!screen.classList.contains('hidden')) {
        screen.classList.add('hidden');
      }
    }

    return true;
  }
  const tabClass = 'categories-btn';
  const tabs = document.getElementsByClassName(tabClass);

  for (let i = 0; i < tabs.length; i++) {
    const element = tabs[i];
    element.onclick = function () {
      if (changeTabsVisibility(i)) {
        for (let j = 0; j < tabs.length; j++) {
          const element = tabs[j];
          if (i == j && !element.classList.contains('active-btn')) {
            element.classList.add('active-btn');
          } else {
            element.classList.remove('active-btn');
          }
        }
      }
    };
  }
}

setupTabSwitch();
createAchievementInstances();
setupStatistics();
