const config = require('../config');
const { cmd } = require('../command');

cmd(
{
    on: "body"   // Runs when any message is received
},
async (conn, mek, m, { from, isOwner }) => {
    
    try {

        // If disabled, exit immediately
        if (config.AUTO_TYPING !== 'true') return;
        
        // Trigger composing presence
        await conn.sendPresenceUpdate('composing', from);

        // Optional: Short natural delay to mimic real human typing
        await new Promise(res => setTimeout(res, 1200));

    } catch (err) {
        console.error("AUTO_TYPING Error:", err);
    }
});
