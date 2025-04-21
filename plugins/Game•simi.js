import translate from '@vitalets/google-translate-api';
import axios from 'axios';
import fetch from 'node-fetch';

const handler = async (m, {conn, text, command, args, usedPrefix}) => {
  if (!text) conn.reply(m.chat, '⭐ Te faltó el texto para hablar con la Bot', m, fake);
  
  try {
    const resSimi = await simitalk(text);
    conn.sendMessage(m.chat, { text: resSimi.resultado.simsimi }, { quoted: m });
  } catch {
    return conn.reply(m.chat, '❌ Ocurrió un error', m, fake);
  }
};

handler.help = ['simi', 'bot'];
handler.tags = ['fun'];
handler.register = true;
handler.command = ['simi', 'bot', 'alexa', 'elina', 'mini', 'ai'];
export default handler;

async function simitalk(ask, apikeyyy = "iJ6FxuA9vxlvz5cKQCt3", language = "es") {
  if (!ask) return { status: false, resultado: { msg: "Debes ingresar un texto para hablar con simsimi." }};
  
  try {
    const response2 = await axios.get(`https://anbusec.xyz/api/v1/simitalk?apikey=${apikeyyy}&ask=${ask}&lc=${language}`);
    return { status: true, resultado: { simsimi: response2.data.message }};       
  } catch (error2) {
    return { status: false, resultado: { msg: "La API falló. Inténtalo de nuevo más tarde.", error: error2.message }};
  }
}
