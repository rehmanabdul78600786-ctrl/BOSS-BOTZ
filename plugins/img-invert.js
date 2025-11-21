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
    pattern: "invert",
    alias: ["invertedit"],
    react: '📸',
    desc: "Scan and remove bg from images",
    category: "img_edit",
    use: ".invert [reply to image]",
    filename: __filename
}, async (conn, message, m, { reply, mek }) => {
    try {
        const quotedMsg = message.quoted ? message.quoted : message;
        const mimeType = (quotedMsg.msg || quotedMsg).mimetype || '';

        if (!mimeType || !mimeType.startsWith('image/')) {
            return reply("Please reply to an image file (JPEG/PNG)");
        }

        const mediaBuffer = await quotedMsg.download();

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
        fs.unlinkSync(tempFilePath);

        if (!imageUrl) throw "Failed to upload image to Catbox";

        // Main API
        const mainApi = `https://api.popcat.xyz/v2/invert?image=${encodeURIComponent(imageUrl)}`;
        let response;

        try {
            response = await axios.get(mainApi, { responseType: "arraybuffer" });
        } catch (err) {
            // Backup API (0% downtime)
            const fallbackApi = `https://vihangayt.me/filter/invert?url=${encodeURIComponent(imageUrl)}`;
            try {
                response = await axios.get(fallbackApi, { responseType: "arraybuffer" });
            } catch (fallbackErr) {
                throw new Error("Both invert APIs failed.");
            }
        }

        if (!response || !response.data) {
            return reply("Error: API did not return a valid image.");
        }

        const imageBuffer = Buffer.from(response.data, "binary");

        await conn.sendMessage(m.chat, {
            image: imageBuffer,
            caption: `> *ﮩ٨ـﮩﮩ٨ـ 𝑩𝑶𝑺𝑺ﮩ٨ـﮩﮩ٨ـ*`
        });

    } catch (error) {
        console.error("Invert Error:", error);
        reply(
            `An error occurred: ${
                error.response?.data?.message ||
                error.message ||
                "Unknown error"
            }`
        );
    }
});
