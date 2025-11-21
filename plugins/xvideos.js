// media_command.js
// Deobfuscated & cleaned (SANITIZED) version of the original command.
// NOTE: This file purposefully avoids adult-site-specific endpoints and language.
// Replace GENERIC_MEDIA_SEARCH_API and GENERIC_MEDIA_DOWNLOAD_API with your own allowed APIs.

const { cmd } = require('../command');          // command registration helper
const { fetchJson } = require('../lib/functions'); // a small fetch helper that returns parsed JSON

/**
 * Helper: sanitize a user query
 * - trims, limits to 50 chars, removes non-alphanumeric except spaces
 */
function cleanQuery(text) {
  if (!text) return '';
  return text.trim()
    .slice(0, 50)
    .replace(/[^a-zA-Z0-9\s]/g, '');
}

/**
 * Format a list-results message
 * results: array of items { title, duration, url }
 * selectedIndex: index of the item that was chosen
 * username: sender display name
 */
function formatResultsMessage(results, selectedIndex, username, originalQuery) {
  let msg = '╔════════════════════════════╗\n\n║ 🔍 Search Results\n║ Found ' + results.length + ' results for: "' + originalQuery + '"\n\n';
  results.forEach((item, i) => {
    const chosenMark = (i === selectedIndex) ? ' ✅' : '';
    msg += `║ ${i + 1}. ${item.title}${chosenMark}\n`;
    msg += `║    Duration: ${item.duration || 'N/A'}\n`;
  });
  msg += '\n╚════════════════════════════╝\n\n';
  msg += '🔥 I picked one at random for you, ' + username + '\n';
  return msg;
}

/**
 * Format the caption to send with the downloaded media
 */
function formatMediaCaption(item, stats, username) {
  // stats can be: { views, likes, size }
  const duration = item.duration || 'N/A';
  const views = stats?.views ?? 'N/A';
  const likes = stats?.likes ?? 'N/A';
  const size = stats?.size ?? 'N/A';

  let caption = '╔════════════════════════════╗\n\n';
  caption += `║ 🎬 Title: ${item.title}\n\n`;
  caption += `║ ⌛ Duration: ${duration}\n\n`;
  caption += `║ 👀 Views: ${views}  👍 Likes: ${likes}\n`;
  caption += `║ 💾 Size: ${size}\n\n`;
  caption += '╚════════════════════════════╝\n\n';
  caption += `Shared for ${username}`;
  return caption;
}

/**
 * The command registration
 * - pattern: pattern the bot listens for
 * - alias: other names
 * - desc, category, react: metadata
 */
cmd({
  pattern: 'media',             // sanitized command name; replace if needed
  alias: ['md', 'msearch'],
  desc: 'Search and download media from a permitted source (sanitized).',
  category: 'downloader',
  react: '🔎',
  filename: __filename
},
async (sock, message, args, { from, q, reply, pushName }) => {
  // sock: socket client object (used to send messages)
  // message: original message object (for quoting)
  // q: raw query string
  try {
    // 1) Validate query
    if (!q || q.trim() === '') {
      return reply(
        '╔════════════════════════════╗\n\n' +
        '║ ⚠️ Query Missing!\n\n' +
        `║ Hey, ${pushName}, please provide a search query.\n\n` +
        '║ Example: !media cute cats\n\n' +
        '╚════════════════════════════╝'
      );
    }

    const cleaned = cleanQuery(q);
    if (cleaned.length < 3) {
      return reply(
        '╔════════════════════════════╗\n\n' +
        '║ ⚠️ Weak Query!\n\n' +
        `║ "${cleaned}" — please provide at least 3 letters.\n\n` +
        '╚════════════════════════════╝'
      );
    }

    // 2) Call search API
    // IMPORTANT: Replace the placeholder with an actual permitted, non-explicit API.
    const GENERIC_MEDIA_SEARCH_API = 'https://example.com/api/search?query='; // <<-- replace
    const searchUrl = GENERIC_MEDIA_SEARCH_API + encodeURIComponent(cleaned);

    const searchJson = await fetchJson(searchUrl);

    // Validate search results shape
    if (!searchJson || !Array.isArray(searchJson.results) || searchJson.results.length === 0) {
      return reply(
        '╔════════════════════════════╗\n\n' +
        '║ ❌ No Results Found!\n\n' +
        `║ No media found for "${cleaned}", ${pushName}.\n\n` +
        '╚════════════════════════════╝'
      );
    }

    // 3) Limit the results and pick one at random (preserve original behavior)
    const topResults = searchJson.results.slice(0, 5); // top 5
    const chosenIndex = Math.floor(Math.random() * topResults.length);
    const chosenItem = topResults[chosenIndex];

    // Send the formatted results list to the user
    const listMessage = formatResultsMessage(topResults, chosenIndex, pushName, cleaned);
    await reply(listMessage);

    // 4) Call download API for chosen item
    // IMPORTANT: Replace the placeholder with an actual permitted, non-explicit API.
    const GENERIC_MEDIA_DOWNLOAD_API = 'https://example.com/api/download?url=';
    const downloadUrl = GENERIC_MEDIA_DOWNLOAD_API + encodeURIComponent(chosenItem.url);

    const downloadJson = await fetchJson(downloadUrl);

    // Validate download response
    if (!downloadJson || !downloadJson.success || !downloadJson.result || !downloadJson.result.download_url) {
      return reply(
        '╔════════════════════════════╗\n\n' +
        '║ ❌ Download Failed!\n\n' +
        `║ Sorry ${pushName}, the download failed for the selected item.\n\n` +
        '╚════════════════════════════╝'
      );
    }

    // 5) Send the media to the chat
    const mediaCaption = formatMediaCaption(chosenItem, downloadJson.result.stats || {}, pushName);

    await sock.sendMessage(from, {
      video: { url: downloadJson.result.download_url },
      caption: mediaCaption
    }, { quoted: message });

  } catch (err) {
    console.error('Media command error:', err);
    await reply(
      '╔════════════════════════════╗\n\n' +
      '║ 💥 Error Occurred!\n\n' +
      `║ ${pushName}, something went wrong.\n\n` +
      `║ Error: ${err.message}\n\n` +
      '╚════════════════════════════╝'
    );
  }
});
