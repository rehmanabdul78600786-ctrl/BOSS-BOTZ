const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "ytpost",
    alias: ["ytcommunity", "ytc"],
    desc: "Download a YouTube community post",
    category: "downloader",
    react: "🎥",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {

    // Safe react helper
    const safeReact = async (emoji) => {
        try {
            await conn.sendMessage(from, { react: { text: emoji, key: mek.key } });
        } catch { }
    };

    try {
        if (!q) {
            return reply("❌ *Please provide a YouTube community post URL.*\n\nExample:\n```.ytpost <url>```");
        }

        await safeReact("⏳");

        const apiUrl = `https://api.siputzx.my.id/api/d/ytpost?url=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl).catch(() => ({}));

        if (!data || !data.status || !data.data) {
            await safeReact("❌");
            return reply("⚠️ Failed to fetch the community post. Please check the link or try again later.");
        }

        const post = data.data;

        let caption = `📢 *YouTube Community Post* 📢\n\n` +
                      `📝 *Content:* ${post.content || "No text content."}`;

        // Check if images exist
        if (Array.isArray(post.images) && post.images.length > 0) {
            let first = true;

            for (const img of post.images) {
                await conn.sendMessage(
                    from,
                    {
                        image: { url: img },
                        caption: first ? caption : ""
                    },
                    { quoted: mek }
                );

                first = false;
            }
        } else {
            // No images → send text only
            await conn.sendMessage(from, { text: caption }, { quoted: mek });
        }

        await safeReact("✅");

    } catch (e) {
        console.error("Error in ytpost command:", e);
        await safeReact("❌");
        reply("❌ An error occurred while fetching the YouTube community post. Please try again later.");
    }
});
