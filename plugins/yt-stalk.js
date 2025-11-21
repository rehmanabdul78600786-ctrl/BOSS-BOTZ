const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "ytstalk",
    alias: ["ytinfo", "ytchannel"],
    desc: "Get information about a YouTube channel.",
    react: "🔍",
    category: "search",
    filename: __filename
},
async (conn, m, store, { from, q, reply }) => {
    try {
        if (!q)
            return reply("❌ Please provide a YouTube channel username, URL, or ID.\nExample: `.ytstalk MrBeast`");

        // Processing reaction
        await conn.sendMessage(from, {
            react: { text: "⏳", key: m.key }
        });

        const apiUrl = `https://delirius-apiofc.vercel.app/tools/ytstalk?channel=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.data)
            return reply("⚠️ Could not fetch channel info. Please check the channel name or ID.");

        const yt = data.data;

        // Sanitize fields
        const avatar = yt.avatar || "https://i.ibb.co/mT9Yw7V/default.jpg";
        const username = yt.username || "Unknown";
        const subscribers = yt.subscriber_count || "Unknown";
        const videos = yt.video_count || "Unknown";
        const channelLink = yt.channel || "Unavailable";

        const caption =
`╭━━━〔 *📺 YOUTUBE CHANNEL INFO* 〕━━━⊷
┃👤 *Name:* ${username}
┃📊 *Subscribers:* ${subscribers}
┃🎥 *Total Videos:* ${videos}
┃🔗 *Channel:* ${channelLink}
╰━━━━━━━━━━━━━━━━━━⊷

✨ *𝙋𝙤𝙬𝙚𝙧𝙚𝙙 𝘽𝙮 𝓐𝓻𝓼𝓵𝓪𝓷_𝓜𝓓*`;

        // Send beautiful thumbnail + info
        const sentMsg = await conn.sendMessage(
            from,
            {
                image: { url: avatar },
                caption
            },
            { quoted: m }
        );

        // Success reaction
        await conn.sendMessage(from, {
            react: { text: "✅", key: sentMsg.key }
        });

    } catch (err) {
        console.error("YTSTALK Error:", err);

        await conn.sendMessage(from, {
            react: { text: "❌", key: m.key }
        });

        reply("❌ An error occurred while fetching channel info. Please try again.");
    }
});
