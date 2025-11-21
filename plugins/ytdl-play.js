const { cmd } = require("../command");
const DY_SCRAP = require("@dark-yasiya/scrap");
const dy_scrap = new DY_SCRAP();

/**
 * Extract YT video ID from URL
 */
function extractYouTubeID(url) {
    const pattern =
        /(?:youtube\.com\/(?:.*v=|.*\/)|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(pattern);
    return match ? match[1] : null;
}

cmd(
    {
        pattern: "play2",
        alias: ["mp2", "ytmp2"],
        react: "🎵",
        desc: "Download YT audio (mp3)",
        category: "download",
        use: ".play2 <Song Name / YouTube URL>",
        filename: __filename,
    },
    async (conn, mek, m, { from, q, reply }) => {
        try {
            if (!q) return reply("❌ Please provide a query or YouTube URL!");

            let videoId = null;

            // If user provided URL → extract video ID
            if (q.startsWith("https://") || q.startsWith("http://")) {
                videoId = extractYouTubeID(q);
            }

            // If not URL or failed to extract → do search
            if (!videoId) {
                const search = await dy_scrap.ytsearch(q);

                if (!search?.results?.length)
                    return reply("❌ No results found!");

                videoId = search.results[0].videoId;
            }

            const loading = await reply("⏳ Fetching audio, please wait...");

            // Fetch MP3 download
            const data = await dy_scrap.ytmp3(
                "https://youtube.com/watch?v=" + videoId
            );

            const downloadUrl = data?.result?.download?.url;

            if (!downloadUrl) {
                return conn.sendMessage(
                    from,
                    {
                        text: "❌ Download link not found!",
                    },
                    { quoted: mek }
                );
            }

            // Send audio to user
            await conn.sendMessage(
                from,
                {
                    audio: { url: downloadUrl },
                    mimetype: "audio/mpeg",
                    fileName: `${data?.result?.title || "audio"}.mp3`,
                },
                { quoted: mek }
            );
        } catch (e) {
            console.error("Play2 Error:", e);

            await conn.sendMessage(from, {
                react: { text: "❌", key: mek.key },
            });

            return reply("❌ An error occurred: " + (e.message || "Unexpected error"));
        }
    }
);
