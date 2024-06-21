import { app, ipcMain, screen } from 'electron'
import BrowserWinHandler from './BrowserWinHandler'

// Init tray
const { Tray, Menu } = require('electron')
const isDev = process.env.NODE_ENV === 'development'
let tray = null

// Init JSON Storage
const storage = require('electron-json-storage')
storage.setDataPath(isDev ? process.env.INIT_CWD + '/src/data' : app.getPath('userData'))
let settings = {}
try {
  settings = storage.getSync('settings')
} catch {
  settings = {}
}
const isFirstBoot = [null, undefined, 1].includes(settings.isFirstBoot)
storage.set('launchStats', { is1stLaunch: true })

/// /// Dev Area Begin //////

/// /// Dev Area End //////

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

// Quit when child proc is gone.
app.on('child-process-gone', function () {
  if (process.platform !== 'darwin') app.quit()
})

// Load here all startup windows
app.on('ready', () => {
  const windows = {}
  const zoomFactor = screen.getPrimaryDisplay().workAreaSize.width / 2160
  if (!isFirstBoot) {
    windows.mainWindow = require('./MainWindow')
    windows.floatWindow = require('./FloatWindow')
    windows.aioWindow = require('./AIOWindow')
    windows.drawBoardWindow = require('./DrawBoardWindow')
    windows.floatWindow.default.browserWindow.setAlwaysOnTop(true, 'pop-up-menu')
    windows.aioWindow.default.browserWindow.setAlwaysOnTop(true, 'pop-up-menu')
    windows.drawBoardWindow.default.browserWindow.setAlwaysOnTop(true, 'pop-up-menu')
    windows.drawBoardWindow.default.browserWindow.setIgnoreMouseEvents(true, { forward: false })
  } else {
    windows.initWindow = require('./InitWindow')
  }
  // Begin ipcMsg SubHandler Defination
  /*
  createWindow
  {
    useTemplate: <Boolean>, // Use template or not
    templateName: <String>, // Name of the template, available options: `ApplicationView` / `FullScreenNotify` / `PowerPointSideBar`
    browserWindowOption: <Object>, // See the API doc of BrowserWindow on https://electronjs.org
    pageUri: <String>, // Specifying a page URI
    pageUrl: <String>, // Specifying a page URL, ignored if `pageUri` is defined
    windowName: <String> // Specifying a window name identifying the window
  }
  */
  const handleCreateWindowOperation = argData => {
    if (argData.useTemplate === false) {
      windows[argData.windowName] = new BrowserWinHandler(argData.browserWindowOption)
      windows[argData.windowName].onCreated(_browserWindow => {
        windows[argData.windowName].loadPage(argData.pageUri)
      })
    } else if (useTemplate === true) {
      // To Be Done
    }
  }

  const handleGetInfoOperation = argData => {
    switch (argData.target) {
    case 'workAreaSize':
      return require('electron').screen.getPrimaryDisplay().workAreaSize
    case 'size':
      return require('electron').screen.getPrimaryDisplay().size
    case 'appVersion': {
      const getAppVersion = () => {
        if (isDev) {
          const appFlagVersion = require('~/../../package.json').version
          return {
            appFlagVersion,
            isDev
          }
        } else {
          const appFlagVersion = app.getVersion()
          return appFlagVersion
        }
      }
      return getAppVersion()
    }
    case 'appPath':
      return app.getAppPath()
    case 'isDev':
      return process.env.NODE_ENV === 'development'
    case 'dataPath':
      return isDev ? process.env.INIT_CWD + '/src/data' : app.getPath('userData')
    }
  }

  const handleSetIgnoreMouseEvent = argData => {
    try {
      windows[argData.windowName]
        .default
        .browserWindow
        .setIgnoreMouseEvents(argData.target, { forward: argData.forward })
    } catch {
      windows[argData.windowName]
        .browserWindow
        .setIgnoreMouseEvents(argData.target, { forward: argData.forward })
    }
  }

  const closeAllWindow = () => {
    for (const perWindow of Object.keys(windows)) {
      if (windows[perWindow] === undefined) {
        console.debug('Window already released.')
        continue
      }
      if (windows[perWindow].default !== undefined) {
        try {
          windows[perWindow].default.browserWindow.close()
        } catch {
          console.error('Object not defined.')
          console.error(perWindow)
        }
      } else {
        try {
          windows[perWindow].browserWindow.close()
        } catch {
          console.error('Outdated window, browserWindow.close() method not available.')
          console.error(windows[perWindow])
        }
      }
    }
    app.exit()
  }

  const handleAutomaticResetWebContentsFactor = argData => {
    windows[argData.windowName]
      .default
      .browserWindow
      .webContents
      .setZoomFactor(zoomFactor)
  }

  const handleAutomaticResetWebContentsFactorDyn = argData => {
    windows[argData.windowName]
      .browserWindow
      .webContents
      .setZoomFactor(zoomFactor)
  }

  const handleSendKey = async argData => {
    const nutJS = require('@nut-tree-fork/nut-js')
    const { keyboard, Key } = nutJS
    switch (argData.type) {
    case 'closeWin':
      await keyboard.pressKey(Key.LeftAlt)
      await keyboard.pressKey(Key.F4)
      await keyboard.releaseKey(Key.LeftAlt)
      await keyboard.releaseKey(Key.F4)
      break
    case 'showDesktop':
      await keyboard.pressKey(Key.LeftWin)
      await keyboard.pressKey(Key.D)
      await keyboard.releaseKey(Key.LeftWin)
      await keyboard.releaseKey(Key.D)
      break
    case 'showTabSwitch':
      await keyboard.pressKey(Key.LeftWin)
      await keyboard.pressKey(Key.Tab)
      await keyboard.releaseKey(Key.LeftWin)
      await keyboard.releaseKey(Key.Tab)
      break
    }
  }
  // End of ipcMsg SubHandler Defination

  // Begin ipcMsg Handler
  /*
  {
    operation: <String>, // Major Operation to exec
    data: <Object> // Data
  }
  */
  ipcMain.on('message-from-renderer', (event, arg) => {
    switch (arg.operation) {
    case 'createWindow':
      handleCreateWindowOperation(arg.data)
      break
    case 'destroyWindow':
      // To Be Done
      break
    case 'resizeWindow':
      // To Be Done
      break
    case 'automaticResetContentsFactor':
      handleAutomaticResetWebContentsFactor(arg.data)
      break
    case 'automaticResetContentsFactorDyn':
      handleAutomaticResetWebContentsFactorDyn(arg.data)
      break
    case 'setIgnoreMouseEvent':
      handleSetIgnoreMouseEvent(arg.data)
      break
    case 'moveTop':
      windows[arg.data.windowName]
        .default
        .browserWindow
        .moveTop()
      break
    case 'setAlwaysOnTop':
      windows[arg.data.windowName]
        .default
        .browserWindow
        .setAlwaysOnTop(arg.data.target, arg.data.type)
      break
    case 'setAlwaysOnTopDynWin':
      windows[arg.data.windowName]
        .browserWindow
        .setAlwaysOnTop(arg.data.target, arg.data.type)
      break
    case 'showInactiveWindow':
      windows[arg.data.windowName]
        .default
        .browserWindow
        .showInactive()
      break
    case 'showWindow':
      try {
        windows[arg.data.windowName]
          .default
          .browserWindow
          .show()
      } catch {
        windows[arg.data.windowName]
          .browserWindow
          .show()
      }
      break
    case 'console':
      console.debug(arg.data)
      break
    case 'sendKey':
      handleSendKey(arg.data)
      break
    case 'get':
      event.returnValue = handleGetInfoOperation(arg.data)
      break
    case 'closeWindow':
      windows[arg.data.windowName].default.browserWindow.close()
      break
    case 'closeDynWindow':
      windows[arg.data.windowName].browserWindow.close()
      windows[arg.data.windowName] = null // Release the windowHandler
      windows[arg.data.windowName] = undefined
      break
    case 'closeAllWindow':
      closeAllWindow()
      break
    case 'exit':
      app.exit()
      break
    case 'relaunch':
      if (!isDev) {
        app.relaunch()
        app.exit()
      } else {
        app.exit(250)
      }
      break
    default:
      event.reply('message-from-main', {
        message: 'Error',
        code: 1,
        data: {
          text: 'An error occurred, cannot recognize your request.'
        }
      })
      break
    }
  })

  // End of ipcMsg Handler
  tray = new Tray(isDev
    ? './src/extraResources/app_tray.ico'
    : 'resources/app_tray.ico')
  const contextMenu = !isFirstBoot
    ? Menu.buildFromTemplate([
      {
        label: 'Delta·Class Context Options',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Developer Options',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle DevTools (Main)',
        click: () => {
          windows.mainWindow.default.browserWindow.webContents.toggleDevTools()
        }
      },
      {
        label: 'Toggle DevTools (Float)',
        click: () => {
          windows.floatWindow.default.browserWindow.webContents.toggleDevTools()
        }
      },
      {
        label: 'Toggle DevTools (AIO)',
        click: () => {
          windows.aioWindow.default.browserWindow.webContents.toggleDevTools()
        }
      },
      {
        label: 'Toggle DevTools (DrawBoard)',
        click: () => {
          windows.drawBoardWindow.default.browserWindow.webContents.toggleDevTools()
        }
      },
      {
        type: 'separator'
      },
      {
        label: 'Application Control',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Relaunch',
        click: () => {
          if (!isDev) {
            app.relaunch()
            app.exit()
          } else {
            app.exit(250)
          }
        }
      },
      { label: 'Exit', click: () => { closeAllWindow(); app.exit() } }
    ])
    : Menu.buildFromTemplate([
      {
        label: 'Delta·Class Context Options',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Developer Options',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Toggle DevTools (Init)',
        click: () => {
          windows.initWindow.default.browserWindow.webContents.toggleDevTools()
        }
      },
      {
        label: 'Toggle DevTools (Main)',
        enabled: false
      },
      {
        label: 'Toggle DevTools (Float)',
        enabled: false
      },
      {
        label: 'Toggle DevTools (AIO)',
        enabled: false
      },
      {
        label: 'Toggle DevTools (DrawBoard)',
        enabled: false
      },
      {
        type: 'separator'
      },
      {
        label: 'Application Control',
        enabled: false
      },
      {
        label: 'Relaunch',
        click: () => {
          if (!isDev) {
            app.relaunch()
            app.exit()
          } else {
            app.exit(250)
          }
        }
      },
      {
        type: 'separator'
      },
      { label: 'Exit', click: () => { closeAllWindow(); app.exit() } }
    ])
  tray.setToolTip('DeltaClass is running.')
  tray.setContextMenu(contextMenu)
})
