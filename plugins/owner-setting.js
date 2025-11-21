const { cmd, commands } = require('../command');
const { exec } = require('child_process');
const config = require('../config');
const { sleep } = require('../lib/functions');

// ================================================================
// 1. Shutdown Bot
// ================================================================
cmd({
    pattern: "shutdown",
    desc: "Shutdown the bot.",
    category: "owner",
    react: "🛑",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    reply("🛑 Shutting down...");
    await sleep(500);
    process.exit(0);
});

// ================================================================
// 2. Broadcast Message to All Groups
// ================================================================
cmd({
    pattern: "broadcast",
    desc: "Broadcast a message to all groups.",
    category: "owner",
    react: "📢",
    filename: __filename
},
async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!args.length) return reply("📢 Please provide a message to broadcast.");

    const message = args.join(" ");
    const groups = await conn.groupFetchAllParticipating();
    const groupList = Object.keys(groups);

    for (const groupId of groupList) {
        await conn.sendMessage(groupId, { text: message }, { quoted: mek });
        await sleep(200);
    }

    reply("📢 Message broadcasted to all groups successfully.");
});

// ================================================================
// 3. Set Profile Picture
// ================================================================
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "owner",
    react: "🖼️",
    filename: __filename
},
async (conn, mek, m, { isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message || !quoted.message.imageMessage)
        return reply("❌ Please reply to an image.");

    try {
        const media = await quoted.download();
        await conn.updateProfilePicture(conn.user.id, media);
        reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});

// ================================================================
// 4. Clear All Chats
// ================================================================
cmd({
    pattern: "clearchats",
    desc: "Clear all chats from the bot.",
    category: "owner",
    react: "🧹",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const chats = Object.keys(conn.chats);

        for (const jid of chats) {
            await conn.chatModify({ delete: true }, jid);
            await sleep(200);
        }

        reply("🧹 All chats cleared successfully!");
    } catch (error) {
        reply(`❌ Error clearing chats: ${error.message}`);
    }
});

// ================================================================
// 5. Get All Group JIDs
// ================================================================
cmd({
    pattern: "gjid",
    desc: "Get list of all group JIDs.",
    category: "owner",
    react: "📝",
    filename: __filename
},
async (conn, mek, m, { isOwner, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    const groups = await conn.groupFetchAllParticipating();
    const list = Object.keys(groups).map(v => "• " + v).join("\n");

    reply(`📝 *Group JIDs:*\n\n${list}`);
});

// ================================================================
// 6. Delete Message
// ================================================================
cmd({
    pattern: "delete",
    alias: ["del"],
    desc: "Delete a message",
    category: "group",
    react: "❌",
    filename: __filename
},
async (conn, mek, m, { isOwner, isAdmins, isBotAdmins, quoted, reply }) => {
    if (!isBotAdmins) return reply("❌ I need admin rights.");
    if (!isOwner && !isAdmins) return;
    if (!quoted) return reply("❌ Reply to the message you want to delete.");

    try {
        await conn.sendMessage(m.chat, {
            delete: {
                remoteJid: m.chat,
                id: quoted.key.id,
                participant: quoted.key.participant
            }
        });
    } catch (err) {
        reply("⚠️ Could not delete the message.");
    }
});
