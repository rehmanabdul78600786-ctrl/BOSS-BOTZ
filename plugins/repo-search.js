const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "srepo",
  desc: "Fetch information about a GitHub repository.",
  category: "other",
  react: "🍃",
  filename: __filename
}, 
async (conn, m, store, { from, args, reply }) => {
  try {
    // Validate input
    const repoName = args.join(" ");
    if (!repoName) {
      return reply("❌ Please provide a GitHub repository in the format: `owner/repo`.\nExample: `.srepo facebook/react`");
    }

    // Fetch repo data from GitHub API
    const apiUrl = `https://api.github.com/repos/${repoName}`;
    const { data } = await axios.get(apiUrl);

    // Build response message
    const responseMsg = `
📁 *GitHub Repository Info* 📁

📌 *Name*: ${data.name || "N/A"}
🔗 *URL*: ${data.html_url || "N/A"}
📝 *Description*: ${data.description || "No description"}
⭐ *Stars*: ${data.stargazers_count ?? "0"}
🍴 *Forks*: ${data.forks_count ?? "0"}
👤 *Owner*: ${data.owner?.login || "N/A"}
📅 *Created At*: ${data.created_at ? new Date(data.created_at).toLocaleDateString() : "N/A"}

> *© Powered by BOSS-MD Official*
`;

    await conn.sendMessage(from, { text: responseMsg }, { quoted: m });

  } catch (error) {
    console.error("GitHub API Error:", error);
    const errMsg = error.response?.data?.message || error.message || "Unknown error";
    reply(`❌ Error fetching repository data: ${errMsg}`);
  }
});
