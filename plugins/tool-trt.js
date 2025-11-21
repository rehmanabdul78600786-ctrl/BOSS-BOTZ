const { cmd } = require('../command');
const translate = require('@vitalets/google-translate-api');

cmd({
    pattern: "trt",
    alias: ["translate"],
    desc: "🌍 Translate text between languages",
    react: "⚡",
    category: "other",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❗ Please provide a language code and text.\nUsage: .translate [language code] [text]\nExample: .translate es Hello world");

        const args = q.trim().split(' ');
        if (args.length < 2) return reply("❗ Please provide both a target language code and the text to translate.");

        const targetLang = args[0].toLowerCase();
        const textToTranslate = args.slice(1).join(' ');

        // Detect language and translate
        const result = await translate(textToTranslate, { to: targetLang });

        const translationMessage = 
`> *×º𝓑𝖔𝙨𝙨º×-🔥🥀𝘽οꜱꜱ🥀🔥-TRANSLATION*

> 🔤 *Original* (${result.from.language.iso}): ${textToTranslate}

> 🔠 *Translated* (${targetLang}): ${result.text}`;

        return reply(translationMessage);

    } catch (error) {
        console.error("Translate command error:", error);
        return reply("⚠️ An error occurred while translating your text. Please try again later 🤕");
    }
});
