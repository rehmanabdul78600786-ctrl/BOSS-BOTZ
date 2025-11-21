const axios = require('axios');
const { cmd } = require('../command');
const fs = require('fs');
const path = require('path');

cmd({
    pattern: "vv3",
    alias: ['retrive', '🔥'],
    desc: "Fetch and resend a ViewOnce message content (image/video/audio).",
    category: "misc",
    use: '<reply-to-viewonce>',
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        if (!m.quoted) return reply("❌ Please reply to a ViewOnce message.");

        const quotedMessage = m.quoted?.message;
        if (!quotedMessage) return reply("❌ Could not read quoted message.");

        // Detect the type of media in the ViewOnce message
        const messageType = Object.keys(quotedMessage).find(k => k.endsWith("Message"));
        if (!messageType) return reply("❌ This is not a ViewOnce message.");

        const mediaMessage = quotedMessage[messageType];
        if (!mediaMessage) return reply("❌ No media found in the ViewOnce message.");

        const caption = mediaMessage.caption || "";

        // Download media safely
        const fileName = `temp_${Date.now()}`;
        const filePath = path.join(__dirname, fileName);
        await conn.downloadAndSaveMediaMessage(mediaMessage, filePath);

        // Determine media type and prepare send options
        let sendOptions = {};
        if (messageType.includes("image")) {
            sendOptions = { image: { url: filePath }, caption: caption };
        } else if (messageType.includes("video")) {
            sendOptions = { video: { url: filePath }, caption: caption };
        } else if (messageType.includes("audio")) {
            sendOptions = { audio: { url: filePath } };
        } else {
            fs.unlink(filePath, () => {}); // Cleanup if unsupported
            return reply("❌ Unsupported media type.");
        }

        // Send the media
        await conn.sendMessage(from, sendOptions, { quoted: mek });

        // Clean up the downloaded file
        fs.unlink(filePath, (err) => {
            if (err) console.log("File cleanup error:", err);
        });

    } catch (e) {
        console.error("Error fetching ViewOnce message:", e);
        reply("❌ An error occurred while fetching the ViewOnce message.");
    }
});
