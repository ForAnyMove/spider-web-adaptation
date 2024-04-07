import { animator } from "./animator.js";
import { DelayedCall } from "./dotween/dotween.js";
import { CanInteract, disableInteractions, enableInteractions } from "./globalEvents.js";

class Croupier {
    constructor(options = { mainCardColumn, playableCardColumns }) {
        this.mainCardColumn = options.mainCardColumn;
        this.playableCardColumns = options.playableCardColumns;

        this.firstDistribution = [];
        this.defaultDistribution = [];
    }

    initialDistribution = function () {
        this.distribute([].concat(this.firstDistribution));
    }

    ingameDistribution = function () {
        this.distribute([].concat(this.defaultDistribution));
    }

    distribute = function (distributions) {
        if (!CanInteract || distributions.length == 0 || this.mainCardColumn.cards.length == 0) return;

        const mc = this.mainCardColumn;
        const pc = this.playableCardColumns;

        let time = 0;
        function update(dt) {
            time += dt * 60 / 1000;
            if (time >= 0.03) {
                if (distributions.length == 0 || mc.cards.length == 0) {
                    animator.removeRequest(update);
                    enableInteractions();
                    return;
                }

                const dist = distributions[0];
                const card = mc.cards[mc.cards.length - 1];
                pc[dist.column].translateCardsToColumnWithOffset([card], null, { opened: 0, closed: 0 }, { opened: 1.25, closed: 0.5 }, { affectInteraction: false, addCards: true, openOnFinish: dist.opened });
                distributions.splice(0, 1);

                time = 0;
            }
        }

        disableInteractions();
        animator.addRequest(update);
    }
}

class SpiderCroupier extends Croupier {
    constructor(options = { mainCardColumn, playableCardColumns }) {
        super(options);

        for (let i = 0; i < this.playableCardColumns.length; i++) {
            this.defaultDistribution.push({ column: i, opened: true });
        }
        for (let i = 0; i < 54; i++) { // 54
            const index = i % 10;
            const opened = i > 43; // 43

            this.firstDistribution.push({ column: index, opened: opened });
        }
    }
}

class SpiderLadyCroupier extends Croupier {
    constructor(options = { mainCardColumn, playableCardColumns }) {
        super(options);

        for (let i = 0; i < this.playableCardColumns.length; i++) {
            this.defaultDistribution.push({ column: i, opened: true });
        }

        let iterations = 0;
        while (iterations < this.playableCardColumns.length) {
            for (let i = iterations; i < this.playableCardColumns.length; i++) {
                this.firstDistribution.push({ column: i, opened: i == iterations ? true : false })
            }

            iterations++;
        }
    }
}

export { SpiderCroupier, SpiderLadyCroupier }