const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "aivoice",
    alias: ["vai", "voicex", "voiceai"],
    desc: "Text to speech with different AI voices",
    category: "main",
    react: "🪃",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        if (!args[0]) 
            return reply("❌ Please provide text after the command.\nExample: .aivoice Hello World");

        const inputText = args.join(' ');

        // Voice models
        const voiceModels = [
            { number: "1", name: "Hatsune Miku", model: "miku" },
            { number: "2", name: "Nahida (Exclusive)", model: "nahida" },
            { number: "3", name: "Nami", model: "nami" },
            { number: "4", name: "Ana (Female)", model: "ana" },
            { number: "5", name: "Optimus Prime", model: "optimus_prime" },
            { number: "6", name: "Goku", model: "goku" },
            { number: "7", name: "Taylor Swift", model: "taylor_swift" },
            { number: "8", name: "Elon Musk", model: "elon_musk" },
            { number: "9", name: "Mickey Mouse", model: "mickey_mouse" },
            { number: "10", name: "Kendrick Lamar", model: "kendrick_lamar" },
            { number: "11", name: "Angela Adkinsh", model: "angela_adkinsh" },
            { number: "12", name: "Eminem", model: "eminem" }
        ];

        // Construct menu
        let menuText = "╭━━〔 *AI VOICE MODELS* 〕━━⊷\n";
        voiceModels.forEach(model => menuText += `┃▸ ${model.number}. ${model.name}\n`);
        menuText += "╰━━⪼\n\n📌 Reply with the number to select voice for:\n\"" + inputText + "\"";

        // Send menu
        const sentMsg = await conn.sendMessage(from, {
            image: { url: "https://files.catbox.moe/lcpy9f.jpg" },
            caption: menuText
        }, { quoted: m });

        // Handler variables
        let handlerActive = true;
        const messageID = sentMsg.key.id;

        // Timeout for 2 minutes
        const timeout = setTimeout(() => {
            handlerActive = false;
            conn.ev.off("messages.upsert", messageHandler);
            reply("⌛ Voice selection timed out. Please try again.");
        }, 120000);

        // Message handler
        const messageHandler = async (msgData) => {
            if (!handlerActive) return;

            const receivedMsg = msgData.messages[0];
            if (!receivedMsg?.message) return;

            const senderID = receivedMsg.key.remoteJid;
            const receivedText = receivedMsg.message.conversation || 
                                 receivedMsg.message.extendedTextMessage?.text || 
                                 receivedMsg.message.buttonsResponseMessage?.selectedButtonId;

            const isReplyToBot = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

            if (!isReplyToBot || senderID !== from) return;

            clearTimeout(timeout);
            handlerActive = false;
            conn.ev.off("messages.upsert", messageHandler);

            const selectedModel = voiceModels.find(model => model.number === receivedText.trim());
            if (!selectedModel) return reply("❌ Invalid option! Please reply with a number from the menu.");

            try {
                await conn.sendMessage(from, { text: `🔊 Generating audio with ${selectedModel.name} voice...` }, { quoted: receivedMsg });

                const apiUrl = `https://api.agatz.xyz/api/voiceover?text=${encodeURIComponent(inputText)}&model=${selectedModel.model}`;
                const response = await axios.get(apiUrl, { timeout: 30000 });

                if (response.data?.status === 200) {
                    await conn.sendMessage(from, {
                        audio: { url: response.data.data.oss_url },
                        mimetype: "audio/mpeg"
                    }, { quoted: receivedMsg });
                } else {
                    reply("❌ Error generating audio. Please try again.");
                }

            } catch (error) {
                console.error("API Error:", error);
                reply("❌ Error processing your request. Please try again.");
            }
        };

        // Register handler
        conn.ev.on("messages.upsert", messageHandler);

    } catch (error) {
        console.error("Command Error:", error);
        reply("❌ An unexpected error occurred. Please try again.");
    }
});
