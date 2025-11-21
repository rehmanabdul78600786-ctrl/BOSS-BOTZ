const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pair",
    alias: ["getpair", "clonebot"],
    react: "✅",
    desc: "Get pairing code for 🔥🥀𝘽οꜱꜱ🥀🔥-MD bot",
    category: "download",
    use: ".pair 923237045XXX",
    filename: __filename
}, async (conn, mek, m, { from, q, senderNumber, reply }) => {
    try {
        // Use provided number or fallback to sender number
        const phoneNumber = q ? q.trim().replace(/[^0-9]/g, '') : senderNumber.replace(/[^0-9]/g, '');

        // Validate phone number
        if (!phoneNumber || phoneNumber.length < 10 || phoneNumber.length > 15) {
            return reply("❌ Please provide a valid phone number without `+`\nExample: `.pair 923237045XXX`");
        }

        // Fetch pairing code from API
        const response = await axios.get(`https://arslan-xmd-pair-site.onrender.com/code?number=${encodeURIComponent(phoneNumber)}`);

        if (!response.data || !response.data.code) {
            return reply("❌ Failed to retrieve pairing code. Please try again later.");
        }

        const pairingCode = response.data.code;
        const doneMessage = "✅ *×º𝓑𝖔𝙨𝙨º×-MD PAIRING COMPLETED*";

        // Send formatted message
        await reply(`${doneMessage}\n\n*Your pairing code is:* ${pairingCode}`);

        // Optional: resend code after 2 seconds
        await new Promise(resolve => setTimeout(resolve, 2000));
        await reply(`💡 Your code: ${pairingCode}`);

    } catch (error) {
        console.error("Pair command error:", error);
        await reply("❌ An error occurred while fetching the pairing code. Please try again later.");
    }
});
