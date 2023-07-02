const fs = require('fs');
const path = require('path');

function checkPath(videoName){
    const rutaCarpetaDocuments = path.join(require('os').homedir(), 'Documents');
    const rutaCarpetaDownloader = path.join(rutaCarpetaDocuments, 'MyYT_Downloader');
    console.log('a')
    if (!fs.existsSync(rutaCarpetaDownloader)) {
    fs.mkdirSync(rutaCarpetaDownloader);
    console.log('Carpeta creada correctamente');
    } else {
    console.log('La carpeta ya existe');
    }
    console.log('b')
    return path.join(rutaCarpetaDownloader, videoName)
}

module.exports = {
    checkPath
}

//console.log(path.join('C:\\User\\andre\\Documents', 'video'))