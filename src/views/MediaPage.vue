<template>
  <section id="media">
    <ul class="media-list" v-if="media && media.length">
      <li v-for="item in media" :key="item.id">
        <h2>{{ item.mediumText.en }}</h2>
        <p>{{ item.mediumLink }}</p>
      </li>
    </ul>
    <p v-else>No media found</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'

const store = useStore()
const media = ref([])

onMounted(async () => {
  media.value = await store.getCollection('media')
})
</script>

<style lang="scss" scoped>

</style>