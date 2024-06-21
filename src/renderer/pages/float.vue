<template>
  <div ref="floatRoot" class="float-root">
    <span ref="floatLineLeft" class="float-line-left" />
    <span ref="floatEdgeLeft" class="float-edge-left" />
    <div ref="floatDiv" class="float-view-div" @click="addOnClickedNum()">
      <div class="float-time-div">
        <p>{{ timeHour }}</p>
        <p>&nbsp;:&nbsp;</p>
        <p>{{ timeMin }}</p>
      </div>
      <img class="float-logo" src="~/assets/img/delta_black.png" @click="toggleTransparentLevel()">
      <div class="float-weather-div">
        <v-scroll-x-reverse-transition>
          <div v-if="currentWeatherShowing === 1" class="float-weather-temperature-div">
            <v-icon size="20">{{ curWeatherIcon }}</v-icon>
            <p>{{ curTemp }} °C</p>
          </div>
        </v-scroll-x-reverse-transition>
        <v-scroll-x-reverse-transition>
          <div v-if="currentWeatherShowing === 2" class="float-weather-temperature-div">
            <v-icon size="20">mdi-heat-wave</v-icon>
            <p>{{ curPrs }} hPa</p>
          </div>
        </v-scroll-x-reverse-transition>
        <v-scroll-x-reverse-transition>
          <div v-if="currentWeatherShowing === 3" class="float-weather-temperature-div">
            <v-icon size="20">mdi-invert-colors</v-icon>
            <p>{{ curHumi }} %</p>
          </div>
        </v-scroll-x-reverse-transition>
      </div>
      <div class="float-status-div">
        <v-icon size="20">{{ isOnline ? 'mdi-wifi-strength-4' : 'mdi-wifi-strength-off-outline' }}</v-icon>
      </div>
    </div>
    <span ref="floatEdgeRight" class="float-edge-right" />
    <span ref="floatLineRight" class="float-line-right" />
  </div>
</template>

