const { google } = require('googleapis');
const youtube = google.youtube('v3');

require('dotenv').config();

function getYouTubeVideoId(url) {
  const regExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|watch\?v=|v\/)|youtu\.be\/)([^&?\/ ]{11})/;
  const match = url.match(regExp);
  return match && match[1];
}

async function getVideoName(videoUrl) {
    try {
      let videoId = getYouTubeVideoId(videoUrl)
      const response = await youtube.videos.list({
        part: 'snippet',
        id: videoId,
        key: process.env.V3API
      });
  
      const video = response.data.items[0];
      const nombreVideo = video.snippet.title;
      console.log('Nombre del video:', nombreVideo);
    } catch (error) {
      console.error('Error al obtener el nombre del video:', error.message);
    }
  }

  async function main(){
    await getVideoName('https://www.youtube.com/watch?v=ffRgM6Jkg0I')    
  }

  main()