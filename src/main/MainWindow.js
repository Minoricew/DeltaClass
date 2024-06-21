import BrowserWinHandler from './BrowserWinHandler'

const { screen } = require('electron')
const { workAreaSize } = screen.getPrimaryDisplay()

/* let forceWidth = false
let width = 0 */

/* if (workAreaSize.width * 0.25 < 550) {
  forceWidth = true
  width = 550
} */

const winHandler = new BrowserWinHandler({
  height: workAreaSize.height,
  width: parseInt(workAreaSize.width * 0.275),
  x: parseInt(workAreaSize.width * (1 - 0.275)),
  y: 0,
  skipTaskbar: true,
  frame: false,
  thickFrame: false,
  transparent: true,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
