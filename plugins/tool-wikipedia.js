const { cmd } = require("../command");
const { fetchJson } = require("../lib/functions");
const translate = require("@vitalets/google-translate-api");

cmd({
  pattern: "wikipedia",
  alias: ["wiki"],
  react: "📖",
  desc: "Fetch Wikipedia information and translate to English",
  category: "information",
  filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
  try {
    // Validate input
    if (!q) return reply("❌ Please provide a search query.\nExample: .wikipedia Albert Einstein");

    await reply("🔎 Searching Wikipedia...");

    // Fetch data from API
    const response = await fetchJson(`https://api.siputzx.my.id/api/s/wikipedia?query=${encodeURIComponent(q)}`);

    if (!response || !response.status || !response.data) 
      return reply("❌ No results found for your query.");

    const { wiki, thumb } = response.data;

    // Translate the Wikipedia text to English with fallback
    let translatedText;
    try {
      const translated = await translate(wiki, { to: "en" });
      translatedText = translated.text;
    } catch {
      translatedText = wiki; // fallback to original text if translation fails
    }

    // Construct message
    const message = `📖 *Wikipedia Result*\n\n📝 *Query:* ${q}\n\n${translatedText}\n\n> *🔥🥀𝘽οꜱꜱ🥀🔥*`;

    // Send result with thumbnail if available
    if (thumb) {
      await conn.sendMessage(from, {
        image: { url: thumb },
        caption: message,
        contextInfo: { forwardingScore: 999, isForwarded: true }
      }, { quoted: mek });
    } else {
      await reply(message);
    }

  } catch (error) {
    console.error("❌ Error in Wikipedia command:", error);
    reply("⚠️ An error occurred while fetching Wikipedia data: " + error.message);
  }
});
