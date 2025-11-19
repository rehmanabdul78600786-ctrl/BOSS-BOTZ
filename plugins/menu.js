const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "menu",
    desc: "Interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {

        // Basic context info
        const ctx = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        // MAIN MENU
        const mainMenu = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★ Owner: *${config.OWNER_NAME}*
╰━━━━━━━━━━━━━━━┈⊷

📋 *Reply with a number to open a menu:*

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

> ${config.DESCRIPTION}`;

        // MENU DATA
        const menus = {
            "1": "📥 *Download Menu*\n• play\n• ytmp3\n• ytmp4\n• video\n• song",
            "2": "👥 *Group Menu*\n• add\n• remove\n• kickall\n• promote\n• demote",
            "3": "😄 *Fun Menu*\n• joke\n• hack\n• shayri\n• truth\n• dare",
            "4": "👑 *Owner Menu*\n• block\n• unblock\n• restart\n• ban\n• leave",
            "5": "🤖 *AI Menu*\n• ai\n• gpt\n• imagine\n• dalle\n• chatgpt",
            "6": "🎎 *Anime Menu*\n• waifu\n• neko\n• animegirl\n• loli\n• hinata",
            "7": "🔄 *Convert Menu*\n• sticker\n• tts\n• toimg\n• tourl\n• base64",
            "8": "📌 *Other Menu*\n• define\n• time\n• info\n• fact\n• calculator",
            "9": "💞 *Reactions Menu*\n• hug\n• kiss\n• slap\n• poke\n• bite",
            "10": "🏠 *Main Menu*\n• alive\n• menu\n• ping\n• runtime",
            "11": `💎 *VIP MENU CATEGORIES*\n
1️⃣ VIP Music  
2️⃣ VIP Stats  
3️⃣ VIP AI  
4️⃣ VIP Fun  
5️⃣ VIP Utility  

Reply with 1–5 to open VIP menus.
0️⃣ Back to Main Menu`
        };

        // VIP SUBMENUS
        const vipMenus = {
            "1": "🎵 *VIP Music*\n• vipplay\n• vipdownload\n• vipmix\n• vipaudio",
            "2": "📊 *VIP Stats*\n• vipstats\n• vipboost\n• vipbackup\n• vipprofile",
            "3": "🤖 *VIP AI Tools*\n• vipai\n• vipimagine\n• viptranslate\n• viptts",
            "4": "🤣 *VIP Fun*\n• vipmeme\n• vipsticker\n• vipfun\n• vipquote",
            "5": "🛠️ *VIP Utility*\n• vipweather\n• vipsearch\n• vipcrypto\n• vipschedule"
        };

        // Send main menu
        const sent = await conn.sendMessage(from, {
            image: { url: config.MENU_IMAGE_URL || "https://files.catbox.moe/yj7zp0.png" },
            caption: mainMenu,
            contextInfo: ctx
        }, { quoted: mek });

        const MENU_ID = sent.key.id;
        let state = "MAIN";

        // Handler
        const handler = async (data) => {
            try {
                const msg = data.messages[0];
                if (!msg || msg.key.fromMe) return;

                const stanza = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
                if (stanza !== MENU_ID) return;

                let txt =
                    msg.message?.conversation ||
                    msg.message?.extendedTextMessage?.text ||
                    "";

                txt = txt.trim();

                // BACK TO MAIN
                if (txt === "0") {
                    state = "MAIN";
                    await conn.sendMessage(from, { text: mainMenu, contextInfo: ctx }, { quoted: msg });
                    return;
                }

                // MAIN MENU LIST
                if (state === "MAIN" && menus[txt]) {
                    if (txt === "11") {
                        state = "VIP";
                    }
                    await conn.sendMessage(from, { text: menus[txt], contextInfo: ctx }, { quoted: msg });
                    return;
                }

                // VIP SUBMENU
                if (state === "VIP" && vipMenus[txt]) {
                    await conn.sendMessage(from, { text: vipMenus[txt], contextInfo: ctx }, { quoted: msg });
                    return;
                }

                // INVALID OPTION
                await conn.sendMessage(from, {
                    text: "❌ Invalid option! Reply with a valid number."
                }, { quoted: msg });

            } catch (err) {
                console.log("Menu error:", err);
            }
        };

        conn.ev.on("messages.upsert", handler);

        // Auto remove handler after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (err) {
        console.error("MENU ERROR:", err);
        reply("❌ Error occurred while opening the menu.");
    }
});
