import { createElement, createImage, createTextSpan, getIconByItem } from "./helpers.js";
import { showRewarded } from "./sdk/sdk.js";

const popupElement = document.getElementById('bounty-popup');
if (popupElement != null) {

    const rewardsContainer = document.getElementById('bounty-container');
    const adsContainer = document.getElementsByClassName('double-bounty-by-ads-container')[0];

    const adsButton = document.getElementsByClassName('get-double-bounty-btn')[0];
    const closeButton = document.getElementsByClassName('cancel-bounty-btn')[0];

    const clearItems = () => {
        const items = rewardsContainer.getElementsByClassName('bounty');

        for (let i = items.length - 1; i >= 0; i--) {
            items[i].remove();
        }
    }

    function showPopup() {
        if (popupElement.classList.contains('fade-visible')) return;

        if (popupElement.classList.contains('fade-hidden')) {
            popupElement.classList.replace('fade-hidden', 'fade-visible');
            return;
        }

        popupElement.classList.add('fade-visible');
    }

    const hidePopup = () => {
        if (popupElement.classList.contains('fade-hidden')) return;

        adsButton.onclick = null;
        popupElement.onclick = null;
        clearItems();

        input?.updateQueryCustom(input.backup.selectableElements, input.backup.selected);
        if (input) {
            input.backup = null;
        }

        if (popupElement.classList.contains('fade-visible')) {
            popupElement.classList.replace('fade-visible', 'fade-hidden');
            return;
        }

        popupElement.classList.add('fade-hidden');
    }

    closeButton.onclick = function () {
        hidePopup();
    }

    function startAdsCase() {
        adsContainer.classList.remove('hidden');

        setTimeout(() => adsButton.classList.replace('fade-hidden', 'fade-visible'), 500);
        setTimeout(() => closeButton.classList.replace('fade-hidden', 'fade-visible'), 2000);
    }

    function startDefaultCase() {
        if (!adsContainer.classList.contains('hidden')) {
            adsContainer.classList.add('hidden');
        }
    }

    function createRewardView(data) {
        const container = createElement('div', ['bounty'], { scale: 0 });
        {
            createImage(['bounty-icon'], null, container, getIconByItem(data.type));
            createTextSpan(['bounty-title'], null, container, `x${data.count}`);
        }

        setTimeout(() => {
            container.style.scale = 1;
        }, 100);

        return container;
    }

    const receiveReward = (data) => {
        showPopup();
        input?.backupCurrentState();

        for (let i = 0; i < data.items.length; i++) {
            const item = data.items[i];
            const rewardView = createRewardView(item);
            rewardsContainer.appendChild(rewardView);
        }

        if (data.monetized) {
            startAdsCase();

            adsButton.onclick = function () {
                data.monetized = false;
                showRewarded(null, null, () => receiveReward(data), null);
            }

            input?.updateQueryCustom([{ element: adsButton }, { element: closeButton }], { element: adsButton });
        } else {
            startDefaultCase();

            setTimeout(() => {
                popupElement.onclick = hidePopup;
            }, 400);

            input?.updateQueryCustom([], { element: popupElement, onBack: () => popupElement?.click() });
        }
    }

    user.onItemsPublicReceive.addListener(receiveReward);
}