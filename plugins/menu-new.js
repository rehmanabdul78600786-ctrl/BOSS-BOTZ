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
        const menuCaption = `╭━━━〔 *${config.BOT_NAME}* 〕━━━┈⊷
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

        const contextInfo = {
            mentionedJid: [m.sender],
            forwardingScore: 999,
            isForwarded: true
        };

        const sendMenuImage = async () => {
            try {
                return await conn.sendMessage(
                    from,
                    {
                        image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
                        caption: menuCaption,
                        contextInfo
                    },
                    { quoted: mek }
                );
            } catch (e) {
                console.log('Image send failed, sending text instead');
                return await conn.sendMessage(from, { text: menuCaption, contextInfo }, { quoted: mek });
            }
        };

        let sentMsg;
        try {
            sentMsg = await Promise.race([
                sendMenuImage(),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
            ]);
        } catch (e) {
            console.log('Menu send error:', e);
            sentMsg = await conn.sendMessage(from, { text: menuCaption, contextInfo }, { quoted: mek });
        }

        const messageID = sentMsg.key.id;

        // Menu content
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
            '11': { title: "VIP Menu", content: "💎 VIP Commands:\n• vipplay [song]\n• vipdownload [url]\n• vipstats\n• vipboost" }
        };

        const handler = async (msgData) => {
            try {
                const receivedMsg = msgData.messages[0];
                if (!receivedMsg?.message || !receivedMsg.key?.remoteJid) return;

                const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;
                if (!isReplyToMenu) return;

                const receivedText = receivedMsg.message.conversation ||
                    receivedMsg.message.extendedTextMessage?.text;
                const senderID = receivedMsg.key.remoteJid;

                if (menuData[receivedText]) {
                    const selectedMenu = menuData[receivedText];
                    await conn.sendMessage(senderID, { text: selectedMenu.content, contextInfo }, { quoted: receivedMsg });
                    await conn.sendMessage(senderID, { react: { text: '✅', key: receivedMsg.key } });
                } else {
                    await conn.sendMessage(senderID, {
                        text: `❌ Invalid Option!\nReply with 1-11 to select a menu.\n> ${config.DESCRIPTION}`,
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
                
