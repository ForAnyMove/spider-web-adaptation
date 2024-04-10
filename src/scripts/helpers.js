function createItem(type, count) {
    return {
        type: type,
        count: count
    }
}

function createDeckTrial(count) {
    return {
        levelTrial: {
            decksToComplete: count
        }
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
        levelTrial: levelTrial
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

export { createElement, createButton, createImage, createTextP, createTextSpan, shuffle, createItem, createDeckTrial, createTrialLevel, createStoryLevel, createLevelCompleteRequirement, secondsToTime }