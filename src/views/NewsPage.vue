<template>
  <section id="news">
    <div class="content">
      <div class="sort-controls" v-if="news && news.length">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDirection === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
      </div>
      <ul class="news-list" v-if="news && news.length">
        <li v-for="item in news" :key="item.id" class="newsItem">
          <div class="datePlace">
            <div class="datePlaceItem" v-if="item.time?.[locale]">
              <img src="/date.png" alt="Date" />
              {{ item.time?.[locale] }}
            </div>
            <div class="datePlaceItem" v-if="item.venue?.[locale]">
              <img src="/place.png" alt="Place" />
              {{ item.venue?.[locale] }}
            </div>
          </div>
          <div class="newsText">
            <div v-if="item.description?.[locale]">{{ item.description?.[locale] }}</div>
            <div v-if="item.performed?.[locale]">{{ item.performed?.[locale] }}</div>
          </div>
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

.news-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.newsItem {
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  border-bottom: 1px solid #343333;
  margin-top: 4rem;
  padding-bottom: 4rem;
  font-size: 2.4rem;
  line-height: 3rem;
  color: #222;

  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    border-bottom: none;
  }

  .datePlace {
    width: 49%;
    .datePlaceItem {
      display: flex;
      flex-flow: row nowrap;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 1.2rem;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      img {
        margin-right: 2.4rem;
        height: 2.4rem;
        width: auto;
      }
    }
  }

  .newsText {
    width: 49%;
    div {
      margin-bottom: 1rem;
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

@media (max-width: 1100px) {
  .newsItem {
    flex-flow: column nowrap;
    padding-bottom: 2rem;
    
    .datePlace, .newsText {
      width: 100%;
    }
    
    .datePlace {
      margin-bottom: 2rem;
    }
  }
}

@media (max-width: 768px) {
  .newsItem {
    font-size: 1.8rem;
    line-height: 2.4rem;

    .datePlace .datePlaceItem img {
      margin-right: 1.5rem;
      height: 2rem;
    }
  }
}
</style>