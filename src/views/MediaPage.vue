<template>
  <section id="media">
    <div class="content">
      <div class="sort-controls" v-if="media && media.length">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDirection === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
      </div>
      <ul class="media-list" v-if="media && media.length">
        <li v-for="item in media" :key="item.id" class="medium">
          <div class="medium-text">
            <div class="medium-text-icon"></div>
            <div class="medium-text-text" v-html="item.mediumText?.[locale]"></div>
          </div>
          <div class="medium-link" v-if="item.mediumLink">
            <div class="medium-link-icon"></div>
            <div class="medium-link-link">
              <a :href="item.mediumLink" target="_blank">Link</a>
            </div>
          </div>
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
  const limitCount = store.globalSettings?.itemsPerPage || 10
  const result = await store.getPaginatedCollection('media', lastDoc.value, limitCount, 'order', sortDirection.value)
  if (result.docs.length > 0) {
    media.value.push(...result.docs)
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

.media-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.medium {
  font-size: 2.4rem;
  margin-bottom: 4rem;
  color: #222;

  .medium-text {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;

    .medium-text-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: no-repeat center url("/magazine.svg");
      background-size: cover;
      margin-right: 2rem;
      flex-shrink: 0;
    }

    .medium-text-text {
      :deep(span) {
        font-style: italic;
      }
    }
  }

  .medium-link {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .medium-link-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: no-repeat center url("/link.svg");
      background-size: cover;
      margin-right: 2rem;
      flex-shrink: 0;
    }

    .medium-link-link {
      a {
        color: #9d6044;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .medium {
    font-size: 1.8rem;
    margin-bottom: 3rem;
    
    .medium-text .medium-text-icon,
    .medium-link .medium-link-icon {
      width: 2rem;
      height: 2rem;
      margin-right: 1.5rem;
    }
  }
}
</style>