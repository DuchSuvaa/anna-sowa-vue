<template>
  <li class="news-item">
    <div v-if="item.time?.[locale]" class="news-item__date">
      <img src="/date.png" alt="Date" />
      {{ item.time?.[locale] }}
    </div>
    <div v-if="item.venue?.[locale]" class="news-item__place">
      <img src="/place.png" alt="Place" />
      {{ item.venue?.[locale] }}
    </div>
    <div v-if="item.description?.[locale]" class="news-item__description">{{ item.description?.[locale] }}</div>
    <div v-if="item.performed?.[locale]" class="news-item__performed">{{ item.performed?.[locale] }}</div>
    <div v-if="item.link" class="news-item__link">
      <a :href="item.link" target="_blank" rel="noopener noreferrer" class="work-link">Link</a>
    </div>
  </li>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const { locale } = useI18n()
</script>

<style lang="scss" scoped>
.news-item {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: auto;
  grid-gap: 1rem;
  border-bottom: 1px solid $black;
  margin-top: 4rem;
  padding-bottom: 4rem;
  font-size: 2.4rem;
  line-height: 3rem;
  color: $black;
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    border-bottom: none;
  }

  .news-item__date,
  .news-item__place,
  .news-item__description,
  .news-item__performed,
  .news-item__link {
    display: flex;
    align-items: center;
    gap: 2rem;
    grid-column: span 3;
  }
  
  .news-item__link {
    .work-link {
      color: #9d6044;
      text-decoration: underline;
      transition: opacity 0.2s;
      &:hover {
        opacity: 0.8;
      }
    }
  }
}

@media (max-width: 1100px) {
  .news-item {
    .news-item__date,
    .news-item__place,
    .news-item__description,
    .news-item__performed,
    .news-item__link {
      grid-column: span 6;
    }
  }
}

@media (max-width: 768px) {
  .news-item {
    font-size: 1.8rem;
    line-height: 2.4rem;
    .news-item__date,
    .news-item__place,
    .news-item__description,
    .news-item__performed,
    .news-item__link {
      grid-column: span 6;
      img {
        height: 2rem;
      }
    }
  }
}
</style>
