<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="type === 'filled'">
    <!-- Icon from BoxIcons Logo by Atisa - https://creativecommons.org/licenses/by/4.0/ -->
    <path fill="currentColor" d="M21.062 10.414c-2.036 4.349-6.949 10.267-10.054 10.267c-3.06 0-3.501-6.527-5.173-10.869c-.823-2.138-1.354-1.646-2.896-.567L2 8.031c2.248-1.976 4.499-4.272 5.88-4.399q2.339-.222 2.873 3.193c.475 2.994 1.137 7.641 2.291 7.641c.9 0 3.117-3.686 3.232-5.004c.203-1.93-1.421-1.989-2.828-1.387c2.228-7.295 11.494-5.95 7.614 2.339" />
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" v-else-if="type === 'outline'"><!-- Icon from Tabler Icons by Paweł Kuna - https://github.com/tabler/tabler-icons/blob/master/LICENSE --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m3 8.5l1 1S5.5 8.398 6 9c.509.609 1.863 7.65 2.5 9c.556 1.184 1.978 2.89 4 1.5C14.5 18 20 14 21 8c.444-2.661-1-4-2.5-4c-2 0-4.047 1.202-4.5 4c2.05-1.254 2.551 1 1.5 3s-2 3-2.5 3c-.49 0-.924-1.165-1.5-3.5c-.59-2.42-.5-6.5-3-6.5S3 8.5 3 8.5"/></svg>
</template>

<script setup>
const props = defineProps([ 'type' ])

</script> 