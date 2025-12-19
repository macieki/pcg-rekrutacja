<template>
  <v-container fluid fill-height class="grey lighten-4">
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="6" lg="4">
        <!-- Onboarding Section (only when from apply) -->
        <v-card v-if="isFromApply" class="onboarding-card mb-6">
          <div class="onboarding-content">
            <v-icon color="#007AFF" size="40" class="mb-3">mdi-school-outline</v-icon>
            <h3 class="onboarding-title">Kontynuujemy zapis na kierunek</h3>
            <p class="onboarding-subtitle">
              Aby dokończyć aplikację, potrzebujesz konta. Dzięki niemu będziesz mógł zarządzać swoim procesem rekrutacji.
            </p>
            <ul class="onboarding-list">
              <li>Uzupełnianie danych osobowych i dokumentów</li>
              <li>Śledzenie statusu aplikacji</li>
              <li>Aplikowanie na wiele kierunków</li>
            </ul>
          </div>
        </v-card>

        <v-card elevation="8" class="pa-4">
          <v-card-title class="justify-center">
            <div class="text-center">
              <v-icon color="primary" size="64">mdi-account-plus</v-icon>
              <h2 class="mt-2">Załóż konto</h2>
              <p class="text-subtitle-1 grey--text">
                Rozpocznij swoją aplikację uniwersytecką
              </p>
            </div>
          </v-card-title>

          <v-card-text>
            <v-form ref="form" v-model="valid" @submit.prevent="handleRegister">
              <v-text-field
                v-model="formData.email"
                label="Email"
                type="email"
                prepend-icon="mdi-email"
                :rules="emailRules"
                outlined
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.password"
                label="Hasło"
                :type="showPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock"
                :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showPassword = !showPassword"
                :rules="passwordRules"
                outlined
                required
              ></v-text-field>

              <v-text-field
                v-model="formData.confirmPassword"
                label="Potwierdź hasło"
                :type="showConfirmPassword ? 'text' : 'password'"
                prepend-icon="mdi-lock-check"
                :append-icon="showConfirmPassword ? 'mdi-eye' : 'mdi-eye-off'"
                @click:append="showConfirmPassword = !showConfirmPassword"
                :rules="confirmPasswordRules"
                outlined
                required
              ></v-text-field>

              <v-checkbox
                v-model="formData.termsAccepted"
                :rules="[v => !!v || 'Musisz zaakceptować regulamin']"
                required
              >
                <template v-slot:label>
                  <span class="text-body-2">
                    Akceptuję 
                    <a href="#" @click.prevent class="primary--text">regulamin</a>
                    i 
                    <a href="#" @click.prevent class="primary--text">politykę przetwarzania danych</a>
                  </span>
                </template>
              </v-checkbox>

              <v-text-field
                v-model="formData.captcha"
                label="Wpisz 3 + 4 = ?"
                prepend-icon="mdi-shield-check"
                :rules="captchaRules"
                outlined
                required
                hint="Prosta weryfikacja captcha"
              ></v-text-field>

              <v-alert
                v-if="error"
                type="error"
                dismissible
                class="mt-4"
              >
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                large
                :loading="loading"
                :disabled="!valid || loading"
                class="mt-4"
              >
                Załóż konto
              </v-btn>
            </v-form>
          </v-card-text>

          <v-divider class="my-4"></v-divider>

          <v-card-text class="text-center">
            <span class="grey--text">Masz już konto?</span>
            <v-btn
              text
              color="primary"
              @click="$router.push('/auth/login')"
              class="ml-2"
            >
              Zaloguj się
            </v-btn>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'default',
  data() {
    return {
      valid: false,
      loading: false,
      error: null,
      showPassword: false,
      showConfirmPassword: false,
      formData: {
        email: '',
        password: '',
        confirmPassword: '',
        termsAccepted: false,
        captcha: ''
      },
      emailRules: [
        v => !!v || 'Email jest wymagany',
        v => /.+@.+\..+/.test(v) || 'Email musi być poprawny'
      ],
      passwordRules: [
        v => !!v || 'Hasło jest wymagane',
        v => v.length >= 6 || 'Hasło musi mieć co najmniej 6 znaków'
      ],
      captchaRules: [
        v => !!v || 'Captcha jest wymagana',
        v => v === '7' || 'Nieprawidłowa odpowiedź'
      ]
    }
  },
  computed: {
    isFromApply() {
      return this.$route.query.from === 'apply' || !!this.$store.state.pendingProgrammeId
    },
    confirmPasswordRules() {
      return [
        v => !!v || 'Potwierdź hasło',
        v => v === this.formData.password || 'Hasła nie pasują'
      ]
    }
  },
  methods: {
    async handleRegister() {
      this.error = null
      
      if (!this.$refs.form.validate()) {
        return
      }

      this.loading = true

      try {
        await this.$store.dispatch('register', {
          email: this.formData.email,
          password: this.formData.password
        })
        
        // Check if there's a pending programme
        const pendingProgrammeId = this.$store.state.pendingProgrammeId
        if (pendingProgrammeId) {
          // Create application for pending programme
          await this.$store.dispatch('createApplication', pendingProgrammeId)
          this.$store.commit('CLEAR_PENDING_PROGRAMME')
          // Redirect to personal data form
          this.$router.push('/applications/current/personal-data')
        } else {
          // Navigate to programmes page
          this.$router.push('/programmes')
        }
      } catch (err) {
        this.error = err.message || 'Rejestracja nie powiodła się'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.onboarding-card {
  background: #FFFFFF;
  border-radius: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 28px 32px;
}

.onboarding-content {
  text-align: left;
}

.onboarding-title {
  font-size: 22px;
  font-weight: 600;
  color: #1C1C1E;
  letter-spacing: -0.01em;
  margin-bottom: 12px;
}

.onboarding-subtitle {
  font-size: 15px;
  color: #6E6E73;
  line-height: 1.5;
  margin-bottom: 20px;
}

.onboarding-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.onboarding-list li {
  font-size: 15px;
  color: #1C1C1E;
  line-height: 1.6;
  padding-left: 28px;
  position: relative;
  margin-bottom: 12px;
}

.onboarding-list li:before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #007AFF;
  font-weight: 600;
  font-size: 16px;
}

.onboarding-list li:last-child {
  margin-bottom: 0;
}
</style>