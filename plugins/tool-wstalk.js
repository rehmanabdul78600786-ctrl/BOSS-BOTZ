const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "wstalk",
    alias: ["channelstalk", "chinfo"],
    desc: "Get WhatsApp channel information",
    category: "utility",
    react: "🔍",
    filename: __filename
}, async (conn, mek, m, { from, reply, args }) => {
    try {
        // Validate input
        if (!args || !args[0]) 
            return reply("❌ Please provide a WhatsApp channel URL\nExample: .wstalk https://chat.whatsapp.com/channel/0029VatOy2EAzNc2WcShQw1j");

        // Extract channel ID safely
        const channelUrl = args[0];
        const channelIdMatch = channelUrl.match(/channel\/([0-9A-Za-z]+)/i);
        if (!channelIdMatch) return reply("❌ Invalid WhatsApp channel URL");

        const channelId = channelIdMatch[1];

        // API endpoint
        const apiUrl = `https://itzpire.com/stalk/whatsapp-channel?url=https://whatsapp.com/channel/${channelId}`;

        // Fetch channel info
        const response = await axios.get(apiUrl);
        const data = response.data?.data;

        if (!data) return reply("❌ Unable to fetch channel data. Please try again later.");

        // Format channel info
        const description = data.description ? data.description.replace(/\n/g, '\n┃◈┃• ') : "No description available.";
        const followers = data.followers || "N/A";
        const title = data.title || "N/A";
        const imgUrl = data.img || null;

        const channelInfo = `╭━━〔 *CHANNEL INFO* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *📢 Title*: ${title}
┃◈┃• *👥 Followers*: ${followers}
┃◈┃• *📝 Description*: ${description}
┃◈└───────────┈⊷
╰──────────────┈⊷
> 🔥🥀𝘽οꜱꜱ🥀🔥`;

        // Send message (with image if available)
        if (imgUrl) {
            await conn.sendMessage(from, {
                image: { url: imgUrl },
                caption: channelInfo,
                contextInfo: {
                    forwardingScore: 999,
                    isForwarded: true
                }
            }, { quoted: mek });
        } else {
            await reply(channelInfo);
        }

    } catch (e) {
        console.error("Error in wstalk command:", e);
        reply(`❌ Error: ${e.response?.data?.message || e.message || 'Failed to fetch channel info.'}`);
    }
});
