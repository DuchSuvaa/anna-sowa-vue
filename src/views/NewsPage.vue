<template>
  <section id="news">
    <div class="content">
      <SectionSortControls 
        v-if="news && news.length" 
        :direction="sortDirection" 
        @toggle="toggleSort"
      />
      <ul class="news-list" v-if="news && news.length">
        <template v-for="item in newsWithYearMarkers" :key="item.id">
          <li v-if="item.isYearMarker" class="year-marker">
            <span>{{ item.year }}</span>
          </li>
          <NewsItem 
            v-else
            :item="item" 
          />
        </template>
      </ul>
      <LoadingSpinner v-if="isLoading" />
      <p v-else-if="!news || news.length === 0">No news found</p>
      
      <button v-if="hasMore && !isLoading && news.length > 0" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }} </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'
import NewsItem from '../components/NewsItem.vue'
import SectionSortControls from '../components/SectionSortControls.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { locale } = useI18n()
const store = useStore()
const news = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)
const sortDirection = ref('asc')
const isLoading = ref(true)

const extractYear = (item) => {
  const timeStr = item.time?.en || item.time?.pl
  if (timeStr) {
    const match = timeStr.match(/\b(19|20)\d{2}\b/)
    if (match) return parseInt(match[0])
  }
  if (item.timestamp?.seconds) {
    return new Date(item.timestamp.seconds * 1000).getFullYear()
  }
  return null
}

const newsWithYearMarkers = computed(() => {
  const result = []
  let currentYear = null

  for (const item of news.value) {
    const itemYear = extractYear(item)
    
    if (itemYear && itemYear !== currentYear) {
      // Avoid duplicate keys if somehow a year appears twice separated
      result.push({ isYearMarker: true, year: itemYear, id: `year-${itemYear}-${item.id}` })
      currentYear = itemYear
    }
    
    result.push(item)
  }
  
  return result
})

const toggleSort = async () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  news.value = []
  lastDoc.value = null
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  isLoading.value = true
  try {
    const limitCount = store.globalSettings?.itemsPerPage || 10
    const result = await store.getPaginatedCollection('news', lastDoc.value, limitCount, 'order', sortDirection.value)
    if (result.docs.length > 0) {
      news.value.push(...result.docs)
      lastDoc.value = result.lastVisible
    }
    if (result.docs.length < limitCount) {
      hasMore.value = false
    }
  } finally {
    isLoading.value = false
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

.year-marker {
  font-size: 4rem;
  font-weight: 700;
  color: #9d6044;
  margin: 6rem 0 2rem;
  display: flex;
  align-items: center;
  
  &::after {
    content: '';
    flex-grow: 1;
    height: 1px;
    background-color: rgba(52, 51, 51, 0.2); // $black with opacity
    margin-left: 2rem;
  }

  &:first-child {
    margin-top: 0;
  }
}
</style>