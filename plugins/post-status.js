const { cmd } = require("../command");

cmd({
  pattern: "post",
  alias: ["status", "story"],
  desc: "Post media or text to WhatsApp status",
  category: "utility",
  filename: __filename
}, async (client, message, match, { isCreator, reply }) => {

  try {
    if (!isCreator)
      return reply("*📛 Owner only command!*");

    const quoted = message.quoted || message;

    // Detect if quoted is media
    const hasMedia =
      quoted.message?.imageMessage ||
      quoted.message?.videoMessage ||
      quoted.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
      quoted.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

    // ==========================
    // 1. TEXT STATUS
    // ==========================
    if (!hasMedia && quoted.text) {
      try {
        await client.sendMessage("status@broadcast", {
          text: quoted.text
        });

        return reply("✅ *Text status uploaded successfully!*");
      } catch (e) {
        return reply(`❌ Failed to upload text status.\n\nError: ${e.message}`);
      }
    }

    // ==========================
    // 2. MEDIA STATUS
    // ==========================
    if (hasMedia) {
      try {
        const mediaMessage =
          quoted.message.imageMessage ||
          quoted.message.videoMessage ||
          quoted.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage ||
          quoted.message?.extendedTextMessage?.contextInfo?.quotedMessage?.videoMessage;

        const mediaType = mediaMessage.mimetype.startsWith("image") ? "image" : "video";

        const stream = await quoted.download();
        const caption = quoted.caption || "";

        await client.sendMessage("status@broadcast", {
          [mediaType]: stream,
          caption: caption
        });

        return reply(`✅ *${mediaType.toUpperCase()} posted to status successfully!*`);
      } catch (err) {
        return reply(`❌ Failed to upload media status\n\nError: ${err.message}`);
      }
    }

    // No media and no text
    return reply("⚠ *Please reply to a text or media message to post it as a status!*");

  } catch (e) {
    console.log("POST CMD ERROR:", e);
    return reply("❌ *Unexpected error occurred!*");
  }
});
