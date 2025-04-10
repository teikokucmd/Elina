import chalk from "chalk";
import { watchFile } from "fs";

const terminalImage = global.opts["img"] ? require("terminal-image") : "";
const urlRegex = (await import("url-regex-safe")).default({ strict: false });

const botname = "✿ 𝐄𝐥𝐢𝐧𝐚 𝐁𝐨𝐭 ✿";
const remDecor = {
  heart: chalk.magentaBright("💖"),
  flower1: chalk.magentaBright("🌸"),
  flower2: chalk.yellowBright("🌷"),
  star: chalk.yellowBright("✨"),
  crown: chalk.yellowBright("👑"),
  sparkle: chalk.cyanBright("💫"),
  title: chalk.magenta.bold(botname),
  line: chalk.magentaBright("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"),
  time: () => chalk.cyanBright(new Date().toLocaleTimeString()),
};

const log = (text, error = false) =>
  console.log(
    `\n${remDecor.line}`,
    `\n╭─${remDecor.flower1}⋆｡˚ ${remDecor.title} ˚｡⋆${remDecor.flower2}─`,
    `\n┊ ${remDecor.time()}`,
    `\n┊ ${chalk[error ? "redBright" : "magentaBright"]("❀ " + (error ? "Error" : "Información") + " ❀")}`,
    `\n┊ ${chalk[error ? "redBright" : "cyanBright"](text)}`,
    `\n┊ ${remDecor.heart} ${remDecor.star} ${remDecor.sparkle}`,
    `\n╰─${remDecor.flower2}⋆｡˚ ${remDecor.crown} ˚｡⋆${remDecor.flower1}─`,
    `\n${remDecor.line}\n`,
  );

export default async function (m, conn = { user: {} }) {
  let senderName = await conn.getName(m.sender);

  let chatName = "";
  if (m.chat && m.chat !== m.sender) {
    if (!m.chat.endsWith("@g.us")) {
      chatName = "Chat Privado";
    } else {
      chatName = await conn.getName(m.chat);
      chatName = chatName ? `${chatName} ` : "";
    }
  } else {
    chatName = "Chat Privado";
  }

  if (m.isCommand) {
    let commandText = m.text.split(" ")[0];
    const cmdtxt = chalk.magentaBright("✧ Comando");
    const cmd = chalk.yellowBright(`${commandText}`);
    const from = chalk.magentaBright("de");
    const username = chalk.cyanBright(`${senderName}`);
    const ins = chalk.magentaBright("en");
    const grp = chalk.yellowBright(chatName);
    log(
      `\n┊ ${remDecor.flower1} ${cmdtxt} ${cmd} ${from} ${username} ${ins} ${grp} ${remDecor.flower2}`,
    );
  } else {
    const msg = chalk.magentaBright("✧ Mensaje");
    const from = chalk.magentaBright("de");
    const username = chalk.cyanBright(`${senderName}`);
    const ins = chalk.magentaBright("en");
    const grp = chalk.yellowBright(chatName);
    log(
      `\n┊ ${remDecor.flower1} ${msg} ${from} ${username} ${ins} ${grp} ${remDecor.flower2}`,
    );
  }
}

let file = global.__filename(import.meta.url);
watchFile(file, () => {
  log(chalk.magentaBright("✨ Actualización en 'lib/print.js' ✨"), false);
});
