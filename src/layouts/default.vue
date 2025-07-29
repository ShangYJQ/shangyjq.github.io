<template>
  <v-main>
    <FrostedGlassPanel
      alt="Background"
      :bg-src="bgImg"
      height="100%"
      width="100%"
    >

      <router-view />

    </FrostedGlassPanel>

  </v-main>
  <AppFooter />
</template>

<script lang="ts" setup>
// Import静态资源

  import bgImg from '@/assets/alpha.png'
</script>
