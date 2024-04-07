import { boundsChecker } from "./cardBoundsChecker.js";
import { cardCollector } from "./cardsCollector.js";
import { DOChangeValue, DOChangeXY, Ease } from "./dotween/dotween.js";
import { Action, CanInteract, disableInteractions, enableInteractions } from "./globalEvents.js";
import { selectedRules } from "./rules/gameRules.js";
import { CardSide } from "./statics/enums.js";

const backImage = `url('../../Sprites/Card Backs/Card_Back_TV.png')`

const closedCardOffset = 0.5;
const openedCardOffset = 1.5;

export default class Card {
    constructor(suit, rank, side, domElement) {
        this.faceSkinReference = domElement.style.backgroundImage;

        this.suit = suit;
        this.rank = rank;
        this.side = side;
        this.domElement = domElement;

        this.cardColumn = null;

        this.subscribeDragAndDrop();
    }

    setClosed = function () {
        this.side = CardSide.Back;
        this.domElement.style.backgroundImage = backImage;

        if (!this.domElement.classList.contains('opened') && !this.domElement.classList.contains('closed')) {
            this.domElement.classList.add('closed');
        } else {
            this.domElement.classList.replace('opened', 'closed');
        }
    }

    setOpened = function () {
        this.side = CardSide.Face;
        this.domElement.style.backgroundImage = this.faceSkinReference;

        if (!this.domElement.classList.contains('opened') && !this.domElement.classList.contains('closed')) {
            this.domElement.classList.add('opened');
        } else {
            this.domElement.classList.replace('closed', 'opened');
        }

        this.cardColumn.recalculateFirstOpened();
    }

    open = function () {
        if (this.side == CardSide.Face) return;

        DOChangeValue(() => 1, (value) => {
            this.domElement.style.scale = `${value} 1`;
        }, 0, 0.03, Ease.SineInOut).onComplete(() => {
            this.setOpened();
            DOChangeValue(() => 0, (value) => {
                this.domElement.style.scale = `${value} 1`;
            }, 1, 0.03, Ease.SineInOut)
        });
    }

    subscribeDragAndDrop = () => {
        const domElement = this.domElement;

        domElement.onmousedown = (e) => {
            if (!CanInteract || this.side == CardSide.Back) return;

            const cards = this.cardColumn.getCardsFrom(this);

            const canRemove = this.cardColumn.canRemove && selectedRules.isCanRemove(cards);
            if (!canRemove) return;

            const columnTemp = this.cardColumn;
            const offsets = [];

            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                const offsetX = e.pageX - card.domElement.getBoundingClientRect().left;
                const offsetY = e.pageY - card.domElement.getBoundingClientRect().top;

                offsets.push({ x: offsetX, y: offsetY });
            }

            columnTemp.removeCards(cards);

            moveAt(e);

            function moveAt(e) {
                for (let i = 0; i < cards.length; i++) {
                    const card = cards[i];
                    card.domElement.style.left = e.pageX - offsets[i].x + 'px';
                    card.domElement.style.top = e.pageY - offsets[i].y + 'px';
                }
            }

            document.onmousemove = (e) => {
                moveAt(e);
            }

            domElement.onmouseup = () => {
                document.onmousemove = null;
                domElement.onmouseup = null;

                this.tryDrop(columnTemp, cards);
            }
        }
    }

    tryDrop = function (previousColumn, cards) {
        const columns = boundsChecker.getColumnsByCard(this);
        for (let i = 0; i < columns.length; i++) {
            const cardColumn = columns[i];
            if (selectedRules.isCanPlace([this], cardColumn.cards)) {
                cardColumn.translateCardsToColumn(cards, () => previousColumn.checkIfLastCardClosedAndOpen());
                return;
            }
        }

        previousColumn.translateCardsToColumn(cards);
    }

    joinToColumn = function (cardColumn) {
        this.cardColumn = cardColumn;
        this.domElement.style.position = 'relative';
        this.domElement.style.left = 0;
        this.domElement.style.top = 0;
        this.domElement.style.zIndex = null;
    }

    leaveFromColumn = function () {
        this.cardColumn = null;

        const pos = { x: this.domElement.getBoundingClientRect().left, y: this.domElement.getBoundingClientRect().top };
        this.domElement.style.position = 'absolute';
        document.body.appendChild(this.domElement);

        this.domElement.style.left = `${pos.x}px`;
        this.domElement.style.top = `${pos.y}px`;
        this.domElement.style.zIndex = 1000;
    }
}

class CardColumn {
    constructor(domElement) {
        this.domElement = domElement;

        this.cards = [];

        this.canPlace = true;
        this.canRemove = true;

        this.cardAddedEvent = new Action();
        this.cardRemovedEvent = new Action();
    }

    lock = function () {
        if (this.locked) return;
        this.locked = true;

        this.lockedCanPlaceState = this.canPlace;
        this.lockedCanRemoveState = this.canRemove;

        this.setCantPlace();
        this.setCantRemove();

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            card.domElement.classList.add('locked')
        }

