const { cmd } = require('../command');

cmd({
    pattern: "add",
    alias: ["a", "invite"],
    desc: "Adds a member to the group",
    category: "admin",
    react: "➕",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, quoted, senderNumber
}) => {
    try {
        // Check if the command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Get the bot owner's number dynamically
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) {
            return reply("❌ Only the bot owner can use this command.");
        }

        // Check if the bot is an admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

        // Determine the number to add
        let number;
        if (quoted) {
            number = quoted.sender.split("@")[0]; // If replying to a message
        } else if (q && q.includes("@")) {
            number = q.replace(/[@\s]/g, ''); // If mentioning a user
        } else if (q && /^\d+$/.test(q)) {
            number = q; // If typing a number directly
        } else {
            return reply("❌ Please reply to a message, mention a user, or provide a number to add.");
        }

        const jid = number + "@s.whatsapp.net";

        // Add member to group
        await conn.groupParticipantsUpdate(from, [jid], "add");
        reply(`✅ Successfully added @${number}`, { mentions: [jid] });

    } catch (error) {
        console.error("Add command error:", error);
        reply("❌ Failed to add the member. They might have privacy settings preventing addition.");
    }
});
