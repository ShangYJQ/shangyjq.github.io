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
    />

    <v-text-field
      v-model="inputPassWord"
      class="mt-2"
      hint="Enter your password to access this website"
      label="password"
      rounded="rounded"
      style="width: 30%"
      variant="outlined"
    />

    <v-btn
      class="opacity-80 mt-12"
      :disabled="loading"
      :icon="mdiLogin"
      :loading="loading"
      size="x-large"
      variant="outlined"
      @click="clickLogin"
    />

  </v-container>

</template>

<script lang="ts" setup>
//

  import { mdiLogin } from '@mdi/js'
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import useSQL from '@/hooks/useSQL.ts'

  import { useAppStore } from '@/stores/app.ts'

  const inputUserName = ref<string>('')
  const inputPassWord = ref<string>('')

  const loading = ref(false)
  const router = useRouter()
  const appStore = useAppStore()

  async function clickLogin () {
    loading.value = true

    const value = [inputUserName.value]

    if (inputPassWord.value === '' || inputPassWord.value === '') {
      console.log('input first')
      loading.value = false
      return
    }

    const result = await useSQL('SELECT', value)
    const passwd = result[0]['passwd']
    if (inputPassWord.value === passwd) {
      console.log('Login')
      loading.value = false
      appStore.isLoggedIn = true
      await router.push('/main')
    }
  }

  watch(loading, val => {
    if (!val) return
    setTimeout(() => (loading.value = false), 5000)
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
