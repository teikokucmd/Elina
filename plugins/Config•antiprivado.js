export async function before(m, {conn, isAdmin, isBotAdmin, isOwner, isROwner}) {
  if (m.isBaileys && m.fromMe) return true;
  if (m.isGroup) return false;
  if (!m.message) return true;
  
  
  const allowedWords = ['PIEDRA', 'PAPEL', 'TIJERA', 'serbot', 'jadibot'];
  if (allowedWords.some(word => m.text.includes(word))) return true;
  
  const chat = global.db.data.chats[m.chat];
  const bot = global.db.data.settings[this.user.jid] || {};
  
  if (bot.antiPrivate && !isOwner && !isROwner) {
    await conn.sendMessage(m.chat, {
      text: `🌸 *¡Hola @${m.sender.split`@`[0]}!* ✨\n\n` +
            `Soy *ElinaBot*, propiedad de *Elina* 💖\n\n` +
            `Los comandos en privado están desactivados por seguridad.\n` +
            `Si deseas usar mis funciones, únete a mi grupo oficial:\n` +
            `${grupo}\n\n` +
            `📩 *Contacta a mi propietaria:*\n` +
            `+52 936 111 2570\n\n` +
            `🔒 *Serás bloqueado temporalmente*`,
      mentions: [m.sender],
      contextInfo: {
        externalAdReply: {
          title: `ElinaBot - Propiedad de Elina`,
          body: '¡Contáctame para más información!',
          thumbnail: await (await fetch(pp)).buffer(),
          mediaType: 1,
          sourceUrl: grupo
        }
      }
    });
    
    await this.updateBlockStatus(m.chat, 'block');
  }
  return false;
}
