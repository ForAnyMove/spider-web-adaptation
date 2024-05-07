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

    removeListenerByName = function (name) {
        for (let i = this.actions.length - 1; i >= 0; i--) {
            const element = this.actions[i];
            if (element.name == name) {
                this.actions.splice(this.actions.indexOf(element), 1);
            }
        }
    }

    removeAnonymousListeners = function () {
        for (let i = this.actions.length - 1; i >= 0; i--) {
            const element = this.actions[i];
            console.log(element);
        }
    }

    addListenerToStart = function (func) {
        this.actions = [func].concat(this.actions);
    }

    removeListener = function (func) {
        this.actions.splice(this.actions.indexOf(func), 1);
    }

    removeAllListeners = function () {
        this.actions = [];
    }
}

function generateLevelResult({ result: res, levelType: lt }) {
    return { result: res, levelType: lt }
}

let CanInteract = true;

function disableInteractions() {
    CanInteract = false;
}

function enableInteractions() {
    CanInteract = true;
}

export { Action, generateLevelResult, CanInteract, disableInteractions, enableInteractions }