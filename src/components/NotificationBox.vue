<template>
  <div class="notification">
    <div class="toast-content">
      <span class="icon">✓</span>
      <span class="message">
        <slot></slot>
      </span>
    </div>
    <button class="close-btn" @click="$emit('close')" aria-label="Close">
      &times;
    </button>
  </div>
</template>

<script setup>
defineEmits(['close'])
</script>

<style scoped lang="scss">
.notification {
  background-color: #f0fdf4;
  color: #166534;
  border: 1px solid #bbf7d0;
  border-radius: 8px;
  padding: 1.6rem 2.4rem;
  font-size: 1.6rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05), 0 4px 10px rgba(0, 0, 0, 0.02);
  width: max-content;
  max-width: 90vw;

  .toast-content {
    display: flex;
    align-items: center;
    gap: 1.2rem;
  }

  .icon {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #22c55e;
    color: white;
    width: 2.4rem;
    height: 2.4rem;
    border-radius: 50%;
    font-size: 1.4rem;
    flex-shrink: 0;
  }

  .message {
    line-height: 1.4;
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #15803d;
    font-size: 2.4rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
    margin-top: -0.2rem;
    opacity: 0.6;
    transition: opacity 0.2s;
    
    &:hover {
      opacity: 1;
    }
  }
}
</style>

