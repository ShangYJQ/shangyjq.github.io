import { useAppStore } from '@/stores/app'

// 将单一的 animationFrameId 替换为一个对象，用于存储每个属性的动画状态
const animationState: Record<string, number | null> = {}

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4)

type AnimatableProperty = 'bgBlur' | 'flower'

function animateProperty (property: AnimatableProperty, targetValue: number, duration = 2000) {
  const store = useAppStore()
  // 检查并取消该属性上一个正在进行的动画
  if (animationState[property]) {
    cancelAnimationFrame(animationState[property]!)
  }

  const startValue = store[property]
  const distance = targetValue - startValue

  if (distance === 0) {
    return
  }

  let startTime: number | null = null

  const animationLoop = (currentTime: number) => {
    if (!startTime) {
      startTime = currentTime
    }

    const elapsedTime = currentTime - startTime
    const progress = Math.min(elapsedTime / duration, 1)
    const easedProgress = easeOutQuart(progress)

    store[property] = startValue + distance * easedProgress

    if (progress < 1) {
      // 将动画ID存储在以属性名为键的对象中
      animationState[property] = requestAnimationFrame(animationLoop)
    } else {
      store[property] = targetValue
      // 动画完成，清除该属性的动画ID
      animationState[property] = null
    }
  }

  // 启动动画并将ID存储在对象中
  animationState[property] = requestAnimationFrame(animationLoop)
}

export function changeBlurTo (targetBlur: number, duration = 2000) {
  animateProperty('bgBlur', targetBlur, duration)
}

export function changeFlowerTo (targetFlower: number, duration = 2000) {
  animateProperty('flower', targetFlower, duration)
}
