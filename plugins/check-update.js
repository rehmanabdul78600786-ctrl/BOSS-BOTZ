const axios = require('axios');
const os = require('os');
const fs = require('fs');
const path = require('path');
const { cmd, commands } = require('../command');
const { runtime } = require('../lib/functions');

cmd({
    pattern: 'version',
    alias: ['changelog', 'cupdate', 'checkupdate'],
    react: '🚀',
    desc: "Check bot's version, system stats, and update info.",
    category: 'info',
    filename: __filename
}, async (conn, mek, m, { from, sender, pushname, reply }) => {
    try {
        // ----- Local Version -----
        const localVersionPath = path.join(__dirname, '../data/version.json');
        let localVersion = 'Unknown';
        let changelog = 'No changelog available.';
        if (fs.existsSync(localVersionPath)) {
            const localData = JSON.parse(fs.readFileSync(localVersionPath));
            localVersion = localData.version || localVersion;
            changelog = localData.changelog || changelog;
        }

        // ----- Latest Version from GitHub -----
        const rawVersionUrl = 'https://raw.githubusercontent.com/bOSS-MD/BOSS_MD/main/data/version.json';
        let latestVersion = 'Unknown';
        let latestChangelog = 'No changelog available.';
        try {
            const { data } = await axios.get(rawVersionUrl);
            latestVersion = data.version || latestVersion;
            latestChangelog = data.changelog || latestChangelog;
        } catch (err) {
            console.error('Failed to fetch latest version:', err);
        }

        // ----- Plugin & Command Counts -----
        const pluginPath = path.join(__dirname, '../plugins');
        const pluginCount = fs.readdirSync(pluginPath).filter(file => file.endsWith('.js')).length;
        const totalCommands = commands.length;

        // ----- System Info -----
        const uptime = runtime(process.uptime());
        const ramUsage = (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2);
        const totalRam = (os.totalmem() / 1024 / 1024).toFixed(2);
        const hostName = os.hostname();
        const lastUpdate = fs.existsSync(localVersionPath)
            ? fs.statSync(localVersionPath).mtime.toLocaleString()
            : 'Unknown';

        // ----- Update Status -----
        let updateMessage = `✅ Your ×º𝓑𝖔𝙨𝙨º× bot is up-to-date!`;
        if (localVersion !== latestVersion) {
            updateMessage = `🚀 Your ×º𝓑𝖔𝙨𝙨º× bot is outdated!\n` +
                `🔹 *Current Version:* ${localVersion}\n` +
                `🔹 *Latest Version:* ${latestVersion}\n\n` +
                `Use *.update* to update.`;
        }

        // ----- GitHub Info -----
        const githubRepo = 'https://github.com/rehmanabdul78600786-ctrl/BOSS-BOTZ';

        // ----- Construct Status Message -----
        const statusMessage = 
            `🌟 *Good ${new Date().getHours() < 12 ? 'Morning' : 'Night'}, ${pushname}!* 🌟\n\n` +
            `📌 *Bot Name:* ꧁༒♛ 𝔅𝔒𝔖𝔖♛༒꧂\n` +
            `🔖 *Current Version:* ${localVersion}\n` +
            `📢 *Latest Version:* ${latestVersion}\n` +
            `📂 *Total Plugins:* ${pluginCount}\n` +
            `🔢 *Total Commands:* ${totalCommands}\n\n` +
            `💾 *System Info:*\n` +
            `⏳ *Uptime:* ${uptime}\n` +
            `📟 *RAM Usage:* ${ramUsage}MB / ${totalRam}MB\n` +
            `⚙️ *Host Name:* ${hostName}\n` +
            `📅 *Last Update:* ${lastUpdate}\n\n` +
            `📝 *Changelog:*\n${latestChangelog}\n\n` +
            `⭐ *GitHub Repo:* ${githubRepo}\n` +
            `👤 *Owner:* [×º𝓑𝖔𝙨𝙨º×](https://github.com/Boss)\n\n` +
            `${updateMessage}\n\n🚀 *Don't forget to fork & star the repo!*`;

        // ----- Send Message -----
        await conn.sendMessage(from, {
            image: { url: 'https://i.ibb.co/k656h6yt/temp.jpg' },
            caption: statusMessage,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '1120363405061777123@newsletter',
                    newsletterName: 'ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (error) {
        console.error('Error fetching version info:', error);
        reply('❌ An error occurred while checking the bot version.');
    }
});
