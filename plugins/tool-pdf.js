const { cmd } = require('../command');
const PDFDocument = require('pdfkit');
const { Buffer } = require('buffer');

cmd({
    pattern: "topdf",
    alias: ["pdf"],
    use: '.topdf',
    desc: "Convert provided text to a PDF file.",
    react: "📄",
    category: "utilities",
    filename: __filename
}, async (conn, mek, m, { from, q, reply }) => {
    try {
        if (!q) return reply("❌ Please provide the text you want to convert to PDF.\n*Example:* `.topdf Pakistan ZindaBad 🇵🇰`");

        // Create a new PDF document
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        let buffers = [];
        doc.on('data', buffers.push.bind(buffers));
        doc.on('end', async () => {
            const pdfData = Buffer.concat(buffers);

            // Send the PDF file
            await conn.sendMessage(from, {
                document: pdfData,
                mimetype: 'application/pdf',
                fileName: '𝓐𝓻𝓼𝓵𝓪𝓷_𝓜𝓓.pdf',
                caption: `
*📄 PDF created successfully!*

> 🔥🥀𝘽οꜱꜱ🥀🔥 💜`
            }, { quoted: m });
        });

        // Add text to the PDF
        doc.text(q, { align: 'left' });

        // Finalize the PDF and end the stream
        doc.end();

    } catch (e) {
        console.error(e);
        reply(`❌ Error: ${e.message}`);
    }
});
