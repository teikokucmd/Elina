import Starlights from '@StarlightsTeam/Scraper';
import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
    if (!text) return conn.reply(m.chat, '🌸 *¡Hola amor!* Por favor, envíame el enlace de una canción, playlist o álbum de Spotify.', m);

    let isSpotifyUrl = text.match(/^(https:\/\/open\.spotify\.com\/(album|track|playlist)\/[a-zA-Z0-9]+)/i);
    if (!isSpotifyUrl) return conn.reply(m.chat, '💔 *Enlace no válido, cariño.* Debe ser un enlace de Spotify (track, playlist o álbum).', m);

    await m.react('💫');
    
    try {
        let { title, artist, album, thumbnail, dl_url } = await Starlights.spotifydl(text);
        let img = await (await fetch(thumbnail)).buffer();

        let txt = `✨ *Elina Bot - Spotify Downloader* ✨\n\n`;
        txt += `🎵 *Título:* ${title}\n`;
        txt += `💿 *Álbum:* ${album}\n`;
        txt += `👩‍🎤 *Artista:* ${artist}\n\n`;
        txt += `💖 *Powered by Elina Bot*`;

        await conn.sendFile(m.chat, img, 'spotify.jpg', txt, m, null, {
            contextInfo: {
                externalAdReply: {
                    title: '🎧 Elina Bot - Spotify Downloader',
                    body: '¡Disfruta de tu música!',
                    thumbnail: img,
                    mediaType: 1,
                    sourceUrl: dl_url
                }
            }
        });
        
        await conn.sendMessage(m.chat, { 
            audio: { url: dl_url }, 
            fileName: `${title}.mp3`, 
            mimetype: 'audio/mp4',
            contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true
            }
        }, { quoted: m });

        await m.react('✅');
    } catch (e) {
        console.error(e);
        await conn.reply(m.chat, '💢 *¡Ups! Ocurrió un error, mi amor.* Intenta con otro enlace o verifica que sea válido.', m);
        await m.react('❌');
    }
};

handler.help = ['spotifydl <enlace>'];
handler.tags = ['música', 'downloader', 'spotify'];
handler.command = ['spotifydl', 'spotify', 'spotidownload'];
handler.register = true;
// handler.limit = true;  // Puedes descomentar para limitar el uso

export default handler;
