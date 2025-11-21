const { cmd } = require('../command');

cmd({
    pattern: "promote",
    alias: ["p", "makeadmin"],
    desc: "Promotes a member to group admin",
    category: "admin",
    react: "⬆️",
    filename: __filename
},
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups!");
        if (!isAdmins) return reply("❌ Only group admins can promote members!");
        if (!isBotAdmins) return reply("❌ I need to be an admin to promote members!");

        // Get group metadata
        const groupMetadata = await conn.groupMetadata(from);
        const groupAdmins = groupMetadata.participants
            .filter(p => p.admin || p.admin === 'superadmin')
            .map(p => p.id);

        // Get target user
        let target;
        if (m.quoted) {
            target = m.quoted.sender;
        } else if (m.mentionedJid && m.mentionedJid[0]) {
            target = m.mentionedJid[0];
        } else {
            return reply("❌ Please reply to a message or mention a user!");
        }

        // Prevent promoting the bot itself
        if (target === conn.user.id) {
            return reply("❌ I am already an admin or cannot promote myself!");
        }

        // Check if the user is already admin
        if (groupAdmins.includes(target)) {
            return reply("❌ User is already an admin!");
        }

        // Promote the user
        await conn.groupParticipantsUpdate(from, [target], "promote");

        // Success message
        reply(`✅ @${target.split('@')[0]} has been promoted to admin!`, { mentions: [target] });

    } catch (error) {
        console.error("Promote Error:", error);
        reply("❌ Failed to promote user. Please try again.");
    }
});
