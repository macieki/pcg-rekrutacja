<template>
  <v-container fluid class="summary-container pa-8">
    <div class="summary-header">
      <button class="back-link" @click="$router.push('/applications/current/link-diploma')">
        <v-icon small class="icon-left">mdi-arrow-left</v-icon>
        Wróć do sekcji dyplom
      </button>
      <div>
        <h1>Podsumowanie aplikacji</h1>
        <p>Sprawdź wszystkie dane zanim wyślesz zgłoszenie.</p>
      </div>
    </div>

    <div v-if="loading" class="summary-card">
      <v-skeleton-loader type="card"></v-skeleton-loader>
    </div>

    <div v-else-if="application" class="summary-grid">
      <div class="main-column">
        <!-- Programme Hero -->
        <section class="summary-card hero-card">
          <div class="tile-label">Kierunek</div>
          <div class="hero-content">
            <div>
              <h2>{{ programmeName }}</h2>
              <p class="muted">Zweryfikuj, czy wybór kierunku i trybu jest prawidłowy.</p>
            </div>
            <div class="pill-row">
              <span v-if="programmeLevel" class="apple-pill">{{ programmeLevel }}</span>
              <span v-if="programmeMode" class="apple-pill subtle">{{ programmeMode }}</span>
            </div>
          </div>
        </section>

        <!-- Personal Data -->
        <section class="summary-card">
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">
                <v-icon small>mdi-account</v-icon>
              </span>
              <div>
                <p class="eyebrow">Sekcja 01</p>
                <h3>Dane osobowe</h3>
              </div>
            </div>
            <button class="ghost-link" @click="$router.push('/applications/current/personal-data')">Edytuj</button>
          </div>
          <div class="card-body">
            <table class="data-table">
              <tbody>
                <tr>
                  <td>PESEL</td>
                  <td>{{ application.personalData.pesel || '—' }}</td>
                </tr>
                <tr>
                  <td>Imię i nazwisko</td>
                  <td>{{ application.personalData.firstName }} {{ application.personalData.lastName }}</td>
                </tr>
                <tr>
                  <td>Data urodzenia</td>
                  <td>{{ formatDate(application.personalData.dateOfBirth) }}</td>
                </tr>
                <tr>
                  <td>Płeć</td>
                  <td class="text-capitalize">{{ application.personalData.gender || '—' }}</td>
                </tr>
                <tr>
                  <td>Zdjęcie</td>
                  <td>
                    <v-avatar v-if="application.personalData.photo" size="56">
                      <v-img :src="application.personalData.photo"></v-img>
                    </v-avatar>
                    <span v-else class="muted">Brak zdjęcia</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- Address -->
        <section class="summary-card">
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">
                <v-icon small>mdi-home</v-icon>
              </span>
              <div>
                <p class="eyebrow">Sekcja 02</p>
                <h3>Adres i kontakt</h3>
              </div>
            </div>
            <button class="ghost-link" @click="$router.push('/applications/current/personal-data')">Edytuj</button>
          </div>
          <div class="card-body">
            <div class="address-block">
              <p class="muted-label">Adres zamieszkania</p>
              <p>{{ formatAddress(application.address.residence) }}</p>
            </div>
            <div class="address-block" v-if="!application.address.sameAsResidence && application.address.correspondence">
              <p class="muted-label">Adres korespondencyjny</p>
              <p>{{ formatAddress(application.address.correspondence) }}</p>
            </div>
            <div class="address-pill" v-else>
              <v-icon small>mdi-check</v-icon>
              Adres korespondencyjny pokrywa się z adresem zamieszkania
            </div>
          </div>
        </section>

        <!-- Education -->
        <section class="summary-card">
          <div class="card-header">
            <div class="card-title">
              <span class="card-icon">
                <v-icon small>mdi-school</v-icon>
              </span>
              <div>
                <p class="eyebrow">Sekcja 03</p>
                <h3>Wykształcenie i wyniki</h3>
              </div>
            </div>
            <button class="ghost-link" @click="$router.push('/applications/current/link-diploma')">Edytuj</button>
          </div>
          <div class="card-body">
            <div v-if="diploma">
              <p class="muted-label">Szkoła średnia</p>
              <table class="data-table mb-4">
                <tbody>
                  <tr>
                    <td>Szkoła</td>
                    <td>{{ diploma.secondarySchool ? diploma.secondarySchool.name : '—' }}</td>
                  </tr>
                  <tr>
                    <td>Rok ukończenia</td>
                    <td>{{ diploma.graduationYear || '—' }}</td>
                  </tr>
                  <tr>
                    <td>Numer dokumentu</td>
                    <td>{{ diploma.documentNumber || '—' }}</td>
                  </tr>
                  <tr>
                    <td>Typ świadectwa</td>
                    <td>{{ diploma.type || '—' }}</td>
                  </tr>
                </tbody>
              </table>

              <p class="muted-label">Przedmioty egzaminacyjne</p>
              <table v-if="hasSubjects" class="data-table subjects">
                <thead>
                  <tr>
                    <th>Przedmiot</th>
                    <th>Rodzaj egzaminu</th>
                    <th class="text-right">Wynik</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subject, index) in diploma.subjects" :key="index">
                    <td>{{ subject.name }}</td>
                    <td>{{ subject.examType }}</td>
                    <td class="text-right">
                      <span :class="['score-pill', getScoreState(subject.score)]">
                        {{ subject.score }}%
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
              <p v-else class="muted">Brak dodanych przedmiotów</p>
            </div>
            <div v-else>
              <p class="muted">Dyplom nie został jeszcze powiązany z aplikacją</p>
            </div>
          </div>
        </section>

        <!-- Confirmation -->
        <section class="summary-card">
          <div class="card-header compact">
            <div>
              <p class="eyebrow">Oświadczenie</p>
              <h3>Potwierdź poprawność danych</h3>
            </div>
          </div>
          <div class="card-body">
            <v-checkbox
              v-model="confirmed"
              :rules="[v => !!v || 'Potwierdzenie jest wymagane']"
              color="primary"
              hide-details="auto"
            >
              <template v-slot:label>
                <span class="confirmation-text">
                  Potwierdzam, że wszystkie dane są prawdziwe i kompletne. Świadomy/a jestem, że podanie nieprawdziwych informacji może skutkować odrzuceniem aplikacji.
                </span>
              </template>
            </v-checkbox>
          </div>
        </section>

        <!-- Submit CTA -->
        <section class="summary-card submit-card">
          <div>
            <p class="eyebrow">Ostatni krok</p>
            <h3>Gotowy do wysłania?</h3>
            <p class="muted">
              Po wysłaniu nie będzie możliwości edycji zgłoszenia. Sprawdź dokładnie wszystkie sekcje.
            </p>
          </div>
          <button
            class="primary-cta"
            :disabled="!confirmed || submitting"
            @click="submitApplication"
          >
            <v-icon small class="icon-left">mdi-send</v-icon>
            <span v-if="submitting">Wysyłanie…</span>
            <span v-else>Wyślij aplikację</span>
          </button>
        </section>
      </div>

      <aside class="side-column">
        <section class="summary-card status-card">
          <div class="card-header compact">
            <div>
              <p class="eyebrow">Postęp</p>
              <h3>Status aplikacji</h3>
            </div>
          </div>
          <ul class="status-list">
            <li v-for="step in statusSteps" :key="step.key">
              <div class="status-icon" :class="step.state">
                <v-icon small>
                  {{ step.state === 'done' ? 'mdi-check' : step.state === 'pending' ? 'mdi-clock-outline' : 'mdi-circle-outline' }}
                </v-icon>
              </div>
              <div>
                <p class="status-title">{{ step.label }}</p>
                <p class="status-note">{{ step.note }}</p>
              </div>
            </li>
          </ul>
        </section>

        <section class="summary-card help-card">
          <div class="card-header compact">
            <div>
              <p class="eyebrow">Wsparcie</p>
              <h3>Potrzebujesz pomocy?</h3>
            </div>
          </div>
          <div class="card-body">
            <p class="muted">
              Skorzystaj z najczęstszych pytań lub wyślij wiadomość do zespołu rekrutacji.
            </p>
            <button class="ghost-btn" @click="$router.push('/faq')">
              <v-icon small class="icon-left">mdi-help-circle</v-icon>
              Przejdź do FAQ
            </button>
            <button class="ghost-btn" @click="$router.push('/messages')">
              <v-icon small class="icon-left">mdi-email</v-icon>
              Wyślij wiadomość
            </button>
          </div>
        </section>
      </aside>
    </div>

    <v-dialog v-model="successDialog" max-width="520" persistent>
      <v-card class="success-dialog">
        <div class="modal-icon">
          <v-icon size="48">mdi-check-circle</v-icon>
        </div>
        <v-card-text class="text-center">
          <h2>Gratulacje!</h2>
          <p class="muted">
            Aplikacja na kierunek <strong>{{ programmeName }}</strong> została przesłana. O dalszych krokach poinformujemy Cię mailowo.
          </p>
        </v-card-text>
        <v-card-actions class="modal-actions">
          <button class="ghost-btn" @click="viewApplicationDetails">Zobacz aplikację</button>
          <button class="primary-cta" @click="goToDashboard">Przejdź do panelu</button>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <submission-success-dialog v-model="submissionSuccessDialog" :programme-id="application ? application.programmeId : null" />
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { programmes } from '~/data/mockData'
import SubmissionSuccessDialog from '~/components/SubmissionSuccessDialog.vue'

