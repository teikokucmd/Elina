import fetch from 'node-fetch'

let handler = async (m, { args, conn }) => {
if (!args[0]) return m.reply("ingresa un url de tiktok")

try {
let api = await fetch(`https://exonity.tech/api/tiktok2?url=${args[0]}`)
let json = await api.json()
let { cover:img, title, origin_cover, no_watermark, watermark, music, like, author } = json.result
await conn.sendFile(m.chat, no_watermark, 'HasumiBotFreeCodes.mp4', title, m) 
await conn.sendFile(m.chat, music, 'HasumiBotFreeCodes.mp3', null, m)
} catch (error) {
console.error(error)
}}

handler.command = ['tiktokdl']

export default handler
