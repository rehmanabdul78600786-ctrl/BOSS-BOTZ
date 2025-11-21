const config = require('../config');
const { cmd } = require('../command');
const path = require('path');
const fs = require('fs');

cmd({
    pattern: "env",
    desc: "Display the bot menu",
    category: "menu3",
    react: "⚡",
    filename: __filename
},
async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        const menuText = `╭━━━〔 *${config.BOT_NAME} Main Menu* 〕━━━╮
┃ ✨ *Owner:* ${config.OWNER_NAME}
┃ ⚙️ *Mode:* ${config.MODE}
┃ 📡 *Platform:* Heroku
┃ 🧠 *Type:* NodeJs (Multi Device)
┃ ⌨️ *Prefix:* ${config.PREFIX}
┃ 🧾 *Version:* 3.0.0 Beta
╰━━━━━━━━━━━━━━━━━━━━━━━━╯

╭━━〔 *Menu* 〕━━┈⊷
┃◈╭─────────────·๏
┃◈┃• *admin-events*
┃◈┃• *welcome*
┃◈┃• *setprefix*
┃◈┃• *mode*
┃◈┃• *auto_typing*
┃◈┃• *always_online*
┃◈┃• *auto_recording*
┃◈┃• *status_view* 
┃◈┃• *status_react*
┃◈┃• *read_message*
┃◈┃• *auto_sticker*
┃◈┃• *anti_bad*
┃◈┃• *auto_reply*
┃◈┃• *auto_voice*
┃◈┃• *custom_reacts*
┃◈┃• *auto_react*
┃◈┃• *anti_link* 
┃◈┃• *status_reply*
┃◈└───────────┈⊷
╰──────────────┈⊷
> ${config.DESCRIPTION}
`;

        // Send the menu image with caption
        await conn.sendMessage(
            from,
            {
                image: { url: config.MENU_IMAGE_URL },
                caption: menuText,
                contextInfo: {
                    mentionedJid: [m.sender],
                    forwardingScore: 999,
                    isForwarded: true,
                    forwardedNewsletterMessageInfo: {
                        newsletterJid: '120363405061777123@newsletter',
                        newsletterName: '꧁༒♛ 𝔅𝔒𝔖𝔖♛༒꧂',
                        serverMessageId: 143
                    }
                }
            },
            { quoted: mek }
        );

        // Send local audio from assets/menu.m4a
        const audioPath = path.join(__dirname, '../assets/menu.m4a');
        if (fs.existsSync(audioPath)) {
            const audioBuffer = fs.readFileSync(audioPath);
            await conn.sendMessage(
                from,
                {
                    audio: audioBuffer,
                    mimetype: 'audio/mp4',
                    ptt: true,
                },
                { quoted: mek }
            );
        } else {
            console.warn(`⚠️ Audio file not found at: ${audioPath}`);
        }

    } catch (error) {
        console.error("❌ Error in env command:", error);
        reply(`❌ Error:\n${error.message}`);
    }
});
