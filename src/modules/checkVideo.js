const { google } = require('googleapis');
const youtube = google.youtube('v3');

require('dotenv').config();

function getYouTubeVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([^&?\/ ]{11})/;
  const match = url.match(regExp);
  return match && match[1];
}


async function checkVideoExists(videoUrl) {
  let videoId = getYouTubeVideoId(videoUrl)
  try {
    const res = await youtube.videos.list({
    part: 'id',
    id: videoId,
    key: process.env.V3API
    });
    return res.data.items.length > 0;
  } catch (error) {
    console.error('Error al verificar el video:', error);
    return false;
  }
}

async function getVideoName(videoUrl) {
  let videoName = 'default';
  try {
    let videoId = getYouTubeVideoId(videoUrl)
    const response = await youtube.videos.list({
      part: 'snippet',
      id: videoId,
      key: process.env.V3API
    });

    const video = response.data.items[0];
    const nombreVideo = video.snippet.title;
    videoName = nombreVideo;
    console.log('Nombre del video:', nombreVideo);
  } catch (error) {
    console.error('Error al obtener el nombre del video:', error.message);
    
  }
  return data;
}
module.exports = {
  checkVideoExists,
  getVideoName
}