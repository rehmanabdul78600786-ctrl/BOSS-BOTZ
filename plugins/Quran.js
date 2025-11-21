const fetch = require('node-fetch');
const { cmd } = require('../command');
const { fetchJson } = require('../lib/functions');
const { translate } = require('@vitalets/google-translate-api');

// ====== Quran Surah Command ======
cmd({
  pattern: "quran",
  alias: ["surah"],
  react: "🤍",
  desc: "Get Quran Surah details and explanation.",
  category: "main",
  filename: __filename
}, async (conn, mek, m, { from, args, reply }) => {
  try {
    const surahInput = args[0];
    if (!surahInput) {
      return reply('❌ Please provide a Surah number or name.\nType *.quranmenu* to see all Surahs.');
    }

    // Fetch all surahs
    const surahListRes = await fetchJson('https://quran-endpoint.vercel.app/quran');
    const surahList = surahListRes.data;

    // Find surah by number or name
    const surahData = surahList.find(surah =>
      surah.number === Number(surahInput) ||
      surah.asma.ar.short.toLowerCase() === surahInput.toLowerCase() ||
      surah.asma.en.short.toLowerCase() === surahInput.toLowerCase()
    );

    if (!surahData) {
      return reply(`❌ Couldn't find Surah with number or name "${surahInput}"`);
    }

    // Fetch surah details
    const res = await fetch(`https://quran-endpoint.vercel.app/quran/${surahData.number}`);
    if (!res.ok) {
      return reply(`❌ API request failed with status ${res.status}`);
    }
    const json = await res.json();

    // Translate tafsir
    const tafsirUrdu = await translate(json.data.tafsir?.id || 'No tafsir available', { to: 'ur' });
    const tafsirEnglish = await translate(json.data.tafsir?.id || 'No tafsir available', { to: 'en' });

    const caption = `
🕋 *Quran: The Holy Book ♥️🌹قرآن مجید🌹♥️*

📖 *Surah ${json.data.number}: ${json.data.asma.ar.long} (${json.data.asma.en.long})*
💫 Type: ${json.data.type.en}
✅ Number of verses: ${json.data.ayahCount}

⚡🔮 *Explanation (Urdu):*
${tafsirUrdu.text}

⚡🔮 *Explanation (English):*
${tafsirEnglish.text}
`;

    // Send surah with banner image
    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/lcpy9f.jpg' },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363405061777123@newsletter',
          newsletterName: '×º𝓑𝖔𝙨𝙨º×',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

    // Send recitation if available
    if (json.data.recitation?.full) {
      await conn.sendMessage(from, {
        audio: { url: json.data.recitation.full },
        mimetype: 'audio/mpeg',
        ptt: true
      }, { quoted: mek });
    }

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});

// ====== Quran Menu Command ======
cmd({
  pattern: "quranmenu",
  alias: ["surahmenu", "surahlist"],
  react: "❤️",
  desc: "Show all Quran surahs with their numbers.",
  category: "menu",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const caption = `❤️ ⊷┈ *QURAN KAREEM* ┈⊷ 🤍

💫 Type *.quran [number|name]* to get details of a Surah.

📜 *Surah List (1-114)*

1. 🕌 Al-Fatiha - الفاتحہ
2. 🐄 Al-Baqarah - البقرہ
3. 🏠 Aali Imran - آل عمران
4. 👩 An-Nisa' - النساء
5. 🍽️ Al-Ma'idah - المائدہ
6. 🐪 Al-An'am - الانعام
7. ⛰️ Al-A'raf - الأعراف
8. ⚔️ Al-Anfal - الانفال
9. 🙏 At-Tawbah - التوبہ
10. 🐟 Yunus - یونس
11. 🌩️ Hud - ہود
12. 👶 Yusuf - یوسف
13. ⚡ Ar-Rad - الرعد
14. 🕊️ Ibrahim - ابراہیم
15. 🪨 Al-Hijr - الحجر
16. 🐝 An-Nahl - النحل
17. 🌙 Al-Isra' - الإسراء
18. 🕳️ Al-Kahf - الکہف
19. 🧕🏻 Maryam - مریم
20. 📜 Ta-Ha - طٰہٰ
21. 📖 Al-Anbiya' - الانبیاء
22. 🕋 Al-Hajj - الحج
23. 🙌 Al-Mu'minun - المؤمنون
24. 💡 An-Nur - النور
25. ⚖️ Al-Furqan - الفرقان
26. 🎤 Ash-Shu'ara' - الشعراء
27. 🐜 An-Naml - النمل
28. 📚 Al-Qasas - القصص
29. 🕷️ Al-Ankabut - العنكبوت
30. 🏛️ Ar-Rum - الروم
... (continue till 114)
114. 🌐 An-Nas - الناس
`;

    await conn.sendMessage(from, {
      image: { url: 'https://files.catbox.moe/lcpy9f.jpg' },
      caption,
      contextInfo: {
        mentionedJid: [m.sender],
        forwardingScore: 999,
        isForwarded: true,
        forwardedNewsletterMessageInfo: {
          newsletterJid: '120363405061777123@newsletter',
          newsletterName: '🔥🥀𝘽οꜱꜱ🥀🔥',
          serverMessageId: 143
        }
      }
    }, { quoted: mek });

  } catch (error) {
    console.error(error);
    reply(`❌ Error: ${error.message}`);
  }
});
