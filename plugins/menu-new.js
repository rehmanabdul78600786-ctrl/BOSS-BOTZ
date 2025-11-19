const config = require('../config');
const { cmd } = require('../command');

// MASTER MENU DATA – unlimited nested menus supported
const MENU_STRUCTURE = {
    main: {
        title: `${config.BOT_NAME} Main Menu`,
        text: `
╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★ Owner: *${config.OWNER_NAME}*
╰━━━━━━━━━━━━━━━┈⊷

1️⃣ Download Menu
2️⃣ Group Menu
3️⃣ Fun Menu
4️⃣ Owner Menu
5️⃣ AI Menu
6️⃣ Anime Menu
7️⃣ Convert Menu
8️⃣ Other Menu
9️⃣ Reactions Menu
🔟 Main Menu
1️⃣1️⃣ VIP Menu

Send a number to open a menu.
        `,
        next: {
            "1": "download",
            "2": "group",
            "3": "fun",
            "4": "owner",
            "5": "ai",
            "6": "anime",
            "7": "convert",
            "8": "other",
            "9": "reactions",
            "10": "main",
            "11": "vip"
        }
    },

    download: {
        title: "📥 Download Menu",
        text: `
📥 *DOWNLOAD MENU*
• play
• ytmp3
• ytmp4
• song
• video

0️⃣ Back`,
        next: { "0": "main" }
    },

    group: {
        title: "👥 Group Menu",
        text: `
👥 *GROUP MENU*
• add
• remove
• kickall
• demote
• promote

0️⃣ Back`,
        next: { "0": "main" }
    },

    fun: {
        title: "🤣 Fun Menu",
        text: `
🤣 *FUN MENU*
• joke
• hack
• roast
• shayari

0️⃣ Back`,
        next: { "0": "main" }
    },

    owner: {
        title: "👑 Owner Menu",
        text: `
👑 *OWNER MENU*
• block
• unblock
• restart
• getdb

0️⃣ Back`,
        next: { "0": "main" }
    },

    ai: {
        title: "🤖 AI Menu",
        text: `
🤖 *AI MENU*
• ai
• gpt
• imagine
• dalle

0️⃣ Back`,
        next: { "0": "main" }
    },

    anime: {
        title: "🎎 Anime Menu",
        text: `
🎎 *ANIME MENU*
• waifu
• neko
• animegirl

0️⃣ Back`,
        next: { "0": "main" }
    },

    convert: {
        title: "🔄 Convert Menu",
        text: `
🔄 *CONVERT MENU*
• sticker
• tts
• base64

0️⃣ Back`,
        next: { "0": "main" }
    },

    other: {
        title: "📌 Other Menu",
        text: `
📌 *OTHER MENU*
• time
• quote
• define

0️⃣ Back`,
        next: { "0": "main" }
    },

    reactions: {
        title: "💞 Reactions Menu",
        text: `
💞 *REACTIONS MENU*
• hug
• slap
• kiss
• poke

0️⃣ Back`,
        next: { "0": "main" }
    },

    // VIP MENU (with submenus)
    vip: {
        title: "💎 VIP MENU",
        text: `
💎 *VIP MENU*

1️⃣ VIP Music
2️⃣ VIP Tools
3️⃣ VIP Stats
4️⃣ VIP Media
5️⃣ VIP Utilities

0️⃣ Back`,
        next: {
            "1": "vip_music",
            "2": "vip_tools",
            "3": "vip_stats",
            "4": "vip_media",
            "5": "vip_utils",
            "0": "main"
        }
    },

    vip_music: {
        title: "🎵 VIP Music",
        text: `
🎵 *VIP MUSIC*
• vipplay
• vipdownload
• vipsong

0️⃣ Back`,
        next: { "0": "vip" }
    },

    vip_tools: {
        title: "🛠 VIP Tools",
        text: `
🛠 *VIP TOOLS*
• vipimagine
• vipgpt
• viptts
• vipqr

0️⃣ Back`,
        next: { "0": "vip" }
    },

    vip_stats: {
        title: "📊 VIP Stats",
        text: `
📊 *VIP STATS*
• vipstats
• vipboost
• viprank

0️⃣ Back`,
        next: { "0": "vip" }
    },

    vip_media: {
        title: "🎬 VIP Media",
        text: `
🎬 *VIP MEDIA*
• vipmeme
• vipstick
• vipgif

0️⃣ Back`,
        next: { "0": "vip" }
    },

    vip_utils: {
        title: "⚙️ VIP Utilities",
        text: `
⚙️ *VIP UTILITIES*
• vipcrypto
• vipweather
• vipsearch
• vipschedule

0️⃣ Back`,
        next: { "0": "vip" }
    }
};


// Live menu sessions per user
const userMenuSession = {};


// Sends Menu
async function sendMenu(conn, to, menuKey, quoted) {
    const menu = MENU_STRUCTURE[menuKey];
    if (!menu) return;

    await conn.sendMessage(to, {
        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
        caption: `*${menu.title}*\n${menu.text}`,
        contextInfo: { forwardingScore: 999, isForwarded: true }
    }, { quoted });

    return true;
}



// MENU COMMAND
cmd({
    pattern: "menu",
    desc: "Dynamic Menu",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from }) => {

    // Start session
    userMenuSession[from] = "main";

    await sendMenu(conn, from, "main", mek);
});


// MESSAGE LISTENER — handles menu navigation
function menuHandler(msg, conn) {
    try {
        const m = msg.messages[0];
        if (!m?.message || m.key.fromMe) return;

        const from = m.key.remoteJid;
        const userInput = m.message.conversation || m.message.extendedTextMessage?.text;
        if (!userInput) return;

        if (!userMenuSession[from]) return; // User is not in a menu

        const currentMenu = userMenuSession[from];
        const nextMenu = MENU_STRUCTURE[currentMenu].next[userInput];

        if (!nextMenu) {
            conn.sendMessage(from, { text: "❌ Invalid option! Use valid number." });
            return;
        }

        // update menu session
        userMenuSession[from] = nextMenu;

        // send next menu
        sendMenu(conn, from, nextMenu, m);

        conn.sendMessage(from, { react: { key: m.key, text: "✅" } });

    } catch (e) {
        console.log("Menu Handler Error:", e);
    }
}

module.exports = {
    menuHandler
};
