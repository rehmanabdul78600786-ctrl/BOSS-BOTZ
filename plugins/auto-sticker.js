const fs = require("fs");
const path = require("path");
const config = require("../config");
const { cmd } = require("../command");

// Load JSON once (much faster)
const autoStickerPath = path.join(__dirname, "../assets/autosticker.json");
let autoStickers = {};

try {
    if (fs.existsSync(autoStickerPath)) {
        autoStickers = JSON.parse(fs.readFileSync(autoStickerPath, "utf8"));
    } else {
        console.error("❌ autosticker.json not found!");
    }
} catch (err) {
    console.error("❌ Failed to load autosticker.json:", err);
}

// Main Command Listener
cmd(
{
    on: "body"
},
async (conn, mek, m, { from, body }) => {
    try {
        // Auto-sticker disabled → exit
        if (config.AUTO_STICKER !== "true") return;

        if (!body) return;

        const text = body.toLowerCase();

        // Check if a sticker matches the message
        const stickerFile = autoStickers[text];
        if (!stickerFile) return;

        const stickerPath = path.join(__dirname, "../assets/autosticker", stickerFile);

        if (!fs.existsSync(stickerPath)) {
            console.error("❌ Sticker missing:", stickerPath);
            return;
        }

        const stickerBuffer = fs.readFileSync(stickerPath);

        // Send sticker
        await conn.sendMessage(
            from,
            {
                sticker: stickerBuffer,
                packname: "ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ",
                author: "AUTO-STICKER SYSTEM"
            },
            { quoted: mek }
        );

    } catch (err) {
        console.error("❌ AUTO-STICKER ERROR:", err);
    }
});
