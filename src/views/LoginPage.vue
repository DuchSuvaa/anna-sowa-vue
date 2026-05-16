<template>
  <section id="login">
    <div class="login-card">
      <h1>Login</h1>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">email</label>
          <input 
            type="email" 
            id="email" 
            v-model="loginForm.email" 
            placeholder="Enter your email"
            :class="{ 'is-invalid': errors.email }"
            @input="clearError('email')"
          >
          <span v-if="errors.email" class="error-msg">{{ errors.email }}</span>
        </div>
        <div class="form-group">
          <label for="password">password</label>
          <input 
            type="password" 
            id="password" 
            v-model="loginForm.password" 
            placeholder="Enter your password"
            :class="{ 'is-invalid': errors.password }"
            @input="clearError('password')"
          >
          <span v-if="errors.password" class="error-msg">{{ errors.password }}</span>
        </div>
        <button type="submit" :disabled="loading">
          {{ loading ? 'Logging in...' : 'Login' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useStore } from '../pinia/store'
import { useI18n } from 'vue-i18n'

const loginForm = reactive({
  email: '',
  password: ''
})

const errors = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const store = useStore()
const { t } = useI18n()

const validate = () => {
  let isValid = true
  errors.email = ''
  errors.password = ''

  if (!loginForm.email) {
    errors.email = t('login.email-required')
    isValid = false
  } else if (!/.+@.+\..+/.test(loginForm.email)) {
    errors.email = t('login.invalid-email')
    isValid = false
  }

  if (!loginForm.password) {
    errors.password = t('login.password-required')
    isValid = false
  }

  return isValid
}

const clearError = (field) => {
  errors[field] = ''
}

const login = async () => {
  if (!validate()) return

  loading.value = true
  try {
    await store.login(loginForm.email, loginForm.password)
  } finally {
    loading.value = false
  }
}
</script>

<style lang="scss" scoped>
#login {
  background-image: url('/bg-home.jpg');
  min-height: calc(100vh - $header-height);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;

  .login-card {
    width: 100%;
    max-width: 45rem;
    padding: 5rem 4rem;
    background-color: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(15px);
    -webkit-backdrop-filter: blur(15px);
    border-radius: 2rem;
    box-shadow: 0 2rem 5rem rgba(0, 0, 0, 0.15);
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid rgba(255, 255, 255, 0.3);
  }

  h1 {
    font-size: 3.2rem;
    font-weight: 700;
    margin-bottom: 4rem;
    color: $black;
    text-transform: uppercase;
    letter-spacing: 0.2rem;
    text-align: center;
  }

  form {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 2.5rem;

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.8rem;

      label {
        font-size: 1.2rem;
        font-weight: 700;
        color: $grey;
        text-transform: uppercase;
        letter-spacing: 0.1rem;
        padding-left: 0.5rem;
      }

      input {
        width: 100%;
        padding: 1.4rem;
        font-size: 1.6rem;
        background-color: rgba($white, 0.5);
        border: 1px solid rgba(0, 0, 0, 0.1);
        border-radius: 1rem;
        transition: all 0.3s ease;

        &:focus {
          outline: none;
          background-color: $white;
          border-color: $brown;
          box-shadow: 0 0 0 4px rgba($brown, 0.1);
        }

        &::placeholder {
          color: #bbb;
        }

        &.is-invalid {
          border-color: #dc3545;
          &:focus {
            box-shadow: 0 0 0 4px rgba(#dc3545, 0.1);
          }
        }
      }

      .error-msg {
        color: #dc3545;
        font-size: 1.2rem;
        font-weight: 700;
        margin-top: -0.4rem;
        padding-left: 0.5rem;
      }
    }

    button {
      margin-top: 1.5rem;
      padding: 1.6rem;
      font-size: 1.6rem;
      font-weight: 700;
      background-color: $black;
      color: $white;
      border: none;
      border-radius: 1rem;
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      text-transform: uppercase;
      letter-spacing: 0.1rem;

      &:hover:not(:disabled) {
        background-color: $brown;
        transform: translateY(-2px);
        box-shadow: 0 1rem 2rem rgba($brown, 0.3);
      }

      &:active:not(:disabled) {
        transform: translateY(0);
      }

      &:disabled {
        opacity: 0.7;
        cursor: not-allowed;
      }
    }
  }
}

@media (max-width: 500px) {
  #login .login-card {
    padding: 4rem 2.5rem;
    border-radius: 1.5rem;
  }
  
  #login h1 {
    font-size: 2.8rem;
    margin-bottom: 3rem;
  }
}
</style>