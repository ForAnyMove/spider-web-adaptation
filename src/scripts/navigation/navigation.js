class Screen {
    constructor(options = { element, openButton, closeButton, onOpen, onClose }) {
        this.element = options.element;
        this.closeButton = options.closeButton;
        this.openButton = options.openButton;
        this.onOpen = options.onOpen;
        this.onClose = options.onClose;
    }

    show = function () {
        if (this.element.classList.contains('fade-hidden')) {
            this.element.classList.remove('fade-hidden');
        }

        if (!this.element.classList.contains('fade-visible')) {
            this.element.classList.add('fade-visible');
        }
    }
    hide = function () {
        if (this.element.classList.contains('fade-visible')) {
            this.element.classList.remove('fade-visible');
        }

        if (!this.element.classList.contains('fade-hidden')) {
            this.element.classList.add('fade-hidden');
        }
    }
}

class Navigation {
    constructor() {
        this.registredScreens = [];
        this.openedScreens = [];
    }

    registerScreen(screen) {
        if (this.registredScreens.includes(screen)) return false;

        this.registredScreens.push(screen);
        return true;
    }

    open = function (screen) {
        screen.show();
        screen.onOpen?.();
    }

    close = function (screen) {
        screen.hide();
        screen.onClose?.();
    }
}

class StackNavigation extends Navigation {
    registerScreen(screen) {
        if (super.registerScreen(screen)) {
            const navigation = this;

            if (screen.openButton) screen.openButton.onclick = function () {
                navigation.push(screen);
            }

            if (screen.closeButton) screen.closeButton.onclick = function () {
                navigation.pop();
            }
        }
    }

    push = function (screen) {
        if (this.openedScreens.includes(screen)) return;
        this.openedScreens.push(screen);

        this.open(screen);
    }

    pop = function () {
        if (this.openedScreens.length <= 0) return;

        const lastScreen = this.openedScreens.pop();
        this.close(lastScreen);
    }
}

export { StackNavigation, Screen }