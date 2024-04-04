import { Action } from "./globalEvents.js";

export default class Card {
    constructor(suit, rank, side) {
        this.suit = suit;
        this.rank = rank;
        this.side = side;
    }
}

class CardColumn {
    constructor() {
        this.cards = [];

        this.canPlace = true;
        this.canRemove = true;

        this.cardAddedEvent = new Action();
        this.cardRemovedEvent = new Action();
    }

    setCanPlace = function () {
        this.canPlace = true;
    }

    setCantPlace = function () {
        this.canPlace = false;
    }

    setCanRemove = function () {
        this.canRemove = true;
    }

    setCantRemove = function () {
        this.canRemove = false;
    }

    addCard = function (card) {
        if (this.cards.includes(card)) return;

        this.cards.push(card);
        this.cardAddedEvent.invoke();
    }

    removeCard = function (card) {
        if (this.cards.includes(card)) {

            this.cards.pop(card);
            this.cardRemovedEvent.invoke();
        }
    }
}

export { CardColumn }