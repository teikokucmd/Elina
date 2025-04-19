import { join, dirname } from "path"
import { createRequire } from "module"
import { fileURLToPath } from "url"
import boxen from 'boxen'
import { setupMaster, fork } from "cluster"
import { watchFile, unwatchFile } from "fs"
import cfonts from "cfonts"
import { createInterface } from "readline"
import yargs from "yargs"
import chalk from "chalk"
import gradient from "gradient-string"

// ======================
// CONFIGURACIÓN DE COLORES
// ======================
const primaryColor = "#9B59B6"  
const secondaryColor = "#8E44AD" 
const accentColor = "#E74C3C"   
const textColor = "#FFFFFF"     
const bgColor = "#2C3E50"       

// Configuración de gradiente morado
const purpleGradient = gradient([primaryColor, secondaryColor])

console.log(purpleGradient("\n✨ Iniciando Elina Bot ✨"))

// Configuración de rutas
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, description, version } = require(join(__dirname, "./package.json"))
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)

// ======================
// DISEÑO DE INTERFAZ
// ======================
cfonts.say("ELINA\nBOT", {
  font: "block",
  align: "center",
  colors: [primaryColor, secondaryColor],
  background: "transparent",
  letterSpacing: 2,
  lineHeight: 1.5,
  space: true,
  gradient: [primaryColor, secondaryColor],
  independentGradient: false,
  transitionGradient: true,
})


cfonts.say(description, {
  font: "console",
  align: "center",
  colors: [textColor],
  background: bgColor,
  letterSpacing: 1,
  lineHeight: 1.2,
  space: true
})


const infoMessage = `${chalk.hex(textColor).bold("✨ Creado por »")} ${chalk.hex(primaryColor).bold("Elina Team")}
${chalk.hex(textColor).bold("📞 Contacto »")} ${chalk.hex(secondaryColor).bold("wa.me/5219361112570")}
${chalk.hex(textColor).bold("🔄 Versión »")} ${chalk.hex(primaryColor).bold(version)}
${chalk.hex(textColor).bold("💜 El bot más avanzado de WhatsApp")}`

console.log(
  boxen(infoMessage, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: primaryColor,
    backgroundColor: bgColor,
    float: "center",
    title: "ELINA BOT",
    titleAlignment: "center",
    textAlignment: "center"
  })
)


let isRunning = false

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
    console.error(
      boxen(chalk.hex(accentColor).bold("⚠️ Error en el proceso hijo"), {
        padding: 1,
        borderColor: accentColor,
        borderStyle: "round"
      })
    )
    
    if (code === 0) return
    
    watchFile(args[0], () => {
      unwatchFile(args[0])
      start(file)
    })
  })

  const opts = new Object(yargs(process.argv.slice(2)).exitProcess(false).parse())
  
  if (!opts["test"] && !rl.listenerCount()) {
    rl.on("line", (line) => {
      p.emit("message", line.trim())
    })
  }
}

process.on("warning", (warning) => {
  if (warning.name === "MaxListenersExceededWarning") {
    console.log(
      boxen(chalk.hex(accentColor).bold("⚠️ Advertencia de límite de listeners"), {
        padding: 1,
        borderColor: accentColor
      })
    )
    console.warn(warning.stack)
  }
})


console.log(
  boxen(chalk.hex(primaryColor).bold("🌸 Iniciando Elina Bot, por favor espere..."), {
    padding: 1,
    margin: 1,
    borderColor: secondaryColor,
    borderStyle: "round",
    textAlignment: "center"
  }
)


start("elina.js")
