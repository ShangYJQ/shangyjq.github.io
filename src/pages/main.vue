<template>
  <h1>Login seccessfully!</h1>
</template>

<script setup lang="ts">
  import { onBeforeMount } from 'vue'
  import { useRouter } from 'vue-router'
  import { useAppStore } from '@/stores/app.ts'

  const router = useRouter()
  const store = useAppStore()

  onBeforeMount(() => {
    if (!store.isLoggedIn) {
      router.replace('/')
      console.log('Please login first')
    }
  })

</script>

<style scoped>

</style>
