<template>
  <div />
</template>

<script setup lang="ts">
  import { onMounted, onUnmounted } from 'vue'

  // --- 类型定义 ---

  // 用于坐标
  interface Point {
    x: number
    y: number
  }

  // 用于存储事件监听器信息
  interface StoredListener {
    target: Window | Document
    type: string
    handler: (event: Event) => void
  }

  // --- 粒子类 ---

  class Particle {
    // 属性定义
    lifeSpan: number
    initialStyles: Partial<CSSStyleDeclaration>
    velocity: Point
    position: Point
    element: HTMLDivElement

    constructor () {
      this.lifeSpan = 120 // 生命周期
      this.velocity = { x: 0, y: 0 }
      this.position = { x: 0, y: 0 }
      this.element = document.createElement('div')
      this.initialStyles = {
        position: 'fixed',
        top: '0',
        display: 'block',
        pointerEvents: 'none',
        zIndex: '10000000',
        willChange: 'transform',
        borderRadius: '50%',
      }
    }

    /**
     * 初始化粒子
     * @param x 初始 x 坐标
     * @param y 初始 y 坐标
     */
    public init (x: number, y: number): void {
      this.velocity = {
        x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
        y: 1,
      }

      const size = Math.random() * 20 + 10
      this.initialStyles.width = `${size}px`
      this.initialStyles.height = `${size}px`

      this.position = { x: x - size / 2, y: y - size / 2 }

      this.element.style.backgroundColor = this.randomRgbaColor()
      this.applyProperties(this.element, this.initialStyles)
      this.update() // 立即应用一次位置

      document.body.append(this.element)
    }

    /**
     * 更新粒子的位置和状态
     */
    public update (): void {
      this.position.x += this.velocity.x
      this.position.y += this.velocity.y
      this.lifeSpan--

      this.element.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0) scale(${this.lifeSpan / 120})`
    }

    /**
     * 从 DOM 中移除粒子元素
     */
    public die (): void {
      this.element.remove()
    }

    /**
     * 生成随机的半透明 RGBA 颜色
     * @returns {string} RGBA 颜色字符串
     */
    private randomRgbaColor (): string {
      const r = Math.floor(Math.random() * 256)
      const g = Math.floor(Math.random() * 256)
      const b = Math.floor(Math.random() * 256)
      const alpha = Math.random() * 0.4 + 0.1
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    /**
     * 将 CSS 属性应用到目标元素
     * @param target HTML 元素
     * @param properties 要应用的 CSS 属性对象
     */
    private applyProperties (target: HTMLElement, properties: Partial<CSSStyleDeclaration>): void {
      for (const key in properties) {
        // 使用 'as any' 来绕过严格的 CSS 属性键检查
        (target.style as any)[key] = properties[key]
      }
    }
  }

  // --- Vue 组件逻辑 ---

  const listeners: StoredListener[] = []
  let animationFrameId: number | null = null
  let particles: Particle[] = []

  onMounted(() => {
    const cursor: Point = { x: window.innerWidth / 2, y: window.innerHeight / 2 }

    // --- 事件处理函数 ---

    function onWindowResize (): void {
    // 当前实现不需要在此处处理
    }

    function onTouchMove (e: TouchEvent): void {
      for (let i = 0; i < e.touches.length; i++) {
        addParticle(e.touches[i].clientX, e.touches[i].clientY)
      }
    }

    function onMouseMove (e: MouseEvent): void {
      cursor.x = e.clientX
      cursor.y = e.clientY
      addParticle(cursor.x, cursor.y)
    }

    // --- 核心逻辑 ---

    function addParticle (x: number, y: number): void {
      const particle = new Particle()
      particle.init(x, y)
      particles.push(particle)
    }

    function updateParticles (): void {
      for (const particle of particles) {
        particle.update()
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].lifeSpan < 0) {
          particles[i].die()
          particles.splice(i, 1)
        }
      }
    }

    function loop (): void {
      animationFrameId = requestAnimationFrame(loop)
      updateParticles()
    }

    function bindEvents (): void {
      const mouseMoveListener: StoredListener = {
        target: document,
        type: 'mousemove',
        handler: e => onMouseMove(e as MouseEvent),
      }
      const touchMoveListener: StoredListener = {
        target: document,
        type: 'touchmove',
        handler: e => onTouchMove(e as TouchEvent),
      }
      const touchStartListener: StoredListener = {
        target: document,
        type: 'touchstart',
        handler: e => onTouchMove(e as TouchEvent),
      }
      const resizeListener: StoredListener = { target: window, type: 'resize', handler: onWindowResize }

      listeners.push(mouseMoveListener, touchMoveListener, touchStartListener, resizeListener)

      for (const listener of listeners) {
        listener.target.addEventListener(listener.type, listener.handler)
      }
    }

    // 初始化
    bindEvents()
    loop()
  })

  onUnmounted(() => {
    // 移除所有事件监听器
    for (const listener of listeners) {
      listener.target.removeEventListener(listener.type, listener.handler)
    }

    // 取消动画帧
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId)
    }

    // 清理屏幕上所有剩余的粒子
    for (const particle of particles) {
      particle.die()
    }
    particles = [] // 清空数组
  })
</script>

<style scoped>
/* 样式与之前版本相同 */
</style>
