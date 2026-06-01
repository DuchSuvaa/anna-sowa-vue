
<template>
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" v-if="type === 'filled'">
    <!-- Icon from Material Design Icons by Pictogrammers - https://github.com/Templarian/MaterialDesign/blob/master/LICENSE -->
    <path fill="currentColor" d="M11.56 8.87V17h8.76c1.85-.13 2.68-1.27 2.68-2.67c0-1.48-1.12-2.67-2.62-2.67c-.38 0-.7.08-1.03.22c-.24-2.34-2.23-4.17-4.68-4.17c-1.17 0-2.28.44-3.11 1.16m-.88 1.02c-.3-.18-.62-.32-.97-.39V17h1.39V9.34c-.15.16-.29.36-.42.55m-2.35-.54V17h.92V9.38c-.19-.03-.38-.04-.58-.04c-.12 0-.23 0-.34.01M6.5 10v7h.91V9.54c-.33.11-.64.27-.91.46m-1.67 2.5c-.06 0-.12-.06-.19-.09V17h.92v-6.14c-.37.48-.62 1.05-.73 1.64m-2.04-.28v4.69c.21.06.45.09.71.09h.22v-4.86c-.08-.01-.16-.02-.22-.02c-.26 0-.5.04-.71.1M1 14.56c0 .75.34 1.41.87 1.86v-3.71c-.53.44-.87 1.11-.87 1.85" />
  </svg>
  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" v-else-if="type === 'outline'"><!-- Icon from Ultimate free icons by Streamline - https://creativecommons.org/licenses/by/4.0/ --><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12.57 17h7.84a2.832 2.832 0 0 0 2.779-3.386a2.83 2.83 0 0 0-3.869-2.054a5 5 0 0 0-5-4.55a5 5 0 0 0-1.81.34c-.21.08-.27.17-.27.33v9a.33.33 0 0 0 .33.32M9.41 7.98v9.01M6.53 8.98v8.01m-2.88-5.51v5.51m-2.89-4.5v3.99"/></svg>
</template>

<script setup>
const props = defineProps([ 'type' ])

</script> 