        this.lockElement = document.createElement('div');
        this.lockElement.classList.add('card-locker-hidden');
        this.domElement.appendChild(this.lockElement)

        setTimeout(() => {
            this.lockElement.classList.replace('card-locker-hidden', 'card-locked-showed');
        }, 100);
    }

    unlock = function () {
        if (!this.locked) return;
        this.locked = false;

        if (this.lockedCanPlaceState) {
            this.setCanPlace();
        }

        if (this.lockedCanRemoveState) {
            this.setCanRemove();
        }

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            card.domElement.classList.remove('locked')
        }
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

    getCardsFrom = function (card) {
        const cards = [];

        let canGrab = false;
        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            if (element == card || canGrab) {
                cards.push(element);
                canGrab = true;
            }
        }

        return cards;
    }

    translateCardsToColumnWithOffset = function (cards, finishCallback, horzontalOffset, verticalOffset, options = { affectInteraction: true, addCards: true, openOnFinish: false }) {
        if (cards == null || cards.length == 0) return;

        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            if (element.cardColumn != null) {
                element.cardColumn.removeCard(element);
            }
        }

        const firstCard = cards[0];

        const targetPosition = { x: this.domElement.getBoundingClientRect().left, y: this.domElement.getBoundingClientRect().top };
        const vwOffset = window.innerWidth / 100;


        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            if (element.domElement.classList.contains('opened')) {
                targetPosition.y += vwOffset * verticalOffset.opened;
                targetPosition.x += vwOffset * horzontalOffset.opened;
            } else if (!element.domElement.classList.contains('locked')) {
                targetPosition.y += vwOffset * verticalOffset.closed;
                targetPosition.x += vwOffset * horzontalOffset.closed;
            }
        }

        if (options.affectInteraction) {
            disableInteractions();
        }

        DOChangeXY(() => { return { x: firstCard.domElement.getBoundingClientRect().left, y: firstCard.domElement.getBoundingClientRect().top } }, (value) => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                card.domElement.style.left = `${value.x + (i * vwOffset * horzontalOffset.opened)}px`;
                card.domElement.style.top = `${value.y + (i * vwOffset * verticalOffset.opened)}px`;
            }
        }, targetPosition, 0.08, Ease.SineOut).onComplete(() => {
            for (let i = 0; i < cards.length; i++) {
                const card = cards[i];
                if (options.addCards) {
                    this.addCard(card);
                }

                if (options.openOnFinish) {
                    card.open();
                }

                finishCallback?.();

                if (options.affectInteraction) {
                    enableInteractions();
                }
            }
        });
    }

    translateCardsToColumn = function (cards, finishCallback, options = { affectInteraction: true, addCards: true, openOnFinish: false }) {
        this.translateCardsToColumnWithOffset(cards, finishCallback, { opened: 0, closed: 0 }, { opened: openedCardOffset, closed: closedCardOffset }, options);
    }

    addCard = function (card) {
        if (this.cards.includes(card)) return;

        this.cards.push(card);
        this.cardAddedEvent.invoke();

        card.joinToColumn(this);
        this.domElement.appendChild(card.domElement);
        this.recalculateFirstOpened();
        this.checkIfColumnHasCollectedCardsSet();
    }

    removeCard = function (card) {
        if (this.cards.includes(card)) {

            this.cards.splice(this.cards.indexOf(card), 1);
            this.cardRemovedEvent.invoke();

            card.leaveFromColumn();
        }
    }

    removeCards = function (cards) {
        for (let i = 0; i < cards.length; i++) {
            const element = cards[i];
            this.removeCard(element)
        }
    }

    checkIfLastCardClosedAndOpen = function () {
        if (this.cards.length == 0) return;

        const card = this.cards[this.cards.length - 1];
        if (card.side == CardSide.Back) {
            card.open();
        }
    }

    checkIfColumnHasCollectedCardsSet = function () {
        const result = selectedRules.isCardSetCollectable(this.cards);

        if (result.isTrue) {
            cardCollector.collect(result.cards, this);
        }
    }

    recalculateFirstOpened = function () {
        let firstSetup = false;

        for (let i = 0; i < this.cards.length; i++) {
            const card = this.cards[i];
            if (!firstSetup && card.side == CardSide.Face) {

                firstSetup = true;
                card.domElement.classList.add('first');
                continue;
            }
            card.domElement.classList.remove('first');
        }
    }

    getOpenedCards = function () {
        if (this.cards == null || this.cards.length == 0) return null;

        const cards = [];

        for (let i = 0; i < this.cards.length; i++) {
            const element = this.cards[i];
            if (element.side == CardSide.Face) {
                cards.push(element);
            }
        }

        return cards.length > 0 ? cards : null;
    }

    getLastCard = function () {
        if (this.cards == null || this.cards.length == 0) return null;

        return this.cards[this.cards.length - 1];
    }
}

export { CardColumn }