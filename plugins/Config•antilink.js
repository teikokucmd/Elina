let linkRegex = /(https?:\/\/(?:www\.)?(?:t\.me|telegram\.me|whatsapp\.com)\/\S+)|(https?:\/\/chat\.whatsapp\.com\/\S+)|(https?:\/\/whatsapp\.com\/channel\/\S+)/i

export async function before(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return true
    if (!m.isGroup) return false
    
    let chat = global.db.data.chats[m.chat]
    let delet = m.key.participant
    let bang = m.key.id
    let bot = global.db.data.settings[this.user.jid] || {}
    const isGroupLink = linkRegex.exec(m.text)
    const grupo = `https://chat.whatsapp.com`
    
    if (isAdmin && chat.antiLink && m.text.includes(grupo)) {
        return conn.reply(m.chat, `🌸 *¡Cariño!* El anti-link está activo, pero como eres admin, te salvas~`, m)
    }
    
    if (chat.antiLink && isGroupLink && !isAdmin) {
        if (isBotAdmin) {
            const linkThisGroup = `https://chat.whatsapp.com/${await this.groupInviteCode(m.chat)}`
            if (m.text.includes(linkThisGroup)) return true
        }
        
        await conn.reply(m.chat, `💢 *¡Alerta de enlace!*\n\n*${await this.getName(m.sender)}* envió un enlace prohibido\n\n¡Adiós, personita traviesa! 👋`, m)
        
        if (!isBotAdmin) {
            return conn.reply(m.chat, `🌷 *No soy admin, no puedo proteger el grupo*`, m)
        }
        
        if (isBotAdmin) {
            await conn.sendMessage(m.chat, { 
                delete: { 
                    remoteJid: m.chat, 
                    fromMe: false, 
                    id: bang, 
                    participant: delet 
                }
            })
            await conn.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
        } else if (!bot.restrict) {
            return conn.reply(m.chat, `✨ *Esta función está desactivada actualmente*`, m)
        }
    }
    return true
}
