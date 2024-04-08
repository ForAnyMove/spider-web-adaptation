import { log } from "../logger.js";
import { saveUserData } from "../sdk/sdk.js";

let savesList = [];

const globalSaveKey = 'saves_01';

let timeThreshold = 0;
let timeout = false;

function save(key, obj) {

    for (let i = 0; i < savesList.length; i++) {
        const element = savesList[i];

        if (Object.keys(element) == key) {
            if (obj === savesList[i][key]) return;
            savesList[i][key] = obj;

            sendToServer();
            return;
        }
    }

    savesList.push({ [key]: obj });

    sendToServer();
}

function load(key, defaultValue) {

    for (let i = 0; i < savesList.length; i++) {
        const element = savesList[i];

        if (Object.keys(element) == key) {
            return element[key];
        }
    }

    return defaultValue;
}

function sendToServer() {

    if (timeout) return;

    if (timeThreshold > 0) {
        setTimeout(() => {
            timeThreshold = 0;
            timeout = false;
            sendToServer();
        }, timeThreshold);
        timeout = true;
        return;
    }

    const saveObject = { [globalSaveKey]: savesList };

    log(`Send to server: ${JSON.stringify(saveObject)}`, "saveSystem");

    saveUserData(saveObject);

    timeThreshold = 500;
}

function loadFromServer(data) {
    const json = JSON.parse(data);

    if (json[globalSaveKey] == null || json[globalSaveKey] == undefined) {
        return;
    }

    savesList = json[globalSaveKey];
}

function logSaves() {
    let saves = '';
    for (let i = 0; i < savesList.length; i++) {
        const element = savesList[i];

        saves += `${Object.keys(element)}: ${JSON.stringify(Object.values(element))}\n`
    }

    console.log(saves);
}

export { save, load }