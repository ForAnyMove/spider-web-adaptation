import { Assets } from "../libs/pixi.mjs";
import { Statefull } from "../src/statics/enums.js";
import { Content } from "../src/statics/staticValues.js";

const skinDatabase = {
    skinList: [
        {
            id: Content.CardSkin01,
            preview_path: "../assets/card_skins/Skin_01.png",
            item_preview_path: "../assets/card_skins/Skin_01.png",
            state: Statefull.Equipped,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin02,
            preview_path: "../assets/card_skins/Skin_02.png",
            item_preview_path: "../assets/card_skins/Skin_02.png",
            state: Statefull.AvailableToEquip,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin03,
            preview_path: "../assets/card_skins/Skin_03.png",
            item_preview_path: "../assets/card_skins/Skin_03.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin04,
            preview_path: "../assets/card_skins/Skin_04.png",
            item_preview_path: "../assets/card_skins/Skin_04.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin05,
            preview_path: "../assets/card_skins/Skin_05.png",
            item_preview_path: "../assets/card_skins/Skin_05.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin06,
            preview_path: "../assets/card_skins/Skin_06.png",
            item_preview_path: "../assets/card_skins/Skin_06.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin07,
            preview_path: "../assets/card_skins/Skin_07.png",
            item_preview_path: "../assets/card_skins/Skin_07.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin08,
            preview_path: "../assets/card_skins/Skin_08.png",
            item_preview_path: "../assets/card_skins/Skin_08.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardSkin09,
            preview_path: "../assets/card_skins/Skin_09.png",
            item_preview_path: "../assets/card_skins/Skin_09.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        }
    ]
}

const backSkinDatabase = {
    skinList: [
        {
            id: Content.CardBackSkin01,
            preview_path: "../assets/card_skins/Skin_01.png",
            item_preview_path: "../assets/card_skins/Skin_01.png",
            state: Statefull.Equipped,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin02,
            preview_path: "../assets/card_skins/Skin_02.png",
            item_preview_path: "../assets/card_skins/Skin_02.png",
            state: Statefull.AvailableToEquip,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin03,
            preview_path: "../assets/card_skins/Skin_03.png",
            item_preview_path: "../assets/card_skins/Skin_03.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin04,
            preview_path: "../assets/card_skins/Skin_04.png",
            item_preview_path: "../assets/card_skins/Skin_04.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin05,
            preview_path: "../assets/card_skins/Skin_05.png",
            item_preview_path: "../assets/card_skins/Skin_05.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin06,
            preview_path: "../assets/card_skins/Skin_06.png",
            item_preview_path: "../assets/card_skins/Skin_06.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin07,
            preview_path: "../assets/card_skins/Skin_07.png",
            item_preview_path: "../assets/card_skins/Skin_07.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin08,
            preview_path: "../assets/card_skins/Skin_08.png",
            item_preview_path: "../assets/card_skins/Skin_08.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.CardBackSkin09,
            preview_path: "../assets/card_skins/Skin_09.png",
            item_preview_path: "../assets/card_skins/Skin_09.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        }
    ]
}

const backgroundDatabase = {
    skinList: [
        {
            id: Content.Background01,
            preview_path: "../assets/card_skins/Skin_01.png",
            item_preview_path: "../assets/card_skins/Skin_01.png",
            state: Statefull.Equipped,
            unlock_rescription: ""
        },
        {
            id: Content.Background02,
            preview_path: "../assets/card_skins/Skin_02.png",
            item_preview_path: "../assets/card_skins/Skin_02.png",
            state: Statefull.AvailableToEquip,
            unlock_rescription: ""
        },
        {
            id: Content.Background03,
            preview_path: "../assets/card_skins/Skin_03.png",
            item_preview_path: "../assets/card_skins/Skin_03.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.Background04,
            preview_path: "../assets/card_skins/Skin_04.png",
            item_preview_path: "../assets/card_skins/Skin_04.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.Background05,
            preview_path: "../assets/card_skins/Skin_05.png",
            item_preview_path: "../assets/card_skins/Skin_05.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.Background06,
            preview_path: "../assets/card_skins/Skin_06.png",
            item_preview_path: "../assets/card_skins/Skin_06.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.Background07,
            preview_path: "../assets/card_skins/Skin_07.png",
            item_preview_path: "../assets/card_skins/Skin_07.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.Background08,
            preview_path: "../assets/card_skins/Skin_08.png",
            item_preview_path: "../assets/card_skins/Skin_08.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        },
        {
            id: Content.Background09,
            preview_path: "../assets/card_skins/Skin_09.png",
            item_preview_path: "../assets/card_skins/Skin_09.png",
            state: Statefull.Locked,
            unlock_rescription: ""
        }
    ]
}

function loadToAssets() {
    for (let i = 0; i < skinDatabase.skinList.length; i++) {
        const element = skinDatabase.skinList[i];
        Assets.add({ alias: element.id, src: element.preview_path });
    }
}

export { skinDatabase, backSkinDatabase, backgroundDatabase, loadToAssets }