const axios = require('axios');
const { cmd } = require('../command');

cmd({
  pattern: 'qrcode',
  alias: ['qr'],
  react: '🔄',
  desc: 'Generate a QR code from text.',
  category: 'main',
  filename: __filename
}, async (conn, mek, m, {
  from,
  body,
  args,
  q,
  reply
}) => {
  try {
    // Check if user provided text
    if (!q) return reply('❌ Please provide text to generate QR code.\nUsage: .qrcode [text]');

    await reply('🔄 Generating your QR code...');

    // QR code API URL
    const apiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(q)}&size=300x300`;

    // Fetch QR code image as buffer
    const response = await axios.get(apiUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');

    // Send QR code image
    await conn.sendMessage(from, {
      image: buffer,
      caption: `🔹 QR Code generated for: "${q}"`
    }, { quoted: m });

  } catch (error) {
    console.error(error);
    reply(`❌ An error occurred while generating QR code:\n${error.message}`);
  }
});
