<template>

  <div class="d-flex flex-fill fill-height">
    <SliderAlert ref="alertRef" />
    <p class="mt-8 text-h4">
      Hello {{ username }}
    </p>

  </div>

  <audioPlayer />
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue'
  import { useRouter } from 'vue-router'

  import audioPlayer from '@/components/audioPlayer.vue'

  import SliderAlert from '@/components/silderAlert.vue'

  import { changeBlurTo, changeFlowerTo } from '@/hooks/useTranslateTo.ts'
  import { useAppStore } from '@/stores/app.ts'

  const alertRef = ref<InstanceType<typeof SliderAlert> | null>(null)

  const showSuccessMessage = (msg: string) => {
    // 确保 ref.value 存在 (组件已挂载)
    if (alertRef.value) {
      alertRef.value.sliderAlertShow(
        'success', // state
        'success', // title
        msg, // text
      )
    }
  }

  const router = useRouter()
  const store = useAppStore()

  const username = store.username

  onBeforeMount(() => {
    if (!store.isLoggedIn) {
      router.replace('/')
      console.log('Please login first')
    }
  })

  onMounted(() => {
    showSuccessMessage('Login success')
    changeFlowerTo(15, 50_000)
    changeBlurTo(0, 6000)
  })

</script>

<style scoped>

</style>
