<template>
  <li class="newsItem">
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
