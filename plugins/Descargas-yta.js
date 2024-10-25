import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) return conn.reply(m.chat, 'Ingresa un enlace de YouTube', m)

try {
let api = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp3?url=${args[0]}`)
let json = await api.json()
let { title, author, image, views, likes, comments, category, duration, download } = json.data
let txt = `🔹 *Título:* ${title}\n🔹 *Autor:* ${author}\n🔹 *Vistas:* ${views}\n🔹 *Likes:* ${likes}\n🔹 *Comentarios:* ${comments}\n🔹 *Categoría:* ${category}\n🔹 *Duración:* ${duration} segundos\n🔹 *Tamaño del archivo:* ${download.size}\n🔹 *Calidad:* ${download.quality}\n🔹 *Formato:* ${download.extension}\n\nEnlace de descarga: ${download.url}`
await conn.sendFile(m.chat, image, 'ytmp3.jpg', txt, m)
await conn.sendMessage(m.chat, { audio: { url: download.url }, mimetype: 'audio/mp4', fileName: `${download.filename}` }, { quoted: m })

} catch (e) {
conn.reply(m.chat, 'Error :v', m)
console.error(e)
}}

handler.command = ['ytmp3']
export default handler
