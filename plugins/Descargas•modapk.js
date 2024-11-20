let handler = async (m, { conn, args, usedPrefix, command, isOwner }) => {
if (!args[0]) throw `🍭 ingrese el nombre de la app que desea buscar`
let res = await fetch(`https://api.dorratz.com/v2/apk-dl?text=${args[0]}`);
let result = await res.json();
let { name, size, lastUpdate, icon } = result;
let URL = result.dllink
let packe = result.package
let texto = `  ゲ◜៹ Aptoide Scraper ៹◞ゲ*\n
     *☍ Nombre ∙*  ${name} 📩
     *☍ peso ∙*  ${size} ⚖️
     *☍ package ∙*  ${packe} 📦
     *☍ Publicado ∙* ${lastUpdate} 🗓️
    
🍭 Enviando archivo por favor espere suelo ser lenta..`
await conn.sendFile(m.chat, icon, name + '.jpg', texto, m)

await conn.sendMessage(m.chat, { document: { url: URL }, mimetype: 'application/vnd.android.package-archive', fileName: name + '.apk', caption: ''}, { quoted: m });
}
handler.tags = ['descargas']
handler.help = ['apkmod']
handler.command = /^(apkmod)$/i
handler.register = false
//handler.estrellas = 1

export default handler
