<template>
  <section id="media">
    <div class="content">
      <ul class="media-list" v-if="media && media.length">
        <li v-for="item in media" :key="item.id">
          <h2>{{ item.mediumText?.[locale] }}</h2>
          <a :href="item.mediumLink" target="_blank" v-if="item.mediumLink">
            Link
          </a>
        </li>
      </ul>
      <p v-else>No media found</p>
      <button v-if="hasMore && media.length" @click="loadMore" class="load-more-btn">Załaduj więcej</button>
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

const loadMore = async () => {
  const result = await store.getPaginatedCollection('media', lastDoc.value, 10, 'timestamp')
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
  background-image: url('../public/bg-media.jpg');
}
</style>