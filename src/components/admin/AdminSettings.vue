<template>
  <div class="admin-settings">
    <div class="settings-title-bar">
      <h2>{{ $t('admin.settings') }}</h2>
    </div>

    <form @submit.prevent="save" class="settings-form">
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
  itemsPerPage: 10
})

onMounted(async () => {
  const currentSettings = await store.loadSettings()
  settingsForm.value.itemsPerPage = currentSettings.itemsPerPage || 10
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
</script>

<style lang="scss" scoped>
.admin-settings {
  padding: 2rem;
  
  .settings-title-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    
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
      max-width: 20rem;
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
</style>
