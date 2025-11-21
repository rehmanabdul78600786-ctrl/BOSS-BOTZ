const axios = require("axios");
const { cmd } = require("../command");
const { fetchGif, gifToVideo } = require("../lib/fetchGif");

cmd({
  pattern: "marige",
  alias: ["shadi", "marriage", "wedding"],
  desc: "Randomly pairs two users for marriage with a wedding GIF",
  react: "💍",
  category: "fun",
  filename: __filename
}, async (conn, mek, store, { isGroup, groupMetadata, reply, sender }) => {
  try {
    // Ensure command is used in a group
    if (!isGroup) return reply("❌ This command can only be used in groups!");

    // Get all participant IDs
    const participants = groupMetadata.participants.map(user => user.id);

    // Filter out sender and bot itself
    const eligibleParticipants = participants.filter(
      id => id !== sender && !id.includes(conn.user.id.split("@")[0])
    );

    if (eligibleParticipants.length < 1) {
      return reply("❌ Not enough participants to perform a marriage!");
    }

    // Select a random participant as the pair
    const randomIndex = Math.floor(Math.random() * eligibleParticipants.length);
    const randomPair = eligibleParticipants[randomIndex];

    // Fetch a wedding GIF (using hug as placeholder)
    const apiUrl = "https://api.waifu.pics/sfw/hug";
    const { data } = await axios.get(apiUrl);
    const gifUrl = data.url;

    // Convert GIF to video buffer
    const gifBuffer = await fetchGif(gifUrl);
    const videoBuffer = await gifToVideo(gifBuffer);

    // Construct the message
    const message = `💍 *Shadi Mubarak!* 💒\n\n👰 @${sender.split("@")[0]} + 🤵 @${randomPair.split("@")[0]}\n\nMay you both live happily ever after! 💖`;

    // Send the video message with mentions
    await conn.sendMessage(
      mek.chat,
      {
        video: videoBuffer,
        caption: message,
        gifPlayback: true,
        mentions: [sender, randomPair]
      },
      { quoted: mek }
    );

  } catch (error) {
    console.error("❌ Error in .marige command:", error);
    reply(`❌ *Error in .marige command:*\n\`\`\`${error.message}\`\`\``);
  }
});
