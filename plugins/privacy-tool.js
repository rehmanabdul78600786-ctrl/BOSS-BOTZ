const fs = require("fs");
const path = require('path');
const { cmd, commands } = require("../command");
const axios = require("axios");

// Privacy menu
cmd({
    pattern: "privacy",
    alias: ["privacymenu"],
    desc: "Privacy settings menu",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        let privacyMenu = `╭━━〔 *Privacy Settings* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• blocklist - View blocked users
┃◈┃• getbio - Get user's bio
┃◈┃• setppall - Set profile pic privacy
┃◈┃• setonline - Set online privacy
┃◈┃• setpp - Change bot's profile pic
┃◈┃• setmyname - Change bot's name
┃◈┃• updatebio - Change bot's bio
┃◈┃• groupsprivacy - Set group add privacy
┃◈┃• getprivacy - View current privacy settings
┃◈┃• getpp - Get user's profile picture
┃◈┃
┃◈┃*Options for privacy commands:*
┃◈┃• all - Everyone
┃◈┃• contacts - My contacts only
┃◈┃• contact_blacklist - Contacts except blocked
┃◈┃• none - Nobody
┃◈┃• match_last_seen - Match last seen
┃◈└───────────┈⊷
╰──────────────┈⊷
*Note:* Most commands are owner-only`;

        await conn.sendMessage(from, {
            image: { url: `https://files.catbox.moe/lcpy9f.jpg` },
            caption: privacyMenu,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363405061777123@newsletter',
                    newsletterName: "Privacy Settings",
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply(`Error: ${e.message}`);
    }
});

// Block list
cmd({
    pattern: "blocklist",
    desc: "View the list of blocked users.",
    category: "privacy",
    react: "📋",
    filename: __filename
},
async (conn, mek, m, { from, isOwner, reply }) => {
    if (!isOwner) return reply("*📛 You are not the owner!*");

    try {
        const blockedUsers = await conn.fetchBlocklist();
        if (blockedUsers.length === 0) return reply("📋 Your block list is empty.");

        const list = blockedUsers
            .map(user => `🚧 BLOCKED ${user.split('@')[0]}`)
            .join('\n');

        reply(`📋 Blocked Users (${blockedUsers.length}):\n\n${list}`);
    } catch (err) {
        console.error(err);
        reply(`❌ Failed to fetch block list: ${err.message}`);
    }
});

// Get bio
cmd({
    pattern: "getbio",
    desc: "Get any user's bio (even if private)",
    category: "privacy",
    filename: __filename
}, async (conn, mek) => {
    try {
        const target = mek.quoted ? mek.quoted.sender : mek.mentionedJid?.[0] || mek.sender;
        if (!target) return mek.reply("❌ Mention or reply to a user!");

        const bio = await conn.fetchStatus(target).catch(() => null);
        if (!bio?.status) return mek.reply("🔒 User has no bio or it's hidden.");

        await mek.reply(`📝 *Bio of @${target.split('@')[0]}*:\n\n${bio.status}`, {
            mentions: [target]
        });
    } catch (err) {
        console.error("[BIO CMD ERROR]", err);
        mek.reply("❌ Failed to fetch bio (server blocked the request).");
    }
});

// Set profile pic privacy
cmd({
    pattern: "setppall",
    desc: "Update Profile Picture Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options: all, contacts, contact_blacklist, none");

        await conn.updateProfilePicturePrivacy(value);
        reply(`✅ Profile picture privacy updated to: ${value}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Set online privacy
cmd({
    pattern: "setonline",
    desc: "Update Online Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'match_last_seen'];
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options: all, match_last_seen");

        await conn.updateOnlinePrivacy(value);
        reply(`✅ Online privacy updated to: ${value}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Set bot profile picture
cmd({
    pattern: "setpp",
    desc: "Set bot profile picture.",
    category: "privacy",
    react: "🖼️",
    filename: __filename
}, async (conn, mek, m, { isOwner, quoted, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    if (!quoted || !quoted.message.imageMessage) return reply("❌ Please reply to an image.");

    try {
        const stream = await conn.downloadContentFromMessage(quoted.message.imageMessage, 'image');
        let buffer = Buffer.from([]);
        for await (const chunk of stream) buffer = Buffer.concat([buffer, chunk]);

        const mediaPath = path.join(__dirname, `${Date.now()}.jpg`);
        fs.writeFileSync(mediaPath, buffer);

        await conn.updateProfilePicture(conn.user.jid, { url: `file://${mediaPath}` });
        reply("🖼️ Profile picture updated successfully!");
    } catch (error) {
        console.error("Error updating profile picture:", error);
        reply(`❌ Error updating profile picture: ${error.message}`);
    }
});

// Update display name
cmd({
    pattern: "setmyname",
    desc: "Set your WhatsApp display name.",
    category: "privacy",
    react: "⚙️",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");
    const displayName = args.join(" ");
    if (!displayName) return reply("❌ Please provide a display name.");

    try {
        await conn.updateProfileName(displayName);
        reply(`✅ Your display name has been set to: ${displayName}`);
    } catch (err) {
        console.error(err);
        reply("❌ Failed to set your display name.");
    }
});

// Update bio
cmd({
    pattern: "updatebio",
    react: "🥏",
    desc: "Change the Bot number Bio.",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { isOwner, q, reply }) => {
    try {
        if (!isOwner) return reply('🚫 You must be an Owner to use this command');
        if (!q) return reply('❓ Enter the new bio');
        if (q.length > 139) return reply('❗ Character limit exceeded');

        await conn.updateProfileStatus(q);
        await conn.sendMessage(m.from, { text: "✔️ New Bio Added Successfully" }, { quoted: mek });
    } catch (e) {
        reply('🚫 An error occurred!\n\n' + e);
        console.error(e);
    }
});

// Group add privacy
cmd({
    pattern: "groupsprivacy",
    desc: "Update Group Add Privacy",
    category: "privacy",
    react: "🔐",
    filename: __filename
}, async (conn, mek, m, { isOwner, args, reply }) => {
    if (!isOwner) return reply("❌ You are not the owner!");

    try {
        const value = args[0] || 'all';
        const validValues = ['all', 'contacts', 'contact_blacklist', 'none'];
        if (!validValues.includes(value)) return reply("❌ Invalid option. Valid options: all, contacts, contact_blacklist, none");

        await conn.updateGroupsAddPrivacy(value);
        reply(`✅ Group add privacy updated to: ${value}`);
    } catch (e) {
        reply(`❌ Error: ${e.message}`);
    }
});

// Get privacy settings
cmd({
    pattern: "getprivacy",
    desc: "Get the bot Number Privacy Setting Updates.",
    category: "privacy",
    filename: __filename
}, async (conn, mek, m, { isOwner, reply }) => {
    try {
        if (!isOwner) return reply('🚫 You must be an Owner to use this command');
        const duka = await conn.fetchPrivacySettings?.();
        if (!duka) return reply('🚫 Failed to fetch privacy settings');

        let puka = `
╭───「 𝙿𝚁𝙸𝚅𝙰𝙲𝚈  」───◆
│ ∘ Read Receipt: ${duka.readreceipts}
│ ∘ Profile Picture: ${duka.profile}
│ ∘ Status: ${duka.status}
│ ∘ Online: ${duka.online}
│ ∘ Last Seen: ${duka.last}
│ ∘ Group Privacy: ${duka.groupadd}
│ ∘ Call Privacy: ${duka.calladd}
╰────────────────────`;

        await conn.sendMessage(m.from, { text: puka }, { quoted: mek });
    } catch (e) {
        reply('🚫 An error occurred!\n\n' + e);
        console.error(e);
    }
});

// Get profile picture
cmd({
    pattern: "getpp",
    desc: "Get profile picture of mentioned/replied user",
    category: "owner",
    filename: __filename
}, async (conn, mek) => {
    try {
        const target = mek.quoted ? mek.quoted.sender : mek.mentionedJid?.[0] || mek.sender;
        if (!target) return mek.reply("Please mention a user or reply to their message");

        let ppUrl;
        try { ppUrl = await conn.profilePictureUrl(target, "image"); }
        catch { return mek.reply("Couldn't fetch profile picture. The user might have no profile photo or it's private."); }

        await conn.sendMessage(mek.chat, {
            image: { url: ppUrl },
            caption: `Profile picture of @${target.split('@')[0]}`,
            mentions: [target]
        }, { quoted: mek });

    } catch (error) {
        console.error("[PP ERROR]", error);
        mek.reply("An error occurred while fetching the profile picture");
    }
});
