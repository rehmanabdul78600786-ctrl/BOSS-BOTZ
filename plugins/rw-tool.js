const { cmd } = require("../command");
const axios = require("axios");

cmd({
  pattern: "rw",
  alias: ["randomwall", "wallpaper"],
  react: "🌌",
  desc: "Download random wallpapers based on keywords.",
  category: "wallpapers",
  use: ".rw <keyword>",
  filename: __filename
}, 
async (conn, m, store, { from, args, reply }) => {
  try {
    // Get query or default to "random"
    const query = args.join(" ") || "random";

    // API request
    const apiUrl = `https://pikabotzapi.vercel.app/random/randomwall/?apikey=anya-md&query=${encodeURIComponent(query)}`;
    const { data } = await axios.get(apiUrl);

    // Check if valid response
    if (data.status && data.imgUrl) {
      const caption = `🌌 *Random Wallpaper: ${query}*\n\n> *×º𝓑𝖔𝙨𝙨º×*`;
      await conn.sendMessage(from, { 
        image: { url: data.imgUrl }, 
        caption 
      }, { quoted: m });
    } else {
      reply(`❌ No wallpaper found for *"${query}"*.`);
    }

  } catch (error) {
    console.error("Wallpaper Error:", error);
    reply("❌ An error occurred while fetching the wallpaper. Please try again.");
  }
});
