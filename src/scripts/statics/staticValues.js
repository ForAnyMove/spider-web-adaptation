import { ContentType } from "./enums.js"

const Platform = {
    Desktop: "desktop",
    Mobile: "mobile",
    Tablet: "tablet",
    TV: "tv",
}

const AccessibilityFlags = {
    CanPlace: 1,
    CanRemove: 2
}

const Items = {
    Energy: "energy",
    BoosterHint: "booster_hint",
    BoosterUndo: "booster_undo",
    BoosterMage: "booster_mage",
    BoosterTime: "booster_time",
    Trophy01: "trophy_01",
    Trophy02: "trophy_02",
    Trophy03: "trophy_03",
    Trophy04: "trophy_04",
    Trophy05: "trophy_05",
}

const Content = {
    CardSkin01: { type: ContentType.CardSkin, id: "card_skin_01" },
    CardSkin02: { type: ContentType.CardSkin, id: "card_skin_02" },
    CardSkin03: { type: ContentType.CardSkin, id: "card_skin_03" },
    CardSkin04: { type: ContentType.CardSkin, id: "card_skin_04" },
    CardSkin05: { type: ContentType.CardSkin, id: "card_skin_05" },
    CardSkin06: { type: ContentType.CardSkin, id: "card_skin_06" },
    CardSkin07: { type: ContentType.CardSkin, id: "card_skin_07" },
    CardSkin08: { type: ContentType.CardSkin, id: "card_skin_08" },
    CardSkin09: { type: ContentType.CardSkin, id: "card_skin_09" },
    //
    CardBackSkin01: { type: ContentType.CardBack, id: "card_back_skin_01" },
    CardBackSkin02: { type: ContentType.CardBack, id: "card_back_skin_02" },
    CardBackSkin03: { type: ContentType.CardBack, id: "card_back_skin_03" },
    CardBackSkin04: { type: ContentType.CardBack, id: "card_back_skin_04" },
    CardBackSkin05: { type: ContentType.CardBack, id: "card_back_skin_05" },
    CardBackSkin06: { type: ContentType.CardBack, id: "card_back_skin_06" },
    CardBackSkin07: { type: ContentType.CardBack, id: "card_back_skin_07" },
    CardBackSkin08: { type: ContentType.CardBack, id: "card_back_skin_08" },
    CardBackSkin09: { type: ContentType.CardBack, id: "card_back_skin_09" },
    //
    Background01: { type: ContentType.Background, id: "background_01" },
    Background02: { type: ContentType.Background, id: "background_02" },
    Background03: { type: ContentType.Background, id: "background_03" },
    Background04: { type: ContentType.Background, id: "background_04" },
    Background05: { type: ContentType.Background, id: "background_05" },
    Background06: { type: ContentType.Background, id: "background_06" },
    Background07: { type: ContentType.Background, id: "background_07" },
    Background08: { type: ContentType.Background, id: "background_08" },
    Background09: { type: ContentType.Background, id: "background_09" },
}

export { Items, Content, Platform }