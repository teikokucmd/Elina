import fetch from 'node-fetch';

let handler = async (m, { conn, args, usedPrefix, command }) => {
if (!args[0]) return conn.reply(m.chat, 'Ingresa un enlace de Tiktok', m);
 
try {
let api = await fetch(`https://deliriussapi-oficial.vercel.app/download/tiktok?url=${args[0]}`);
let json = await api.json();
let { video, title, likes, comment, shares, views, creator, desc } = json

let txt = `*Titulo* : ${title}
*Descripcion* : ${desc}
*Creador* : ${creator}
*Visitas* : ${views}
*Likes* : ${likes}
*Comentarios* : ${comment}
*Compartidos* : ${shares}
`;
await conn.sendFile(m.chat, video, 'tiktok.mp4', txt, m)

await conn.sendMessage(m.chat, { audio: { url: video }, fileName: `${title}.mp3`, mimetype: 'audio/mp4' }, { quoted: m });

} catch {
conn.reply('error :v')    
}
}
    
handler.command = ['tiktok'];

export default handler;
