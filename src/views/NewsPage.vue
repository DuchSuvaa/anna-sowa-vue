<template>
  <section id="news">
    <div class="content">
      <div class="sort-controls" v-if="news && news.length">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDirection === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
      </div>
      <ul class="news-list" v-if="news && news.length">
        <li v-for="item in news" :key="item.id">
          <h2>{{ item.time?.[locale] }}</h2>
          <p>{{ item.venue?.[locale] }}</p>
          <p>{{ item.description?.[locale] }}</p>
          <p>{{ item.performed?.[locale] }}</p>
        </li>
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
  const result = await store.getPaginatedCollection('news', lastDoc.value, 10, 'order', sortDirection.value)
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
  background-image: url('/bg-news.jpg');
}

.sort-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  
  .sort-btn {
    background-color: rgba(255, 255, 255, 0.8);
    color: #333;
    padding: 0.8rem 1.6rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }
  }
}
</style>