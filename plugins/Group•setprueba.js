const handler = async (m, {conn, text, isROwner, isOwner}) => {
if (text) {
global.db.data.chats[m.chat].sWelcome = text;
m.reply('*✅ HOLA*');
} else throw `*Ingresé el texto*`;
};
handler.help = ['setwelcome <text>'];
handler.tags = ['group'];
handler.command = ['setwelcome'];
handler.admin = true;
handler.register = true 
export default handler;
