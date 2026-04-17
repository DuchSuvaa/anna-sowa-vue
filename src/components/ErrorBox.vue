<template>
  <div class="error">
    <span>
      <slot></slot>
    </span>
  </div>
</template>

<script setup>

</script>

<style scoped lang="scss">
.error {
  position: fixed;
  top: 5rem;
  left: 50%;
  transform: translate(-50%);
  font-size: 1.6rem;
  background-color: white;
  padding: 2rem 5rem;
  font-weight: 800;
}
</style>