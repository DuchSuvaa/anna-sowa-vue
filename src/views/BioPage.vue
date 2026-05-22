<template>
  <section id="biography">
    <div class="content">
      <LoadingSpinner v-if="isLoading" />
      <div v-else-if="sections.length" class="bio-sections">
        <div v-for="section in sections" :key="section.id" class="bio-section">
          <h2>{{ section[locale]?.header }}</h2>
          <div class="bio-paragraphs" v-html="formatText(section[locale]?.text)"></div>
        </div>
      </div>
      <p v-else-if="!isLoading">No content found.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'
import LoadingSpinner from '../components/LoadingSpinner.vue'

const { locale } = useI18n()
const store = useStore()
const sections = ref([])
const isLoading = ref(true)

onMounted(async () => {
  isLoading.value = true
  try {
    const result = await store.getPaginatedCollection('biography', null, 50, 'order', 'asc')
    sections.value = result.docs
  } finally {
    isLoading.value = false
  }
})

const formatText = (text) => {
  if (!text) return ''
  // Handle double newlines as separate paragraphs
  return text
    .split(/\n\s*\n/)
    .filter(p => p.trim() !== '')
    .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
    .join('')
}
</script>

<style lang="scss" scoped>
#biography {
  background-image: url('/bg-bio.jpg');
}

.bio-sections {
  display: flex;
  flex-direction: column;
  gap: 4rem;
}

.bio-section {
  display: flex;
  flex-flow: row nowrap;
  font-size: 2rem;
  line-height: 1.5;
  h2 {
    color: #9d6044;
    font-weight: bold;
    width: 16.6666%;
    margin-right: 1.6129%;
    margin-bottom: 0;
    margin-top: 0;
    font-size: inherit;
  }

  .bio-paragraphs {
    width: 83.3335%;

    :deep(p) {
      margin-bottom: 2rem;

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  @media (max-width: 1000px) {
    flex-flow: column nowrap;

    h2 {
      margin-bottom: 1.5rem;
      width: 100%;
      margin-right: 0;
    }

    .bio-paragraphs {
      width: 100%;
    }
  }
}
</style>
