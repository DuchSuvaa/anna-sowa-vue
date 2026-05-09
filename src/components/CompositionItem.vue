<template>
  <li class="composition-item">
    <h3 class="composition-item__title">{{ composition.name?.[locale] }}</h3>
    <span v-if="composition.year" class="composition-item__year">
      <img src="/date.png" alt="Date" />
      {{ composition.year }}
    </span>
    <span v-if="composition.instrumentation?.[locale]" class="composition-item__instrumentation">
      <img src="/instrument.png" alt="Instrument" />
      {{ composition.instrumentation?.[locale] }}
    </span>
    <div class="composition-item__performed">{{ composition.performed?.[locale] }}</div>
  </li>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const props = defineProps({
  composition: {
    type: Object,
    required: true
  }
})

const { locale } = useI18n()
</script>

<style lang="scss" scoped>
.composition-item {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  grid-template-rows: auto;
  grid-gap: 1rem;
  font-size: 2.4rem;
  margin: 4rem auto;
  padding-bottom: 4rem;
  border-bottom: 1px solid black;
  color: $black;
  .composition-item__title {
    width: 100%;
    font-size: 2.8rem !important;
    font-weight: 700;
    margin: 0;
    grid-column: span 6;
  }
  
  .composition-item__year,
  .composition-item__instrumentation {
    width: auto;
    display: flex;
    flex-flow: row nowrap;
    align-items: center;
    margin-top: 4rem;
    margin-bottom: 4rem;
    margin-right: 9rem;
    img {
      display: block;
      margin-right: 3rem;
      width: auto;
      height: auto;
    }
  }

  .composition-item__year {
    grid-column: span 1;
  }

  .composition-item__instrumentation {
    grid-column: span 5;
  }

  .composition-item__performed {
    grid-column: span 6;
  }
}

@media (max-width: 1100px) {
  .composition-item {
    .composition-item__year,
    .composition-item__instrumentation {
      margin-top: 2rem;
      margin-bottom: 2rem;
      margin-right: 0;
    }
    .composition-item__year {
      grid-column: span 2;
    }
    .composition-item__instrumentation {
      grid-column: span 4;
    }
  }
}


@media (max-width: 768px) {
  .composition-item {
    font-size: 1.8rem;
    .composition-item__title {
      font-size: 2.2rem !important;
    }
    .composition-item__year,
    .composition-item__instrumentation {
      grid-column: span 6;
      margin-bottom: 0;
      img {
        margin-right: 1.5rem;
        max-width: 3rem;
      }
    }
    .composition-item__performed {
      margin-top: 2rem;
    }
  }
}

@media (max-width: 500px) {
  .composition-item {
    .composition-item__year,
    .composition-item__instrumentation {
      grid-column: span 6;
    }
  }
}
</style>
