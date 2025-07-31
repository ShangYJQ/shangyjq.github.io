<template>
  <div class="elegant-mini-player">
    <audio
      ref="audioPlayer"
      autoplay
      :src="audioSrc"
      @ended="onEnded"
      @loadedmetadata="onLoadedMetadata"
      @pause="onPause"
      @play="onPlay"
      @timeupdate="onTimeUpdate"
    />
    <v-btn density="compact" :icon="isPlaying ? mdiPause : mdiPlay" variant="text" @click="togglePlay" />
    <span class="time-display text-caption">{{ formattedCurrentTime }}</span>
    <v-slider
      v-model="currentTime"
      class="progress-slider mx-2"
      density="compact"
      hide-details
      :max="duration"
      :step="1"
      @update:model-value="seek"
    />
    <v-btn density="compact" :icon="volumeIcon" variant="text" @click="toggleMute" />
  </div>
</template>

<script setup lang="ts">
  import { mdiPause, mdiPlay, mdiVolumeHigh, mdiVolumeMedium, mdiVolumeOff } from '@mdi/js'
  import { computed, ref } from 'vue'
  import audioFile from '@/assets/audio/major.flac'

  const audioPlayer = ref<HTMLAudioElement | null>(null)
  const audioSrc = ref(audioFile)
  const isPlaying = ref(false)
  const currentTime = ref(0)
  const duration = ref(0)
  const volume = ref(0.75)
  let lastVolume = 0.75
  const togglePlay = () => {
    if (!audioPlayer.value) return
    isPlaying.value = !isPlaying.value
    if (isPlaying.value) {
      audioPlayer.value.play()
    } else {
      audioPlayer.value.pause()
    }
  }
  const seek = (time: number) => {
    if (!audioPlayer.value) return
    audioPlayer.value.currentTime = time
  }
  const toggleMute = () => {
    if (!audioPlayer.value) return
    if (audioPlayer.value.volume > 0) {
      lastVolume = audioPlayer.value.volume
      audioPlayer.value.volume = 0
    } else {
      audioPlayer.value.volume = lastVolume > 0 ? lastVolume : 0.75
    }
  }
  const onLoadedMetadata = () => {
    if (!audioPlayer.value) return
    duration.value = audioPlayer.value.duration
    audioPlayer.value.volume = volume.value
  }
  const onTimeUpdate = () => {
    if (!audioPlayer.value) return
    currentTime.value = audioPlayer.value.currentTime
    volume.value = audioPlayer.value.volume
  }
  const onEnded = () => {
    isPlaying.value = false
    currentTime.value = 0
  }

  const onPlay = () => {
    isPlaying.value = true
  }

  const onPause = () => {
    isPlaying.value = false
  }

  const formatTime = (seconds: number): string => {
    if (Number.isNaN(seconds) || seconds === 0) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  const formattedCurrentTime = computed(() => formatTime(currentTime.value))
  const volumeIcon = computed(() => {
    if (volume.value > 0.5) return mdiVolumeHigh
    if (volume.value > 0) return mdiVolumeMedium
    return mdiVolumeOff
  })
</script>
<style scoped>
.elegant-mini-player {
  position: fixed;
  top: 16px;
  left: 16px;
  z-index: 2000;
  background-color: transparent;
  border: 1px solid rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 0 10px;
  border-radius: 50px;
  height: 38px;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8);
}

.time-display {
  min-width: 40px;
  text-align: center;
  font-weight: 500;
}

.progress-slider {
  min-width: 40px;
  max-width: 80px;
  color: white;
}

.elegant-mini-player :deep(.v-btn) {
  color: inherit;
}
</style>
