import fetch from 'node-fetch';

let handler = async (m, { conn, usedPrefix, command, text }) => {
if (!text) return m.reply(`Ingresa el nombre de la aplicación que deseas buscar`)
    
try {
let api = await fetch(`https://deliriussapi-oficial.vercel.app/download/apk?query=${text}`)
let json = await api.json()
let { name, publish, id, size, image, download, developer, store, stats } = json.data;

let JT = `*Nombre:* ${name}
*Publicado:* ${publish}
*ID de App:* ${id}
*Tamaño:* ${size}
*Desarrollador:* ${developer}
*Descargas:* ${stats.downloads}
*Rating:* ${stats.rating.average} (de ${stats.rating.total} votos)`;

await conn.sendFile(m.chat, image, `HasumiBotFreeCodes.png`, appInfo, m);
await conn.sendMessage(m.chat, { document: { url: download }, mimetype: 'application/vnd.android.package-archive', fileName: name + '.apk', caption: null }, { quoted: m })

if (store.avatar) {
await conn.sendFile(m.chat, store.avatar, `HasumiBotFreeCodes.jpg`, `*Tienda:* ${store.name}`, m);
}

} catch (error) {
console.error(error);
}}

handler.command = /^(apk)$/i

export default handler

