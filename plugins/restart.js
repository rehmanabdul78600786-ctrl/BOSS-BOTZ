const { cmd } = require("../command");
const { sleep } = require("../lib/functions");
const { exec } = require("child_process");

cmd({
    pattern: "restart",
    desc: "Restart Arslan-MD",
    category: "owner",
    filename: __filename
},
async (conn, mek, m, { reply, isCreator }) => {
    try {
        if (!isCreator) {
            return reply("❌ Only the bot owner can use this command.");
        }

        reply("🔄 Restarting bot...");
        await sleep(1500);

        exec("pm2 restart all", (error, stdout, stderr) => {
            if (error) {
                console.error("Restart Error:", error);
                return reply(`❌ Failed to restart:\n${error.message}`);
            }
            console.log("Bot restarted successfully:\n", stdout || stderr);
            reply("✅ Bot has been restarted successfully.");
        });

    } catch (e) {
        console.error("Restart Command Error:", e);
        reply(`❌ An error occurred:\n${e.message}`);
    }
});
