const { cmd } = require('../command');

/**
 * Helper function to send dynamic emoji/ascii edit messages
 */
async function dynamicEditMessage(conn, from, initialText, messages, delay = 1000, reply) {
    try {
        const loadingMessage = await conn.sendMessage(from, { text: initialText });
        for (const msg of messages) {
            await new Promise(resolve => setTimeout(resolve, delay));
            await conn.relayMessage(
                from,
                {
                    protocolMessage: {
                        key: loadingMessage.key,
                        type: 14,
                        editedMessage: {
                            conversation: msg,
                        },
                    },
                },
                {}
            );
        }
    } catch (e) {
        console.log(e);
        reply?.(`❌ *Error!* ${e.message}`);
    }
}

// Happy command
cmd({
    pattern: "happy",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "😂",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["😃", "😄", "😁", "😊", "😎", "🥳", "😸", "😹", "🌞", "🌈", "😃", "😄", "😁", "😊", "😎", "🥳", "😸", "😹", "🌞", "🌈", "😃", "😄", "😁", "😊"];
    dynamicEditMessage(conn, from, '😂', emojis, 1000, reply);
});

// Heart command
cmd({
    pattern: "heart",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "❤️",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["💖", "💗", "💕", "🩷", "💛", "💚", "🩵", "💙", "💜", "🖤", "🩶", "🤍", "🤎", "❤️‍🔥", "💞", "💓", "💘", "💝", "♥️", "💟", "❤️‍🩹", "❤️"];
    dynamicEditMessage(conn, from, '🖤', emojis, 1000, reply);
});

// Angry command
cmd({
    pattern: "angry",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🤡",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["😡", "😠", "🤬", "😤", "😾", "😡", "😠", "🤬", "😤", "😾"];
    dynamicEditMessage(conn, from, '👽', emojis, 1000, reply);
});

// Sad command
cmd({
    pattern: "sad",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "😶",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["🥺", "😟", "😕", "😖", "😫", "🙁", "😩", "😥", "😓", "😪", "😢", "😔", "😞", "😭", "💔", "😭", "😿"];
    dynamicEditMessage(conn, from, '😔', emojis, 1000, reply);
});

// Shy command
cmd({
    pattern: "shy",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🧐",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["😳", "😊", "😶", "🙈", "🙊", "😳", "😊", "😶", "🙈", "🙊"];
    dynamicEditMessage(conn, from, '🧐', emojis, 1000, reply);
});

// Moon command
cmd({
    pattern: "moon",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🌚",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["🌗","🌘","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘","🌑","🌒","🌓","🌔","🌕","🌖","🌝🌚"];
    dynamicEditMessage(conn, from, '🌝', emojis, 1000, reply);
});

// Confused command
cmd({
    pattern: "confused",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🤔",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["😕", "😟", "😵", "🤔", "😖", "😲", "😦", "🤷", "🤷‍♂️", "🤷‍♀️"];
    dynamicEditMessage(conn, from, '🤔', emojis, 1000, reply);
});

// Hot command
cmd({
    pattern: "hot",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "💋",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const emojis = ["🥵","❤️","💋","😫","🤤","😋","🥵","🥶","🙊","😻","🙈","💋","🫂","🫀","👅","👄","💋"];
    dynamicEditMessage(conn, from, '💋', emojis, 1000, reply);
});

// Nikal command (ASCII art)
cmd({
    pattern: "nikal",
    desc: "Displays a dynamic edit msg for fun.",
    category: "tools",
    react: "🗿",
    filename: __filename
}, (conn, mek, m, { from, reply }) => {
    const asciiMessages = [
        "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ... BOSS-MD ASCII ...",
        "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ... Lavde ASCII ...",
        "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ... Pehli ASCII ...",
        "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ... Fursat ASCII ...",
        "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ... Meeee ASCII ...",
        "⠀⠀⠀⣠⣶⡾⠏⠉⠙⠳⢦⡀⠀⠀⠀⢠⠞⠉⠙⠲⡀⠀\n ... Nikal ASCII ..."
    ];
    dynamicEditMessage(conn, from, '꧁༒♛ 𝔅𝔒𝔖𝔖♛༒꧂🗿', asciiMessages, 500, reply);
});
