import { join, dirname } from 'path';
import { createRequire } from 'module';
import { fileURLToPath } from 'url';
import boxen from 'boxen';
import { setupMaster, fork } from 'cluster';
import { watchFile, unwatchFile } from 'fs';
import cfonts from 'cfonts';
import { createInterface } from 'readline';
import chalk from 'chalk';

// ======================
// CONFIGURACIÓN INICIAL
// ======================
const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { name, description, version } = require(join(__dirname, './package.json'));
const rl = createInterface({ input: process.stdin, output: process.stdout });

// ======================
// PALETA DE COLORES
// ======================
const colors = {
  primary: '#9B59B6',
  secondary: '#8E44AD',
  accent: '#E74C3C',
  text: '#FFFFFF',
  background: '#2C3E50'
};

function showBanner() {
  cfonts.say('ELINA BOT', {
    font: 'block',
    align: 'center',
    colors: [colors.primary, colors.secondary],
    background: 'transparent',
    letterSpacing: 1,
    lineHeight: 1.2
  });

  console.log(
    boxen(chalk.hex(colors.text)(description), {
      padding: 1,
      margin: 1,
      borderColor: colors.primary,
      backgroundColor: colors.background,
      borderStyle: 'round'
    })
  );

  console.log(
    boxen(
      `${chalk.hex(colors.text).bold('🔥 Versión:')} ${chalk.hex(colors.primary).bold(version)}\n` +
      `${chalk.hex(colors.text).bold('🌟 Creado por:')} ${chalk.hex(colors.secondary).bold('Skyultraplus')}\n` +
      `${chalk.hex(colors.text).bold('✅ Contacto:')} ${chalk.hex(colors.primary).bold('5219361112570')}`, {
        padding: 1,
        margin: 1,
        borderColor: colors.secondary,
        backgroundColor: colors.background,
        borderStyle: 'round',
        title: 'INFORMACIÓN',
        titleAlignment: 'center'
      }
    )
  );
}

let isRunning = false;

function start(file) {
  if (isRunning) return;

  isRunning = true;
  const args = [join(__dirname, file), ...process.argv.slice(2)];

  setupMaster({
    exec: args[0],
    args: args.slice(1)
  });

  const p = fork();

  p.on('message', (data) => {
    switch (data) {
      case 'reset':
        p.process.kill();
        isRunning = false;
        start(file);
        break;
      case 'uptime':
        p.send(process.uptime());
        break;
    }
  });

  p.on('exit', (_, code) => {
    isRunning = false;
    
    if (code !== 0) {
      console.error(
        boxen(chalk.hex(colors.accent).bold('⚠️ Error en el proceso hijo. Reiniciando...'), {
          padding: 1,
          borderColor: colors.accent
        })
      );
      watchFile(args[0], () => {
        unwatchFile(args[0]);
        start(file);
      });
    }
  });
}

process.on('uncaughtException', (err) => {
  console.error(
    boxen(chalk.hex(colors.accent).bold(`⚠️ Error no controlado:\n${err.stack}`), {
      padding: 1,
      borderColor: colors.accent
    })
  );
});

process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    console.log(
      boxen(chalk.hex(colors.accent).bold('⚠️ Advertencia de límite de listeners'), {
        padding: 1,
        borderColor: colors.accent
      })
    );
  }
});

try {
  showBanner();
  console.log(
    boxen(chalk.hex(colors.primary).bold('🚀 Iniciando Elina Bot...'), {
      padding: 1,
      borderColor: colors.primary
    })
  );
  
  start('elina.js');
} catch (error) {
  console.error(
    boxen(chalk.hex(colors.accent).bold(`❌ Error al iniciar:\n${error.message}`), {
      padding: 1,
      borderColor: colors.accent
    })
  );
  process.exit(1);
  }
