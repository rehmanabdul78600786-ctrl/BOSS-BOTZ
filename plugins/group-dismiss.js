const { cmd } = require('../command');

cmd({
    pattern: "demote",
    alias: ["d", "dismiss", "removeadmin"],
    desc: "Demotes a group admin to a normal member",
    category: "admin",
    react: "⬇️",
    filename: __filename
},
async (conn, mek, m, {
    from, quoted, q, isGroup, isAdmins, isBotAdmins, botNumber, reply
}) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Check if the user is an admin
        if (!isAdmins) return reply("❌ Only group admins can use this command.");

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

        let number;

        // Get the target number from reply or input
        if (quoted) {
            number = quoted.sender.split("@")[0]; // Reply case
        } else if (q && q.includes("@")) {
            number = q.replace(/[@\s]/g, ''); // Mentioned case
        } else {
            return reply("❌ Please reply to a message or provide a number to demote.");
        }

        // Prevent demoting the bot itself
        if (number === botNumber) return reply("❌ The bot cannot demote itself.");

        const jid = number + "@s.whatsapp.net";

        // Perform the demotion
        await conn.groupParticipantsUpdate(from, [jid], "demote");
        reply(`✅ Successfully demoted @${number} to a normal member.`, { mentions: [jid] });

    } catch (error) {
        console.error("Demote command error:", error);
        reply("❌ Failed to demote the member. Make sure the user is an admin and try again.");
    }
});
