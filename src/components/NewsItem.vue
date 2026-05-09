<template>
  <li class="news-item">
    <div v-if="item.time?.[locale]">
      <img src="/date.png" alt="Date" />
      {{ item.time?.[locale] }}
    </div>
    <div v-if="item.venue?.[locale]">
      <img src="/place.png" alt="Place" />
      {{ item.venue?.[locale] }}
    </div>
    <div v-if="item.description?.[locale]">{{ item.description?.[locale] }}</div>
    <div v-if="item.performed?.[locale]">{{ item.performed?.[locale] }}</div>
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
  display: flex;
  flex-flow: row nowrap;
  justify-content: space-between;
  border-bottom: 1px solid #343333;
  margin-top: 4rem;
  padding-bottom: 4rem;
  font-size: 2.4rem;
  line-height: 3rem;
  color: #222;
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: auto;
  grid-gap: 1rem;
  &:first-child {
    margin-top: 0;
  }
  
  &:last-child {
    border-bottom: none;
  }
  div {
    display: flex;
    align-items: center;
    gap: 2rem;
    grid-column: span 3;
  }
}

@media (max-width: 768px) {
  .news-item {
    font-size: 1.8rem;
    line-height: 2.4rem;
    div {
      grid-column: span 6;
      img {
        height: 2rem;
      }
    }
  }
}
</style>
