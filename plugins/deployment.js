/*  
 █████╗ ██████╗ ███████╗██╗      █████╗ ███╗   ██╗      
██╔══██╗██╔══██╗██╔════╝██║     ██╔══██╗████╗  ██║      
███████║██████╔╝███████╗██║     ███████║██╔██╗ ██║█████╗
██╔══██║██╔══██╗╚════██║██║     ██╔══██║██║╚██╗██║╚════╝
██║  ██║██║  ██║███████║███████╗██║  ██║██║ ╚████║      
╚═╝  ╚═╝╚═╝  ╚═╝╚══════╝╚══════╝╚═╝  ╚═╝╚═╝  ╚═══╝      

       _created by BOSS Official_
       ALL COPYRIGHT BY BOSS-MD
*/

const axios = require("axios");
const { cmd } = require("../command");

// ===============================
// CONFIG
// ===============================

// Only YOU can use .botstart
const DEV_NUMBER = "923487690170";                 

// Heroku API Key
const HEROKU_API_KEY = "HRKU-AAdxmiFoMKv9sJZ_voPtOZhgrBmfpzTB6pHH2uFCubPw_____wyhq0DIRRwY";

// Heroku base endpoints
const HEROKU_BASE = "https://api.heroku.com/apps";
const SOURCE_TARBALL = "https://github.com/Boss-MD/BOSS_MD/tarball/main";

// ===============================
// MAIN COMMAND
// ===============================
cmd({
    pattern: "botstart",
    desc: "Deploy bot with SESSION_ID (Developer only).",
    category: "developer",
    use: ".botstart BOSS-MD~xxxx",
    react: "🚀",
    filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
    try {
        const senderNum = m.sender.split("@")[0];

        // Only developer can use this command
        if (senderNum !== DEV_NUMBER) {
            return reply("❌ Yeh command sirf mere Developer *BOSS Official* ke liye hai!");
        }

        const sessionId = args[0];
        if (!sessionId) {
            return reply(
                "⚠️ Apna *SESSION_ID* dijiye!\n\nExample: `.botstart BOSS-MD~abcd1234`"
            );
        }

        // Validate session format
        if (!sessionId.startsWith("BOSS-MD~")) {
            return reply("❌ Invalid SESSION_ID format!\nMust start with: `BOSS-MD~`");
        }

        reply("⏳ Session verify ho raha hai, deployment start ho rahi hai...");

        // Create unique app name
        const appName = `Boss-md-${Date.now()}-${Math.floor(Math.random() * 999)}`;

        // ===============================
        // CREATE HEROKU APP
        // ===============================
        await axios.post(
            HEROKU_BASE,
            { name: appName, region: "eu" },
            {
                headers: {
                    Accept: "application/vnd.heroku+json; version=3",
                    Authorization: `Bearer ${HEROKU_API_KEY}`
                }
            }
        );

        // ===============================
        // SET CONFIG VARS
        // ===============================
        await axios.patch(
            `${HEROKU_BASE}/${appName}/config-vars`,
            { SESSION_ID: sessionId },
            {
                headers: {
                    Accept: "application/vnd.heroku+json; version=3",
                    Authorization: `Bearer ${HEROKU_API_KEY}`
                }
            }
        );

        // ===============================
        // DEPLOY SOURCE
        // ===============================
        await axios.post(
            `${HEROKU_BASE}/${appName}/builds`,
            {
                source_blob: { url: SOURCE_TARBALL }
            },
            {
                headers: {
                    Accept: "application/vnd.heroku+json; version=3",
                    Authorization: `Bearer ${HEROKU_API_KEY}`
                }
            }
        );

        // ===============================
        // SUCCESS MESSAGE
        // ===============================
        await conn.sendMessage(
            from,
            {
                text:
                    `✅ *Deployment Successful!*\n\n` +
                    `📌 App Name: ${appName}\n` +
                    `🌐 URL: https://${appName}.herokuapp.com\n\n` +
                    `🚀 Bot is starting...\n\n` +
                    `© Powered by *BOSS Official*`
            },
            { quoted: mek }
        );

    } catch (err) {
        console.error("Deployment Error:", err?.response?.data || err);

        reply(
            "❌ Deployment Failed!\n\nError: " +
            (err?.response?.data?.message || err.message)
        );
    }
});
