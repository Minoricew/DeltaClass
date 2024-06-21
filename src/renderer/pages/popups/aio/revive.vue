<template>
  <div class="aio-revive-root" @click="reviveAIO()">
    <div ref="liftUpDiv" class="lift-up-div" />
    <div class="icon-container">
      <v-icon ref="chevronIcon" color="black" class="chevron-icon" size="22">mdi-chevron-up</v-icon>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AIORevivePage',
  layout: 'aio',
  data () {
    return {
      isAutoHide: false
    }
  },
  mounted () {
    this.$electron = require('electron')
    this.$electron.ipcRenderer.send('message-from-renderer', {
      operation: 'setAlwaysOnTopDynWin',
      data: {
        windowName: 'AIOReviveWindow',
        target: true,
        type: 'pop-up-menu'
      }
    })
    setTimeout(() => { this.showStage() }, 10)
    setInterval(() => { this.checkIfHideIsNeeded() }, 500)
  },
  methods: {
    showStage () {
      this.$refs.liftUpDiv.style.opacity = '80%'
      this.$refs.liftUpDiv.style.top = '0'
      this.$refs.chevronIcon.$el.style.opacity = '1'
      this.$refs.chevronIcon.$el.style.marginTop = '3px'
    },
    reviveAIO () {
      this.$refs.liftUpDiv.style.opacity = '0'
      this.$refs.liftUpDiv.style.top = 'calc(100vh)'
      this.$refs.chevronIcon.$el.style.opacity = '0'
      this.$refs.chevronIcon.$el.style.marginTop = 'calc(100vh + 3px)'
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.aio.isManualHide = false
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
      setTimeout(() => {
        window.close()
        ipcRenderer.send('message-from-renderer', {
          operation: 'closeDynWindow',
          data: {
            windowName: 'AIOReviveWindow'
          }
        })
      }, 300)
    },
    checkIfHideIsNeeded () {
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      const isAutoHide = localStorageIC.aio.isWinConformHideReq
      if (this.$data.isAutoHide !== isAutoHide) {
        const { ipcRenderer } = require('electron')
        this.$data.isAutoHide = isAutoHide
        switch (isAutoHide) {
        case true:
          this.$refs.liftUpDiv.style.opacity = '0'
          this.$refs.liftUpDiv.style.top = 'calc(100vh)'
          this.$refs.chevronIcon.$el.style.opacity = '0'
          this.$refs.chevronIcon.$el.style.marginTop = 'calc(100vh + 3px)'
          ipcRenderer.send('message-from-renderer', {
            operation: 'setIgnoreMouseEvent',
            data: {
              windowName: 'AIOReviveWindow',
              target: true,
              forward: false
            }
          })
          break
        case false:
        default:
          this.$refs.liftUpDiv.style.opacity = '80%'
          this.$refs.liftUpDiv.style.top = '0'
          this.$refs.chevronIcon.$el.style.opacity = '1'
          this.$refs.chevronIcon.$el.style.marginTop = '3px'
          ipcRenderer.send('message-from-renderer', {
            operation: 'setIgnoreMouseEvent',
            data: {
              windowName: 'AIOReviveWindow',
              target: false,
              forward: false
            }
          })
          break
        }
      }
    }
  }
}
</script>

<style>

body {
  opacity: 0.8;
  overflow-y: hidden;
}

.lift-up-div {
  position: fixed;
  top: 100vh;
  border-bottom: 50vw solid rgb(255, 255, 255);
  border-left: 50vw solid transparent;
  border-right: 50vw solid transparent;
  width: 0;
  height: 0;
  opacity: 0;
  transition: all 0.3s;
}

.lift-up-div:hover {
  border-bottom: 50vw solid rgb(215, 215, 215);
}

.lift-up-div:active {
  border-bottom: 50vw solid rgb(126, 126, 126);
}

.chevron-icon {
  margin-top: calc(100vh + 3px);
  opacity: 0;
  margin-left: auto;
  margin-right: auto;
  transition: all 0.3s;
}

.icon-container {
  width: 100%;
  text-align: center;
  pointer-events: none;
}

</style>
