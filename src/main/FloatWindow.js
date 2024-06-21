import BrowserWinHandler from './BrowserWinHandler'

const { screen } = require('electron')
const { workAreaSize } = screen.getPrimaryDisplay()

const winHandler = new BrowserWinHandler({
  height: parseInt(workAreaSize.height * 0.0375),
  width: parseInt(workAreaSize.width * 0.3),
  x: parseInt(workAreaSize.width * 0.7 * 0.5),
  y: parseInt(workAreaSize.height * 0.0375 / 6),
  skipTaskbar: true,
  frame: false,
  focusable: false,
  thickFrame: false,
  transparent: true,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/float')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
