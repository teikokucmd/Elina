process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './settings.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, watch } from 'fs';
import yargs from 'yargs';
import { spawn } from 'child_process';
import lodash from 'lodash';
import chalk from 'chalk';
import syntaxerror from 'syntax-error';
import { tmpdir } from 'os';
import { format } from 'util';
import boxen from 'boxen';
import pino from 'pino';
import { Boom } from '@hapi/boom';
import { makeWASocket, protoType, serialize } from './lib/simple.js';
import { Low, JSONFile } from 'lowdb';
import readline from 'readline'; // Importación faltante que causaba el error
import qrcode from 'qrcode-terminal';

// 2. Configuración de constantes
const { proto } = (await import('@whiskeysockets/baileys')).default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  PHONENUMBER_MCC
} = await import('@whiskeysockets/baileys');

const nameqr = 'ElinaBot';
const sessions = 'sessions';
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

// 3. Inicialización
protoType();
serialize();

// 4. Configuración global mejorada
global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};

// 5. Función para crear interfaz readline
function createRLInterface() {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
}

// 6. Conexión mejorada con manejo de errores
async function createConnection() {
  try {
    const { state, saveCreds } = await useMultiFileAuthState(sessions);
    const { version } = await fetchLatestBaileysVersion();
    
    return {
      conn: makeWASocket({
        logger: pino({ level: 'silent' }),
        browser: [nameqr, 'Chrome', '110.0.1587.56'],
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
        },
        version
      }),
      saveCreds
    };
  } catch (error) {
    console.error(chalk.bold.red('Error al crear conexión:'), error);
    throw error;
  }
}

// 7. Autenticación con QR mejorada
async function authWithQR() {
  try {
    const { conn, saveCreds } = await createConnection();
    
    conn.ev.on('connection.update', (update) => {
      const { qr } = update;
      if (qr) {
        console.log(chalk.bold.yellow('\n✅ Escanea este código QR con tu WhatsApp:'));
        qrcode.generate(qr, { small: true });
      }
    });

    conn.ev.on('creds.update', saveCreds);
    return conn;
  } catch (error) {
    console.error(chalk.bold.red('Error en autenticación QR:'), error);
    throw error;
  }
}

// 8. Generación de código de emparejamiento robusta
async function generatePairingCode() {
  const rl = createRLInterface();
  const question = (text) => new Promise((resolve) => rl.question(text, resolve));

  try {
    let phoneNumber;
    do {
      phoneNumber = await question(chalk.bold.green('\nIngrese el número con código de país (ej: 5219361112570): '));
      phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

      if (!PHONENUMBER_MCC || !Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
        console.log(chalk.bold.red('⚠️ Código de país no válido. Ejemplos válidos: 521, 519, etc.'));
      }
    } while (!PHONENUMBER_MCC || !Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v)));

    const { conn } = await createConnection();
    const code = await conn.requestPairingCode(phoneNumber);
    const formattedCode = code.match(/.{1,4}/g).join('-');
    
    console.log(chalk.bold.magenta('\n🔄 Código de emparejamiento:'), chalk.bold.white(formattedCode));
    console.log(chalk.bold.cyan('Ingresa este código en tu WhatsApp dentro de 3 minutos'));
    
    rl.close();
    return formattedCode;
  } catch (error) {
    rl.close();
    console.error(chalk.bold.red('Error al generar código:'), error);
    throw error;
  }
}

// 9. Menú principal mejorado
async function showMainMenu() {
  const rl = createRLInterface();
  const question = (text) => new Promise((resolve) => rl.question(text, resolve));

  try {
    console.log(chalk.bold.magenta('\n✨ MÉTODOS DE CONEXIÓN ✨'));
    console.log(chalk.bold.cyan('1. Código QR (recomendado)'));
    console.log(chalk.bold.cyan('2. Código de 8 dígitos'));

    let option;
    do {
      option = await question(chalk.bold.green('\nSeleccione (1/2): '));
      if (!['1', '2'].includes(option)) {
        console.log(chalk.bold.red('Opción inválida. Solo 1 o 2.'));
      }
    } while (!['1', '2'].includes(option));

    return option;
  } finally {
    rl.close();
  }
}

// 10. Función principal con manejo de errores
async function main() {
  try {
    console.log(chalk.bold.magenta('\n🌟 INICIANDO ELINA BOT v2.0.7 🌟'));
    
    if (existsSync(join(sessions, 'creds.json'))) {
      console.log(chalk.bold.green('Sesión existente encontrada. Conectando...'));
      await authWithQR();
      return;
    }

    const option = await showMainMenu();
    
    if (option === '1') {
      console.log(chalk.bold.yellow('\nPreparando autenticación por QR...'));
      await authWithQR();
    } else {
      console.log(chalk.bold.cyan('\nPreparando código de emparejamiento...'));
      await generatePairingCode();
    }

    console.log(chalk.bold.green('\n✅ Bot listo para recibir comandos'));
  } catch (error) {
    console.error(chalk.bold.red('\n❌ Error crítico:'), error);
    process.exit(1);
  }
}

// 11. Manejo de procesos
process.on('uncaughtException', (err) => {
  console.error(chalk.bold.red('Error no controlado:'), err);
});

process.on('exit', (code) => {
  if (code === 0) {
    console.log(chalk.bold.green('\n🛑 Bot detenido correctamente'));
  } else {
    console.log(chalk.bold.red(`\n🛑 Bot detenido con código ${code}`));
  }
});

// Iniciar la aplicación
main();
