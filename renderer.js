// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.

const txtLink = document.querySelector('#link');
const txtFileName = document.querySelector('#fileName');
const txtDlLocation = document.querySelector('#dlLocation');
const btnClose = document.querySelector('#closeApp');
const btnStartDl = document.querySelector('#start-dl');
const btnStopDl = document.querySelector('#stop-dl');
btnStopDl.style.display = 'none';

btnClose.addEventListener('click', function () {
    window.electronAPI.send('quit', 'bye');
});
btnStartDl.addEventListener('click', function () {
    btnStopDl.style.display = 'inherit';
    btnStartDl.style.display = 'none';
    window.electronAPI.send('start-dl', {
        fileName: txtFileName.value,
        link: txtLink.value,
        dlLocation: txtDlLocation.value,
    });
});
btnStopDl.addEventListener('click', function () {
    window.electronAPI.send('stop-dl');
    btnStopDl.style.display = 'none';
    btnStartDl.style.display = 'inherit';
});

function showToast(msg) {
    var toastLiveExample = document.getElementById('liveToast');
    toastLiveExample.querySelector('.toast-body').innerText = msg;
    var toast = new bootstrap.Toast(toastLiveExample)
    toast.show();
    setTimeout(() => {
        toast.hide()
    }, 3000);
}