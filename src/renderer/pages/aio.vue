<template>
  <div class="aio-root">
    <AioMainBackground ref="mainBackground" class="aio-main-background" />
    <AioCentralPanel ref="centralPanel" class="aio-central-panel" @manually-hide-bar="setManualHide(true)" />
  </div>
</template>

<script>
export default {
  name: 'AIOPage',
  layout: 'aio',
  data () {
    return {
      screenSize: {
        width: 0,
        height: 0
      },
      isHide: false,
      autoHideScene: ['POWERPNT', 'EasiNote', 'seewoPincoTeacher'],
      isManualHide: false,
      expectedAIOBarHeight: '0px'
    }
  },
  mounted () {
    this.$data.expectedAIOBarHeight = document.body.clientHeight.toString() + 'px'
    this.$electron = require('electron')
    this.getScreenSize()
    this.preventFullScreen()
    setInterval(() => {
      this.checkActiveWindow()
      this.syncAnimationStats()
    }, 500)
  },
  methods: {
    getScreenSize () {
      this.$data.screenSize = this.$electron.ipcRenderer.sendSync('message-from-renderer', {
        operation: 'get',
        data: {
          target: 'size'
        }
      })
    },
    checkActiveWindow () {
      const pullActiveWindowFromLocalStorage = () => {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        return localStorageIC.activeWindow
      }
      const activeWin = pullActiveWindowFromLocalStorage()
      const checkIfPathIsIn = (path, pathLs) => {
        let flag = false
        for (let i = 0; i < pathLs.length; i++) {
          if (path.includes(pathLs[i])) {
            flag = true
            break
          }
        }
        return flag
      }
      const isCurWinFullScreen = activeWin => (
        activeWin.bounds.height === this.$data.screenSize.height &&
        activeWin.bounds.width === this.$data.screenSize.width &&
        !activeWin.owner.path.includes('DeltaClass')
      )
      const isFullResult = (activeWin.bounds !== null && activeWin.bounds !== undefined) ? isCurWinFullScreen(activeWin) : false
      const isInResult = checkIfPathIsIn(activeWin.owner.path, this.$data.autoHideScene)
      if (!isInResult && isFullResult !== this.$data.isHide) this.ctrlAIOPanelStatus(isFullResult)
      if (!isFullResult && isInResult !== this.$data.isHide) this.ctrlAIOPanelStatus(isInResult)
      if (isInResult && isFullResult) this.ctrlAIOPanelStatus(true)
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.aio.isWinConformHideReq = isInResult || isFullResult
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
    },
    ctrlAIOPanelStatus (target, force) {
      if (this.$data.isManualHide && force !== true) { return }
      if (target) { this.$refs.centralPanel.clearDrawBoard() }
      let localStorageIC = localStorage.getItem('ic')
      localStorageIC = (localStorageIC === null)
        ? {}
        : JSON.parse(localStorageIC)
      const isAIOUndef = ic => (ic.aio === undefined)
      if (isAIOUndef(localStorageIC)) { localStorageIC.aio = {} }
      localStorageIC.aio.isHide = target
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
      this.$data.isHide = target
      this.$electron.ipcRenderer.send('message-from-renderer', {
        operation: 'setIgnoreMouseEvent',
        data: {
          windowName: 'aioWindow',
          target,
          forward: false
        }
      })
      setTimeout(() => {
        this.$electron.ipcRenderer.send('message-from-renderer', {
          operation: 'setAlwaysOnTop',
          data: {
            windowName: 'aioWindow',
            target: !target,
            type: !target ? 'pop-up-menu' : 'normal'
          }
        })
      }, 50)
      setTimeout(() => {
        this.$refs.mainBackground.$el.style.display = target ? 'none' : ''
        this.$refs.centralPanel.$el.style.display = target ? 'none' : ''
      }, target ? 500 : 0)
      setTimeout(() => {
        this.$refs.mainBackground.$el.style.opacity = target ? '0' : '80%'
        this.$refs.mainBackground.$el.style.top = target ? this.$data.expectedAIOBarHeight : '0'
        this.$refs.centralPanel.$el.style.opacity = target ? '0' : '1'
        this.$refs.centralPanel.$el.style.marginTop = target ? this.$data.expectedAIOBarHeight : '0'
      }, target ? 0 : 50)
    },
    preventFullScreen () {
      document.onkeydown = function (event) {
        if (event.key === 'F11') {
          event.preventDefault()
        }
      }
    },
    syncAnimationStats () {
      // Sync auto hide stats from local
      const curIsHideVar = this.$data.isHide
      if (!!Number(this.$refs.mainBackground.$el.style.opacity) === curIsHideVar && this.$data.isManualHide !== true) {
        this.$data.isHide = !curIsHideVar
      }
      // Sync manual hide stats from ic
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      if (localStorageIC.aio.isManualHide === true && this.$data.isManualHide !== true) {
        this.$data.isManualHide = localStorageIC.aio.isManualHide
        this.ctrlAIOPanelStatus(this.$data.isManualHide, true)
      }
      if (localStorageIC.aio.isManualHide === false && this.$data.isManualHide === true) {
        this.$data.isManualHide = localStorageIC.aio.isManualHide
        this.ctrlAIOPanelStatus(this.$data.isManualHide, true)
      }
      // Sync other args
      /* if (this.$refs.mainBackground.$el.style.display !== (this.$data.isHide || this.$data.isManualHide ? 'none' : 'flex')) {
        this.ctrlAIOPanelStatus(this.$data.isHide, true)
      } */
    },
    setManualHide (target) {
      if (this.$data.isManualHide) { return }
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.aio.isManualHide = target
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
      this.$data.isManualHide = target
      this.$electron.ipcRenderer.send('message-from-renderer', {
        operation: 'setIgnoreMouseEvent',
        data: {
          windowName: 'aioWindow',
          target,
          forward: false
        }
      })
      const createWindow = () => {
        const workAreaSize = this.$electron.ipcRenderer.sendSync('message-from-renderer', {
          operation: 'get',
          data: {
            target: 'workAreaSize',
            identity: 'createAIOReviveWindow'
          }
        })
        this.$electron.ipcRenderer.send('message-from-renderer', {
          operation: 'createWindow',
          data: {
            useTemplate: false,
            pageUri: '/popups/aio/revive',
            windowName: 'AIOReviveWindow',
            browserWindowOption: {
              width: parseInt(workAreaSize.height * 0.0375),
              height: parseInt(workAreaSize.height * 0.0375 * 0.5),
              x: parseInt((workAreaSize.width - workAreaSize.height * 0.0375) * 0.5),
              y: parseInt(workAreaSize.height - workAreaSize.height * 0.0375 * 0.5),
              skipTaskbar: true,
              frame: false,
              focusable: true,
              thickFrame: false,
              transparent: true,
              resizable: false,
              webPreferences: {
                nodeIntegration: true,
                contextIsolation: false
              }
            }
          }
        })
        this.$electron.ipcRenderer.send('message-from-renderer', {
          operation: 'automaticResetContentsFactorDyn',
          data: {
            windowName: 'AIOReviveWindow'
          }
        })
      }
      if (target) {
        createWindow()
      }
      setTimeout(() => {
        this.$refs.mainBackground.$el.style.display = target ? 'none' : ''
        this.$refs.centralPanel.$el.style.display = target ? 'none' : ''
      }, target ? 500 : 0)
      setTimeout(() => {
        this.$refs.mainBackground.$el.style.opacity = target ? '0' : '1'
        this.$refs.mainBackground.$el.style.top = target ? this.$data.expectedAIOBarHeight : '0'
        this.$refs.centralPanel.$el.style.opacity = target ? '0' : '1'
        this.$refs.centralPanel.$el.style.top = target ? this.$data.expectedAIOBarHeight : '0'
      }, target ? 0 : 50)
    }
  }
}
</script>

<style>

.aio-main-background {
  position: fixed;
  top: 0;
  z-index: -1;
  transition: all 0.5s;
}

.aio-central-panel {
  display: block;
  top: 0;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.5s;
}

</style>
