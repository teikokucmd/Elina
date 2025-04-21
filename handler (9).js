import { smsg } from "./lib/simple.js"
import { format } from "util"
import { fileURLToPath } from "url"
import path, { join } from "path"
import { unwatchFile, watchFile } from "fs"
import chalk from "chalk"

const { proto } = (await import("@whiskeysockets/baileys")).default
const isNumber = (x) => typeof x === "number" && !isNaN(x)
const delay = (ms) =>
  isNumber(ms) &&
  new Promise((resolve) =>
    setTimeout(function () {
      clearTimeout(this)
      resolve()
    }, ms),
  )

// Declare missing variables
const opts = global.opts || {}
const conn = global.conn || {}
const isBaileysFail = global.isBaileysFail || false
const plugins = global.plugins || {}
const fake = global.fake || {}
const db = global.db || {}

export async function handler(chatUpdate) {
  this.msgqueque = this.msgqueque || []
  if (!chatUpdate) return
  this.pushMessage(chatUpdate.messages).catch(console.error)
  let m = chatUpdate.messages[chatUpdate.messages.length - 1]
  if (!m) return
  if (global.db.data == null) await global.loadDatabase()
  try {
    m = smsg(this, m) || m
    if (!m) return
    m.exp = 0
    m.cookies = false
    try {
      const user = global.db.data.users[m.sender]
      if (typeof user !== "object") global.db.data.users[m.sender] = {}
      if (user) {
        if (!isNumber(user.exp)) user.exp = 0
        if (!isNumber(user.cookies)) user.cookies = 10
        if (!("muto" in user)) user.muto = false
        if (!("premium" in user)) user.premium = false
        if (!user.premium) user.premiumTime = 0
        if (!("registered" in user)) user.registered = false
        if (!user.registered) {
          if (!("name" in user)) user.name = m.name
          if (!isNumber(user.age)) user.age = -1
          if (!isNumber(user.regTime)) user.regTime = -1
        }
        if (!isNumber(user.afk)) user.afk = -1
        if (!("afkReason" in user)) user.afkReason = ""
        if (!("banned" in user)) user.banned = false
        if (!("useDocument" in user)) user.useDocument = false
        if (!isNumber(user.level)) user.level = 0
        if (!isNumber(user.bank)) user.bank = 0
      } else
        global.db.data.users[m.sender] = {
          exp: 0,
          cookies: 10,
          muto: false,
          registered: false,
          name: m.name,
          age: -1,
          regTime: -1,
          afk: -1,
          afkReason: "",
          banned: false,
          useDocument: false,
          bank: 0,
          level: 0,
        }
      const chat = global.db.data.chats[m.chat]
      if (typeof chat !== "object") global.db.data.chats[m.chat] = {}
      if (chat) {
        if (!("isBanned" in chat)) chat.isBanned = false
        if (!("welcome" in chat)) chat.welcome = true
        if (!("audios" in chat)) chat.audios = false
        if (!("detect" in chat)) chat.detect = true
        if (!("onlyLatinos" in chat)) chat.onlyLatinos = true
        if (!("antiBot" in chat)) chat.antiBot = false
        if (!("antiBot2" in chat)) chat.antiBot2 = false
        if (!("modoadmin" in chat)) chat.modoadmin = false
        if (!("antiLink" in chat)) chat.antiLink = false
        if (!("modohorny" in chat)) chat.modohorny = false
        if (!("reaction" in chat)) chat.reaction = false
        if (!("simi" in chat)) chat.simi = false
        if (!("antiver" in chat)) chat.antiver = false
        if (!("delete" in chat)) chat.delete = false
        if (!isNumber(chat.expired)) chat.expired = 0
      } else
        global.db.data.chats[m.chat] = {
          isBanned: false,
          welcome: true,
          delete: false,
          onlyLatinos: false,
          audios: false,
          detect: true,
          antiBot: false,
          antiBot2: false,
          modoadmin: false,
          antiLink: false,
          simi: false,
          antiver: false,
          modohorny: false,
          reaction: false,
          expired: 0,
        }
      var settings = global.db.data.settings[this.user.jid]
      if (typeof settings !== "object") global.db.data.settings[this.user.jid] = {}
      if (settings) {
        if (!("self" in settings)) settings.self = false
        if (!("restrict" in settings)) settings.restrict = false
        if (!("jadibotmd" in settings)) settings.jadibotmd = true
        if (!("autobio" in settings)) settings.autobio = false
        if (!("antiPrivate" in settings)) settings.antiPrivate = false
        if (!("autoread" in settings)) settings.autoread = false
        if (!("autoread2" in settings)) settings.autoread2 = false
        if (!("antiSpam" in settings)) settings.antiSpam = false
      } else
        global.db.data.settings[this.user.jid] = {
          self: false,
          restrict: false,
          jadibotmd: true,
          autobio: false,
          antiPrivate: false,
          autoread: false,
          autoread2: false,
          antiSpam: true,
          status: 0,
        }
    } catch (e) {
      console.error(e)
    }
    if (opts["nyimak"]) return
    if (!m.fromMe && opts["self"]) return
    if (opts["swonly"] && m.chat !== "status@broadcast") return
    if (typeof m.text !== "string") m.text = ""

    const _user = global.db.data && global.db.data.users && global.db.data.users[m.sender]

    const isROwner = [conn.decodeJid(global.conn.user.id), ...global.owner.map(([number]) => number)]
      .map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net")
      .includes(m.sender)
    const isOwner = isROwner || m.fromMe
    const isMods = isOwner || global.mods.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender)
    const isPrems =
      isROwner ||
      global.prems.map((v) => v.replace(/[^0-9]/g, "") + "@s.whatsapp.net").includes(m.sender) ||
      _user.prem == true

    if (opts["queque"] && m.text && !(isMods || isPrems)) {
      const queque = this.msgqueque,
        time = 1000 * 5
      const previousID = queque[queque.length - 1]
      queque.push(m.id || m.key.id)
      setInterval(async function () {
        if (queque.indexOf(previousID) === -1) clearInterval(this)
        await delay(time)
      }, time)
    }

    //if (m.isBaileys) return
    if (m.isBaileys || (isBaileysFail && m?.sender === this?.this?.user?.jid)) {
      return
    }
    m.exp += Math.ceil(Math.random() * 10)

    let usedPrefix

    const groupMetadata =
      (m.isGroup ? (conn.chats[m.chat] || {}).metadata || (await this.groupMetadata(m.chat).catch((_) => null)) : {}) ||
      {}
    const participants = (m.isGroup ? groupMetadata.participants : []) || []
    const user = (m.isGroup ? participants.find((u) => conn.decodeJid(u.id) === m.sender) : {}) || {}
    const bot = (m.isGroup ? participants.find((u) => conn.decodeJid(u.id) == this.user.jid) : {}) || {}
    const isRAdmin = user?.admin == "superadmin" || false
    const isAdmin = isRAdmin || user?.admin == "admin" || false
    const isBotAdmin = bot?.admin || false

    const ___dirname = path.join(path.dirname(fileURLToPath(import.meta.url)), "./plugins")
    for (const name in global.plugins) {
      const plugin = global.plugins[name]
      if (!plugin) continue
      if (plugin.disabled) continue
      const __filename = join(___dirname, name)
      if (typeof plugin.all === "function") {
        try {
          await plugin.all.call(this, m, {
            chatUpdate,
            __dirname: ___dirname,
            __filename,
          })
        } catch (e) {
          console.error(e)
        }
      }
      if (!opts["restrict"])
        if (plugin.tags && plugin.tags.includes("admin")) {
          continue
        }
      const str2Regex = (str) => str.replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
      const _prefix = plugin.customPrefix ? plugin.customPrefix : conn.prefix ? conn.prefix : global.prefix
      const match = (
        _prefix instanceof RegExp
          ? [[_prefix.exec(m.text), _prefix]]
          : Array.isArray(_prefix)
            ? _prefix.map((p) => {
                const re = p instanceof RegExp ? p : new RegExp(str2Regex(p))
                return [re.exec(m.text), re]
              })
            : typeof _prefix === "string"
              ? [[new RegExp(str2Regex(_prefix)).exec(m.text), new RegExp(str2Regex(_prefix))]]
              : [[[], new RegExp()]]
      ).find((p) => p[1])
      if (typeof plugin.before === "function") {
        if (
          await plugin.before.call(this, m, {
            match,
            conn: this,
            participants,
            groupMetadata,
            user,
            bot,
            isROwner,
            isOwner,
            isRAdmin,
            isAdmin,
            isBotAdmin,
            isPrems,
            chatUpdate,
            __dirname: ___dirname,
            __filename,
          })
        )
          continue
      }
      if (typeof plugin !== "function") continue
      if ((usedPrefix = (match[0] || "")[0])) {
        const noPrefix = m.text.replace(usedPrefix, "")
        let [command, ...args] = noPrefix.trim().split` `.filter((v) => v)
        args = args || []
        const _args = noPrefix.trim().split` `.slice(1)
        const text = _args.join` `
        command = (command || "").toLowerCase()
        const fail = plugin.fail || global.dfail
        const isAccept =
          plugin.command instanceof RegExp
            ? plugin.command.test(command)
            : Array.isArray(plugin.command)
              ? plugin.command.some((cmd) => (cmd instanceof RegExp ? cmd.test(command) : cmd === command))
              : typeof plugin.command === "string"
                ? plugin.command === command
                : false

        if (!isAccept) {
          continue
        }
        m.plugin = name
        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
          const chat = global.db.data.chats[m.chat]
          const user = global.db.data.users[m.sender]
          if (!["owner-unbanchat.js"].includes(name) && chat && chat.isBanned && !isROwner) return // Except this
          if (
            name != "owner-unbanchat.js" &&
            name != "owner-exec.js" &&
            name != "owner-exec2.js" &&
            name != "tool-delete.js" &&
            chat?.isBanned &&
            !isROwner
          )
            return
          if (m.text && user.banned && !isROwner) {
            if (user.antispam > 2) return
            m.reply(`╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🚫 *Usuario Baneado* 🚫
┊ No puedes usar comandos
┊ 
${user.bannedReason ? `┊ *Motivo:* ${user.bannedReason}` : "┊ *Motivo:* Sin especificar"}
┊ 
┊ Si crees que es un error,
┊ contacta a la propietaria:
┊ wa.me/5219361112570
╰────────────────────────╯`)
            user.antispam++
            return
          }

          //Antispam 2
          if (user.antispam2 && isROwner) return
          const time = global.db.data.users[m.sender].spam + 3000
          if (new Date() - global.db.data.users[m.sender].spam < 3000) return console.log(`[ SPAM ]`)
          global.db.data.users[m.sender].spam = new Date() * 1
        }
        if (m.chat in global.db.data.chats || m.sender in global.db.data.users) {
          const chat = global.db.data.chats[m.chat]
          const user = global.db.data.users[m.sender]
          const setting = global.db.data.settings[this.user.jid]
          if (name != "group-unbanchat.js" && chat?.isBanned) return
          if (name != "owner-unbanuser.js" && user?.banned) return
          if (name != "owner-unbanbot.js" && setting?.banned) return
        }
        const hl = _prefix
        const adminMode = global.db.data.chats[m.chat].modoadmin
        const mini = `${plugins.botAdmin || plugins.admin || plugins.group || plugins || noPrefix || hl || m.text.slice(0, 1) == hl || plugins.command}`
        if (adminMode && !isOwner && !isROwner && m.isGroup && !isAdmin && mini) return
        if (plugin.rowner && plugin.owner && !(isROwner || isOwner)) {
          fail("owner", m, this)
          continue
        }
        if (plugin.rowner && !isROwner) {
          fail("rowner", m, this)
          continue
        }
        if (plugin.owner && !isOwner) {
          fail("owner", m, this)
          continue
        }
        if (plugin.mods && !isMods) {
          fail("mods", m, this)
          continue
        }
        if (plugin.premium && !isPrems) {
          fail("premium", m, this)
          continue
        }
        if (plugin.group && !m.isGroup) {
          fail("group", m, this)
          continue
        } else if (plugin.botAdmin && !isBotAdmin) {
          fail("botAdmin", m, this)
          continue
        } else if (plugin.admin && !isAdmin) {
          fail("admin", m, this)
          continue
        }
        if (plugin.private && m.isGroup) {
          fail("private", m, this)
          continue
        }
        if (plugin.register == true && _user.registered == false) {
          fail("unreg", m, this)
          continue
        }
        m.isCommand = true
        const xp = "exp" in plugin ? Number.parseInt(plugin.exp) : 17
        if (xp > 200) m.reply("chirrido -_-")
        else m.exp += xp
        if (!isPrems && plugin.cookies && global.db.data.users[m.sender].cookies < plugin.cookies * 1) {
          conn.reply(
            m.chat,
            `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🍪 *Cookies Agotadas* 🍪
┊ Se han agotado tus cookies
┊ Vuelve más tarde
╰────────────────────────╯`,
            m,
            fake,
          )
          continue
        }
        const extra = {
          match,
          usedPrefix,
          noPrefix,
          _args,
          args,
          command,
          text,
          conn: this,
          participants,
          groupMetadata,
          user,
          bot,
          isROwner,
          isOwner,
          isRAdmin,
          isAdmin,
          isBotAdmin,
          isPrems,
          chatUpdate,
          __dirname: ___dirname,
          __filename,
        }
        try {
          await plugin.call(this, m, extra)
          if (!isPrems) m.cookies = m.cookies || plugin.cookies || false
        } catch (e) {
          m.error = e
          console.error(e)
          if (e) {
            let text = format(e)
            for (const key of Object.values(global.APIKeys)) text = text.replace(new RegExp(key, "g"), "Administrador")
            m.reply(text)
          }
        } finally {
          if (typeof plugin.after === "function") {
            try {
              await plugin.after.call(this, m, extra)
            } catch (e) {
              console.error(e)
            }
          }
          if (m.cookies)
            conn.reply(
              m.chat,
              `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🍪 *Cookies Utilizadas* 🍪
┊ Utilizaste *${+m.cookies}* cookies
╰────────────────────────╯`,
              m,
              fake,
            )
        }
        break
      }
    }
  } catch (e) {
    console.error(e)
  } finally {
    if (opts["queque"] && m.text) {
      const quequeIndex = this.msgqueque.indexOf(m.id || m.key.id)
      if (quequeIndex !== -1) this.msgqueque.splice(quequeIndex, 1)
    }
    let user,
      stats = global.db.data.stats
    if (m) {
      const utente = global.db.data.users[m.sender]
      if (utente.muto == true) {
        const bang = m.key.id
        const cancellazzione = m.key.participant
        await conn.sendMessage(m.chat, {
          delete: { remoteJid: m.chat, fromMe: false, id: bang, participant: cancellazzione },
        })
      }
      if (m.sender && (user = global.db.data.users[m.sender])) {
        user.exp += m.exp
        user.cookies -= m.cookies * 1
      }

      let stat
      if (m.plugin) {
        const now = +new Date()
        if (m.plugin in stats) {
          stat = stats[m.plugin]
          if (!isNumber(stat.total)) stat.total = 1
          if (!isNumber(stat.success)) stat.success = m.error != null ? 0 : 1
          if (!isNumber(stat.last)) stat.last = now
          if (!isNumber(stat.lastSuccess)) stat.lastSuccess = m.error != null ? 0 : now
        } else
          stat = stats[m.plugin] = {
            total: 1,
            success: m.error != null ? 0 : 1,
            last: now,
            lastSuccess: m.error != null ? 0 : now,
          }
        stat.total += 1
        stat.last = now
        if (m.error == null) {
          stat.success += 1
          stat.lastSuccess = now
        }
      }
    }

    try {
      if (!opts["noprint"]) await (await import(`./lib/print.js`)).default(m, this)
    } catch (e) {
      console.log(m, m.quoted, e)
    }
    const settingsREAD = global.db.data.settings[this.user.jid] || {}
    if (opts["autoread"]) await this.readMessages([m.key])
    if (settingsREAD.autoread2) await this.readMessages([m.key])
    // if (settingsREAD.autoread2 == 'true') await this.readMessages([m.key])
    // await conn.sendPresenceUpdate('composing', m.chat)
    // this.sendPresenceUpdate('recording', m.chat)

    if (
      db.data.chats[m.chat].reaction &&
      m.text.match(/(ción|dad|aje|oso|izar|mente|pero|tion|age|ous|ate|and|but|ify|bot|elina|a|s)/gi)
    ) {
      const emot = pickRandom([
        "🌸",
        "💖",
        "✨",
        "💕",
        "🌹",
        "🌟",
        "💫",
        "🦋",
        "🌷",
        "🌻",
        "🍓",
        "🎀",
        "🪷",
        "🩷",
        "💝",
        "💘",
        "💞",
        "💗",
        "💓",
        "💌",
        "🫶",
        "💐",
        "🌺",
        "🥰",
        "😊",
        "😘",
        "💅",
        "👑",
        "🌈",
        "✅",
        "🎉",
        "🎊",
        "🏆",
        "🏵️",
        "🌱",
        "🌿",
        "🍃",
        "🍂",
        "🍁",
        "🌼",
        "🌸",
        "🌞",
        "🌙",
        "⭐",
        "✨",
        "⚡",
        "🔥",
        "💧",
        "❄️",
        "🌊",
        "🌬️",
        "🌪️",
        "🌀",
        "🌁",
        "🌂",
        "☂️",
        "☔",
        "⛱️",
        "⚡",
        "❄️",
        "☃️",
        "⛄",
        "🔥",
        "💥",
        "✨",
        "🎇",
        "🎆",
        "🎈",
        "🎉",
        "🎊",
        "🎃",
        "🎄",
        "🎋",
        "🎍",
        "🎎",
        "🎏",
        "🎐",
        "🎑",
        "🎀",
        "🎁",
        "🎗️",
        "🎟️",
        "🎫",
        "🎖️",
        "🏆",
        "🏅",
        "🥇",
        "🥈",
        "🥉",
        "⚽",
        "⚾",
        "🏀",
        "🏐",
        "🏈",
        "🏉",
        "🎾",
        "🎱",
        "🎳",
        "🏏",
        "🏑",
        "🏒",
        "🥌",
        "⛳",
        "🎯",
        "🎽",
        "🎿",
        "🛷",
        "🥅",
        "🛹",
        "🛼",
        "🛶",
        "🎮",
        "♟️",
        "🎲",
        "🎭",
        "🎨",
        "🎼",
        "🎤",
        "🎧",
        "🎷",
        "🎸",
        "🎹",
        "🎺",
        "🎻",
        "🥁",
        "📯",
        "🎬",
        "🏹",
      ])
      if (!m.fromMe) return this.sendMessage(m.chat, { react: { text: emot, key: m.key } })
    }
    function pickRandom(list) {
      return list[Math.floor(Math.random() * list.length)]
    }
  }
}

