function handler(m) {
  
  const ownerNumber = '5219361112570'; 
  const ownerName = 'Dueña del bot'; 
  
  // Crear vCard
  const vcard = `
BEGIN:VCARD
VERSION:3.0
FN:${ownerName}
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:${ownerNumber}
END:VCARD
  `.trim();

  // Enviar contacto
  this.sendMessage(
    m.chat, 
    { 
      contacts: { 
        displayName: ownerName, 
        contacts: [{ vcard }] 
      }
    },
    { quoted: m }
  );
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creadora', 'creator', 'owner', 'propietaria', 'dueña']

export default handler
