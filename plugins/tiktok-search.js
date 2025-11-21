const fetch = require("node-fetch");
const { cmd } = require("../command");

cmd({
  pattern: "tiktoksearch",
  alias: ["tiktoks", "tiks"],
  desc: "Search TikTok videos using a keyword.",
  react: '🔍',
  category: 'tools',
  filename: __filename
}, async (conn, m, store, { from, args, reply }) => {

  if (!args[0]) {
    return reply("🌸 What do you want to search on TikTok?\n\n*Usage:* `.tiktoksearch <keyword>`");
  }

  const query = args.join(" ");

  try {
    await conn.sendMessage(from, { react: { text: "⌛", key: m.key } });

    reply(`🔎 Searching TikTok for: *${query}*...`);

    const response = await fetch(
      `https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=${encodeURIComponent(query)}`
    );

    const data = await response.json();

    if (!data || !data.data || !Array.isArray(data.data) || data.data.length === 0) {
      await conn.sendMessage(from, { react: { text: "❌", key: m.key } });
      return reply("❌ No results found. Try different keywords!");
    }

    // Shuffle & select up to 7 videos
    const results = data.data.sort(() => Math.random() - 0.5).slice(0, 7);

    for (const video of results) {
      const caption =
        `🌸 *TikTok Result*\n\n` +
        `✨ *Title:* ${video.title || "Unknown"}\n` +
        `👤 *Author:* ${video.author || "Unknown"}\n` +
        `⏱️ *Duration:* ${video.duration || "Unknown"}\n` +
        `🔗 *Link:* ${video.link || "Unavailable"}\n`;

      if (video.nowm) {
        await conn.sendMessage(
          from,
          {
            video: { url: video.nowm },
            caption
          },
          { quoted: m }
        );
      } else {
        reply(`⚠️ Cannot retrieve the no-watermark video for *${video.title}*`);
      }
    }

    await conn.sendMessage(from, { react: { text: "✅", key: m.key } });

  } catch (error) {
    console.error("TikTok search error:", error);

    await conn.sendMessage(from, { react: { text: "❌", key: m.key } });

    reply("❌ Error searching TikTok. Please try again later.");
  }
});
