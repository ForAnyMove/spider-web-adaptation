import { backSkinDatabase, backgroundDatabase, skinDatabase } from "./data/card_skin_database.js"
import { Pattern, SuitMode } from "./statics/enums.js"
import { IconsByItem } from "./statics/staticValues.js"

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function createItem(type, count) {
    return {
        type: type,
        count: count
    }
}

function createDeckTrial(count) {
    return {
        decksToComplete: count,
        description: `Соберите ${count} колоды, чтобы завершить испытание`,
    }
}

function createTrialLevel(order, type, state, rule, rewards, time, levelTrial) {
    return {
        order: order,
        type: type,
        state: state,
        gameRule: rule,
        rewards: rewards,
        time: time,
        trial: levelTrial
    }
}

function createStoryLevel(order, type, state, rule, rewards, pass, lvReq) {
    return {
        order: order,
        type: type,
        state: state,
        gameRule: rule,
        rewards: rewards,
        pass: pass,
        levelRequirement: lvReq
    }
}

function createLevelCompleteRequirement(type, order) {
    return { type: type, order: order }
}

function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex != 0) {

        let randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }
}

function secondsToTime(seconds) {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    let timeString = '';

    timeString += minutes.toString().padStart(2, '0') + ':';
    timeString += remainingSeconds.toString().padStart(2, '0');

    return timeString;
}

function getIconByItem(itemType) {
    for (let i = 0; i < IconsByItem.length; i++) {
        const element = IconsByItem[i];
        if (element.type == itemType) {
            return element.url;
        }
    }
}

function getIconByContent(id) {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const element = skinDatabase.skinList[i];
        if (element.id == id) {
            return element.itemPreviewPath;
        }
    }
    for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
        const element = backSkinDatabase.skinList[i];
        if (element.id == id) {
            return element.itemPreviewPath;
        }
    }
    for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
        const element = backgroundDatabase.skinList[i];
        if (element.id == id) {
            return element.itemPreviewPath;
        }
    }
}


function getSuitName(suit) {
    switch (suit) {
        case SuitMode.OneSuit: return 'Одна масть'
        case SuitMode.TwoSuits: return 'Две масти'
        case SuitMode.FourSuits: return 'Четыре масти'
    }
}

function getIconBySuit(suit) {
    switch (suit) {
        case SuitMode.OneSuit: return '../../Sprites/Icons/Icon_OneSuit.png'
        case SuitMode.TwoSuits: return '../../Sprites/Icons/Icon_TwoSuits.png'
        case SuitMode.FourSuits: return '../../Sprites/Icons/Icon_FourSuits.png'
    }
}

function getPatternName(pattern) {
    switch (pattern) {
        case Pattern.Spider: return 'Паук'
        case Pattern.SpiderLady: return 'Паучиха'
    }
}

function getIconByPattern(pattern) {
    switch (pattern) {
        case Pattern.Spider: return '../../Sprites/Icons/Icon_Spider.png'
        case Pattern.SpiderLady: return '../../Sprites/Icons/Icon_Spider_L.png'
    }
}

function createElement(id, classList, styleList, parent) {
    const element = document.createElement(id);

    if (element == null) return null;

    if (classList != null) {
        for (let i = 0; i < classList.length; i++) {
            if (classList[i] === '') continue;

            element.classList.add(classList[i]);
        }
    }

    if (styleList != null) {
        const keys = Object.keys(styleList);
        for (let i = 0; i < keys.length; i++) {
            element.style[keys[i]] = styleList[keys[i]];
        }
    }

    if (parent != null) {
        parent.appendChild(element);
    }

    return element;
}

function createImage(classList, styleList, parent, src) {
    const element = createElement('img', classList, styleList, parent);
    element.src = src;

    return element;
}

function createButton(classList, styleList, parent, onClick) {
    const element = createElement('button', classList, styleList, parent);
    if (onClick != null) {
        element.onclick = function () {
            onClick();
        }
    }
    return element;
}

function createTextP(classList, styleList, parent, text) {
    const element = createElement('p', classList, styleList, parent);
    element.innerText = text;
    return element;
}

function createTextSpan(classList, styleList, parent, text) {
    const element = createElement('span', classList, styleList, parent);
    element.innerText = text;
    return element;
}

