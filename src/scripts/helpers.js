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
    return { type, order }
}

export { createItem, createDeckTrial, createTrialLevel, createStoryLevel, createLevelCompleteRequirement }