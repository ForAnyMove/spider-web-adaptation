import { CanInteract } from "./globalEvents.js";
import { selectedRules } from "./rules/gameRules.js";

class CardSelector {
    constructor() {
        this.selectedCards = [];
        this.selectedColumn = null;
    }

    select = function (column, cards) {
        if (!CanInteract) return;

        if (this.selectedCards.length == 0) {
            if (!column.canRemove || !selectedRules.isCanRemove(cards)) return;

            this.selectedCards = cards;
            this.selectedColumn = column;

            for (let i = 0; i < this.selectedCards.length; i++) {
                const card = this.selectedCards[i];
                card.domElement.classList.add('selected');
            }

            return;
        }

        for (let i = 0; i < this.selectedCards.length; i++) {
            const card = this.selectedCards[i];
            card.domElement.classList.remove('selected');
        }

        if (column.canPlace && selectedRules.isCanPlace(this.selectedCards, cards)) {
            column.translateCardsToColumn(this.selectedCards, () => {
                this.selectedColumn.checkIfLastCardClosedAndOpen();

                this.selectedCards = [];
                this.selectedColumn = null;
            });
        } else {
            this.selectedColumn.addCards(this.selectedCards);
            this.selectedCards = [];
            this.selectedColumn = null;
        }

    }
}

const cardSelector = new CardSelector();

export { cardSelector }