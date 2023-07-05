const { exec } = require('child_process');
const path = require('path');
const { app } = require('electron');
const asar = require('asar');

// Obtén la ruta del archivo app.asar dentro de tu aplicación
const appAsarPath = path.join(app.getAppPath(), 'app.asar');

// Extrae el contenido de app.asar a un directorio temporal
const tempDirectory = path.join(app.getPath('temp'), 'myApp');
asar.extractAll(appAsarPath, tempDirectory);

// Ruta al archivo combine.exe dentro del directorio temporal
const combineExePath = path.join(tempDirectory, 'src/modules/python/dist/combine.exe');

// Comprueba si el archivo combine.exe existe
if (asar.statFile(appAsarPath, 'src/modules/python/dist/combine.exe').size !== -1) {
  // Ejecuta combine.exe
  exec(combineExePath, (error, stdout, stderr) => {
    if (error) {
      console.error('Error al combinar los archivos:', error);
      reject(error);
    } else {
      console.log('Archivos combinados!');
      resolve(true);
    }
  });
} else {
  console.error('El archivo combine.exe no existe en app.asar');
  reject(new Error('Archivo no encontrado'));
}
