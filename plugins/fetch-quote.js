const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "quote",
  desc: "Get a random inspiring quote.",
  category: "fun",
  react: "💬",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    // Fetch random quote from quotable.io
    const { data } = await axios.get("https://api.quotable.io/random");
    const { content, author } = data;

    // Construct the message
    const message = `💬 *"${content}"*\n- ${author}\n\n> *QUOTES BY ×º𝓑𝖔𝙨𝙨º×*`;

    // Reply to the user
    reply(message);

  } catch (error) {
    console.error("❌ Error fetching quote:", error);
    reply("⚠️ API issue or coding error, please check the logs!");
  }
});
