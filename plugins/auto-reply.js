const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd } = require("../command");

// Load autoreply.json once
const autoReplyPath = path.join(__dirname, "../assets/autoreply.json");
let autoReplies = {};

try {
    if (fs.existsSync(autoReplyPath)) {
        autoReplies = JSON.parse(fs.readFileSync(autoReplyPath, "utf8"));
    } else {
        console.error("❌ autoreply.json not found!");
    }
} catch (err) {
    console.error("❌ Failed to load autoreply.json:", err);
}

cmd(
{
    on: "body"
},
async (conn, mek, m, { from, body }) => {
    try {
        if (config.AUTO_REPLY !== "true") return;
        if (!body) return;

        const text = body.toLowerCase();

        // Check if message matches a reply trigger
        const replyMsg = autoReplies[text];
        if (!replyMsg) return;

        await m.reply(replyMsg);

    } catch (err) {
        console.error("❌ AUTO-REPLY ERROR:", err);
    }
});
