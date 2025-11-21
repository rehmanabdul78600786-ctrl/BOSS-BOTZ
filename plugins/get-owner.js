const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅",
    desc: "Get owner contact number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; // e.g., +923XXXXXXXXX
        const ownerName = config.OWNER_NAME || "Bot Owner";

        // Construct vCard
        const vcard = 
            `BEGIN:VCARD\n` +
            `VERSION:3.0\n` +
            `FN:${ownerName}\n` +
            `TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+', '')}:${ownerNumber}\n` +
            `END:VCARD`;

        // Send the contact card
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

    } catch (error) {
        console.error("Owner command error:", error);
        reply(`❌ An error occurred: ${error.message}`);
    }
});
