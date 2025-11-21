//---------------------------------------------------------------------------
//           BOSS-MD  
//---------------------------------------------------------------------------
//  ⚠️ DO NOT MODIFY THIS FILE ⚠️  
//---------------------------------------------------------------------------
const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');

cmd({
  pattern: "poll",
  category: "group",
  desc: "Create a poll with a question and options in the group.",
  filename: __filename,
}, async (conn, mek, m, { from, isGroup, body, sender, groupMetadata, participants, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");

    // Split question and options
    let [question, optionsString] = body.split(";");
    
    if (!question || !optionsString) {
      return reply(`Usage: ${prefix}poll question;option1,option2,option3...`);
    }

    // Trim options and filter out empty ones
    let options = optionsString
      .split(",")
      .map(o => o.trim())
      .filter(o => o.length > 0);

    if (options.length < 2) {
      return reply("❌ Please provide at least two options for the poll.");
    }

    // Send poll message
    await conn.sendMessage(from, {
      poll: {
        name: question.trim(),
        values: options,
        selectableCount: 1, // Only 1 choice per user
        toAnnouncementGroup: true,
      }
    }, { quoted: mek });

  } catch (e) {
    console.error("Poll command error:", e);
    reply(`❌ An error occurred while processing your poll.\n\n_Error:_ ${e.message || e}`);
  }
});
