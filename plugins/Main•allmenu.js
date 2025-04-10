import fs from 'fs'
import fetch from 'node-fetch'
import { xpRange } from '../lib/levelling.js'
const { levelling } = '../lib/levelling.js'
import PhoneNumber from 'awesome-phonenumber'
import { promises } from 'fs'
import { join } from 'path'
let handler = async (m, { conn, usedPrefix, usedPrefix: _p, __dirname, text, command }) => {
try {	
let vn = './media/menu.mp3'
let _package = JSON.parse(await promises.readFile(join(__dirname, '../package.json')).catch(_ => ({}))) || {}
let { exp, limit, level, role } = global.db.data.users[m.sender]
let { min, xp, max } = xpRange(level, global.multiplier)
let name = await conn.getName(m.sender)
let d = new Date(new Date + 3600000)
let locale = 'es'
let weton = ['Pahing', 'Pon', 'Wage', 'Kliwon', 'Legi'][Math.floor(d / 84600000) % 5]
let week = d.toLocaleDateString(locale, { weekday: 'long' })
let date = d.toLocaleDateString(locale, {
day: 'numeric',
month: 'long',
year: 'numeric'
})
let dateIslamic = Intl.DateTimeFormat(locale + '-TN-u-ca-islamic', {
day: 'numeric',
month: 'long',
year: 'numeric'
}).format(d)
let time = d.toLocaleTimeString(locale, {
hour: 'numeric',
minute: 'numeric',
second: 'numeric'
})
let _uptime = process.uptime() * 1000
let _muptime
if (process.send) {
process.send('uptime')
_muptime = await new Promise(resolve => {
process.once('message', resolve)
setTimeout(resolve, 1000)
}) * 1000
}
let { money, joincount } = global.db.data.users[m.sender]
let user = global.db.data.users[m.sender]
let muptime = clockString(_muptime)
let uptime = clockString(_uptime)
let totalreg = Object.keys(global.db.data.users).length
let rtotalreg = Object.values(global.db.data.users).filter(user => user.registered == true).length
let replace = {
'%': '%',
p: _p, uptime, muptime,
me: conn.getName(conn.user.jid),
npmname: _package.name,
npmdesc: _package.description,
version: _package.version,
exp: exp - min,
maxexp: xp,
totalexp: exp,
xp4levelup: max - exp,
github: _package.homepage ? _package.homepage.url || _package.homepage : '[unknown github url]',
level, limit, name, weton, week, date, dateIslamic, time, totalreg, rtotalreg, role,
readmore: readMore
}
text = text.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), (_, name) => '' + replace[name])
let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
let mentionedJid = [who]
let username = conn.getName(who)
let taguser = '@' + m.sender.split("@s.whatsapp.net")[0]
  let pp = './Menu2.jpg'

let fkontak = { "key": { "participants":"0@s.whatsapp.net", "remoteJid": "status@broadcast", "fromMe": false, "id": "Halo" }, "message": { "contactMessage": { "vcard": `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD` }}, "participant": "0@s.whatsapp.net" }

