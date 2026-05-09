<template>
  <section id="news">
    <div class="content">
      <SectionSortControls 
        v-if="news && news.length" 
        :direction="sortDirection" 
        @toggle="toggleSort"
      />
      <ul class="news-list" v-if="news && news.length">
        <NewsItem 
          v-for="item in news" 
          :key="item.id" 
          :item="item" 
        />
      </ul>
      <p v-else>No news found</p>
      <button v-if="hasMore && news.length" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }} </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'
import NewsItem from '../components/NewsItem.vue'
import SectionSortControls from '../components/SectionSortControls.vue'

const { locale } = useI18n()
const store = useStore()
const news = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)
const sortDirection = ref('asc')

const toggleSort = async () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  news.value = []
  lastDoc.value = null
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  const limitCount = store.globalSettings?.itemsPerPage || 10
  const result = await store.getPaginatedCollection('news', lastDoc.value, limitCount, 'order', sortDirection.value)
  if (result.docs.length > 0) {
    news.value.push(...result.docs)
    lastDoc.value = result.lastVisible
  }
  if (result.docs.length < limitCount) {
    hasMore.value = false
  }
}

onMounted(async () => {
  await store.loadSettings()
  await loadMore()
})
</script>

<style lang="scss" scoped>
#news {
  background-image: url('/bg-news.jpg');
}

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
}
</style>