const axios = require('axios');
const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "githubstalk",
    desc: "Fetch detailed GitHub user profile including profile picture.",
    category: "menu",
    react: "🖥️",
    filename: __filename
},
async (conn, mek, m, { from, args, reply }) => {
    try {
        const username = args[0];
        if (!username) return reply("❌ Please provide a GitHub username. Example: .githubstalk octocat");

        const apiUrl = `https://api.github.com/users/${username}`;
        const response = await axios.get(apiUrl);
        const data = response.data;

        const userInfo = `👤 *Username*: ${data.name || data.login}
🔗 *GitHub URL*: ${data.html_url}
📝 *Bio*: ${data.bio || 'Not available'}
🏙️ *Location*: ${data.location || 'Unknown'}
📊 *Public Repos*: ${data.public_repos}
👥 *Followers*: ${data.followers} | Following: ${data.following}
📅 *Account Created*: ${new Date(data.created_at).toDateString()}
🔭 *Public Gists*: ${data.public_gists}
> *ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ*`;

        await conn.sendMessage(from, {
            image: { url: data.avatar_url },
            caption: userInfo
        }, { quoted: mek });

    } catch (e) {
        console.error("GitHub Stalk Error:", e);
        const errorMsg = e.response?.data?.message || e.message || "Unknown error occurred";
        reply(`❌ Error: ${errorMsg}`);
    }
});
