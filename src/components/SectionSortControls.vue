<template>
  <div class="sort-controls">
    <button class="sort-btn" @click="$emit('toggle')">
      Sort: {{ direction === 'asc' ? $t('general.sort-asc') : $t('general.sort-desc') }}
    </button>
  </div>
</template>

<script setup>
defineProps({
  direction: {
    type: String,
    required: true
  }
})
defineEmits(['toggle'])
</script>

<style lang="scss" scoped>
.sort-controls {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 2rem;
  
  .sort-btn {
    background-color: rgba(255, 255, 255, 0.8);
    color: #333;
    padding: 0.8rem 1.6rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-weight: bold;
    cursor: pointer;
    transition: background-color 0.2s;
    
    &:hover {
      background-color: rgba(255, 255, 255, 1);
    }
  }
}
</style>
