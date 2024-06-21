<template>
  <v-app-bar v-show="isShown" ref="appbarMainContents" elevation="0" class="default-appbar">
    <v-fade-transition>
      <div v-if="!underShuttingdown" style="display: flex; width: 100%;">
        <v-toolbar-title class="appbar-customize-title">Δ·CLASS</v-toolbar-title>
        <v-tooltip v-for="pgBtn in pageBtnLs" :key="pgBtn.id" top>
          <template #activator="{ on, attrs }">
            <v-btn color="white" icon :to="pgBtn.href" v-bind="attrs" v-on="on">
              <v-icon>{{ pgBtn.icon }}</v-icon>
            </v-btn>
          </template>
          <span>{{ pgBtn.hint }}</span>
        </v-tooltip>
        <v-spacer />
        <v-tooltip top>
          <template #activator="{ on, attrs }">
            <v-btn color="white" icon v-bind="attrs" @click="execBackToDesktop()" v-on="on">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <span>返回桌面</span>
        </v-tooltip>
        <v-dialog
          v-model="dialog"
          persistent
          max-width="400"
        >
          <template #activator="{ on, attrs }">
            <v-btn color="white" icon v-bind="attrs" v-on="on">
              <v-icon>mdi-power-settings</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-card-title class="text-h5">
              电源选项
            </v-card-title>
            <v-card-text>请选择一个电源选项以继续</v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn
                text
                @click="dialog = false"
              >
                取消操作
              </v-btn>
              <v-btn
                text
                @click="execShutdownTerminal()"
              >
                关闭计算机
              </v-btn>
              <v-btn
                text
                @click="closeWindow()"
              >
                关闭应用
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </v-fade-transition>
    <v-fade-transition>
      <div v-if="underShuttingdown" class="appbar-poweroff-notify">
        <v-icon color="white">mdi-power</v-icon>
        <span>&nbsp;计算机将在 {{ poweroffCountdown }} 秒后关机。</span>
        <v-btn color="white" depressed outlined @click="cancelShutdown()">取消操作</v-btn>
      </div>
    </v-fade-transition>
  </v-app-bar>
</template>

<script>
export default {
  name: 'AppBar',
  data () {
    return {
      dialog: false,
      underShuttingdown: false,
      poweroffCountdown: 0,
      pageBtnLs: [
        {
          id: 1,
          href: '/',
          icon: 'mdi-home-variant-outline',
          hint: '首页'
        },
        {
          id: 2,
          href: '/feature',
          icon: 'mdi-widgets-outline',
          hint: '应用'
        },
        {
          id: 3,
          href: '/drive',
          icon: 'mdi-cloud-outline',
          hint: '云服务'
        },
        {
          id: 4,
          href: '/settings',
          icon: 'mdi-cog-outline',
          hint: '设置'
        }
      ],
      isShown: true,
      notShownPage: ['/float']
    }
  },
  mounted () {
    this.confirmPageDir()
  },
  methods: {
    closeWindow () {
      this.$data.dialog = false
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('message-from-renderer', {
        operation: 'closeAllWindow'
      })
    },
    execShutdownTerminal () {
      this.$data.dialog = false
      const childProcess = window.require('child_process')
      childProcess.exec('shutdown -s -t 30', { cwd: './' }, () => {
        this.showShuttingdownCountdown(30)
      })
    },
    showShuttingdownCountdown (duration) {
      this.$data.poweroffCountdown = duration
      const countdownInterval = setInterval(() => {
        if (this.$data.poweroffCountdown <= 0) {
          clearInterval(countdownInterval)
        } else {
          this.$data.poweroffCountdown -= 1
        }
      }, 1000)
      this.$data.underShuttingdown = true
      let concurrentGradientColor = 'light'
      const gradientBgInterval = setInterval(() => {
        if (!this.$data.underShuttingdown) {
          this.$refs.appbarMainContents.$el.style.backgroundColor = ''
          clearInterval(gradientBgInterval)
        } else if (concurrentGradientColor === 'dark') {
          this.$refs.appbarMainContents.$el.style.backgroundColor = 'rgb(230, 63, 49)'
          concurrentGradientColor = 'light'
        } else if (concurrentGradientColor === 'light') {
          this.$refs.appbarMainContents.$el.style.backgroundColor = 'rgb(209, 38, 25)'
          concurrentGradientColor = 'dark'
        }
      }, 1000)
    },
    cancelShutdown () {
      const childProcess = window.require('child_process')
      childProcess.exec('shutdown -a', { cwd: './' }, () => {
        this.$data.underShuttingdown = false
      })
    },
    execBackToDesktop () {
      const childProcess = window.require('child_process')
      childProcess.exec('explorer.exe shell:::{3080F90D-D7AD-11D9-BD98-0000947B0257}')
    },
    confirmPageDir () {
      for (let i = 0; i < this.$data.notShownPage.length; i++) {
        if (window.location.href.includes(this.$data.notShownPage[i])) {
          this.$data.isShown = false
        } else {
          this.$data.isShown = true
        }
      }
    }
  }
}
</script>

<style>

.default-appbar {
  color: rgb(255, 255, 255) !important;
  transition: all 1s;
}

.theme--dark.v-app-bar.v-toolbar.v-sheet {
  background: transparent;
}

.theme--dark.v-btn.v-btn--icon {
  color: rgb(255, 255, 255);
}

.default-appbar .v-btn {
  margin: 10px;
}

.appbar-customize-title {
  margin-right: 15px;
  margin-top: auto;
  margin-bottom: auto;
}

.appbar-poweroff-notify {
  text-align: center;
}

</style>
