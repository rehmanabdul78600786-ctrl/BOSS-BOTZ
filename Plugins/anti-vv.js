const { cmd } = require("../command");

cmd({
    pattern: "vv",
    alias: ["viewonce", "retrieve"],
    react: '🐳',
    desc: "Owner Only - retrieve quoted view-once message",
    category: "owner",
    filename: __filename
}, async (client, message, match, { from, isCreator }) => {
    try {
        // Only bot owner can use
        if (!isCreator) {
            return await client.sendMessage(from, {
                text: "📛 This is an owner command."
            }, { quoted: message });
        }

        // Must reply to a message
        if (!match.quoted) {
            return await client.sendMessage(from, {
                text: "🍁 Please reply to a view-once message!"
            }, { quoted: message });
        }

        // Download quoted content
        const buffer = await match.quoted.download();
        const mtype = match.quoted.mtype;
        const options = { quoted: message };

        let messageContent = {};

        switch (mtype) {
            case "imageMessage":
                messageContent = {
                    image: buffer,
                    caption: match.quoted.text || '',
                    mimetype: match.quoted.mimetype || "image/jpeg"
                };
                break;

            case "videoMessage":
                messageContent = {
                    video: buffer,
                    caption: match.quoted.text || '',
                    mimetype: match.quoted.mimetype || "video/mp4"
                };
                break;

            case "audioMessage":
                messageContent = {
                    audio: buffer,
                    mimetype: match.quoted.mimetype || "audio/mp4",
                    ptt: match.quoted.ptt || false
                };
                break;

            case "documentMessage":
                messageContent = {
                    document: buffer,
                    mimetype: match.quoted.mimetype || "application/octet-stream",
                    fileName: match.quoted.fileName || "file"
                };
                break;

            default:
                return await client.sendMessage(from, {
                    text: "❌ Only image, video, audio, and document messages are supported."
                }, { quoted: message });
        }

        // Send retrieved message
        await client.sendMessage(from, messageContent, options);

    } catch (error) {
        console.error("❌ VV Command Error:", error);
        await client.sendMessage(from, {
            text: `❌ Error fetching view-once message:\n${error.message}`
        }, { quoted: message });
    }
});
