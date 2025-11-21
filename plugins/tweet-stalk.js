const { cmd } = require('../command');
const axios = require('axios');

cmd({
  pattern: "xstalk",
  alias: ["twitterstalk", "twtstalk", "xuser"],
  desc: "Fetch details about a Twitter/X user.",
  react: "🔍",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, quoted, q, reply, pushName }) => {
  try {
    if (!q) {
      return reply("❌ *Please provide a valid Twitter/X username.*\n\nExample:\n```\n!xstalk elonmusk\n```");
    }

    // React to show processing
    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    // API CALL
    const apiUrl = `https://delirius-apiofc.vercel.app/tools/xstalk?username=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    if (!data || data.status !== true || !data.data) {
      return reply("⚠️ *User not found!* Please check the username and try again.");
    }

    const user = data.data;

    // Dynamic icons
    const verified = user.verified ? "✔️ Blue Verified" : "❌ Not Verified";
    const privateAcc = user.protected ? "🔒 Private Account" : "🔓 Public Account";
    const status = user.suspended ? "❗ Suspended / Restricted" : "🟢 Active";

    // Caption
    const caption =
      `╭━━━〔 *TWITTER / X PROFILE* 〕━━━⬤\n` +
      `┃👤 *Name:* ${user.name}\n` +
      `┃🔹 *Username:* @${user.username}\n` +
      `┃${user.verified ? "🔵" : "⚪"} *Verified:* ${verified}\n` +
      `┃${user.protected ? "🔐" : "🔓"} *Privacy:* ${privateAcc}\n` +
      `┃📊 *Followers:* ${user.followers_count}\n` +
      `┃📈 *Following:* ${user.following_count}\n` +
      `┃📝 *Tweets:* ${user.tweets_count}\n` +
      `┃📅 *Joined:* ${user.created}\n` +
      `┃⚙️ *Status:* ${status}\n` +
      `┃🔗 *Profile Link:* ${user.url}\n` +
      `╰━━━━━━━━━━━━━━━━━━━━━━⬤\n\n` +
      `✨ *Requested by:* ${pushName || "User"}\n` +
      `🔥 *© 🔥🥀𝘽οꜱꜱ🥀🔥*`;

    // BUTTONS
    const buttons = [
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📂 Download Banner",
          id: `xbanner ${user.username}`
        })
      },
      {
        name: "quick_reply",
        buttonParamsJson: JSON.stringify({
          display_text: "📊 Latest Tweets",
          id: `xtweets ${user.username}`
        })
      }
    ];

    // Send profile photo + caption + buttons
    await conn.sendMessage(
      from,
      {
        image: { url: user.avatar },
        caption: caption,
        footer: "Twitter / X Stalker Tool",
        templateButtons: buttons
      },
      { quoted: m }
    );

  } catch (error) {
    console.error("XSTALK Error:", error);
    reply("❌ *An error occurred while processing your request.*\nPlease try again later.");
  }
});
