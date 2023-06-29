const { app, BrowserWindow, nativeImage } = require('electron');
const path = require('path');

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
    icon: __dirname + '/src/img/favicon.ico',
    iconSize: { width: 32, height: 32 },
    title: 'Downloader',
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
