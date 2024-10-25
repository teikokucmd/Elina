import fetch from 'node-fetch'

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) return conn.reply(m.chat, 'Ingresa un enlace de YouTube', m)
  
try {
let api = await fetch(`https://deliriussapi-oficial.vercel.app/download/ytmp3?url=${args[0]}`)
let json = await api.json()
let { title, thumbnails, download } = json
    
let txt = `Título: ${title}\nURL: ${download}`
await conn.sendFile(m.chat, thumbnails.high.url, 'ytmp3.jpg', txt, m)
    
await conn.sendMessage(m.chat, { audio: { url: download }, caption: null, mimetype: 'audio/mp4', fileName: `${title}.mp3` }, { quoted: m }) 
    
} catch (e) {
conn.reply(m.chat, 'Error :v', m)
console.error(e)
}}

handler.command = ['ytmp3']
export default handler
