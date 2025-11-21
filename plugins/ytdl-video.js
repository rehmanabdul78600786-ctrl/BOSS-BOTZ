const { cmd } = require("../command");
const fetch = require("node-fetch");
const yts = require("yt-search");

// -------------------------
// YT AUDIO DOWNLOADER
// -------------------------
cmd(
{
    pattern: "play",
    alias: ["song", "mp"],
    desc: "Download YouTube Audio",
    category: "downloader",
    react: "🎶",
    filename: __filename,
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q)
            return reply(
                "Please provide a YouTube link or search query.\nExample: `.play pasoori`"
            );

        let videoUrl;

        // Determine if q is URL or search text
        if (q.includes("youtube.com") || q.includes("youtu.be")) {
            videoUrl = q;
        } else {
            const search = await yts(q);
            if (!search || !search.videos || search.videos.length === 0)
                return reply("No results found.");

            videoUrl = search.videos[0].url;
        }

        // Fetch audio using API
        const apiRes = await fetch(
            `https://apis.davidcyriltech.my.id/api/play?query=${encodeURIComponent(
                videoUrl
            )}`
        );

        const data = await apiRes.json();

        if (!data || !data.result)
            return reply("Failed to fetch audio from API.");

        // Extract audio URL
        const audio =
            data.result.download_url ||
            data.result.url ||
            data.result.audio;

        if (!audio) return reply("No downloadable audio found.");

        // Send audio message
        await conn.sendMessage(
            from,
            {
                audio: { url: audio },
                mimetype: "audio/mpeg",
                fileName: `${data.result.title || "audio"}.mp3`,
            },
            { quoted: mek }
        );
    } catch (err) {
        console.log("Play Command Error:", err);
        reply("❌ Error while fetching audio.");
    }
}
);

// -------------------------
// YT VIDEO DOWNLOADER
// -------------------------
cmd(
{
    pattern: "video",
    alias: ["ytv", "vid"],
    desc: "Download YouTube Video",
    category: "downloader",
    react: "🎬",
    filename: __filename,
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q)
            return reply(
                "Please provide a YouTube link or search query.\nExample: `.video alan walker faded`"
            );

        let videoUrl;

        // Determine if q is URL or search text
        if (q.includes("youtube.com") || q.includes("youtu.be")) {
            videoUrl = q;
        } else {
            const search = await yts(q);
            if (!search || !search.videos || search.videos.length === 0)
                return reply("No results found.");

            videoUrl = search.videos[0].url;
        }

        // Fetch video using API
        const apiRes = await fetch(
            `https://gtech-api-xtp1.onrender.com/api/video/yt?apikey=APIKEY&url=${encodeURIComponent(
                videoUrl
            )}`
        );

        const data = await apiRes.json();

        if (!data || !data.result)
            return reply("Failed to fetch video from API.");

        // Choose best available quality
        const hd = data.result.video_url_hd;
        const sd = data.result.video_url_sd;

        const videoFile = hd && hd !== "ply" ? hd : sd;

        if (!videoFile)
            return reply("No HD video URL available");

        // Send video
        await conn.sendMessage(
            from,
            {
                video: { url: videoFile },
                caption:
                    `🎬 *${data.result.title || "YouTube Video"}*\n\n` +
                    `*Powered By BOSS-MD*`,
            },
            { quoted: mek }
        );
    } catch (err) {
        console.log("Video Command Error:", err);
        reply("❌ Error while fetching video.");
    }
}
);
