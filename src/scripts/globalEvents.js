let _logEnabled = false;


class Action {
    constructor() {
        this.actions = [];
    }

    invoke = function (params) {

        if (this.actions.length == 0) {
            if (_logEnabled) {
                console.log(`no listeners`);
            }
            return;
        }

        for (let i = 0; i < this.actions.length; i++) {
            const element = this.actions[i];

            element(params);
        }
    }

    addListener = function (func) {
        this.actions.push(func);
    }

    removeListener = function (func) {
        this.actions.splice(this.actions.indexOf(func), 1);
    }

    removeAllListeners = function () {
        this.actions = [];
    }
}

let levelWinEvent = new Action();

function generateLevelResult({ result: res, levelType: lt }) {
    return { result: res, levelType: lt }
}

export { Action, levelWinEvent, generateLevelResult }