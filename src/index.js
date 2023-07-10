const { app, BrowserWindow, nativeImage, ipcMain, Menu } = require('electron');
const path = require('path');
const express = require('express');
const appex = express();
const url = require('url')
const cors = require('cors');
const { checkVideoExists } = require('./modules/checkVideo');
const { downloader } = require('./modules/downloader');
const { guardarEnLog } = require('./modules/fntLog')
const { exec } = require('child_process');
const dotenv = require('dotenv');
const envPath = path.resolve(__dirname, '../', '.env');
guardarEnLog('index.js', 'main', 'Prueba .env: ' + envPath);
// Cargando las variables de entorno desde el archivo
const result = dotenv.config({ path: envPath });
if (result.error) {
  console.error('Error al cargar el archivo .env:', result.error);
  guardarEnLog('index.js', 'main', 'Error al cargar el archivo .env: ' + result.error);
}
// require('dotenv').config();
// const port = process.env.PORT;
const port = 52345;
appex.use(cors()); // Habilitar CORS

if(process.env.NODE_ENV){
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
  })
}



function createWindow() {
  // const iconPath = path.join(__dirname, 'download.svg'); // Ruta del archivo .svg
  // console.log(iconPath)
  // const icon = nativeImage.createFromPath(iconPath);
  // console.log(icon)
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true
    },
    icon: __dirname + '/img/favicon.ico' ?? '/src/img/favicon.ico',
    iconSize: { width: 32, height: 32 },
    title: 'MyYT_Downloader',
  });

  // mainWindow.loadFile(__dirname + '/views/index.html');
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'views/index.html'),
    protocol: 'file',
    slashes: true
  }))
  const mainMenu = Menu.buildFromTemplate(templateMenu);
  Menu.setApplicationMenu(mainMenu);
}

const templateMenu = [
  {
    label: 'File',
    submenu: [
      {
        label: 'Test',
        accelerator: 'Ctrl+T',
        click(){
          alert('Test')
        }
      }
    ]
  }
]

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// // Seccion de Express
// En algún lugar de tu código donde quieras ejecutar server.js
// exec('node server.js', (error, stdout, stderr) => {
//   if (error) {
//     console.error(`Error al ejecutar server.js: ${error}`);
//     return;
//   }
//   console.log(`server.js se ha ejecutado correctamente.`);
// });


appex.use(express.urlencoded({ extended: true }));
appex.use(express.json());

appex.get('/test', (req,res)=>{
  console.log('test')
  res.status(200).send({ message: 'Solicitud GET recibida correctamente' });
})

appex.post('/search-video', async (req, res) => {
  console.log('search-video')
  // Obtener los datos recibidos en la solicitud POST
  const datos = req.body;
  // Hacer algo con los datos recibidos
  // console.log('Datos recibidos:', datos);
  // console.log('url:', datos.url);

  const result = await checkVideoExists(datos.url,process.env.V3API)
  // console.log(result)
  if(result){
    res.status(200).send({ message: 'El video existe', code: 200, estatus: true });
  }
  else{
    res.status(404).send({message: 'El video no existe. Ingrese una url válida', code: 404, estatus: false})
    guardarEnLog('index.js', 'appex.post(/search-video)', 'El video no existe. Ingrese una url válida')
  }
});

appex.post('/download-video', async (req, res) => {
  console.log('download-video')
  const datos = req.body;
  console.log(datos)
  const result = await downloader(datos.url,datos.downloadOption,process.env.V3API,datos.videoOption,datos.audioOption)
  if(result){
    res.status(200).send({ message: 'Descarga completada', code: 200, estatus: true });
  }
  else{
    res.status(404).send({message: 'Ocurrió un error durante la descarga. Inténtelo más tarde', code: 500, estatus: false})
    guardarEnLog('index.js', 'appex.post(/download-video)', 'Ocurrió un error durante la descarga. Inténtelo más tarde')
  }
});

 // Puedes cambiar el puerto si es necesario
// let port = process.env.PORT;
// if(port == null || port == ""){
//   port = 3001;
// }

appex.listen(port, () => {
  console.log(`Servidor Express escuchando en el puerto ${port}`);
});
