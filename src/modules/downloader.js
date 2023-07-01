const fs = require('fs');
const ytdl = require('ytdl-core');
const { PythonShell } = require('python-shell');
const path = require('path');

async function downloadVideo(videoUrl) {
    console.log('Descargando video...')
    return new Promise((resolve, reject) => {
        ytdl(videoUrl)
            .pipe(fs.createWriteStream('video.mp4'))
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
    
async function downloadAudio(videoUrl) {
    console.log('Descargando audio...')
    return new Promise((resolve, reject) => {
        const options = {
            filter: 'audioonly',
            quality: 'highestaudio',
            format: 'mp3'
        };
        ytdl(videoUrl, options)
            .pipe(fs.createWriteStream('audio.mp3'))
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

// async function downloadAudio() {
//     let res = false;
//     try {
//         const options = {
//             filter: 'audioonly',
//             quality: 'highestaudio',
//             format: 'mp3'
//         };
//         await ytdl(videoUrl, options)
//             .pipe(fs.createWriteStream('audio.mp3'))
//             .on('finish', () => {
//             console.log('Audio descargado!');
//             });
//         console.log('Descarga completada');
//         res = true
//     } catch (error) {
//         console.error('Error en la descarga:', error);
//     }
//     return res
// }

async function combineFiles(){
    console.log('Combinando archivos...')
    console.log(path.join(__dirname, 'python'))
    const videoFile = 'video.mp4';
    const audioFile = 'audio.mp3';
    const outputFile = 'output.mp4';
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
    if(option === 'v'){
        const video = await downloadVideo(videoUrl)
        result = video;
    }
    else if(option === 'a'){
        const audio = await downloadAudio(videoUrl)
        result = audio;
    }
    else if(option === 'va'){
        const video = await downloadVideo(videoUrl)
        const audio = await downloadAudio(videoUrl)
        if(video && audio){
            const combine = await combineFiles()
            if(combine){
                console.log('Archivos combinados !');
                result = true;
            }
        }
    }
}

module.exports = {
    downloader
}