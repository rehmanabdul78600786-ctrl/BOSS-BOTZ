const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "define",
    desc: "📖 Get the definition of a word",
    react: "🔍",
    category: "search",
    filename: __filename
},
async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide a word to define.\n\n📌 *Usage:* .define [word]");

        const word = q.trim().toLowerCase();
        const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

        const response = await axios.get(url);
        const data = response.data[0];

        const wordText = data.word || word;
        const phonetics = data.phonetics?.[0]?.text || '🔇 No phonetics available';
        const audio = data.phonetics?.[0]?.audio || null;

        let meaningsText = '';
        const maxMeanings = 3; // Limit displayed meanings
        const maxDefinitions = 3; // Limit definitions per meaning

        data.meanings?.slice(0, maxMeanings).forEach((meaning, mIndex) => {
            const partOfSpeech = meaning.partOfSpeech || 'N/A';
            meaningsText += `\n📚 *Part of Speech:* ${partOfSpeech}\n`;

            meaning.definitions?.slice(0, maxDefinitions).forEach((def, dIndex) => {
                const defText = def.definition || '❌ No definition available';
                const example = def.example || '❌ No example available';
                const synonyms = def.synonyms?.length ? def.synonyms.join(', ') : '❌ No synonyms available';

                meaningsText += `\n${dIndex + 1}. *Definition:* ${defText}\n   ✍️ *Example:* ${example}\n   📝 *Synonyms:* ${synonyms}\n`;
            });
        });

        const wordInfo = `
📖 *Word:* ${wordText}
🗣️ *Pronunciation:* _${phonetics}_
${meaningsText}

🔗 *Requested by: BOSS ☺️*`;

        // Send audio if available
        if (audio) {
            await conn.sendMessage(from, { audio: { url: audio }, mimetype: 'audio/mpeg' }, { quoted: mek });
        }

        return reply(wordInfo);

    } catch (error) {
        console.error("❌ Error fetching word definition:", error);
        if (error.response?.status === 404) {
            return reply("🚫 *Word not found.* Please check the spelling and try again.");
        }
        return reply("⚠️ An error occurred while fetching the definition. Please try again later.");
    }
});
