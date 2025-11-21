const axios = require('axios');
const { cmd } = require('../command');

cmd({
    pattern: "news",
    desc: "Get the latest news headlines.",
    category: "news",
    react: "📰",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        const apiKey = "0f2c43ab11324578a7b1709651736382";
        const response = await axios.get(`https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`);
        const articles = response.data.articles;

        if (!articles || articles.length === 0) return reply("❌ No news articles found.");

        // Limit to 5 articles
        const maxArticles = Math.min(articles.length, 5);

        for (let i = 0; i < maxArticles; i++) {
            const article = articles[i];
            const message = `
📰 *${article.title || "No Title"}*
⚠️ _${article.description || "No Description"}_
🔗 _${article.url || "No URL"}_

> *ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ*
            `;

            // Send image if available, else fallback to text
            if (article.urlToImage) {
                await conn.sendMessage(from, { image: { url: article.urlToImage }, caption: message }, { quoted: mek });
            } else {
                await conn.sendMessage(from, { text: message }, { quoted: mek });
            }
        }

    } catch (error) {
        console.error("News command error:", error);
        reply("❌ Could not fetch news. Please try again later.");
    }
});
