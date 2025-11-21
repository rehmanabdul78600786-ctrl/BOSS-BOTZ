const { cmd, commands } = require('../command');
const config = require('../config');
const prefix = config.PREFIX;
const fs = require('fs');
const { getBuffer, getGroupAdmins, getRandom, h2k, isUrl, Json, sleep, fetchJson } = require('../lib/functions2');
const { writeFileSync } = require('fs');
const path = require('path');

cmd({
  pattern: "newgc",
  category: "group",
  desc: "Create a new group and add participants.",
  filename: __filename,
}, async (conn, mek, m, { from, body, reply }) => {
  try {
    if (!body) {
      return reply(`Usage: ${prefix}newgc group_name;number1,number2,...`);
    }

    const [groupNameRaw, numbersStringRaw] = body.split(";");
    if (!groupNameRaw || !numbersStringRaw) {
      return reply(`Usage: ${prefix}newgc group_name;number1,number2,...`);
    }

    const groupName = groupNameRaw.trim();
    const participantNumbers = numbersStringRaw.split(",")
      .map(number => number.trim())
      .filter(number => /^\d+$/.test(number)) // Ensure only valid numbers
      .map(number => `${number}@s.whatsapp.net`);

    if (participantNumbers.length === 0) {
      return reply("❌ No valid numbers provided to add to the group.");
    }

    // Create group
    const group = await conn.groupCreate(groupName, participantNumbers);
    console.log('Created group with id: ' + group.id);

    // Get invite link
    const inviteLink = await conn.groupInviteCode(group.id);

    // Send welcome message
    await conn.sendMessage(group.id, { text: `👋 Hello! Welcome to *${groupName}*` });

    // Reply with success and invite link
    reply(`✅ Group created successfully!\nInvite link: https://chat.whatsapp.com/${inviteLink}`);

  } catch (e) {
    console.error("NewGC Error:", e);
    reply(`❌ *An error occurred while creating the group.*\n\n_Error:_ ${e.message || e}`);
  }
});
