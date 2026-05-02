<template>
  <img
    :src="src"
    :srcset="srcset"
    :sizes="sizes"
    :alt="alt"
    :class="imgClass"
    loading="lazy"
  />
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  publicId: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    default: ''
  },
  imgClass: {
    type: String,
    default: ''
  },
  sizes: {
    type: String,
    default: '(max-width: 600px) 100vw, (max-width: 1200px) 50vw, 33vw'
  }
})

const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME

// Cloudinary base URL
const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`

// Default transformations: automatic format, automatic quality
const defaultTransforms = 'f_auto,q_auto'

const getUrl = (width) => {
  return `${baseUrl}/c_scale,w_${width},${defaultTransforms}/${props.publicId}`
}

// Generate src (fallback for older browsers)
const src = computed(() => getUrl(800))

// Generate srcset for responsive images
const srcset = computed(() => {
  const widths = [400, 800, 1200, 1600, 2048]
  return widths.map(w => `${getUrl(w)} ${w}w`).join(', ')
})
</script>

<style scoped>
img {
  max-width: 100%;
  height: auto;
  display: block;
}
</style>
