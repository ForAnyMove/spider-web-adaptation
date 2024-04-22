import { getElements } from "./helpers.js";
import { load, save } from "./save_system/SaveSystem.js";

class AudioManager {
    constructor() {
        this.enabledMusicIcon = './Sprites/Icons/Icon_Music_On.png';
        this.disabledMusicIcon = './Sprites/Icons/Icon_Music_Off.png';
        this.enabledSoundIcon = './Sprites/Icons/Icon_Sound_On.png';
        this.disabledSoundIcon = './Sprites/Icons/Icon_Sound_Off.png';

        this.soundSwitchButton = document.getElementById('sound-switch');
        this.musicSwitchButton = document.getElementById('music-switch');

        this.musicAudioElement = document.getElementById('backgroundMusic');
        this.butonAudionElement = document.getElementById('buttonClick');

        this.isMusicEnabled = load('music', true);
        this.isSoundEnabled = load('sound', true);

        if (this.isMusicEnabled) {
            document.addEventListener("click", () => {
                this.musicAudioElement.play();
            });
        } else {
            this.musicAudioElement.muted = true;
        }

        this.clickables = getElements(document, { tags: ['button', 'a', 'img'] });
        for (let i = 0; i < this.clickables.length; i++) {
            const element = this.clickables[i];
            if (element.click == null) continue;
            element.addEventListener('click', () => {
                this.butonAudionElement.play();
            })
        }

        this.soundSwitchButton.addEventListener('click', () => {
            this.switchSoundState();
        });

        this.musicSwitchButton.addEventListener('click', () => {
            this.switchMusicState();
        });

        this.updateSwitchButtonIcons();
    }

    addClickableToPull = function (clickable) {
        this.clickables.push(clickable);
        clickable.addEventListener('click', () => {
            this.butonAudionElement.play();
        })
    }

    switchMusicState = function () {
        this.isMusicEnabled = !this.isMusicEnabled;
        save('music', this.isMusicEnabled);

        if (this.isMusicEnabled) {
            this.musicAudioElement.play();
            this.musicAudioElement.muted = false;
        } else {
            this.musicAudioElement.muted = true;
        }

        this.updateSwitchButtonIcons();
    }

    switchSoundState = function () {
        this.isSoundEnabled = !this.isSoundEnabled;

        if (this.isSoundEnabled) {
            this.butonAudionElement.muted = false;
        } else {
            this.butonAudionElement.muted = true;
        }
        save('sound', this.isSoundEnabled);

        this.updateSwitchButtonIcons();
    }

    updateSwitchButtonIcons = function () {
        this.soundSwitchButton.children[0].src = this.isSoundEnabled ? this.enabledSoundIcon : this.disabledSoundIcon;
        this.musicSwitchButton.children[0].src = this.isMusicEnabled ? this.enabledMusicIcon : this.disabledMusicIcon;
    }
}

export { AudioManager }