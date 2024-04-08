import { WinCount, WinInARow, WinWithSomeStepCount, WinWithSomeTime, InGameDayCount, GameCount, UsedBoostersCount, generateTrial } from "./achievements.js";
import { Action } from "./globalEvents.js";
import { log } from "./logger.js";
import { load, save } from "./save_system/SaveSystem.js";
import { LevelType, Rule } from "./statics/enums.js";
import { Content, Items } from "./statics/staticValues.js";

class User {
    constructor() {
        this.items = [{
            type: Items.Energy,
            count: 0
        }, {
            type: Items.BoosterHint,
            count: 0
        }, {
            type: Items.BoosterUndo,
            count: 0
        }, {
            type: Items.BoosterMage,
            count: 0
        }, {
            type: Items.BoosterTime,
            count: 0
        }]

        this.availableContent = [
            Content.CardSkin01, Content.CardBackSkin01, Content.Background01,
            Content.CardSkin02, Content.CardBackSkin02, Content.Background02];

        this.usedContent = [Content.CardSkin01, Content.CardBackSkin01, Content.Background01];

        this.achievements = [];
        this.achievements.push(new InGameDayCount({ loadData: { currentValue: 0, completedIndex: 0 } }));
        this.achievements.push(new WinCount({
            trials: [
                generateTrial(3, Items.BoosterHint, 1),
                generateTrial(5, Items.BoosterTime, 1),
                generateTrial(7, Items.BoosterUndo, 1),
                generateTrial(9, Items.BoosterMage, 2),
                generateTrial(12, Items.BoosterUndo, 3),
            ],
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ],
            loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinWithSomeStepCount({ loadData: { currentValue: 0, completedIndex: 0 } }));
        this.achievements.push(new UsedBoostersCount({ loadData: { currentValue: 0, completedIndex: 0 } }));
        this.achievements.push(new WinCount({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], levelType: LevelType.Trial, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new GameCount({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], levelType: LevelType.Trial, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinWithSomeTime({ loadData: { currentValue: 0, completedIndex: 0 } }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.OneSuitSpider, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.TwoSuitsSpider, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.FourSuitsSpider, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.OneSuitSpiderLady, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.TwoSuitsSpiderLady, loadData: { currentValue: 0, completedIndex: 0 }
        }));
        this.achievements.push(new WinInARow({
            trials: [
                generateTrial(3, Items.Energy, 2),
                generateTrial(5, Items.Energy, 2),
                generateTrial(7, Items.Energy, 3),
                generateTrial(9, Items.Energy, 5),
                generateTrial(12, Items.BoosterHint, 3),
            ], rule: Rule.FourSuitsSpiderLady, loadData: { currentValue: 0, completedIndex: 0 }
        }));

        this.updateEvent = new Action();

        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];
            element.updateEvent.addListener(this.onUpdate);

            element.onLoad();
        }

        this.contentListUpdateEvent = new Action();
        this.itemListUpdateEvent = new Action();
        this.contentUsageChanged = new Action();
    }

    useContent = function (content) {

        let hasContentInUsageList = false;

        for (let i = 0; i < this.usedContent.length; i++) {
            const element = this.usedContent[i];

            if (element.type == content.type) {

                hasContentInUsageList = true;
                if (element != content && this.hasContent(content)) {
                    this.usedContent[i] = content;
                    this.contentUsageChanged.invoke(this.usedContent);

                    return;
                }
            }
        }

        if (!hasContentInUsageList) {
            this.usedContent.push(content);
        }
    }

    getContentOfType = function (type) {
        for (let i = 0; i < this.usedContent.length; i++) {
            const element = usedContent[i];
            if (element.type == type) return element;
        }
    }

    hasContent = function (content) {
        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];

            if (element == content) return true;
        }

        return false;
    }

    addContent = function (content) {
        if (content == null) return;

        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];
            if (element == content) return;
        }

        this.availableContent.push(content);
        this.contentListUpdateEvent.invoke(this.availableContent);

        log(`Update user content [${content.type.id} (${content.count})]: ${this.availableContent.map(i => ` ${i.id}`)}`, "user", "details");
    }

    addContents = function (contents) { // xd
        if (contents == null) return;

        for (let i = 0; i < contents.length; i++) {
            const element = contents[i];

            this.addContent(element.type);
        }
    }

    removeContent = function (content) {
        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];
            if (element == content) {
                this.availableContent.splice(i, 1);
                log(`Remove user content: [${element.type}, ${element.id}] ${this.availableContent.map(i => `\n\t(${i.type}, ${i.id})`)}`, "user", "details")

                this.useFirstAvalableContentOfType(content.type);

                this.contentListUpdateEvent.invoke(this.availableContent);
                return;
            }
        }
    }

    useFirstAvalableContentOfType = function (type) {
        for (let i = 0; i < this.availableContent.length; i++) {
            const element = this.availableContent[i];

            if (element.type == type) {
                this.useContent(element);
                return;
            }
        }

        for (let i = 0; i < this.usedContent.length; i++) {
            const element = this.usedContent[i];
            if (element.type == type) {
                this.usedContent.splice(i, 1);
                break;
            }
        }
    }

    addItem = function (type, count) {
        if (type == null || count == null) return;

        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].type == type) {
                this.items[i].count += count;

                log(`Update user items [${type} (${count})]: ${this.items[i].type} (${this.items[i].count})`, "user", "details");
                this.itemListUpdateEvent.invoke(this.items);
                return;
            }
        }

        this.items.push({ type: type, count: count });
        this.itemListUpdateEvent.invoke(this.items);
    }

    addItems = function (items) {
        if (items == null) return;

        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            this.addItem(element.type, element.count);
        }
    }

    hasItems = function (itemType, count = 1) {
        if (this.items == null || itemType == null) return false;

        for (let i = 0; i < this.items.length; i++) {
            const element = this.items[i];
            if (element.type == itemType) {
                return element.count >= count;
            }
        }

        return false;
    }

    removeItem = function (type, count) {
        for (let i = 0; i < this.items.length; i++) {
            if (this.items[i].type == type) {
                this.items[i].count -= count;

                if (this.items[i].count <= 0) {
                    this.items.splice(this.items.indexOf(this.items[i]), 1);
                }

                this.itemListUpdateEvent.invoke(this.items);
                return;
            }
        }

        this.itemListUpdateEvent.invoke(this.items);
    }

    onUpdate = () => {
        this.updateEvent.invoke();
    }

    unload = function () {
        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];

            element.unload();
        }
    }

    saveData = function () {
        save("user_01", { items: this.items, availableContent: this.availableContent, usedContent: this.useContent, achievements: this.achievements.map(i => i.completedIndex) });
    }

    loadData = function () {
        let data = load("user_01");

        if (data == null) return;

        this.items = data.items;
        this.availableContent = data.availableContent;
        this.usedContent = data.usedContent;

        for (let i = 0; i < this.achievements.length; i++) {
            const element = this.achievements[i];

            element.completedIndex = data.achievements[i];
        }
    }
}

const user = new User();

export { user }