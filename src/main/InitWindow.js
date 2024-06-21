import BrowserWinHandler from './BrowserWinHandler'

const { screen } = require('electron')
const { workAreaSize } = screen.getPrimaryDisplay()

const winHandler = new BrowserWinHandler({
  height: parseInt(workAreaSize.height * 0.2),
  width: parseInt(workAreaSize.width * 0.25),
  skipTaskbar: true,
  frame: false,
  thickFrame: false,
  transparent: true,
  focusable: false,
  resizable: false,
  alwaysOnTop: true,
  webPreferences: {
    nodeIntegration: true,
    contextIsolation: false
  }
})

winHandler.onCreated(_browserWindow => {
  winHandler.loadPage('/init')
})

export default winHandler
