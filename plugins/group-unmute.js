const config = require('../config');
const { cmd } = require('../command');

cmd({
    pattern: "unmute",
    alias: ["groupunmute"],
    react: "🔊",
    desc: "Unmute the group (Everyone can send messages).",
    category: "group",
    filename: __filename
}, 
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Check if command is in a group
        if (!isGroup) 
            return reply("❌ This command can only be used in groups.");

        // Check if sender is admin
        if (!isAdmins) 
            return reply("❌ Only group admins can use this command.");

        // Check if bot is admin
        if (!isBotAdmins) 
            return reply("❌ I need to be an admin to unmute the group.");

        // Update group settings
        await conn.groupSettingUpdate(from, "not_announcement");

        // Reply with success message
        await reply("✅ *Group Unmuted!*\nEveryone can now send messages.");
        // Optional: react with emoji
        await conn.sendMessage(from, { react: { text: "🔊", key: m.key } });

    } catch (e) {
        console.error("❌ Error unmuting group:", e);
        reply("❌ Failed to unmute the group. Please try again.");
    }
});
