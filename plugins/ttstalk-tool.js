const axios = require("axios");
const { cmd } = require("../command");

cmd({
  pattern: "tiktok",
  alias: ["tiktokstalk", "ttstalk", "tiktokdl"],
  react: "📱",
  desc: "Fetch TikTok user profile and download videos.",
  category: "search",
  filename: __filename
}, async (conn, m, store, { from, q, reply, pushName }) => {
  try {
    if (!q) {
      return reply("❎ Provide a TikTok username or video URL.\n\nExamples:\n`.tiktok @mrbeast`\n`.tiktok https://www.tiktok.com/@mrbeast/video/1234567890`");
    }

    await conn.sendMessage(from, {
      react: { text: "⏳", key: m.key }
    });

    // Detect if input is a URL or username
    const isUrl = q.startsWith("http");

    if (isUrl) {
      // ------------------------------
      // ⬇️ Download TikTok video by URL
      // ------------------------------
      const apiDownload = `https://api.siputzx.my.id/api/download/tiktok?url=${encodeURIComponent(q)}`;
      const { data } = await axios.get(apiDownload);

      if (!data.status || !data.result?.videoUrl) {
        return reply("❌ Failed to download TikTok video. Check the URL.");
      }

      const caption = `🎥 *TikTok Video Downloader*\n\n🔗 Source: ${q}\n✨ Requested by: ${pushName || "User"}`;
      await conn.sendMessage(from, {
        video: { url: data.result.videoUrl },
        caption
      }, { quoted: m });

    } else {
      // ------------------------------
      // ⬇️ TikTok user profile
      // ------------------------------
      const apiProfile = `https://api.siputzx.my.id/api/stalk/tiktok?username=${encodeURIComponent(q)}`;
      const { data } = await axios.get(apiProfile);

      if (!data.status) {
        return reply("❌ User not found. Check the username.");
      }

      const user = data.data.user;
      const stats = data.data.stats;
      const avatar = user.avatarLarger || user.avatarMedium || user.avatarThumb;

      const verified = user.verified ? "🔵 Verified" : "⚪ Not Verified";
      const privateAcc = user.privateAccount ? "🔒 Private" : "🌍 Public";
      const bio = user.signature?.trim() || "No bio available";
      const bioLink = user.bioLink?.link || "No external link";

      const profile = `
╭━━〔 *TIKTOK PROFILE* 〕━━⬤
┃👤 Username: @${user.uniqueId}
┃📛 Nickname: ${user.nickname}
┃${user.verified ? "🔵" : "⚪"} Verified: ${verified}
┃${user.privateAccount ? "🔐" : "🌍"} Privacy: ${privateAcc}
┃📝 Bio: ${bio}
┃🔗 Bio Link: ${bioLink}
┃
┃📊 Stats:
┃👥 Followers: ${stats.followerCount.toLocaleString()}
┃👤 Following: ${stats.followingCount.toLocaleString()}
┃❤️ Likes: ${stats.heartCount.toLocaleString()}
┃🎥 Videos: ${stats.videoCount.toLocaleString()}
┃📅 Joined: ${new Date(user.createTime * 1000).toLocaleDateString()}
┃🔗 Profile: https://www.tiktok.com/@${user.uniqueId}
╰━━━━━━━━━━━━━━━━⬤

✨ Requested by: ${pushName || "User"}
🔥 © 🔥🥀𝘽οꜱꜱ🥀🔥
`;

      // Buttons
      const buttons = [
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "🎥 Download Latest Video",
            id: `ttvideo ${user.uniqueId}`
          })
        },
        {
          name: "quick_reply",
          buttonParamsJson: JSON.stringify({
            display_text: "📸 HD Profile Pic",
            id: `ttppic ${user.uniqueId}`
          })
        }
      ];

      await conn.sendMessage(from, {
        image: { url: avatar },
        caption: profile,
        footer: "TikTok Profile & Downloader Tool",
        templateButtons: buttons
      }, { quoted: m });
    }

  } catch (err) {
    console.error("❌ TikTok Command Error:", err);
    reply("⚠️ An error occurred while processing TikTok data. Try again later.");
  }
});
