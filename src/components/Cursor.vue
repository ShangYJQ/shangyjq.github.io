<template>
  <div />
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  onMounted(() => {
    // --- 类型定义 ---
    interface Point {
      x: number
      y: number
    }

    interface Area {
      width: number
      height: number
    }

    interface CircleConstructorParams {
      origin: Point
      speed: number
      color: string
      angle: number
      context: CanvasRenderingContext2D
    }

    interface BoomConstructorParams {
      origin: Point
      context: CanvasRenderingContext2D
      area: Area
      circleCount?: number
    }

    // --- Class 定义 ---

    class Circle {
      // 明确声明所有类属性及其类型
      origin: Point
      position: Point
      color: string
      speed: number
      angle: number
      context: CanvasRenderingContext2D
      renderCount: number

      constructor ({ origin, speed, color, angle, context }: CircleConstructorParams) {
        this.origin = origin
        this.position = { ...this.origin }
        this.color = color
        this.speed = speed
        this.angle = angle
        this.context = context
        this.renderCount = 0
      }

      draw (): void {
        this.context.fillStyle = this.color
        this.context.beginPath()
        this.context.arc(this.position.x, this.position.y, 2, 0, Math.PI * 2)
        this.context.fill()
      }

      move (): void {
        this.position.x = Math.sin(this.angle) * this.speed + this.position.x
        this.position.y = Math.cos(this.angle) * this.speed + this.position.y + this.renderCount * 0.3
        this.renderCount++
      }
    }

    class Boom {
      // 明确声明所有类属性及其类型
      origin: Point
      context: CanvasRenderingContext2D
      circleCount: number
      area: Area
      stop: boolean
      circles: Circle[]

      constructor ({ origin, context, circleCount = 50, area }: BoomConstructorParams) {
        this.origin = origin
        this.context = context
        this.circleCount = circleCount
        this.area = area
        this.stop = false
        this.circles = []
      }

      randomArray<T>(range: T[]): T {
        const randomIndex = Math.floor(range.length * Math.random())
        return range[randomIndex]
      }

      randomColor (): string {
        const range = ['8', '9', 'A', 'B', 'C', 'D', 'E', 'F']
        return '#' + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range) + this.randomArray(range)
      }

      randomRange (start: number, end: number): number {
        return (end - start) * Math.random() + start
      }

      init (): void {
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

      move (): void {
        for (const [index, circle] of this.circles.entries()) {
          if (circle.position.x > this.area.width || circle.position.y > this.area.height) {
            this.circles.splice(index, 1)
            continue
          }
          circle.move()
        }
        if (this.circles.length === 0) {
          this.stop = true
        }
      }

      draw (): void {
        for (const circle of this.circles) {
          circle.draw()
        }
      }
    }

    class CursorSpecialEffects {
      // 明确声明所有类属性及其类型
      computerCanvas: HTMLCanvasElement
      renderCanvas: HTMLCanvasElement
      computerContext: CanvasRenderingContext2D | null
      renderContext: CanvasRenderingContext2D | null
      globalWidth: number
      globalHeight: number
      booms: Boom[]
      running: boolean

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

      handleMouseDown (e: MouseEvent): void {
        if (!this.computerContext) return // 安全检查

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
        if (!this.running) {
          this.run()
        }
      }

      handlePageHide (): void {
        this.booms = []
        this.running = false
      }

      init (): void {
        const style = this.renderCanvas.style
        style.position = 'fixed'
        style.top = '0'
        style.left = '0'
        style.zIndex = '999999999999999'
        style.pointerEvents = 'none'

        style.width = this.globalWidth + 'px'
        this.renderCanvas.width = this.globalWidth
        this.computerCanvas.width = this.globalWidth
        style.height = this.globalHeight + 'px'
        this.renderCanvas.height = this.globalHeight
        this.computerCanvas.height = this.globalHeight

        document.body.append(this.renderCanvas)

        window.addEventListener('mousedown', this.handleMouseDown.bind(this))
        window.addEventListener('pagehide', this.handlePageHide.bind(this))
      }

      run (): void {
        if (this.booms.length === 0) {
          this.running = false
          return
        }
        this.running = true

        // 安全检查
        if (!this.computerContext || !this.renderContext) {
          this.running = false
          return
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
/* 你的样式保持不变 */
</style>
