const { google } = require('googleapis');
const youtube = google.youtube('v3');
const { guardarEnLog } = require('./fntLog')
require('dotenv').config();

function reemplazarCaracteresEspeciales(cadena) {
  // Lista de caracteres especiales a reemplazar
  // const caracteresEspeciales = /[!@#$%^&*()+=\-[\]\\';,/{}|":<>?~_]/g;
  const caracteresEspeciales = /[^*+=\-[\]\\';,/{}|":<>?~_]/g;
  
  // Reemplazar caracteres especiales por "_"
  const cadenaReemplazada = cadena.replace(caracteresEspeciales, '');
  
  return cadenaReemplazada;
}

function getYouTubeVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([^&?\/ ]{11})/;
  const match = url.match(regExp);
  return match && match[1];
}


async function checkVideoExists(videoUrl, ApiKey) {
  let videoId = getYouTubeVideoId(videoUrl)
  try {
    const res = await youtube.videos.list({
    part: 'id',
    id: videoId,
    key: ApiKey
    });
    return res.data.items.length > 0;
  } catch (error) {
    console.error('Error al verificar el video:', error);
    guardarEnLog('checkVideo.js', 'checkVideoExists', 'Error al verificar el video: ' + error)
    return false;
  }
}

async function getVideoName(videoUrl, ApiKey) {
  let videoName = 'default';
  try {
    let videoId = getYouTubeVideoId(videoUrl)
    const response = await youtube.videos.list({
      part: 'snippet',
      id: videoId,
      key: ApiKey
    });

    const video = response.data.items[0];
    const nombreVideo = video.snippet.title;
    console.log('Nombre del video:', nombreVideo);
    videoName = reemplazarCaracteresEspeciales(nombreVideo);
    console.log('Nombre del video:', videoName);
  } catch (error) {
    console.error('Error al obtener el nombre del video:', error.message);
    guardarEnLog('checkVideo.js', 'getVideoName', 'Error al obtener el nombre del video: ' + error)
  }
  return videoName;
}
module.exports = {
  checkVideoExists,
  getVideoName
}