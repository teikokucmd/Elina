const handler = async (m, {isOwner, isAdmin, conn, text, participants, args, command}) => {
  
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    throw false;
  }

  // Preparación del mensaje
  const mensaje = args.join` ` || '🌸 ¡Hola a tod@s! ✨';
  let teks = `*💌 Mensaje de Elina Bot 💌*\n\n`;
  teks += `*👥 Miembros del grupo: ${participants.length}*\n`;
  teks += `*📝 Mensaje:* ${mensaje}\n\n`;
  teks += `┌───⭒・🌸・⭒───\n`;

  // Listado de miembros
  participants.forEach((mem, i) => {
    teks += `│ ${i+1}. @${mem.id.split('@')[0]}\n`;
  });

  teks += `└───⭒・💖・⭒───\n\n`;
  teks += `*✨ ¡Tengan un lindo día!*\n`;
  teks += `© 2024 Elina Bot | Todos los derechos reservados`;

  // Envío del mensaje
  await conn.sendMessage(m.chat, {
    text: teks, 
    mentions: participants.map(a => a.id)
  });
};

handler.help = ['tagall <mensaje>', 'invocar <mensaje>'];
handler.tags = ['grupo'];
handler.command = /^(tagall|invocar|marcar|todos|invocación|ta)$/i;
handler.admin = true;
handler.group = true;
handler.register = true;

export default handler;
