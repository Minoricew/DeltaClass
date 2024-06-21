<template>
  <div id="canvasApp">
    <canvas id="canvas" ref="canvas" />
    <img ref="eraser" draggable="false" class="drawboard-eraser" src="~/assets/img/eraser.png" width="40" height="80">
  </div>
</template>

<script>
export default {
  data () {
    return {
      canvas: null,
      ctx: null,
      mode: 'draw',
      color: 'black',
      isDrawing: false,
      lastX: 0,
      lastY: 0
    }
  },
  mounted () {
    this.$data.canvas = this.$refs.canvas
    this.$data.ctx = this.$data.canvas.getContext('2d')
    this.$data.canvas.width = window.innerWidth
    this.$data.canvas.height = window.innerHeight
    this.$data.canvas.addEventListener('touchstart', e => {
      if (this.$data.mode === 'erase') {
        this.$refs.eraser.style.visibility = 'visible'
        this.$refs.eraser.classList.add('draw-board-eraser-show')
        this.$refs.eraser.style.left = e.pageX - 20 + 'px'
        this.$refs.eraser.style.top = e.pageY - 40 + 'px'
      }
    })
    this.$data.canvas.addEventListener('mousedown', e => {
      if (this.$data.mode === 'erase') {
        this.$refs.eraser.style.visibility = 'visible'
        this.$refs.eraser.classList.add('draw-board-eraser-show')
        this.$refs.eraser.style.left = e.pageX - 20 + 'px'
        this.$refs.eraser.style.top = e.pageY - 40 + 'px'
      }
    })
    this.$data.canvas.addEventListener('mouseup', _e => {
      this.hideEraserImage()
    })
    this.$data.canvas.addEventListener('mouseout', _e => {
      this.hideEraserImage()
    })
    this.$data.canvas.addEventListener('mousedown', _e => {
      this.hideColorPicker()
    })
    this.$data.canvas.addEventListener('touchstart', _e => {
      this.hideColorPicker()
    })
    this.$data.canvas.addEventListener('mousedown', this.startDrawing)
    this.$data.canvas.addEventListener('touchstart', e => {
      e.preventDefault()
      this.startTouchDrawing(e)
    })
    this.$data.canvas.addEventListener('mousemove', this.draw)
    this.$data.canvas.addEventListener('touchmove', this.touchDraw)
    this.$data.canvas.addEventListener('mouseup', this.stopDrawing)
    this.$data.canvas.addEventListener('touchend', _e => {
      this.hideEraserImage()
      this.stopDrawing()
    })
    this.$data.canvas.addEventListener('mouseout', this.stopDrawing)
    setInterval(this.getLocalStorageIC, 100)
  },
  methods: {
    startDrawing (e) {
      this.$data.isDrawing = true
      this.$data.lastX = e.offsetX
      this.$data.lastY = e.offsetY
    },
    startTouchDrawing (e) {
      this.$data.isDrawing = true
      const touch = e.touches[0]
      const x = touch.pageX
      const y = touch.pageY
      this.$data.lastX = x
      this.$data.lastY = y
    },
    draw (e) {
      if (!this.$data.isDrawing) return
      this.$data.ctx.strokeStyle = this.color
      this.$data.ctx.lineWidth = 4
      this.$data.ctx.lineCap = 'round'
      this.$data.ctx.lineJoin = 'round'
      if (this.$data.mode === 'draw') {
        this.$data.ctx.globalCompositeOperation = 'source-over'
        this.$data.ctx.beginPath()
        this.$data.ctx.moveTo(this.$data.lastX, this.$data.lastY)
        this.$data.ctx.lineTo(e.offsetX, e.offsetY)
        this.$data.ctx.stroke()
      } else if (this.mode === 'erase') {
        this.$data.ctx.globalCompositeOperation = 'destination-out'
        this.$data.ctx.lineWidth = 80
        this.$data.ctx.beginPath()
        this.$data.ctx.moveTo(this.$data.lastX, this.$data.lastY)
        this.$data.ctx.lineTo(e.pageX, e.pageY)
        this.$data.ctx.stroke()
        this.$data.ctx.fill()
        this.$data.ctx.closePath()
        this.$refs.eraser.style.left = e.pageX - 20 + 'px'
        this.$refs.eraser.style.top = e.pageY - 40 + 'px'
      }
      this.$data.lastX = e.offsetX
      this.$data.lastY = e.offsetY
    },
    touchDraw (e) {
      if (!this.$data.isDrawing) return
      const touch = e.touches[0]
      const x = touch.pageX
      const y = touch.pageY
      this.$data.ctx.strokeStyle = this.color
      this.$data.ctx.lineWidth = 4
      this.$data.ctx.lineCap = 'round'
      this.$data.ctx.lineJoin = 'round'
      if (this.$data.mode === 'draw') {
        this.$data.ctx.globalCompositeOperation = 'source-over'
        this.$data.ctx.beginPath()
        this.$data.ctx.moveTo(this.$data.lastX, this.$data.lastY)
        this.$data.ctx.lineTo(x, y)
        this.$data.ctx.stroke()
        this.$data.ctx.closePath()
      } else if (this.mode === 'erase') {
        this.$data.ctx.globalCompositeOperation = 'destination-out'
        this.$data.ctx.lineWidth = 80
        this.$data.ctx.beginPath()
        this.$data.ctx.moveTo(this.$data.lastX, this.$data.lastY)
        this.$data.ctx.lineTo(x, y)
        this.$data.ctx.stroke()
        this.$data.ctx.fill()
        this.$data.ctx.closePath()
        this.$refs.eraser.style.left = x - 20 + 'px'
        this.$refs.eraser.style.top = y - 40 + 'px'
      }
      this.$data.lastX = x
      this.$data.lastY = y
    },
    stopDrawing () {
      this.$data.isDrawing = false
    },
    getLocalStorageIC () {
      let localStorageIC = localStorage.getItem('ic')
      if (
        localStorageIC !== null &&
        localStorageIC !== undefined &&
        typeof localStorageIC === 'string'
      ) {
        localStorageIC = JSON.parse(localStorageIC)
        this.$data.mode = localStorageIC.drawBoard.mode
        this.$data.color = localStorageIC.drawBoard.color
        if (this.$data.mode === 'clear') {
          this.$data.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
          this.$data.mode = 'choose'
          localStorageIC.drawBoard.mode = 'choose'
          localStorage.setItem('ic', JSON.stringify(localStorageIC))
          this.hideColorPicker()
        }
      }
    },
    hideEraserImage () {
      this.$data.isDrawing = false
      if (this.$data.mode === 'erase') {
        this.$refs.eraser.classList.remove('draw-board-eraser-show')
        setTimeout(() => {
          this.$refs.eraser.style.visibility = 'hidden'
        }, 150)
      }
    },
    hideColorPicker () {
      const localStorageIC = JSON.parse(localStorage.getItem('ic'))
      if (localStorageIC.drawBoard.isColorPickerShow === true) {
        localStorageIC.drawBoard.isColorPickerClosing = true
        localStorage.setItem('ic', JSON.stringify(localStorageIC))
      }
    }
  }
}
</script>

<style>

#canvasApp {
  max-height: 100vh;
  overflow-y: hidden;
}

#canvas {
  cursor: crosshair;
  z-index: 100;
}

.drawboard-eraser {
  position: absolute;
  opacity: 0;
  transition: opacity 0.15s;
}

.draw-board-eraser-show {
  opacity: 1 !important;
  z-index: -1;
}

</style>
