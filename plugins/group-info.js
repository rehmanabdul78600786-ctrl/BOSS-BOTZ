const config = require('../config');
const { cmd } = require('../command');
const { getGroupAdmins } = require('../lib/functions');

cmd({
    pattern: "ginfo",
    react: "🥏",
    alias: ["groupinfo"],
    desc: "Get detailed group information.",
    category: "group",
    use: '.ginfo',
    filename: __filename
}, 
async (conn, mek, m, {
    from, isGroup, sender, isAdmins, isBotAdmins, isDev, reply, participants
}) => {
    try {
        // Check requirements
        if (!isGroup) return reply("❌ This command only works in group chats.");
        if (!isAdmins && !isDev) return reply("⛔ Only Group Admins or Bot Developer can use this command.");
        if (!isBotAdmins) return reply("❌ I need admin rights to fetch group details.");

        // Get profile picture
        let ppUrl;
        const fallbackPpUrls = [
            'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png'
        ];
        try {
            ppUrl = await conn.profilePictureUrl(from, 'image');
        } catch {
            ppUrl = fallbackPpUrls[Math.floor(Math.random() * fallbackPpUrls.length)];
        }

        // Get group metadata
        const metadata = await conn.groupMetadata(from);

        // Extract admins
        const groupAdmins = participants.filter(p => p.admin);
        const listAdmin = groupAdmins.map((v, i) => `${i + 1}. @${v.id.split('@')[0]}`).join('\n');

        // Group owner
        const owner = metadata.owner || groupAdmins[0]?.id || "unknown";

        // Compose info message
        const gdata = `*「 Group Information 」*\n
*Group Name* : ${metadata.subject}
*Group ID* : ${metadata.id}
*Participants* : ${metadata.size}
*Group Creator* : @${owner.split('@')[0]}
*Description* : ${metadata.desc?.toString() || 'No description'}\n
*Admins (${groupAdmins.length})*:\n${listAdmin}`;

        // Send group info with mentions
        await conn.sendMessage(from, {
            image: { url: ppUrl },
            caption: gdata,
            mentions: groupAdmins.map(v => v.id).concat(owner)
        }, { quoted: mek });

    } catch (e) {
        console.error("GINFO ERROR:", e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply(`❌ An error occurred:\n${e.message || e}`);
    }
});
