const axios = require("axios");
const fetch = require("node-fetch");
const { sleep } = require('../lib/functions');
const { cmd, commands } = require("../command");

/**
 * Helper functions
 */
async function fetchJson(url, errorMsg = "Failed to fetch data") {
  try {
    const res = await axios.get(url);
    if (!res.data) throw new Error(errorMsg);
    return res.data;
  } catch (err) {
    console.error(err);
    throw new Error(errorMsg);
  }
}

async function fetchApiText(url, m) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
    const json = await res.json();
    if (!json.result) throw new Error("Invalid API response: No 'result' field found.");
    return json.result;
  } catch (err) {
    console.error(`Error fetching API text:`, err);
    throw err;
  }
}

function generateReadMore(text) {
  const readMore = String.fromCharCode(8206).repeat(4000);
  return `${text} ${readMore} Continue Reading...`;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * JOKE COMMAND
 */
cmd({
  pattern: "joke",
  desc: "😂 Get a random joke",
  react: "🤣",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const joke = await fetchJson("https://official-joke-api.appspot.com/random_joke", "Couldn't fetch a joke!");
    if (!joke.setup || !joke.punchline) return reply("❌ Joke not found!");

    reply(`🤣 *Here's a random joke for you!* 🤣\n\n*${joke.setup}*\n\n${joke.punchline} 😆\n\n> *🔥🥀𝘽οꜱꜱ🥀🔥*`);
  } catch {
    reply("⚠️ Something went wrong while fetching the joke.");
  }
});

/**
 * FLIRT COMMAND
 */
cmd({
  pattern: "flirt",
  alias: ["masom", "line"],
  desc: "Get a random flirt or pickup line",
  react: "💘",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const shizokeys = 'shizo';
    const flirtText = await fetchApiText(`https://shizoapi.onrender.com/api/texts/flirt?apikey=${shizokeys}`);
    await conn.sendMessage(from, { text: flirtText, mentions: [m.sender] }, { quoted: m });
  } catch {
    reply("⚠️ Something went wrong while fetching the flirt line.");
  }
});

/**
 * TRUTH COMMAND
 */
cmd({
  pattern: "truth",
  alias: ["truthquestion"],
  desc: "Get a random truth question",
  react: "❓",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const shizokeys = 'shizo';
    const truthText = await fetchApiText(`https://shizoapi.onrender.com/api/texts/truth?apikey=${shizokeys}`);
    await conn.sendMessage(from, { text: truthText, mentions: [m.sender] }, { quoted: m });
  } catch {
    reply("⚠️ Something went wrong while fetching the truth question.");
  }
});

/**
 * DARE COMMAND
 */
cmd({
  pattern: "dare",
  alias: ["truthordare"],
  desc: "Get a random dare",
  react: "🎯",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const shizokeys = 'shizo';
    const dareText = await fetchApiText(`https://shizoapi.onrender.com/api/texts/dare?apikey=${shizokeys}`);
    await conn.sendMessage(from, { text: dareText, mentions: [m.sender] }, { quoted: m });
  } catch {
    reply("⚠️ Something went wrong while fetching the dare.");
  }
});

/**
 * FACT COMMAND
 */
cmd({
  pattern: "fact",
  desc: "🧠 Get a random fun fact",
  react: "🧠",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { reply }) => {
  try {
    const fact = await fetchJson("https://uselessfacts.jsph.pl/random.json?language=en", "Couldn't fetch a fact!");
    reply(`🧠 *Random Fun Fact* 🧠\n\n${fact.text}\n\n> *🔥🥀𝘽οꜱꜱ🥀🔥*`);
  } catch {
    reply("⚠️ Something went wrong while fetching the fact.");
  }
});

/**
 * PICKUP LINE COMMAND
 */
