const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ARSLAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWUJEeXFxZk9tY1phU0hMUEtGcThHckdxMDE5aTcwNERablJTUi9EclpsRT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNVVtWTlOeUFHYTdUa2NOdjZCQjVzNWRxNzhVRjUzb21VUEcySUtSTjV6az0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJNR2xLTktOMjNVenYwbTF2WFpCNWVzZFA2dkVjWlFXMVdvOUxwR0owYVdzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJOd3dBSkFpaE9IT0tRZk9KdFNrSVcrdFY2QUdidm9zeUNqdzJqTno0aGc0PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IitEclpkNm1lUnZ3Yy9TTDZOZi82MnNMb3BNdFR2enZZWXd0UEd1ajRaM2c9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im8zalAvcWJPdU5zN2xWVEcyRHl2U3JtbWZTQTFnTHE0L1lteVk2aTJXMjA9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoic1BxT3VTbFA1RlQySTd5aEZKSVN5Wm1WQUFrV2MrMVFpcmFFTlZHalMzaz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZlIyM25qbi9yRWUyaEdWd1E0RXZFcGVTdlZLT3owZUo1TlJKTWM3MGNIYz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InVFV2VqKzFRZmo1OU81bzhOMjlFbkhmYmlZUkZOUEdHUTVXMGRDcGlDZWplbU1ZV2o0UWI4b21lUDBXTFFDNkdTaFQwK0xnMndhaDdtLzJCTDNrNEJ3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzgsImFkdlNlY3JldEtleSI6ImoxZmdSTGs3YzM4REFxSXBDWTRKNE00MU1qL2RrQzE4aDNzS1VUb3dvTnM9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6IjVUWnBkb0FHVFMyNjNRWmxVWXJwZ2ciLCJwaG9uZUlkIjoiYWY5YmEyNTMtNDA3Ni00ZDExLWEzMDEtN2ExNGVlOTM0YjhjIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IjVaWk4zbUhHd1lkbDdFNUlSM1RWWnNuckRKdz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiI0UkV4YUFmc1BOMHlrcFcxOHdaZWg5V2ZOTDA9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiRVRCUDdRUVIiLCJtZSI6eyJpZCI6IjkyMzQ4NzY5MDE3MDoxMEBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE1MTkzNTE1NTk3MDA2MToxMEBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0liN3RvQUZFTmlXOXNnR0dBTWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlU4VkY4c1p5dmZ2SU9zNzVaRHErVXNsdnk3am9SSkROdk42RjJvZWRjZ289IiwiYWNjb3VudFNpZ25hdHVyZSI6IkJxcmZBckVMNkpsbnZwNkxUSlkxRnFRUUJEeU0zejJ2Z0F0NXpjUlFXd095ZHJmc0g0YmZURDYrUDhPU1p2azM3K2pBeG5ocnVWRkowRjBGYmQzNEFRPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJQd2xjUjBscjgwNzFxZm5OSmY1cEhSUVM5SEVBOFUraGNCZ3d6NVBCVVk2VDc2ckFmeHVXTUduRFpwQXVWbXc5UVAzWlNhTEFORnpBdWR0OVBBQWlCdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzQ4NzY5MDE3MDoxMEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWUEZSZkxHY3IzN3lEck8rV1E2dmxMSmI4dTQ2RVNRemJ6ZWhkcUhuWElLIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJRFFnQyJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NjM1NDM5MDksImxhc3RQcm9wSGFzaCI6IjJWNzdxVSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQVh2In0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status  
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY ︎꧁☆❤️❀ᴰ𝖆ṛₖᙖ𝘰§§❀❤️☆꧂👀 🤍*",
// set the auto reply massage on status reply  
ANTI_DELETE: process.env.ANTI_DELETE || "true",
// set true false for anti delete     
ANTI_DEL_PATH: process.env.ANTI_DEL_PATH || "inbox", 
// change it to 'same' if you want to resend deleted message in same chat     
WELCOME: process.env.WELCOME || "true",
// true if want welcome and goodbye msg in groups    
ADMIN_EVENTS: process.env.ADMIN_EVENTS || "false",
// make true to know who dismiss or promoted a member in group
ANTI_LINK: process.env.ANTI_LINK || "true",
// make anti link true,false for groups 
MENTION_REPLY: process.env.MENTION_REPLY || "false",
// make true if want auto voice reply if someone menetion you 
MENU_IMAGE_URL: process.env.MENU_IMAGE_URL || "https://files.catbox.moe/wb2sda.jpg",
// add custom menu and mention reply image url
PREFIX: process.env.PREFIX || ".",
// add your prifix for bot   
BOT_NAME: process.env.BOT_NAME || "❝✧ᏼ๏ꜱꜱ💘❀",
// add bot namw here for menu
STICKER_NAME: process.env.STICKER_NAME || "BOSS🤧",
// type sticker pack name 
CUSTOM_REACT: process.env.CUSTOM_REACT || "false",
// make this true for custum emoji react    
CUSTOM_REACT_EMOJIS: process.env.CUSTOM_REACT_EMOJIS || "💝,💖,💗,❤️‍🩹,❤️,🧡,💛,💚,💙,💜,🤎,🖤,🤍",
// chose custom react emojis by yourself 
DELETE_LINKS: process.env.DELETE_LINKS || "false",
// automatic delete links witho remove member 
OWNER_NUMBER: process.env.OWNER_NUMBER || "923487690170",
// add your bot owner number
OWNER_NAME: process.env.OWNER_NAME || "*BOSS*",
// add bot owner name
DESCRIPTION: process.env.DESCRIPTION || "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ BOSS ❣️*",
// add bot owner name    
ALIVE_IMG: process.env.ALIVE_IMG || "https://files.catbox.moe/qadd68.jpg",
// add img for alive msg
LIVE_MSG: process.env.LIVE_MSG || "> Zinda Hun Bro ⚡",
// add alive msg here 
READ_MESSAGE: process.env.READ_MESSAGE || "false",
// Turn true or false for automatic read msgs
AUTO_REACT: process.env.AUTO_REACT || "false",
// make this true or false for auto react on all msgs
ANTI_BAD: process.env.ANTI_BAD || "false",
// false or true for anti bad words  
MODE: process.env.MODE || "public",
// make bot public-private-inbox-group 
ANTI_LINK_KICK: process.env.ANTI_LINK_KICK || "false",
// make anti link true,false for groups 
AUTO_STICKER: process.env.AUTO_STICKER || "false",
// make true for automatic stickers 
AUTO_REPLY: process.env.AUTO_REPLY || "false",
// make true or false automatic text reply 
ALWAYS_ONLINE: process.env.ALWAYS_ONLINE || "false",
// maks true for always online 
PUBLIC_MODE: process.env.PUBLIC_MODE || "true",
// make false if want private mod
AUTO_TYPING: process.env.AUTO_TYPING || "false",
// true for automatic show typing   
READ_CMD: process.env.READ_CMD || "false",
// true if want mark commands as read 
DEV: process.env.DEV || "923487690170",
//replace with your whatsapp number        
ANTI_VV: process.env.ANTI_VV || "true",
// true for anti once view 
AUTO_RECORDING: process.env.AUTO_RECORDING || "false"
// make it true for auto recoding 
};
