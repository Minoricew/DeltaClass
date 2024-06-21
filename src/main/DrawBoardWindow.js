import BrowserWinHandler from './BrowserWinHandler'

const { screen } = require('electron')
const { size } = screen.getPrimaryDisplay()

const winHandler = new BrowserWinHandler({
  height: size.height,
  width: size.width,
  skipTaskbar: true,
  frame: false,
  focusable: true,
  thickFrame: false,
  fullscreen: true,
  transparent: true,
  resizable: false,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/drawboard')
  // Or load custom url
  // _browserWindow.loadURL('https://google.com')
})

export default winHandler
