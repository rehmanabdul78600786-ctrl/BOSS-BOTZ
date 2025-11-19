const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}

module.exports = {

    // SESSION
    SESSION_ID: process.env.SESSION_ID || "ARSLAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK08xOE9MMWFYOWE5ZkNXSXFOdWRaZTNzcS9jWFlXY2NzaVo0Rng2dUlrTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYVlGQTNvN2FmeU5WUnVjZmozWG5QeGlMb3hkWkJrOWE3d01yUkxqbzJEYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQ2dlZ25OalJRdDdNYnVtQ0tKMUZQbmlFVngxV0ZoSW04YzliQWhvY0VjPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvSlhHYVY0d3N5WEpoTnZXODhDK2VyWHppQzZpL0tGbkwyOXhEN0tEUEU4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImFDV1J0cVBuU1Z1YXFiT2hVRmFLWlV5NmtYOXJ5UEF3Snd5SFUvVmhVWFE9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkZ2TVJRbk15Q2lQQzlKMzJUU1RHOXdaMmt3Q05iemQzNW1NRmZkRlVvajA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoib01tNkhXNXArTlhuVDhENGJST3RUajd3SlU5WDgxNGtWdXorSmJQaWtYQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRzdtTlQyQWdBMUozR2xKTkVCLzVTTmtqOTZPREh6MTY0clp1aG1TcEQzYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ijl0UDV5clpHempVYTQ5ZWZzcmg5K3JsS2VQRFFGRndXQ1owZWZtREVpMEN3N09XdDIwSlFqUEVRZ2M4bURXcTRNdDFEYlpqb2NvVGZRSm5aN3c4U2hnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6NDQsImFkdlNlY3JldEtleSI6IjB1eXJSQkxVM09icUI1b25veWY4eVRpRHhVbHZYYXRBbWhqWW9VNStLZnM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiOTIzNDg3NjkwMTcwQHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkFDRTQwQ0E0QkVBM0FBMjE1NTIwMUVBOEMwOTczNkEwIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NjM1NzcxMzR9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Ijc3cXM0M01vU29xM01ycGdlUFRoZlEiLCJwaG9uZUlkIjoiZDc5YWJlMzItMmU2OS00Y2JjLTgxNTYtM2FhNWQ5NjVhMDM2IiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpTYlA2enhIWFVxQThIRFhkaUZIaXVDSmxmND0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJYVHBZdlNlVWIyL2ZTRGkxbGJnRm93N0h2MW89In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiTjkxV1lYUU4iLCJtZSI6eyJpZCI6IjkyMzQ4NzY5MDE3MDoxMkBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE1MTkzNTE1NTk3MDA2MToxMkBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0lmN3RvQUZFSjJhK01nR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlU4VkY4c1p5dmZ2SU9zNzVaRHErVXNsdnk3am9SSkROdk42RjJvZWRjZ289IiwiYWNjb3VudFNpZ25hdHVyZSI6IktacU0wMEt5TENqb1VPRk9mYVVyMHY5dmtCLzlvSDJkZ1NuamZOMkduWmNkMUVjWjdBSVkwOHMyYktwNTRkU1F0RDJOZ3JySHJHZXA5L3VqOGhmZ0RRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJxWTREWThmeUlUVURsSWVOdk9yaFZWUnBXT3IvbkY5NWJ5OWxLM2llOUpUU2taY2hYWVh2VHNtMzVuWEJBWTVZMVVwb3dFWUUyU1ljZkdnQ0JPVTdodz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzQ4NzY5MDE3MDoxMkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWUEZSZkxHY3IzN3lEck8rV1E2dmxMSmI4dTQ2RVNRemJ6ZWhkcUhuWElLIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJRFFnQyJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NjM1NzcxMzAsImxhc3RQcm9wSGFzaCI6IjJWNzdxVSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSmFtIn0=",
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
