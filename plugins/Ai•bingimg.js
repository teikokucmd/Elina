import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`Ingresa una peticion`);

try {
let api = await fetch(`https://widipe.com/bingimg?text=${text}`);
let json = await api.json()
if (json.status && json.result.length > 0) {
await conn.sendFile(m.chat, json.result[0], 'imagen.jpg', text, m);
} else {
m.reply('error :v')
}
} catch (error) {
console.error(error);
}}

handler.command = /^(bingimg)$/i

export default handler

