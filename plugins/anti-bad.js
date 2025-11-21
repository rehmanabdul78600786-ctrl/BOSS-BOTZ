const { cmd } = require('../command');
const config = require("../config");

// Anti-Bad Words System
cmd({
  on: "body"
}, async (conn, m, store, { from, body, isGroup, isAdmins, isBotAdmins, reply, sender }) => {
  try {
    // Only process in groups where bot is admin and sender is not admin
    if (!isGroup || isAdmins || !isBotAdmins) return;

    // Define bad words
    const badWords = ["jan", "jhonny", "xx", "fuck", "sexy", "huththa", "pakaya", "ponnaya", "hutto"];

    // Normalize message text for matching
    const messageText = body.toLowerCase();

    // Check if message contains any bad word
    const containsBadWord = badWords.some(word => messageText.includes(word.toLowerCase()));

    if (containsBadWord && config.ANTI_BAD_WORD === "true") {
      // Delete the offending message
      try {
        await conn.sendMessage(from, { delete: m.key });
        console.log(`Deleted bad word message from ${sender}: ${body}`);
      } catch (delError) {
        console.error("Failed to delete message:", delError);
      }

      // Send warning message
      await conn.sendMessage(from, {
        text: `🚫 ⚠️ BAD WORDS ARE NOT ALLOWED ⚠️ 🚫\n` +
              `User: @${sender.split('@')[0]}`,
        mentions: [sender]
      }, { quoted: m });
    }

  } catch (error) {
    console.error("Anti-Bad Words error:", error);
    reply("❌ An error occurred while processing the message.");
  }
});
