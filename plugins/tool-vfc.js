const fs = require('fs').promises;
const path = require('path');
const { cmd } = require('../command');
const { sleep } = require('../lib/functions');

cmd({
    pattern: 'savecontact',
    alias: ["vcf","scontact","savecontacts"],
    desc: 'Export all group participants as a VCF contact file',
    category: 'tools',
    filename: __filename
}, async (conn, mek, m, { from, isGroup, isOwner, groupMetadata, reply }) => {
    try {
        if (!isGroup) return reply("❌ This command can only be used in groups.");
        if (!isOwner) return reply("❌ Only the bot owner can use this command.");

        const participants = groupMetadata.participants;
        if (!participants || participants.length === 0) 
            return reply("❌ No participants found in this group.");

        // Generate vCard content
        let vcard = '';
        participants.forEach((user, index) => {
            const phone = user.id.split("@")[0];
            vcard += 
`BEGIN:VCARD
VERSION:3.0
FN:[${index + 1}] +${phone}
TEL;type=CELL;type=VOICE;waid=${phone}:+${phone}
END:VCARD
`;
        });

        // Generate a unique filename
        const fileName = `contacts_${Date.now()}.vcf`;
        const filePath = path.join('./', fileName);

        await fs.writeFile(filePath, vcard.trim());
        await reply(`💾 Saving ${participants.length} participants...`);

        // Send the vCard file
        await conn.sendMessage(from, {
            document: await fs.readFile(filePath),
            mimetype: 'text/vcard',
            fileName: `GroupContacts_${groupMetadata.subject}.vcf`,
            caption: `✅ Done saving contacts!\nGroup Name: *${groupMetadata.subject}*\nTotal Contacts: *${participants.length}*\n> ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🔥🥀𝘽οꜱꜱ🥀🔥`
        }, { quoted: mek });

    } catch (err) {
        console.error("❌ Error in savecontact command:", err);
        reply("❌ An error occurred: " + err.message);
    } finally {
        // Cleanup temporary file
        try {
            if (filePath) await fs.unlink(filePath);
        } catch (cleanupErr) {
            console.error("❌ Error cleaning up file:", cleanupErr);
        }
    }
});
