<template>
  <section id="contact">
    <div class="content">
      <h1>{{ $t('sections.contact') }}</h1>
      <a :href="'mailto:' + emailAddress" target="_blank">
        {{ emailAddress }}
      </a>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n';

const store = useStore();
const { locale } = useI18n();

const emailAddress = computed(() => {
  return store.globalSettings.contactEmail || 'sowaanna67@gmail.com';
})
</script>

<style lang="scss" scoped>
#contact {
  background-image: url('/bg-bio.jpg');
}
</style>