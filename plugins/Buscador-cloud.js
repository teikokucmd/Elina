import fetch from 'node-fetch';

let handler = async (m, { conn, command, args, text, usedPrefix }) => {
if (!text) return conn.reply(m.chat, '*Ingresa el texto de lo que quieres buscar en SoundCloud*', m);

try {
let api = await fetch(`https://apis-starlights-team.koyeb.app/starlight/soundcloud-search?text=${encodeURIComponent(text)}`);

let json = await api.json();
if (!Array.isArray(json) || json.length === 0) return conn.reply(m.chat, 'No se encontraron resultados.', m);

const firstTrack = results[0];
    const firstTrackInfo = `✨ *Primer Resultado* ✨\n\n` +
                           `*» Título* : ${json[i].title}\n` +
                           `*» Artista* : ${json[i].artists}\n` +
                           `*» Duración* : ${json[i].duration}\n\n`;

    
    let listSections = [];
    for (let i = 0; i < (results.length >= 30 ? 30 : results.length); i++) {
      const track = results[i];
      
      listSections.push({
        title: `Canción Nro ${i + 1}`,
        rows: [
          {
            header: '',
            title: `${track.title}\n`,
            description: `Artista: ${track.artists}`,
            id: `${usedPrefix}applemusicdl ${track.url}`
          },
        ]
      });
    }

    
    await conn.sendListB(
      m.chat,
      ' *A P P L E  M U S I C  -  S E A R C H* 💬',
      firstTrackInfo, 
      'Seleccione una Canción',
      'https://qu.ax/fPmDc.jpg',
      listSections,
      m
    );
    await m.react('✅');
  } catch (error) {
    console.error(error);
    await m.react('✖️');
  }
};
conn.reply('error :v')
}
};

handler.command = ['soundcloudsearch', 'cloudsearch'];

export default handler;
