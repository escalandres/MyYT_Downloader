const fs = require('fs');
const ytdl = require('ytdl-core');
const path = require('path');
const { getVideoName } = require('./checkVideo');
const { checkPath, moveFile, checkExeFolder, deleteTempFile, mapRoute } = require('./checkPath');
const { exec } = require('child_process');
const { guardarEnLog } = require('./fntLog')
const { app } = require('electron');
const asar = require('asar');

async function downloadVideo(videoUrl, videoName, videoQ) {
    console.log('Descargando video...')
    console.log(videoQ)
    //guardarEnLog('downloader.js', 'downloadVideo', 'Video: ' + videoName)
    return new Promise((resolve, reject) => {
        ytdl(videoUrl, {quality: videoQ ?? 'highestvideo', filter: 'videoonly'})
            .pipe(fs.createWriteStream(videoName))
            .on('finish', () => {
            console.log('Video descargado!');
            resolve(true);
            })
        .on('error', (error) => {
            console.error('Error en la descarga: ', error);
            guardarEnLog('downloader.js', 'downloadVideo', 'Error en la descarga: ' + error)
            reject(false);
        });
    });
}
    
async function downloadAudio(videoUrl, videoName, audioQ) {
    console.log('Descargando audio...')
    console.log(audioQ)
    return new Promise((resolve, reject) => {
        const options = {
            filter: 'audioonly',
            quality: audioQ ?? 'highestaudio',
            format: 'mp3'
        };
        ytdl(videoUrl, options)
            .pipe(fs.createWriteStream( videoName))
            .on('finish', () => {
            console.log('Audio descargado!');
            resolve(true);
            })
        .on('error', (error) => {
            console.error('Error en la descarga:', error);
            guardarEnLog('downloader.js', 'downloadAudio', 'Error en la descarga: ' + error)
            reject(false);
        });
    });
}

async function combineFiles(){
    console.log('Combinando archivos..')
    //guardarEnLog('downloader.js', 'combineFiles', 'Command: '+command )
    return new Promise((resolve, reject) => {
        const combineExePath = checkExeFolder();
        if(combineExePath != ''){
            exec(`${combineExePath}`, (error, stdout, stderr) => {
                if (error) {
                    console.error('Error al combinar los archivos:', error);
                    guardarEnLog('downloader.js', 'combineFiles', 'Error combineExePath: '+error )
                    reject(false);
                } else {
                    console.log('Archivos combinados!');
                    resolve(true);
                }
            });
        }
        else{
            reject(false);
        }

        // Comprueba si el archivo combine.exe existe
        // if (asar.statFile(appAsarPath, 'src/modules/python/dist/combine.exe').size !== -1) {
        //     // Ejecuta combine.exe
        //     exec(combineExePath, (error, stdout, stderr) => {
        //     if (error) {
        //         console.error('Error al combinar los archivos:', error);
        //         guardarEnLog('downloader.js', 'combineFiles', 'Error combineExePath: '+error )
        //         reject(error);
        //     } else {
        //         console.log('Archivos combinados!');
        //         resolve(true);
        //     }
        //     });
        // } else {
        //     console.error('El archivo combine.exe no existe en app.asar');
        //     guardarEnLog('downloader.js', 'combineFiles', 'El archivo combine.exe no existe en app.asar')
        //     reject(new Error('Archivo no encontrado'));
        // }
        
    });
}

async function downloader(videoUrl, option, ApiKey, videoQ, audioQ){
    let result = false;
    let videoName = await getVideoName(videoUrl, ApiKey)
    console.log('video: ' + videoName)
    console.log('v: '+videoQ +', a: '+audioQ)
    // videoName = path.join(checkPath(), videoName)
    if(option === 'v'){
        const video = await downloadVideo(videoUrl,path.join(checkPath(), videoName+ '.mp4'), videoQ)
        result = video;
    }
    else if(option === 'a'){
        const audio = await downloadAudio(videoUrl,path.join(checkPath(), videoName + '.mp3'), audioQ)
        result = audio;
    }
    else if(option === 'va'){
        //guardarEnLog('downloader.js', 'downloader', 'ruta actual: ' + __dirname)
        const video = await downloadVideo(videoUrl,  path.join(checkPath(), 'video.mp4'), videoQ)
        const audio = await downloadAudio(videoUrl,  path.join(checkPath(), 'audio.mp3'), audioQ)
        if(video && audio){
            try {
                const resultado = await combineFiles();
                if(resultado){
                    moveFile(checkPath(), 'output.mp4', videoName + '.mp4' );
                    deleteTempFile(path.join(checkPath(), 'video.mp4'))
                    deleteTempFile(path.join(checkPath(), 'audio.mp3'))
                    result = resultado;
                }
            } catch (error) {
                console.error('error: ' + error);
                guardarEnLog('downloader.js', 'downloader', 'Error: ' + error)
                result = false;
            }
        }
    }
    return result
}

module.exports = {
    downloader
}