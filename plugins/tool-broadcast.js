const { cmd } = require('../command');
const { sleep } = require('../lib/functions2');

cmd({
    pattern: "broadcast",
    category: "group",
    desc: "Bot makes a broadcast in all groups",
    filename: __filename,
    use: "<text for broadcast>"
}, async (conn, mek, m, { q, isGroup, isAdmins, isOwner, reply }) => {
    try {
        // Ensure command is used in a group
        if (!isGroup) return reply("❌ This command can only be used in groups!");

        // Only owner/admin can broadcast
        if (!isOwner && !isAdmins) return reply("❌ Only admins/owner can broadcast!");

        // Ensure broadcast text is provided
        if (!q) return reply("❌ Please provide the text to broadcast.");

        // Fetch all participating groups
        const allGroups = await conn.groupFetchAllParticipating();
        const groupIds = Object.keys(allGroups);

        if (!groupIds.length) return reply("❌ No groups found to broadcast.");

        await reply(`📢 Broadcasting to ${groupIds.length} groups...\n⏳ Estimated time: ~${Math.ceil(groupIds.length * 1.5)} seconds`);

        let successCount = 0;
        const failedGroups = [];

        for (let i = 0; i < groupIds.length; i++) {
            const groupId = groupIds[i];
            try {
                await conn.sendMessage(groupId, { text: q });
                successCount++;

                // Update progress every 5 groups
                if ((i + 1) % 5 === 0) {
                    await reply(`🔄 Broadcast progress: ${i + 1}/${groupIds.length} groups sent`);
                }

                await sleep(1500); // Avoid rate limits
            } catch (err) {
                failedGroups.push(groupId);
                console.log(`❌ Failed to send to ${groupId}:`, err);
            }
        }

        // Final summary
        let summary = `✅ Broadcast completed!\n\n📤 Success: ${successCount}/${groupIds.length}`;
        if (failedGroups.length) {
            summary += `\n❌ Failed: ${failedGroups.length} groups`;
        }

        return reply(summary);

    } catch (err) {
        console.error("Broadcast Error:", err);
        return reply(`❌ An error occurred while broadcasting:\n${err.message}`);
    }
});
