// Give Me Credit If Using This File Give Me Credit On Your Channel ✅
// Credits ArslanMD 💜

const { isJidGroup } = require('@whiskeysockets/baileys');
const config = require('../config');

const getContextInfo = (m) => {
    return {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
            newsletterJid: '120363348739987203@newsletter',
            newsletterName: 'Boss💔',
            serverMessageId: 143,
        },
    };
};

const ppUrls = [
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
    'https://i.ibb.co/KhYC4FY/1221bc0bdd2354b42b293317ff2adbcf-icon.png',
];

const GroupEvents = async (conn, update) => {
    try {
        const isGroup = isJidGroup(update.id);
        if (!isGroup) return;

        const metadata = await conn.groupMetadata(update.id);
        const participants = update.participants;
        const desc = metadata.desc || "No Description";
        const groupMembersCount = metadata.participants.length;

        let ppUrl;
        try {
            ppUrl = await conn.profilePictureUrl(update.id, 'image');
        } catch {
            ppUrl = ppUrls[Math.floor(Math.random() * ppUrls.length)];
        }

        for (const num of participants) {
            const userName = num.split("@")[0];
            const timestamp = new Date().toLocaleString();

            // ------------------------------ WELCOME ------------------------------
            if (update.action === "add" && config.WELCOME === "true") {
                const WelcomeText =
                    `Hey @${userName} 👋\n` +
                    `Welcome to *${metadata.subject}*.\n` +
                    `You are member number ${groupMembersCount}. 🙏\n` +
                    `Time joined: *${timestamp}*\n` +
                    `Group Description:\n${desc}\n\n` +
                    `*Powered by ${config.BOT_NAME}*`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: WelcomeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });
            }

            // ------------------------------ GOODBYE ------------------------------
            else if (update.action === "remove" && config.WELCOME === "true") {
                const GoodbyeText =
                    `Goodbye @${userName} 😔\n` +
                    `Member left at: *${timestamp}*\n` +
                    `Remaining members: ${groupMembersCount}`;

                await conn.sendMessage(update.id, {
                    image: { url: ppUrl },
                    caption: GoodbyeText,
                    mentions: [num],
                    contextInfo: getContextInfo({ sender: num }),
                });
            }

            // ------------------------------ DEMOTE ------------------------------
            else if (update.action === "demote" && config.ADMIN_EVENTS === "true") {
                const demoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text:
                        `*Admin Event*\n\n` +
                        `@${demoter} demoted @${userName}. 👀\n` +
                        `Time: ${timestamp}\n` +
                        `Group: ${metadata.subject}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }

            // ------------------------------ PROMOTE ------------------------------
            else if (update.action === "promote" && config.ADMIN_EVENTS === "true") {
                const promoter = update.author.split("@")[0];
                await conn.sendMessage(update.id, {
                    text:
                        `*Admin Event*\n\n` +
                        `@${promoter} promoted @${userName} to admin. 🎉\n` +
                        `Time: ${timestamp}\n` +
                        `Group: ${metadata.subject}`,
                    mentions: [update.author, num],
                    contextInfo: getContextInfo({ sender: update.author }),
                });
            }
        }

    } catch (err) {
        console.error('Group event error:', err);
    }
};

module.exports = GroupEvents;
