const axios = require('axios');
const { cmd } = require('../command');

// ===============================
// CONFIG
// ===============================
const HEROKU_API_KEY = 'HRKU-AAdxmiFoMKv9sJZ_voPtOZhgrBmfpzTB6pHH2uFCubPw_____wyhq0DIRRwY';
const DEVELOPER_NUMBER = '923487690170'; // Only this number can run the command
const HEROKU_BASE = 'https://api.heroku.com/apps';

// ===============================
// MAIN COMMAND
// ===============================
cmd({
    pattern: 'delherokuall',
    desc: '⚠️ Delete all Heroku deployments (Developer Only).',
    category: 'developer',
    react: '⚡',
    filename: __filename
}, async (conn, m, store, { from, sender, reply }) => {
    try {
        const senderNumber = sender.split('@')[0];

        // Only developer can run
        if (senderNumber !== DEVELOPER_NUMBER) {
            return reply('❌ Yeh command sirf Developer ke liye hai!');
        }

        // Inform user that deletion is starting
        await reply('⏳ Sari Heroku apps delete ki ja rahi hain...');

        // Fetch all apps from Heroku
        const { data: apps } = await axios.get(HEROKU_BASE, {
            headers: {
                Accept: 'application/vnd.heroku+json; version=3',
                Authorization: `Bearer ${HEROKU_API_KEY}`
            }
        });

        if (!apps || apps.length === 0) {
            return reply('⚠️ Koi bhi app nahi mili jo delete ki ja sake!');
        }

        // Delete each app
        let deletedCount = 0;
        for (const app of apps) {
            try {
                await axios.delete(`${HEROKU_BASE}/${app.id}`, {
                    headers: {
                        Accept: 'application/vnd.heroku+json; version=3',
                        Authorization: `Bearer ${HEROKU_API_KEY}`
                    }
                });
                deletedCount++;
            } catch (err) {
                console.error(`Failed to delete app ${app.name}:`, err.message);
            }
        }

        // Success message
        await conn.sendMessage(from, {
            text: `✅ *Saari Heroku Deployments Delete Ho Gayi!* 🚀\n\nTotal Deleted: ${deletedCount}`
        }, { quoted: m });

    } catch (error) {
        console.error('Delete Heroku Error:', error?.response?.data || error);
        reply('❌ Delete Error: ' + (error?.response?.data?.message || error.message));
    }
});
