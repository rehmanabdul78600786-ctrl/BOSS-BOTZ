let sentMsg;
try {
    sentMsg = await Promise.race([
        sendMenuImage(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Image send timeout')), 10000))
    ]).catch(e => {
        console.log('Image send failed:', e);
        return undefined;
    });

    await Promise.race([
        sendMenuAudio(),
        new Promise((_, reject) => setTimeout(() => reject(new Error('Audio send timeout')), 8000))
    ]).catch(e => console.log('Audio send failed:', e));

} catch (e) {
    console.log('Menu send error:', e);
}

if (!sentMsg) {
    sentMsg = { key: { id: 'fallback' } }; // fallback to prevent undefined
}
