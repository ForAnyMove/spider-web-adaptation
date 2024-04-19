import { getElements, setDynamicFontSize } from "../scripts/helpers.js";

export default class DynamicFontChanger {
    constructor() {
        this.texts = [];
        this.updateElementsPull();

        languageChangeEvent.addListener(this.updateTextFont);
        window.addEventListener('resize', this.updateTextFont)
    }

    updateElementsPull = function () {
        this.texts = getElements(document, { tags: ['span', 'p', 'h1', 'h2', 'h3', 'button'] });
    }

    updateTextFont = () => {
        for (let i = 0; i < this.texts.length; i++) {
            const element = this.texts[i];
            setDynamicFontSize(element);
        }
    }
}