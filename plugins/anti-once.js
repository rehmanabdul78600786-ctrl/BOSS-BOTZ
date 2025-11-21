const { cmd } = require("../command");

cmd({
  pattern: "vv2",
  alias: ["wah", "ohh", "oho", "🙂", "nice", "ok"],
  desc: "Owner Only - retrieve quoted message and forward to DM",
  category: "owner",
  filename: __filename
}, async (client, message, match, { from, isCreator }) => {
  try {
    // Only bot owner can use
    if (!isCreator) return;

    // Must reply to a message
    if (!match.quoted) {
      return await client.sendMessage(from, {
        text: "🍁 Please reply to a view-once message!"
      }, { quoted: message });
    }

    const buffer = await match.quoted.download();
    const mtype = match.quoted.mtype;
    const options = { quoted: message };
    let messageContent = {};

    switch (mtype) {
      case "imageMessage":
        messageContent = {
          image: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "image/jpeg"
        };
        break;

      case "videoMessage":
        messageContent = {
          video: buffer,
          caption: match.quoted.text || '',
          mimetype: match.quoted.mimetype || "video/mp4"
        };
        break;

      case "audioMessage":
        messageContent = {
          audio: buffer,
          mimetype: match.quoted.mimetype || "audio/mp4",
          ptt: match.quoted.ptt || false
        };
        break;

      case "documentMessage":
        messageContent = {
          document: buffer,
          fileName: match.quoted.fileName || "file",
          mimetype: match.quoted.mimetype || "application/octet-stream"
        };
        break;

      case "stickerMessage":
        messageContent = {
          sticker: buffer
        };
        break;

      default:
        return await client.sendMessage(from, {
          text: "❌ Only image, video, audio, document, and sticker messages are supported"
        }, { quoted: message });
    }

    // Forward message to the owner (DM)
    await client.sendMessage(message.sender, messageContent, options);

  } catch (error) {
    console.error("vv2 Command Error:", error);
    await client.sendMessage(from, {
      text: `❌ Error fetching vv2 message:\n${error.message}`
    }, { quoted: message });
  }
});
