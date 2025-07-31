<template>
  <div />
</template>
<script setup lang="js">
  import { onMounted, onUnmounted } from 'vue'

  // 将在 onMounted 中添加的事件监听器函数保存在这里，以便在 onUnmounted 中移除它们
  const listeners = []
  // 保存 requestAnimationFrame 的 ID，以便取消
  let animationFrameId
  // 保存粒子数组，以便在卸载时清理
  let particles = []

  onMounted(() => {
    let width = window.innerWidth
    let height = window.innerHeight
    const cursor = { x: width / 2, y: width / 2 }

    /**
     * 新增：生成随机的半透明 RGBA 颜色
     * @returns {string} RGBA 颜色字符串，例如 "rgba(255, 100, 50, 0.7)"
     */
    function randomRgbaColor () {
      const r = Math.floor(Math.random() * 256) // 随机红色值
      const g = Math.floor(Math.random() * 256) // 随机绿色值
      const b = Math.floor(Math.random() * 256) // 随机蓝色值
      const alpha = Math.random() * 0.4 + 0.1 // 随机透明度 (0.2 到 0.7 之间)
      return `rgba(${r}, ${g}, ${b}, ${alpha})`
    }

    // 粒子类
    function Particle () {
      this.lifeSpan = 100 // ms
      this.initialStyles = {
        'position': 'fixed',
        'top': '0',
        'display': 'block',
        'pointerEvents': 'none',
        'zIndex': '10000000',
        'will-change': 'transform',
        // 新增：将元素变为圆形
        'borderRadius': '50%',
      }

      // 初始化，并设置属性
      this.init = function (x, y) {
        this.velocity = {
          x: (Math.random() < 0.5 ? -1 : 1) * (Math.random() / 2),
          y: 1,
        }

        // 新增：为气泡设置随机大小
        const size = Math.random() * 20 + 10 // 大小在 5px 到 20px 之间
        this.initialStyles['width'] = `${size}px`
        this.initialStyles['height'] = `${size}px`

        // 修改：位置偏移量应基于气泡大小，使鼠标位于气泡中心
        this.position = { x: x - size / 2, y: y - size / 2 }

        // 修改：创建 div 元素作为气泡，而不是 span
        this.element = document.createElement('div')

        // 新增：应用随机背景色
        this.element.style.backgroundColor = randomRgbaColor()

        applyProperties(this.element, this.initialStyles)
        this.update()

        document.body.append(this.element)
      }

      this.update = function () {
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y
        this.lifeSpan--

        // 修改：transform 的缩放效果现在作用于气泡，使其平滑消失
        this.element.style.transform = `translate3d(${this.position.x}px, ${this.position.y}px, 0) scale(${this.lifeSpan / 120})`
      }

      this.die = function () {
        if (this.element.parentNode) {
          this.element.remove()
        }
      }
    }

    // 工具函数：应用 CSS 属性
    function applyProperties (target, properties) {
      for (const key in properties) {
        target.style[key] = properties[key]
      }
    }

    // --- 事件处理函数 ---
    function onWindowResize () {
      width = window.innerWidth
      height = window.innerHeight
    }

    function onTouchMove (e) {
      if (e.touches.length > 0) {
        for (let i = 0; i < e.touches.length; i++) {
          // 修改：不再需要传递 emoji 字符
          addParticle(e.touches[i].clientX, e.touches[i].clientY)
        }
      }
    }

    function onMouseMove (e) {
      cursor.x = e.clientX
      cursor.y = e.clientY
      // 修改：不再需要传递 emoji 字符
      addParticle(cursor.x, cursor.y)
    }

    // --- 核心逻辑 ---
    // 修改：不再需要 character 参数
    function addParticle (x, y) {
      const particle = new Particle()
      particle.init(x, y)
      particles.push(particle)
    }

    function updateParticles () {
      // 更新粒子
      for (const particle of particles) {
        particle.update()
      }

      // 移除生命周期结束的粒子
      for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].lifeSpan < 0) {
          particles[i].die()
          particles.splice(i, 1)
        }
      }
    }

    function loop () {
      animationFrameId = requestAnimationFrame(loop)
      updateParticles()
    }

    // 绑定事件
    function bindEvents () {
      const mouseMoveListener = { target: document, type: 'mousemove', handler: onMouseMove }
      const touchMoveListener = { target: document, type: 'touchmove', handler: onTouchMove }
      const touchStartListener = { target: document, type: 'touchstart', handler: onTouchMove }
      const resizeListener = { target: window, type: 'resize', handler: onWindowResize }

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
