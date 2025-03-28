const handler = async (m, {conn, text, isROwner, isOwner}) => {
if (text) {
global.db.data.chats[m.chat].sWelcome = text;
m.reply('*✅ hola*');
} else throw `*⚠️ INGRESE EL TEXTO*`;
};
handler.help = ['setprueba <text>'];
handler.tags = ['group'];
handler.command = ['setprueba'];
handler.admin = true;
handler.register = tr
