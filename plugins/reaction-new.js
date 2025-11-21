const { cmd } = require("../command");
const { fetchGif, gifToVideo } = require("../lib/fetchGif");
const axios = require("axios");

// Define all reaction commands
const reactions = [
    { pattern: "cry", desc: "Send a crying reaction GIF.", emoji: "😢", api: "cry" },
    { pattern: "cuddle", desc: "Send a cuddle reaction GIF.", emoji: "🤗", api: "cuddle" },
    { pattern: "bully", desc: "Send a bully reaction GIF.", emoji: "😈", api: "bully" },
    { pattern: "hug", desc: "Send a hug reaction GIF.", emoji: "🤗", api: "hug" },
    { pattern: "awoo", desc: "Send an awoo reaction GIF.", emoji: "🐺", api: "awoo" },
    { pattern: "lick", desc: "Send a lick reaction GIF.", emoji: "👅", api: "lick" },
    { pattern: "pat", desc: "Send a pat reaction GIF.", emoji: "🫂", api: "pat" },
    { pattern: "smug", desc: "Send a smug reaction GIF.", emoji: "😏", api: "smug" },
    { pattern: "bonk", desc: "Send a bonk reaction GIF.", emoji: "🔨", api: "bonk" },
    { pattern: "yeet", desc: "Send a yeet reaction GIF.", emoji: "💨", api: "yeet" },
    { pattern: "blush", desc: "Send a blush reaction GIF.", emoji: "😊", api: "blush" },
    { pattern: "handhold", desc: "Send a hand-holding reaction GIF.", emoji: "🤝", api: "handhold" },
    { pattern: "highfive", desc: "Send a high-five reaction GIF.", emoji: "✋", api: "highfive" },
    { pattern: "nom", desc: "Send a nom reaction GIF.", emoji: "🍽️", api: "nom" },
    { pattern: "wave", desc: "Send a wave reaction GIF.", emoji: "👋", api: "wave" },
    { pattern: "smile", desc: "Send a smile reaction GIF.", emoji: "😁", api: "smile" },
    { pattern: "wink", desc: "Send a wink reaction GIF.", emoji: "😉", api: "wink" },
    { pattern: "happy", desc: "Send a happy reaction GIF.", emoji: "😊", api: "happy" },
    { pattern: "glomp", desc: "Send a glomp reaction GIF.", emoji: "🤗", api: "glomp" },
    { pattern: "bite", desc: "Send a bite reaction GIF.", emoji: "🦷", api: "bite" },
    { pattern: "poke", desc: "Send a poke reaction GIF.", emoji: "👉", api: "poke" },
    { pattern: "cringe", desc: "Send a cringe reaction GIF.", emoji: "😬", api: "cringe" },
    { pattern: "dance", desc: "Send a dance reaction GIF.", emoji: "💃", api: "dance" },
    { pattern: "kill", desc: "Send a kill reaction GIF.", emoji: "🔪", api: "kill" },
    { pattern: "slap", desc: "Send a slap reaction GIF.", emoji: "✊", api: "slap" },
    { pattern: "kiss", desc: "Send a kiss reaction GIF.", emoji: "💋", api: "kiss" },
];

// Register commands dynamically
reactions.forEach(({ pattern, desc, emoji, api }) => {
    cmd(
        {
            pattern,
            desc,
            category: "fun",
            react: emoji,
            filename: __filename,
            use: "@tag (optional)",
        },
        async (conn, mek, m, { reply }) => {
            try {
                let sender = `@${mek.sender.split("@")[0]}`;
                let mentionedUser = m.mentionedJid?.[0] || (mek.quoted && mek.quoted.sender);
                let isGroup = m.isGroup;

                let message = mentionedUser
                    ? `${sender} ${pattern === "lick" ? "licked" : pattern === "hug" ? "hugged" : `${pattern}ed`} @${mentionedUser.split("@")[0]}`
                    : isGroup
                    ? `${sender} is ${pattern}${pattern.endsWith("e") ? "ing" : "ing"} everyone!`
                    : `> 🔥🥀𝘽οꜱꜱ🥀🔥 🖤`;

                const apiUrl = `https://api.waifu.pics/sfw/${api}`;
                let res = await axios.get(apiUrl);
                let gifUrl = res.data.url;

                let gifBuffer = await fetchGif(gifUrl);
                let videoBuffer = await gifToVideo(gifBuffer);

                await conn.sendMessage(
                    mek.chat,
                    { video: videoBuffer, caption: message, gifPlayback: true, mentions: [mek.sender, mentionedUser].filter(Boolean) },
                    { quoted: mek }
                );
            } catch (error) {
                console.error(`❌ Error in .${pattern} command:`, error);
                reply(`❌ *Error in .${pattern} command:*\n\`\`\`${error.message}\`\`\``);
            }
        }
    );
});
