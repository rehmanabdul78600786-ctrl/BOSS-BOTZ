const axios = require("axios");
const { cmd } = require("../command");

cmd({
    pattern: "fb",
    alias: ["facebook", "fbdl"],
    desc: "Download Facebook videos",
    category: "download",
    filename: __filename,
    use: "<Facebook URL>",
}, async (conn, m, store, { from, args, q, reply }) => {
    try {
        // Validate URL
        if (!q || !q.startsWith("http")) {
            return reply("*`Need a valid Facebook URL`*\n\nExample: `.fb https://www.facebook.com/...`");
        }

        // React: loading
        await conn.sendMessage(from, { react: { text: '⏳', key: m.key } });

        // API Request
        const apiUrl = `https://api.vreden.my.id/api/v1/download/facebook?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        // Validate API structure
        if (!data || !data.status || !data.data || !data.data.url) {
            await conn.sendMessage(from, { react: { text: '❌', key: m.key } });
            return reply("❌ Failed to fetch the video. Please try another link.");
        }

        const videoUrl = data.data.url;

        // Send Video
        await conn.sendMessage(
            from,
            {
                video: { url: videoUrl },
                caption: "📥 *Facebook Video Downloaded Successfully!*\n\n- *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ❣️*"
            },
            { quoted: m }
        );

        // React: success
        await conn.sendMessage(from, { react: { text: '✅', key: m.key } });

    } catch (error) {
        console.error("FB Downloader Error:", error);

        // React: error
        await conn.sendMessage(from, { react: { text: '❌', key: m.key } });

        reply("❌ Error fetching the video. Please try again.");
    }
});
