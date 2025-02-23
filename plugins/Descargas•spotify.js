import fetch from 'node-fetch';

let handler = async (m, { conn, text }) => {
if (!text) return conn.reply(m.chat, '- Ingresa el nombre o enlace de *Spotify*.', m);
try {
let res = await fetch(`https://api.vreden.web.id/api/spotify?url=${encodeURIComponent(text)}`);
let json = await res.json();
if (json.status === 200 && json.result?.status) {
let { title, artists, cover, music } = json.result;
let msg = `🎵 *Título*: ${title.json}\n🎤 *Artista*: ${artists.json}\n📅 *Lanzamiento*: ${json.result.releaseDate}`;
await conn.sendFile(m.chat, cover, 'cover.jpg', msg, m);
await conn.sendMessage(m.chat, { audio: { url: music }, fileName: `${title}.mp3`, mimetype: 'audio/mpeg' }, { quoted: m });
} else conn.reply(m.chat, '🚩 No se pudo obtener la música.', m);
} catch { conn.reply(m.chat, '🚩 Error al procesar la solicitud.', m); }
};

handler.command = /^(spotify|sp)$/i;

export default handler;
