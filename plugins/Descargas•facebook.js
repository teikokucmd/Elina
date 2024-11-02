import { facebookdl, facebookdlv2 } from '@bochilteam/scraper';

const handler = async (m, { conn, args }) => {
if (!args[0]) return conn.reply(m.chat, 'Ingresa un enlace de facebook', m);

try {
const { result } = await facebookdl(args[0]).catch(() => facebookdlv2(args[0]))

if (result && result.length > 0) {
let videoSent = false;

for (const item of result) {
if (item.isVideo) {
const fileType = item.ext || 'mp4';
await conn.sendFile(m.chat, item.url, `facebook.${fileType}`, null, m);
videoSent = true;
break;
}
}
} else {
conn.reply(m.chat, 'Sin resultados', m);
}
} catch {
conn.reply(m.chat, 'ocurrio un error :v', m);
}
};

handler.command = ['facebook'];
export default handler;
