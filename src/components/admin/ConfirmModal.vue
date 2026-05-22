<template>
  <transition name="modal-fade">
    <div v-if="show" class="confirm-backdrop" @click.self="$emit('cancel')">
      <div class="confirm-container">
        <!-- Header/Icon -->
        <div class="confirm-header">
          <div class="confirm-icon-container">
            <span class="confirm-icon">?</span>
          </div>
          <span class="confirm-title">{{ title || $t('admin.actions') }}</span>
        </div>
        
        <!-- Message -->
        <p class="confirm-message">{{ message }}</p>
        
        <!-- Action Buttons -->
        <div class="confirm-actions">
          <button class="confirm-btn cancel-btn" @click="$emit('cancel')">
            {{ cancelText || $t('admin.cancel') }}
          </button>
          <button class="confirm-btn yes-btn" @click="$emit('confirm')">
            {{ confirmText || $t('admin.save-changes') }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
defineProps({
  show: {
    type: Boolean,
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    required: true
  },
  confirmText: {
    type: String,
    default: ''
  },
  cancelText: {
    type: String,
    default: ''
  }
})

defineEmits(['confirm', 'cancel'])
</script>

<style lang="scss" scoped>
.confirm-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.15); // Light and very subtle overlay, absolutely NO blur
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 10000;
}

.confirm-container {
  background-color: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.12), 0 4px 12px rgba(15, 23, 42, 0.04);
  padding: 2.2rem;
  width: 90%;
  max-width: 36rem;
  display: flex;
  flex-direction: column;
  gap: 1.6rem;
  text-align: left; /* Clean left alignment */
}

.confirm-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

.confirm-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #eff6ff;
  color: #3b82f6;
  width: 3.2rem;
  height: 3.2rem;
  border-radius: 50%;
  flex-shrink: 0;
}

.confirm-icon {
  font-size: 1.6rem;
  font-weight: 700;
}

.confirm-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1e293b;
}

.confirm-message {
  font-size: 1.5rem;
  font-weight: 500;
  color: #475569;
  margin: 0;
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.confirm-btn {
  padding: 0.8rem 1.6rem;
  font-size: 1.4rem;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  
  &:active {
    transform: scale(0.96);
  }
}

.cancel-btn {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
  
  &:hover {
    background-color: #e2e8f0;
    color: #1e293b;
  }
}

.yes-btn {
  background-color: #3b82f6;
  color: #ffffff;
  box-shadow: 0 4px 10px rgba(59, 130, 246, 0.15);
  
  &:hover {
    background-color: #2563eb;
  }
}

/* Modal Animations */
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.2s ease;
  
  .confirm-container {
    transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
  
  .confirm-container {
    transform: scale(0.95);
  }
}

.modal-fade-enter-to,
.modal-fade-leave-from {
  opacity: 1;
  
  .confirm-container {
    transform: scale(1);
  }
}
</style>
