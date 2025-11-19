const fs = require('fs');
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function convertToBool(text, fault = 'true') {
    return text === fault ? true : false;
}
module.exports = {
SESSION_ID: process.env.SESSION_ID || "ARSLAN-MD~eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiME9nWThUdXNxRzZLdjJ3RVN1WFFkcmFYTmIzaVNZM3lGcis2aFYzSmhsYz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiK21DZ3d5R1oxM05tMnRWbmkyMkhDOW9scXZnazZFMFVsWkQ5T1FLbGlWND0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJJQi9RR1U3K0RZc3pMRWJIRzY3TDhNaEF2clB4SUNPdUhqdkJaQjkvVDBrPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ1ZG9JZXExU3gzcTRQU01RbVIzaFVINk1GaEpWR2QwemwzUFA5eFd0emprPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IldMc1BhK2NvYy9xVDdxWGZDYlhUMzBDUDdNT20zRGRGWWk0c3FDZXc5MUU9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InJWVGEwdXJjVS9OYUJLWHRwMHphcDJOVGk5REg0bXlRTXFCTjNJTlIyQmM9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiV0VPS1hxWnJPSWkwN2FVOFhUSmpGSFl0Ukp3TUxUeVVjZ1A2RXVrY2IyTT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiZVZmQm1nZ0tENTl5bnZnK0dZOFZNdDNoRlRGTit3OU0wNG5XNzJneC9nOD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IlRVRmlTM2xZaUszdGN0czhQU2ZCcmQxOWt5cXZEMldYSFZqd05VOXovZkl1VVRPeHIvUWtqU3k2dnJHai82cmZSQldHazg4Um1ObXZtVVROTkRYNUR3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzcsImFkdlNlY3JldEtleSI6ImtNNHBJOE9mTHFwdzl3bFRMQmNPZXJsNTFiMFVjMmNiK0xDL2tMbDZCckk9IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbXSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjAsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJkZXZpY2VJZCI6Ijk4ME5OU3ZkUWNPd2pGR0xab3hZX3ciLCJwaG9uZUlkIjoiNTNkYTU4MzUtMTliMy00M2M2LTg4OWQtYTA4MTM3MzRmN2JjIiwiaWRlbnRpdHlJZCI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ilo2YnF2YS9IVWkxM3ZwUUkyVzQ1UDlEdWJCaz0ifSwicmVnaXN0ZXJlZCI6dHJ1ZSwiYmFja3VwVG9rZW4iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJvckRlN0JDUjJTVmRQbHpXWGVid3V2aG5iVjA9In0sInJlZ2lzdHJhdGlvbiI6e30sInBhaXJpbmdDb2RlIjoiQ1I0UERTTFQiLCJtZSI6eyJpZCI6IjkyMzQ4NzY5MDE3MDoxMUBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjE1MTkzNTE1NTk3MDA2MToxMUBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ0liN3RvQUZFTzJJOThnR0dBUWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlU4VkY4c1p5dmZ2SU9zNzVaRHErVXNsdnk3am9SSkROdk42RjJvZWRjZ289IiwiYWNjb3VudFNpZ25hdHVyZSI6Ind2a0VaTXN3S1hzdmdRdVd1dWJzcXcyMTJ3SUlRWndhd2ZvVjRnMStmSjZpSml4Q1ZUaHVaT2tZTUxWWmFVajh2REc3a3VIT3ZRamNFYnBYT29zOUR3PT0iLCJkZXZpY2VTaWduYXR1cmUiOiJQZC81eGlpNmc0WXV2SWczQTZ6dXJWUjFLQzNVZmY2U1JYSzRDeHZjc3dSd0w5NmZNVzVGWDZiU0JwT3hCZEdsVWxJUlErZHhWQXNITzh6UWRMQStCQT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjkyMzQ4NzY5MDE3MDoxMUBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWUEZSZkxHY3IzN3lEck8rV1E2dmxMSmI4dTQ2RVNRemJ6ZWhkcUhuWElLIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQWdJRFFnQyJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NjM1NTg1MjIsImxhc3RQcm9wSGFzaCI6IjJWNzdxVSIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBQVh2In0=",
// add your Session Id 
AUTO_STATUS_SEEN: process.env.AUTO_STATUS_SEEN || "true",
// make true or false status auto seen
AUTO_STATUS_REPLY: process.env.AUTO_STATUS_REPLY || "false",
// make true if you want auto reply on status 
AUTO_STATUS_REACT: process.env.AUTO_STATUS_REACT || "true",
// make true if you want auto reply on status  
AUTO_STATUS_MSG: process.env.AUTO_STATUS_MSG || "*SEEN YOUR STATUS BY ︎꧁BOSS꧂🤍*",
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
