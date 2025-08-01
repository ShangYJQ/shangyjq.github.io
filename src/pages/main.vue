<template>

  <div class="d-flex flex-fill fill-height flex-column">
    <SliderAlert ref="alertRef" />
    <p class="text-h4 font-weight-bold text-gradient">
      Hello, {{ username }}
    </p>

  </div>

  <audioPlayer />
</template>

<script setup lang="ts">
  import { onMounted, ref } from 'vue'

  import audioPlayer from '@/components/audioPlayer.vue'

  import SliderAlert from '@/components/silderAlert.vue'

  import Lover from '@/components/toLover.vue'
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

  const store = useAppStore()

  const username = store.username

  onMounted(() => {
    showSuccessMessage('Login success')
    changeFlowerTo(20, 50_000)
    changeBlurTo(0, 6000)
  })

</script>

<style scoped>
.text-gradient {
  background: linear-gradient(
    to right,
    #8e24aa, /* 紫色 */ #ff6e40 /* 橙色 */
  );

  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  display: inline-block;
}
</style>
