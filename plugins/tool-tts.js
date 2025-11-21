const axios = require('axios');
const { cmd } = require('../command');
const googleTTS = require('google-tts-api');

cmd({
    pattern: "tts",
    alias: ["say", "speak"],
    desc: "Convert text to speech",
    category: "download",
    react: "👂",
    filename: __filename
}, async (conn, mek, m, { from, args, q, reply }) => {
    try {
        // Check if text is provided
        if (!q) return reply("❌ Please provide text to convert to speech.\n*Example:* .tts Hello world");

        // Parse optional language and speed arguments
        // Format: .tts [lang-code] | [slow/fast] | text
        // Example: .tts en | slow | Hello world
        let lang = 'hi-IN'; // default Hindi
        let slow = false;
        let text = q;

        if (q.includes('|')) {
            const parts = q.split('|').map(p => p.trim());
            if (parts[0]) lang = parts[0];
            if (parts[1]) slow = parts[1].toLowerCase() === 'slow';
            if (parts[2]) text = parts[2];
        }

        // Validate text length (Google TTS limit ~200 chars)
        if (text.length > 200) return reply("❌ Text too long! Please use less than 200 characters.");

        // Generate TTS URL
        const url = googleTTS.getAudioUrl(text, {
            lang,
            slow,
            host: 'https://translate.google.com',
        });

        // Send audio message
        await conn.sendMessage(from, {
            audio: { url },
            mimetype: 'audio/mpeg',
            ptt: true
        }, { quoted: mek });

    } catch (error) {
        console.error("TTS command error:", error);
        reply(`❌ Error generating TTS: ${error.message || error}`);
    }
});
