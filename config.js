const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {

    // SESSION
    SESSION_ID: process.env.SESSION_ID || "ARSLAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTU53c0dEMWZCRXBqeUNKdm9maXdwTEFydEl0dTkvNGJacjJ4dDdJQnpsTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiajFZTjFDdyt3bTljM2lqM1dHMkhHVm8vdmFFZVNuVVpmMzdhdy9hZzlGMD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIyRjU0QlMvQ1QybjFhcVBzam9zVjNFK25lZUR3dnk1WEwwM2grZktlNkZvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI5Vkg3aHpBdnozUnduOGk1VzljaGVBbTFpS3hpODRNMllxL253R2dXNGtJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjZNNmFjVXREWWZFWEYzMmdTS3ZkVDVWdGpVdUJyajFKYlRtUXNYaU4rSHM9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im1oWmFCMVA4NXhSWnl1a0J4UXBZM2VJREJJaWJFTDdTNDJ4Y2dpOE5RV1k9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiY0E4cG9xc1gvV05MZXhGZzg5K29HME9rUzc3UXF2cm5EZ0l5RjRLbEYxOD0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiTXcxSEZjSGxCTFNRSTJrRzV3ZHFKU296WjVXVVRCb3hGK215Nnh0b0lFZz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik95dW1KU0tRUVEzT1NNRVlwR29IZXVPYzlxNnNWbHU5OUNIQnQzWUZrR1NDcHFxcFlFd3FFUGUwbVg0SGwwWTk2TXJ0WVZzQlpqYXhaZHdvaENDeGhRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTAwLCJhZHZTZWNyZXRLZXkiOiJyU01ISkpJOXIvRUZtQzR6Vkszc2ZpbmlISnJtRktGa3JPdkFsWlNUSitnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwiZGV2aWNlSWQiOiJqU3ByQnRWMVQ4YUZMZFRlMllhNXJnIiwicGhvbmVJZCI6IjEyYTFlODhlLTA4NTQtNDY1MC1hMTEwLTYyZjgzYjQzNzI4ZiIsImlkZW50aXR5SWQiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJaNTZoK0ZueVhNN3p6cUFxRkVDZ3dtd3pEOTQ9In0sInJlZ2lzdGVyZWQiOnRydWUsImJhY2t1cFRva2VuIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZHBZamN1TVYvVktMTFN0TGJmbFRpaWI5S2pVPSJ9LCJyZWdpc3RyYXRpb24iOnt9LCJwYWlyaW5nQ29kZSI6IkY2Q0FIMzY2IiwibWUiOnsiaWQiOiI5MjM0ODc2OTAxNzA6MTZAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIxNTE5MzUxNTU5NzAwNjE6MTZAbGlkIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNJZjd0b0FGRU5pT2g4a0dHQVVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJVOFZGOHNaeXZmdklPczc1WkRxK1VzbHZ5N2pvUkpETnZONkYyb2VkY2dvPSIsImFjY291bnRTaWduYXR1cmUiOiJScXBBS01UNTE4V0cxVjd2YkZ4MHVSVzBac2lWNTBpNEt3bXIwSUROZ0VPR1NVTlNlWmZkdnVBTm5lTmRvNnl4c2ZlZHQ3K2RFdXBjcDdHR3dMZXpEQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiZERqa0hhTHBWOGl4VjVGSitZZ0gwalBYNzRCMlRhRVVsYVlUZXA0VDU5eUdQNXRpdk12bEtpQnBsaTBSdk8xTGhBanRrYWFXNDFFRGdsdUh4REhTanc9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiI5MjM0ODc2OTAxNzA6MTZAcy53aGF0c2FwcC5uZXQiLCJkZXZpY2VJZCI6MH0sImlkZW50aWZpZXJLZXkiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJCVlBGUmZMR2NyMzd5RHJPK1dRNnZsTEpiOHU0NkVTUXpiemVoZHFIblhJSyJ9fV0sInBsYXRmb3JtIjoiYW5kcm9pZCIsInJvdXRpbmdJbmZvIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQ0FnSURRZ0MifSwibGFzdEFjY291bnRTeW5jVGltZXN0YW1wIjoxNzYzODIxNDEzLCJsYXN0UHJvcEhhc2giOiIyVjc3cVUiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUphbSJ9",
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
    MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/5nc2am.jpg",

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
    ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/wm5iop.jpg",
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
