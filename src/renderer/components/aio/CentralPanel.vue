<template>
  <!-- In incoming updates, the implement method of this component will be changed to v-for -->
  <div class="aiop-root">
    <div class="aiop-content-container">
      <div class="aiop-actions-container">
        <div class="aiop-action-close-window" @click="closeCurWindow()">
          <v-icon class="aiop-actions-special-icon" color="rgb(12, 12, 12)">
            mdi-triangle-outline
          </v-icon>
          <p>关闭</p>
        </div>
      </div>
      <div class="aiop-actions-container">
        <div class="aiop-action-show-desktop" @click="showDesktop()">
          <v-icon class="aiop-actions-special-icon" color="rgb(12, 12, 12)">
            mdi-circle-outline
          </v-icon>
          <p>桌面</p>
        </div>
      </div>
      <div class="aiop-actions-container">
        <div class="aiop-action-multi-tasks" @click="showTabView()">
          <v-icon class="aiop-actions-special-icon" color="rgb(12, 12, 12)">
            mdi-square-outline
          </v-icon>
          <p>任务</p>
        </div>
      </div>
      <span class="aiop-actions-hr" />
      <div class="aiop-actions-container">
        <div class="aiop-action-tool aiop-action-cursor" @click="setDrawMode('choose')">
          <v-icon :color="(curAttachDrawMode === 'choose') ? 'rgba(41, 131, 187)' : 'rgb(12, 12, 12)'">
            mdi-cursor-default-outline
          </v-icon>
          <p :style="(curAttachDrawMode === 'choose') ? 'color: rgba(41, 131, 187)' : 'color: ;'">选择</p>
        </div>
      </div>
      <div class="aiop-actions-container">
        <div class="aiop-action-tool aiop-action-draw" @click="curAttachDrawMode === 'draw' ? openColorSettingPanel() : setDrawMode('draw')">
          <v-icon :color="(curAttachDrawMode === 'draw') ? 'rgba(41, 131, 187)' : 'rgb(12, 12, 12)'">
            mdi-pencil-outline
          </v-icon>
          <p :style="(curAttachDrawMode === 'draw') ? 'color: rgba(41, 131, 187)' : 'color: ;'">绘画</p>
        </div>
      </div>
      <div class="aiop-actions-container">
        <div class="aiop-action-tool aiop-action-erase" @click="setDrawMode('erase')">
          <v-icon :color="(curAttachDrawMode === 'erase') ? 'rgba(41, 131, 187)' : 'rgb(12, 12, 12)'">
            mdi-eraser
          </v-icon>
          <p :style="(curAttachDrawMode === 'erase') ? 'color: rgba(41, 131, 187)' : 'color: ;'">擦除</p>
        </div>
      </div>
      <div class="aiop-actions-container">
        <div class="aiop-action-tool aiop-action-clear" @click="clearDrawBoard()">
          <v-icon color="rgb(12, 12, 12)">
            mdi-close
          </v-icon>
          <p>清空</p>
        </div>
      </div>
      <span class="aiop-actions-hr" />
      <div class="aiop-actions-container">
        <div class="aiop-action-tool aiop-action-hide" @click="hideBar()">
          <v-icon color="rgb(12, 12, 12)">
            mdi-chevron-down
          </v-icon>
          <p>隐藏</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIOCentralPanel',
  data: () => ({
    curAttachDrawMode: 'choose'
  }),
  mounted () {
    setTimeout(() => { this.initICValue() }, 300)
    this.$electron = require('electron')
  },
  methods: {
    initICValue () {
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.aio = {}
      localStorageIC.aio.isHide = false
      localStorageIC.aio.isManualHide = false
      localStorageIC.aio.isWinConformHideReq = false
      localStorageIC.drawBoard.mode = 'choose'
      localStorageIC.drawBoard.color = '#DB4D6D'
      localStorageIC.drawBoard.isColorPickerClosing = false
      localStorageIC.drawBoard.isColorPickerShow = false
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
    },
    closeCurWindow () {
      const activeWindow = require('active-win')
      const curActiveWindow = activeWindow.sync()
      const curActiveWindowPath = curActiveWindow.owner.path
      if (!(curActiveWindowPath.includes('DeltaClass')) && !(curActiveWindowPath.includes('electron\\dist'))) {
        this.$electron.ipcRenderer.send('message-from-renderer', {
          operation: 'sendKey',
          data: {
            type: 'closeWin'
          }
        })
      }
    },
    showDesktop () {
      this.$electron.ipcRenderer.send('message-from-renderer', {
        operation: 'sendKey',
        data: {
          type: 'showDesktop'
        }
      })
      this.$electron.ipcRenderer.send('message-from-renderer', {
        operation: 'showWindow',
        data: {
          windowName: 'mainWindow'
        }
      })
    },
    showTabView () {
      this.$electron.ipcRenderer.send('message-from-renderer', {
        operation: 'sendKey',
        data: {
          type: 'showTabSwitch'
        }
      })
    },
    setDrawMode (target) {
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.drawBoard.mode = target
      if (localStorageIC.drawBoard.color === undefined) {
        localStorageIC.drawBoard.color = '#DB4D6D'
      }
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
      this.$data.curAttachDrawMode = target
      if (target === 'draw' || target === 'erase') {
        setTimeout(() => {
          this.$electron.ipcRenderer.send('message-from-renderer', {
            operation: 'setIgnoreMouseEvent',
            data: {
              windowName: 'drawBoardWindow',
              target: false,
              forward: false
            }
          })
          this.$electron.ipcRenderer.send('message-from-renderer', {
            operation: 'setAlwaysOnTop',
            data: {
              windowName: 'drawBoardWindow',
              target: false,
              type: 'normal'
            }
          })
          this.$electron.ipcRenderer.send('message-from-renderer', {
            operation: 'showWindow',
            data: {
              windowName: 'drawBoardWindow'
            }
          })
        }, 100)
      } else if (target === 'choose') {
        setTimeout(() => {
          this.$electron.ipcRenderer.send('message-from-renderer', {
            operation: 'setIgnoreMouseEvent',
            data: {
              windowName: 'drawBoardWindow',
              target: true,
              forward: false
            }
          })
          this.$electron.ipcRenderer.send('message-from-renderer', {
            operation: 'setAlwaysOnTop',
            data: {
              windowName: 'drawBoardWindow',
              target: true,
              type: 'pop-up-menu'
            }
          })
        }, 100)
      }
    },
    clearDrawBoard () {
      if (this.$data.curAttachDrawMode === 'choose') {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        localStorageIC.drawBoard.mode = 'clear'
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
      } else {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        localStorageIC.drawBoard.mode = 'clear'
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
        this.$data.curAttachDrawMode = 'choose'
        setTimeout(() => this.setDrawMode('choose'), 150)
      }
    },
    hideBar () {
      // To Be Done
      // ! Attention !: isColorPickerClosing need to set at this time
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.drawBoard.isColorPickerClosing = true
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
      this.$emit('manually-hide-bar')
    },
    openColorSettingPanel () {
      const runCreate = () => {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        if (localStorageIC.drawBoard.isColorPickerShow === true) { return }
        localStorageIC.drawBoard.isColorPickerShow = true
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
        let workAreaSize = {}
        workAreaSize = this.$electron.ipcRenderer.sendSync('message-from-renderer', {
          operation: 'get',
          data: {
            target: 'workAreaSize'
          }
        })
        this.$electron.ipcRenderer.send('message-from-renderer', {
          operation: 'createWindow',
          data: {
            useTemplate: false,
            browserWindowOption: {
              height: parseInt(workAreaSize.height * 0.24),
              width: parseInt(workAreaSize.width * 0.25 * 0.5),
              x: parseInt(workAreaSize.width * (1 - 0.25 * 0.5) * 0.5),
              y: parseInt(workAreaSize.height * 0.76 - 50 - 10),
              alwaysOnTop: true,
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
            },
            pageUri: '/popups/drawboard/color',
            windowName: 'DrawBoardColorSettingWindow'
          }
        })
      }
      runCreate()
    }
  }
}
</script>

