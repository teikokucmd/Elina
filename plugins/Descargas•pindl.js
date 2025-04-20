import Starlights from '@StarlightsTeam/Scraper';

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0]) return conn.reply(m.chat, `🌸 *¡Hola preciosa!* Por favor, envíame un enlace de Pinterest para descargar.`, m);
    
    await m.react('💫');
    
    try {
        let { dl_url, quality, size, duration, url } = await Starlights.pinterestdl(args[0]);

        let txt = `✨ *Elina Bot - Descarga Pinterest* ✨\n\n`;
        txt += `🌷 *Calidad:* ${quality}\n`;
        txt += `📏 *Tamaño:* ${size}\n`;
        txt += `⏳ *Duración:* ${duration}\n`;
        txt += `🔗 *Enlace:* ${url}\n\n`;
        txt += `💞 *Powered by Elina Bot*`;

        await conn.sendMessage(m.chat, { 
            video: { url: dl_url }, 
            caption: txt, 
            mimetype: 'video/mp4', 
            fileName: `pinterest_${Date.now()}.mp4`,
            contextInfo: {
                externalAdReply: {
                    title: '🌸 Elina Bot - Pinterest Downloader',
                    body: '¡Descarga completada con éxito!',
                    thumbnail: await (await fetch(global.pp)).buffer(),
                    mediaType: 1
                }
            }
        }, { quoted: m });
        
        await m.react('✅');
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, `💔 *¡Ups, amor!* No pude descargar ese enlace. ¿Podrías verificarlo e intentar nuevamente?`, m);
        await m.react('❌');
    }
};

handler.help = ['pinterestdl <url>'];
handler.tags = ['downloader', 'pinterest', 'mujer'];
handler.command = ['pinterestdl', 'pindl', 'pin'];
handler.register = true;

export default handler;
