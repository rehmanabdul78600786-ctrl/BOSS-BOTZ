const { cmd } = require('../command');
const { getAnti, setAnti } = require('../data/antidel');

cmd({
    pattern: "antidelete",
    alias: ['antidel', 'del'],
    desc: "Toggle anti-delete feature",
    category: "misc",
    filename: __filename
}, async (conn, mek, m, { from, reply, text, isCreator }) => {
    try {
        // Only bot owner can use this command
        if (!isCreator) {
            return reply('❌ This command is only for the bot owner.');
        }

        // Fetch current status
        const currentStatus = await getAnti();

        // If no argument or "status" is provided
        if (!text || text.toLowerCase() === 'status') {
            return reply(
                `*Anti-Delete Status:* ${currentStatus ? '✅ ON' : '❌ OFF'}\n\n` +
                `Usage:\n` +
                `• .antidelete on - Enable\n` +
                `• .antidelete off - Disable\n` +
                `• .antidelete status - Check status`
            );
        }

        const action = text.toLowerCase().trim();

        // Enable anti-delete
        if (action === 'on') {
            await setAnti(true);
            return reply('✅ Anti-delete has been enabled.');
        } 
        // Disable anti-delete
        else if (action === 'off') {
            await setAnti(false);
            return reply('❌ Anti-delete has been disabled.');
        } 
        // Invalid argument
        else {
            return reply(
                '⚠️ Invalid argument.\n' +
                'Usage:\n' +
                '• .antidelete on\n' +
                '• .antidelete off\n' +
                '• .antidelete status'
            );
        }
    } catch (error) {
        console.error("Error in antidelete command:", error);
        return reply('❌ An error occurred while processing your request.');
    }
});
