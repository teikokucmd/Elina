import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, args }) => {
if (!args[0]) return conn.reply(m.chat, "Ingresa un enlace de pinterest", m);
    

try {
let api = await fetch(`https://rest.cifumo.biz.id/api/downloader/pindl?url=${encodeURIComponent(args[0])}`);
let { data } = await api.json();

if (data.type === 'image') {
await conn.sendMessage(m.chat, { image: { url: data.url }, quoted: m });
} else if (data.type === 'video') {
await conn.sendMessage(m.chat, { video: { url: data.url }, quoted: m });
} else {
conn.reply(m.chat, "*error*", m);
}
} catch (error) {
console.error(error);
}}

handler.command = ['pinterestdl']

export default handler
