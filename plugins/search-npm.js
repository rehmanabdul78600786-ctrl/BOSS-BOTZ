const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "npm",
  desc: "Search for a package on npm.",
  react: '📦',
  category: "convert",
  filename: __filename,
  use: ".npm <package-name>"
},
async (conn, mek, msg, { from, args, reply }) => {
  try {

    // Check for package name
    if (!args.length) {
      return reply("⚠️ *Please provide the npm package name.*\nExample: `.npm express`");
    }

    const packageName = args.join(" ");
    const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    // Fetch package info
    const response = await axios.get(apiUrl);

    // If package doesn't exist
    if (!response.data || !response.data["dist-tags"]) {
      return reply("❌ *Package not found on npm.*");
    }

    const data = response.data;

    const latestVersion = data["dist-tags"]?.latest || "Unknown";
    const description = data.description || "No description available.";
    const npmUrl = `https://www.npmjs.com/package/${packageName}`;
    const license = data.license || "Unknown";

    // Clean repository link
    let repository = "Not available";
    if (data.repository?.url) {
      repository = data.repository.url
        .replace("git+", "")
        .replace(".git", "")
        .trim();
    }

    // Output message
    const message = `
*🟦 🔥🥀𝘽οꜱꜱ🥀🔥 — NPM PACKAGE SEARCH 🟦*

*🔰 Package:* ${packageName}
*📝 Description:* ${description}
*📌 Latest Version:* ${latestVersion}
*📜 License:* ${license}
*📁 Repository:* ${repository}
*🌐 NPM URL:* ${npmUrl}

> Powered by *BOSS-MD Bot*
`;

    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (err) {
    console.error("NPM Search Error:", err);
    reply("❌ *An error occurred:* " + err.message);
  }
});
