<template>
  <div class="media-player">
    <iframe
      v-if="cleanUrl"
      :src="cleanUrl"
      frameborder="0"
      allow="autoplay; fullscreen; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  url: String
})

const cleanUrl = computed(() => {
  if (!props.url) return ''
  let cleaned = props.url
  
  const quoteIndex = cleaned.indexOf('"')
  if (quoteIndex !== -1) {
    cleaned = cleaned.substring(0, quoteIndex)
  }
  
  const bracketIndex = cleaned.indexOf('<')
  if (bracketIndex !== -1) {
    cleaned = cleaned.substring(0, bracketIndex)
  }
  
  const iframeEndIndex = cleaned.indexOf('/iframe>')
  if (iframeEndIndex !== -1) {
    cleaned = cleaned.substring(0, iframeEndIndex)
  }
  
  return cleaned
})
</script>

<style lang="scss" scoped>
.media-player {
  position: relative;
  width: 100%;
  padding-bottom: 56.25%;
  height: 0;
  overflow: hidden;
  margin-top: 1rem;
  margin-bottom: 1rem;

  iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
  }
}
</style>
