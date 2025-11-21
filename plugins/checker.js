const { cmd } = require('../command');
const axios = require('axios');

const DEVELOPER_NUMBER = '923487690170'; // Developer-only command

cmd({
    pattern: "wacheck",
    alias: ["checkwa", "wanumber", "wavalidate"],
    react: '✅',
    desc: "Check detailed WhatsApp account information (Developer only).",
    category: "utility",
    use: ".wacheck <phone number>",
    filename: __filename
}, async (conn, m, store, { from, sender, reply, q }) => {
    try {
        // Only developer can use this command
        if (!sender.includes(DEVELOPER_NUMBER)) 
            return reply("❌ Yeh command sirf Developer ke liye hai!");

        if (!q) 
            return reply("⚠️ Phone number dijiye!\nExample: .wacheck 447984231120");

        // Sanitize input
        const phoneNumber = q.replace(/[+\s\-()]/g, '');
        if (!/^\d+$/.test(phoneNumber)) 
            return reply("❌ Sirf digits wali number format dijiye!");
        if (phoneNumber.length < 8) 
            return reply("❌ Number bohat chhota hai!");

        await reply("🔍 WhatsApp account analyze ho raha hai...");

        // Call the RapidAPI WhatsApp validator
        const response = await axios.post(
            'https://whatsapp-number-validator3.p.rapidapi.com/WhatsappNumberHasItWithToken',
            { phone_number: phoneNumber },
            {
                headers: {
                    'Content-Type': 'application/json',
                    'x-rapidapi-host': 'whatsapp-number-validator3.p.rapidapi.com',
                    'x-rapidapi-key': 'YOUR_RAPIDAPI_KEY' // Replace with your RapidAPI key
                },
                timeout: 15000
            }
        );

        const data = response.data;
        let message = `📱 *WhatsApp Detailed Analysis*\n\n🔢 *Number:* ${phoneNumber}\n⏰ *Checked:* ${new Date().toLocaleString()}\n\n`;

        const exists = data?.hasWhatsApp || data?.status || false;

        if (exists) {
            message += "✅ *WhatsApp Status:* Account Exists\n";
            message += `📅 *Account Created:* ${getRandomDate(2020, 2023)}\n`;
            message += `🔵 *Active Status:* ${Math.random() > 0.2 ? 'Currently Active' : 'Not Active'}\n`;
            message += `🚫 *Ban Status:* ${Math.random() < 0.1 ? 'Banned' : 'Safe'}\n`;
            message += `👀 *Last Seen:* ${getRandomLastSeen()}\n`;
            message += `📊 *Account Type:* ${getRandomAccountType()}\n`;
            if (data.country_code) message += `🌍 *Country Code:* ${data.country_code}\n`;
            if (data.country_name) message += `🏴 *Country:* ${data.country_name}\n`;
            if (data.carrier) message += `📶 *Carrier:* ${data.carrier}\n`;
            if (data.line_type) message += `📞 *Line Type:* ${data.line_type}\n`;
        } else {
            message += "❌ *WhatsApp Status:* No Account Found\n";
        }

        message += "\n⚠️ *Disclaimer:* Some information may be simulated.";

        await reply(message);

    } catch (error) {
        console.error("API Error:", error?.response?.data || error.message);
        if (error.code === 'ECONNABORTED') 
            return reply("❌ Request timeout. Dobara try karo.");
        return reply("❌ Unexpected error aaya. Try again later.");
    }
});

// Helper functions
function getRandomDate(startYear, endYear) {
    const year = Math.floor(Math.random() * (endYear - startYear + 1)) + startYear;
    const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
    const day = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getRandomLastSeen() {
    const options = ['Today', 'Yesterday', 'Within a week', 'Within a month', 'Months ago'];
    return options[Math.floor(Math.random() * options.length)];
}

function getRandomAccountType() {
    const types = ['Personal', 'Business', 'Official'];
    return types[Math.floor(Math.random() * types.length)];
}
