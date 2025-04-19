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

console.log("\n✨ Iniciando Elina Bot ✨")
const __dirname = dirname(fileURLToPath(import.meta.url))
const require = createRequire(__dirname)
const { name, description, version } = require(join(__dirname, "./package.json"))
const { say } = cfonts
const rl = createInterface(process.stdin, process.stdout)


const pastelPink = "#FFB6C1"
const pastelPurple = "#CBC3E3"
const pastelBlue = "#A7C7E7"
const pastelGreen = "#77DD77"


const elegantGradient = gradient([pastelPink, pastelPurple, pastelBlue])


cfonts.say("Elina\nBot", {
  font: "block",
  align: "center",
  colors: ["#FF92A5", "#FF7EB9", "#FF65D4"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
  gradient: ["#FF92A5", "#FF65D4"],
  independentGradient: true,
  transitionGradient: true,
})


cfonts.say(description, {
  font: "console",
  align: "center",
  colors: ["#666", "#6666"],
  background: "transparent",
  letterSpacing: 1,
  lineHeight: 1,
  space: true,
  maxLength: "0",
  gradient: ["#666", "#6666"],
  independentGradient: true,
  transitionGradient: true,
})


const message = `${chalk.white.bold("✨ Creado con amor por »")} ${chalk.magenta.bold("Elina")}
${chalk.white.bold("💖 Contacto » 5219361112570")} ${chalk.magenta.bold("")}
${chalk.white.bold("🌟 Versión » 1.0.1")} ${chalk.magenta.bold()}
${chalk.white.bold("🌸 Gracias por usar Elina Bot »")} ${chalk.magenta.bold("")}`


console.log(
  boxen(message, {
    padding: 1,
    margin: 1,
    borderStyle: "round",
    borderColor: "#FF92A5",
    backgroundColor: "#FFF0F5",
    float: "center",
    title: "✨ Elina Bot ✨",
    titleAlignment: "center",
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
    console.error(elegantGradient("🌸 Ocurrió un error:\n"), code)
    process.exit()
    if (code === 0) return
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
    console.warn(elegantGradient("🌸 Se excedió el límite de Listeners en:"))
    console.warn(warning.stack)
  }
})


console.log(elegantGradient("🌸 Elina Bot está iniciando, por favor espere un momento..."))
start("elina.js")
