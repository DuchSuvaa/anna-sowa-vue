<template>
  <form @submit.prevent="$emit('submit')" class="edit-form">
    <div class="form-group" v-for="field in schema" :key="field.key">
      <label>{{ field.label }}</label>
      
      <!-- Text Input -->
      <input 
        v-if="field.type === 'text'" 
        type="text" 
        :value="getNested(modelValue, field.key)" 
        @input="handleInput(field, $event.target.value)"
        @blur="handleBlur(field)"
        class="form-control"
        :class="{ 'is-invalid': errors[field.key] }"
      />

      <p v-if="field.help" class="help-text">{{ field.help }}</p>
      
      <!-- Textarea -->
      <textarea 
        v-else-if="field.type === 'textarea'" 
        :value="getNested(modelValue, field.key)" 
        @input="handleInput(field, $event.target.value)"
        @blur="handleBlur(field)"
        class="form-control"
        :class="{ 'is-invalid': errors[field.key] }"
        rows="5"
      ></textarea>

      <!-- Select Input -->
      <select 
        v-else-if="field.type === 'select'" 
        :value="getNested(modelValue, field.key)" 
        @change="handleInput(field, $event.target.value)"
        @blur="handleBlur(field)"
        class="form-control"
        :class="{ 'is-invalid': errors[field.key] }"
      >
        <option value="" disabled>{{ $t('admin.select-option') }}</option>
        <option v-for="opt in field.options" :key="opt" :value="opt">
          {{ opt }}
        </option>
      </select>

      <!-- Text Array (e.g. bio paragraphs) -->
      <div v-else-if="field.type === 'text-array'" class="array-container">
        <div v-for="(paragraph, index) in getArray(modelValue, field.key)" :key="index" class="array-item">
          <textarea 
            :value="paragraph" 
            @input="updateArrayItem(field.key, index, $event.target.value)"
            class="form-control"
            rows="4"
          ></textarea>
          <button type="button" class="action-btn remove-btn" @click="removeArrayItem(field.key, index)">{{ $t('admin.remove-paragraph') }}</button>
        </div>
        <button type="button" class="action-btn add-btn" @click="addArrayItem(field.key)">+ {{ $t('admin.add-another') }}</button>
      </div>

      <span v-if="errors[field.key]" class="error-msg">{{ errors[field.key] }}</span>
    </div>

    <div class="editor-actions">
      <button type="button" class="cancel-btn" @click="$emit('cancel')">{{ $t('admin.cancel') }}</button>
      <button type="submit" class="save-btn" :disabled="saving">
        {{ saving ? $t('admin.saving') : $t('admin.save-changes') }}
      </button>
    </div>
  </form>
</template>

<script setup>
const props = defineProps({
  schema: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    required: true
  },
  errors: {
    type: Object,
    default: () => ({})
  },
  saving: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel', 'validate'])

const getNested = (obj, path) => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj) || ''
}

const setNested = (obj, path, value) => {
  const parts = path.split('.')
  const last = parts.pop()
  let current = obj
  for (const p of parts) {
    if (typeof current[p] !== 'object' || current[p] === null) {
      current[p] = {}
    }
    current = current[p]
  }
  current[last] = value
}

const handleInput = (field, value) => {
  const newData = { ...props.modelValue }
  setNested(newData, field.key, value)
  emit('update:modelValue', newData)
}

const handleBlur = (field) => {
  emit('validate', field)
}

// Array handlers
const getArray = (obj, path) => {
  const arr = getNested(obj, path)
  return Array.isArray(arr) ? arr : []
}

const updateArrayItem = (path, index, value) => {
  const newData = { ...props.modelValue }
  const arr = [...getArray(newData, path)]
  arr[index] = value
  setNested(newData, path, arr)
  emit('update:modelValue', newData)
}

const addArrayItem = (path) => {
  const newData = { ...props.modelValue }
  const arr = [...getArray(newData, path)]
  arr.push('')
  setNested(newData, path, arr)
  emit('update:modelValue', newData)
}

const removeArrayItem = (path, index) => {
  const newData = { ...props.modelValue }
  const arr = [...getArray(newData, path)]
  arr.splice(index, 1)
  setNested(newData, path, arr)
  emit('update:modelValue', newData)
}
</script>

<style lang="scss" scoped>
.edit-form {
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
    
    .help-text {
      font-size: 1.2rem;
      color: #666;
      margin: 0;
    }

    .form-control {
      width: 100%;
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

      &.is-invalid {
        border-color: #dc3545;
        &:focus {
          box-shadow: 0 0 0 3px rgba(220, 53, 69, 0.1);
        }
      }

      textarea {
        resize: vertical;
      }
    }

    .array-container {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
      padding: 1.5rem;
      background-color: #f9f9f9;
      border-radius: 6px;
      border: 1px dashed #ccc;

      .array-item {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
      }

      .action-btn {
        align-self: flex-start;
        padding: 0.6rem 1.2rem;
        font-size: 1.3rem;
        border-radius: 4px;
        border: none;
        cursor: pointer;
        font-weight: 600;
        transition: opacity 0.2s;
        
        &:hover {
          opacity: 0.8;
        }
        
        &.add-btn {
          background-color: #28a745;
          color: white;
        }
        
        &.remove-btn {
          background-color: #dc3545;
          color: white;
        }
      }
    }

    .error-msg {
      color: #dc3545;
      font-size: 1.2rem;
      font-weight: 500;
      margin-top: -0.4rem;
    }
  }

  .editor-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1.5rem;
    margin-top: 3rem;
    padding-top: 2rem;
    border-top: 1px solid #eee;
    
    button {
      padding: 1.2rem 2.4rem;
      font-size: 1.6rem;
      font-weight: bold;
      border-radius: 6px;
      border: none;
      cursor: pointer;
      transition: transform 0.1s, background-color 0.2s;
      
      &:active {
        transform: scale(0.98);
      }
    }
    
    .cancel-btn {
      background-color: #e0e0e0;
      color: #333;
      
      &:hover {
        background-color: #ccc;
      }
    }
    
    .save-btn {
      background-color: #0066cc;
      color: white;
      
      &:hover {
        background-color: #0052a3;
      }
      
      &:disabled {
        background-color: #80b3e6;
        cursor: not-allowed;
      }
    }
  }
}
</style>
