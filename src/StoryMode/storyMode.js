import { storyLevelDatabase } from "../scripts/data/level_databases.js";
import { createButton, createElement, createHSpace, createImage, createTextH3, createTextSpan, createVSpace, getIconByContent, getIconByItem, getIconByPattern, getIconBySuit, getPatternName, getSuitName } from "../scripts/helpers.js";
import { Items } from "../scripts/statics/staticValues.js";

const levelButtonsContainer = document.getElementsByClassName('story-map-container')[0]
const tabSize = {
  width: window.innerWidth,
  height: window.innerHeight,
  orientation: window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
}
const mainTab = document.getElementsByTagName('main')[0]
const scrollXCoef = tabSize.orientation === 'landscape' ? 6 : 2.3;


window.addEventListener('resize', () => {
  popup.style.width = window.innerWidth;
  popup.style.height = window.innerHeight
})


const currentLevelIndex = storyLevelDatabase.currentLevel;

const currentLevel = storyLevelDatabase.levels[currentLevelIndex];

const popupParent = document.getElementById('popup');

const levelViews = [];

const views = document.getElementsByClassName('level-btn');
let levelOrder = 1;
while (levelViews.length < views.length) {
  for (let i = 0; i < views.length; i++) {
    const element = views[i];
    if (element.id == `level-btn-${levelOrder}`) {
      levelViews.push(element);
      levelOrder++;
      break;
    }
  }
}

let offset = { x: 0, y: 0 };

for (let i = 0; i < levelViews.length; i++) {
  const element = levelViews[i];
  if (i == currentLevelIndex) {
    element.classList.remove('closed')
    element.innerText = `${i + 1}`;

    const box = element.getBoundingClientRect();
    offset.x = box.left + box.width / 2;
    offset.y = box.top + box.height / 2;

  } else if (!element.classList.contains('closed')) {
    element.classList.add('closed')
    element.innerText = '';
  }
}

const targetPosition = { x: offset.x - tabSize.width / 2, y: offset.y - tabSize.height / 2 }
mainTab.scrollTo(targetPosition.x, targetPosition.y);

let lastCreatedLevelPreview = null;