cmd({
  pattern: "pickupline",
  alias: ["pickup"],
  desc: "Get a random pickup line",
  react: "💬",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, reply }) => {
  try {
    const res = await fetch('https://api.popcat.xyz/pickuplines');
    if (!res.ok) throw new Error(`API request failed with status ${res.status}`);
    const json = await res.json();
    const pickupLine = `*Here's a pickup line for you:*\n\n"${json.pickupline}"\n\n> *𝓐𝓻𝓼𝓵𝓪𝓷_𝓜𝓓*`;
    await conn.sendMessage(from, { text: pickupLine }, { quoted: m });
  } catch {
    reply("⚠️ Something went wrong while fetching the pickup line.");
  }
});

/**
 * CHARACTER COMMAND
 */
cmd({
  pattern: "character",
  alias: ["char"],
  desc: "Check the character of a mentioned user",
  react: "🔥",
  category: "fun",
  filename: __filename
}, async (conn, mek, m, { from, isGroup, reply }) => {
  try {
    if (!isGroup) return reply("❌ This command can only be used in groups.");
    const mentionedUser = m.message.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    if (!mentionedUser) return reply("❌ Please mention a user.");

    const traits = ["Sigma", "Generous", "Grumpy", "Overconfident", "Obedient", "Good", "Simp", "Kind", "Patient", "Pervert", "Cool", "Helpful", "Brilliant", "Sexy", "Hot", "Gorgeous", "Cute"];
    const trait = randomChoice(traits);

    await conn.sendMessage(from, {
      text: `Character of @${mentionedUser.split("@")[0]} is *${trait}* 🔥⚡`,
      mentions: [mentionedUser]
    }, { quoted: m });
  } catch {
    reply("⚠️ Something went wrong while checking character.");
  }
});

/**
 * REPEAT COMMAND
 */
cmd({
  pattern: "repeat",
  alias: ["rp", "rpm"],
  desc: "Repeat a message a specified number of times",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    if (!args[0]) return reply("✳️ Use like: .repeat 10,I love you");

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (!message) return reply("❎ Please provide a message.");
    if (isNaN(count) || count <= 0 || count > 300) return reply("❎ Count must be 1-300.");

    reply(`🔄 Repeated ${count} times:\n\n${Array(count).fill(message).join("\n")}`);
  } catch {
    reply("❎ Error while repeating the message.");
  }
});

/**
 * SEND COMMAND (Owner Only)
 */
cmd({
  pattern: "send",
  desc: "Send a message multiple times, one by one",
  category: "fun",
  filename: __filename
}, async (conn, m, store, { args, reply, senderNumber }) => {
  try {
    const botOwner = conn.user.id.split(":")[0];
    if (senderNumber !== botOwner) return reply("❎ Only the bot owner can use this command.");
    if (!args[0]) return reply("✳️ Use like: .send 10,I love you");

    const [countStr, ...messageParts] = args.join(" ").split(",");
    const count = parseInt(countStr.trim());
    const message = messageParts.join(",").trim();

    if (!message) return reply("❎ Please provide a message.");
    if (isNaN(count) || count <= 0 || count > 100) return reply("❎ Count must be 1-100.");

    reply(`⏳ Sending "${message}" ${count} times...`);
    for (let i = 0; i < count; i++) {
      await conn.sendMessage(m.from, { text: message }, { quoted: m });
      await sleep(1000);
    }
    reply(`✅ Successfully sent ${count} messages.`);
  } catch {
    reply("❎ Error while sending messages.");
  }
});

/**
 * READMORE COMMAND
 */
cmd({
  pattern: "readmore",
  alias: ["rm", "rmore", "readm"],
  desc: "Generate a Read More message",
  category: "convert",
  react: "📝",
  filename: __filename
}, async (conn, m, store, { args, reply }) => {
  try {
    const text = args.join(" ") || "No text provided.";
    await conn.sendMessage(m.from, { text: generateReadMore(text) }, { quoted: m });
  } catch {
    reply("❌ Error while creating readmore message.");
  }
});
