<template>

  <v-container
    class="d-flex flex-column align-center justify-center"
  >

    <v-avatar
      class="elevation-4 mt-12"
      color="grey-lighten-3"
      :size="230"
    >
      <v-img
        alt="ShangYJQ"
        cover
        src="@/assets/ShangYJQ.jpg"
      />
    </v-avatar>

    <div class="mt-16 text-center">
      <h2 class="text-h3 font-weight-bold text-gradient">ShangYJQ</h2>
    </div>

    <Login />

  </v-container>

</template>

<script lang="ts" setup>
//

  import { onMounted } from 'vue'
  import Login from '@/components/Login.vue'
  import { changeBlurTo, changeFlowerTo } from '@/hooks/useTranslateTo.ts'

  onMounted(() => {
    changeBlurTo(100, 4000)
    changeFlowerTo(0, 10)
  })

</script>

<style scoped>

.text-gradient {
  background-image: linear-gradient(45deg, #2b4dff 0%, #ff0202 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 1px 1px 2px rgb(120, 35, 145);
}

</style>
