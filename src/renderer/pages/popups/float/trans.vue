<template>
  <div class="float-transparent-popup-root">
    <div ref="tipTriangle" class="float-trans-tip-triangle" />
    <div ref="tipContainer" class="float-trans-tip-container">
      <div class="tip-deltamine-icon" />
      <p class="tip-deltamine-title">D E L T A M I N E</p>
      <div class="detail-help-view">
        <p class="maintenance-in-progress">
          此组件正在维护过程中, 可能出现样式异常等情况, 如果您遇到了相关异常, 请重新启动 Delta·Class 以关闭此组件, 并等待下一个更新发布。
        </p>
        <p class="detail-help-title">状态栏挡住了页面内容?</p>
        <p class="detail-help-content">
          您随时可以通过点击状态栏中央的 Delta·Class 应用图标来切换状态栏的透明度。
          当然, 状态栏也会在您打开部分应用时自动透明。
        </p>
        <!--<video ref="helpVideo" class="detail-help-video" autoplay loop src="/helps/DCH_StatusBarTransparenting.mp4" />-->
      </div>
      <v-btn
        block
        depressed
        outlined
        class="detail-btn-confirm"
        color="white"
        @click="closeWindow()"
      >
        我知道了
      </v-btn>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FloatTransparentPopupPage',
  layout: 'popups',
  data () {
    return {
    }
  },
  mounted () {
    setTimeout(() => {
      this.setSelfAlwaysOnTop()
      this.showTipContainer()
    }, 50)
    setTimeout(() => {
      this.$refs.helpVideo.play()
    }, 1000)
  },
  methods: {
    showTipContainer () {
      this.$refs.tipContainer.style.opacity = '1'
      this.$refs.tipContainer.style.top = '5px'
      this.$refs.tipTriangle.style.opacity = '1'
      this.$refs.tipTriangle.style.marginTop = '0'
    },
    closeWindow () {
      this.$refs.tipContainer.style.opacity = '0'
      this.$refs.tipContainer.style.top = '55px'
      this.$refs.tipTriangle.style.opacity = '0'
      this.$refs.tipTriangle.style.marginTop = '5px'
      this.setIsShowTo(false)
      setTimeout(() => {
        window.close()
        ipcRenderer.send('message-from-renderer', {
          operation: 'closeDynWindow',
          data: {
            windowName: 'floatTrsTipWindow'
          }
        })
      }, 350)
    },
    setIsShowTo (target) {
      const localStorageIC = JSON.parse(localStorage.getItem('ic')) // No need to check, active behind float.vue
      localStorageIC.tips.floatBar.transparentTip = target
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
    },
    setSelfAlwaysOnTop () {
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('message-from-renderer', {
        operation: 'setAlwaysOnTopDynWin',
        data: {
          windowName: 'floatTrsTipWindow',
          target: true,
          type: 'pop-up-menu'
        }
      })
    }
  }
}
</script>

<style>

.maintenance-in-progress {
  margin-left: auto;
  margin-right: auto;
  opacity: 0.6;
  font-size: small;
}

.float-trans-tip-triangle {
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-bottom: 12px solid rgba(0, 0, 0, 0.95);
  opacity: 0;
  margin-left: auto;
  margin-right: auto;
  margin-top: 55px;
  transition: all 0.35s;
}

.float-trans-tip-container {
  background-color: rgba(10, 10, 10, 1);
  min-height: 90vh;
  min-width: 98vw;
  opacity: 0;
  top: 55px;
  transition: all 0.35s;
  border-radius: 5px;
  padding-top: 10px;
  padding-left: 5%;
  padding-right: 5%;
  padding-bottom: 20px;
  text-align: center;
}

.tip-deltamine-icon {
  width: 15px;
  height: 15px;
  border: 2.5px solid rgb(255, 255, 255);
  transform: rotate(-315deg);
  margin-bottom: 0;
  margin-top: 0;
  margin-bottom: 0;
  margin-left: auto;
  margin-right: auto;
}

.tip-deltamine-title {
  margin-top: 3px;
  font-size: medium;
  font-family: 'BlenderPro';
  margin-bottom: 5px !important;
}

.detail-help-title {
  font-weight: 100;
  font-size: larger;
  margin: 0 !important;
}

.detail-help-content {
  font-weight: 100;
  font-size: small;
  margin: 0 !important;
}

.detail-help-video {
  max-width: 100%;
}

.detail-btn-confirm {
  max-width: 100%;
  margin-left: 0;
  margin-right: 0;
  color: black;
}

</style>
