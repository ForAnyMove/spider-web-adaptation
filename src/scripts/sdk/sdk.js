import { error } from "../logger.js";

let ysdk;
let player;

function isLocalHost() {
    let host = window.location.hostname;
    return host === "localhost" || host === "127.0.0.1";
}

function showRewarded(openCallback, closeCallback, rewardCallback, errorCallback) {
    if (ysdk == null || isLocalHost()) {
        error("SKD is undefined or script launched on localhost", "sdk");
        return;
    }

    ysdk.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => {
                openCallback?.();
            }, onRewarded: () => {
                rewardCallback?.();
            }, onClose: () => {
                closeCallback?.();
            }, onError: (e) => {
                errorCallback?.();
            }
        }
    });
}

function showInterstitial(closeCallback, errorCallback) {
    if (ysdk == null || isLocalHost()) {
        error("SKD is undefined or script launched on localhost", "sdk");
        return;
    }

    ysdk.adv.showFullscreenAdv({
        callbacks: {
            onClose: function (wasShown) {
                closeCallback?.(wasShown);
            }, onError: function (error) {
                errorCallback?.(error);
            }
        }
    });
}

function processExit() {
    if (ysdk == null || isLocalHost()) {
        error("SKD is undefined or script launched on localhost", "sdk");
        return;
    }

    ysdk.dispatchEvent(ysdk.EVENTS.EXIT);
}

function getPlatforms() {
    if (ysdk == null || isLocalHost()) {
        error("SKD is undefined or script launched on localhost", "sdk");
        return { desktop: true, mobile: false, tablet: false, tv: false };
    }

    const desktop = YaGames.deviceInfo.isDesktop();
    const mobile = YaGames.deviceInfo.isMobile();
    const tablet = YaGames.deviceInfo.isTablet();
    const tv = /SMART-TV|Tizen|Web0S|NetCast|HbbTV|Opera TV|CE-HTML|TV|Television/i.test(navigator.userAgent) || YaGames.deviceInfo.isTV();

    const object = { desktop: desktop, mobile: mobile, tablet: tablet, tv: tv };

    return object;
}

function saveUserData(data) {
    if (ysdk == null || player == null || isLocalHost()) {
        error("SKD/Player is undefined or script launched on localhost", "sdk");
        return;
    }

    player.setData(data);
}

function loadUserData(key) {
    if (ysdk == null || player == null || isLocalHost()) {
        error("SKD/Player is undefined or script launched on localhost", "sdk");
        return "";
    }

    player.getData([key]).then(data => {
        return data;
    });

    return "";
}

function getDefaultLanguage() {
    if (ysdk == null || player == null || isLocalHost()) {
        error("SKD/Player is undefined or script launched on localhost", "sdk");
        return "ru";
    }

    return ysdk.environment.i18n.lang;
}

async function initilize() {
    try {
        ysdk = await YaGames.init();
        player = await ysdk.getPlayer({ scopes: false });
    } catch (err) {
        error("Failed to load SDK", "sdk");
    }
}

await initilize();

export { saveUserData, loadUserData }