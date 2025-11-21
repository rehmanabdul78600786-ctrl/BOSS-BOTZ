const { cmd } = require('../command');

cmd({
    pattern: "out",
    alias: ["ck", "🦶"],
    desc: "Removes all members with specific country code from the group",
    category: "admin",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, {
    from, q, isGroup, isBotAdmins, reply, groupMetadata, isCreator
}) => {
    try {
        // Check if used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups.");

        // Check if sender is bot owner/creator
        if (!isCreator) return reply("❌ Only the bot owner can use this command.");

        // Check if bot is admin
        if (!isBotAdmins) return reply("❌ I need to be an admin to use this command.");

        // Validate input
        if (!q) return reply("❌ Please provide a country code. Example: .out 92");

        const countryCode = q.trim();
        if (!/^\d+$/.test(countryCode)) {
            return reply("❌ Invalid country code. Please provide only numbers (e.g., 92 for +92 numbers)");
        }

        // Get participants safely
        const participants = groupMetadata?.participants || [];
        if (participants.length === 0) return reply("❌ No members found in this group.");

        // Filter members by country code, exclude admins and bot
        const targets = participants.filter(participant =>
            participant.id.startsWith(countryCode) &&
            !participant.admin &&
            participant.id !== conn.user.id // Don't remove the bot itself
        );

        if (targets.length === 0) {
            return reply(`❌ No members found with country code +${countryCode}`);
        }

        // Remove members in batches to avoid errors if the group is large
        for (let i = 0; i < targets.length; i += 5) {
            const batch = targets.slice(i, i + 5).map(p => p.id);
            await conn.groupParticipantsUpdate(from, batch, "remove");
        }

        reply(`✅ Successfully removed ${targets.length} members with country code +${countryCode}`);

    } catch (error) {
        console.error("Out command error:", error);
        reply("❌ Failed to remove members. Error: " + (error.message || error));
    }
});
