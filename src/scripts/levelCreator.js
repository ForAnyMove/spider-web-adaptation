import { boundsChecker } from './cardBoundsChecker.js';
import Card, { CardColumn } from './cardModel.js';
import { cardCollector } from './cardsCollector.js';
import { SpiderCroupier, SpiderLadyCroupier } from './croupier.js';
import { getSkinBackImage, getSkinImage } from './data/card_skin_database.js';
import { shuffle } from './helpers.js';
import { changeRules, selectedRules } from './rules/gameRules.js';
import { CardSide, ContentType, Pattern, RanksStringList } from './statics/enums.js';
import { Content } from './statics/staticValues.js';

let croupier = null;
let allCards = [];

function createCollectableCardColumns() {
    let collectContainers = document.getElementsByClassName('cards-container');
    let cardColums = [];

    for (let i = 0; i < collectContainers.length; i++) {
        const container = collectContainers[i];

        const cardColumn = new CardColumn(container);
        cardColums.push(cardColumn);
    }

    cardCollector.registerCardColums(cardColums);
}


function generateCards() {
    const skin = 1;

    const ranks = RanksStringList;
    const suits = selectedRules.suits;
    const decks = selectedRules.deckCount;

    let columnContainers = document.getElementsByClassName('playable-card-column');

    let cardColumns = [];

    for (let i = 0; i < columnContainers.length; i++) {
        const container = columnContainers[i];

        const cardColumn = new CardColumn(container);
        cardColumns.push(cardColumn);
    }

    boundsChecker.registerColumns(cardColumns);

    const mainCardsContainer = document.getElementById('extra-cards-container')
    const mainCardColumn = new CardColumn(mainCardsContainer);

    mainCardColumn.setCantPlace();
    mainCardColumn.setCantRemove();

    let selectedFaceSkin = user.getContentOfType(ContentType.CardSkin) ?? Content.CardSkin01;
    let selectedBackSkin = user.getContentOfType(ContentType.CardBack) ?? Content.CardBackSkin01;

    const generatedCards = [];

    for (let i = 0; i < decks; i++) {
        for (let j = 0; j < suits.length; j++) {
            const suit = suits[j];

            for (let k = 0; k < ranks.length; k++) {
                const rank = ranks[k];

                const cardElement = document.createElement('div');

                cardElement.style.backgroundSize = "100% 100%";

                cardElement.id = `card_${rank}_${suit}_${(skin > 9 ? skin : `0${skin}`)}`;
                cardElement.classList.add('card-element');

                const cardModel = new Card(suit, k + 1, CardSide.Face, cardElement);

                cardModel.setupCardFaceImage(selectedFaceSkin);
                cardModel.setupCardBackImage(selectedBackSkin);

                generatedCards.push(cardModel);
            }
        }
    }

    allCards = generatedCards;

    shuffle(generatedCards);
    shuffle(generatedCards);

    for (let i = 0; i < generatedCards.length; i++) {
        const cardModel = generatedCards[i];

        mainCardColumn.addCard(cardModel);
        cardModel.setClosed();
    }
    return { mainCardColumn: mainCardColumn, playableCardColumns: cardColumns };
}

function createLevel(options = { rules }) {
    changeRules(options.rules);

    createCollectableCardColumns();
    const result = generateCards();

    croupier = selectedRules.pattern == Pattern.Spider ? new SpiderCroupier({ mainCardColumn: result.mainCardColumn, playableCardColumns: result.playableCardColumns }) : new SpiderLadyCroupier({ mainCardColumn: result.mainCardColumn, playableCardColumns: result.playableCardColumns });
    // setTimeout(() => croupier.initialDistribution(), 500);
    // setTimeout(() => {
    //     for (let i = 0; i < result.playableCardColumns.length; i++) {
    //         const element = result.playableCardColumns[i];
    //         element.lock();
    //     }
    // }, 3000);
    croupier.initialDistribution();

    user.contentUsageChanged.addListener(() => {
        const skin = user.getContentOfType(ContentType.CardSkin);
        const back = user.getContentOfType(ContentType.CardBack);

        for (let i = 0; i < allCards.length; i++) {
            const card = allCards[i];

            card.setupCardFaceImage(skin);
            card.setupCardBackImage(back);
        }
    })

    return { croupier: croupier, playableCardColumns: result.playableCardColumns, mainCardColumn: result.mainCardColumn }
}

export { createLevel }