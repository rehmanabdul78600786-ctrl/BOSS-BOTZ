const config = require('../config');
const { cmd } = require('../command');

const stylizedChars = {
    a: '🅐', b: '🅑', c: '🅒', d: '🅓', e: '🅔', f: '🅕', g: '🅖',
    h: '🅗', i: '🅘', j: '🅙', k: '🅚', l: '🅛', m: '🅜', n: '🅝',
    o: '🅞', p: '🅟', q: '🅠', r: '🅡', s: '🅢', t: '🅣', u: '🅤',
    v: '🅥', w: '🅦', x: '🅧', y: '🅨', z: '🅩',
    '0': '⓿', '1': '➊', '2': '➋', '3': '➌', '4': '➍',
    '5': '➎', '6': '➏', '7': '➐', '8': '➑', '9': '➒'
};

cmd({
    pattern: "chr",
    alias: ["creact"],
    react: "🔤",
    desc: "React to channel messages with stylized text",
    category: "owner",
    use: '.chr <channel-link> <text>',
    filename: __filename
}, async (conn, mek, m, {
    from, q, command, reply, isCreator
}) => {
    try {
        // Only owner can use
        if (!isCreator) return reply("❌ Owner only command");

        // Validate input
        if (!q) return reply(`Usage:\n${command} https://whatsapp.com/channel/1234567890 hello`);

        const [link, ...textParts] = q.split(' ');
        if (!link.includes("whatsapp.com/channel/")) return reply("❌ Invalid channel link format");

        const inputText = textParts.join(' ').toLowerCase();
        if (!inputText) return reply("❌ Please provide text to convert");

        // Convert text to stylized characters
        const emojiText = inputText
            .split('')
            .map(char => char === ' ' ? '―' : stylizedChars[char] || char)
            .join('');

        // Extract channel and message IDs
        const [, , , , channelId, messageId] = link.split('/');
        if (!channelId || !messageId) return reply("❌ Invalid link - missing IDs");

        // Fetch channel metadata
        const channelMeta = await conn.newsletterMetadata("invite", channelId);

        // Send reaction
        await conn.newsletterReactMessage(channelMeta.id, messageId, emojiText);

        // Success message
        reply(`╭━━━〔 *🔥🥀𝘽οꜱꜱ🥀🔥* 〕━━━┈⊷
┃▸ *Success!* Reaction sent
┃▸ *Channel:* ${channelMeta.name}
┃▸ *Reaction:* ${emojiText}
╰────────────────┈⊷
> *🔥🥀𝘽οꜱꜱ🥀🔥*`);

    } catch (e) {
        console.error(e);
        reply(`❎ Error:\n${e.message || "Failed to send reaction"}`);
    }
});
