const { cmd } = require('../command');
const axios = require('axios');

cmd({
    pattern: "pindl",
    alias: ["pinterestdl", "pin", "pins", "pindownload"],
    desc: "Download media from Pinterest",
    category: "download",
    filename: __filename
}, async (conn, mek, m, { args, quoted, from, reply }) => {
    try {
        if (!args.length) {
            return reply('❎ Please provide the Pinterest URL to download from.');
        }

        const pinterestUrl = args[0];

        const response = await axios.get(
            `https://api.giftedtech.web.id/api/download/pinterestdl?apikey=gifted&url=${encodeURIComponent(pinterestUrl)}`
        );

        // Validate response
        if (!response.data || response.data.success !== true) {
            return reply('❎ Failed to fetch data from Pinterest.');
        }

        const media = response.data.result.media || [];
        const title = response.data.result.title || "No title available";

        if (!media.length) {
            return reply("❎ No downloadable media found.");
        }

        // pick 720p if exists, otherwise first media
        let videoUrl = null;

        const quality720 = media.find(item => item.type && item.type.toLowerCase().includes("720"));
        if (quality720) videoUrl = quality720.download_url;

        if (!videoUrl && media[0]?.download_url) {
            videoUrl = media[0].download_url;
        }

        const desc = `╭━━━〔 *×º𝓑𝖔𝙨𝙱º×* 〕━━━┈⊷
┃▸╭───────────
┃▸┃๏ *PINS DOWNLOADER*
┃▸└───────────···๏
╰────────────────┈⊷
╭━━❐━⪼
┇๏ *Title* - ${title}
┇๏ *Media Type* - ${media[0].type}
╰━━❑━⪼
> *🔥🥀𝘽οꜱꜱ🥀🔥*`;

        if (videoUrl && videoUrl.endsWith(".mp4")) {
            // send as video
            await conn.sendMessage(
                from,
                { video: { url: videoUrl }, caption: desc },
                { quoted: mek }
            );
        } else {
            // fallback → send as image
            const imageUrl =
                media.find(item => item.type?.toLowerCase().includes("image"))?.download_url ||
                media[0].download_url;

            await conn.sendMessage(
                from,
                { image: { url: imageUrl }, caption: desc },
                { quoted: mek }
            );
        }

    } catch (e) {
        console.error(e);
        await conn.sendMessage(from, { react: { text: '❌', key: mek.key } });
        reply('❎ An error occurred while processing your request.');
    }
});
