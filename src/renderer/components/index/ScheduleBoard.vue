<template>
  <div>
    <div class="daily-schedule-container">
      <div class="daily-schedule-liner">
        <div>
          <p> {{ firstClass }} </p>
          <p> {{ secondClass }} </p>
          <p> {{ thirdClass }} </p>
          <p> {{ fourthClass }} </p>
          <p> {{ fifthClass }} </p>
        </div>
        <v-icon size="52">mdi-weather-sunset-up</v-icon>
        <span class="daily-schedule-hr" />
        <v-icon size="52">mdi-weather-sunset-down</v-icon>
        <div>
          <p> {{ sixthClass }} </p>
          <p> {{ seventhClass }} </p>
          <p> {{ eighthClass }} </p>
          <p> {{ ninthClass }} </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleBoard',
  data: () => ({
    curScheduleInfo: {
      1: { id: 1, 1: '晨会', 2: '政治', 3: '化学', 4: '数学', 5: '语文', 6: '地理', 7: '英语', 8: '体育', 9: '通技' },
      2: { id: 2, 1: '语文', 2: '物理', 3: '历史', 4: '英语', 5: '数学', 6: '政治', 7: '音乐', 8: '生物', 9: '班会' },
      3: { id: 3, 1: '历史', 2: '化学', 3: '信技', 4: '政治', 5: '地理', 6: '数学', 7: '心理', 8: '物理', 9: '活动' },
      4: { id: 4, 1: '英语', 2: '生物', 3: '数学', 4: '体育', 5: '历史', 6: '语文', 7: '选修', 8: '选修', 9: '活动' },
      5: { id: 5, 1: '化学', 2: '英语', 3: '语文', 4: '地理', 5: '数学', 6: '物理', 7: '生物', 8: '社团', 9: '自习' },
      6: { id: 6, 1: '数学', 2: '数学', 3: '数学', 4: '数学', 5: '数学', 6: '数学', 7: '数学', 8: '数学', 9: '数学' },
      7: { id: 7, 1: '', 2: '', 3: '', 4: '', 5: '', 6: '数学', 7: '数学', 8: '数学', 9: '数学' }
    },
    firstClass: '数学',
    secondClass: '数学',
    thirdClass: '数学',
    fourthClass: '数学',
    fifthClass: '数学',
    sixthClass: '数学',
    seventhClass: '数学',
    eighthClass: '数学',
    ninthClass: '数学'
  }),
  mounted () {
    this.updateScheduleInfo()
    setInterval(() => {
      this.updateScheduleInfo()
    }, 3600000)
  },
  methods: {
    updateScheduleInfo () {
      this.readScheduleInfoFromLocalStorage()
      const dateIns = new Date()
      const curDay = dateIns.getDay()
      if (curDay === 0) {
        this.applyScheduleToVars(this.$data.curScheduleInfo[7])
      } else {
        this.applyScheduleToVars(this.$data.curScheduleInfo[curDay])
      }
    },
    applyScheduleToVars (scheduleObj) {
      this.$data.firstClass = scheduleObj[1]
      this.$data.secondClass = scheduleObj[2]
      this.$data.thirdClass = scheduleObj[3]
      this.$data.fourthClass = scheduleObj[4]
      this.$data.fifthClass = scheduleObj[5]
      this.$data.sixthClass = scheduleObj[6]
      this.$data.seventhClass = scheduleObj[7]
      this.$data.eighthClass = scheduleObj[8]
      this.$data.ninthClass = scheduleObj[9]
    },
    readScheduleInfoFromLocalStorage () {
      const scheduleInfoStored = window.localStorage.getItem('scheduleInfo')
      if (scheduleInfoStored === '' || scheduleInfoStored === null) {
        // Set schedule info as the default obj
        window.localStorage.setItem('scheduleInfo', JSON.stringify(this.$data.curScheduleInfo))
        return 'Use default.'
      } else {
        // Apply schedule info
        this.$data.curScheduleInfo = JSON.parse(scheduleInfoStored)
        return 'Applied.'
      }
    }
  }
}
</script>

<style>

.daily-schedule-liner {
  display: flex;
}

.daily-schedule-container {
  margin: auto;
}

.daily-schedule-liner div {
  margin-top: 20px;
  margin-left: auto;
  margin-right: auto;
}

.daily-schedule-container p {
  font-size: 28px;
}

.daily-schedule-hr {
  margin-top: 15px;
  min-height: 280px;
  min-width: 3px;
  background-color: rgba(255, 255, 255, 70%);
}

.daily-schedule-liner .v-icon {
  margin-left: 50px;
  margin-right: 50px;
  color: white;
}

</style>