<script>
export default {
  name: 'FloatPage',
  layout: 'float',
  data () {
    return {
      timeHour: '12',
      timeMin: '00',
      currentWeatherShowing: 1,
      curWeatherIcon: 'mdi-cloud-off-outline',
      curTemp: '--',
      curHumi: '--',
      curPrs: '----',
      weatherIsDay: undefined,
      weatherTypeIsRain: ['雨', '阵雨', '毛毛雨/细雨', '小雨', '中雨', '小到中雨', '中到大雨'],
      weatherTypeIsPouring: ['强阵雨', '大雨', '极端降雨', '暴雨', '大暴雨', '特大暴雨', '大到暴雨', '暴雨到大暴雨', '大暴雨到特大暴雨'],
      weatherTypeIsSnowyRainy: ['雷阵雨伴有冰雹', '雨夹雪', '雨雪天气', '阵雨夹雪', '冻雨'],
      weatherTypeIsSnowy: ['雪', '小雪', '中雪', '阵雪', '小到中雪', '中到大雪'],
      weatherTypeIsSnowyHeavy: ['大雪', '暴雪', '大到暴雪'],
      weatherTypeIsFog: ['薄雾', '雾', '霾', '浓雾', '强浓雾', '中度霾', '重度霾', '严重霾', '大雾', '特强浓雾'],
      weatherTypeIsDust: ['扬沙', '浮尘', '沙尘暴', '强沙尘暴'],
      weatherResponseBody: {},
      weatherApiType: 'DeltaClass API',
      weatherApiKey: '',
      weatherLocationId: '101210111',
      transparentLevel: 'normal',
      autoTransparentEnabled: true,
      autoTransparentScene: ['POWERPNT', 'EasiNote'],
      isTransparentManuallySet: false,
      processStatus: [],
      isFloatBarUnderTransition: false,
      backgroundClickedTime: 0,
      maxiumClickTime: 2,
      isOnline: false
    }
  },
  mounted () {
    // Init weather services
    const weatherUpdationChannel = new BroadcastChannel('DeltaClass.Components.Weather.Channel')
    weatherUpdationChannel.onmessage = e => {
      switch (e.data.action) {
      case 'ManualRefresh':
        this.getWeather()
        break
      case 'Get':
        weatherUpdationChannel.postMessage(this.$data.weatherResponseBody)
        break
      case 'SendWeatherData':
        // Self
        break
      default:
        console.error(e)
        throw new TypeError('Function DeltaClass.Components.Weather.Methods.Anonymous ' +
          'occurred an error: The argument "action" in the event expected to be one of ' +
          '["ManualRefresh", "Get", "SendWeatherData"]. But received ' + e.data.action + '.')
      }
    }
    this.getWeather()
    setInterval(() => {
      this.getWeather()
    }, 600000)
    // Require electron
    this.$electron = require('electron')
    // Get general settings
    this.getGeneralSettings()
    // Refresh general stats
    this.refreshStats()
    // Prevent fullscreen
    this.preventFullScreen()
    // Resize factor
    this.resizeFactor()
    // Set Intervals
    setInterval(() => {
      this.refreshTime()
    }, 500)
    setInterval(() => {
      this.toggleWeatherCategory()
    }, 30000)
    // Not using reqAnimationFrame cause of calling active-win too quick will increase unnecessary device CPU usage
    if (this.$data.autoTransparentEnabled) {
      setInterval(() => {
        this.checkTransparentSceneExists()
      }, 500)
    }
  },
  methods: {
    refreshStats () {
      this.refreshTime()
      this.refreshDeviceStatus()
    },
    refreshTime () {
      const date = new Date()
      const curReadableTime = this.generateReadableTime(date)
      this.$data.timeHour = curReadableTime.getHours()
      this.$data.timeMin = curReadableTime.getMinutes()
    },
    generateReadableTime (date) {
      // See index.vue for more info
      class ReadableTimeStringify {
        constructor (oHour, oMin, oSec) {
          const generateReadableTime = target => {
            target = String(target)
            return (target.split('').length === 1 ? '0' + target : target)
          }
          this.cHour = generateReadableTime(oHour)
          this.cMin = generateReadableTime(oMin)
          this.cSec = generateReadableTime(oSec)
        }

        getHours () {
          return this.cHour
        }

        getMinutes () {
          return this.cMin
        }

        getSeconds () {
          return this.cSec
        }
      }
      const insert = [date.getHours(), date.getMinutes(), date.getSeconds()]
      const timeInfo = new ReadableTimeStringify(...insert)
      return timeInfo
    },
    refreshDeviceStatus () {
      /* -#- Need to be refactored -#- */
      this.$axios.get('https://connect.deltax.app/json/getOnlineStatusMinor').then(data => {
        this.$data.isOnline = data.status === 200 && data.data.c === '❤️'
      }).catch(error => {
        this.$data.isOnline = error.code === 204
        console.error(error)
      })
    },
    handleGetWeatherFromApi () {
      let returnData = {}
      switch (this.$data.weatherApiType) {
      case 'DeltaClass API':
        this.$axios.get('https://api.class.deltax.app/api/v1/getWeather?' + '&location=' + this.$data.weatherLocationId)
          .then(data => {
            if (data.data !== undefined && data.data.code === '200') {
              this.$data.weatherResponseBody = data.data
              this.$data.curTemp = data.data.now.temp
              this.$data.curHumi = data.data.now.humidity
              this.$data.curPrs = data.data.now.pressure
              const weatherText = data.data.now.text
              const { weatherIsDay } = this.$data
              const getWeatherIcon = () => {
                switch (weatherText) {
                case '晴':
                  return weatherIsDay ? 'mdi-weather-sunny' : 'mdi-weather-night'
                case '多云':
                case '少云':
                case '阴':
                  return 'mdi-weather-cloudy'
                case '晴间多云':
                  return weatherIsDay ? 'mdi-weather-partly-cloudy' : 'mdi-weather-night-partly-cloudy'
                case '阵雨':
                case '强阵雨':
                  return 'mdi-weather-pouring'
                case '雷阵雨':
                case '强雷阵雨':
                case '雷阵雨伴有冰雹':
                  return 'mdi-weather-lightning-rainy'
                case '小雨':
                case '毛毛雨/细雨':
                case '小到中雨':
                case '雨':
                  return 'mdi-weather-rainy'
                case '中雨':
                case '大雨':
                case '极端降雨':
                case '暴雨':
                case '大暴雨':
                case '特大暴雨':
                case '中到大雨':
                case '大到暴雨':
                case '暴雨到大暴雨':
                case '大暴雨到特大暴雨':
                  return 'mdi-weather-pouring'
                case '阵雨夹雪':
                case '冻雨':
                  return 'mdi-weather-snowy-rainy'
                case '小雪':
                case '小到中雪':
                case '雪':
                  return 'mdi-weather-snowy'
                case '中雪':
                case '中到大雪':
                case '大雪':
                case '大到暴雪':
                case '阵雪':
                case '暴雪':
                  return 'mdi-weather-snowy-heavy'
                case '薄雾':
                  return 'mdi-weather-hazy'
                case '雾':
                case '浓雾':
                case '强浓雾':
                case '中度霾':
                case '重度霾':
                case '严重霾':
                case '大雾':
                case '特强浓雾':
                case '霾':
                  return 'mdi-weather-fog'
                case '扬沙':
                case '浮尘':
                case '沙尘暴':
                case '强沙尘暴':
                  return 'mdi-weather-dust'
                case '热':
                  return 'mdi-heat-wave'
                case '冷':
                  return 'mdi-snowflake-alert'
                case '未知':
                  return 'mdi-cloud-off-outline'
                }
              }
              const curWeatherIcon = getWeatherIcon()
              this.$data.curWeatherIcon = curWeatherIcon
              data.data.weatherIcon = curWeatherIcon
              returnData = data.data
            } else {
              this.$data.curWeatherIcon = 'mdi-weather-cloudy-alert'
              this.$data.curTemp = 'N/A °'
              this.$data.curPrs = '---- hPa'
              this.$data.curHumi = '-- %'
              data.data.error = true
              data.data.weatherIcon = this.$data.curWeatherIcon
              data.data.data = data.data
              returnData = data.data
            }
          }).catch(error => {
            console.error(error)
            this.$data.curWeatherIcon = 'mdi-weather-cloudy-alert'
            this.$data.curTemp = 'N/A °'
            this.$data.curPrs = '---- hPa'
            this.$data.curHumi = '-- %'
            const errorInstance = {}
            if (this.$data.isOnline === false) {
              errorInstance.error = true
              errorInstance.message = 'No Internet'
              errorInstance.object = error
              returnData = errorInstance
            } else {
              errorInstance.error = true
              errorInstance.message = 'Unknown Error'
              errorInstance.object = error
              returnData = errorInstance
            }
          })
        break
      default:
        errorInstance = {}
        errorInstance.error = true
        errorInstance.message = 'Invalid Weather API'
        returnData = errorInstance
        break
      }
      return returnData
    },
    getWeather () {
      // 确认当前时间
      const currentDate = new Date()
      this.$data.weatherIsDay =
        !(currentDate.getHours() >= 18 || currentDate.getHours() <= 6)
      const broadcastData = this.handleGetWeatherFromApi()
      broadcastData.action = 'SendWeatherData'
      const weatherUpdationChannel = new BroadcastChannel('DeltaClass.Components.Weather.Channel')
      weatherUpdationChannel.postMessage(broadcastData)
    },
    toggleWeatherCategory () {
      const curWeatherCategory = this.$data.currentWeatherShowing
      const fluentSwitch = target => {
        this.$data.currentWeatherShowing = null
        setTimeout(() => {
          this.$data.currentWeatherShowing = target
        }, 350)
      }
      switch (curWeatherCategory) {
      case 1:
      case 2:
        fluentSwitch(curWeatherCategory + 1)
        break
      case 3:
        fluentSwitch(1)
        break
      default:
        fluentSwitch(1)
        break
      }
    },
    setTransparentLevel (arg) {
      /* -#- Need to be refactored -#- */
      if (arg === 'transparent') {
        this.$refs.floatDiv.style.opacity = '30%'
        this.$refs.floatEdgeLeft.style.opacity = '30%'
        this.$refs.floatEdgeRight.style.opacity = '30%'
        this.$refs.floatLineLeft.style.borderTop = '3px solid rgba(255, 255, 255, 0.45)'
        this.$refs.floatLineLeft.style.borderLeft = '3px solid rgba(255, 255, 255, 0.45)'
        this.$refs.floatLineRight.style.borderTop = '3px solid rgba(255, 255, 255, 0.45)'
        this.$refs.floatLineRight.style.borderLeft = '3px solid rgba(255, 255, 255, 0.45)'
        this.$data.transparentLevel = 'transparent'
      } else if (arg === 'normal') {
        this.$refs.floatDiv.style.opacity = ''
        this.$refs.floatEdgeLeft.style.opacity = ''
        this.$refs.floatEdgeRight.style.opacity = ''
        this.$refs.floatLineLeft.style.borderTop = ''
        this.$refs.floatLineLeft.style.borderLeft = ''
        this.$refs.floatLineRight.style.borderTop = ''
        this.$refs.floatLineRight.style.borderLeft = ''
        this.$data.isTransparentManuallySet = false
        this.$data.transparentLevel = 'normal'
      }
    },
    toggleTransparentLevel () {
      if (!this.$data.isFloatBarUnderTransition) {
        if (this.$data.transparentLevel === 'normal') {
          this.$data.isFloatBarUnderTransition = true
          this.$refs.floatDiv.style.opacity = '30%'
          this.$refs.floatEdgeLeft.style.opacity = '30%'
          this.$refs.floatEdgeRight.style.opacity = '30%'
          this.$refs.floatLineLeft.style.borderTop = '3px solid rgba(255, 255, 255, 0.45)'
          this.$refs.floatLineLeft.style.borderLeft = '3px solid rgba(255, 255, 255, 0.45)'
          this.$refs.floatLineRight.style.borderTop = '3px solid rgba(255, 255, 255, 0.45)'
          this.$refs.floatLineRight.style.borderLeft = '3px solid rgba(255, 255, 255, 0.45)'
          this.$data.isTransparentManuallySet = true
          this.$data.transparentLevel = 'transparent'
          setTimeout(() => {
            this.$data.isFloatBarUnderTransition = false
          }, 600)
        } else if (this.$data.transparentLevel === 'transparent') {
          this.$data.isFloatBarUnderTransition = true
          this.$refs.floatDiv.style.opacity = ''
          this.$refs.floatEdgeLeft.style.opacity = ''
          this.$refs.floatEdgeRight.style.opacity = ''
          this.$refs.floatLineLeft.style.borderTop = ''
          this.$refs.floatLineLeft.style.borderLeft = ''
          this.$refs.floatLineRight.style.borderTop = ''
          this.$refs.floatLineRight.style.borderLeft = ''
          this.$data.isTransparentManuallySet = false
          this.$data.transparentLevel = 'normal'
          setTimeout(() => {
            this.$data.isFloatBarUnderTransition = false
          }, 600)
        }
      }
    },
    getGeneralSettings () {
      // To Be Done, getting the general settings of the floating bar.
    },
    checkTransparentSceneExists () {
      const activeWindow = require('active-win')
      const curActiveWindow = activeWindow.sync()
      // "Upload" the curActiveWindow info to localStorage
      const sendToIC = activeWindowInfo => {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        localStorageIC.activeWindow = activeWindowInfo
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
      }
      sendToIC(curActiveWindow)
      const curActiveWindowPath = curActiveWindow.owner.path
      const checkIfPathIsIn = pathLs => {
        let flag = false
        for (let i = 0; i < pathLs.length; i++) {
          if (curActiveWindowPath.includes(pathLs[i])) {
            flag = true
            break
          }
        }
        return flag
      }
      const isIncluded = checkIfPathIsIn(this.$data.autoTransparentScene)
      if (isIncluded && this.$data.transparentLevel !== 'transparent') {
        this.setTransparentLevel('transparent')
      } else if (!isIncluded && this.$data.transparentLevel === 'transparent' && this.$data.isTransparentManuallySet === false) {
        this.setTransparentLevel('normal')
      }
    },
    addOnClickedNum () {
      if (!this.$data.isFloatBarUnderTransition) { // Means user clicked on the background
        if (this.$data.backgroundClickedTime + 1 < this.$data.maxiumClickTime) {
          const curClickedTime = this.$data.backgroundClickedTime + 1
          this.$data.backgroundClickedTime += 1
          setTimeout(() => {
            if (this.$data.backgroundClickedTime === curClickedTime) {
              this.$data.backgroundClickedTime = 0 // Clear Clicked Time
            }
          }, 8000)
        } else if (this.$data.backgroundClickedTime + 1 >= this.$data.maxiumClickTime) {
          this.$data.backgroundClickedTime = 0
          this.createSwitchTransparentPopupWindow()
        }
      }
    },
    createSwitchTransparentPopupWindow () {
      const runCreate = () => {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        if (localStorageIC.drawBoard.mode !== 'choose') { return } // Not showing the window when user is drawing
        if (localStorageIC.tips.floatBar.transparentTip === true) { return } // Not showing the window when a window is already created
        localStorageIC.tips.floatBar.transparentTip = true
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
        let workAreaSize = {}
        workAreaSize = this.$electron.ipcRenderer.sendSync('message-from-renderer', {
          operation: 'get',
          data: {
            target: 'workAreaSize',
            identity: 'createTransparentTipWindow'
          }
        }) // Get screen size through IPC
        this.$electron.ipcRenderer.send('message-from-renderer', {
          operation: 'createWindow',
          data: {
            useTemplate: false,
            browserWindowOption: {
              height: parseInt(workAreaSize.height * 0.3375),
              width: parseInt(workAreaSize.width * 0.15), // Use static width, dyn calc in future
              x: parseInt((workAreaSize.width * 0.85) * 0.5),
              y: parseInt(workAreaSize.height * 0.0375 * 1.375),
              alwaysOnTop: true,
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
            },
            pageUri: '/popups/float/trans',
            windowName: 'floatTrsTipWindow'
          }
        }) // Create window
      }
      runCreate()
    },
    preventFullScreen () {
      document.onkeydown = function (event) {
        if (event.key === 'F11') {
          event.preventDefault()
        }
      }
    },
    resizeFactor () {
      this.$electron.ipcRenderer.send('message-from-renderer', {
        operation: 'automaticResetContentsFactor',
        data: {
          windowName: 'floatWindow'
        }
      })
    }
  }
}
</script>

