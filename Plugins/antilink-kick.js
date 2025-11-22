const { cmd } = require('../command');
const config = require("../config");

// List of URL patterns to block
const linkPatterns = [
    /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
    /^https?:\/\/(www\.)?whatsapp\.com\/channel\/([a-zA-Z0-9_-]+)$/,
    /wa\.me\/\S+/gi,
    /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
    /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
    /https?:\/\/youtu\.be\/\S+/gi,
    /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
    /https?:\/\/fb\.me\/\S+/gi,
    /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?tiktok\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?linkedin\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?snapchat\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?pinterest\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?reddit\.com\/\S+/gi,
    /https?:\/\/ngl\/\S+/gi,
    /https?:\/\/(?:www\.)?discord\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?twitch\.tv\/\S+/gi,
    /https?:\/\/(?:www\.)?vimeo\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?dailymotion\.com\/\S+/gi,
    /https?:\/\/(?:www\.)?medium\.com\/\S+/gi
];

cmd({
    on: "body"
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
    try {
        // Only active in groups where bot is admin
        if (!isGroup || !isBotAdmins) return;

        // Owner or admins are exempt
        if (isAdmins) return;

        // Check if message contains a forbidden link
        const containsLink = linkPatterns.some(pattern => pattern.test(body));
        if (!containsLink) return;

        // Only proceed if anti-link kick is enabled
        if (config.ANTI_LINK_KICK !== 'true') return;

        // Delete offending message
        await conn.sendMessage(from, { delete: m.key }, { quoted: m });

        // Notify the group
        await conn.sendMessage(from, {
            text: `⚠️ Links are not allowed in this group.\n@${sender.split("@")[0]} has been removed. 🚫`,
            mentions: [sender]
        }, { quoted: m });

        // Kick the member
        await conn.groupParticipantsUpdate(from, [sender], "remove");

    } catch (error) {
        console.error("❌ ANTI-LINK ERROR:", error);
        reply("⚠️ An error occurred while processing the message.");
    }
});