export default {
  middleware: 'auth',
  components: {
    SubmissionSuccessDialog
  },
  data() {
    return {
      programmes,
      loading: true,
      confirmed: false,
      submitting: false,
      successDialog: false,
      submissionSuccessDialog: false
    }
  },
  computed: {
    ...mapGetters(['getCurrentApplication']),
    application() {
      return this.getCurrentApplication
    },
    diploma() {
      if (!this.application || !this.application.diplomaId) return null
      return this.$store.state.diplomas.find(d => d.id === this.application.diplomaId)
    },
    programmeName() {
      if (this.application) {
        const programme = this.programmes.find(p => p.id === this.application.programmeId)
        return programme ? programme.name : 'Unknown Programme'
      }
      return ''
    },
    programmeLevel() {
      if (this.application) {
        const programme = this.programmes.find(p => p.id === this.application.programmeId)
        return programme ? programme.level : ''
      }
      return ''
    },
    programmeMode() {
      if (this.application) {
        const programme = this.programmes.find(p => p.id === this.application.programmeId)
        return programme ? programme.mode : ''
      }
      return ''
    },
    hasSubjects() {
      return !!(this.diploma && Array.isArray(this.diploma.subjects) && this.diploma.subjects.length)
    },
    statusSteps() {
      if (!this.application) return []
      const steps = this.application.steps || {}
      return [
        {
          key: 'personalData',
          label: 'Dane osobowe',
          state: steps.personalData ? 'done' : 'pending',
          note: steps.personalData ? 'Uzupełnione' : 'Do uzupełnienia'
        },
        {
          key: 'diplomaLinked',
          label: 'Dyplom',
          state: steps.diplomaLinked ? 'done' : 'pending',
          note: steps.diplomaLinked ? 'Powiązany' : 'Do powiązania'
        },
        {
          key: 'payment',
          label: 'Opłata rekrutacyjna',
          state: steps.paymentComplete ? 'done' : 'later',
          note: steps.paymentComplete ? 'Opłacone' : 'Po wysłaniu zgłoszenia'
        }
      ]
    }
  },
  mounted() {
    // Check if application exists
    if (!this.application) {
      this.$router.push('/applications')
      return
    }

    // Simulate loading
    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  methods: {
    formatDate(dateString) {
      if (!dateString) return '—'
      const date = new Date(dateString)
      return date.toLocaleDateString('pl-PL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    formatAddress(address) {
      if (!address) return '—'
      const firstLine = [address.street, address.houseNumber, address.flatNumber && `/${address.flatNumber}`]
        .filter(Boolean)
        .join(' ')
      const secondLine = [address.postalCode, address.city, address.voivodeship && `(${address.voivodeship})`]
        .filter(Boolean)
        .join(' ')
      const combined = [firstLine, secondLine].filter(Boolean).join(', ')
      return combined || '—'
    },
    getScoreState(score) {
      if (score >= 80) return 'high'
      if (score >= 60) return 'medium'
      if (score >= 40) return 'low'
      return 'critical'
    },
    async submitApplication() {
      if (!this.confirmed) return

      // Check if payment is required
      const steps = this.application.steps || {}
      if (!steps.paymentComplete) {
        // Redirect to payment instead of submitting
        this.$router.push('/payments/checkout')
        return
      }

      this.submitting = true

      try {
        await this.$store.dispatch('submitApplication', this.application.id)
        this.submissionSuccessDialog = true
      } catch (error) {
        this.$store.commit('SHOW_SNACKBAR', { 
          message: 'Nie udało się wysłać aplikacji', 
          color: 'error' 
        })
      } finally {
        this.submitting = false
      }
    },
    goToDashboard() {
      this.successDialog = false
      this.$router.push('/dashboard')
    },
    viewApplicationDetails() {
      this.successDialog = false
      // Stay on current page to view details
    }
  }
}
</script>

<style scoped>
.summary-container {
  background: #f5f5f7;
  min-height: 100vh;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
}

.summary-header h1 {
  font-size: 28px;
  font-weight: 600;
  color: #1c1c1e;
  margin: 0 0 4px;
}

.summary-header p {
  margin: 0;
  color: #6e6e73;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border: 1px solid #e5e5ea;
  border-radius: 10px;
  padding: 8px 14px;
  background: #fff;
  color: #1c1c1e;
  font-size: 14px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.back-link:hover {
  background: #f5f5f7;
}

.summary-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(280px, 1fr);
  gap: 32px;
  align-items: start;
}

.summary-card {
  background: #fff;
  border-radius: 12px;
  border: 1px solid #e5e5ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  padding: 24px;
}

.hero-card {
  padding: 28px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.icon-left {
  margin-right: 6px;
}

.tile-label {
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #6e6e73;
}

.hero-card h2 {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 600;
  color: #1c1c1e;
}

.hero-card .muted {
  margin: 0;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.apple-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 999px;
  background: #007aff;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
}

.apple-pill.subtle {
  background: #f2f2f7;
  color: #1c1c1e;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.card-header.compact {
  margin-bottom: 16px;
}

.card-title {
  display: flex;
  align-items: center;
  gap: 12px;
}

.card-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #f2f2f7;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #007aff;
}

.eyebrow {
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #909095;
  margin: 0 0 4px;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 15px;
}

.data-table td,
.data-table th {
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f2;
  color: #1c1c1e;
}

.data-table td:first-child,
.data-table th:first-child {
  color: #6e6e73;
  width: 45%;
}

.data-table tr:last-child td,
.data-table tr:last-child th {
  border-bottom: none;
}

.subjects th {
  text-align: left;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.muted-label {
  font-size: 13px;
  color: #909095;
  margin-bottom: 4px;
}

.muted {
  color: #6e6e73;
  margin: 0;
}

.address-block p {
  margin: 0;
  color: #1c1c1e;
}

.address-pill {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #34c759;
  background: rgba(52, 199, 89, 0.12);
  border-radius: 999px;
  padding: 6px 12px;
}

.score-pill {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 64px;
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
}

.score-pill.high {
  background: rgba(52, 199, 89, 0.15);
  color: #1b8f3f;
}

.score-pill.medium {
  background: rgba(0, 122, 255, 0.15);
  color: #0a64c2;
}

.score-pill.low {
  background: rgba(255, 149, 0, 0.18);
  color: #c76604;
}

.score-pill.critical {
  background: rgba(255, 59, 48, 0.18);
  color: #c02113;
}

.ghost-link {
  border: none;
  background: transparent;
  color: #007aff;
  font-weight: 600;
  cursor: pointer;
}

.primary-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 10px;
  padding: 14px 24px;
  background: #007aff;
  color: #fff;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.15s ease;
}

.primary-cta:disabled {
  background: #b0cfff;
  cursor: not-allowed;
}

.submit-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.ghost-btn {
  width: 100%;
  border: 1px solid #d1d1d6;
  border-radius: 10px;
  padding: 12px 16px;
  background: #fff;
  color: #1c1c1e;
  font-weight: 500;
  text-align: center;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.status-card {
  padding-bottom: 8px;
}

.status-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.status-list li {
  display: flex;
  gap: 12px;
}

.status-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: #f2f2f7;
  color: #6e6e73;
}

.status-icon.done {
  background: rgba(52, 199, 89, 0.18);
  color: #1b8f3f;
}

.status-icon.pending {
  background: rgba(0, 122, 255, 0.12);
  color: #0a64c2;
}

.status-icon.later {
  background: rgba(110, 110, 115, 0.12);
  color: #6e6e73;
}

.status-title {
  margin: 0;
  font-weight: 600;
  color: #1c1c1e;
}

.status-note {
  margin: 2px 0 0;
  font-size: 13px;
  color: #6e6e73;
}

.help-card .ghost-btn + .ghost-btn {
  margin-top: 12px;
}

.success-dialog {
  padding: 32px;
  border-radius: 16px;
  text-align: center;
}

.modal-icon {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: rgba(52, 199, 89, 0.15);
  color: #1b8f3f;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding-top: 16px;
}

.modal-actions .ghost-btn {
  width: auto;
  min-width: 0;
  padding: 12px 20px;
}

.modal-actions .primary-cta {
  min-width: 0;
  padding: 12px 20px;
}

.confirmation-text {
  color: #1c1c1e;
  line-height: 1.5;
}

@media (max-width: 1024px) {
  .summary-grid {
    grid-template-columns: 1fr;
  }

  .submit-card {
    flex-direction: column;
    align-items: flex-start;
  }
}

@media (max-width: 600px) {
  .summary-container {
    padding: 24px !important;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .summary-card {
    padding: 20px;
  }
}
</style>
