<template>
  <section id="media">
    <div class="content">
      <div class="sort-controls" v-if="media && media.length">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDirection === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
      </div>
      <ul class="media-list" v-if="media && media.length">
        <li v-for="item in media" :key="item.id">
          <h2>{{ item.mediumText?.[locale] }}</h2>
          <a :href="item.mediumLink" target="_blank" v-if="item.mediumLink">
            Link
          </a>
        </li>
      </ul>
      <p v-else>No media found</p>
      <button v-if="hasMore && media.length" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }} </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../pinia/store'

const { locale } = useI18n()
const store = useStore()
const media = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)
const sortDirection = ref('asc')

const toggleSort = async () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  media.value = []
  lastDoc.value = null
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  const result = await store.getPaginatedCollection('media', lastDoc.value, 10, 'order', sortDirection.value)
  if (result.docs.length > 0) {
    media.value.push(...result.docs)
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
#media {
  background-image: url('/bg-media.jpg');
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