<style>

.float-view-div {
  display: flex;
  background-color: rgba(255, 255, 255, 75%);
  height: 100vh;
  transition: all 0.6s;
  margin-left: 100vh;
  margin-right: 100vh;
}

.float-time-div {
  display: flex;
  padding-left: calc(100vw * 0.01);
  color: rgb(0, 0, 0);
  font-size: large;
}

.float-time-div p {
  margin-top: auto;
  margin-bottom: auto;
}

.float-logo {
  position: fixed;
  top: calc(100vh / 4);
  left: calc((100vw + 2px * 2 - 100vh / 2) / 2);
  max-height: calc(100vh / 2);
}

.float-status-div {
  display: flex;
  margin-left: calc(100vw * 0.015);
  margin-right: calc(100vw * 0.015);
}

.float-status-div .v-icon {
  color: rgb(0, 0, 0);
  margin-left: calc(100vw * 0.01);
}

.float-weather-div {
  margin-left: auto;
  color: rgb(0, 0, 0);
  display: flex;
}

.float-weather-div div {
  display: flex;
}

.float-weather-div p {
  margin-top: auto;
  margin-bottom: auto;
  margin-left: calc(100vw * 0.01);
  font-size: large;
}

.float-weather-div .v-icon {
  color: black;
}

.float-edge-left {
  /* height & width: 25 * (0.5 ** 2) */
  display: inline;
  position: fixed;
  left: 0;
  top: 0;
  background-color: transparent;
  border: calc(100vh / 2) solid transparent;
  border-right: calc(100vh / 2) solid rgba(255, 255, 255, 0.75);
  transition: all 0.6s;
}