function createTextH3(classList, styleList, parent, text) {
    const element = createElement('h3', classList, styleList, parent);
    element.innerText = text;
    return element;
}

function createHSpace(width, parent) {
    const element = createElement('h3', null, { width: width }, parent);
    return element;
}

function createVSpace(height, parent) {
    const element = createElement('h3', null, { height: height }, parent);
    return element;
}

function isSameCard(card, template) {
    return card.id == template.id;
}

function isCardHasRange(cards, card, range, maximumCountOfSameCards) {
    function calculateCount(cardStructure) {
        let count = 0;
        for (let i = 0; i < cards.length; i++)
            if (isSameCard(cards[i], cardStructure))
                count++;

        return count;
    }

    let selectedRank = card.rank;
    let selectedSuit = card.suit;

    for (let i = 0; i < cards.length; i++) {
        let rank = cards[i].rank;
        let suit = cards[i].suit;
        for (let j = 0; j < range + 1; j++)
            if (selectedSuit == suit && (rank == selectedRank - j || rank == selectedRank + j)) {
                let count = calculateCount(cards[i]);

                if (count >= maximumCountOfSameCards)
                    return true;
                return false;
            }
    }

    return false;
}

function compareCards(cardOne, cardTwo) {
    return cardOne.suit == cardTwo.suit && cardOne.rank == cardTwo.rank;
}
function compareCardsFull(rankOne, suitOne, rankTwo, suitTwo) {
    return rankOne == rankTwo && suitOne == suitTwo;
}
function isCardAtRankLower(card, template) {
    return card.suit == template.suit && card.rank == template.rank - 1;
}

function getElementsByClass(root, classNames = []) {
    const elements = [];

    for (let i = 0; i < classNames.length; i++) {
        const className = classNames[i];
        const rootElements = root.getElementsByClassName(className);

        for (let i = 0; i < rootElements.length; i++) {
            const element = rootElements[i];
            elements.push(element);
        }
    }

    return elements;
}

function getElements(root, options = { classNames, tags, ids }) {
    const elements = [];

    if (options.classNames) {
        for (let i = 0; i < options.classNames.length; i++) {
            const name = options.classNames[i];
            const rootElements = root.getElementsByClassName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push(element);
            }
        }
    }
    if (options.tags) {
        for (let i = 0; i < options.tags.length; i++) {
            const name = options.tags[i];
            const rootElements = root.getElementsByTagName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push(element);
            }
        }
    }
    if (options.ids) {
        for (let i = 0; i < options.ids.length; i++) {
            const name = options.ids[i];
            const rootElements = root.getElementById(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push(element);
            }
        }
    }

    return elements;
}

function getInputElements(root, options = { classNames, tags, ids }) {
    const elements = [];

    if (options.classNames) {
        for (let i = 0; i < options.classNames.length; i++) {
            const name = options.classNames[i];
            const rootElements = root.getElementsByClassName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push({ element: element, onSelect: null, onSubmit: null });
            }
        }
    }
    if (options.tags) {
        for (let i = 0; i < options.tags.length; i++) {
            const name = options.tags[i];
            const rootElements = root.getElementsByTagName(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push({ element: element, onSelect: null, onSubmit: null });
            }
        }
    }
    if (options.ids) {
        for (let i = 0; i < options.ids.length; i++) {
            const name = options.ids[i];
            const rootElements = root.getElementById(name);

            for (let i = 0; i < rootElements.length; i++) {
                const element = rootElements[i];
                elements.push({ element: element, onSelect: null, onSubmit: null });
            }
        }
    }

    return elements;
}



export {
    createElement,
    createTextH3,
    createButton, createImage,
    createTextP,
    createTextSpan,
    createHSpace,
    shuffle,
    createItem,
    createDeckTrial,
    createTrialLevel,
    createStoryLevel,
    createLevelCompleteRequirement,
    secondsToTime,
    getSuitName,
    getPatternName,
    getIconByPattern,
    getIconBySuit,
    getIconByItem,
    getIconByContent,
    createVSpace,
    getRandomInt,
    isCardHasRange,
    isSameCard,
    compareCards,
    compareCardsFull,
    isCardAtRankLower,
    getElementsByClass,
    getElements,
    getInputElements
}