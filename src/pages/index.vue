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

    <v-container>

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
    </v-container>

  </v-container>

</template>

<script lang="ts" setup>
//

  import { ref } from 'vue'
  import { useAi } from '@/hooks/useAi.ts'

  const inputText = ref<string>('')

  const showMsg = ref<string>('空')

  const defaultMsg = 'Input'

  const dialog = ref<boolean>(false)

  const msgList = {
    杨佳琪: '这不就是我吗！',
    潘佳丽: '芜湖！爱你！',
    黄瑾: '快说，你把潘佳丽藏在哪里了？',
    柴犬: '真的没办法拒绝!',
  }

  async function enterDown () {
    const userInput = inputText.value // 先保存用户输入

    dialog.value = true
    // 检查是否是预设消息
    if (userInput in msgList) {
      showMsg.value = msgList[userInput as keyof typeof msgList]
    } else {
      showMsg.value = '思考中，请稍候...'

      const aiResult = await useAi(userInput)

      showMsg.value = aiResult || '抱歉，我遇到了一点问题，请稍后再试。'
    }

    console.log('Final showMsg.value:', showMsg.value) // 这里会打印出最终的字符串

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
