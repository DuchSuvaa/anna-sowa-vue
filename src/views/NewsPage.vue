<template>
  <section id="news">
    <div class="content">
      <ul class="news-list" v-if="news && news.length">
        <li v-for="item in news" :key="item.id">
          <h2>{{ item.time?.[locale] }}</h2>
          <p>{{ item.venue?.[locale] }}</p>
          <p>{{ item.description?.[locale] }}</p>
          <p>{{ item.performed?.[locale] }}</p>
        </li>
      </ul>
      <p v-else>No news found</p>
      <button v-if="hasMore && news.length" @click="loadMore" class="load-more-btn">Załaduj więcej</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const store = useStore()
const news = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)

const loadMore = async () => {
  const result = await store.getPaginatedCollection('news', lastDoc.value, 10, 'timestamp')
  if (result.docs.length > 0) {
    news.value.push(...result.docs)
    lastDoc.value = result.lastVisible
  }
  if (result.docs.length < 10) {
    hasMore.value = false
  }
}

onMounted(async () => {
  await loadMore()
})
</script>

<style lang="scss" scoped>
#news {
  background-image: url('../public/bg-news.jpg');
}
</style>