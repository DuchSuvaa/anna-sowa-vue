<template>
  <div class="admin-settings">
    <div class="settings-title-bar">
      <h2>{{ $t('admin.settings') }}</h2>
    </div>

    <!-- General Settings Form -->
    <form @submit.prevent="save" class="settings-form">
      <h3 class="section-subtitle">General</h3>
      
      <div class="form-group">
        <label for="contactEmail">Contact Email (Header icon)</label>
        <input 
          id="contactEmail"
          type="email" 
          v-model="settingsForm.contactEmail" 
          class="form-control"
          required
        />
        <p class="help-text">This email will be used for the envelope icon in the site header.</p>
      </div>

      <div class="form-group">
        <label for="itemsPerPage">Items loaded per page (Pagination limit)</label>
        <input 
          id="itemsPerPage"
          type="number" 
          v-model.number="settingsForm.itemsPerPage" 
          class="form-control"
          min="1"
          max="100"
          required
        />
        <p class="help-text">Number of items to fetch when clicking "Load more" in News, Media, and Works.</p>
      </div>

      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="saving">
          {{ saving ? $t('admin.saving') : $t('admin.save-changes') }}
        </button>
      </div>
    </form>

    <!-- Security Settings Form -->
    <form @submit.prevent="updatePwd" class="settings-form security-section">
      <h3 class="section-subtitle">Security</h3>
      
      <div class="form-group">
        <label for="newPassword">New Password</label>
        <input 
          id="newPassword"
          type="password" 
          v-model="passwordForm.newPassword" 
          class="form-control"
          required
        />
      </div>

      <div class="form-group">
        <label for="confirmPassword">Confirm New Password</label>
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
          {{ pwdSaving ? $t('admin.saving') : 'Change Password' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from '../../pinia/store'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

const saving = ref(false)
const settingsForm = ref({
  itemsPerPage: 10,
  contactEmail: ''
})

const pwdSaving = ref(false)
const passwordForm = ref({
  newPassword: '',
  confirmPassword: ''
})

onMounted(async () => {
  const currentSettings = await store.loadSettings()
  settingsForm.value.itemsPerPage = currentSettings.itemsPerPage || 10
  settingsForm.value.contactEmail = currentSettings.contactEmail || 'sowaanna67@gmail.com'
})

const save = async () => {
  saving.value = true
  try {
    await store.saveSettings(settingsForm.value)
    alert(t('admin.save-success'))
  } catch (error) {
    console.error(error)
    alert(t('admin.save-error'))
  } finally {
    saving.value = false
  }
}

const updatePwd = async () => {
  if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
    alert("Passwords do not match!")
    return
  }
  
  if (passwordForm.value.newPassword.length < 6) {
    alert("Password should be at least 6 characters.")
    return
  }

  pwdSaving.value = true
  try {
    await store.changePassword(passwordForm.value.newPassword)
    passwordForm.value.newPassword = ''
    passwordForm.value.confirmPassword = ''
    alert("Password updated successfully!")
  } catch (error) {
    console.error(error)
    alert("Failed to update password. You may need to log out and log in again to perform this action.")
  } finally {
    pwdSaving.value = false
  }
}
</script>

<style lang="scss" scoped>
.admin-settings {
  padding: 2rem;
  
  .settings-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    
    h2 {
      margin: 0;
      font-size: 2.4rem;
      color: #333;
    }
  }
}

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
    
    .help-text {
      font-size: 1.2rem;
      color: #777;
      margin: 0;
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
