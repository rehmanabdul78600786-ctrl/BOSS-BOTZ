const config = require('../config');
const { cmd, commands } = require('../command');

// =====================================================================
// PING COMMAND
// =====================================================================

cmd({
    pattern: "ping",
    alias: ["speed", "pong"],
    desc: "Check bot's response time.",
    category: "main",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, quoted, sender, reply }) => {
    try {
        const start = Date.now();

        const reactionEmojis = ['🔥', '⚡', '🚀', '💨', '🎯', '🎉', '🌟', '💥', '🕐', '🔹'];
        const textEmojis = ['💎', '🏆', '⚡️', '🚀', '🎶', '🌠', '🌀', '🔱', '🛡️', '✨'];

        const reactionEmoji = reactionEmojis[Math.floor(Math.random() * reactionEmojis.length)];
        let textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];

        // Prevent same emoji for reaction and text
        while (textEmoji === reactionEmoji) {
            textEmoji = textEmojis[Math.floor(Math.random() * textEmojis.length)];
        }

        // React to message
        await conn.sendMessage(from, {
            react: { text: reactionEmoji, key: mek.key }
        });

        const speed = Date.now() - start;

        const message = `> *BOSS_MD SPEED: ${speed}ms ${textEmoji}*`;

        await conn.sendMessage(from, {
            text: message,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363348739987203@newsletter',
                    newsletterName: "❝✧ᏼ๏ꜱꜱ💘❀",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Ping Command Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});


// =====================================================================
// PING2 COMMAND
// =====================================================================

cmd({
    pattern: "ping2",
    desc: "Check bot's response time.",
    category: "main",
    react: "🍂",
    filename: __filename
},
async (conn, mek, m, ctx) => {
    try {
        const { from, reply } = ctx;

        const startTime = Date.now();

        const temp = await conn.sendMessage(from, { text: '*Pinging... ⏳*' });

        const endTime = Date.now();
        const ping = endTime - startTime;

        await conn.sendMessage(from, {
            text: `*🔥 BOSS_MD SPEED: ${ping}ms*`
        }, { quoted: temp });

    } catch (e) {
        console.log("Ping2 Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
