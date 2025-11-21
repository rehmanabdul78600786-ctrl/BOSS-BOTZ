const { fetchJson } = require("../lib/functions");
const { downloadTiktok } = require("@mrnima/tiktok-downloader");
const { facebook } = require("@mrnima/facebook-downloader");
const cheerio = require("cheerio");
const { igdl } = require("ruhend-scraper");
const axios = require("axios");
const { cmd } = require('../command');

/**
 * Helpers
 */
async function safeReact(conn, jid, key, emoji) {
  try {
    await conn.sendMessage(jid, { react: { text: emoji, key } });
  } catch (err) {
    console.error("safeReact error:", err?.message || err);
  }
}

async function safeSend(conn, jid, payload, opts = {}) {
  try {
    return await conn.sendMessage(jid, payload, opts);
  } catch (err) {
    console.error("safeSend error:", err?.message || err);
    throw err;
  }
}

/**
 * IG Downloader
 */
cmd({
  pattern: "ig7",
  alias: ["insta8", "Instagram9"],
  desc: "To download Instagram videos.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("http")) return reply("❌ Please provide a valid Instagram link.");

    await safeReact(conn, from, m.key, "⏳");

    const { data } = await axios.get(`https://insta-down.apis-bj-devs.workers.dev/?url=${encodeURIComponent(q)}`);
    if (!data || data.status !== 200 || !data.downloadUrl) {
      return reply("⚠️ Failed to fetch Instagram video. Please check the link and try again.");
    }

    await safeSend(conn, from, {
      video: { url: data.downloadUrl },
      mimetype: "video/mp4",
      caption: "📥 *Instagram Video Downloaded Successfully!*"
    }, { quoted: m });

  } catch (error) {
    console.error("IG7 Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

/**
 * Twitter Downloader (with one-time listener)
 */
cmd({
  pattern: "twitter",
  alias: ["tweet", "twdl"],
  desc: "Download Twitter videos",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q || !q.startsWith("https://")) {
      return safeSend(conn, from, { text: "❌ Please provide a valid Twitter URL." }, { quoted: m });
    }

    await safeReact(conn, from, m.key, "⏳");

    const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/twitter?url=${encodeURIComponent(q)}`);
    if (!data || !data.status || !data.result) {
      return reply("⚠️ Failed to retrieve Twitter video. Please check the link and try again.");
    }

    const { desc, thumb, video_sd, video_hd } = data.result ?? {};

    const caption = `╭━━━〔 *TWITTER DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *Description:* ${desc || "No description"}\n`
      + `╰━━━⪼\n\n`
      + `📹 *Download Options:*\n`
      + `1️⃣  *SD Quality*\n`
      + `2️⃣  *HD Quality*\n`
      + `🎵 *Audio Options:*\n`
      + `3️⃣  *Audio*\n`
      + `4️⃣  *Document*\n`
      + `5️⃣  *Voice*\n\n`
      + `📌 *Reply with the number to download your choice.*`;

    // Send prompt message with thumbnail
    const sentMsg = await safeSend(conn, from, {
      image: { url: thumb || "" },
      caption
    }, { quoted: m });

    // Setup a one-time event listener to capture reply only to this prompt (prevents leak)
    const messageID = sentMsg?.key?.id;
    if (!messageID) {
      return reply("⚠️ Could not create interactive prompt. Try again.");
    }

    const handler = async (msgData) => {
      try {
        const receivedMsg = msgData.messages?.[0];
        if (!receivedMsg || !receivedMsg.message) return;

        // Only react to replies that reference this prompt messageID
        const ctxInfo = receivedMsg.message.extendedTextMessage?.contextInfo;
        const isReplyToBot = ctxInfo?.stanzaId === messageID;
        if (!isReplyToBot) return;

        // Remove listener immediately so it's one-time
        try { conn.ev.removeListener("messages.upsert", handler); } catch (e) { /* ignore */ }

        // react to user's selection
        await safeReact(conn, receivedMsg.key.remoteJid, receivedMsg.key, "⬇️");

        const text = (
          receivedMsg.message.conversation ||
          receivedMsg.message.extendedTextMessage?.text ||
          ""
        ).toString().trim();

        switch (text) {
          case "1":
            if (!video_sd) return reply("⚠️ SD video URL not available.");
            await safeSend(conn, receivedMsg.key.remoteJid, {
              video: { url: video_sd },
              caption: "📥 *Downloaded in SD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "2":
            if (!video_hd && !video_sd) return reply("⚠️ HD/SD video URL not available.");
            await safeSend(conn, receivedMsg.key.remoteJid, {
              video: { url: video_hd || video_sd },
              caption: "📥 *Downloaded in HD Quality*"
            }, { quoted: receivedMsg });
            break;

          case "3":
            if (!video_sd) return reply("⚠️ Audio source not available.");
            await safeSend(conn, receivedMsg.key.remoteJid, {
              audio: { url: video_sd },
              mimetype: "audio/mpeg"
            }, { quoted: receivedMsg });
            break;

          case "4":
            if (!video_sd) return reply("⚠️ File source not available.");
            await safeSend(conn, receivedMsg.key.remoteJid, {
              document: { url: video_sd },
              mimetype: "audio/mpeg",
              fileName: "Twitter_Audio.mp3",
              caption: "📥 *Audio Downloaded as Document*"
            }, { quoted: receivedMsg });
            break;

          case "5":
            if (!video_sd) return reply("⚠️ Voice source not available.");
            await safeSend(conn, receivedMsg.key.remoteJid, {
              audio: { url: video_sd },
              mimetype: "audio/mp4",
              ptt: true
            }, { quoted: receivedMsg });
            break;

          default:
            await safeSend(conn, receivedMsg.key.remoteJid, { text: "❌ Invalid option! Please reply with 1, 2, 3, 4, or 5." }, { quoted: receivedMsg });
            break;
        }
      } catch (err) {
        console.error("Twitter handler error:", err);
      }
    };

    conn.ev.on("messages.upsert", handler);

  } catch (error) {
    console.error("Twitter command error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

/**
 * MediaFire Downloader
 */
cmd({
  pattern: "mediafire",
  alias: ["mfire"],
  desc: "To download MediaFire files.",
  react: "🎥",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a valid MediaFire link.");

    await safeReact(conn, from, m.key, "⏳");

    const { data } = await axios.get(`https://www.dark-yasiya-api.site/download/mfire?url=${encodeURIComponent(q)}`);
    if (!data || !data.status || !data.result || !data.result.dl_link) {
      return reply("⚠️ Failed to fetch MediaFire download link. Ensure the link is valid and public.");
    }

    const { dl_link, fileName, fileType } = data.result;
    const file_name = fileName || "mediafire_download";
    const mime_type = fileType || "application/octet-stream";

    await safeReact(conn, from, m.key, "⬆️");

    const caption = `╭━━━〔 *MEDIAFIRE DOWNLOADER* 〕━━━⊷\n`
      + `┃▸ *File Name:* ${file_name}\n`
      + `┃▸ *File Type:* ${mime_type}\n`
      + `╰━━━⪼\n\n`
      + `📥 *Downloading your file...*`;

    await safeSend(conn, from, {
      document: { url: dl_link },
      mimetype: mime_type,
      fileName: file_name,
      caption
    }, { quoted: m });

  } catch (error) {
    console.error("MediaFire Error:", error);
    reply("❌ An error occurred while processing your request. Please try again.");
  }
});

/**
 * APK (Aptoide) Downloader
 */
cmd({
  pattern: "apk",
  desc: "Download APK from Aptoide.",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide an app name to search.");

    await safeReact(conn, from, m.key, "⏳");

    const apiUrl = `http://ws75.aptoide.com/api/7/apps/search/query=${encodeURIComponent(q)}/limit=1`;
    const { data } = await axios.get(apiUrl);

    if (!data || !data.datalist || !Array.isArray(data.datalist.list) || data.datalist.list.length === 0) {
      return reply("⚠️ No results found for the given app name.");
    }

    const app = data.datalist.list[0];
    const appSize = app.size ? (app.size / 1048576).toFixed(2) : "Unknown";

    const caption = `╭━━━〔 *APK Downloader* 〕━━━┈⊷
┃ 📦 *Name:* ${app.name}
┃ 🏋 *Size:* ${appSize} MB
┃ 📦 *Package:* ${app.package}
┃ 📅 *Updated On:* ${app.updated}
┃ 👨‍💻 *Developer:* ${app.developer?.name || "Unknown"}
╰━━━━━━━━━━━━━━━┈⊷
🔗 **© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ мυℓтιρℓє ρσωєρƒυℓ ωнαтѕапр вσт ❣️*`;

    await safeReact(conn, from, m.key, "⬆️");

    await safeSend(conn, from, {
      document: { url: app.file?.path_alt || "" },
      fileName: `${app.name || "app"}.apk`,
      mimetype: "application/vnd.android.package-archive",
      caption
    }, { quoted: m });

    await safeReact(conn, from, m.key, "✅");

  } catch (error) {
    console.error("APK Error:", error);
    reply("❌ An error occurred while fetching the APK. Please try again.");
  }
});

