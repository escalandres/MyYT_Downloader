const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const { getVideoName } = require('./checkVideo');
const { checkPath, moveFile } = require('./checkPath');
const { exec } = require('child_process');

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

async function combineFiles(){
    console.log('Combinando archivos...')
    const videoFile = './temp/video.mp4';
    const audioFile = './temp/audio.mp3';
    const outputFile = './temp/output.mp4';
    const options = {
        scriptPath: path.join(__dirname, 'python'),
        args: [videoFile, audioFile, outputFile],
    };
    return new Promise((resolve, reject) => {
        exec('python src/modules/python/combine.py', (error, stdout, stderr) => {
            if (error) {
                // console.error('Error durante la ejecución del script:', error);
                reject(error);
            } else {
                // console.log('Resultados:', stdout);
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
        const video = await downloadVideo(videoUrl, './temp/video')
        const audio = await downloadAudio(videoUrl, './temp/audio')
        if(video && audio){
            try {
                const resultado = await combineFiles();
                if(resultado){
                    moveFile('./temp/', 'output.mp4', videoName);
                    deleteTempFile('./temp/video.mp4')
                    deleteTempFile('./temp/audio.mp3')
                    result = resultado;
                }
            } catch (error) {
                console.error('error: ' + error);
                result = false;
            }
        }
    }
    return result
}

module.exports = {
    downloader
}