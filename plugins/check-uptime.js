
const { cmd } = require('../command');
const { runtime } = require('../lib/functions');
const config = require('../config');

cmd({
    pattern: "uptime",
    alias: ["runtime", "up"],
    desc: "Show bot uptime with stylish formats",
    category: "main",
    react: "⏱️",
    filename: __filename
},
async (conn, mek, m, { from, reply }) => {
    try {
        // Get uptime and start time
        const uptime = runtime(process.uptime());
        const startTime = new Date(Date.now() - process.uptime() * 1000);

        // Styles
        const styles = [
            // Style 1: Classic Box
            `╭───『 UPTIME 』───⳹
│
│ ⏱️ ${uptime}
│
│ 🚀 Started: ${startTime.toLocaleString()}
│
╰────────────────⳹
${config.DESCRIPTION}`,

            // Style 2: Minimalist
            `•——[ UPTIME ]——•
  │
  ├─ ⏳ ${uptime}
  ├─ 🕒 Since: ${startTime.toLocaleTimeString()}
  │
  •——[ ${config.BOT_NAME} ]——•`,

            // Style 3: Fancy Borders
            `▄▀▄▀▄ BOT UPTIME ▄▀▄▀▄

  ♢ Running: ${uptime}
  ♢ Since: ${startTime.toLocaleDateString()}
  
  ${config.DESCRIPTION}`,

            // Style 4: Code Style
            `┌──────────────────────┐
│  ⚡ UPTIME STATUS ⚡  │
├──────────────────────┤
│ • Time: ${uptime}
│ • Started: ${startTime.toLocaleString()}
│ • Version: 4.0.0
└──────────────────────┘`,

            // Style 5: Modern Blocks
            `▰▰▰▰▰ UPTIME ▰▰▰▰▰

  ⏳ ${uptime}
  🕰️ ${startTime.toLocaleString()}
  
  ${config.DESCRIPTION}`,

            // Style 6: Retro Terminal
            `╔══════════════════════╗
║   ${config.BOT_NAME} UPTIME    ║
╠══════════════════════╣
║ > RUNTIME: ${uptime}
║ > SINCE: ${startTime.toLocaleString()}
╚══════════════════════╝`,

            // Style 7: Elegant
            `┌───────────────┐
│  ⏱️  UPTIME  │
└───────────────┘
│
│ ${uptime}
│
│ Since ${startTime.toLocaleDateString()}
│
┌───────────────┐
│  ${config.BOT_NAME}  │
└───────────────┘`,

            // Style 8: Social Media Style
            `⏱️ *Uptime Report* ⏱️

🟢 Online for: ${uptime}
📅 Since: ${startTime.toLocaleString()}

${config.DESCRIPTION}`,

            // Style 9: Fancy List
            `╔♫═⏱️═♫══════════╗
   ${config.BOT_NAME} UPTIME
╚♫═⏱️═♫══════════╝

•・゜゜・* ✧  *・゜゜・•
 ✧ ${uptime}
 ✧ Since ${startTime.toLocaleDateString()}
•・゜゜・* ✧  *・゜゜・•`,

            // Style 10: Professional
            `┏━━━━━━━━━━━━━━━━━━┓
┃  UPTIME ANALYSIS  ┃
┗━━━━━━━━━━━━━━━━━━┛

◈ Duration: ${uptime}
◈ Start Time: ${startTime.toLocaleString()}
◈ Stability: 100%
◈ Version:  4.0.0

${config.DESCRIPTION}`
        ];

        // Pick a random style
        const selectedStyle = styles[Math.floor(Math.random() * styles.length)];

        // Send message
        await conn.sendMessage(from, { 
            text: selectedStyle,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: '120363405061777123@newsletter',
                    newsletterName: config.OWNER_NAME || '×º𝓑𝖔𝙨𝙨º×',
                    serverMessageId: 143
                }
            }
        }, { quoted: mek });

    } catch (e) {
        console.error("Uptime Error:", e);
        reply(`❌ Error: ${e.message}`);
    }
});
