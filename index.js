import { join, dirname } from "path"
import { createRequire } from "module"
import { fileURLToPath } from "url"
import { setupMaster, fork } from "cluster"
import { watchFile, unwatchFile } from "fs"
import cfonts from "cfonts"
import { createInterface } from "readline"
import yargs from "yargs"
import chalk from "chalk"

// Intentamos importar boxen, pero si falla, usamos una alternativa
let boxen
try {
  boxen = (await import("boxen")).default
} catch (e) {
  console.log("\n⚠️ El módulo boxen no está instalado. Usando alternativa...")
  // Función alternativa simple para crear cajas si boxen no está disponible
  boxen = (text, options = {}) => {
    const lines = text.split("\n")
    const width = Math.max(...lines.map((line) => line.length))
    const border = "═".repeat(width + 2)
    const result = [`╔${border}╗`, ...lines.map((line) => `║ ${line.padEnd(width)} ║`), `╚${border}╝`]
    return result.join("\n")
  }
}

console.log("\n💥 Iniciando Elina-Bot")
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)

// Intentamos cargar package.json, pero manejamos posibles errores
let name, description, collaborators, author, version
try {
  const packageJson = require(join(__dirname, "./package.json"))
  name = packageJson.name
  description = packageJson.description || "Elina Bot - WhatsApp Bot"
  collaborators = packageJson.collaborators || {}
  author = packageJson.author || "elina"
  version = packageJson.version || "1.0.0"
} catch (e) {
  console.log("⚠️ No se pudo cargar package.json, usando valores predeterminados")
  name = "Elina-Bot"
  description = "Elina Bot - WhatsApp Bot"
  collaborators = {}
  author = "elina"
  version = "1.0.0"
}

const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)
const subtitleStyle = chalk.white.bold
const responseStyle = chalk.dim.bold

let activeCollaborators = ""
for (const key in collaborators) {
  if (collaborators.hasOwnProperty(key)) {
    activeCollaborators += collaborators[key] + ", "
  }
}
activeCollaborators = activeCollaborators.slice(0, -2) || "N/A"

try {
  cfonts.say("Elina Bot", {
    align: "center",
    gradient: ["red", "blue"],
  })
  cfonts.say(description, {
    font: "console",
    align: "center",
    gradient: ["blue", "magenta"],
  })
} catch (e) {
  console.log("\n===== ELINA BOT =====")
  console.log(description)
  console.log("=====================\n")
}

const message = `${subtitleStyle("propietaria »")} ${responseStyle("elina")}
${subtitleStyle("Código basado por »")} ${responseStyle("Daniel")}
${subtitleStyle("desarrollado por »")} ${responseStyle("skyultraplus")}
${subtitleStyle("Versión »")} ${responseStyle(version)}`

console.log(
  boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "double",
    borderColor: "blue",
    float: "center",
  }),
)

var isRunning = false
function start(file) {
  if (isRunning) return
  isRunning = true
  const args = [join(__dirname, file), ...process.argv.slice(2)]

  setupMaster({
    exec: args[0],
    args: args.slice(1),
  })

  const p = fork()
  p.on("message", (data) => {
    switch (data) {
      case "reset":
        p.process.kill()
        isRunning = false
        start.apply(this, arguments)
        break
      case "uptime":
        p.send(process.uptime())
        break
    }
  })

  p.on("exit", (_, code) => {
    isRunning = false
    console.error("🚩 Error:\n", code)

    if (code === 0) return

    console.log("🔄 Reiniciando...")
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start(file)
    })
  })

  const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  if (!opts["test"])
    if (!rl.listenerCount())
      rl.on("line", (line) => {
        p.emit("message", line.trim())
      })
}

process.on("warning", (warning) => {
  if (warning.name === "MaxListenersExceededWarning") {
    console.warn("🚩 Se excedió el límite de Listeners en:")
    console.warn(warning.stack)
  }
})

// Manejo de errores no capturados
process.on("uncaughtException", (err) => {
  console.error("Error no capturado:", err)
  console.log("El bot continuará ejecutándose...")
})

// Iniciar el bot
try {
  start("elina.js")
} catch (e) {
  console.error("Error al iniciar el bot:", e)
  process.exit(1)
}
