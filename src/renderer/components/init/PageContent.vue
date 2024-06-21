<template>
  <div class="init-container">
    <img ref="initLogo" src="~/assets/img/delta_white.png" class="init-logo">
    <p ref="welcomeText" class="init-welcome-text"> 欢迎使用 Delta·Class </p>
    <p ref="progressBar" class="init-progress-bar" />
    <p ref="curProgressText" class="init-cur-progress-text">{{ curProgressText }}</p>
  </div>
</template>

<script>
export default {
  name: 'InitPageContent',
  data () {
    return {
      curProgressText: '',
      progressBarPercent: null
    }
  },
  watch: {
    progressBarPercent (newPercent, _oldPercent) {
      this.$refs.progressBar.style.width = (100 * newPercent).toString() + '%'
    }
  },
  mounted () {
    setTimeout(() => {
      this.showPageContent()
    }, 400)
  },
  methods: {
    showPageContent () {
      this.$refs.initLogo.style.opacity = '1'
      this.$refs.initLogo.style.transform = 'scale(1)'
      setTimeout(() => {
        this.$refs.welcomeText.style.opacity = '1'
        setTimeout(() => {
          this.$refs.welcomeText.style.opacity = '0'
        }, 50)
        setTimeout(() => {
          this.$refs.welcomeText.style.opacity = '1'
        }, 100)
        setTimeout(() => {
          this.$refs.welcomeText.style.opacity = '0'
        }, 150)
        setTimeout(() => {
          this.$refs.welcomeText.style.opacity = '1'
        }, 200)
      }, 350)
      setTimeout(() => {
        this.$refs.progressBar.style.width = '100%'
        this.$refs.progressBar.style.opacity = '1'
        setTimeout(() => {
          this.$refs.progressBar.style.opacity = '0'
        }, 150)
        setTimeout(() => {
          this.$refs.progressBar.style.opacity = '1'
        }, 300)
        setTimeout(() => {
          this.$refs.progressBar.style.opacity = '0'
        }, 400)
        setTimeout(() => {
          this.$refs.progressBar.style.opacity = '1'
        }, 500)
      }, 800)
      setTimeout(() => {
        this.editProgressText('准备执行设备设置')
      }, 1200)
      setTimeout(() => {
        this.attachDeviceInit()
      }, 1400)
    },
    editProgressText (target) {
      const sleep = time => new Promise(resolve => setTimeout(resolve, time))
      const splitedTarget = target.split('')
      const editText = async () => {
        for (let i = 0; i < splitedTarget.length; i++) {
          await sleep(50)
          this.$data.curProgressText += splitedTarget[i]
        }
      }
      editText()
    },
    easeInOutEditProgressText (target) {
      this.$refs.curProgressText.style.opacity = '0'
      setTimeout(() => {
        this.$data.curProgressText = target
        this.$refs.curProgressText.style.opacity = '0.5'
      }, 150)
    },
    easeInOutEditProgressTextFast (target) {
      this.$refs.curProgressText.style.transition = 'opacity 0.075s'
      this.$refs.curProgressText.style.opacity = '0'
      setTimeout(() => {
        this.$data.curProgressText = target
        this.$refs.curProgressText.style.opacity = '0.5'
      }, 75)
      this.$refs.curProgressText.style.transition = 'opacity 0.15s'
    },
    async attachDeviceInit () {
      const { ipcRenderer } = require('electron')
      // 你说得对, 但假加载只是为了好看, 感觉不会影响多少用户体验
      this.$refs.progressBar.style.marginRight = 0
      this.$refs.progressBar.style.marginLeft = 0
      await this.sleep(1000)
      this.$data.progressBarPercent = 0
      await this.sleep(50)
      this.$refs.progressBar.style.transition = 'width 0.3s'
      this.easeInOutEditProgressText('准备读取环境配置')
      await this.sleep(800)
      this.$data.progressBarPercent = 0.05
      await this.sleep(800)
      this.$data.progressBarPercent = 0.1
      await this.sleep(700)
      this.$data.curProgressText = '正在检查配置文件是否存在'
      let isExists = false
      const awaitForIsExists = new Promise(resolve => {
        this.$storage.isExists('settings', returnValue => {
          if (returnValue.isError) {
            isExists = false
          } else {
            isExists = returnValue.data
          }
          resolve()
        })
      })
      await awaitForIsExists
      await this.sleep(500)
      if (!isExists) {
        this.$data.progressBarPercent = 0.12
        this.$data.curProgressText = '正在创建新的配置文件'
        this.$storage.setData('settings', {}, async error => {
          console.error(error)
          this.easeInOutEditProgressText('出现错误, 请重启 Delta·Class')
          this.$data.progressBarPercent = 1
          await this.sleep(10000)
          window.close()
        })
        await this.sleep(300)
        this.$data.progressBarPercent = 0.15
        this.$data.curProgressText = '配置文件创建成功'
      } else {
        this.$data.progressBarPercent = 0.15
        this.$data.curProgressText = '配置文件已存在'
      }
      await this.sleep(1000)
      let settingsData = {}
      try {
        settingsData = this.$storage.getData('settings')
      } catch {
        // Do Nothing
      }
      this.$data.curProgressText = '配置文件信息获取成功'
      this.$data.progressBarPercent = 0.175
      await this.sleep(800)
      this.easeInOutEditProgressText('正在初始化配置文件信息')
      // Init Phase: Init config
      this.easeInOutEditProgressText('正在更新配置')
      this.$data.progressBarPercent = 0.2
      await this.sleep(1000)
      this.initSettingsConfig()
      this.easeInOutEditProgressText('配置更新成功, 待写入')
      this.$data.progressBarPercent = 0.8
      await this.sleep(800)
      this.$data.curProgressText = '标记设备为已完成初始化'
      settingsData.isFirstBoot = 0
      this.$storage.setData('settings', settingsData)
      await this.sleep(250)
      this.$data.curProgressText = '标记成功, 已提交配置修改'
      this.$data.progressBarPercent = 0.95
      await this.sleep(250)
      this.easeInOutEditProgressText('完成')
      this.$data.progressBarPercent = 1
      await this.sleep(500)
      this.easeInOutEditProgressTextFast('完成')
      await this.sleep(1500)
      let timeRemain = 9
      this.easeInOutEditProgressText('Delta·Class 将在 10 s 后重启以继续')
      await this.sleep(1000)
      while (timeRemain >= 0) {
        this.$data.curProgressText = 'Delta·Class 将在 ' + timeRemain.toString() + ' s 后重启以继续'
        this.$data.progressBarPercent = timeRemain * 0.1
        if (timeRemain === 0) {
          this.$refs.initLogo.style.opacity = '0'
          this.$refs.initLogo.style.transform = 'scale(1.5)'
          this.$refs.welcomeText.style.opacity = '0'
          this.$parent.$refs.initBackgroundAnimationComponent.$refs.initBackground.style.top = '-50vh'
          this.$parent.$refs.initBackgroundAnimationComponent.$refs.initBackground.style.left = '100vw'
          this.$refs.curProgressText.style.opacity = '0'
        }
        timeRemain -= 1
        await this.sleep(1000)
      }
      ipcRenderer.send('message-from-renderer', {
        operation: 'relaunch'
      })
    },
    sleep (time) {
      return new Promise(resolve => setTimeout(resolve, time))
    },
    stuck () {
      return new Promise(resolve => {
        while (false) {
          resolve()
        }
      })
    },
    initSettingsConfig () {
      const curConfig = this.$storage.getData('settings')
      let target = curConfig
      // Init General Config
      if (curConfig === undefined) {
        target = {}
      }
      const getNested = (obj, ...args) => {
        return args.reduce((obj, level) => obj && obj[level], obj)
      }
      const setProperty = (obj, path, value) => {
        const [head, ...rest] = path.split('.')
        if (rest.length) {
          if (!obj[head]) obj[head] = {}
          setProperty(obj[head], rest.join('.'), value)
        } else {
          obj[head] = value
        }
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const setDefault = (path, value) => {
        const result = getNested(target, ...path.split('.'))
        if (result === undefined) {
          setProperty(target, path, value)
        }
      }
      /* setDefault('', 1) */
      // To Be Done
      this.$storage.setData('settings', target)
    }
  }
}
</script>

<style>

.init-container {
  width: 100vw;
  height: 100vh;
  text-align: center;
}

.init-logo {
  margin-left: auto;
  margin-right: auto;
  margin-top: 5.5%;
  margin-bottom: 2.75%;
  transform: scale(1.5);
  opacity: 0;
  max-width: 40px;
  transition: all 0.5s;
}

.init-welcome-text {
  font-family: 'BlenderPro';
  color: white;
  font-size: x-large;
  opacity: 0;
}

.init-progress-bar {
  margin-top: 5.5%;
  margin-left: auto;
  margin-right: auto;
  background-color: rgba(255, 255, 255, 0.7);
  opacity: 0;
  height: 3px;
  width: 20px;
  transition: width 0.5s;
}

.init-cur-progress-text {
  margin-top: 4.5%;
  opacity: 0.5;
  transition: opacity 0.15s;
}

</style>
