import fetch from 'node-fetch'

let handler = async (m, { args, conn }) => {
if (!args[0]) return m.reply("ingresa un enlace de tiktok")
    
try {
let api = await fetch(`https://tools.betabotz.eu.org/tools/tiktokdl?url=${args[0]}`)
let json = await api.json()
let { processed_time:proceso } = json.result    
let { cover:imgvid, title, ai_dynamic_cover:svid, origin_cover:img, duration:duracion, play:video, wmplay:videomarcadeagua, music, } =  json.result.data
await conn.sendFile(m.chat , video, 'HasumiBotFreeCodes.mp4', title, m)
await conn.sendFile(m.chat , music, 'HasumiBotFreeCodes.mp3', null, m)
} catch (error) {
console.error(error)
}}

handler.command = ['tiktokdl']

export default handler
