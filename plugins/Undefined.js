const handler = async (msgData) => {
    try {
        const receivedMsg = msgData.messages?.[0];
        if (!receivedMsg?.message || !receivedMsg?.key?.remoteJid) return;

        const isReplyToMenu = receivedMsg.message.extendedTextMessage?.contextInfo?.stanzaId === messageID;

        if (isReplyToMenu) {
            const receivedText = receivedMsg.message.conversation || 
                                 receivedMsg.message.extendedTextMessage?.text;
            const senderID = receivedMsg.key.remoteJid;

            if (menuData[receivedText]) {
                const selectedMenu = menuData[receivedText];
                try {
                    if (selectedMenu.image) {
                        await conn.sendMessage(
                            senderID,
                            {
                                image: { url: config.MENU_IMAGE_URL || 'https://i.ibb.co/Hf7526Rr/temp.jpg' },
                                caption: selectedMenu.content,
                                contextInfo
                            },
                            { quoted: receivedMsg }
                        );
                    } else {
                        await conn.sendMessage(
                            senderID,
                            { text: selectedMenu.content, contextInfo },
                            { quoted: receivedMsg }
                        );
                    }

                    // Safe react
                    if (receivedMsg.key) {
                        await conn.sendMessage(senderID, {
                            react: { text: '✅', key: receivedMsg.key }
                        });
                    }

                } catch (e) {
                    console.log('Menu reply error:', e);
                    await conn.sendMessage(
                        senderID,
                        { text: selectedMenu.content, contextInfo },
                        { quoted: receivedMsg }
                    );
                }
            } else {
                await conn.sendMessage(
                    senderID,
                    {
                        text: `❌ *Invalid Option!* ❌\n\nPlease reply with a number between 1-10 to select a menu.\n\n> ${config.DESCRIPTION}`,
                        contextInfo
                    },
                    { quoted: receivedMsg }
                );
            }
        }
    } catch (e) {
        console.log('Handler error:', e);
    }
};
