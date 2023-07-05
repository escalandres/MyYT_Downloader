const { app } = require('electron');
const path = require('path');
const asar = require('asar');

// Ruta al archivo .asar
// const asarPath = path.join(app.getAppPath(), 'path', 'to', 'file.asar');
const asarPath = "C:\/Users\/aescala\/AppData\/Local\/Programs\/MyYT_Downloader\/resources\/app.asar"

// Abrir y extraer el contenido del archivo .asar
const asarContent = asar.extractAll(asarPath, 'output-directory');

// Acceder al contenido del archivo .asar
console.log(asarContent);
