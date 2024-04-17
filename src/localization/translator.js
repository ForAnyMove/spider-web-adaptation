import { load, save } from "../scripts/save_system/SaveSystem.js";
import { getDefaultLanguage } from "../scripts/sdk/sdk.js";
import { translations } from "./translations.js";

const saveKey = 'language';
let initialLocale = load(saveKey, null);

if (initialLocale == null) {
    initialLocale = await getDefaultLanguage();
    save(saveKey, initialLocale);
}

function getTranslation(language, key) {
    const concreteLanguageTranslation = translations[language];
    if (concreteLanguageTranslation == null) return null;

    const translation = concreteLanguageTranslation[key];
    if (translation == null) return null;

    return translation;
}

function updateLanguage(elements, locale) {

    function updateElement(element, type, value) {
        switch (type) {
            case 'text':
                element.innerText = value;
                break;
            case 'background':
                element.classList.backgroundImage = `url(${value})`
                break
            case 'img':
                element.src = value;
                break;
            case 'data-text':
                element.dataset.text = value;
                break;
        }
    }


    for (let i = 0; i < elements.length; i++) {
        const element = elements[i];

        let key = element.lang;

        let itemType = 'text';

        if (key.includes('[')) {
            let startScopeIndex = 0;
            let endScopeIndex = 0;
            for (let i = 0; i < key.length; i++) {
                const element = key[i];
                if (element == '[') {
                    startScopeIndex = i;
                    continue;
                }

                if (element == ']') {
                    endScopeIndex = i;
                    break;
                }
            }

            itemType = key.substring(startScopeIndex + 1, endScopeIndex);
            key = key.substring(endScopeIndex + 1, key.length);
        }

        if (key.includes('{') || key.includes(' ')) {
            let finalString = "";

            let lastScopeIndex = -1;
            let keyConstructor = '';
            for (let j = 0; j < key.length; j++) {
                const keyChar = key[j];

                if (keyChar == '{') {
                    lastScopeIndex = j;
                } else if (keyChar == '}') {
                    const v = key.substring(lastScopeIndex + 1, j);
                    finalString += v;
                }

                if (keyChar == '{' || keyChar == '}' || keyChar == ' ' || j == key.length - 1) {
                    if (j == key.length - 1) {
                        keyConstructor += keyChar
                    }
                    if (keyConstructor.length > 0) {
                        const keyValue = getTranslation(locale, keyConstructor);
                        if (keyValue != null) {
                            finalString += keyValue;
                        }
                    }

                    keyConstructor = '';
                } else {
                    keyConstructor += keyChar;
                }

                if (keyChar == ' ') {
                    finalString += ' ';
                }
            }

            updateElement(element, itemType, finalString);

        } else {
            const localizedValue = getTranslation(locale, key);

            if (localizedValue != null) {
                updateElement(element, itemType, localizedValue);
            }
        }
    }
}

function updateInContainer(container, locale) {
    const elements = container.querySelectorAll('[lang]');

    updateLanguage(elements, locale);
}

function updatePage(locale) {
    updateInContainer(document, locale);
}

languageChangeEvent.addListener((locale) => {
    initialLocale = locale;
    updatePage(locale);
    save(saveKey, locale);
});

export { initialLocale, updateInContainer }