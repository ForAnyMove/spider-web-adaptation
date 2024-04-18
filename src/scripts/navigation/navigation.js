class Screen {
    constructor(options = { element, openButtons, closeButtons, onFocus, onUnfocus }) {
        this.element = options.element;
        this.closeButtons = options.closeButtons;
        this.openButtons = options.openButtons;

        this.onFocus = options.onFocus;
        this.onUnfocus = options.onUnfocus;

        this.isOpened = false;
    }

    show = function () {
        if (this.element.classList.contains('fade-hidden')) {
            this.element.classList.remove('fade-hidden');
        }

        if (!this.element.classList.contains('fade-visible')) {
            this.element.classList.add('fade-visible');
        }

        this.isOpened = true;
    }
    hide = function () {
        if (this.element.classList.contains('fade-visible')) {
            this.element.classList.remove('fade-visible');
        }

        if (!this.element.classList.contains('fade-hidden')) {
            this.element.classList.add('fade-hidden');
        }

        this.isOpened = false;
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
        screen.onFocus?.();
    }

    close = function (screen) {
        screen.hide();
        screen.onUnfocus?.();
        if (this.openedScreens.length > 0) {
            this.openedScreens[this.openedScreens.length - 1].onFocus?.();
        }
    }
}

class StackNavigation extends Navigation {
    registerScreen(screen) {
        if (super.registerScreen(screen)) {
            const navigation = this;

            if (screen.openButtons && screen.openButtons.length > 0) {
                for (let i = 0; i < screen.openButtons.length; i++) {
                    const element = screen.openButtons[i];
                    element.onclick = function () {
                        navigation.push(screen);
                    }
                }
            }

            if (screen.closeButtons && screen.closeButtons.length > 0) {
                for (let i = 0; i < screen.closeButtons.length; i++) {
                    const element = screen.closeButtons[i];
                    element.onclick = function () {
                        navigation.pop();
                    }
                }
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

class BackActionHandler {
    constructor(input, onSigleBack, onDoubleBack) {
        this.onSigleBack = onSigleBack;
        this.onDoubleBack = onDoubleBack;

        this.timeout = null;
        this.backPressCount = 0;

        input.addGlobalKeyHandle('Escape', () => {
            this.handleBackAction();
        });
    }

    clear = function () {
        clearTimeout(this.timeout);
        this.timeout = null;
        this.backPressCount = 0;
    }

    handleSinglePress = function () {
        this.clear();

        this.onSigleBack?.();
    }

    handleDoublePress = function () {
        this.clear();

        this.onDoubleBack?.();
    }

    handleBackAction = function () {
        this.backPressCount++;

        if (this.backPressCount >= 2) {
            this.handleDoublePress();
            return;
        }

        this.timeout = setTimeout(() => {
            this.handleSinglePress();
        }, 200);
    }
}

export { StackNavigation, Screen, BackActionHandler }