const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "sss",
  alias: ["ssweb", "ss"],
  react: "💫",
  desc: "Take a screenshot of any website.",
  category: "other",
  use: ".ss <url>",
  filename: __filename,
},
async (conn, mek, m, { from, q, reply }) => {

  if (!q) {
    return reply("⚠️ *Please provide a valid URL!*");
  }

  try {
    const url = encodeURIComponent(q);  // Important fix

    // Call API
    const apiUrl = `https://api.davidcyriltech.my.id/ssweb?url=${url}`;
    const response = await axios.get(apiUrl);

    // Fix – Correct screenshot field
    const ss =
      response.data.screenshotUrl ||
      response.data.url ||
      response.data.image ||
      response.data.result ||
      response.data.data ||
      null;

    if (!ss) {
      return reply("❌ Could not get screenshot from API.");
    }

    // Build message
    const imageMessage = {
      image: { url: ss },
      caption: "*🌐 WEB SCREENSHOT DOWNLOADER*\n\n> ×º𝓑𝖔𝙨𝙨º×",
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: "120363405061777123@newsletter",
          newsletterName: "🔥🥀𝘽οꜱꜱ🥀🔥",
          serverMessageId: 143,
        }
      }
    };

    await conn.sendMessage(from, imageMessage, { quoted: m });

  } catch (error) {
    console.error("Screenshot Error:", error);
    reply("❌ Failed to capture the screenshot. Try again later.");
  }

});
