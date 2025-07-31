<template>
  <v-main>
    <FrostedGlassPanel
      alt="Background"
      :bg-src="webBg"
      height="100%"
      width="100%"
    >

      <router-view />

    </FrostedGlassPanel>

  </v-main>
  <AppFooter />

  <cursor />
  <Followcursor />
  <Sakura />
</template>

<script lang="ts" setup>
// Import静态资源

  import webBg from '@/assets/1.webp'
  import cursor from '@/components/Cursor.vue'
  import Followcursor from '@/components/FollowCursor.vue'
  import Sakura from '@/components/Sakura.vue'

</script>
