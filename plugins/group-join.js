const config = require('../config');
const { cmd } = require('../command');
const { isUrl } = require('../lib/functions');

cmd({
    pattern: "join",
    react: "📬",
    alias: ["joinme", "f_join"],
    desc: "Join a WhatsApp group using an invite link",
    category: "group",
    use: '.join <Group Link>',
    filename: __filename
}, async (conn, mek, m, { from, quoted, body, args, q, isCreator, reply }) => {
    try {
        // Only allow the bot owner/creator to use this command
        if (!isCreator) return reply("❌ You don't have permission to use this command.");

        // If no input or reply, prompt the user
        if (!q && !quoted) return reply("❌ Please provide a valid WhatsApp group invite link.");

        let groupLink;

        // Check if the command is a reply to a message containing a link
        if (quoted && quoted.type === 'conversation' && isUrl(quoted.text)) {
            groupLink = quoted.text.split('https://chat.whatsapp.com/')[1];
        } else if (q && isUrl(q)) {
            // If the user sent the link directly
            groupLink = q.split('https://chat.whatsapp.com/')[1];
        }

        if (!groupLink) return reply("❌ Invalid group link. Make sure it starts with https://chat.whatsapp.com/");

        // Accept the group invite
        await conn.groupAcceptInvite(groupLink);

        // Success confirmation
        await conn.sendMessage(from, { text: "✔️ Successfully joined the group!" }, { quoted: mek });

    } catch (e) {
        console.error("[JOIN ERROR]", e);
        // React with error emoji and send message
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ Error occurred while joining the group.\n\n${e.message || e}`);
    }
});
