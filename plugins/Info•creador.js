function handler(m) {

  const ownerData = [
    ["5219361112570", "Dueña del bot", true],
    ["529361112570", "Dueña del bot", true]
  ];
  
  this.sendContact(
    m.chat, 
    ownerData.map(([id, name]) => [id, name]), 
    m, 
    { contextInfo: { externalAdReply: { showAdAttribution: true }}}
  );
}

handler.help = ['creador']
handler.tags = ['info']
handler.command = ['creadora', 'creator', 'owner', 'propietaria', 'dueña']

export default handler
