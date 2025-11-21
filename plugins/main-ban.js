const fs = require("fs");
const path = require("path");
const { cmd } = require("../command");

const BAN_FILE = path.join(__dirname, "../lib/ban.json");

// Ensure ban.json exists
if (!fs.existsSync(BAN_FILE)) fs.writeFileSync(BAN_FILE, JSON.stringify([]));

// Helper to read banned users
const readBanned = () => {
    try {
        const data = fs.readFileSync(BAN_FILE, "utf-8");
        return JSON.parse(data || "[]");
    } catch {
        return [];
    }
};

// Helper to write banned users
const writeBanned = (arr) => {
    fs.writeFileSync(BAN_FILE, JSON.stringify([...new Set(arr)], null, 2));
};

// Ban command
cmd({
    pattern: "ban",
    alias: ["blockuser", "addban"],
    desc: "Ban a user from using the bot",
    category: "owner",
    react: "⛔",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_❗Only the bot owner can use this command!_");

    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null) || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
    if (!target) return reply("❌ Please provide a number or tag/reply a user.");

    const banned = readBanned();
    if (banned.includes(target)) return reply("❌ This user is already banned.");

    banned.push(target);
    writeBanned(banned);

    await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/lcpy9f.jpg" },
        caption: `⛔ User has been banned from using the bot.`
    }, { quoted: mek });
});

// Unban command
cmd({
    pattern: "unban",
    alias: ["removeban"],
    desc: "Unban a user",
    category: "owner",
    react: "✅",
    filename: __filename
}, async (conn, mek, m, { from, args, isCreator, reply }) => {
    if (!isCreator) return reply("_❗Only the bot owner can use this command!_");

    let target = m.mentionedJid?.[0] || (m.quoted?.sender ?? null) || (args[0]?.replace(/[^0-9]/g, '') + "@s.whatsapp.net");
    if (!target) return reply("❌ Please provide a number or tag/reply a user.");

    let banned = readBanned();
    if (!banned.includes(target)) return reply("❌ This user is not banned.");

    banned = banned.filter(u => u !== target);
    writeBanned(banned);

    await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/lcpy9f.jpg" },
        caption: `✅ User has been unbanned.`
    }, { quoted: mek });
});

// List banned users
cmd({
    pattern: "listban",
    alias: ["banlist", "bannedusers"],
    desc: "List all banned users",
    category: "owner",
    react: "📋",
    filename: __filename
}, async (conn, mek, m, { from, isCreator, reply }) => {
    if (!isCreator) return reply("_❗Only the bot owner can use this command!_");

    const banned = readBanned();
    if (banned.length === 0) return reply("✅ No banned users found.");

    let msg = "`⛔ Banned Users:`\n\n";
    banned.forEach((id, i) => {
        msg += `${i + 1}. ${id.replace("@s.whatsapp.net", "")}\n`;
    });

    await conn.sendMessage(from, {
        image: { url: "https://files.catbox.moe/lcpy9f.jpg" },
        caption: msg
    }, { quoted: mek });
});
