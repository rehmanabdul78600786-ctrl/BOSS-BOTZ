const axios = require("axios");
const FormData = require('form-data');
const fs = require('fs');
const os = require('os');
const path = require("path");
const { cmd } = require("../command");

// Helper function to format bytes
function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

cmd({
    pattern: "jail",
    alias: ["jailedit"],
    react: '📸',
    desc: "Scan and remove bg from images",
    category: "img_edit",
    use: ".jail [reply to image]",
    filename: __filename
}, async (conn, message, m, { reply, mek }) => {
    try {
        // Check if quoted message exists and has media
        const quotedMsg = message.quoted ? message.quoted : message;
        const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

        if (!mimeType || !mimeType.startsWith('image/')) {
            return reply("Please reply to an image file (JPEG/PNG)");
        }

        // Downloading media
        const mediaBuffer = await quotedMsg.download();
        const fileSize = formatBytes(mediaBuffer.length);

        // Determine extension
        let extension = '';
        if (mimeType.includes('image/jpeg')) extension = '.jpg';
        else if (mimeType.includes('image/png')) extension = '.png';
        else return reply("Unsupported image format. Use JPEG/PNG only.");

        const tempFilePath = path.join(os.tmpdir(), `imgscan_${Date.now()}${extension}`);
        fs.writeFileSync(tempFilePath, mediaBuffer);

        // Upload to Catbox
        const form = new FormData();
        form.append('fileToUpload', fs.createReadStream(tempFilePath), `image${extension}`);
        form.append('reqtype', 'fileupload');

        const uploadResponse = await axios.post("https://catbox.moe/user/api.php", form, {
            headers: form.getHeaders()
        });

        const imageUrl = uploadResponse.data;
        fs.unlinkSync(tempFilePath);

        if (!imageUrl) throw "Failed to upload image to Catbox";

        // MAIN API
        let apiUrl = `https://api.popcat.xyz/v2/jail?image=${encodeURIComponent(imageUrl)}`;
        let response;

        try {
            response = await axios.get(apiUrl, { responseType: "arraybuffer" });
        } catch (err) {
            // IMPORTANT: Backup API (never fails)
            const fallbackUrl = `https://vihangayt.me/filter/jail?url=${encodeURIComponent(imageUrl)}`;
            try {
                response = await axios.get(fallbackUrl, { responseType: "arraybuffer" });
            } catch (secondErr) {
                throw new Error("Both main and backup Jail APIs failed.");
            }
        }

        if (!response || !response.data) {
            return reply("Error: API did not return a valid image.");
        }

        const imageBuffer = Buffer.from(response.data, "binary");

        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `> *꧁༒♛ 𝔅𝔒𝔖𝔖♛༒꧂*`
        });

    } catch (error) {
        console.error("Jail Error:", error);
        reply(
            `An error occurred: ${
                error.response?.data?.message ||
                error.message ||
                "Unknown error"
            }`
        );
    }
});
