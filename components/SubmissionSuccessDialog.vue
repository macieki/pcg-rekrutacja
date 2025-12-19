<template>
  <v-dialog
    :value="value"
    @input="$emit('input', $event)"
    max-width="600"
    persistent
  >
    <v-card class="submission-dialog">
      <div class="dialog-content">
        <div class="success-icon-wrapper">
          <v-icon size="80" color="success">mdi-check-circle</v-icon>
        </div>

        <h2 class="dialog-title">Aplikacja przesłana pomyślnie!</h2>
        
        <p class="dialog-subtitle">
          Twoja aplikacja została zapisana i przekazana do weryfikacji.
        </p>

        <v-divider class="my-6"></v-divider>

        <div class="next-steps">
          <h3 class="steps-title">
            <v-icon left color="primary">mdi-information</v-icon>
            Co dalej?
          </h3>
          
          <div class="step-item">
            <div class="step-number">1</div>
            <div class="step-content">
              <h4>Dostarczenie dokumentów</h4>
              <p>
                Musisz <strong>fizycznie dostarczyć</strong> wymagane dokumenty do uniwersytetu w ciągu <strong>14 dni</strong> od przesłania aplikacji.
              </p>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">2</div>
            <div class="step-content">
              <h4>Lista wymaganych dokumentów</h4>
              <ul class="documents-list">
                <li>Oryginał lub notarialnie poświadczona kopia świadectwa dojrzałości/dyplomu</li>
                <li>Potwierdzenie opłacenia opłaty rekrutacyjnej (85 PLN)</li>
                <li>2 zdjęcia legitymacyjne</li>
                <li>Dokument tożsamości do wglądu</li>
              </ul>
            </div>
          </div>

          <div class="step-item">
            <div class="step-number">3</div>
            <div class="step-content">
              <h4>Miejsce dostarczenia</h4>
              <p>
                <strong>Dziekanat Wydziału</strong><br>
                ul. Akademicka 1, 00-000 Warszawa<br>
                Pokój 101, Budynek A<br>
                Pn-Pt: 9:00 - 15:00
              </p>
            </div>
          </div>

          <div v-if="requiresExams" class="step-item">
            <div class="step-number">4</div>
            <div class="step-content">
              <h4>Egzaminy dodatkowe</h4>
              <p>
                Kierunek <strong>{{ programme.name }}</strong> wymaga zdania dodatkowych egzaminów kwalifikacyjnych:
              </p>
              <ul class="documents-list">
                <li v-for="exam in programme.additionalExams.exams" :key="exam.name">
                  <strong>{{ exam.name }}</strong><br>
                  {{ exam.description }}<br>
                  Data: {{ exam.date }} | Czas: {{ exam.duration }}
                </li>
              </ul>
              <p class="mt-3">
                <strong>Miejsce:</strong> {{ programme.additionalExams.examLocation }}<br>
                <strong>Termin rejestracji:</strong> {{ programme.additionalExams.registrationDeadline }}
              </p>
            </div>
          </div>

          <div class="step-item">
            <div :class="requiresExams ? 'step-number' : 'step-number'">{{ requiresExams ? 5 : 4 }}</div>
            <div class="step-content">
              <h4>Weryfikacja i wyniki</h4>
              <p>
                Po dostarczeniu dokumentów{{ requiresExams ? ' i zdaniu egzaminów' : '' }}, Twoja aplikacja zostanie zweryfikowana. Wyniki rekrutacji będą dostępne w panelu oraz na adres e-mail.
              </p>
            </div>
          </div>
        </div>

        <v-alert
          type="warning"
          text
          class="mt-6"
          border="left"
        >
          <strong>Ważne!</strong> Niedostarczenie dokumentów w wymaganym terminie{{ requiresExams ? ' lub niestawienie się na egzaminy' : '' }} spowoduje anulowanie aplikacji.
        </v-alert>
      </div>

      <v-card-actions class="dialog-actions pa-6">
        <v-btn
          x-large
          color="primary"
          block
          @click="goToDashboard"
        >
          <v-icon left>mdi-view-dashboard</v-icon>
          Przejdź do panelu głównego
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import { programmes } from '~/data/mockData'

export default {
  name: 'SubmissionSuccessDialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    programmeId: {
      type: Number,
      required: false
    }
  },
  computed: {
    programme() {
      if (!this.programmeId) return null
      return programmes.find(p => p.id === this.programmeId)
    },
    requiresExams() {
      return this.programme && this.programme.additionalExams && this.programme.additionalExams.required
    }
  },
  methods: {
    goToDashboard() {
      this.$emit('input', false)
      this.$router.push('/dashboard')
    }
  }
}
</script>

<style scoped>
.submission-dialog {
  border-radius: 16px;
  overflow: hidden;
}

.dialog-content {
  padding: 48px 40px 24px;
  text-align: center;
}

.success-icon-wrapper {
  margin-bottom: 24px;
  animation: scaleIn 0.5s ease-out;
}

@keyframes scaleIn {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.dialog-title {
  font-size: 28px;
  font-weight: 700;
  color: #1d1d1f;
  margin-bottom: 12px;
  letter-spacing: -0.02em;
}

.dialog-subtitle {
  font-size: 16px;
  color: #86868b;
  line-height: 1.6;
}

.next-steps {
  text-align: left;
  margin-top: 24px;
}

.steps-title {
  font-size: 18px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 24px;
  display: flex;
  align-items: center;
}

.step-item {
  display: flex;
  gap: 16px;
  margin-bottom: 24px;
  align-items: flex-start;
}

.step-number {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #007AFF;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
}

.step-content {
  flex: 1;
}

.step-content h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1d1d1f;
  margin-bottom: 8px;
}

.step-content p {
  font-size: 14px;
  color: #6e6e73;
  line-height: 1.6;
  margin: 0;
}

.documents-list {
  margin: 8px 0 0 0;
  padding-left: 20px;
}

.documents-list li {
  font-size: 14px;
  color: #6e6e73;
  line-height: 1.8;
  margin-bottom: 4px;
}

.dialog-actions {
  border-top: 1px solid rgba(0, 0, 0, 0.06);
  background: #fafafa;
}
</style>
