const converter = require('../data/converter');
const stickerConverter = require('../data/sticker-converter');
const { cmd } = require('../command');

cmd({
    pattern: 'convert',
    alias: ['sticker2img', 'stoimg', 'stickertoimage', 's2i'],
    desc: 'Convert stickers to images',
    category: 'media',
    react: '🖼️',
    filename: __filename
}, async (client, message, match, { from }) => {
    if (!message.quoted) {
        return await client.sendMessage(from, { text: "✨ *Sticker Converter*\n\nPlease reply to a sticker message\n\nExample: `.convert`" }, { quoted: message });
    }
    if (message.quoted.mtype !== 'stickerMessage') {
        return await client.sendMessage(from, { text: "❌ Only sticker messages can be converted" }, { quoted: message });
    }

    await client.sendMessage(from, { text: "🔄 Converting sticker to image..." }, { quoted: message });

    try {
        const stickerBuffer = await message.quoted.download();
        const imageBuffer = await stickerConverter.convertStickerToImage(stickerBuffer);

        await client.sendMessage(from, {
            image: imageBuffer,
            caption: "> ×º𝓑𝖔𝙨𝙨º× 🤍",
            mimetype: 'image/png'
        }, { quoted: message });

    } catch (error) {
        console.error('Conversion error:', error);
        await client.sendMessage(from, { text: "❌ Please try with a different sticker." }, { quoted: message });
    }
});

cmd({
    pattern: 'tomp3',
    desc: 'Convert media to audio',
    category: 'audio',
    react: '🎵',
    filename: __filename
}, async (client, message, match, { from }) => {
    if (!message.quoted) return await client.sendMessage(from, { text: "*🔊 Please reply to a video/audio message*" }, { quoted: message });
    if (!['videoMessage', 'audioMessage'].includes(message.quoted.mtype)) return await client.sendMessage(from, { text: "❌ Only video/audio messages can be converted" }, { quoted: message });

    const duration = message.quoted.seconds || 0;
    if (duration > 300) return await client.sendMessage(from, { text: "⏱️ Media too long (max 5 minutes)" }, { quoted: message });

    await client.sendMessage(from, { text: "🔄 Converting to audio..." }, { quoted: message });

    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const audio = await converter.toAudio(buffer, ext);

        await client.sendMessage(from, { audio, mimetype: 'audio/mpeg' }, { quoted: message });

    } catch (e) {
        console.error('Conversion error:', e.message);
        await client.sendMessage(from, { text: "❌ Failed to process audio" }, { quoted: message });
    }
});

cmd({
    pattern: 'toptt',
    desc: 'Convert media to voice message',
    category: 'audio',
    react: '🎙️',
    filename: __filename
}, async (client, message, match, { from }) => {
    if (!message.quoted) return await client.sendMessage(from, { text: "*🗣️ Please reply to a video/audio message*" }, { quoted: message });
    if (!['videoMessage', 'audioMessage'].includes(message.quoted.mtype)) return await client.sendMessage(from, { text: "❌ Only video/audio messages can be converted" }, { quoted: message });

    const duration = message.quoted.seconds || 0;
    if (duration > 60) return await client.sendMessage(from, { text: "⏱️ Media too long for voice (max 1 minute)" }, { quoted: message });

    await client.sendMessage(from, { text: "🔄 Converting to voice message..." }, { quoted: message });

    try {
        const buffer = await message.quoted.download();
        const ext = message.quoted.mtype === 'videoMessage' ? 'mp4' : 'm4a';
        const ptt = await converter.toPTT(buffer, ext);

        await client.sendMessage(from, {
            audio: ptt,
            mimetype: 'audio/ogg; codecs=opus',
            ptt: true
        }, { quoted: message });

    } catch (e) {
        console.error('PTT conversion error:', e.message);
        await client.sendMessage(from, { text: "❌ Failed to create voice message" }, { quoted: message });
    }
});
