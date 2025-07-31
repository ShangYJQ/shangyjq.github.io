<template>
  <canvas id="canvas_sakura" ref="canvasRef" />
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted, ref } from 'vue'
  import sakuraImage from '@/assets/sakura.png'
  import { useAppStore } from '@/stores/app.ts'

  const store = useAppStore()

  const sakuraCount = computed(() => {
    console.log('flower:', store.flower)
    return store.flower
  })

  const canvasRef = ref<HTMLCanvasElement | null>(null)
  let animationFrameId: number | null = null
  const img = new Image()

  // 定义樱花移动函数的类型
  type SakuraMovementFunctions = {
    x: (x: number, y: number) => number
    y: (x: number, y: number) => number
    r: (r: number) => number
  }

  class Sakura {
    x: number
    y: number
    s: number // size
    r: number // rotation
    fn: SakuraMovementFunctions

    constructor (x: number, y: number, s: number, r: number, fn: SakuraMovementFunctions) {
      this.x = x
      this.y = y
      this.s = s
      this.r = r
      this.fn = fn
    }

    draw (cxt: CanvasRenderingContext2D): void {
      cxt.save()
      cxt.translate(this.x, this.y)
      cxt.rotate(this.r)
      // 根据大小绘制图片
      cxt.drawImage(img, 0, 0, 40 * this.s, 40 * this.s)
      cxt.restore()
    }

    update (): void {
      this.x = this.fn.x(this.x, this.y)
      this.y = this.fn.y(this.y, this.y) // 注意：原始代码这里都是y，保留此行为
      this.r = this.fn.r(this.r)

      // 如果花瓣超出边界，则重置其位置
      if (this.x > window.innerWidth || this.x < 0 || this.y > window.innerHeight || this.y < 0) {
        this.r = getRandom('fnr')(this.r) // 使用新的随机旋转函数
        if (Math.random() > 0.4) {
          this.x = getRandom('x')
          this.y = 0
          this.s = getRandom('s')
          this.r = getRandom('r')
        } else {
          this.x = window.innerWidth
          this.y = getRandom('y')
          this.s = getRandom('s')
          this.r = getRandom('r')
        }
      }
    }
  }

  class SakuraList {
    list: Sakura[] = []

    push (sakura: Sakura): void {
      this.list.push(sakura)
    }

    pop (): void {
      this.list.pop()
    }

    update (): void {
      for (const sakura of this.list) sakura.update()
    }

    draw (cxt: CanvasRenderingContext2D): void {
      for (const sakura of this.list) sakura.draw(cxt)
    }

    size (): number {
      return this.list.length
    }
  }

  // 使用函数重载为 getRandom 提供更强的类型推断
  function getRandom (option: 'x' | 'y' | 's' | 'r'): number
  function getRandom (option: 'fnx' | 'fny'): (a: number, b: number) => number
  function getRandom (option: 'fnr'): (r: number) => number
  function getRandom (option: string): any { // 实现签名使用 any 或联合类型
    let ret, random
    switch (option) {
      case 'x': {
        ret = Math.random() * window.innerWidth
        break
      }
      case 'y': {
        ret = Math.random() * window.innerHeight
        break
      }
      case 's': {
        ret = Math.random()
        break
      }
      case 'r': {
        ret = Math.random() * 6
        break
      }
      case 'fnx': {
        random = -0.5 + Math.random() * 1
        ret = (x: number, y: number) => x + 0.5 * random - 1.7
        break
      }
      case 'fny': {
        random = 1.5 + Math.random() * 0.7
        ret = (x: number, y: number) => y + random
        break
      }
      case 'fnr': {
        random = Math.random() * 0.03
        ret = (r: number) => r + random
        break
      }
    }
    return ret
  }

  const startSakura = (): void => {
    const canvas = canvasRef.value
    if (!canvas) return

    const cxt = canvas.getContext('2d')
    if (!cxt) {
      console.error('Failed to get 2D context from canvas.')
      return
    }

    const sakuraList = new SakuraList()

    const frame = (): void => {
      cxt.clearRect(0, 0, canvas.width, canvas.height)

      const targetCount = Math.floor(sakuraCount.value)

      while (sakuraList.size() < targetCount) {
        const sakura = new Sakura(
          getRandom('x'),
          getRandom('y'),
          getRandom('s'),
          getRandom('r'),
          { x: getRandom('fnx'), y: getRandom('fny'), r: getRandom('fnr') },
        )
        sakuraList.push(sakura)
      }

      while (sakuraList.size() > targetCount) {
        sakuraList.pop()
      }

      sakuraList.update()
      sakuraList.draw(cxt)
      animationFrameId = window.requestAnimationFrame(frame)
    }

    animationFrameId = window.requestAnimationFrame(frame)
  }

  const handleResize = (): void => {
    const canvas = canvasRef.value
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
  }

  onMounted(() => {
    const canvas = canvasRef.value
    if (!canvas) {
      console.error('Sakura canvas element not found on mount!')
      return
    }

    canvas.style.position = 'fixed'
    canvas.style.left = '0'
    canvas.style.top = '0'
    canvas.style.pointerEvents = 'none'
    canvas.style.zIndex = '9999'

    handleResize()
    window.addEventListener('resize', handleResize)

    img.src = sakuraImage
    img.addEventListener('load', () => {
      startSakura()
    })
  })

  onUnmounted(() => {
    if (animationFrameId) {
      window.cancelAnimationFrame(animationFrameId)
    }
    window.removeEventListener('resize', handleResize)
  })
</script>

<style scoped>
/* 样式已在 JS/TS 中动态设置 */
</style>
