const { cmd } = require("../command");
const config = require("../config");

cmd({
  pattern: "ship",
  alias: ["match", "love"],
  desc: "Randomly pairs the command user with another group member.",
  react: "❤️",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { from, isGroup, groupMetadata, reply, sender }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Get all participants' JIDs
    const participants = groupMetadata.participants.map(p => p.id);

    // Special DEV number to pair with if present
    const specialNumber = config.DEV ? `${config.DEV}@s.whatsapp.net` : null;

    let randomPair;

    if (specialNumber && participants.includes(specialNumber) && sender !== specialNumber) {
      // Always pair with DEV if available
      randomPair = specialNumber;
    } else {
      // Pick a random participant but not the sender
      const otherParticipants = participants.filter(p => p !== sender);
      if (otherParticipants.length === 0) {
        return reply("⚠️ No other participants to pair with!");
      }
      randomPair = otherParticipants[Math.floor(Math.random() * otherParticipants.length)];
    }

    // Prepare message
    const message = `💘 *Match Found!* 💘\n❤️ @${sender.split("@")[0]} + @${randomPair.split("@")[0]}\n💖 Congratulations! 🎉`;

    // Send message mentioning both users
    await conn.sendMessage(from, {
      text: message,
      contextInfo: {
        mentionedJid: [sender, randomPair],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363405061777123@newsletter",
          newsletterName: "꧁༒♛ 𝔅𝔒𝔖𝔖♛༒꧂",
          serverMessageId: 143
        }
      }
    });

  } catch (error) {
    console.error("❌ Error in ship command:", error);
    reply("⚠️ An error occurred while processing the command. Please try again.");
  }
});
