const config = require('../config');
const { cmd } = require('../command');

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

*Reply with 1-5 to view VIP commands.*
0️⃣ Back to Main Menu`
            }
        };

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
• vipgroup
• vipautoreply
• vipschedule
• vipweather
• vipquotes
• vipsearch
• vipcrypto
0️⃣ Back to VIP Menu` }
        };

        const sendMenu = async (caption, quoted) => {
            try {
                return await conn.sendMessage(from, {
                    image: { url: config.MENU_IMAGE_URL || 'https://files.catbox.moe/yj7zp0.png' },
                    caption,
                    contextInfo
                }, { quoted });
            } catch {
                return await conn.sendMessage(from, { text: caption, contextInfo }, { quoted });
            }
        };

        const sentMenuMsg = await sendMenu(mainMenuCaption, mek);
        const MENU_ID = sentMenuMsg.key.id;

        let state = "MAIN";  // MAIN or VIP

        const handler = async (data) => {
            try {
                const msg = data.messages[0];
                if (!msg?.message || msg.key.fromMe) return;

                const isReply = msg.message?.extendedTextMessage?.contextInfo?.stanzaId === MENU_ID;
                if (!isReply) return;

                const text =
                    msg.message.conversation ||
                    msg.message.extendedTextMessage?.text ||
                    "";

                const option = text.trim();

                // BACK LOGIC
                if (option === "0") {
                    if (state === "VIP") {
                        await sendMenu(menuData['11'].content, msg);
                        return;
                    }
                    state = "MAIN";
                    await sendMenu(mainMenuCaption, msg);
                    return;
                }

                // MAIN MENU
                if (state === "MAIN" && menuData[option]) {

                    if (option === "11") {
                        state = "VIP";
                        await sendMenu(menuData['11'].content, msg);
                        return;
                    }

                    await sendMenu(menuData[option].content, msg);
                    return;
                }

                // VIP SUBMENUS
                if (state === "VIP" && vipSubMenu[option]) {
                    await sendMenu(vipSubMenu[option].content, msg);
                    return;
                }

                // INVALID OPTION
                await conn.sendMessage(from, {
                    text: "❌ Invalid option! Reply with a valid number."
                });

            } catch (err) {
                console.log("Menu handler error:", err);
            }
        };

        conn.ev.on("messages.upsert", handler);

        setTimeout(() => conn.ev.off("messages.upsert", handler), 300000);

    } catch (err) {
        console.error(err);
        reply("❌ Error occurred while opening the menu.");
    }
});
