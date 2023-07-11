const fs = require('fs');
const path = require('path');
const { guardarEnLog } = require('./fntLog')
const { app } = require('electron');
const asar = require('asar');
const { exec } = require('child_process');

function escaparBackslashes(cadena) {
    return cadena.replace(/\\/g, '\\\\');
  }

function checkPath(){
    const rutaCarpetaDocuments = path.join(escaparBackslashes(require('os').homedir()), 'Documents');
    const rutaCarpetaDownloader = path.join(rutaCarpetaDocuments, 'MyYT_Downloader');
    if (!fs.existsSync(rutaCarpetaDownloader)) {
    fs.mkdirSync(rutaCarpetaDownloader);
    console.log('Carpeta creada correctamente');
    } else {
    console.log('La carpeta ya existe');
    }
    return rutaCarpetaDownloader
}

function checkExeFolder(){
    let ruta = '';
    // Obtén la ruta del archivo app.asar dentro de tu aplicación
    const appAsarPath = escaparBackslashes(app.getAppPath());
    console.log(appAsarPath)
    //guardarEnLog('checkPath.js', 'checkExeFolder', 'App: ' + appAsarPath )
    // Extrae el contenido de app.asar a un directorio Exe

    // Ruta al archivo combine.exe dentro del directorio Exe
    const tempDirectory = escaparBackslashes(path.join(appAsarPath, '../'));
    console.log(tempDirectory)
    const exeDirectory = path.join(tempDirectory, 'exe', 'combine.exe');

    if (fs.existsSync(exeDirectory)) {
        ruta = exeDirectory;
    } else {
        // fs.mkdir(directorio, (error) => {
        //     if (error) {
        //         console.error('Error al crear el directorio:', error);
        //     } else {
        //         console.log('Directorio creado exitosamente.');
        //     }
        // });
        try{
            asar.extractAll(appAsarPath, tempDirectory);
            ruta = exeDirectory;
            deleteFolder(path.join(tempDirectory, 'node_modules'))
            deleteFolder(path.join(tempDirectory, 'MyYT_Downloader-win32-x64'))
            // deleteFolder(path.join(exeDirectory, 'log'))
            deleteFolder(path.join(tempDirectory, 'src'))
            deleteTempFile(path.join(tempDirectory, '.env'))
            deleteTempFile(path.join(tempDirectory, 'package.json'))
            // deleteTempFile(path.join(exeDirectory, 'pyinstaller.txt'))
            // deleteTempFile(path.join(exeDirectory, 'README.md'))
        }
        catch(err){
            guardarEnLog('checkPath.js', 'checkExePath', 'Error: ' + err)
        }
    }
    
    return ruta;
}

function moveFile(sourceFolder, file, videoName){
    const fs = require('fs');
    const path = require('path');

    const rutaArchivoOrigen = path.join(escaparBackslashes(sourceFolder), file);
    const rutaCarpetaDestino = checkPath();

    const rutaArchivoDestino = path.join(escaparBackslashes(rutaCarpetaDestino), videoName);

    fs.rename(rutaArchivoOrigen, rutaArchivoDestino, (error) => {
    if (error) {
        console.error('Error al mover el archivo: ', error);
        guardarEnLog('checkPath.js', 'moveFile', 'Error al mover el archivo: ' + error)
    } else {
        console.log('Archivo movido correctamente');
    }
    });
}

function deleteFolder(path){
    fs.rmdir(path, { recursive: true }, (error) => {
        if (error) {
            console.error('Error al eliminar el directorio:', error);
            guardarEnLog('checkPath.js', 'deleteFolder', 'Error al eliminar el directorio: '+error)
        } else {
            console.log('Directorio eliminado exitosamente.');
            
        }
    });
}

function deleteTempFile(file){
    let data = {
        estatus: false,
        error: ''
    }
    fs.unlink(file, (error) => {
        if (error) {
            console.error('Error al borrar el archivo: ', error);
            data.error = 'Error al borrar el archivo: ' + error;
            guardarEnLog('checkPath.js', 'deleteTempFile', 'Error al borrar el archivo:' + error)
        } else {
            console.log('Archivo borrado correctamente');
            data.estatus = true;
        }
    });
    return data
}

// function renameFile(sourceFolder, file, videoName){
//     const fs = require('fs');
//     const path = require('path');

//     const rutaArchivoOrigen = path.join(sourceFolder, file);
//     const rutaCarpetaDestino = checkPath();

//     const rutaArchivoDestino = path.join(rutaCarpetaDestino, videoName);

//     fs.rename(rutaArchivoOrigen, rutaArchivoDestino, (error) => {
//     if (error) {
//         console.error('Error al mover el archivo: ', error);
//         guardarEnLog('checkPath.js', 'moveFile', 'Error al mover el archivo: ' + error)
//     } else {
//         console.log('Archivo movido correctamente');
//     }
//     });
// }

module.exports = {
    checkPath,
    moveFile,
    checkExeFolder,
    deleteTempFile
}

//console.log(path.join('C:\\User\\andre\\Documents', 'video'))