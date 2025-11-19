const config = require('../config');
const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "menu",
    desc: "Show interactive menu system",
    category: "menu",
    react: "🧾",
    filename: __filename
}, async (conn, mek, m, { from, reply }) => {
    try {
        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        const mainMenuCaption = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
┃★ Owner: *${config.OWNER_NAME}*
╰━━━━━━━━━━━━━━━┈⊷
📋 *Choose a category to explore:*
> Reply with the matching number to open the menu

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

        // Menu data
        const menuData = {
            '1': { title: "Download Menu", content: "📥 Commands: play, ytmp3, ytmp4..." },
            '2': { title: "Group Menu", content: "👥 Commands: add, remove, kickall..." },
            '3': { title: "Fun Menu", content: "😄 Commands: joke, shapar, hack..." },
            '4': { title: "Owner Menu", content: "👑 Commands: block, unblock, restart..." },
            '5': { title: "AI Menu", content: "🤖 Commands: ai, gpt3, imagine..." },
            '6': { title: "Anime Menu", content: "🎎 Commands: waifu, neko, animegirl..." },
            '7': { title: "Convert Menu", content: "🔄 Commands: sticker, tts, base64..." },
            '8': { title: "Other Menu", content: "📌 Commands: timenow, calculate, define..." },
            '9': { title: "Reactions Menu", content: "💞 Commands: hug, kiss, poke..." },
            '10': { title: "Main Menu", content: "🏠 Commands: alive, ping, menu..." },
            '11': { 
                title: "VIP Menu", 
                content: `💎 VIP Categories:

1️⃣ Music
2️⃣ Stats & Boost
3️⃣ AI & Tools
4️⃣ Fun & Media
5️⃣ Utilities

*Reply with 1-5 to view VIP commands for that category.*
0️⃣ Back to Main Menu`
            }
        };

        // VIP sub-menu data
        const vipSubMenu = {
            '1': { title: "VIP Music", content: `🎵 VIP Music Commands:
• vipplay [song]
• vipdownload [url]
0️⃣ Back to VIP Menu` },
            '2': { title: "VIP Stats & Boost", content: `📊 VIP Stats & Boost Commands:
• vipstats
• vipboost
• vipbackup
• vipprofile
0️⃣ Back to VIP Menu` },
            '3': { title: "VIP AI & Tools", content: `🤖 VIP AI & Tools Commands:
• vipai
• vipimagine
• viptranslate
• viptts
0️⃣ Back to VIP Menu` },
            '4': { title: "VIP Fun & Media", content: `🤣 VIP Fun & Media Commands:
• vipmeme
• vipsticker
• vipfun
0️⃣ Back to VIP Menu` },
            '5': { title: "VIP Utilities", content: `🛠️ VIP Utilities Commands:
• vipgroup [manage group]
• vipautoreply
• vipschedule
• vipweather
• vipquotes
• vipsearch
• vipcrypto
0️⃣ Back to VIP Menu` }
        };

        // Send menu function
        const sendMenu = async (caption, quoted) => {
            try {
                return await conn.sendMessage(from, {
                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
                    caption,
                    contextInfo
                }, { quoted });
            } catch (e) {
                return await conn.sendMessage(from, { text: caption, contextInfo }, { quoted });
            }
        };

        const sentMenuMsg = await sendMenu(mainMenuCaption, mek);
        const mainMessageID = sentMenuMsg.key.id;

        // Handler
        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const receivedText = receivedMsg.message.conversation || receivedMsg.message.extendedTextMessage?.text;
                const senderID = receivedMsg.key.remoteJid;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === mainMessageID;
                if (!isReplyToMenu) return;

                // Back logic
                if (receivedText === '0') {
                    await sendMenu(mainMenuCaption, receivedMsg);
                    await conn.sendMessage(senderID, { react: { text: '↩️', key: receivedMsg.key } });
                    return;
                }

                // Main menu selection
                if (menuData[receivedText]) {
                    const selectedMenu = menuData[receivedText];
                    if (receivedText === '11') {
                        await sendMenu(selectedMenu.content, receivedMsg);
                    } else {
                        await sendMenu(selectedMenu.content, receivedMsg);
                    }
                    await conn.sendMessage(senderID, { react: { text: '✅', key: receivedMsg.key } });
                }
                // VIP sub-menu selection
                else if (vipSubMenu[receivedText]) {
                    const selectedVIP = vipSubMenu[receivedText];
                    await sendMenu(selectedVIP.content, receivedMsg);
                    await conn.sendMessage(senderID, { react: { text: '✅', key: receivedMsg.key } });
                }
                else {
                    await conn.sendMessage(senderID, {
                        text: `❌ Invalid Option!\nReply with the correct number to select a menu.\n> ${config.DESCRIPTION}`,
                        contextInfo
                    }, { quoted: receivedMsg });
                }

            } catch (e) {
                console.log('Handler error:', e);
            }
        };

        conn.ev.on("messages.upsert", handler);

        // Remove listener after 5 minutes
        setTimeout(() => {
            conn.ev.off("messages.upsert", handler);
        }, 300000);

    } catch (e) {
        console.error('Menu Error:', e);
        await conn.sendMessage(from, { text: `❌ Menu system busy. Try later.\n> ${config.DESCRIPTION}` }, { quoted: mek });
    }
});
