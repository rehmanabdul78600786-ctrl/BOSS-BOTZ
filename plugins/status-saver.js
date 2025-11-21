const { cmd } = require("../command");

cmd({
  pattern: "send",
  alias: ["sendme", "save"],
  react: "📤",
  desc: "Forwards quoted message back to user",
  category: "utility",
  filename: __filename
}, 
async (client, message, args, { from }) => {
  try {

    const quoted = message.quoted;
    if (!quoted)
      return client.sendMessage(from, { text: "🍁 *Please reply to a message!*" }, { quoted: message });

    const buffer = await quoted.download();
    const mtype = Object.keys(quoted.msg)[0];     // FIXED mtype

    let sendContent = {};

    switch (mtype) {

      case "imageMessage":
        sendContent = {
          image: buffer,
          caption: quoted.msg?.caption || ""
        };
        break;

      case "videoMessage":
        sendContent = {
          video: buffer,
          caption: quoted.msg?.caption || "",
        };
        break;

      case "audioMessage":
        sendContent = {
          audio: buffer,
          mimetype: "audio/mp4",
          ptt: quoted.msg?.ptt || false
        };
        break;

      default:
        return client.sendMessage(from, { 
          text: "❌ Only *image, video, or audio* messages are supported!" 
        }, { quoted: message });
    }

    await client.sendMessage(from, sendContent, { quoted: message });

  } catch (error) {
    console.error("Forward Error:", error);
    await client.sendMessage(from, { 
      text: `❌ Error forwarding message:\n${error.message}`
    }, { quoted: message });
  }
});
