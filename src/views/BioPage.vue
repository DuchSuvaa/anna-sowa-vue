<template>
  <section id="biography">
    <div class="content">
      <div v-if="sections.length" class="bio-sections">
        <div v-for="section in sections" :key="section.id" class="bio-section">
          <h2>{{ section[locale]?.header }}</h2>
          <div class="bio-paragraphs" v-html="formatText(section[locale]?.text)"></div>
        </div>
      </div>
      <p v-else>No content found.</p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const store = useStore()
const sections = ref([])

onMounted(async () => {
  const result = await store.getPaginatedCollection('biography', null, 50, 'order', 'asc')
  sections.value = result.docs
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
  h2 {
    margin-bottom: 1.5rem;
    font-size: 2rem;
    font-weight: 700;
  }

  p, :deep(p) {
    margin-bottom: 1.2rem;
    line-height: 1.8;
    font-size: 1.5rem;

    &:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
