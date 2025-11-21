const axios = require("axios");
const yts = require("yt-search");
const { cmd } = require("../command");

cmd({
    pattern: "play",
    alias: ["sons", "music"],
    desc: "Download YouTube audio by title",
    category: "download",
    react: "🎶",
    filename: __filename
}, 
async (conn, mek, m, { from, q, reply }) => {
    try {

        // Validate user query
        if (!q) 
            return reply("❌ Please provide a song name.\nExample: `.play pasoori`");

        // Search on YouTube
        const search = await yts(q);
        const video = search?.videos?.[0];

        if (!video)
            return reply("❌ No results found for your query.");

        // API fetch
        const apiURL = `https://jawad-tech.vercel.app/download/yt?url=${encodeURIComponent(video.url)}`;

        let res;
        try {
            res = await axios.get(apiURL);
        } catch (error) {
            return reply("❌ API error: Unable to connect to the server.");
        }

        if (!res?.data?.status)
            return reply("❌ Failed to fetch audio. The API might be down.");

        const audioUrl = res.data.result;

        if (!audioUrl)
            return reply("❌ Audio download link not found in API response.");

        // Sanitize filename
        const safeFileName = video.title.replace(/[\/\\:*?"<>|]/g, "") + ".mp3";

        // Send thumbnail preview
        await conn.sendMessage(
            from,
            {
                image: { url: video.thumbnail },
                caption: 
`🎶 *BOSS-XMD YouTube Downloader*

🎵 *Title:* ${video.title}
⏱ *Duration:* ${video.timestamp || "N/A"}
👤 *Author:* ${video.author?.name || "Unknown"}

⬇️ *Sending audio...*`,
            },
            { quoted: mek }
        );

        // Send audio file
        await conn.sendMessage(
            from,
            {
                audio: { url: audioUrl },
                mimetype: "audio/mpeg",
                fileName: safeFileName,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            },
            { quoted: mek }
        );

        // Stylish final message
        await reply(
`*_BOSS-𝙓𝙈𝘿 𝙔𝙏 𝘿𝙊𝙒𝙉𝙇𝙊𝘼𝘿𝙀𝙍_*
*╭───────────────━┈⍟*
*┋* ${video.title}
*╰───────────────━┈⍟*
*╭────◉◉◉─────────៚*
*┋* *_𝙋𝙊𝙒𝙀𝙍𝙀𝘿 𝘽𝙔 ❝✧𝓑ő𐍃𐍃💘❀_*
*╰────◉◉◉─────────៚*`
        );

    } catch (err) {
        console.error("Play command error:", err);
        return reply("❌ An error occurred while processing your request.");
    }
});
