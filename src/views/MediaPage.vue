<template>
  <section id="media">
    <ul class="media-list" v-if="media && media.length">
      <li v-for="item in media" :key="item.id">
        <h2>{{ item.mediumText?.[locale] }}</h2>
        <a :href="item.mediumLink" target="_blank" v-if="item.mediumLink">
          Link
        </a>
      </li>
    </ul>
    <p v-else>No media found</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../pinia/store'

const { locale } = useI18n()
const store = useStore()
const media = ref([])

onMounted(async () => {
  media.value = await store.getCollection('media')
})
</script>

<style lang="scss" scoped>

</style>