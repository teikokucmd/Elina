import fetch from 'node-fetch'
import yts from 'yt-search'

let handler = async (m, { conn, text, args }) => {
    if (!text) return m.reply("🌸 Hola personita, por favor escribe lo que quieres buscar")
    
    let ytres = await search(args.join(" "))
    let txt = `✨ Video encontrado:\n${ytres[0].title}`
    await conn.sendFile(m.chat, ytres[0].image, 'thumbnail.jpg', txt, m)
    
    try {
        let api = await fetch(`https://api.giftedtech.my.id/api/download/dlmp4?apikey=gifted&url=${ytres[0].url}`)
        let json = await api.json()
        let { download_url } = json.result
        await conn.sendMessage(m.chat, { 
            video: { url: download_url }, 
            caption: `🎬 ${ytres[0].title}`,
            mimetype: 'video/mp4'
        }, { quoted: m })
    } catch (error) {
        console.error(error)
        m.reply("⚠️ Vaya, personita... ocurrió un error. ¿Probamos de nuevo?")
    }
}

handler.command = /^(play2)$/i
export default handler

async function search(query, options = {}) {
    return (await yts.search({ query, hl: "es", gl: "ES", ...options })).videos
}
