const { cmd } = require('../command');
const config = require('../config');

cmd({
    pattern: "owner",
    react: "✅",
    desc: "Get owner number",
    category: "main",
    filename: __filename
}, 
async (conn, mek, m, { from, reply }) => {
    try {
        const ownerNumber = config.OWNER_NUMBER; // e.g. +1234567890
        const ownerName = config.OWNER_NAME;

        // Prepare vCard
        const vcard = `BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;type=CELL;type=VOICE;waid=${ownerNumber.replace('+','')}:${ownerNumber}
END:VCARD`;

        // Send vCard
        await conn.sendMessage(from, {
            contacts: {
                displayName: ownerName,
                contacts: [{ vcard }]
            }
        });

        // Send owner info with image
        await conn.sendMessage(from, {
            image: { url: 'https://files.catbox.moe/yj7zp0.png' },
            caption: `╭━━〔 *✿.｡Ɓ𝗼𐍃𐍃.:* ☆* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *Here is the owner details*
┃◈┃• *Name* - ${ownerName}
┃◈┃• *Number* - ${ownerNumber}
┃◈┃• *Version*: 2.0.0 Beta
┃◈└───────────┈⊷
╰──────────────┈⊷
> *© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 𝐀𝐫𝐬𝐥𝐚𝐧_𝐌𝐃 ❣️*`,
            contextInfo: {
                mentionedJid: [`${ownerNumber.replace('+', '')}@s.whatsapp.net`],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363348739987203@newsletter',
                    newsletterName: '*✿.｡Ɓ𝗼𐍃𐍃.:* ☆*',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek || null }); // quote mek if it exists

        // Send audio as PTT
        await conn.sendMessage(from, {
            audio: { url: 'https://files.catbox.moe/4fz6jh.mp3' },
            mimetype: 'audio/mp4',
            ptt: true
        }, { quoted: mek || null });

    } catch (error) {
        console.error("Owner Command Error:", error);
        reply?.(`❌ An error occurred: ${error.message}`);
    }
});
