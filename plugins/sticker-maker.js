const { cmd } = require('../command');
const { Sticker, StickerTypes } = require("wa-sticker-formatter");
const Config = require('../config');

// TAKE STICKER (Rename sticker pack)

cmd(
{
    pattern: 'take',
    alias: ['rename', 'stake'],
    desc: 'Create a sticker with custom pack name.',
    category: 'sticker',
    use: '<packname>',
    filename: __filename,
},

async (conn, mek, m, { quoted, q, reply }) => {

    if (!quoted) return reply("*Reply to any sticker.*");
    if (!q) return reply("*Provide a pack name: .take <packname>*");

    let mime = Object.keys(quoted.msg)[0];      // FIXED
    let media = await quoted.download();

    try {
        let sticker = new Sticker(media, {
            pack: q,                           // custom pack name
            author: "Bot",
            type: StickerTypes.FULL,
            quality: 75,
            background: "transparent"
        });

        return conn.sendMessage(mek.chat, {
            sticker: await sticker.toBuffer()
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Failed to rename sticker.");
    }
});



// STICKER COMMAND (image + video + sticker)

cmd(
{
    pattern: 'sticker',
    alias: ['s', 'stickergif'],
    desc: 'Create sticker from image, video, or sticker.',
    category: 'sticker',
    use: '<reply media>',
    filename: __filename,
},

async (conn, mek, m, { quoted, reply }) => {

    if (!quoted) return reply("*Reply to an image, video, or sticker.*");

    let pack = Config.STICKER_NAME || "Jawad TechX";
    let mime = Object.keys(quoted.msg)[0];       // FIXED
    let media = await quoted.download();

    try {
        let sticker = new Sticker(media, {
            pack,
            author: "Bot",
            type: StickerTypes.FULL,
            quality: 75,
            background: "transparent"
        });

        return conn.sendMessage(mek.chat, {
            sticker: await sticker.toBuffer()
        }, { quoted: mek });

    } catch (e) {
        console.log(e);
        reply("❌ Failed to create sticker.");
    }
});
