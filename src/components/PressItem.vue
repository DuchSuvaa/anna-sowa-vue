<template>
  <li class="medium">
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
