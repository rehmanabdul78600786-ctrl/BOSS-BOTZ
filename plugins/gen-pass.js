const crypto = require("crypto");
const { cmd } = require("../command");

cmd({
  pattern: "gpass",
  desc: "Generate a strong password.",
  category: "other",
  react: "🔐",
  filename: __filename
}, async (conn, m, store, {
  from,
  quoted,
  args,
  reply
}) => {
  try {
    // Default password length to 12 if not provided
    const passwordLength = args[0] ? parseInt(args[0]) : 12;

    // Validate password length
    if (isNaN(passwordLength) || passwordLength < 8 || passwordLength > 64) {
      return reply("❌ Please provide a valid password length (between 8 and 64).");
    }

    // Characters to use for the password
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?';

    // Generate password securely using crypto
    let password = '';
    for (let i = 0; i < passwordLength; i++) {
      const randomIndex = crypto.randomInt(0, chars.length);
      password += chars[randomIndex];
    }

    // Send password to user
    await conn.sendMessage(from, {
      text: `🔐 *Your Strong Password* 🔐\n\nHere is your generated password:\n\n${password}\n\n*꧁༒♛ 𝔅𝖔𝖘𝖘♛༒꧂*`
    }, { quoted });

  } catch (error) {
    console.error("Error generating password:", error);
    reply("❌ Error generating password: " + (error.message || error));
  }
});
