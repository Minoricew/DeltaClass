<template>
  <div class="weather-card-root">
    <v-scroll-x-reverse-transition>
      <div v-if="isInternetConnected" transition="v-scroll-x-transition">
        <v-icon class="weather-ico" color="white" size="74">
          {{ currentWeatherIcon }}
        </v-icon>
        <p class="weather-p weather-p-temp">
          {{ currentWeatherTemperature }} °
        </p>
        <v-icon class="weather-ico-small" color="white" size="40">
          mdi-opacity
        </v-icon>
        <p class="weather-p weather-p-humi">
          {{ currentWeatherHumidity }} %
        </p>
        <v-icon class="weather-ico-small" color="white" size="40">
          mdi-heat-wave
        </v-icon>
        <p class="weather-p weather-p-humi">
          {{ currentWeatherHpa }} Hpa
        </p>
      </div>
    </v-scroll-x-reverse-transition>
    <v-scroll-x-reverse-transition>
      <div v-if="isNoInternetWarningShow" class="no-internet-div">
        <div class="no-internet-container">
          <v-icon size="64">mdi-progress-alert</v-icon>
          <div class="no-internet-para-container">
            <p class="no-internet-tips-title">请连接到 Internet</p>
            <p class="no-internet-tips-content">请允许 Delta·Class 访问 Internet。前往"Windows 设置"以修改设备网络配置。</p>
          </div>
        </div>
      </div>
    </v-scroll-x-reverse-transition>
  </div>
</template>

<script>
export default {
  name: 'WeatherCard',
  data: () => ({
    currentWeatherIcon: 'mdi-cloud-off-outline',
    currentWeatherTemperature: '--',
    currentWeatherHumidity: '--',
    currentWeatherHpa: '--',
    isDay: undefined,
    isInternetConnected: true,
    isNoInternetWarningShow: false
  }),
  mounted () {
    // Define weather updation listener
    const weatherUpdationChannel = new BroadcastChannel('DeltaClass.Components.Weather.Channel')
    weatherUpdationChannel.onmessage = e => {
      if (e.data.action === 'SendWeatherData') {
        this.getWeather(e)
      }
    }
    // Trigger a get at start
    weatherUpdationChannel.postMessage({ action: 'Get' })
  },
  methods: {
    getWeather (data) {
      // 确认当前时间
      const currentDate = new Date()
      if (currentDate.getHours() >= 18 || currentDate.getHours() <= 6) {
        this.$data.isDay = false
      } else {
        this.$data.isDay = true
      }
      // Get Weather Data
      // data --> e  data.data --> responseBody
      if (data.data !== undefined && data.data.code === '200') {
        if (this.$data.isInternetConnected === false) {
          this.$data.isNoInternetWarningShow = false
          setTimeout(() => { this.$data.isInternetConnected = true }, 300)
        }
        this.$data.currentWeatherResponseBody = data.data
        this.$data.currentWeatherTemperature = data.data.now.temp
        this.$data.currentWeatherHumidity = data.data.now.humidity
        this.$data.currentWeatherHpa = data.data.now.pressure
        this.$data.currentWeatherIcon = data.data.weatherIcon
      } else if (data.data.error === true && data.data.message === 'NoInternet') {
        const handleNoInternet = () => {
          this.$data.isInternetConnected = false
          setTimeout(() => {
            this.$data.isNoInternetWarningShow = true
          }, 300)
        }
        handleNoInternet()
      } else {
        this.$data.currentWeatherIcon = 'mdi-weather-cloudy-alert'
        this.$data.currentWeatherTemperature = 'N/A'
      }
    }
  }
}
</script>

<style>

.weather-card-root {
  height: 100px;
}

.weather-ico {
  margin-bottom: 28px;
}

.weather-ico-small {
  margin-bottom: 14px;
  opacity: 0.6;
}

.weather-p {
  display: inline;
}

.weather-p-temp {
  font-size: 54px;
  margin: auto 10px;
}

.weather-p-humi {
  font-size: 28px;
  margin: auto 10px;
  opacity: 0.5;
}

.no-internet-tips-title {
  font-size: xx-large;
  margin-bottom: 0 !important;
}

.no-internet-tips-content {
  font-size: small;
  opacity: 0.7;
  margin-bottom: 0 !important;
}

.no-internet-div {
  display: flex;
}

.no-internet-container {
  margin-left: auto;
  margin-right: auto;
  display: flex;
}

.no-internet-container .v-icon {
  margin-right: 25px;
}

.no-internet-para-container {
  text-align: left;
}

</style>