let menu = `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ ✧˚ ༘ ⋆｡˚ ✧˚ ༘ ⋆｡˚ ✧˚ ༘ ⋆｡˚
┊ 💖 *¡Hola ${taguser}!* 💖
┊ Bienvenido(a) al menú principal
╰────────────────────────╯

╭─────❀ *𝐈𝐍𝐅𝐎𝐑𝐌𝐀𝐂𝐈Ó𝐍* ❀─────╮
┊ 👑 *Creadora:* Elina
┊ 🌸 *Número:* +5219361112570
┊ 🌷 *Librería:* Baileys
┊ 🏠 *Hosting:* dash.skyultraplus.com
┊ ⏰ *Uptime:* ${uptime}
╰────────────────────────╯

╭─────❀ *𝐈𝐍𝐅𝐎 𝐁𝐎𝐓* ❀─────╮
┊ 💫 ${usedPrefix}owner
┊ 💫 ${usedPrefix}totalfunciones
┊ 💫 ${usedPrefix}velocidad 
┊ 💫 ${usedPrefix}sistema 
┊ 💫 ${usedPrefix}uptime
╰────────────────────────╯

╭─────❀ *𝐃𝐄𝐒𝐂𝐀𝐑𝐆𝐀𝐒* ❀─────╮
┊ 🎀 ${usedPrefix}facebook
┊ 🎀 ${usedPrefix}ytmp3 
┊ 🎀 ${usedPrefix}ytmp4
┊ 🎀 ${usedPrefix}tiktok
┊ 🎀 ${usedPrefix}tiktokimg
┊ 🎀 ${usedPrefix}Spotifydl
┊ 🎀 ${usedPrefix}applemusicdl
┊ 🎀 ${usedPrefix}clouddl
┊ 🎀 ${usedPrefix}pinterestdl
┊ 🎀 ${usedPrefix}Instagram
┊ 🎀 ${usedPrefix}applemusic 
┊ 🎀 ${usedPrefix}souncloud
┊ 🎀 ${usedPrefix}apk
╰────────────────────────╯

╭─────❀ *𝐁Ú𝐒𝐐𝐔𝐄𝐃𝐀𝐒* ❀─────╮
┊ 🔍 ${usedPrefix}spotifysearch
┊ 🔍 ${usedPrefix}mercadolibre
┊ 🔍 ${usedPrefix}wikisearch
┊ 🔍 ${usedPrefix}google
┊ 🔍 ${usedPrefix}tiktokvid
┊ 🔍 ${usedPrefix}shazam
┊ 🔍 ${usedPrefix}yts
┊ 🔍 ${usedPrefix}pinterest
┊ 🔍 ${usedPrefix}tiktoksearch
┊ 🔍 ${usedPrefix}tiktokvid
┊ 🔍 ${usedPrefix}twittersearch
┊ 🔍 ${usedPrefix}applemusicsearch
┊ 🔍 ${usedPrefix}cloudsearch
┊ 🔍 ${usedPrefix}npmjssearct
┊ 🔍 ${usedPrefix}imagenes
╰────────────────────────╯

╭─────❀ *𝐈𝐍𝐓𝐄𝐋𝐈𝐆𝐄𝐍𝐂𝐈𝐀* ❀─────╮
┊ 🧠 ${usedPrefix}ia
┊ 🧠 ${usedPrefix}gemini
┊ 🧠 ${usedPrefix}bing
┊ 🧠 @ai
╰────────────────────────╯

╭─────❀ *𝐇𝐄𝐑𝐑𝐀𝐌𝐈𝐄𝐍𝐓𝐀𝐒* ❀─────╮
┊ 🛠️ ${usedPrefix}ssweb
┊ 🛠️ ${usedPrefix}hd
┊ 🛠️ ${usedPrefix}reenviar
┊ 🛠️ ${usedPrefix}ver
┊ 🛠️ ${usedPrefix}poll
┊ 🛠️ ${usedPrefix}tourl
┊ 🛠️ ${usedPrefix}ibb
┊ 🛠️ ${usedPrefix}toimg
┊ 🛠️ ${usedPrefix}topvideo
┊ 🛠️ ${usedPrefix}topgifaud
┊ 🛠️ ${usedPrefix}topmp3
╰────────────────────────╯

╭─────❀ *𝐆𝐑𝐔𝐏𝐎𝐒* ❀─────╮
┊ 👥 ${usedPrefix}enable
┊ 👥 ${usedPrefix}disable
┊ 👥 ${usedPrefix}unbanchat
┊ 👥 ${usedPrefix}banchat
┊ 👥 ${usedPrefix}promote
┊ 👥 ${usedPrefix}demote
┊ 👥 ${usedPrefix}delete
┊ 👥 ${usedPrefix}tagall
┊ 👥 ${usedPrefix}tag
┊ 👥 ${usedPrefix}kick
┊ 👥 ${usedPrefix}mute
╰────────────────────────╯

╭─────❀ *𝐑𝐏𝐆* ❀─────╮
┊ 🎮 ${usedPrefix}claim
┊ 🎮 ${usedPrefix}dulces
┊ 🎮 ${usedPrefix}crimen
┊ 🎮 ${usedPrefix}minar
┊ 🎮 ${usedPrefix}work
┊ 🎮 ${usedPrefix}verificar
┊ 🎮 ${usedPrefix}perfil
╰────────────────────────╯

╭─────❀ *𝐒𝐓𝐈𝐂𝐊𝐄𝐑𝐒* ❀─────╮
┊ 🌟 ${usedPrefix}sticker
┊ 🌟 ${usedPrefix}qc
┊ 🌟 ${usedPrefix}wm
╰────────────────────────╯

╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ ✧˚ ༘ ⋆｡˚ ✧˚ ༘ ⋆｡˚ ✧˚ ༘ ⋆｡˚
┊ 💖 ¡Gracias por usar Elina Bot! 💖
╰────────────────────────╯`.trim()

let img = await (await fetch(`https://i.ibb.co/10xZ4YZ/file.jpg`)).buffer()  
conn.sendFile(m.chat, img, 'menu.jpg', menu, m, false, { contextInfo: { mentionedJid }})
await m.react('✨')	
} catch (e) {
await m.reply(`❌️ Ocurrió un error.\n\n` + e)
await m.react('❌')
}}
handler.help = ['menu', 'help', '?']
handler.tags = ['main']
handler.command = /^(menu|allmenu\?)$/i
//handler.register = true
handler.exp = 50
handler.fail = null
export default handler

const more = String.fromCharCode(8206)
const readMore = more.repeat(4001)
function clockString(ms) {
let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000)
let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
return [h, m, s].map(v => v.toString().padStart(2, 0)).join(':')}