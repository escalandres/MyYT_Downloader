const fs = require('fs');
const ytdl = require('ytdl-core');
const { PythonShell } = require('python-shell');
const path = require('path');
const { getVideoName } = require('./checkVideo');

function deleteTempFile(file){
    let data = {
        estatus: false,
        error: ''
    }
    fs.unlink(file, (error) => {
        if (error) {
            console.error('Error al borrar el archivo:', error);
            data.error = 'Error al borrar el archivo:', error;
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
            console.error('Error en la descarga:', error);
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
            reject(false);
        });
    });
}

async function combineFiles(videoName){
    const videoFile = '/downloads/video.mp4';
    const audioFile = '/downloads/audio.mp3';
    const outputFile = '/downloads/' + videoName + '.mp4';
    try{
        return new Promise((resolve, reject) => {
            const options = {
                scriptPath: path.join(__dirname, 'python'),
                args: [videoFile, audioFile, outputFile],
            };
            PythonShell.run('combine.py', options, (err, results) => {
                if (err) throw err;
                console.log('El archivo combinado se ha generado con éxito:', results);
            })
            
            resolve(true);
            // .on('error', (error) => {
            //     console.error('Error en la descarga:', error);
            //     reject(false);
            // });
        });
    }
    catch (error) {
        console.error('Ocurrió un error:', error);
        return false
    }
}

async function downloader(videoUrl, option){
    let result = false;
    const videoName = getVideoName(videoUrl)
    if(option === 'v'){
        const video = await downloadVideo(videoUrl, videoName)
        result = video;
    }
    else if(option === 'a'){
        const audio = await downloadAudio(videoUrl, videoName)
        result = audio;
    }
    else if(option === 'va'){
        const video = await downloadVideo(videoUrl, 'video')
        const audio = await downloadAudio(videoUrl, 'audio')
        if(video && audio){
            const combine = await combineFiles(videoName)
            if(combine){
                console.log('Archivos combinados !');
                result = true;
                // deleteTempFile('/downloads/video.mp4');
                // deleteTempFile('/downloads/audio.mp3');
            }
        }
    }
}

module.exports = {
    downloader
}