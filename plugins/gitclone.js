const { cmd } = require("../command");
const fetch = require("node-fetch");

cmd({
    pattern: 'gitclone',
    alias: ["git"],
    desc: "Download GitHub repository as a zip file.",
    react: '📦',
    category: "downloader",
    filename: __filename
}, async (conn, m, store, { from, args, reply }) => {
    if (!args[0]) {
        return reply("❌ Please provide a GitHub repository link.\n\nExample:\n.gitclone https://github.com/username/repository");
    }

    const url = args[0];
    if (!/^(https?:\/\/)?(www\.)?github\.com\/[^\/]+\/[^\/]+/.test(url)) {
        return reply("⚠️ Invalid GitHub link. Please provide a valid repository URL.");
    }

    try {
        const regex = /github\.com\/([^\/]+)\/([^\/]+)(?:\.git)?/i;
        const match = url.match(regex);
        if (!match) throw new Error("Invalid GitHub URL.");

        const [, username, repo] = match;
        const zipUrl = `https://api.github.com/repos/${username}/${repo}/zipball`;

        // Verify repository exists
        const response = await fetch(zipUrl, { method: "HEAD" });
        if (!response.ok) throw new Error("Repository not found or inaccessible.");

        // Determine file name
        let fileName = `${repo}.zip`;
        const contentDisposition = response.headers.get("content-disposition");
        if (contentDisposition) {
            const matchName = contentDisposition.match(/filename="?(.+)"?/);
            if (matchName) fileName = matchName[1];
        }

        // Notify user
        reply(`📥 *Downloading repository...*\n\n*Repository:* ${username}/${repo}\n*Filename:* ${fileName}\n\n> *🔥🥀𝘽οꜱꜱ🥀🔥*`);

        // Send the zip file
        await conn.sendMessage(from, {
            document: { url: zipUrl },
            fileName: fileName,
            mimetype: 'application/zip',
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363405061777123@newsletter',
                    newsletterName: '꧁༒♛ 𝔅𝔒𝔖𝔖♛༒꧂',
                    serverMessageId: 143
                }
            }
        }, { quoted: m });

    } catch (error) {
        console.error("GitClone Error:", error);
        reply(`❌ Failed to download the repository.\n\nError: ${error.message || "Unknown error"}`);
    }
});
