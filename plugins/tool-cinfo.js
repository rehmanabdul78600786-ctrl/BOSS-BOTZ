const { cmd } = require('../command');
const axios = require('axios');

// Utility to convert ISO country code to emoji flag
function countryCodeToEmoji(countryCode) {
    if (!countryCode) return '';
    return countryCode
        .toUpperCase()
        .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt()));
}

cmd({
    pattern: "countryinfo",
    alias: ["cinfo", "country", "cinfo2"],
    desc: "Get detailed info about a country with flag emojis",
    category: "info",
    react: "🌍",
    filename: __filename
},
async (conn, mek, m, { from, args, reply, react }) => {
    try {
        const q = args.join(" ").trim();
        if (!q) return reply("❌ Please provide a country name.\nExample: `.countryinfo Pakistan`");

        const apiUrl = `https://api.siputzx.my.id/api/tools/countryInfo?name=${encodeURIComponent(q)}`;
        const { data } = await axios.get(apiUrl);

        if (!data?.status || !data?.data) {
            if (react) await react("❌");
            return reply(`❌ No information found for *${q}*. Please check the country name.`);
        }

        const info = data.data;

        // Country flag emoji
        const countryFlag = countryCodeToEmoji(info.isoCode?.alpha2);

        // Neighbors with flags
        const neighborsText = info.neighbors?.length > 0
            ? info.neighbors.map(n => `${countryCodeToEmoji(n.isoCode?.alpha2)} *${n.name}*`).join(", ")
            : "No neighboring countries found.";

        const languagesText = info.languages?.native?.length > 0
            ? info.languages.native.join(", ")
            : "N/A";

        const text = `${countryFlag} 🌍 *Country Information: ${info.name}* ${countryFlag}\n\n` +
                     `🏛 *Capital:* ${info.capital || "N/A"}\n` +
                     `📍 *Continent:* ${info.continent?.name || "N/A"} ${info.continent?.emoji || ""}\n` +
                     `📞 *Phone Code:* ${info.phoneCode || "N/A"}\n` +
                     `📏 *Area:* ${info.area?.squareKilometers || "N/A"} km² (${info.area?.squareMiles || "N/A"} mi²)\n` +
                     `🚗 *Driving Side:* ${info.drivingSide || "N/A"}\n` +
                     `💱 *Currency:* ${info.currency || "N/A"}\n` +
                     `🔤 *Languages:* ${languagesText}\n` +
                     `🌟 *Famous For:* ${info.famousFor || "N/A"}\n` +
                     `🌍 *ISO Codes:* ${info.isoCode?.alpha2?.toUpperCase() || "N/A"}, ${info.isoCode?.alpha3?.toUpperCase() || "N/A"}\n` +
                     `🌎 *Internet TLD:* ${info.internetTLD || "N/A"}\n\n` +
                     `🔗 *Neighbors:* ${neighborsText}`;

        await conn.sendMessage(from, {
            image: { url: info.flag },
            caption: text,
            contextInfo: { mentionedJid: [m.sender] }
        }, { quoted: mek });

        if (react) await react("✅");

    } catch (e) {
        console.error("Error in countryinfo command:", e);
        if (react) await react("❌");
        reply("❌ An error occurred while fetching country information.");
    }
});
