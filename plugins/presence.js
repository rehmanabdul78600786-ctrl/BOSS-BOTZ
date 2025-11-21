const config = require('../config');
const { cmd } = require('../command');

// Presence Control (Online/Offline)
cmd({
    on: "body" // Trigger on every incoming message
}, async (conn, mek, m, { from }) => {
    try {
        // If ALWAYS_ONLINE=true → Bot stays online 24/7
        // If ALWAYS_ONLINE=false → Bot shows default WhatsApp behavior
        if (config.ALWAYS_ONLINE === "true") {
            await conn.sendPresenceUpdate("available", from);
        }
        // If false, do nothing (WhatsApp handles presence naturally)
    } catch (e) {
        console.error("[Presence Error]", e);
    }
});
