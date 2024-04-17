import { statistics, updateStatistics } from '../scripts/gameStatistics.js';
import {
  createButton,
  createElement,
  createImage,
  createTextSpan,
  secondsToTime,
} from '../scripts/helpers.js';
import { LevelType } from '../scripts/statics/enums.js';
import { IconsByItem } from '../scripts/statics/staticValues.js';
import('../scripts/rewardReceiverView.js');

import DirectionalInput from '../scripts/directionInput.js';
import { initialLocale } from '../localization/translator.js';

function getIconByItem(itemType) {
  for (let i = 0; i < IconsByItem.length; i++) {
    const element = IconsByItem[i];
    if (element.type == itemType) return element.url;
  }
}

const returnButton = document.getElementById('close-button');
input ??= new DirectionalInput({ element: returnButton });


const achievementsParent = document.getElementById('achievements');
const statisticsParent = document.getElementById('statistics');

const tabScreens = [achievementsParent, statisticsParent];
let tabs = [];
let startSelectables;

statistics.winCount.overall = 5;
updateStatistics();

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

function createAchievementInstance(data, onInserted) {
  const completed = data.completed;

  const plane = createElement('div', ['achievement']);

  const lable = createElement('div', ['achievement-lable'], null, plane);
  createImage(['achievement-icon'], null, lable, data.icon);
  const title = createTextSpan(['achievement-title'], null, lable, data.title);
  title.lang = data.langID;

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
        const newPlane = createAchievementInstance(data, onInserted);
        achievementsParent.insertBefore(newPlane, plane);
        onInserted?.(newPlane);
        plane.remove();

        setTimeout(() => user.addItem(reward.type, reward.count, { isTrue: true, isMonetized: false }), 15)
      }
    });
    const buttonTitle = createTextSpan(['get-btn-title'], null, claimButton, 'Получить');
    buttonTitle.lang = 'claim';
  }

  return plane;
}

function createAchievementInstances() {
  const selectables = [];
  const activementsViews = [];

  for (let i = 0; i < user.achievements.length; i++) {
    const achievement = user.achievements[i];

    const element = createAchievementInstance(achievement, (newElement) => {
      setTimeout(() => {
        const newSelectable = {
          element: newElement,
          onSelect: () => {
            const box = newElement.getBoundingClientRect();
            const height = box.height;
            const yCenter = box.top + height / 2;

            if (yCenter + height / 2 >= achievementsParent.getBoundingClientRect().bottom) {
              achievementsParent.scrollBy(0, height)
            } else if (yCenter - height / 2 <= achievementsParent.getBoundingClientRect().top) {
              achievementsParent.scrollBy(0, -height)
            }
          }, onSubmit: () => {
            if (achievement.completed) {
              input.updateQueryCustom([], {
                element: newElement.getElementsByClassName('get-btn')[0], onBack: () => input.updateQueryCustom(startSelectables, newSelectable)
              });
            }
          }
        }
        startSelectables.push(newSelectable);
        for (let i = startSelectables.length - 1; i >= 0; i--) {
          if (startSelectables[i].element == element) {
            startSelectables.splice(i, 1);
          }
        }

        input.updateQueryCustom(startSelectables, newSelectable);
      }, 10)
    });
    activementsViews.push(element);

    const selectable = {
      element: element, onSelect: () => {
        const box = element.getBoundingClientRect();
        const height = box.height;
        const yCenter = box.top + height / 2;

        if (yCenter + height / 2 >= achievementsParent.getBoundingClientRect().bottom) {
          achievementsParent.scrollBy(0, height)
        } else if (yCenter - height / 2 <= achievementsParent.getBoundingClientRect().top) {
          achievementsParent.scrollBy(0, -height)
        }
      }, onSubmit: () => {
        if (achievement.completed) {
          input.updateQueryCustom([], { element: element.getElementsByClassName('get-btn')[0], onBack: () => input.updateQueryCustom(startSelectables, selectable) });
        }
      }
    }

    selectables.push(selectable);

    achievementsParent.appendChild(element);
  }

  return selectables;
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
  tabs = document.getElementsByClassName(tabClass);

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
setupStatistics();

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const selectables = createAchievementInstances();

startSelectables = [{ element: tabs[0] }, { element: tabs[1] }, { element: returnButton }].concat(selectables);

input.updateQueryCustom(startSelectables, startSelectables[2]);

languageChangeEvent.invoke(initialLocale);