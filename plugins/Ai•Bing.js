import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
  if (!text) return m.reply(`Ingresa una peticion`);

try {
let api = await fetch(`https://widipe.com/bingai?text=${text}`);
let json = await api.json()
if (json.status) {
m.reply(json.result);
} else {
m.reply('error :v');
}
} catch (error) {
console.error(error);
}}

handler.command = /^(bing)$/i

export default handler

