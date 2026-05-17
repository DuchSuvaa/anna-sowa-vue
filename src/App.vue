<template>
  <AppHeader/>
  <router-view></router-view>
  
  <div class="toast-container">
    <transition-group name="toast-slide">
      <template v-for="toast in store.toasts" :key="toast.id">
        <NotificationBox 
          v-if="toast.type === 'success'"
          @close="store.removeToast(toast.id)"
        >
          {{ toast.message }}
        </NotificationBox>
        <ErrorBox 
          v-else-if="toast.type === 'error'"
          @close="store.removeToast(toast.id)"
        >
          {{ toast.message }}
        </ErrorBox>
      </template>
    </transition-group>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useStore } from './pinia/store'
import AppHeader from './components/header/AppHeader.vue'
import NotificationBox from './components/NotificationBox.vue'
import ErrorBox from './components/ErrorBox.vue'

const store = useStore()

onMounted(() => {
  store.loadSettings()
})
</script>

<style lang="scss">
.toast-container {
  position: fixed;
  top: 5rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  gap: 1rem;
  z-index: 9999;
  align-items: center;
  pointer-events: none; /* Let clicks pass through the container to underlying UI */
}

/* Base style for individual toasts inside container */
.toast-container > * {
  pointer-events: auto; /* Re-enable clicks on the toasts themselves */
}

.toast-slide-enter-active,
.toast-slide-leave-active,
.toast-slide-move {
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.toast-slide-enter-from,
.toast-slide-leave-to {
  transform: translateY(-150%);
  opacity: 0;
}

.toast-slide-enter-to,
.toast-slide-leave-from {
  transform: translateY(0);
  opacity: 1;
}

.toast-slide-leave-active {
  position: absolute;
}
</style>
