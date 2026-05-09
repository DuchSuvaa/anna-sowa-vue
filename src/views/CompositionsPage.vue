<template>
  <section id="compositions">
    <div class="content">
      <div class="sort-controls" v-if="compositions && compositions.length">
        <button class="sort-btn" @click="toggleSort">
          Sort: {{ sortDirection === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
        </button>
      </div>
      <ul class="compositions-list" v-if="compositions && compositions.length">
        <li v-for="composition in compositions" :key="composition.id" class="compItem">
          <h3 class="compTitle">{{ composition.name?.[locale] }}</h3>
          
          <div class="dateInstru">
            <div class="dateInstruItem" v-if="composition.year">
              <img src="/date.png" alt="Date" />
              {{ composition.year }}
            </div>
            <div class="dateInstruItem" v-if="composition.instrumentation?.[locale]">
              <img src="/instrument.png" alt="Instrument" />
              {{ composition.instrumentation?.[locale] }}
            </div>
          </div>
          
          <div class="compText" v-if="composition.performed?.[locale]">
            <div>{{ composition.performed?.[locale] }}</div>
          </div>
        </li>
      </ul>
      <p v-else>No compositions found</p>
      <button v-if="hasMore && compositions.length" @click="loadMore" class="load-more-btn">{{ $t('general.load-more') }}</button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const store = useStore()
const compositions = ref([])
const lastDoc = ref(null)
const hasMore = ref(true)
const sortDirection = ref('asc')

const toggleSort = async () => {
  sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  compositions.value = []
  lastDoc.value = null
  hasMore.value = true
  await loadMore()
}

const loadMore = async () => {
  const limitCount = store.globalSettings?.itemsPerPage || 10
  const result = await store.getPaginatedCollection('compositions', lastDoc.value, limitCount, 'order', sortDirection.value)
  if (result.docs.length > 0) {
    compositions.value.push(...result.docs)
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
#compositions {
  background-image: url('/bg-compositions.jpg');
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

.compositions-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.compItem {
  display: flex;
  flex-flow: column nowrap;
  font-size: 2.4rem;
  margin: 4rem auto;
  padding-bottom: 4rem;
  border-bottom: 1px solid black;
  color: #222;

  .compTitle {
    width: 100%;
    font-size: 2.8rem !important;
    font-weight: normal;
    margin: 0;
  }

  .dateInstru {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;

    .dateInstruItem {
      width: auto;
      display: flex;
      flex-flow: row nowrap;
      margin-top: 4rem;
      margin-bottom: 4rem;
      margin-right: 9rem;
      align-items: flex-start;

      img {
        display: block;
        margin-right: 3rem;
        width: auto;
        height: auto;
      }
    }
  }

  .compText {
    width: 100%;
  }
}

@media (max-width: 1100px) {
  .compItem {
    .dateInstru {
      flex-flow: column nowrap;

      .dateInstruItem {
        margin-top: 2rem;
        margin-bottom: 2rem;
        margin-right: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .compItem {
    font-size: 1.8rem;
    .compTitle {
      font-size: 2.2rem !important;
    }
    
    .dateInstru .dateInstruItem img {
      margin-right: 1.5rem;
      max-width: 3rem;
    }
  }
}
</style>