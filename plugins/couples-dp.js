const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "couplepp",
    alias: ["couple", "cpp"],
    react: '💑',
    desc: "Get a male and female couple profile picture.",
    category: "image",
    use: ".couplepp",
    filename: __filename
}, async (conn, m, store, { from, reply }) => {
    try {
        await reply("💑 *Fetching couple profile pictures...*");

        // Fetch couple profile pictures from API
        const { data } = await axios.get("https://api.davidcyriltech.my.id/couplepp");

        if (!data || !data.success) {
            return reply("❌ Failed to fetch couple profile pictures. Please try again later.");
        }

        const { male: malePp, female: femalePp } = data;

        // Send male profile picture
        if (malePp) {
            await conn.sendMessage(from, {
                image: { url: malePp },
                caption: "👨 *Male Couple Profile Picture*"
            }, { quoted: m });
        } else {
            await reply("⚠️ Male profile picture not available.");
        }

        // Send female profile picture
        if (femalePp) {
            await conn.sendMessage(from, {
                image: { url: femalePp },
                caption: "👩 *Female Couple Profile Picture*"
            }, { quoted: m });
        } else {
            await reply("⚠️ Female profile picture not available.");
        }

    } catch (error) {
        console.error("CouplePP Command Error:", error);
        await reply("❌ An error occurred while fetching the couple profile pictures. Please try again later.");
    }
});
