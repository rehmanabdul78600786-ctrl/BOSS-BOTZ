const { cmd } = require('../command');
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// ======================== Remove Non-Admin Members ========================
cmd({
    pattern: "removemembers",
    alias: ["kickall", "endgc", "endgroup"],
    desc: "Remove all non-admin members from the group.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, { from, groupMetadata, groupAdmins, isBotAdmins, senderNumber, reply, isGroup }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

        const allParticipants = groupMetadata.participants;
        const nonAdminParticipants = allParticipants.filter(p => !groupAdmins.includes(p.id));

        if (nonAdminParticipants.length === 0) return reply("❌ There are no non-admin members to remove.");

        reply(`⚠️ Starting to remove ${nonAdminParticipants.length} non-admin members...`);

        for (let participant of nonAdminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000); // delay between removals
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all non-admin members from the group.");
    } catch (e) {
        console.error("Error removing non-admin members:", e);
        reply("❌ An error occurred while trying to remove non-admin members. Please try again.");
    }
});

// ======================== Remove Admin Members ========================
cmd({
    pattern: "removeadmins",
    alias: ["kickadmins", "kickall3", "deladmins"],
    desc: "Remove all admin members from the group, excluding the bot and bot owner.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, senderNumber, groupMetadata, groupAdmins, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

        const adminParticipants = groupMetadata.participants.filter(
            p => groupAdmins.includes(p.id) && p.id !== conn.user.id && p.id !== `${botOwner}@s.whatsapp.net`
        );

        if (adminParticipants.length === 0) return reply("❌ There are no admin members to remove.");

        reply(`⚠️ Starting to remove ${adminParticipants.length} admin members (excluding bot & owner)...`);

        for (let participant of adminParticipants) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all admin members (excluding bot & owner).");
    } catch (e) {
        console.error("Error removing admins:", e);
        reply("❌ An error occurred while trying to remove admins. Please try again.");
    }
});

// ======================== Remove Everyone Except Bot & Owner ========================
cmd({
    pattern: "removeall2",
    alias: ["kickall2", "endgc2", "endgroup2"],
    desc: "Remove all members and admins from the group, excluding the bot and bot owner.",
    react: "🎉",
    category: "group",
    filename: __filename,
}, 
async (conn, mek, m, { from, isGroup, senderNumber, groupMetadata, isBotAdmins, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        const botOwner = conn.user.id.split(":")[0];
        if (senderNumber !== botOwner) return reply("❌ Only the bot owner can use this command.");
        if (!isBotAdmins) return reply("❌ I need to be an admin to execute this command.");

        const participantsToRemove = groupMetadata.participants.filter(
            p => p.id !== conn.user.id && p.id !== `${botOwner}@s.whatsapp.net`
        );

        if (participantsToRemove.length === 0) return reply("❌ No members to remove after excluding bot & owner.");

        reply(`⚠️ Starting to remove ${participantsToRemove.length} members (excluding bot & owner)...`);

        for (let participant of participantsToRemove) {
            try {
                await conn.groupParticipantsUpdate(from, [participant.id], "remove");
                await sleep(2000);
            } catch (e) {
                console.error(`Failed to remove ${participant.id}:`, e);
            }
        }

        reply("✅ Successfully removed all members (excluding bot & owner).");
    } catch (e) {
        console.error("Error removing members:", e);
        reply("❌ An error occurred while trying to remove members. Please try again.");
    }
});
