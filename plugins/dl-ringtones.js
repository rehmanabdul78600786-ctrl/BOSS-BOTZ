const axios = require("axios");
const { cmd, commands } = require("../command");

cmd({
    pattern: "ringtone",
    alias: ["ringtones", "ring"],
    desc: "Get a random ringtone from the API.",
    react: "🎵",
    category: "fun",
    filename: __filename,
},
async (conn, mek, m, { from, reply, args }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("❎ Please provide a search query!\nExample: `.ringtone Suna`");
        }

        // API Request
        const url = `https://www.dark-yasiya-api.site/download/ringtone?text=${encodeURIComponent(query)}`;
        const { data } = await axios.get(url);

        // Validate response
        if (!data || !data.status || !data.result || data.result.length === 0) {
            return reply("❌ No ringtones found for your query. Try a different keyword.");
        }

        const ringtone = data.result[Math.floor(Math.random() * data.result.length)];

        // Validate fields before sending
        if (!ringtone.dl_link) {
            return reply("⚠️ API returned invalid ringtone data. Please try again later.");
        }

        const fileName = `${ringtone.title || "ringtone"}.mp3`;

        await conn.sendMessage(
            from,
            {
                audio: { url: ringtone.dl_link },
                mimetype: "audio/mpeg",
                fileName: fileName,
            },
            { quoted: m }
        );

    } catch (error) {
        console.error("Error in ringtone command:", error);
        reply("⚠️ Sorry, something went wrong while fetching the ringtone.\nPlease try again later.");
    }
});
