<template>
  <form @submit.prevent="updatePwd" class="settings-form security-section">
    <h3 class="section-subtitle">{{ t('admin.settings.security') }}</h3>
    
    <div class="form-group">
      <label for="newPassword">{{ t('admin.settings.new-password') }}</label>
      <input 
        id="newPassword"
        type="password" 
        v-model="passwordForm.newPassword" 
        class="form-control"
        required
      />
    </div>

    <div class="form-group">
      <label for="confirmPassword">{{ t('admin.settings.confirm-password') }}</label>
      <input 
        id="confirmPassword"
        type="password" 
        v-model="passwordForm.confirmPassword" 
        class="form-control"
        required
      />
    </div>

    <div class="form-actions">
      <button type="submit" class="save-btn" :disabled="pwdSaving">
        {{ pwdSaving ? t('admin.saving') : t('admin.settings.change-password') }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../pinia/store'

const store = useStore()
const { t } = useI18n()

const pwdSaving = ref(false)
const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})

const updatePwd = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    store.setError("Passwords do not match!")
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    store.setError("Password should be at least 6 characters.")
    return
  }

  pwdSaving.value = true
  try {
    await store.changePassword(passwordForm.value.newPassword)
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
    store.setNotification("Password updated successfully!")
  } catch (error) {
    console.error(error)
    store.setError("Failed to update password. You may need to log out and log in again to perform this action.")
  } finally {
    pwdSaving.value = false
  }
}
</script>

<style lang="scss" scoped>
.settings-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 4rem;

  .section-subtitle {
    font-size: 1.8rem;
    color: #555;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
    margin-top: 0;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 0.8rem;
    
    label {
      font-weight: 600;
      color: #444;
      font-size: 1.5rem;
    }
    
    .form-control {
      width: 100%;
      max-width: 40rem;
      padding: 1.2rem;
      border: 1px solid #ccc;
      border-radius: 6px;
      font-size: 1.5rem;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      
      &:focus {
        outline: none;
        border-color: #0066cc;
        box-shadow: 0 0 0 3px rgba(0, 102, 204, 0.1);
      }
    }
  }

  .form-actions {
    display: flex;
    justify-content: flex-start;
    margin-top: 1rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
    
    .save-btn {
      background-color: #0066cc;
      color: white;
      padding: 1.2rem 2.4rem;
      font-size: 1.6rem;
      font-weight: bold;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: transform 0.1s, background-color 0.2s;
      
      &:hover {
        background-color: #0052a3;
      }
      
      &:active {
        transform: scale(0.98);
      }
      
      &:disabled {
        background-color: #80b3e6;
        cursor: not-allowed;
      }
    }
  }
}

.security-section {
  background-color: #fff9f9;
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid #ffebeb;
}
</style>
