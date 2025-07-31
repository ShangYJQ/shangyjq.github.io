<template>

  <v-container
    class="d-flex flex-column align-center justify-center"
  >

    <SliderAlert ref="alertRef" />
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

    <v-text-field
      v-model="inputUserName"
      class="mt-16"
      label="username"
      rounded="rounded"
      style="width: 340px"
      variant="outlined"
    />

    <v-text-field
      v-model="inputPassWord"
      class="mt-2"
      hint="Enter your password to access this website"
      label="password"
      rounded="rounded"
      style="width: 340px"
      variant="outlined"
    />

    <v-btn
      class="opacity-80 mt-9"
      :disabled="loading"
      :icon="btnImg"
      :loading="loading"
      size="x-large"
      variant="outlined"
      @click="btnImg===mdiLogin?clickLogin():clickRegister()"
    />

    <v-btn
      class="bottom-right-btn"
      variant="plain"
      @click="btnImg===mdiAccountPlusOutline?btnImg=mdiLogin:btnImg=mdiAccountPlusOutline"
    >
      {{ btnImg === mdiLogin ? "Don't have an account? Sign in" : "Already have an account? Sign up" }}
    </v-btn>

  </v-container>

</template>

<script lang="ts" setup>
//

  import { mdiAccountPlusOutline, mdiLogin } from '@mdi/js'
  import { ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import SliderAlert from '@/components/silderAlert.vue'

  import useSQL from '@/hooks/useSQL.ts'

  import { useAppStore } from '@/stores/app.ts'

  const inputUserName = ref<string>('')
  const inputPassWord = ref<string>('')

  const loading = ref(false)
  const router = useRouter()
  const appStore = useAppStore()

  const btnImg = ref(mdiLogin)

  const alertRef = ref<InstanceType<typeof SliderAlert> | null>(null)

  const showSuccessMessage = (msg: string) => {
    // 确保 ref.value 存在 (组件已挂载)
    if (alertRef.value) {
      alertRef.value.sliderAlertShow(
        'success', // state
        'success', // title
        msg, // text
      )
    }
  }

  const showErrorMessage = (msg: string) => {
    if (alertRef.value) {
      alertRef.value.sliderAlertShow(
        'error',
        'error',
        msg,
      )
    }
  }

  async function clickLogin () {
    loading.value = true

    const value = [inputUserName.value]

    if (inputPassWord.value === '' || inputPassWord.value === '') {
      showErrorMessage('Please input first')
      console.log('input first')
      loading.value = false
      return
    }

    const result = await useSQL('SELECT', value)

    if (result.length === 0) {
      showErrorMessage('Please register first')
      console.log('register first')

      loading.value = false
      return
    }

    const passwd = result[0]['passwd']
    if (inputPassWord.value === passwd) {
      showSuccessMessage('Login successful')
      console.log('Login')
      loading.value = false
      appStore.isLoggedIn = true
      appStore.username = inputUserName.value
      await router.push('/main')
    } else {
      loading.value = false
      console.log('password error')
      showErrorMessage('password error')
    }
  }

  async function clickRegister () {
    const value = [inputUserName.value, inputPassWord.value]
    if (inputPassWord.value === '' || inputPassWord.value === '') {
      showErrorMessage('Please input first')
      console.log('Please input first')
    }

    const tmp = await useSQL('SELECT', [inputUserName.value])
    if (tmp.length > 0) {
      showErrorMessage('You already have an account? Sign in')
      console.log('You already have an account? Sign in')
      loading.value = false
      return
    }
    const result = await useSQL('INSERT', value)
    if (result['affectedRows'] === 1) {
      showSuccessMessage('Register successful')
      console.log('Register successfully')
    } else {
      showErrorMessage('Register failed')
      console.log('Register failed')
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

.bottom-right-btn {
  position: absolute;
  bottom: 5px;
  right: 10px;

  font-size: 9px;
  color: #888;
}

</style>
