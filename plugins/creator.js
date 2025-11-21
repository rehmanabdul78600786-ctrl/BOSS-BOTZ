const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "creator",
    alias: ["coder", "dev"],
    desc: "👑 Show bot creator information",
    category: "info",
    react: "👑",
    filename: __filename
},
async (conn, mek, m, { from, sender, reply }) => {
    try {
        // Owner information
        const ownerInfo = {
            name: "꧁༒♛ 𝔅𝔒𝔖𝔖 ♛༒꧂",
            number: "+923487690170",
            photo: "https://files.catbox.moe/lcpy9f.jpg",
            bio: "The creator of this amazing bot"
        };

        // Formatted message
        const creatorMessage = `
╭───「 👑 *CREATOR INFO* 👑 」───
│
│ 🪪 *Name:* ${ownerInfo.name}
│ 📞 *Number:* ${ownerInfo.number}
│ 📝 *Bio:* ${ownerInfo.bio}
│
│ 🤖 *Bot Name:* ${config.BOT_NAME || "BOSS-BOT"}
│ ⚡ *Version:* ${config.VERSION || "4.0.0"}
│
╰─────────────────────

💡 *Contact for bot queries or support*`;

        // Send message with owner photo
        await conn.sendMessage(from, {
            image: { url: ownerInfo.photo },
            caption: creatorMessage,
            contextInfo: {
                mentionedJid: [sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: mek });

    } catch (error) {
        console.error("Creator Command Error:", error);
        // Fallback text-only message
        await reply(`👑 *Creator Info*\n\nName: ꧁༒♛ 𝔅𝔒𝔖𝔖 ♛༒꧂\nNumber: +923487690170\nBio: The creator of this amazing bot\n\n🤖 Bot Name: ${config.BOT_NAME || "BOSS-BOT"}\n⚡ Version: ${config.VERSION || "4.0.0"}\n\n💡 Contact for bot queries or support.`);
    }
});
