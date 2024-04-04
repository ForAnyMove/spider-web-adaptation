import { isSuitableRankStuck } from "./rules/gameRules.js";
import { CardSide } from "./statics/enums.js";

function useHintBooster(playableColumns, gameRule) {
    // if (!_lockerPool.IsAvailable) return false;

    const pairs = [];

    for (let i = 0; i < playableColumns.length; i++) {
        const column = playableColumns[i];

        let columnCards = [];

        if (column.cards.length == 1) {
            columnCards.push(column.cards[0]);
        }
        else if (column.cards.length > 1) {
            const suitableList = [];

            for (let j = column.cards.length - 1; j >= 0; j--) {
                const current = column.cards[j];

                const checkList = [].concat(suitableList);
                // const checkList = suitableList.concat([current]);
                checkList.push(current);
                // checkList.reverse();

                // console.log(checkList);

                if (current.side == CardSide.Back ||
                    (!isSuitableRankStuck(checkList).isTrue &&
                        suitableList.length > 0))
                    break;

                suitableList.push(current);
            }

            suitableList.reverse();
            columnCards = suitableList.length == 0
                ? []
                : suitableList;
        }

        let pair =
        {
            column: column,
            cards: columnCards
        };

        pairs.push(pair);
    }


    for (let i = 0; i < pairs.length; i++) {
        for (let j = 0; j < pairs.length; j++) {
            if (i == j || !pairs[j].column.canPlace) continue;

            const cardOne = pairs[i].cards;
            if (cardOne.length == 0 || pairs[j].cards.length == 0) continue;

            if (pairs[j].column.canPlace && gameRule.isCanPlace(cardOne, pairs[j].column.cards)) {
                // Activate(playableColumns, pairs[i], pairs[j]);
                return { isTrue: true, result: [pairs[i], pairs[j]] };
            }
        }
    }

    return false;
}

export { useHintBooster }