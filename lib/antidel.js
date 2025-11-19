const { isJidGroup } = require('@whiskeysockets/baileys');
const { loadMessage, getAnti } = require('../data');
const config = require('../config');

// ------------------ HANDLE DELETED TEXT ------------------ //
const DeletedText = async (conn, mek, jid, deleteInfo, isGroup, update) => {
    try {
        const messageContent =
            mek.message?.conversation ||
            mek.message?.extendedTextMessage?.text ||
            'Unknown content';

        deleteInfo += `\n◈ Content ━ ${messageContent}`;

        await conn.sendMessage(
            jid,
            {
                text: deleteInfo,
                contextInfo: {
                    mentionedJid: isGroup
                        ? [update.key.participant, mek.key.participant]
                        : [update.key.remoteJid],
                },
            },
            { quoted: mek }
        );
    } catch (err) {
        console.error("DeletedText Error:", err);
    }
};

// ------------------ HANDLE DELETED MEDIA ------------------ //
const DeletedMedia = async (conn, mek, jid, deleteInfo) => {
    try {
        const antideletedmek = structuredClone(mek.message);
        const messageType = Object.keys(antideletedmek)[0];

        if (antideletedmek[messageType]) {
            antideletedmek[messageType].contextInfo = {
                stanzaId: mek.key.id,
                participant: mek.sender,
                quotedMessage: mek.message,
            };
        }

        if (messageType === 'imageMessage' || messageType === 'videoMessage') {
            antideletedmek[messageType].caption = deleteInfo;
        } else if (messageType === 'audioMessage' || messageType === 'documentMessage') {
            await conn.sendMessage(
                jid,
                { text: `*⚠️ Deleted Message Alert 🚨*\n${deleteInfo}` },
                { quoted: mek }
            );
        }

        await conn.relayMessage(jid, antideletedmek, {});
    } catch (err) {
        console.error("DeletedMedia Error:", err);
    }
};

// ------------------ MAIN ANTI DELETE FUNCTION ------------------ //
const AntiDelete = async (conn, updates) => {
    try {
        for (const update of updates) {
            // If message is null → user deleted message
            if (update.update.message !== null) continue;

            const store = await loadMessage(update.key.id);
            if (!store || !store.message) continue;

            const mek = store.message;
            const isGroup = isJidGroup(store.jid);

            const isAnti = await getAnti();
            if (!isAnti) continue;

            const deleteTime = new Date().toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
            });

            let deleteInfo;
            let jid;

            // ================= GROUP DELETE =================
            if (isGroup) {
                const groupMeta = await conn.groupMetadata(store.jid);

                const groupName = groupMeta.subject;
                const sender = mek.key.participant?.split('@')[0] || "Unknown";
                const deleter = update.key.participant?.split('@')[0] || "Unknown";

                deleteInfo =
                    `*╭────⬡ BOSS-BOT 💔❤‍🔥 ⬡────*\n` +
                    `*├♻️ SENDER:* @${sender}\n` +
                    `*├👥 GROUP:* ${groupName}\n` +
                    `*├⏰ DELETE TIME:* ${deleteTime}\n` +
                    `*├🗑️ DELETED BY:* @${deleter}\n` +
                    `*├⚠️ ACTION:* Deleted a Message\n` +
                    `*╰💬 MESSAGE:* Content Below 🔽`;

                jid = config.ANTI_DEL_PATH === "inbox" ? conn.user.id : store.jid;
            }
            // ================= PRIVATE DELETE =================
            else {
                const sender = mek.key.remoteJid?.split('@')[0] || "Unknown";

                deleteInfo =
                    `*╭────⬡ 🤖 BOSS-BOT 🖤 ⬡────*\n` +
                    `*├👤 SENDER:* @${sender}\n` +
                    `*├⏰ DELETE TIME:* ${deleteTime}\n` +
                    `*├⚠️ ACTION:* Deleted a Message\n` +
                    `*╰💬 MESSAGE:* Content Below 🔽`;

                jid = config.ANTI_DEL_PATH === "inbox"
                    ? conn.user.id
                    : update.key.remoteJid;
            }

            // ---------------- TEXT OR MEDIA? ---------------- //
            if (mek.message?.conversation || mek.message?.extendedTextMessage) {
                await DeletedText(conn, mek, jid, deleteInfo, isGroup, update);
            } else {
                await DeletedMedia(conn, mek, jid, deleteInfo);
            }
        }
    } catch (err) {
        console.error("AntiDelete Error:", err);
    }
};

module.exports = {
    DeletedText,
    DeletedMedia,
    AntiDelete,
};
