process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '1';
import './settings.js';
import { createRequire } from 'module';
import path, { join } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { platform } from 'process';
import * as ws from 'ws';
import { readdirSync, statSync, unlinkSync, existsSync, readFileSync, rmSync, watch } from 'fs';
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
import { mongoDB, mongoDBV2 } from './lib/mongoDB.js';
import store from './lib/store.js';
import qrcode from 'qrcode-terminal';


const { proto } = (await import('@whiskeysockets/baileys')).default;
const {
  DisconnectReason,
  useMultiFileAuthState,
  MessageRetryMap,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  jidNormalizedUser,
  PHONENUMBER_MCC
} = await import('@whiskeysockets/baileys');

const nameqr = 'ElinaBot';
const sessions = 'sessions';
const jadi = 'jadibot';
const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;


protoType();
serialize();


global.__filename = function filename(pathURL = import.meta.url, rmPrefix = platform !== 'win32') {
  return rmPrefix ? /file:\/\/\//.test(pathURL) ? fileURLToPath(pathURL) : pathURL : pathToFileURL(pathURL).toString();
};

global.__dirname = function dirname(pathURL) {
  return path.dirname(global.__filename(pathURL, true));
};

global.__require = function require(dir = import.meta.url) {
  return createRequire(dir);
};


async function initializeConnection() {
  const { state, saveState, saveCreds } = await useMultiFileAuthState(sessions);
  const { version } = await fetchLatestBaileysVersion();
  
  const connectionOptions = {
    logger: pino({ level: 'silent' }),
    browser: [nameqr, 'Chrome', '110.0.1587.56'],
    auth: {
      creds: state.creds,
      keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
    },
    markOnlineOnConnect: true,
    getMessage: async (clave) => {
      let jid = jidNormalizedUser(clave.remoteJid);
      let msg = await store.loadMessage(jid, clave.id);
      return msg?.message || "";
    },
    version: [2, 3000, 1015901307],
  };

  return { 
    conn: makeWASocket(connectionOptions),
    state,
    saveState,
    saveCreds
  };
}

// 6. Manejo de autenticación
async function handleAuthentication() {
  const { conn, saveCreds } = await initializeConnection();
  
  
  conn.ev.on('connection.update', async (update) => {
    const { connection, qr } = update;
    
    
    if (qr) {
      console.log(chalk.bold.yellow('\n✅ Escanea este código QR con tu WhatsApp:'));
      qrcode.generate(qr, { small: true });
    }
    
    
    if (connection === 'open') {
      console.log(boxen(chalk.bold(' ¡CONECTADO CON WHATSAPP! '), { 
        borderStyle: 'round', 
        borderColor: 'green', 
        padding: 1,
        margin: 1
      }));
    }
  });

  
  conn.ev.on('creds.update', saveCreds);

  return conn;
}

async function generatePairingCode(phoneNumber) {
  const { conn } = await initializeConnection();
  
  try {
    const code = await conn.requestPairingCode(phoneNumber);
    const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
    
    console.log(chalk.bold.white(chalk.bgMagenta(` Código de emparejamiento: `)), 
                chalk.bold.white(chalk.white(formattedCode)));
    
    return formattedCode;
  } catch (error) {
    console.error(chalk.bold.red('Error al generar código de emparejamiento:'), error);
    return null;
  }
}


async function showMainMenu() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (text) => new Promise((resolve) => rl.question(text, resolve));

  console.log(chalk.bold.magenta('\n✨ MENÚ PRINCIPAL ✨'));
  console.log(chalk.bold.cyan('1. Conectar con código QR'));
  console.log(chalk.bold.cyan('2. Conectar con código de 8 dígitos'));
  
  let option;
  do {
    option = await question(chalk.bold.green('\nSeleccione una opción (1/2): '));
    
    if (!['1', '2'].includes(option)) {
      console.log(chalk.bold.red('Opción inválida. Por favor ingrese 1 o 2.'));
    }
  } while (!['1', '2'].includes(option));

  rl.close();

  return option;
}


async function requestPhoneNumber() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (text) => new Promise((resolve) => rl.question(text, resolve));

  let phoneNumber;
  do {
    phoneNumber = await question(chalk.bold.green('\nIngrese el número a vincular (ejemplo: 5219361112570): '));
    phoneNumber = phoneNumber.replace(/[^0-9]/g, '');

    if (!phoneNumber.match(/^\d+$/) || !Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v))) {
      console.log(chalk.bold.red('Número inválido. Debe comenzar con un código de país válido (ej: 521, 519, etc.)'));
    }
  } while (!phoneNumber.match(/^\d+$/) || !Object.keys(PHONENUMBER_MCC).some(v => phoneNumber.startsWith(v)));

  rl.close();
  return phoneNumber;
}


async function main() {
  console.log(chalk.bold.magenta('\n✨ INICIANDO ELINA BOT ✨'));

  if (existsSync(`./${sessions}/creds.json`)) {
    console.log(chalk.bold.cyan('Sesión existente encontrada. Conectando...'));
    await handleAuthentication();
    return;
  }

  
  const option = await showMainMenu();

  if (option === '1') {
    
    console.log(chalk.bold.yellow('\nPreparando código QR...'));
    await handleAuthentication();
  } else {
    
    console.log(chalk.bold.cyan('\nModo código de texto seleccionado'));
    const phoneNumber = await requestPhoneNumber();
    await generatePairingCode(phoneNumber);
  }
}


process.on('uncaughtException', (err) => {
  console.error(chalk.bold.red('Error no controlado:'), err);
});

main().catch((err) => {
  console.error(chalk.bold.red('Error al iniciar el bot:'), err);
  process.exit(1);
});
