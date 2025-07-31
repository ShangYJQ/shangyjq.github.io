<template>
  <h1>Hello {{ username }}</h1>
  <audioPlayer />
</template>

<script setup lang="ts">
  import { onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import audioPlayer from '@/components/audioPlayer.vue'

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

</script>

<style scoped>

</style>
