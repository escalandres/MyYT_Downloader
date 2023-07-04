const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const { getVideoName } = require('./checkVideo');
const { checkPath, moveFile } = require('./checkPath');
const { exec } = require('child_process');
const { guardarEnLog } = require('./fntLog')

// Ruta al ejecutable 
const ejecutable = path.join(__dirname, 'python/dist');
const command = `cd "${ejecutable}" && combine.exe`

function deleteTempFile(file){
    let data = {
        estatus: false,
        error: ''
    }
    fs.unlink(file, (error) => {
        if (error) {
            console.error('Error al borrar el archivo: ', error);
            data.error = 'Error al borrar el archivo: ' + error;
            guardarEnLog('p.js', 'deleteTempFile', 'Error al borrar el archivo:' + error)
        } else {
            console.log('Archivo borrado correctamente');
            data.estatus = true;
        }
    });
    return data
}

async function downloadVideo(videoUrl, videoName) {
    console.log('Descargando video...')
    return new Promise((resolve, reject) => {
        ytdl(videoUrl)
            .pipe(fs.createWriteStream(videoName + '.mp4'))
            .on('finish', () => {
            console.log('Video descargado!');
            resolve(true);
            })
        .on('error', (error) => {
            console.error('Error en la descarga: ', error);
            guardarEnLog('p.js', 'downloadVideo', 'Error en la descarga: ' + error)
            reject(false);
        });
    });
}
    
async function downloadAudio(videoUrl, videoName) {
    console.log('Descargando audio...')
    return new Promise((resolve, reject) => {
        const options = {
            filter: 'audioonly',
            quality: 'highestaudio',
            format: 'mp3'
        };
        ytdl(videoUrl, options)
            .pipe(fs.createWriteStream( videoName + '.mp3'))
            .on('finish', () => {
            console.log('Audio descargado!');
            resolve(true);
            })
        .on('error', (error) => {
            console.error('Error en la descarga:', error);
            guardarEnLog('p.js', 'downloadAudio', 'Error en la descarga: ' + error)
            reject(false);
        });
    });
}

async function combineFiles(){
    console.log('Combinando archivos..')
    return new Promise((resolve, reject) => {
        exec(command,(error, stdout, stderr) => {
            if (error) {
                // console.error('Error durante la ejecución del script:', error);
                console.error('Error al combinar los archivos: ',error);
                // guardarEnLog('p.js', 'combineFiles', 'Error durante la ejecucion de combine.exe: ' + error)
                reject(error);
                return;
            } else {
                console.log('Archivos combinados!');
                resolve(true);
            }
        });
        
    });
}

async function downloader(videoUrl, option){
    let result = false;
    let videoName = await getVideoName(videoUrl)
    console.log('video: ' + videoName)
    // videoName = path.join(checkPath(), videoName)
    if(option === 'v'){
        const video = await downloadVideo(videoUrl, path.join(checkPath(), videoName))
        result = video;
    }
    else if(option === 'a'){
        const audio = await downloadAudio(videoUrl, path.join(checkPath(), videoName))
        result = audio;
    }
    else if(option === 'va'){
        const video = await downloadVideo(videoUrl, './src/modules/python/dist/video')
        const audio = await downloadAudio(videoUrl, './src/modules/python/dist/audio')
        if(video && audio){
            try {
                const resultado = await combineFiles();
                if(resultado){
                    moveFile('./src/modules/python/dist', 'output.mp4', videoName + '.mp4');
                    deleteTempFile('./src/modules/python/dist/video.mp4')
                    deleteTempFile('./src/modules/python/dist/audio.mp3')
                    result = resultado;
                }
            } catch (error) {
                console.error('error: ' + error);
                guardarEnLog('p.js', 'downloader', 'Error: ' + error)
                result = false;
            }
        }
    }
    return result
}

// downloader('https://www.youtube.com/watch?v=8nKJCNgiVhc','va')
// downloader('https://www.youtube.com/watch?v=uCAcJw_NJBE','va')
downloader('https://www.youtube.com/watch?v=ClcY_TaqKqY','va')

