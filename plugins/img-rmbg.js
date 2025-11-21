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
    pattern: "rmbg",
    alias: ["removebg"],
    react: '📸',
    desc: "Scan and remove bg from images",
    category: "img_edit",
    use: ".rmbg [reply to image]",
    filename: __filename
}, async (conn, message, m, { reply, mek }) => {
    try {
        // Check if quoted message exists and has media
        const quotedMsg = message.quoted ? message.quoted : message;
        const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

        if (!mimeType || !mimeType.startsWith('image/')) {
            return reply("Please reply to an image file (JPEG/PNG)");
        }

        // Download the media
        const mediaBuffer = await quotedMsg.download();
        const fileSize = formatBytes(mediaBuffer.length);

        // Determine extension
        let extension = '';
        if (mimeType.includes('image/jpeg')) extension = '.jpg';
        else if (mimeType.includes('image/png')) extension = '.png';
        else return reply("Unsupported image format. Please use JPEG or PNG");

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
        fs.unlinkSync(tempFilePath); // remove temporary file

        if (!imageUrl) throw "Failed to upload image to Catbox";

        // Background removal API
        const apiUrl = `https://apis.davidcyriltech.my.id/removebg?url=${encodeURIComponent(imageUrl)}`;
        const response = await axios.get(apiUrl, { responseType: "arraybuffer" });

        if (!response || !response.data) {
            return reply("Error: The API did not return a valid image. Try again later.");
        }

        const imageBuffer = Buffer.from(response.data, "binary");

        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `Background removed\n\n> *ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ*`
        });

    } catch (error) {
        console.error("Rmbg Error:", error);
        reply(
            `An error occurred: ${
                error.response?.data?.message ||
                error.message ||
                "Unknown error"
            }`
        );
    }
});
