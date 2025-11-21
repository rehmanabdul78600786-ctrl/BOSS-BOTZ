const { sleep } = require('../lib/functions');
const config = require('../config');
const { cmd, commands } = require('../command');

cmd({
    pattern: "leave",
    alias: ["left", "leftgc", "leavegc"],
    desc: "Leave the group",
    react: "🎉",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply
}) => {
    try {
        // Ensure this command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Only bot owner can use this
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");

        // Notify group before leaving
        await reply("👋 Leaving group...");

        // Wait a moment before leaving
        await sleep(1500);

        // Leave the group
        await conn.groupLeave(from);

        console.log(`Left group: ${from}`);
    } catch (e) {
        console.error("Leave command error:", e);
        reply(`❌ Error occurred while leaving the group: ${e.message || e}`);
    }
});
