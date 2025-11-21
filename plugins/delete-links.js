const { cmd } = require('../command');
const config = require('../config');

// ===============================
// LINK PATTERNS TO DETECT
// ===============================
const linkPatterns = [
    /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
    /https?:\/\/(www\.)?whatsapp\.com\/channel\/[a-zA-Z0-9_-]+/gi,
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

// ===============================
// LINK DELETION EVENT
// ===============================
cmd({
    on: 'body'
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins }) => {
    try {
        // Only in groups where bot is admin
        if (!isGroup || !isBotAdmins) return;

        // Check if sender is admin (skip admin messages)
        if (isAdmins.includes(sender)) return;

        // Check if the message contains a link
        const containsLink = linkPatterns.some(pattern => pattern.test(body));

        if (containsLink && config.DELETE_LINKS === 'true') {
            // Delete the message
            await conn.sendMessage(from, { delete: m.key }).catch(() => {});

            // Optional: log deleted message
            console.log(`[Link Deleted] Sender: ${sender}, Group: ${from}`);
        }
    } catch (error) {
        console.error("[Link Deletion Error]:", error);
    }
});
