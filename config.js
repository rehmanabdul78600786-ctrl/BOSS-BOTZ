const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {

    // SESSION
    SESSION_ID: process.env.SESSION_ID || "",
    // add your Session Id

    // STATUS FEATURES
    AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
    AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
    AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
    AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY ꧁BOSS꧂🤍*",

    // ANTI DELETE
    ANTI_DELETE: process.env.ANTI_DELETE || "true",
    ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox",

    // GROUP FEATURES
    WELCOME: process.env.WELCOME || "true",
    ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
    ANTI_LINK: process.env.ANTI_LINK || "true",
    ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",

    // MENTION FEATURES
    MENTION_REPLY: process.env.MENTION_REPLY || "false",
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/wb2sda.jpg",

    // BOT BASIC SETTINGS
    PREFIX: process.env.PREFIX || ".",
    BOT_NAME: process.env.BOT_NAME || "❝✧ᏼ๏ꜱꜱ💘❀",
    STICKER_NAME: process.env.STICKER_NAME || "BOSS🤧",

    // CUSTOM REACTION
    CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
    CUSTOM_REACT_EMOJIS:
        process.env.CUSTOM_REACT_EMOJIS ||
        "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",

    // AUTO DELETE LINKS
    DELETE_LINKS: process.env.DELETE_LINKS || "false",

    // OWNER SETTINGS
    OWNER_NUMBER: process.env.OWNER_NUMBER || "923487690170",
    OWNER_NAME: process.env.OWNER_NAME || "*BOSS*",
    DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ BOSS ❣️*",

    // ALIVE SETTINGS
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/qadd68.jpg",
    LIVE_MSG: process.env.LIVE_MSG || "> Zinda Hun Bro ⚡",

    // AUTO ACTIONS
    READ_MESSAGE: process.env.READ_MESSAGE || "false",
    AUTO_REACT: process.env.AUTO_REACT || "false",
    ANTI_BAD: process.env.ANTI_BAD || "false",
    AUTO_STICKER: process.env.AUTO_STICKER || "false",
    AUTO_REPLY: process.env.AUTO_REPLY || "false",

    // MODES
    MODE: process.env.MODE || "public",
    PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
    ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",

    // UI ACTIONS
    AUTO_TYPING: process.env.AUTO_TYPING || "false",
    AUTO_RECORDING: process.env.AUTO_RECORDING || "false",
    READ_CMD: process.env.READ_CMD || "false",

    // SECURITY
    ANTI_VV: process.env.ANTI_VV || "true",

    // DEV INFO
    DEV: process.env.DEV || "923487690170"
};
