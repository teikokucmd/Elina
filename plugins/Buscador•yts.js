import Starlights from "@StarlightsTeam/Scraper"

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (!text) return conn.reply(m.chat, '🌸 ¡Hola amor! Por favor, dime qué canción o video deseas buscar en YouTube.', m, fake, )
    await m.react('💖')
    
    try {
        let results = await Starlights.ytsearch(text)
        if (!results || !results.length) return conn.reply(m.chat, `💔 Lo siento cariño, no encontré resultados para "${text}"`, m)
        
        let img = await (await fetch(`${results[0].thumbnail}`)).buffer()
        let txt = `✨ *Resultados de YouTube* ✨\n`
        txt += `🔍 *Búsqueda:* ${text}\n`
        txt += `🎀 *Total de resultados:* ${results.length}\n\n`
        
        results.slice(0, 5).forEach((video, index) => {
            txt += `💎 *Resultado ${index + 1}:*\n`
            txt += `📌 *Título:* ${video.title}\n`
            txt += `⏳ *Duración:* ${video.duration}\n`
            txt += `📅 *Publicado:* ${video.published}\n`
            txt += `👩‍🎤 *Creador(a):* ${video.author}\n`
            txt += `🔗 *Enlace:* ${video.url}\n\n`
        })

        txt += `💞 *Usa el número del resultado para descargar*\n`
        txt += `Ejemplo: *${usedPrefix}ytdl 1*`

        await conn.sendFile(m.chat, img, 'yts.jpg', txt, m, null, {
            mentions: [m.sender],
            contextInfo: {
                externalAdReply: {
                    title: '🌸 YouTube Search - By Elina Bot 🌸',
                    body: '¡Encontré esto para ti!',
                    thumbnail: img,
                    mediaType: 1
                }
            }
        })
        await m.react('✅')
    } catch (e) {
        console.error(e)
        await conn.reply(m.chat, '💢 ¡Ups! Ocurrió un error al buscar. Intenta nuevamente, por favor.', m)
        await m.react('❌')
    }
}

handler.help = ['ytsearch <búsqueda>', 'yts <búsqueda>']
handler.tags = ['búsqueda', 'música', 'youtube']
handler.command = /^(ytsearch|yts|buscarvideo|buscarcanción)$/i
handler.register = true
handler.limit = true

export default handler
