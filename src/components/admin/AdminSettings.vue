<template>
  <div class="admin-settings">
    <div class="settings-title-bar">
      <h2>{{ $t('admin.settings.section-name') }}</h2>
    </div>

    <!-- General Settings Form -->
    <form @submit.prevent="save" class="settings-form">
      <h3 class="section-subtitle">{{ t('admin.settings.general') }}</h3>
      
      <div class="form-group">
        <label for="contactEmail">{{ t('admin.settings.contact-email') }}</label>
        <input 
          id="contactEmail"
          type="email" 
          v-model="settings.contactEmail" 
          class="form-control"
          required
        />
        <p class="help-text">{{ t('admin.settings.contact-email-help') }}</p>
      </div>

      <div class="form-group">
        <label for="itemsPerPage">{{ t('admin.settings.items-per-page') }}</label>
        <input 
          id="itemsPerPage"
          type="number" 
          v-model.number="settings.itemsPerPage" 
          class="form-control"
          min="1"
          max="100"
          required
        />
        <p class="help-text">{{ t('admin.settings.items-per-page-help') }}</p>
      </div>

      <h3 class="section-subtitle">{{ t('admin.settings.social-links') }}</h3>

      <div class="form-group social-link-group">
        <div class="social-link-header">
          <label for="soundcloudUrl">SoundCloud</label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="settings.hideSoundcloud"
            />
            {{ t('admin.settings.hide-link') }}
          </label>
        </div>
        <input
          id="soundcloudUrl"
          type="url"
          v-model="settings.soundcloudUrl"
          class="form-control"
          :disabled="settings.hideSoundcloud"
        />
      </div>

      <div class="form-group social-link-group">
        <div class="social-link-header">
          <label for="vimeoUrl">Vimeo</label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="settings.hideVimeo"
            />
            {{ t('admin.settings.hide-link') }}
          </label>
        </div>
        <input
          id="vimeoUrl"
          type="url"
          v-model="settings.vimeoUrl"
          class="form-control"
          :disabled="settings.hideVimeo"
        />
      </div>

      <div class="form-group social-link-group">
        <div class="social-link-header">
          <label for="instagramUrl">Instagram</label>
          <label class="checkbox-label">
            <input
              type="checkbox"
              v-model="settings.hideInstagram"
            />
            {{ t('admin.settings.hide-link') }}
          </label>
        </div>
        <input
          id="instagramUrl"
          type="url"
          v-model="settings.instagramUrl"
          class="form-control"
          :disabled="settings.hideInstagram"
        />
      </div>

      <div class="form-actions">
        <button type="submit" class="save-btn" :disabled="saving">
          {{ saving ? $t('admin.saving') : $t('admin.save-changes') }}
        </button>
      </div>
    </form>

    <SecurityForm />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from '../../pinia/store'
import SecurityForm from './SecurityForm.vue'

const store = useStore()
const { t } = useI18n()

const saving = ref(false)
const settings = ref({
  itemsPerPage: 10,
  contactEmail: '',
  soundcloudUrl: 'https://soundcloud.com/user-288051599',
  vimeoUrl: 'https://vimeo.com/user65772597',
  instagramUrl: 'https://www.instagram.com/sowaanna67/',
  hideSoundcloud: false,
  hideVimeo: false,
  hideInstagram: false
})

onMounted(async () => {
  const currentSettings = await store.loadSettings()
  settings.value.itemsPerPage = currentSettings.itemsPerPage || 10
  settings.value.contactEmail = currentSettings.contactEmail || 'sowaanna67@gmail.com'
  settings.value.soundcloudUrl = currentSettings.soundcloudUrl || 'https://soundcloud.com/user-288051599'
  settings.value.vimeoUrl = currentSettings.vimeoUrl || 'https://vimeo.com/user65772597'
  settings.value.instagramUrl = currentSettings.instagramUrl || 'https://www.instagram.com/sowaanna67/'
  settings.value.hideSoundcloud = Boolean(currentSettings.hideSoundcloud)
  settings.value.hideVimeo = Boolean(currentSettings.hideVimeo)
  settings.value.hideInstagram = Boolean(currentSettings.hideInstagram)
})

const save = async () => {
  saving.value = true
  try {
    await store.saveSettings(settings.value)
    store.setNotification(t('admin.save-success'))
  } catch (error) {
    console.error(error)
    store.setError(t('admin.save-error'))
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
    
    .help-text {
      font-size: 1.2rem;
      color: #777;
      margin: 0;
    }

    .social-link-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1.6rem;
      max-width: 40rem;
    }

    .checkbox-label {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 1.3rem;
      font-weight: 400;
      color: #555;
      cursor: pointer;

      input {
        margin: 0;
      }
    }

    .form-control:disabled {
      background-color: #f5f5f5;
      color: #888;
      cursor: not-allowed;
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

/* --- Responsive Styles (RWD) --- */
@media (max-width: 768px) {
  .admin-settings {
    padding: 1rem;
    
    .settings-title-bar h2 {
      font-size: 2rem;
    }
  }
  
  .settings-form {
    .form-actions {
      flex-direction: column;
      
      .save-btn {
        width: 100%;
        padding: 1.4rem;
      }
    }
    
    .form-group .form-control {
      max-width: 100%;
    }

    .form-group .social-link-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 0.8rem;
      max-width: 100%;
    }
  }
}
</style>
