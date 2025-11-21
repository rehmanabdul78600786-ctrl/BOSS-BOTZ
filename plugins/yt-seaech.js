const config = require('../config')
const l = console.log
const { cmd, commands } = require('../command')
const yts = require('yt-search')
const fs = require('fs-extra')
const {
    getBuffer,
    getGroupAdmins,
    getRandom,
    h2k,
    isUrl,
    Json,
    runtime,
    sleep,
    fetchJson
} = require('../lib/functions')

cmd(
    {
        pattern: "yts",
        alias: ["ytsearch"],
        use: '.yts irfan',
        react: "🔎",
        desc: "Search and get details from youtube.",
        category: "search",
        filename: __filename
    },

    async (conn, mek, m, {
        from,
        quoted,
        args,
        q,
        reply
    }) => {

        try {
            if (!q) return reply('*Please give me words to search*')

            let search = await yts(q)
            let text = ''

            search.all.map((video) => {
                text += `*🖲️ ${video.title}*\n🔗 ${video.url}\n\n`
            })

            await conn.sendMessage(from, { text: text }, { quoted: mek })

        } catch (e) {
            l(e)
            reply('*Error !!*')
        }

    }
)
