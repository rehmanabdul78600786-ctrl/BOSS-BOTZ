const axios = require("axios");
const FormData = require("form-data");
const fs = require("fs").promises;
const os = require("os");
const path = require("path");
const mime = require("mime-types"); // Install: npm install mime-types
const { cmd } = require("../command");

cmd({
  pattern: "tourl",
  alias: ["imgtourl", "imgurl", "url", "geturl", "upload"],
  react: "🖇",
  desc: "Convert media to a Catbox URL",
  category: "utility",
  use: ".tourl [reply to media]",
  filename: __filename
}, async (conn, m, args, { reply }) => {
  let tempFilePath = null;

  try {
    const quotedMsg = m.quoted || m;
    const mimeType = quotedMsg.msg?.mimetype || '';

    if (!mimeType) return reply("❌ Please reply to an image, video, or audio file.");

    // Download media buffer
    const mediaBuffer = await quotedMsg.download();
    const extension = mime.extension(mimeType) || "bin";
    tempFilePath = path.join(os.tmpdir(), `upload_${Date.now()}.${extension}`);

    await fs.writeFile(tempFilePath, mediaBuffer);

    // Prepare form data
    const form = new FormData();
    form.append("fileToUpload", await fs.readFile(tempFilePath), {
      filename: `file.${extension}`
    });
    form.append("reqtype", "fileupload");

    // Upload to Catbox
    const response = await axios.post("https://catbox.moe/user/api.php", form, {
      headers: form.getHeaders(),
      maxContentLength: Infinity,
      maxBodyLength: Infinity
    });

    if (!response.data) throw new Error("❌ Error uploading file to Catbox.");

    // Determine media type for response
    let mediaType = 'File';
    if (mimeType.includes('image')) mediaType = 'Image';
    else if (mimeType.includes('video')) mediaType = 'Video';
    else if (mimeType.includes('audio')) mediaType = 'Audio';

    await reply(
      `✅ *${mediaType} Uploaded Successfully*\n\n` +
      `*Size:* ${formatBytes(mediaBuffer.length)}\n` +
      `*URL:* ${response.data}\n\n` +
      `> ×º𝓑𝖔𝙨𝙨º× 💜`
    );

  } catch (err) {
    console.error("❌ tourl command error:", err);
    await reply(`❌ Error: ${err.message || err}`);
  } finally {
    // Cleanup temp file
    if (tempFilePath) {
      try {
        await fs.unlink(tempFilePath);
      } catch (cleanupErr) {
        console.error("❌ Failed to delete temp file:", cleanupErr);
      }
    }
  }
});

// Helper function: format bytes
function formatBytes(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}