export async function deleteUpdate(message) {
  try {
    const { fromMe, id, participant } = message
    if (fromMe) return
    const msg = this.serializeM(this.loadMessage(id))
    const chat = global.db.data.chats[msg?.chat] || {}
    if (!chat?.delete) return
    if (!msg) return
    if (!msg?.isGroup) return
    const antideleteMessage = `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ ⚠️ *ANTI DELETE* ⚠️
┊ 
┊ 👤 *Usuario:* @${participant.split`@`[0]}
┊ 
┊ 📝 *Mensaje eliminado detectado*
┊ Reenviando mensaje...
╰────────────────────────╯`.trim()
    await this.sendMessage(msg.chat, { text: antideleteMessage, mentions: [participant] }, { quoted: msg })
    this.copyNForward(msg.chat, msg).catch((e) => console.log(e, msg))
  } catch (e) {
    console.error(e)
  }
}

global.dfail = (type, m, conn) => {
  const msg = {
    rowner: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🌸 *Comando Exclusivo* 🌸
┊ Este comando solo puede ser 
┊ utilizado por la creadora del bot
╰────────────────────────╯`,
    owner: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🌸 *Comando Exclusivo* 🌸
┊ Este comando solo puede ser 
┊ utilizado por la propietaria
╰────────────────────────╯`,
    mods: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🌸 *Comando Exclusivo* 🌸
┊ Este comando solo puede ser 
┊ utilizado por moderadores
╰────────────────────────╯`,
    premium: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 💎 *Premium Requerido* 💎
┊ Este comando es exclusivo para
┊ usuarios premium
╰────────────────────────╯`,
    group: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 👥 *Comando de Grupo* 👥
┊ Este comando solo puede ser
┊ utilizado en grupos
╰────────────────────────╯`,
    private: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 💌 *Chat Privado* 💌
┊ Este comando solo puede ser
┊ utilizado en mi chat privado
╰────────────────────────╯`,
    admin: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 👑 *Administrador* 👑
┊ Este comando solo puede ser
┊ utilizado por administradores
╰────────────────────────╯`,
    botAdmin: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 🤖 *Bot Admin* 🤖
┊ Necesito ser administradora
┊ para ejecutar este comando
╰────────────────────────╯`,
    unreg: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ 📝 *Registro Requerido* 📝
┊ 
┊ Para usar este comando debes
┊ estar registrado
┊ 
┊ Usa: */reg nombre.edad*
┊ Ejemplo: /reg Elina.21
╰────────────────────────╯`,
    restrict: `╭─────❀ *𝐄𝐋𝐈𝐍𝐀 𝐁𝐎𝐓* ❀─────╮
┊ ⚠️ *Función Deshabilitada* ⚠️
┊ Esta característica está
┊ deshabilitada
╰────────────────────────╯`,
  }[type]
  if (msg) return conn.reply(m.chat, msg, m).then((_) => m.react("✨"))
}

const file = global.__filename(import.meta.url, true)
watchFile(file, async () => {
  unwatchFile(file)
  console.log(chalk.magenta("Se actualizo 'handler.js'"))
  if (global.reloadHandler) console.log(await global.reloadHandler())
})