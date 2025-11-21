const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "tiktok",
    alias: ["ttdl", "tt", "tiktokdl"],
    desc: "Download TikTok video without watermark",
    category: "downloader",
    react: "🎵",
    filename: __filename
},
async (conn, mek, m, { from, args, q, reply }) => {
    try {

        // Basic checks
        if (!q) return reply("❎ Please provide a TikTok video link.");
        if (!q.includes("tiktok.com")) return reply("❎ Invalid TikTok link.");

        reply("⏳ Downloading TikTok video, please wait...");

        // API request
        const apiUrl = `https://delirius-apiofc.vercel.app/download/tiktok?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data || !data.status || !data.data) {
            return reply("❌ Failed to fetch TikTok video. The API returned an invalid response.");
        }

        const { title, like, comment, share, author, meta } = data.data;

        if (!meta || !meta.media || !Array.isArray(meta.media)) {
            return reply("❌ No video media found in the TikTok post.");
        }

        const videoObj = meta.media.find(v => v.type === "video");
        if (!videoObj || !videoObj.org) {
            return reply("❌ Could not find a valid video URL.");
        }

        const videoUrl = videoObj.org;

        // Caption Formatting
        const caption =
`🎵 *TikTok Video* 🎵

👤 *User:* ${author?.nickname || "Unknown"} (@${author?.username || "unknown"})
📖 *Title:* ${title || "No title"}

👍 *Likes:* ${like || 0}
💬 *Comments:* ${comment || 0}
🔁 *Shares:* ${share || 0}`;

        // Sending the video
        await conn.sendMessage(from, {
            video: { url: videoUrl },
            caption,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

    } catch (e) {
        console.error("Error in TikTok downloader command:", e);
        reply("⚠️ An error occurred while processing your request.\n\n" + e.message);
    }
});
