const config = require('../config');
const { cmd } = require('../command');

cmd(
{
    on: "body" // Trigger on any incoming message
},
async (conn, mek, m, { from }) => {
    try {
        // Check if auto-recording is enabled
        if (config.AUTO_RECORDING !== 'true') return;
        if (!from) return;

        // Trigger recording presence
        await conn.sendPresenceUpdate('recording', from);

        // Optional short delay to mimic real recording
        await new Promise(resolve => setTimeout(resolve, 1200));

    } catch (err) {
        console.error("❌ AUTO-RECORDING ERROR:", err);
    }
});
