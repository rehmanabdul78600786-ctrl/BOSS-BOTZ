const { cmd } = require('../command');

cmd({
    pattern: "kick",
    alias: ["remove", "k"],
    desc: "Instantly remove any member (even admins)",
    category: "admin",
    react: "🗑️",
    filename: __filename
},
async (conn, citel, text) => {
    try {
        // Ensure this command is used in a group
        if (!citel.isGroup) return citel.reply("❌ This command works only in groups!");

        // Determine the target user
        const target = citel.quoted?.sender || citel.mentionedJid?.[0];
        if (!target) return citel.reply("❌ Reply to a message or mention a user to kick!");

        // Remove the participant
        await conn.groupParticipantsUpdate(citel.chat, [target], "remove");

        // Success message with mention
        await citel.reply(`🚫 @${target.split('@')[0]} has been kicked!`, {
            mentions: [target]
        });

        console.log(`[KICK] User ${target} removed from group ${citel.chat}`);
        
    } catch (error) {
        console.error("[KICK ERROR]", error);
        citel.reply(`❌ Failed to kick the user. Possible reasons:\n- The user is a super-admin.\n- The bot is not admin.\n\nError: ${error.message || error}`);
    }
});
