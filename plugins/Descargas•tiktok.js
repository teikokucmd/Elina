import fetch from 'node-fetch'

let handler = async (m, { args, conn }) => {
if (!args[0]) return m.reply("ingresa un url de tiktok")

try {
let api = await fetch(`https://exonity.tech/api/tiktok?url=${args[0]}`)
let json = await api.json()
let { server1, serverHD, audio } = json.result
await conn.sendFile(m.chat, serverHD.url, 'HasumiBotFreeCodes.mp4', 'Calidad HD', m) // Cambiar a server1.url para que sea calidad mediana
await conn.sendFile(m.chat, audio, 'HasumiBotFreeCodes.mp3', null, m)
} catch (error) {
console.error(error)
}}

handler.command = ['tiktokdl']

export default handler
