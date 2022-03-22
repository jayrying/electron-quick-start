// Modules to control application life and create native browser window
require('dotenv').config();
const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const Downloader = require("nodejs-file-downloader");
const { userHeaders } = require('./constants');
let downloader;

function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html');

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  ipcMain.on('stop-dl', async function (event, arg) {
    downloader?.cancel();
    mainWindow.webContents.send('percentage', 0);
  });
  ipcMain.on('start-dl', async function (event, arg) {
    try {
      const { fileName = null, link = null, dlLocation = null } = arg;
      if (!link) {
        mainWindow.webContents.send('error', 'Link not provided');
        return;
      }
      downloader = new Downloader({
        maxAttempts: 3, //Default is 1.
        url: link,
        directory: dlLocation || process.env.DOWNLOAD_DIR || "./local-downloads", //Sub directories will also be automatically created if they do not exist.
        onBeforeSave: (deducedName) => {
          console.log(`The file name is: ${deducedName}`);
          //If you return a string here, it will be used as the name(that includes the extension!).
          return fileName;
        },
        headers: userHeaders,
        onProgress: function (percentage, chunk, remainingSize) {
          mainWindow.webContents.send('percentage', percentage);
        },
      });
      await downloader.download();
    } catch (error) {
      console.log(error);
      mainWindow.webContents.send('error', error.message || 'something went wrong');
    }
  });

  ipcMain.on('quit', function (event, arg) {
    app.quit();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(async () => {
  createWindow();
});

app.on('activate', async function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit()
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
