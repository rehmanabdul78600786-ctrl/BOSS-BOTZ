const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot", "paircode"],
    react: "🔗",
    desc: "Generate pairing code for BOSS-MD bot",
    category: "main",
    use: ".pair 923xxxxxxxxx",
    filename: __filename
},
async (conn, mek, m, { from, q, senderNumber, reply }) => {
    try {
        // Extract number from user input OR sender number
        let number = q
            ? q.replace(/[^0-9]/g, "")
            : senderNumber.replace(/[^0-9]/g, "");

        // Validate
        if (!number || number.length < 10 || number.length > 15) {
            return reply(
                "❌ *Invalid Number!*\n\n" +
                "Use format: `.pair 923001234567`\n" +
                "👉 Do NOT use + sign."
            );
        }

        // Notify user
        await reply(`🔍 *Generating Pairing Code For:* \`${number}\`\nPlease wait...`);

        // API request
        const api = `https://arslan-xmd-pair-site.onrender.com/code?number=${number}`;
        const res = await axios.get(api);

        if (!res.data || !res.data.code) {
            return reply("❌ Failed to get pairing code. Try again later.");
        }

        const code = res.data.code;

        // Final clean output
        await conn.sendMessage(from, {
            text:
`╭━━━〔 *PAIRING SUCCESS* 〕━━━┈⊷
┃✔ User: ${number}
┃✔ Status: Code Generated
╰━━━━━━━━━━━━━━━┈⊷

🔑 *Your Pairing Code:*  
\`\`\`${code}\`\`\`

⚠️ *Do NOT share this code with anyone!*`,
        }, { quoted: mek });

        // Send code again clearly
        await conn.sendMessage(from, { text: `${code}` }, { quoted: mek });

    } catch (err) {
        console.error("PAIR ERROR:", err);
        reply("❌ *Error while generating pairing code.* Please try again later.");
    }
});