/**
 * Google Drive Downloader
 */
cmd({
  pattern: "gdrive",
  desc: "Download Google Drive files.",
  react: "🌐",
  category: "download",
  filename: __filename
}, async (conn, m, store, { from, q, reply }) => {
  try {
    if (!q) return reply("❌ Please provide a valid Google Drive link.");

    await safeReact(conn, from, m.key, "⬇️");

    const apiUrl = `https://api.fgmods.xyz/api/downloader/gdrive?url=${encodeURIComponent(q)}&apikey=mnp3grlZ`;
    const { data } = await axios.get(apiUrl);

    const downloadInfo = data?.result;
    const downloadUrl = downloadInfo?.downloadUrl;

    if (!downloadUrl) {
      return reply("⚠️ No download URL found. Please check the link and try again.");
    }

    await safeReact(conn, from, m.key, "⬆️");

    await safeSend(conn, from, {
      document: { url: downloadUrl },
      mimetype: downloadInfo.mimetype || "application/octet-stream",
      fileName: downloadInfo.fileName || "file",
      caption: "*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ 🔥🥀𝘽οꜱꜱ🥀🔥 Official❣️*"
    }, { quoted: m });

    await safeReact(conn, from, m.key, "✅");

  } catch (error) {
    console.error("GDrive Error:", error);
    reply("❌ An error occurred while fetching the Google Drive file. Please try again.");
  }
});
