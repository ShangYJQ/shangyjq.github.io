<template>

  <v-container
    class="d-flex flex-column align-center justify-center"
  >

    <v-avatar
      class="elevation-4 mt-16"
      color="grey-lighten-3"
      :size="240"
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

    <v-text-field
      v-model="inputUserName"
      class="mt-16"
      label="username"
      rounded="rounded"
      style="width: 30%"
      variant="outlined"
      @keydown.enter="checkIogin"
    />

    <v-text-field
      v-model="inputPassWord"
      class="mt-2"
      label="password"
      rounded="rounded"
      style="width: 30%"
      variant="outlined"
      @keydown.enter="checkIogin"
    />

    <!--    <v-container>

      <v-dialog v-model="dialog" class="opacity-90" max-width="500">
        <v-card>
          <v-card-title class="headline">
            提示
          </v-card-title>
          <v-card-text>
            {{ showMsg }}
          </v-card-text>
          <v-card-actions>
            <v-spacer />
            <v-btn color="blue darken-1" text @click="dialog = false">
              关闭
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>-->

  </v-container>

</template>

<script lang="ts" setup>
//

  import { ref } from 'vue'
  import useSQL from '@/hooks/useSQL.ts'

  const inputUserName = ref<string>('')
  const inputPassWord = ref<string>('')

  function checkIogin () {}

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
