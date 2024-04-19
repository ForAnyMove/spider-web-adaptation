import { getElements, setDynamicContainerText, setDynamicFontSize } from "../scripts/helpers.js";

export default class DynamicFontChanger {
    constructor() {
        this.texts = [];
        this.containers = [];
        this.updateElementsPull();

        if (languageChangeEvent) { languageChangeEvent.addListener(this.updateTextFont); }
        window.addEventListener('resize', this.updateTextFont)

        this.updateTextFont();
    }

    updateElementsPull = function () {
        this.containers = [];
        this.texts = getElements(document, { tags: ['span', 'p', 'h1', 'h2', 'h3'] });

        const getContainer = (parent) => {
            for (let i = 0; i < this.containers.length; i++) {
                const container = this.containers[i];
                if (container.container == parent) {
                    return container;
                }
            }

            return null;
        }

        for (let i = 0; i < this.texts.length; i++) {
            const text = this.texts[i];
            const parent = text.parentElement;

            const sameContainer = getContainer(parent);
            if (sameContainer != null) {
                sameContainer.elements.push(text);
            } else {
                this.containers.push({
                    container: parent,
                    elements: [text]
                })
            }
        }
    }

    updateTextFont = () => {
        for (let i = 0; i < this.containers.length; i++) {
            const container = this.containers[i];
            setDynamicContainerText(container);
        }
    }
}