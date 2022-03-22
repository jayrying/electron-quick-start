const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  send: (type, msg) => ipcRenderer.send(type, msg)
});

ipcRenderer.on('error', (_event, arg) => {
  alert(arg) // prints "pong" in the DevTools console
  const infoProgressBar = document.querySelector('.progress-bar');
  const btnStartDl = document.querySelector('#start-dl');
  const btnStopDl = document.querySelector('#stop-dl');
  infoProgressBar.style.width = 0;
  btnStopDl.style.display = 'none';
  btnStartDl.style.display = 'inherit';
})
ipcRenderer.on('percentage', (_event, arg) => {
  const infoProgressBar = document.querySelector('.progress-bar');
  console.log(arg) // prints "pong" in the DevTools console
  infoProgressBar.style.width = arg + '%'
  if (arg == 100) {
    const btnStartDl = document.querySelector('#start-dl');
    const btnStopDl = document.querySelector('#stop-dl');
    infoProgressBar.style.width = 0;
    btnStopDl.style.display = 'none';
    btnStartDl.style.display = 'inherit';
  }
})


// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
window.addEventListener('DOMContentLoaded', () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  for (const type of ['chrome', 'node', 'electron']) {
    replaceText(`${type}-version`, process.versions[type])
  }
})
