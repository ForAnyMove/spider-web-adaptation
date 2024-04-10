import { Statefull } from "../statics/enums.js";
import { Content } from "../statics/staticValues.js";

const skinDatabase = {
    skinList: [
        {
            id: Content.CardSkin01,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_01.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_01.png",
            unlockDescription: "1"
        },
        {
            id: Content.CardSkin02,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_02.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_02.png",
            unlockDescription: "2"
        },
        {
            id: Content.CardSkin03,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_03.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_03.png",
            unlockDescription: "3"
        },
        {
            id: Content.CardSkin04,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_04.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_04.png",
            unlockDescription: "4"
        },
        {
            id: Content.CardSkin05,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_05.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_05.png",
            unlockDescription: "5"
        },
        {
            id: Content.CardSkin06,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_06.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_06.png",
            unlockDescription: "6"
        },
        {
            id: Content.CardSkin07,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_07.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_07.png",
            unlockDescription: "7"
        },
        {
            id: Content.CardSkin08,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_08.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_08.png",
            unlockDescription: "8"
        },
        {
            id: Content.CardSkin09,
            previewPath: "../../Sprites/Card Skins/Preview/Skin_09.png",
            itemPreviewPath: "../../Sprites/Card Skins/Preview/Skin_09.png",
            unlockDescription: "9"
        }
    ]
}

function getSkinImage(content, suit, rank) {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const element = skinDatabase.skinList[i];
        const index = i + 1;

        if (element.id == content) {
            return `url('../../Sprites/Card Skins/Release/Skin_${(index > 9 ? index : `0${index}`)}/${rank}_${suit}_${(index > 9 ? index : `0${index}`)}.png')`
        }
    }
}

const backSkinDatabase = {
    skinList: [
        {
            id: Content.CardBackSkin01,
            previewPath: "../../Sprites/CardBacks/Card_Back_01.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_01.png",
            unlockDescription: "1"
        },
        {
            id: Content.CardBackSkin02,
            previewPath: "../../Sprites/CardBacks/Card_Back_02.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_02.png",
            unlockDescription: "2"
        },
        {
            id: Content.CardBackSkin03,
            previewPath: "../../Sprites/CardBacks/Card_Back_03.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_03.png",
            unlockDescription: "3"
        },
        {
            id: Content.CardBackSkin04,
            previewPath: "../../Sprites/CardBacks/Card_Back_04.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_04.png",
            unlockDescription: "4"
        },
        {
            id: Content.CardBackSkin05,
            previewPath: "../../Sprites/CardBacks/Card_Back_05.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_05.png",
            unlockDescription: "5"
        },
        {
            id: Content.CardBackSkin06,
            previewPath: "../../Sprites/CardBacks/Card_Back_06.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_06.png",
            unlockDescription: "6"
        },
        {
            id: Content.CardBackSkin07,
            previewPath: "../../Sprites/CardBacks/Card_Back_07.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_07.png",
            unlockDescription: "7"
        },
        {
            id: Content.CardBackSkin08,
            previewPath: "../../Sprites/CardBacks/Card_Back_08.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_08.png",
            unlockDescription: "8"
        },
        {
            id: Content.CardBackSkin09,
            previewPath: "../../Sprites/CardBacks/Card_Back_09.png",
            itemPreviewPath: "../../Sprites/CardBacks/Card_Back_09.png",
            unlockDescription: "9"
        }
    ]
}

function getSkinBackImage(content) {
    for (let i = 0; i < backSkinDatabase.skinList.length; i++) {
        const element = backSkinDatabase.skinList[i];
        if (element.id == content) {
            return `url(${element.previewPath})`;
        }
    }
}

const backgroundDatabase = {
    skinList: [
        {
            id: Content.Background01,
            previewPath: "../../Sprites/Backgrounds/Release/Background_01.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_01.png",
            unlockDescription: ""
        },
        {
            id: Content.Background02,
            previewPath: "../../Sprites/Backgrounds/Release/Background_02.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_02.png",
            unlockDescription: ""
        },
        {
            id: Content.Background03,
            previewPath: "../../Sprites/Backgrounds/Release/Background_03.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_03.png",
            unlockDescription: "1"
        },
        {
            id: Content.Background04,
            previewPath: "../../Sprites/Backgrounds/Release/Background_04.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_04.png",
            unlockDescription: "2"
        },
        {
            id: Content.Background05,
            previewPath: "../../Sprites/Backgrounds/Release/Background_05.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_05.png",
            unlockDescription: "3"
        },
        {
            id: Content.Background06,
            previewPath: "../../Sprites/Backgrounds/Release/Background_06.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_06.png",
            unlockDescription: "4"
        },
        {
            id: Content.Background07,
            previewPath: "../../Sprites/Backgrounds/Release/Background_07.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_07.png",
            unlockDescription: "5"
        },
        {
            id: Content.Background08,
            previewPath: "../../Sprites/Backgrounds/Release/Background_08.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_08.png",
            unlockDescription: "6"
        },
        {
            id: Content.Background09,
            previewPath: "../../Sprites/Backgrounds/Release/Background_09.png",
            itemPreviewPath: "../../Sprites/BackgroundPreview/Used_Background_09.png",
            unlockDescription: "7"
        }
    ]
}


function getBackgroundImage(content) {
    for (let i = 0; i < backgroundDatabase.skinList.length; i++) {
        const element = backgroundDatabase.skinList[i];
        if (element.id == content) {
            return `url(${element.previewPath})`;
        }
    }
}

export { skinDatabase, backSkinDatabase, backgroundDatabase, getSkinImage, getSkinBackImage, getBackgroundImage }