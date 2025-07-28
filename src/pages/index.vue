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
      v-model="inputText"
      class="mt-16"
      :label="defaultMsg"
      rounded="rounded"
      style="width: 30%"
      variant="outlined"
      @keydown.enter="enterDown"
    />

  </v-container>

</template>

<script lang="ts" setup>
//

  import { ref } from 'vue'

  const inputText = ref<string>('')

  const showMsg = ref<string>('空')

  const defaultMsg = 'Input'

  const msgList = {
    杨佳琪: '这不就是我吗！',
    潘佳丽: '芜湖！爱你！',
  }

  function enterDown () {
    showMsg.value = inputText.value in msgList ? msgList[inputText.value as keyof typeof msgList] : '你好！'
    console.log(showMsg.value)
    inputText.value = ''
  }

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
