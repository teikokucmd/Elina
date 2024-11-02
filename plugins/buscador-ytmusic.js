import fetch from 'node-fetch';

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, '*Ingresa el texto de lo que quieres buscar en YouTube Music*', m);

try {
let api = await fetch(`https://deliriussapi-oficial.vercel.app/search/searchtrack?q=text${encodeURIComponent(text)}`);

let json = await api.json();
if (!Array.isArray(json) || json.length === 0) return conn.reply(m.chat, 'No se encontraron resultados.', m);

let txt = 'Youtube Music - Search :v';
for (let i = 0; i < json.length; i++) {
      txt += `\n\n`;
      txt += `*Nro* : ${i + 1}\n`;
      txt += `*Título* : ${json[i].title}\n`;
      txt += `*Artista* : ${json[i].artists.join(', ')}\n`;
      txt += `*Álbum* : ${json[i].album}\n`;
      txt += `*Duración* : ${json[i].duration.label}\n`;
      txt += `*Url* : ${json[i].link}`;
    }

await conn.sendFile(m.chat, json[0].thumbnail, 'thumbnail.jpg', txt, m);

} catch {
conn.reply('error :v')
}
};

handler.command = ['youtubemusicsearch', 'ytmssearch'];

export default handler;
