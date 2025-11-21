
const { cmd } = require('../command');

function getOwnerJid(conn) {
    return conn.user.id.split(":")[0] + "@s.whatsapp.net";
}

function extractJid(m, q) {
    if (m.quoted) return m.quoted.sender;
    if (m.mentionedJid?.length > 0) return m.mentionedJid[0];
    if (q && q.includes("@")) {
        return q.replace(/[@\s]/g, '') + "@s.whatsapp.net";
    }
    return null;
}

// -------------------------
// BLOCK COMMAND
// -------------------------
cmd({
    pattern: "block",
    desc: "Block a user",
    category: "owner",
    react: "🚫",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {

    const owner = getOwnerJid(conn);

    // Only owner check
    if (m.sender !== owner) {
        await react("❌");
        return reply("Only the *bot owner* can use this command.");
    }

    const jid = extractJid(m, q);
    if (!jid) {
        await react("❌");
        return reply("Please *mention* or *reply* to a user to block.");
    }

    // Safety checks
    if (jid === owner) return reply("❌ You cannot block yourself.");
    if (jid === conn.user.id) return reply("❌ I cannot block myself.");

    try {
        await conn.updateBlockStatus(jid, "block");
        await react("✅");
        return reply(`🚫 Successfully *blocked* @${jid.split("@")[0]}`, { mentions: [jid] });

    } catch (err) {
        console.error("Block error:", err);
        await react("❌");
        return reply("❌ Failed to block the user.");
    }
});


// -------------------------
// UNBLOCK COMMAND
// -------------------------
cmd({
    pattern: "unblock",
    desc: "Unblock a user",
    category: "owner",
    react: "🔓",
    filename: __filename
},
async (conn, m, { reply, q, react }) => {

    const owner = getOwnerJid(conn);

    // Only owner check
    if (m.sender !== owner) {
        await react("❌");
        return reply("Only the *bot owner* can use this command.");
    }

    const jid = extractJid(m, q);
    if (!jid) {
        await react("❌");
        return reply("Please *mention* or *reply* to a user to unblock.");
    }

    try {
        await conn.updateBlockStatus(jid, "unblock");
        await react("✅");
        return reply(`🔓 Successfully *unblocked* @${jid.split("@")[0]}`, { mentions: [jid] });

    } catch (err) {
        console.error("Unblock error:", err);
        await react("❌");
        return reply("❌ Failed to unblock the user.");
    }
});