<style>

.aiop-root {
  padding-left: calc(100vw * 0.05);
  padding-right: calc(100vw * 0.05);
  max-height: 100vh;
  max-width: calc(100vw - 60px);
  margin-left: auto;
  margin-right: auto;
  overflow-y: hidden;
}

.aiop-content-container {
  margin: 0 !important;
  display: flex;
}

.aiop-actions-container {
  flex-grow: 1;
  padding-top: auto;
  padding-bottom: auto;
  min-height: 100vh;
}

.aiop-actions-container:active {
  background-color: rgba(0, 0, 0, 0.3);
}

.aiop-content-container div {
  display: grid;
  margin-top: auto;
  margin-bottom: auto;
}

.aiop-actions-special-icon {
  font-size: 32vh !important;
  height: 40vh;
  width: 40vh;
}

.aiop-root div {
  text-align: center;
  min-width: 50px;
  background-color: rgba(0, 0, 0, 0);
  transition: all 0.3s;
}

.aiop-actions-container div .v-icon {
  margin: auto;
  font-size: 38vh;
  height: 40vh;
  width: 40vh;
}

.aiop-content-container div p {
  font-size: small;
  color: rgb(0, 0, 0);
  opacity: 0.5;
  margin-left: 2px;
  margin-right: 2px;
  margin-bottom: 0;
  transition: color 0.5s;
}

.aiop-action-close-window .v-icon {
  transform: rotate(270deg);
}

.aiop-actions-hr {
  width: 1px;
  background-color: rgba(0, 0, 0, 0.2);
  margin-top: 10vh;
  margin-left: calc(100vw * 0.015) !important;
  margin-right: calc(100vw * 0.015) !important;
  height: 80vh;
}

</style>
