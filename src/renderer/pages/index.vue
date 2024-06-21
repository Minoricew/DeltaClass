<template>
  <div>
    <div class="index-basic-information">
      <div class="index-time-information">
        <p>{{ timeInfo.cHour }}</p>
        <span>:</span>
        <p>{{ timeInfo.cMin }}</p>
        <span class="sep-sec">:</span>
        <p class="time-sec">{{ timeInfo.cSec }}</p>
      </div>
      <IndexWeatherCard />
      <IndexMsgBoard />
      <IndexScheduleBoard />
    </div>
  </div>
</template>

<script>

export default {
  name: 'IndexPage',
  layout: 'main',
  transition: 'slide-x-transition',
  data () {
    return {
      timeInfo: {
        cDate: 0,
        cMonth: 0,
        cYear: 0,
        cDay: '八',
        cSec: '00',
        cMin: '00',
        cHour: '00'
      }
    }
  },
  mounted () {
    // Use 'requestAnimationFrame(func)' to achieve the target of actively refreshing time
    requestAnimationFrame(this.refreshTime)
    // Prevent fullscreen
    this.preventFullScreen()
    // Load Electron IPC
    const { ipcRenderer } = require('electron')
    // Resize Cur Factor
    this.resizeFactor(ipcRenderer)
  },
  methods: {
    refreshTime () {
      const date = new Date() // A Date object
      const { timeInfo } = this.$data // === this.$data.timeInfo
      const readableDate = this.generateReadableDate(date)
      const readableTime = this.generateReadableTime(date)
      Object.assign(timeInfo, readableDate) // Join the elements in readableDate into timeInfo(this.$data.timeInfo)
      Object.assign(timeInfo, readableTime) // Join the elements in readableTime into timeInfo(this.$data.timeInfo)
      requestAnimationFrame(this.refreshTime) // Request to execute this.refreshTime() on the next animation frame
    },
    generateReadableDate (date) {
      // Define a class, as the template to generate readable date
      class ReadableDate {
        // oXXX: originXXX(Input), cXXX: currentXXX(Output)
        constructor (oDay, oDate, oMonth, oYear) {
          this.cDay = () => {
            // Translate the original day into Chinese
            // Using switch to determine the cases
            switch (oDay) {
            case 0 :
              return '七'
            case 1:
              return '一'
            case 2:
              return '二'
            case 3:
              return '三'
            case 4:
              return '四'
            case 5:
              return '五'
            case 6:
              return '六'
            default:
              return '?'
            }
          }
          this.cDate = oDate
          this.cMonth = oMonth + 1 // The JS's Date object will return a number that is 1 less than the current's
          this.cYear = oYear
        }

        getDay () {
          return this.cDay
        }

        getDate () {
          return this.cDate
        }

        getMonth () {
          return this.cMonth
        }

        getYear () {
          return this.cYear
        }
      }
      const insert = [date.getDay(), date.getDate(), date.getMonth(), date.getFullYear()]
      const dateInfo = new ReadableDate(...insert) // Destructuring assignment of JS, see https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment
      return dateInfo
    },
    generateReadableTime (date) {
      // Define a class, as the template to generate readable time
      class ReadableTimeStringify {
        constructor (oHour, oMin, oSec) {
          const generateReadableTime = target => {
            target = String(target)
            return (target.split('').length === 1 ? '0' + target : target)
            /*
              How it works? ↑
              let target = '1'
              target.split('') --> ['1'] --> length === 1 (true) --> '0' + '1' --> '01' --> return '01'
            */
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
    preventFullScreen () {
      document.onkeydown = function (event) {
        if (event.key === 'F11') {
          event.preventDefault()
        }
      }
    },
    resizeFactor ($electronIpcRenderer) {
      $electronIpcRenderer.send('message-from-renderer', {
        operation: 'automaticResetContentsFactor',
        data: {
          windowName: 'mainWindow'
        }
      })
    }
  }
}

</script>

<style>

html {
  overflow: hidden;
}

body {
  margin: 0 !important;
  transform-style: preserve-3d;
  transform-origin: 640px 660px;
  transform: perspective(1000px) rotateY(-8deg);
}

.index-basic-information {
  width: 100%;
  text-align: center;
}

.index-time-information {
  margin: 20px auto 0 auto;
}

.sep-sec {
  font-size: 54px !important;
}

.index-time-information p {
  font-size: 105px;
  display: inline;
}

.index-time-information span {
  font-size: 98px;
  margin: auto 10px;
  opacity: 50%;
}

.time-sec {
  font-size: 64px !important;
  display: inline;
}

</style>
