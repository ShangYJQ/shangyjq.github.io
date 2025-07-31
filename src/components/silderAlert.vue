<template>
  <div class="alert-container">
    <v-slide-x-reverse-transition>
      <v-alert
        v-if="showSuccessAlert"
        class="ma-4"
        :close-icon="mdiClose"
        :icon="showIcon"
        :text="showText"
        :title="showTitle"
        :type="showType"
        variant="elevated"
        @click:close="showSuccessAlert = false"
      />
    </v-slide-x-reverse-transition>
  </div>
</template>
<script setup lang="ts">
  import { mdiAlertCircleOutline, mdiCheckBold, mdiClose } from '@mdi/js'

  import { ref } from 'vue'

  const showSuccessAlert = ref(false)
  const showText = ref('')
  const showTitle = ref('')
  const showType = ref<'error' | 'success' | 'warning' | 'info'>('success')

  const showIcon = ref(mdiCheckBold)

  const triggerSuccess = (timeOut: number) => {
    showSuccessAlert.value = true

    setTimeout(() => {
      showSuccessAlert.value = false
    }, timeOut)
  }

  function sliderAlertShow (state: 'error' | 'success' | 'warning' | 'info', title: string, text: string) {
    triggerSuccess(3000)
    showTitle.value = title
    showType.value = state
    showText.value = text
    if (state === 'success') {
      showIcon.value = mdiCheckBold
    } else if (state === 'error') {
      showIcon.value = mdiAlertCircleOutline
    }
  }
  defineExpose({ sliderAlertShow })
</script>
<style scoped>
.alert-container {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9999;
  width: 100%;
  max-width: 25%;
  pointer-events: none;
}

</style>
