const { cmd } = require("../command");
const config = require("../config");
const DY_SCRAP = require("@dark-yasiya/scrap");
const dy_scrap = new DY_SCRAP();

// Extract YT video ID from any YouTube URL
function extractYTId(link) {
    const regex =
        /(?:youtu\.be\/|youtube\.com\/(?:shorts\/|embed\/|watch\?v=|.*v=))([a-zA-Z0-9_-]{11})/;
    const match = link.match(regex);
    return match ? match[1] : null;
}

cmd({
    pattern: "play3",
    alias: ["mp6", "bossmp3"],
    desc: "Download MP3 from YouTube using Dark-Yasiya Scrapper",
    category: "download",
    react: "🎧",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q)
            return reply("❌ Please provide text or YouTube URL.\nExample: `.mp6 pasoori`");

        let videoId = extractYTId(q);

        // Search if no URL was provided
        if (!videoId) {
            const search = await dy_scrap.ytsearch(q);

            if (!search?.results?.length)
                return reply("❌ No results found for your query.");

            videoId = search.results[0].videoId;
        }

        const videoUrl = `https://youtube.com/watch?v=${videoId}`;

        // Fetch video metadata
        const info = await dy_scrap.ytsearch(videoUrl);
        if (!info?.results?.length)
            return reply("❌ Could not fetch video details.");

        const video = info.results[0];

        // Clean filename
        const safeFileName = video.title.replace(/[\/\\:*?"<>|]/g, "");

        // Build details message
        const captionText =
`🎧 *BOSS-XMD MULTIPOWER BOT*

🎵 *Title:* ${video.title}
⏱ *Duration:* ${video.timestamp || "Unknown"}
👤 *Author:* ${video.author?.name || "Unknown"}
👁 *Views:* ${video.views || "Unknown"}
📅 *Uploaded:* ${video.ago || "Unknown"}
🔗 *URL:* ${video.url}

${config.FOOTER || "✨ Powered By BØSS 💘"}`;

        // SEND THUMBNAIL + INFO
        const preview = await conn.sendMessage(from, {
            image: { url: video.image },
            caption: captionText
        }, { quoted: mek });

        // React to preview
        await conn.sendMessage(from, {
            react: { text: "🎶", key: preview.key }
        });

        // Processing message
        const waiting = await conn.sendMessage(
            from,
            { text: "⏳ *Processing your audio...*" },
            { quoted: mek }
        );

        // Fetch MP3 link
        const downloadData = await dy_scrap.ytmp3(videoUrl);
        const audioUrl = downloadData?.result?.download?.url;

        if (!audioUrl)
            return reply("❌ Audio download link not found!");

        // SEND AUDIO
        await conn.sendMessage(
            from,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: safeFileName + ".mp3"
            },
            { quoted: mek }
        );

        // Edit progress to success
        await conn.sendMessage(
            from,
            {
                text: "✅ *Audio Sent Successfully!*",
                edit: waiting.key
            }
        );

    } catch (err) {
        console.error("PLAY3 ERROR:", err);

        await conn.sendMessage(from, {
            react: { text: "❌", key: mek.key }
        });

        await reply("❌ *An error occurred:*\n```\n" + (err.message || err) + "\n```");
    }
});
