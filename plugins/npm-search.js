const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "npm",
  desc: "Search for a package on npm.",
  react: '📦',
  category: "convert",
  filename: __filename,
  use: ".npm <package-name>"
}, async (conn, mek, msg, { from, args, reply }) => {
  try {
    if (!args.length) 
      return reply("❌ Please provide the npm package name. Example: .npm express");

    const packageName = args.join(" ");
    const apiUrl = `https://registry.npmjs.org/${encodeURIComponent(packageName)}`;

    const response = await axios.get(apiUrl);

    if (!response.data) 
      return reply("❌ Package not found.");

    const pkg = response.data;
    const latestVersion = pkg["dist-tags"]?.latest || "N/A";
    const description = pkg.description || "No description available.";
    const license = pkg.license || "Unknown";
    const repository = pkg.repository?.url?.replace(/^git\+/, "").replace(/\.git$/, "") || "N/A";
    const npmUrl = `https://www.npmjs.com/package/${packageName}`;

    const message = `
*📦 NPM PACKAGE INFO*
*🔰 Package:* ${packageName}
*📄 Description:* ${description}
*⏸ Latest Version:* ${latestVersion}
*🪪 License:* ${license}
*🪩 Repository:* ${repository}
*🔗 NPM URL:* ${npmUrl}
`;

    await conn.sendMessage(from, { text: message }, { quoted: mek });

  } catch (error) {
    console.error("[NPM ERROR]", error);

    // Gracefully handle network / API errors
    const errMsg = error.response 
      ? `❌ Failed with status ${error.response.status}: ${error.response.statusText}`
      : `❌ Error: ${error.message}`;

    await conn.sendMessage(from, { text: errMsg }, { quoted: mek });
  }
});
