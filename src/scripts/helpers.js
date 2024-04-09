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

export { shuffle, createItem, createDeckTrial, createTrialLevel, createStoryLevel, createLevelCompleteRequirement, secondsToTime }