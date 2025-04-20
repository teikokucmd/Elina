import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
    if (!text) {
        return conn.reply(m.chat, '🌸 *¡Hola personita!* Por favor, dime qué video deseas buscar en YouTube.', m)
    }
    
    await m.react('⏳') 
    
    try {
        
        let ytres = await search(args.join(" "))
        if (!ytres || !ytres.length) {
            return conn.reply(m.chat, '🔍 *Ups, personita.* No encontré resultados. ¿Quieres intentar con otro nombre?', m)
        }
        
        let videoInfo = ytres[0]
        let txt = `✨ *YouTube Search* ✨\n\n`
        txt += `📌 *Título:* ${videoInfo.title}\n`
        txt += `⏱️ *Duración:* ${videoInfo.timestamp}\n`
        txt += `🎙️ *Canal:* ${videoInfo.author.name}\n`
        txt += `📆 *Publicado:* ${videoInfo.ago}\n\n`
        txt += `🔄 *Preparando tu video...*`
        
        
        await conn.sendFile(m.chat, videoInfo.image, 'thumbnail.jpg', txt, m, null, {
            contextInfo: {
                externalAdReply: {
                    title: '🎥 Elina Bot - Buscador YouTube',
                    body: 'Encontré esto para ti',
                    thumbnail: videoInfo.image,
                    mediaType: 1
                }
            }
        })
        
        
        let api = await fetch(`https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${videoInfo.url}`)
        let json = await api.json()
        
        if (!json.result) throw new Error('Error al descargar')
        
        let { quality, title, download_url } = json.result
        await conn.sendMessage(m.chat, { 
            video: { url: download_url }, 
            caption: `📹 *${title}*\n\n✨ *Disfruta tu video, personita*`,
            mimetype: 'video/mp4', 
            fileName: `${title}.mp4`,
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999
            }
        }, { quoted: m })
        
        await m.react('✅') 
        
    } catch (error) {
        console.error(error)
        await conn.reply(m.chat, '❌ *Vaya, personita...* Ocurrió un error. ¿Probamos nuevamente?', m)
        await m.react('⚠️') 
    }
}

handler.help = ['play2 <búsqueda>']
handler.tags = ['música', 'video', 'descargas']
handler.command = /^(play2|ytplay|videoplay)$/i
handler.limit = true
handler.register = true

export default handler

async function search(query, options = {}) {
  let search = await yts.search({ query, hl: "es", gl: "ES", ...options })
  return search.videos
}
