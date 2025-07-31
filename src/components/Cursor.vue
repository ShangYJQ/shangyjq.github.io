<template>
  <div />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  onMounted(() => {
    // 定义 Circle 类，用于创建单个粒子
    class Circle {
      constructor ({ origin, speed, color, angle, context }) {
        this.origin = origin
        this.position = { ...this.origin }
        this.color = color
        this.speed = speed
        this.angle = angle
        this.context = context
        this.renderCount = 0
      }

      // 绘制粒子
      draw () {
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
        this.context.fill()
      }

      // 移动粒子
      move () {
        this.position.x = (Math.sin(this.angle) * this.speed) + this.position.x
        this.position.y = (Math.cos(this.angle) * this.speed) + this.position.y + (this.renderCount * 0.3)
        this.renderCount++
      }
    }

    // 定义 Boom 类，用于管理一次爆炸效果
    class Boom {
      constructor ({ origin, context, circleCount = 50, area }) {
        this.origin = origin
        this.context = context
        this.circleCount = circleCount
        this.area = area
        this.stop = false
        this.circles = []
      }

      // 从数组中随机选择一个元素
      randomArray (range) {
        const length = range.length
        const randomIndex = Math.floor(length * Math.random())
        return range[randomIndex]
      }

      // 生成随机颜色
      randomColor () {
        const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
      }

      // 生成指定范围内的随机数
      randomRange (start, end) {
        return (end - start) * Math.random() + start
      }

      // 初始化爆炸效果，创建所有粒子
      init () {
        for (let i = 0; i < this.circleCount; i++) {
          const circle = new Circle({
            context: this.context,
            origin: this.origin,
            color: this.randomColor(),
            angle: this.randomRange(Math.PI - 1, Math.PI + 1),
            speed: this.randomRange(1, 6),
          })
          this.circles.push(circle)
        }
      }

      // 移动所有粒子
      move () {
        for (const [index, circle] of this.circles.entries()) {
          // 如果粒子超出边界，则移除
          if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
            this.circles.splice(index, 1)
            continue
          }
          circle.move()
        }
        // 如果所有粒子都消失了，则停止动画
        if (this.circles.length === 0) {
          this.stop = true
        }
      }

      // 绘制所有粒子
      draw () {
        for (const circle of this.circles) {
          circle.draw()
        }
      }
    }

    // 定义 CursorSpecialEffects 类，管理整个特效
    class CursorSpecialEffects {
      constructor () {
        this.computerCanvas = document.createElement('canvas')
        this.renderCanvas = document.createElement('canvas')

        this.computerContext = this.computerCanvas.getContext('2d')
        this.renderContext = this.renderCanvas.getContext('2d')

        this.globalWidth = window.innerWidth
        this.globalHeight = window.innerHeight

        this.booms = []
        this.running = false
      }

      // 处理鼠标点击事件
      handleMouseDown (e) {
        const boom = new Boom({
          origin: { x: e.clientX, y: e.clientY },
          context: this.computerContext,
          area: {
            width: this.globalWidth,
            height: this.globalHeight,
          },
        })
        boom.init()
        this.booms.push(boom)
        // 如果动画未运行，则启动
        this.running || this.run()
      }

      // 处理页面隐藏事件
      handlePageHide () {
        this.booms = []
        this.running = false
      }

      // 初始化 Canvas 和事件监听
      init () {
        const style = this.renderCanvas.style
        style.position = 'fixed'
        style.top = style.left = 0
        style.zIndex = '999999999999999'
        style.pointerEvents = 'none'

        style.width = this.renderCanvas.width = this.computerCanvas.width = this.globalWidth
        style.height = this.renderCanvas.height = this.computerCanvas.height = this.globalHeight

        document.body.append(this.renderCanvas)

        window.addEventListener('mousedown', this.handleMouseDown.bind(this))
        window.addEventListener('pagehide', this.handlePageHide.bind(this))
      }

      // 动画循环
      run () {
        this.running = true
        if (this.booms.length === 0) {
          return this.running = false
        }

        requestAnimationFrame(this.run.bind(this))

        this.computerContext.clearRect(0, 0, this.globalWidth, this.globalHeight)
        this.renderContext.clearRect(0, 0, this.globalWidth, this.globalHeight)

        for (const [index, boom] of this.booms.entries()) {
          if (boom.stop) {
            this.booms.splice(index, 1)
            continue
          }
          boom.move()
          boom.draw()
        }
        this.renderContext.drawImage(this.computerCanvas, 0, 0, this.globalWidth, this.globalHeight)
      }
    }

    // 实例化并初始化特效
    const cursorSpecialEffects = new CursorSpecialEffects()
    cursorSpecialEffects.init()
  })
</script>

<style scoped>
/* 样式与 Vue 2 版本相同 */
</style>
