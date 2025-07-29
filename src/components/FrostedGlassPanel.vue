<template>
  <div
    class="frosted-panel-container"
    :style="{
      width: width,
      height: height,
      borderRadius: borderRadiusInPx
    }"
  >
    <!-- 1. 背景图片层 -->
    <v-img
      :alt="alt"
      class="bg-image"
      cover
      eager
      :src="bgSrc"
    />

    <!-- 2. 高斯模糊叠加层 -->
    <div
      class="frosted-overlay"
      :style="{
        backdropFilter: `blur(${blur}px)`,
        '-webkit-backdrop-filter': `blur(${blur}px)`,
        backgroundColor: overlayColor,
        borderRadius: borderRadiusInPx,
        padding: paddingInPx
      }"
    >
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue'
  const props = defineProps({
    bgSrc: {
      type: String,
      required: true,
    },
    alt: {
      type: String,
      default: 'Background Image',
    },
    blur: {
      type: Number,
      default: 10,
    },
    overlayColor: {
      type: String,
      default: 'rgba(21,21,21,0.25)',
    },
    width: {
      type: String,
      default: '350px',
    },
    height: {
      type: String,
      default: '500px',
    },
    borderRadius: {
      type: Number,
      default: 0,
    },
    padding: {
      type: Number,
      default: 24,
    },
  })

  const borderRadiusInPx = computed(() => `${props.borderRadius}px`)
  const paddingInPx = computed(() => `${props.padding}px`)

</script>

<style scoped>
.frosted-panel-container {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.bg-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
}

.frosted-overlay {
  position: relative;
  z-index: 2;
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
