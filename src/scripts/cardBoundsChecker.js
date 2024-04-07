
const closedCardOffset = 0.5;
const openedCardOffset = 1.5;

class BoundsChecker {
    registerColumns = function (columns) {
        this.columns = columns;
    }

    getColumnsByCard = function (card) {
        const cardPosition = { x: card.domElement.getBoundingClientRect().left, y: card.domElement.getBoundingClientRect().top }
        const cardSize = { x: card.domElement.offsetWidth, y: card.domElement.offsetHeight }

        const suitableColumns = [];
        const vwOffset = window.innerWidth / 100;

        function getColumnHeight(column) {
            let height = 0;
            for (let i = 0; i < column.cards.length; i++) {
                const card = column.cards[i];
                if (card.domElement.classList.contains('opened')) {
                    height += vwOffset * openedCardOffset;
                } else {
                    height += vwOffset * closedCardOffset;
                }
            }

            height -= vwOffset * openedCardOffset;
            return height;
        }

        for (let i = 0; i < this.columns.length; i++) {
            const column = this.columns[i];

            const columnPosition = { x: column.domElement.getBoundingClientRect().left, y: column.domElement.getBoundingClientRect().top }
            const columnSize = { x: cardSize.x, y: cardSize.y + getColumnHeight(column) }

            if ((cardPosition.x < columnPosition.x + columnSize.x) && (cardPosition.x + cardSize.x > columnPosition.x) &&
                (cardPosition.y < columnPosition.y + columnSize.y) && (cardPosition.y + cardSize.y > columnPosition.y)) {
                suitableColumns.push(column);
            }
        }

        return suitableColumns;
    }
}

const boundsChecker = new BoundsChecker();

export { boundsChecker }