const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "fancy",
  alias: ["font", "style"],
  react: "✍️",
  desc: "Convert text into various fonts.",
  category: "tools",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    // Ensure user provides text
    if (!q) {
      return reply("❎ Please provide text to convert into fancy fonts.\n\n*Example:* .fancy Hello");
    }

    // Encode user text for API request
    const apiUrl = `https://www.dark-yasiya-api.site/other/font?text=${encodeURIComponent(q)}`;
    const { data } = await axios.get(apiUrl);

    // Check API response status
    if (!data.status) {
      return reply("❌ Error fetching fonts. Please try again later.");
    }

    // Build fonts result message
    const fonts = data.result
      .map(item => `*${item.name}:*\n${item.result}`)
      .join("\n\n");

    const resultText = `✨ *Fancy Fonts Converter* ✨\n\n${fonts}\n\n> *🔥🥀𝘽οꜱꜱ🥀🔥*`;

    // Send formatted fonts message
    await conn.sendMessage(from, { text: resultText }, { quoted: m });

  } catch (error) {
    console.error("❌ Error in fancy command:", error);
    reply("⚠️ An error occurred while fetching fonts. Please try again later.");
  }
});
