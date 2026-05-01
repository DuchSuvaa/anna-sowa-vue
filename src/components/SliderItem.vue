<template>
<div class="slider-item">
  <slot>
    <div class="slider-item__content">
      <h2>{{ t('nav.' + name) }}</h2>
      <RouterLink :to="'/' + name">{{ t('home.button-more') }}</RouterLink>
    </div>
  </slot>
</div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const props = defineProps([ 'name' ])
const bgImage = computed(() => `url('/bg-${props.name}.jpg')`)

</script>

<style lang="scss" scoped>
.slider-item {
  flex: 0 0 100%;
  height: 100%;
  background-image: v-bind(bgImage);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  .slider-item__content {
    h2 {
      font-size: 7.5rem;
      text-align: center;
      color: $white;
      font-weight: 400;
    }
    a {
      display: block;
      height: 6rem;
      width: 20rem;
      border-radius: 3px;
      border: 1px solid transparent;
      background-color: #9d6044;
      text-align: center;
      color: white;
      line-height: 6rem;
      font-size: 2.2rem;
      margin: auto;
    }
  }
}
</style>
