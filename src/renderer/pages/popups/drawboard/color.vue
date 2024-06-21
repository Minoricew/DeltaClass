<template>
  <div class="colorpicker-root">
    <div ref="colorPickerContainer" class="colorpicker-container">
      <div class="colorpicker-head-container">
        <p class="colorpicker-title">调整画笔</p>
        <v-btn class="colorpicker-close" icon small color="rgba(12, 12, 12, 0.9)" @click="closeWindow()">
          <v-icon size="20">mdi-close</v-icon>
        </v-btn>
      </div>
      <p class="colorpicker-hr" />
      <p class="colorpicker-subset-category-title">颜色</p>
      <div class="colorpicker-color-picker-container">
        <v-btn
          v-for="color in colors"
          :key="color.id"
          :class="curColorSelected === color.color ? 'colorpicker-color-btn-selected colorpicker-color-btn' : 'colorpicker-color-btn'"
          :color="color.color"
          icon
          small
          @click="setColor(color.color)"
        >
          <v-icon>mdi-circle</v-icon>
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DrawBoardColorSettingsPage',
  layout: 'popups',
  data () {
    return {
      colors: [
        {
          id: 1,
          name: 'Nakabeni',
          color: '#DB4D6D'
        },
        {
          id: 2,
          name: 'Kohbai',
          color: '#E16B8C'
        },
        {
          id: 3,
          name: 'Momo',
          color: '#F596AA'
        },
        {
          id: 4,
          name: 'Sakura',
          color: '#FEDFE1'
        },
        {
          id: 5,
          name: 'Benihi',
          color: '#F75C2F'
        },
        {
          id: 6,
          name: 'Yamabuki',
          color: '#FFB11B'
        },
        {
          id: 7,
          name: 'Tamago',
          color: '#F9BF45'
        },
        {
          id: 8,
          name: 'Ominaeshi',
          color: '#DDD23B'
        },
        {
          id: 9,
          name: 'Hiwa',
          color: '#BEC23F'
        },
        {
          id: 10,
          name: 'Hiwamoegi',
          color: '#90B44B'
        },
        {
          id: 11,
          name: 'Nae',
          color: '#86C166'
        },
        {
          id: 12,
          name: 'Yanagizome',
          color: '#91AD70'
        },
        {
          id: 13,
          name: 'Aomidori',
          color: '#00AA90'
        },
        {
          id: 14,
          name: 'Mizuasagi',
          color: '#66BAB7'
        },
        {
          id: 15,
          name: 'Asagi',
          color: '#33A6B8'
        },
        {
          id: 16,
          name: 'Hanaasagi',
          color: '#1E88A8'
        },
        {
          id: 17,
          name: 'Sora',
          color: '#58B2DC'
        },
        {
          id: 18,
          name: 'Benimidori',
          color: '#7B90D2'
        },
        {
          id: 19,
          name: 'Kikyo',
          color: '#6A4C9C'
        },
        {
          id: 20,
          name: 'Ayame',
          color: '#6F3381'
        },
        {
          id: 21,
          name: 'Futaai',
          color: '#70649A'
        },
        {
          id: 22,
          name: 'Namari',
          color: '#787878'
        },
        {
          id: 23,
          name: 'Matte Black',
          color: '#0C0C0C'
        },
        {
          id: 24,
          name: 'Snow',
          color: '#FFFAFA'
        }
      ],
      curColorSelected: '#DB4D6D'
    }
  },
  mounted () {
    const localStorageIC = JSON.parse(localStorage.getItem('ic'))
    this.$data.curColorSelected = localStorageIC.drawBoard.color
    localStorageIC.drawBoard.isColorPickerShow = true
    localStorageIC.drawBoard.isColorPickerClosing = false
    localStorage.setItem('ic', JSON.stringify(localStorageIC))
    setTimeout(() => {
      const { ipcRenderer } = require('electron')
      ipcRenderer.send('message-from-renderer', {
        operation: 'setAlwaysOnTopDynWin',
        data: {
          windowName: 'DrawBoardColorSettingWindow',
          target: true,
          type: 'pop-up-window'
        }
      })
      this.showPickerContainer()
    }, 50)
    setInterval(() => {
      this.judgeAutoCloseEvent()
    }, 100)
  },
  methods: {
    showPickerContainer () {
      this.$refs.colorPickerContainer.style.opacity = '1'
      this.$refs.colorPickerContainer.style.marginTop = '0'
    },
    closeWindow () {
      this.$refs.colorPickerContainer.style.opacity = '0'
      this.$refs.colorPickerContainer.style.marginTop = '60px'
      setTimeout(() => {
        const localStorageIC = JSON.parse(localStorage.getItem('ic'))
        localStorageIC.drawBoard.isColorPickerShow = false
        localStorageIC.drawBoard.isColorPickerClosing = false
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
        const { ipcRenderer } = require('electron')
        ipcRenderer.send('message-from-renderer', {
          operation: 'showWindow',
          data: {
            windowName: 'drawBoardWindow'
          }
        })
        window.close()
        ipcRenderer.send('message-from-renderer', {
          operation: 'closeDynWindow',
          data: {
            windowName: 'DrawBoardColorSettingWindow'
          }
        })
      }, 350)
    },
    setColor (color) {
      this.$data.curColorSelected = color
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      localStorageIC.drawBoard.color = color
      localStorage.setItem('ic', JSON.stringify(localStorageIC))
    },
    judgeAutoCloseEvent () {
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      if (localStorageIC.drawBoard.mode === 'erase' || localStorageIC.drawBoard.mode === 'choose') {
        this.closeWindow()
      }
      if (localStorageIC.drawBoard.isColorPickerClosing === true) {
        this.closeWindow()
      }
    }
  }
}
</script>

<style>

.colorpicker-container {
  background-color: rgba(255, 255, 255, 0.8);
  height: 95vh;
  width: 100vw;
  opacity: 0;
  margin-top: 60px;
  transition: all 0.25s;
  border-radius: 7px;
  text-align: center;
  color: rgb(0, 0, 0);
}

.colorpicker-head-container {
  display: flex;
}

.colorpicker-title {
  margin-left: 20px;
  margin-right: auto;
  font-size: 16px;
  margin-top: 12px;
  margin-bottom: 12px !important;
  font-weight: 200;
}

.colorpicker-close {
  margin-right: 20px;
}

.colorpicker-hr {
  margin-left: auto;
  margin-right: auto;
  width: 90%;
  background-color: rgba(0, 0, 0, 0.15);
  margin-top: 0 !important;
  margin-bottom: 0 !important;
  height: 1px;
}

.colorpicker-subset-category-title {
  margin-left: 20px;
  margin-top: 12px;
  margin-bottom: 6px !important;
  font-weight: 100;
  font-size: small;
  text-align: left;
}

.colorpicker-color-btn {
  margin-top: 2px !important;
  margin-bottom: 2px !important;
  transition: all 0.05s;
  border: 0px solid transparent;
}

.colorpicker-color-btn-selected {
  border: 2px solid #2d9df8;
}

</style>
