const { google } = require('googleapis');
const youtube = google.youtube('v3');

function getYouTubeVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([^&?\/ ]{11})/;
  const match = url.match(regExp);
  return match && match[1];
}


async function checkVideoExists(video, apiKey) {
  let videoId = getYouTubeVideoId(video)
  try {
    const res = await youtube.videos.list({
    part: 'id',
    id: videoId,
    key: apiKey
    });
    return res.data.items.length > 0;
  } catch (error) {
    console.error('Error al verificar el video:', error);
    return false;
  }
}
  
  // // Ejemplo de uso
  // const videoId = 'TuVideoID'; // Reemplaza con el ID del video que deseas comprobar
  // const apiKey = 'TuClaveDeAPI'; // Reemplaza con tu clave de API de YouTube Data v3
  
  // checkVideoExists(videoId, apiKey)
  //   .then(exists => {
  //     console.log(`El video ${videoId} existe: ${exists}`);
  //   });  

// module.exports = checkVideoExists;
module.exports = {
  checkVideoExists
}