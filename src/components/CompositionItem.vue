<template>
  <li class="compItem">
    <h3 class="compTitle">{{ composition.name?.[locale] }}</h3>
    
    <div class="dateInstru">
      <div class="dateInstruItem" v-if="composition.year">
        <img src="/date.png" alt="Date" />
        {{ composition.year }}
      </div>
      <div class="dateInstruItem" v-if="composition.instrumentation?.[locale]">
        <img src="/instrument.png" alt="Instrument" />
        {{ composition.instrumentation?.[locale] }}
      </div>
    </div>
    
    <div class="compText" v-if="composition.performed?.[locale]">
      <div>{{ composition.performed?.[locale] }}</div>
    </div>
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
.compItem {
  display: flex;
  flex-flow: column nowrap;
  font-size: 2.4rem;
  margin: 4rem auto;
  padding-bottom: 4rem;
  border-bottom: 1px solid black;
  color: #222;

  .compTitle {
    width: 100%;
    font-size: 2.8rem !important;
    font-weight: normal;
    margin: 0;
  }

  .dateInstru {
    width: 100%;
    display: flex;
    flex-flow: row nowrap;
    justify-content: flex-start;
    align-items: flex-start;

    .dateInstruItem {
      width: auto;
      display: flex;
      flex-flow: row nowrap;
      margin-top: 4rem;
      margin-bottom: 4rem;
      margin-right: 9rem;
      align-items: flex-start;

      img {
        display: block;
        margin-right: 3rem;
        width: auto;
        height: auto;
      }
    }
  }

  .compText {
    width: 100%;
  }
}

@media (max-width: 1100px) {
  .compItem {
    .dateInstru {
      flex-flow: column nowrap;

      .dateInstruItem {
        margin-top: 2rem;
        margin-bottom: 2rem;
        margin-right: 0;
      }
    }
  }
}

@media (max-width: 768px) {
  .compItem {
    font-size: 1.8rem;
    .compTitle {
      font-size: 2.2rem !important;
    }
    
    .dateInstru .dateInstruItem img {
      margin-right: 1.5rem;
      max-width: 3rem;
    }
  }
}
</style>
