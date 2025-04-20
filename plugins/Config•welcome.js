import {WAMessageStubType} from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, {conn, participants, groupMetadata}) {
  if (!m.messageStubType || !m.isGroup) return !0;
    let pp = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => welcome)
    let pp2 = await conn.profilePictureUrl(m.messageStubParameters[0], 'image').catch(_ => adios)
  let img = await (await fetch(`${pp}`)).buffer()
  let img2 = await (await fetch(`${pp2}`)).buffer()

  let chat = global.db.data.chats[m.chat]

  if (chat.welcome && m.messageStubType == 27) {
    let wel = `🌸◌･ﾟ✨ *¡Bienvenida, princesa!* ✨･ﾟ◌🌸
    
➤ Usuario: @${m.messageStubParameters[0].split`@`[0]}
➤ Grupo: ${groupMetadata.subject}

Que tu estadía aquí esté llena de alegría y buenos momentos 💖
━──────────────━
*Con cariño, Elina Bot* 🎀`
await conn.sendMini(m.chat, packname, dev, wel, img, img, channel, fkontak)
  }

  if (chat.welcome && m.messageStubType == 28) {
   let bye = `💔･ﾟ◌ *Hasta pronto, bella alma* ◌･ﾟ💐
   
➤ Usuario: @${m.messageStubParameters[0].split`@`[0]}
➤ Grupo: ${groupMetadata.subject}

El grupo ya no será igual sin tu luz ✨
━──────────────━
*Te extrañaremos, de parte de Elina Bot* 🎀`
await conn.sendMini(m.chat, packname, dev, bye, img2, img2, channel, fkontak)
  }

  if (chat.welcome && m.messageStubType == 29) {
   let bye = `💔･ﾟ◌ *Adiós, estrella fugaz* ◌･ﾟ💫
   
➤ Usuario: @${m.messageStubParameters[0].split`@`[0]}
➤ Grupo: ${groupMetadata.subject}

Que el universo te guíe a nuevos horizontes 🌌
━──────────────━
*Con amor, Elina Bot* 💌`
await conn.sendMini(m.chat, packname, dev, bye, img2, img2, channel, fkontak)
  }}
