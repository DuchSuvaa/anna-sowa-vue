<template>
  <section id="news">
    <ul class="news-list" v-if="news && news.length">
      <li v-for="item in news" :key="item.id">
        <h2>{{ item.time?.[locale] }}</h2>
        <p>{{ item.venue?.[locale] }}</p>
        <p>{{ item.description?.[locale] }}</p>
        <p>{{ item.performed?.[locale] }}</p>
      </li>
    </ul>
    <p v-else>No news found</p>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const store = useStore()
const news = ref([])

onMounted(async () => {
  news.value = await store.getCollection('news')
})
</script>

<style lang="scss" scoped>

</style>