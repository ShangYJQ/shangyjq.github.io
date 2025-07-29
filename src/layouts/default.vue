<template>
  <v-main>
    <FrostedGlassPanel
      alt="Background"
      :bg-src="imgSrc"
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

  import { getAssetsFile } from '@/utils/pub-use.ts'

  const imgSrc = getAssetsFile('alpha.png')

</script>
