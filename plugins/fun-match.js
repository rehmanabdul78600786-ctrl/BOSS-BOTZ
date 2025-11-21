const { cmd } = require("../command");

// Helper function to pick a random participant excluding the bot
const getRandomParticipant = (participants, botId) => {
    const eligible = participants.filter(p => p.id !== botId);
    if (eligible.length === 0) return null;
    return eligible[Math.floor(Math.random() * eligible.length)];
};

// Command for random boy selection
cmd({
    pattern: "bacha",
    alias: ["boy", "larka"],
    desc: "Randomly selects a boy from the group",
    react: "👦",
    category: "fun",
    filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        const botId = conn.user.id.split("@")[0] + "@s.whatsapp.net";
        const randomUser = getRandomParticipant(groupMetadata.participants, botId);

        if (!randomUser) return reply("❌ No eligible participants found!");

        await conn.sendMessage(mek.chat, {
            text: `👦 *Yeh lo tumhara Bacha!* \n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎`,
            mentions: [randomUser.id]
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in .bacha command:", error);
        reply(`❌ Error: ${error.message}`);
    }
});

// Command for random girl selection
cmd({
    pattern: "bachi",
    alias: ["girl", "kuri", "larki"],
    desc: "Randomly selects a girl from the group",
    react: "👧",
    category: "fun",
    filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        const botId = conn.user.id.split("@")[0] + "@s.whatsapp.net";
        const randomUser = getRandomParticipant(groupMetadata.participants, botId);

        if (!randomUser) return reply("❌ No eligible participants found!");

        await conn.sendMessage(mek.chat, {
            text: `👧 *Yeh lo tumhari Bachi!* \n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖`,
            mentions: [randomUser.id]
        }, { quoted: mek });

    } catch (error) {
        console.error("Error in .bachi command:", error);
        reply(`❌ Error: ${error.message}`);
    }
});
