const { cmd } = require('../command');

cmd({
    pattern: "hack",
    desc: "Displays a dynamic and playful 'Hacking' message for fun.",
    category: "fun",
    filename: __filename
},
async (conn, mek, m, { 
    from, quoted, body, isCmd, command, args, q, isGroup, senderNumber, reply 
}) => {
    try {
        // Extract bot owner number from conn.user.id safely
        const botOwner = conn.user?.id?.split(":")[0]?.replace(/[^0-9]/g, "");

        if (!botOwner) {
            return reply("❌ Unable to detect bot owner ID.");
        }

        // Normalize sender number
        const sender = senderNumber.replace(/[^0-9]/g, "");

        if (sender !== botOwner) {
            return reply("⚠️ Only the *bot owner* can use this command.");
        }

        const steps = [
            '💻 *HACK STARTING...* 💻',

            '*Initializing hacking tools...* 🛠️',
            '*Connecting to remote servers...* 🌐',

            '```[█.........] 10%``` ⏳',
            '```[███.......] 20%``` ⏳',
            '```[█████.....] 30%``` ⏳',
            '```[███████...] 40%``` ⏳',
            '```[██████████] 50%``` ⏳',
            '```[█████████████] 60%``` ⏳',
            '```[████████████████] 70%``` ⏳',
            '```[███████████████████] 80%``` ⏳',
            '```[██████████████████████] 90%``` ⏳',
            '```[████████████████████████] 100%``` ✅',

            '🔒 *System Breach: Successful!* 🔓',
            '🚀 *Command Execution: Complete!* 🎯',

            '*📡 Transmitting data...* 📤',
            '_🕵️‍♂️ Maintaining stealth mode..._ 🤫',
            '*🔧 Finalizing operations...* 🏁',

            '⚠️ *Note:* This is for entertainment purposes only.',
            '⚠️ *Reminder:* Always follow ethical hacking practices.',

            '> *BOSS-MD-HACKING-COMPLETE ☣*'
        ];

        for (const line of steps) {
            await conn.sendMessage(from, { text: line }, { quoted: mek });
            await new Promise(resolve => setTimeout(resolve, 850)); // faster + smooth
        }

    } catch (e) {
        console.error(e);
        reply(`❌ *Error:* ${e.message}`);
    }
});
