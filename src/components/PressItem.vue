<template>
  <li class="press-item">
    <div class="press-item__text">
      <div class="press-item__text-icon"></div>
      <div class="press-item__text-text" v-html="item.mediumText?.[locale]"></div>
    </div>
    <div class="press-item__link" v-if="item.mediumLink">
      <div class="press-item__link-icon"></div>
      <div class="press-item__link-link">
        <a :href="item.mediumLink" target="_blank">Link</a>
      </div>
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
.press-item {
  font-size: 2.4rem;
  margin-bottom: 4rem;
  color: #222;

  .press-item__text {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    margin-bottom: 1rem;

    .press-item__text-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: no-repeat center url("/magazine.svg");
      background-size: cover;
      margin-right: 2rem;
      flex-shrink: 0;
    }

    .press-item__text-text {
      :deep(span) {
        font-style: italic;
      }
    }
  }

  .press-item__link {
    display: flex;
    align-items: center;
    justify-content: flex-start;

    .press-item__link-icon {
      width: 2.5rem;
      height: 2.5rem;
      background: no-repeat center url("/link.svg");
      background-size: cover;
      margin-right: 2rem;
      flex-shrink: 0;
    }

    .press-item__link-link {
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
  .press-item {
    font-size: 1.8rem;
    margin-bottom: 3rem;
    
    .press-item__text .press-item__text-icon,
    .press-item__link .press-item__link-icon {
      width: 2rem;
      height: 2rem;
      margin-right: 1.5rem;
    }
  }
}
</style>
