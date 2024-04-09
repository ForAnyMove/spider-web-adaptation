import { backSkinDatabase, backgroundDatabase, skinDatabase } from "../scripts/data/card_skin_database.js"
import { trophyDatabase } from "../scripts/data/trophy_database.js";
import { createButton, createElement, createImage, createTextP, createTextSpan } from "../scripts/helpers.js";
import { Statefull } from "../scripts/statics/enums.js"
import { Items } from "../scripts/statics/staticValues.js";
import { user } from "../scripts/userData.js";

user.addContent(skinDatabase.skinList[4].id);
user.addItem(Items.Trophy01);

const checkIconPath = '../../Sprites/Icons/Icon_Check.png'
const lockIconPath = '../../Sprites/Icons/Icon_Lock.png'

const skinParent = document.getElementById('pick-area-1');
const skinBackParent = document.getElementById('pick-area-2');
const backgroundParent = document.getElementById('pick-area-3');
const trophyParent = document.getElementById('pick-area-4');

const tabScreens = [skinParent, skinBackParent, backgroundParent, trophyParent];

function createCardSkins() {
  for (let i = 0; i < skinDatabase.skinList.length; i++) {
    const data = skinDatabase.skinList[i];
    skinParent.appendChild(createSkinInstance(data));
  }
}

function createCardBacks() {
  for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
    const data = backSkinDatabase.skinList[i];
    skinBackParent.appendChild(createSkinBackInstance(data));
  }
}

function createBackgrounds() {
  for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
    const data = backgroundDatabase.skinList[i];
    backgroundParent.appendChild(createBackgroundInstance(data));
  }
}

function createTrophies() {
  for (let i = 0; i < trophyDatabase.list.length; i++) {
    const data = trophyDatabase.list[i];
    trophyParent.appendChild(createTrophyInstance(data));
  }
}

function createBackgroundInstance(data) {
  let state = Statefull.Locked;

  if (user.hasContent(data.id)) {
    state = Statefull.AvailableToEquip;
  }
  if (user.usedContent.includes(data.id)) {
    state = Statefull.Equipped;
  }
  const plane = createElement('div', ['background-card'], {
    backgroundImage: `url(${data.previewPath})`
  });

  if (state == Statefull.Locked) {
    createImage(['lock-icon'], null, plane, lockIconPath);
    const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
    createTextP(['mask-title'], null, requirementTextContainer, data.unlockDescription);
  } else {
    const useButton = createButton(['start-level-btn'], null, plane, () => {
      user.useContent(data.id);
    });
    useButton.id = 'play-btn';
    createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
    if (state != Statefull.AvailableToEquip) {
      useButton.classList.add('hidden');
    }
    const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
    if (state != Statefull.Equipped) {
      usedIcon.classList.add('hidden');
    }
    user.contentUsageChanged.addListener((usedContent) => {
      if (usedContent.includes(data.id) && !useButton.classList.contains('hidden')) {
        useButton.classList.add('hidden');
        usedIcon.classList.remove('hidden');
      } else if (!usedContent.includes(data.id) && !usedIcon.classList.contains('hidden')) {
        useButton.classList.remove('hidden');
        usedIcon.classList.add('hidden');
      }
    });
  }

  return plane;
}

function createSkinInstance(data) {
  let state = Statefull.Locked;

  if (user.hasContent(data.id)) {
    state = Statefull.AvailableToEquip;
  }
  if (user.usedContent.includes(data.id)) {
    state = Statefull.Equipped;
  }
  const plane = createElement('div', ['skin-card']);
  const preview = createImage(['card-skin'], null, plane, data.previewPath);

  if (state == Statefull.Locked) {
    preview.classList.add('tonned');

    createImage(['lock-icon'], null, plane, lockIconPath);
    const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
    createTextP(['mask-title'], null, requirementTextContainer, data.unlockDescription);
  } else {
    const useButton = createButton(['start-level-btn'], null, plane, () => {
      user.useContent(data.id);
    });
    useButton.id = 'play-btn';
    createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
    if (state != Statefull.AvailableToEquip) {
      useButton.classList.add('hidden');
    }
    const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
    if (state != Statefull.Equipped) {
      usedIcon.classList.add('hidden');
    }
    user.contentUsageChanged.addListener((usedContent) => {
      if (usedContent.includes(data.id) && !useButton.classList.contains('hidden')) {
        useButton.classList.add('hidden');
        usedIcon.classList.remove('hidden');
      } else if (!usedContent.includes(data.id) && !usedIcon.classList.contains('hidden')) {
        useButton.classList.remove('hidden');
        usedIcon.classList.add('hidden');
      }
    });
  }

  return plane;
}

function createSkinBackInstance(data) {
  let state = Statefull.Locked;

  if (user.hasContent(data.id)) {
    state = Statefull.AvailableToEquip;
  }
  if (user.usedContent.includes(data.id)) {
    state = Statefull.Equipped;
  }
  const plane = createElement('div', ['skin-card-back'], {
    backgroundImage: `url(${data.previewPath})`,
    backgroundSize: '100% 100%'
  });

  if (state == Statefull.Locked) {
    createImage(['lock-icon'], null, plane, lockIconPath);
    const requirementTextContainer = createElement('div', ['lock-mask'], null, plane);
    createTextP(['mask-title'], null, requirementTextContainer, data.unlockDescription);
  } else {
    const useButton = createButton(['start-level-btn'], null, plane, () => {
      user.useContent(data.id);
    });
    useButton.id = 'play-btn';
    createTextSpan(['start-level-btn-title'], null, useButton, 'Использовать');
    if (state != Statefull.AvailableToEquip) {
      useButton.classList.add('hidden');
    }
    const usedIcon = createImage(['check-icon'], null, plane, checkIconPath);
    if (state != Statefull.Equipped) {
      usedIcon.classList.add('hidden');
    }
    user.contentUsageChanged.addListener((usedContent) => {
      if (usedContent.includes(data.id) && !useButton.classList.contains('hidden')) {
        useButton.classList.add('hidden');
        usedIcon.classList.remove('hidden');
      } else if (!usedContent.includes(data.id) && !usedIcon.classList.contains('hidden')) {
        useButton.classList.remove('hidden');
        usedIcon.classList.add('hidden');
      }
    });
  }

  return plane;
}

function createTrophyInstance(data) {
  const hasTrophy = user.hasItems(data.id);
  const plane = createElement('div', ['trophy-card']);
  createImage(['trophy-skin', (hasTrophy ? '' : 'black')], null, plane, data.previewPath);

  if (!hasTrophy) {
    createElement('div', ['space'], null, plane);
    const requirementTextContainer = createElement('div', null, null, plane);
    createTextP(['mask-title'], null, requirementTextContainer, data.unlockDescription);
  }

  return plane;
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
            element.classList.add('active-btn')
          } else {
            element.classList.remove('active-btn')
          }
        }
      }
    }
  }
}

createCardSkins();
createCardBacks();
createBackgrounds();
createTrophies();

setupTabSwitch();