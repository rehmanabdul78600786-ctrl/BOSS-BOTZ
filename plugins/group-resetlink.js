const config = require('../config');
const { cmd } = require('../command');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, runtime, sleep, fetchJson } = require('../lib/functions');

cmd({
    pattern: "revoke",
    react: "🖇️",
    alias: ["revokegrouplink", "resetglink", "revokelink", "f_revoke"],
    desc: "To Reset the group link",
    category: "group",
    use: '.revoke',
    filename: __filename
},
async (conn, mek, m, {
    from, isGroup, isAdmins, isBotAdmins, reply
}) => {
    try {
        if (!isGroup) return reply("❌ This command only works in groups.");
        if (!isAdmins) return reply("⛔ You must be a *Group Admin* to use this command.");
        if (!isBotAdmins) return reply("❌ I need to be *admin* to reset the group link.");

        // Revoke the group invite link
        await conn.groupRevokeInvite(from);

        // Fetch the new group invite link
        const groupInviteCode = await conn.groupInviteCode(from);
        const newLink = `https://chat.whatsapp.com/${groupInviteCode}`;

        await conn.sendMessage(from, {
            text: `✅ *Group Link has been reset successfully!*\n\nNew Link: ${newLink}`
        }, { quoted: mek });

    } catch (err) {
        console.error("Error revoking group link:", err);
        reply("❌ Failed to reset the group link. Please try again later.");
    }
});
