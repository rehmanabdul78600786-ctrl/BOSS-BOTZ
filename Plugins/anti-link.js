const { cmd } = require('../command');
const config = require('../config');

// Anti-link handler
cmd({
  on: "body"
}, async (conn, m, store, { from, body, sender, isGroup, isAdmins, isBotAdmins, reply }) => {
  try {
    // Initialize global warnings object
    if (!global.warnings) global.warnings = {};

    // Only act in groups where bot is admin and sender is not admin
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // List of link patterns to detect
    const linkPatterns = [
      /https?:\/\/(?:chat\.whatsapp\.com|wa\.me)\/\S+/gi,
      /wa\.me\/\S+/gi,
      /https?:\/\/(?:t\.me|telegram\.me)\/\S+/gi,
      /https?:\/\/(?:www\.)?youtube\.com\/\S+/gi,
      /https?:\/\/youtu\.be\/\S+/gi,
      /https?:\/\/(?:www\.)?facebook\.com\/\S+/gi,
      /https?:\/\/fb\.me\/\S+/gi,
      /https?:\/\/(?:www\.)?instagram\.com\/\S+/gi,
      /https?:\/\/(?:www\.)?twitter\.com\/\S+/gi,
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

    // Detect if message contains any forbidden link
    const containsLink = linkPatterns.some(pattern => pattern.test(body));
    if (!containsLink || config.ANTI_LINK !== 'true') return;

    console.log(`Link detected from ${sender}: ${body}`);

    // Attempt to delete the message
    try {
      await conn.sendMessage(from, { delete: m.key });
      console.log(`Message deleted: ${m.key.id}`);
    } catch (err) {
      console.error("Failed to delete message:", err);
    }

    // Update warning count
    global.warnings[sender] = (global.warnings[sender] || 0) + 1;
    const warnCount = global.warnings[sender];

    // Warn user if below limit
    if (warnCount < 4) {
      await conn.sendMessage(from, {
        text: `⚠️ *LINKS ARE NOT ALLOWED*\n` +
              `╭────⬡ WARNING ⬡────\n` +
              `├▢ USER: @${sender.split('@')[0]}\n` +
              `├▢ COUNT: ${warnCount}\n` +
              `├▢ REASON: LINK SENDING\n` +
              `├▢ WARN LIMIT: 3\n` +
              `╰────────────────`,
        mentions: [sender]
      });
    } else {
      // Remove user if they exceed warning limit
      await conn.sendMessage(from, {
        text: `@${sender.split('@')[0]} *HAS BEEN REMOVED - WARN LIMIT EXCEEDED!*`,
        mentions: [sender]
      });
      await conn.groupParticipantsUpdate(from, [sender], "remove");
      delete global.warnings[sender];
    }

  } catch (error) {
    console.error("Anti-link error:", error);
    reply("❌ An error occurred while processing the message.");
  }
});
