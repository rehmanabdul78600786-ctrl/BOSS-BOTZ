const { cmd } = require("../command");
const axios = require("axios");

cmd({
    pattern: "img",
    alias: ["image", "googleimage", "searchimg"],
    react: "🦋",
    desc: "Search and download Google images",
    category: "fun",
    use: ".img <keywords>",
    filename: __filename
}, 
async (conn, mek, m, { reply, args, from }) => {
    try {
        const query = args.join(" ");
        if (!query) {
            return reply("🖼️ Please provide a search query.\nExample: `.img cute cats`");
        }

        await reply(`🔍 Searching for images related to: *${query}* ...`);

        const apiUrl = `https://apis.davidcyriltech.my.id/googleimage?query=${encodeURIComponent(query)}`;
        const { data } = await axios.get(apiUrl);

        // Validate response
        if (!data || !data.success || !data.results || data.results.length === 0) {
            return reply("❌ No images found. Try different keywords.");
        }

        const results = data.results;

        // Pick up to 5 random images safely
        const selectedImages = results
            .sort(() => Math.random() - 0.5)
            .slice(0, Math.min(5, results.length));

        let sent = 0;

        for (const img of selectedImages) {
            if (!img) continue; // Safety check

            await conn.sendMessage(
                from,
                {
                    image: { url: img },
                    caption: `📷 *Image Result*\n🔎 Query: *${query}*\n\n> © Powered by ꧁༒♛ 𝔅𝔒𝔖𝔖 ♛༒꧂`
                },
                { quoted: mek }
            );

            sent++;

            // Add delay to avoid rate limiting
            await new Promise(res => setTimeout(res, 1200));
        }

        if (sent === 0) {
            reply("⚠️ Failed to send images. Try again.");
        }

    } catch (error) {
        console.error("Image Search Error:", error);
        reply(`❌ Error: ${error.message || "Failed to fetch images."}`);
    }
});