function createLevelPreview(data) {
  if (lastCreatedLevelPreview != null) {
    lastCreatedLevelPreview.remove();
  }

  function createBooster(itemType, title, user, parent) {
    const plane = createElement('div', ['booster-container'], null, parent);
    {
      const div = createElement('div', ['booster'], null, plane);
      {
        createButton(['add-booster-icon'], {
          border: 'none',
          background: 'no-repeat',
          backgroundImage: 'url(../../Sprites/Buttons/Used_plus.png)',
          backgroundSize: '100% 100%',
        }, div, () => {
          user.addItem(itemType);
        });
        createImage(['booster-icon'], null, div, getIconByItem(itemType));
        const count = createTextSpan(['booster-counter'], null, div, user.getItemCount(itemType));

        user.itemListUpdateEvent.addListener(() => {
          count.innerText = user.getItemCount(itemType);
        });

      }
      createTextSpan(['booster-title'], null, plane, title);
    }
  }
  // data
  const requiredPass = data.pass.count;
  const suitName = getSuitName(data.gameRule.SuitMode);
  const suitIcon = getIconBySuit(data.gameRule.SuitMode);

  const patternName = getPatternName(data.gameRule.Pattern);
  const patternIcon = getIconByPattern(data.gameRule.Pattern);
  const rewards = data.rewards?.items?.concat(data.rewards?.content ?? []) ?? data.rewards?.content?.concat(data.rewards?.items ?? []);
  // layout
  const plane = createElement('div', ['popup-content']);
  {
    const header = createElement('div', ['popup-header'], null, plane);
    {
      createTextH3(null, null, header, `Уровень №${currentLevelIndex + 1}`);
      const closeButton = createButton(null, {
        // border: 'none',
        background: 'no-repeat',
        backgroundImage: 'url(../../Sprites/Icons/Icon_Close.png)',
        backgroundSize: '100% 100%',
      }, header, () => {
        popupParent.classList.remove('showed-popup');
        popupParent.classList.add('hidden-popup');
      });
      closeButton.id = 'close-popup'
    }
    const rules = createElement('div', ['rules-container'], null, plane);
    {
      createTextSpan(null, null, rules, 'Правила');
      const rulesContainer = createElement('div', ['rules-cards-container'], null, rules);
      {
        const suitContainer = createElement('div', ['rules-card'], { position: 'relative' }, rulesContainer);
        {
          createTextSpan(null, { position: 'absolute', top: '-3%' }, suitContainer, 'Масть');
          createElement('div', null, { height: '4vw' }, suitContainer);
          createImage(['rules-icon'], null, suitContainer, suitIcon);
          createElement('div', null, { height: '4vw' }, suitContainer);
          createTextSpan(null, { position: 'absolute', bottom: '12%', height: '0.5vh', textWrap: 'nowrap' }, suitContainer, suitName);
        }
        const patternContainer = createElement('div', ['rules-card'], { position: 'relative' }, rulesContainer);
        {
          createTextSpan(null, { position: 'absolute', top: '-3%' }, patternContainer, 'Режим');
          createElement('div', null, { height: '4vw' }, patternContainer);
          createImage(['rules-icon'], null, patternContainer, patternIcon);
          createElement('div', null, { height: '4vw' }, patternContainer);
          createTextSpan(null, { position: 'absolute', bottom: '12%', height: '0.5vh', textWrap: 'nowrap' }, patternContainer, patternName);
        }
      }
    }
    const levelInfo = createElement('div', ['level-info'], null, plane);
    {
      createTextH3(['level-info-header'], null, levelInfo, 'Бустеры на уровне');
      const boostersContainer = createElement('div', ['boosters-container'], null, levelInfo);
      {
        createBooster(Items.BoosterHint, 'Подсказка', user, boostersContainer);
        createBooster(Items.BoosterUndo, 'Отмена хода', user, boostersContainer);
        createBooster(Items.BoosterMage, 'Маг', user, boostersContainer);
        createBooster(Items.BoosterTime, 'Доп. время', user, boostersContainer);
      }

      if (rewards == null || rewards.length == 0) {
        createVSpace('8vh', levelInfo);
      }
      else {
        createTextH3(['rewards-title'], null, levelInfo, 'Награда');
        const rewardsContainer = createElement('div', ['rewards-container'], null, levelInfo);
        {
          const maxViewCount = Math.min(rewards.length, 4);
          for (let i = 0; i < maxViewCount; i++) {
            const element = rewards[i];

            const reward = createElement('div', ['rewards'], null, rewardsContainer);
            {
              const preview = getIconByItem(element.type) ?? getIconByContent(element.type);
              createImage(['rewards-icon'], null, reward, preview);
              if (element.count > 1) {
                createTextSpan(['rewards-title'], null, reward, element.count);
              }
            }
            if (i < maxViewCount - 1) {
              createHSpace('1vw', rewardsContainer);
            }
          }
        }
      }

      const levelStartContainer = createElement('div', ['start-btn-container'], null, levelInfo);
      {
        const adsButton = createButton(['start-level-btn'], null, levelStartContainer, () => {
          user.addItem(Items.Energy, 5);
        });
        adsButton.id = 'ads-btn';
        {
          createImage(['watch-add-icon'], null, adsButton, '../../Sprites/Icons/Icon_Ads.png');
          createTextSpan(['start-level-btn-title'], null, adsButton, 'Бесплатно');
          const priceContainer = createElement('div', ['interactive-btn-info'], null, adsButton);
          {
            createTextSpan(['btn-info-value'], null, priceContainer, '5');
            createImage(['btn-info-icon'], null, priceContainer, '../../Sprites/Icons/Icon_Energy.png');
          }
        }

        const startButton = createButton(['start-level-btn'], null, levelStartContainer, () => {
          if (user.getItemCount(Items.Energy) >= requiredPass) {
            user.removeItem(Items.Energy, requiredPass);
          }
          window.location.href = `../playground/playground.html?levelID=level_story_${currentLevelIndex}`;
        });
        startButton.id = 'play-btn';
        {
          createTextSpan(['start-level-btn-title'], null, startButton, 'Играть');
          const priceContainer = createElement('div', ['interactive-btn-info'], null, startButton);
          {
            createTextSpan(['btn-info-value'], null, priceContainer, requiredPass);
            createImage(['btn-info-icon'], null, priceContainer, '../../Sprites/Icons/Icon_Energy.png');
          }
        }

        function checkStartButtonAccess() {
          if (user.getItemCount(Items.Energy) < requiredPass) {
            if (!startButton.classList.contains('non-interactive')) {
              startButton.classList.add('non-interactive');
            }
          } else {
            startButton.classList.remove('non-interactive');
          }
        }

        checkStartButtonAccess();

        user.itemListUpdateEvent.addListener(() => {
          checkStartButtonAccess();
        });
      }
    }
  }

  return plane;
}

levelButtonsContainer.addEventListener('click', (event) => {
  if (event.target.matches('.level-btn')) {
    const levelBtn = event.target;
    if (levelBtn.classList.contains('closed')) return;

    lastCreatedLevelPreview = createLevelPreview(currentLevel);
    popupParent.appendChild(lastCreatedLevelPreview);

    popupParent.classList.remove('hidden-popup');
    popupParent.classList.add('showed-popup');
  }
})

function setupEnergyView() {
  const element = document.getElementById('energy-text');

  if (element != null) {
    element.innerText = user.getItemCount(Items.Energy);

    user.itemListUpdateEvent.addListener(() => {
      element.innerText = user.getItemCount(Items.Energy);
    })
  }
}

setupEnergyView();