.float-edge-right {
  /* height & width: 25 * (0.5 ** 2) */
  display: inline;
  position: fixed;
  right: 0;
  top: 0;
  background-color: transparent;
  border: calc(100vh / 2) solid transparent;
  border-left: calc(100vh / 2) solid rgba(255, 255, 255, 0.75);
  transition: all 0.6s;
}

.float-line-left {
  --sqrt-2: 1.414;
  display: inline;
  position: fixed;
  left: calc(100vh / 2 / 3 + 5px);
  top: calc(100vh / 2 / 3 - 1px);
  height: calc(100vh / 2 * var(--sqrt-2));
  width: calc(100vh / 2 * var(--sqrt-2));
  border-top: 3px solid rgba(255, 255, 255, 0.9);
  border-left: 3px solid rgba(255, 255, 255, 0.9);
  transform: rotate(315deg);
  transition: all 0.6s;
}

.float-line-right {
  --sqrt-2: 1.414;
  display: inline;
  position: fixed;
  right: calc(100vh / 2 / 3 + 5px);
  top: calc(100vh / 2 / 3 - 1px);
  height: calc(100vh / 2 * var(--sqrt-2));
  width: calc(100vh / 2 * var(--sqrt-2));
  border-bottom: 3px solid rgba(255, 255, 255, 0.9);
  border-right: 3px solid rgba(255, 255, 255, 0.9);
  transform: rotate(315deg);
  transition: all 0.6s;
}

</style>
