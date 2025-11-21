const config = require('../config')
const { cmd } = require('../command')

cmd({
    pattern: "unlockgc",
    alias: ["unlock"],
    react: "🔓",
    desc: "Unlock the group (Allows new members to join).",
    category: "group",
    filename: __filename
}, 
async (conn, mek, m, { from, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Check if in a group
        if (!isGroup) 
            return reply("❌ This command can only be used in groups.");

        // Check if sender is admin
        if (!isAdmins) 
            return reply("❌ Only group admins can use this command.");

        // Check if bot is admin
        if (!isBotAdmins) 
            return reply("❌ I need to be an admin to unlock the group.");

        // Unlock the group
        await conn.groupSettingUpdate(from, "unlocked");

        // Reply with success message
        await reply("✅ *Group Unlocked!*\nNew members can now join.");
        // Optional reaction
        await conn.sendMessage(from, { react: { text: "🔓", key: m.key } });

    } catch (e) {
        console.error("❌ Error unlocking group:", e);
        reply("❌ Failed to unlock the group. Please try again.");
    }
});
