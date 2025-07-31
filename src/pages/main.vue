<template>

  <div class="d-flex flex-fill fill-height">

    <p class="mt-8 text-h4">
      Hello {{ username }}
    </p>

    <!--    <v-img class="mt-16" :src="imgShow" />-->

  </div>

  <audioPlayer />
</template>

<script setup lang="ts">
  import { onBeforeMount, onMounted } from 'vue'
  import { useRouter } from 'vue-router'

  import audioPlayer from '@/components/audioPlayer.vue'

  import { changeBlurTo, changeFlowerTo } from '@/hooks/useTranslateTo.ts'

  import { useAppStore } from '@/stores/app.ts'

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
    changeFlowerTo(15, 50_000)
    changeBlurTo(0, 6000)
  })

</script>

<style scoped>

</style>
