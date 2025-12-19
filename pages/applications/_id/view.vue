<template>
  <v-container fluid class="pa-6">
    <submission-success-dialog v-model="showSuccessDialog" :programme-id="application ? application.programmeId : null" />
    
    <v-row v-if="application">
      <v-col cols="12">
        <v-btn text @click="$router.push('/applications')" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Wróć do aplikacji
        </v-btn>

        <!-- Header Card -->
        <v-card class="mb-6">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <h1 class="display-1 font-weight-bold">{{ programmeName }}</h1>
              <div class="mt-2">
                <v-chip :color="getStatusColor(application.status)" dark>
                  <v-icon left small>{{ getStatusIcon(application.status) }}</v-icon>
                  {{ getStatusLabel(application.status) }}
                </v-chip>
              </div>
            </div>
            <div>
              <v-btn
                v-if="application.status === 'incomplete'"
                color="primary"
                @click="continueApplication"
              >
                <v-icon left>mdi-pencil</v-icon>
                Kontynuuj edycję
              </v-btn>
              <v-chip v-else large outlined>
                <v-icon left>mdi-calendar</v-icon>
                Przesłano: {{ formatDate(application.submittedAt) }}
              </v-chip>
            </div>
          </v-card-title>
        </v-card>

        <!-- Application Steps Progress -->
        <v-card class="mb-6">
          <v-card-title>
            <v-icon left>mdi-timeline-check</v-icon>
            Postęp aplikacji
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="px-6 py-8">
            <div class="steps-timeline">
              <!-- Step 1: Personal Data -->
              <div class="timeline-step">
                <div :class="['step-circle', application.steps.personalData ? 'completed' : 'pending']">
                  <v-icon :color="application.steps.personalData ? 'white' : 'grey'">
                    {{ application.steps.personalData ? 'mdi-check' : 'mdi-clock-outline' }}
                  </v-icon>
                </div>
                <div class="step-text">Dane osobowe</div>
              </div>
              <div :class="['step-line', application.steps.personalData ? 'completed' : 'pending']"></div>

              <!-- Step 2: Diploma -->
              <div class="timeline-step">
                <div :class="['step-circle', application.steps.diplomaLinked ? 'completed' : 'pending']">
                  <v-icon :color="application.steps.diplomaLinked ? 'white' : 'grey'">
                    {{ application.steps.diplomaLinked ? 'mdi-check' : 'mdi-clock-outline' }}
                  </v-icon>
                </div>
                <div class="step-text">Dyplom</div>
              </div>
              <div :class="['step-line', application.steps.diplomaLinked ? 'completed' : 'pending']"></div>

              <!-- Step 3: Payment -->
              <div class="timeline-step">
                <div :class="['step-circle', application.steps.paymentComplete ? 'completed' : 'pending']">
                  <v-icon :color="application.steps.paymentComplete ? 'white' : 'grey'">
                    {{ application.steps.paymentComplete ? 'mdi-check' : 'mdi-clock-outline' }}
                  </v-icon>
                </div>
                <div class="step-text">
                  Płatność
                  <div v-if="!application.steps.paymentComplete && paymentDeadline" class="step-deadline">
                    Termin: {{ formatDeadline(paymentDeadline) }}
                  </div>
                </div>
              </div>
              <div :class="['step-line', application.steps.paymentComplete ? 'completed' : 'pending']"></div>

              <!-- Step 4: Submission -->
              <div class="timeline-step">
                <div :class="['step-circle', application.steps.submitted ? 'completed' : 'pending']">
                  <v-icon :color="application.steps.submitted ? 'white' : 'grey'">
                    {{ application.steps.submitted ? 'mdi-check' : 'mdi-clock-outline' }}
                  </v-icon>
                </div>
                <div class="step-text">
                  Przesłanie
                  <div v-if="!application.steps.submitted && submissionDeadline" class="step-deadline">
                    Termin: {{ formatDeadline(submissionDeadline) }}
                  </div>
                </div>
              </div>
              <div :class="['step-line', application.steps.submitted ? 'completed' : 'pending']"></div>

              <!-- Step 5: Document Delivery -->
              <div class="timeline-step">
                <div :class="['step-circle', application.steps.documentDelivery ? 'completed' : 'pending']">
                  <v-icon :color="application.steps.documentDelivery ? 'white' : 'grey'">
                    {{ application.steps.documentDelivery ? 'mdi-check' : 'mdi-clock-outline' }}
                  </v-icon>
                </div>
                <div class="step-text">
                  Dostarczenie dokumentów
                  <div v-if="!application.steps.documentDelivery && documentDeliveryDeadline" class="step-deadline">
                    Termin: {{ formatDeadline(documentDeliveryDeadline) }}
                  </div>
                </div>
              </div>

              <!-- Step 6: Exams (conditional) -->
              <template v-if="requiresExams(application.programmeId)">
                <div :class="['step-line', application.steps.documentDelivery ? 'completed' : 'pending']"></div>
                <div class="timeline-step">
                  <div :class="['step-circle', application.steps.exams ? 'completed' : 'pending']">
                    <v-icon :color="application.steps.exams ? 'white' : 'grey'">
                      {{ application.steps.exams ? 'mdi-check' : 'mdi-clock-outline' }}
                    </v-icon>
                  </div>
                  <div class="step-text">
                    Egzaminy
                    <div v-if="!application.steps.exams && examDeadline" class="step-deadline">
                      Termin: {{ formatDeadline(examDeadline) }}
                    </div>
                  </div>
                </div>
              </template>
            </div>
          </v-card-text>
        </v-card>

        <v-row>
          <v-col cols="12" md="6">
            <!-- Personal Data Card -->
            <v-card class="mb-6">
              <v-card-title>
                <v-icon left>mdi-account</v-icon>
                Dane osobowe
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="info-item">
                  <div class="info-label">PESEL</div>
                  <div class="info-value">{{ application.personalData.pesel || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Imię</div>
                  <div class="info-value">{{ application.personalData.firstName || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Nazwisko</div>
                  <div class="info-value">{{ application.personalData.lastName || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Data urodzenia</div>
                  <div class="info-value">{{ application.personalData.dateOfBirth || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Płeć</div>
                  <div class="info-value">{{ application.personalData.gender || 'Nie podano' }}</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- Address Card -->
            <v-card class="mb-6" v-if="application.address">
              <v-card-title>
                <v-icon left>mdi-home</v-icon>
                Adres zamieszkania
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="info-item">
                  <div class="info-label">Kod pocztowy</div>
                  <div class="info-value">{{ application.address.residence.postalCode || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Województwo</div>
                  <div class="info-value">{{ application.address.residence.voivodeship || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Miasto</div>
                  <div class="info-value">{{ application.address.residence.city || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Ulica</div>
                  <div class="info-value">{{ application.address.residence.street || 'Nie podano' }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Nr domu/mieszkania</div>
                  <div class="info-value">
                    {{ application.address.residence.houseNumber }}
                    {{ application.address.residence.flatNumber ? `/ ${application.address.residence.flatNumber}` : '' }}
                  </div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>

          <v-col cols="12" md="6">
            <!-- Diploma Card -->
            <v-card class="mb-6" v-if="diploma">
              <v-card-title>
                <v-icon left>mdi-certificate</v-icon>
                Dyplom
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="info-item">
                  <div class="info-label">Typ</div>
                  <div class="info-value">
                    <v-chip small :color="getDiplomaTypeColor(diploma.type)" dark>
                      {{ diploma.type }}
                    </v-chip>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Szkoła</div>
                  <div class="info-value">{{ diploma.secondarySchool.name }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Rok ukończenia</div>
                  <div class="info-value">{{ diploma.graduationYear }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Numer świadectwa</div>
                  <div class="info-value">{{ diploma.documentNumber }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Przedmioty</div>
                  <div class="info-value">
                    <v-chip
                      v-for="(subject, idx) in diploma.subjects"
                      :key="idx"
                      x-small
                      class="mr-1 mb-1"
                    >
                      {{ subject.name }}: {{ subject.score }}%
                    </v-chip>
                  </div>
                </div>
                <v-btn
                  text
                  small
                  color="primary"
                  @click="viewDiploma"
                  class="mt-2"
                >
                  <v-icon left small>mdi-eye</v-icon>
                  Zobacz pełne szczegóły
                </v-btn>
              </v-card-text>
            </v-card>

            <!-- Payment Card -->
            <v-card class="mb-6" v-if="payment">
              <v-card-title>
                <v-icon left>mdi-credit-card</v-icon>
                Płatność
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">
                    <v-chip small :color="getPaymentStatusColor(payment.status)" dark>
                      {{ getPaymentStatusLabel(payment.status) }}
                    </v-chip>
                  </div>
                </div>
                <div class="info-item">
                  <div class="info-label">Kwota</div>
                  <div class="info-value">{{ payment.amount }} PLN</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Metoda</div>
                  <div class="info-value">{{ getPaymentMethod(payment.method) }}</div>
                </div>
                <div class="info-item" v-if="payment.paidAt">
                  <div class="info-label">Data płatności</div>
                  <div class="info-value">{{ formatDate(payment.paidAt) }}</div>
                </div>
              </v-card-text>
            </v-card>

            <!-- System Info Card -->
            <v-card class="mb-6">
              <v-card-title>
                <v-icon left>mdi-information</v-icon>
                Informacje systemowe
              </v-card-title>
              <v-divider></v-divider>
              <v-card-text>
                <div class="info-item">
                  <div class="info-label">ID aplikacji</div>
                  <div class="info-value">#{{ application.id }}</div>
                </div>
                <div class="info-item">
                  <div class="info-label">Data utworzenia</div>
                  <div class="info-value">{{ formatDate(application.createdAt) }}</div>
                </div>
                <div class="info-item" v-if="application.submittedAt">
                  <div class="info-label">Data przesłania</div>
                  <div class="info-value">{{ formatDate(application.submittedAt) }}</div>
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>

        <!-- Action Buttons -->
        <v-card v-if="application.status !== 'submitted'">
          <v-card-actions class="pa-4 d-flex justify-space-between">
            <v-btn
              v-if="!application.steps.paymentComplete && application.steps.diplomaLinked"
              large
              color="primary"
              @click="goToPayment"
            >
              <v-icon left>mdi-credit-card</v-icon>
              Przejdź do płatności
            </v-btn>
            <v-btn
              v-else-if="application.steps.paymentComplete"
              large
              color="success"
              @click="submitApplication"
            >
              <v-icon left>mdi-send</v-icon>
              Prześlij aplikację
            </v-btn>
            <v-btn
              v-else
              large
              color="primary"
              @click="continueApplication"
            >
              <v-icon left>mdi-pencil</v-icon>
              Kontynuuj edycję
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="error" prominent>
          Nie znaleziono aplikacji
        </v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { programmes } from '~/data/mockData'
import SubmissionSuccessDialog from '~/components/SubmissionSuccessDialog.vue'

export default {
  components: {
    SubmissionSuccessDialog
  },
  data() {
    return {
      showSuccessDialog: false
    }
  },
  computed: {
    application() {
      const id = parseInt(this.$route.params.id)
      return this.$store.getters.getApplicationById(id)
    },
    programmeName() {
      if (!this.application) return ''
      const programme = programmes.find(p => p.id === this.application.programmeId)
      return programme ? programme.name : `Kierunek #${this.application.programmeId}`
    },
    diploma() {
      if (!this.application || !this.application.diplomaId) return null
      return this.$store.getters.getDiplomaById(this.application.diplomaId)
    },
    payment() {
      if (!this.application || !this.application.paymentId) return null
      return this.$store.getters.getPaymentById(this.application.paymentId)
    },
    programme() {
      if (!this.application) return null
      return programmes.find(p => p.id === this.application.programmeId)
    },
    paymentDeadline() {
      if (!this.programme) return null
      return new Date(this.programme.recruitmentDates.end)
    },
    submissionDeadline() {
      if (!this.programme) return null
      return new Date(this.programme.recruitmentDates.end)
    },
    documentDeliveryDeadline() {
      if (!this.programme) return null
      const deadline = new Date(this.programme.recruitmentDates.end)
      deadline.setDate(deadline.getDate() + 14)
      return deadline
    },
    examDeadline() {
      if (!this.programme || !this.programme.additionalExams) return null
      return new Date(this.programme.additionalExams.registrationDeadline)
    }
  },
  methods: {
    requiresExams(programmeId) {
      const programme = programmes.find(p => p.id === programmeId)
      return programme && programme.additionalExams && programme.additionalExams.required
    },
    continueApplication() {
      this.$store.commit('SET_ACTIVE_APPLICATION', this.application.id)
      if (!this.application.steps.personalData) {
        this.$router.push('/applications/current/personal-data')
      } else if (!this.application.steps.diplomaLinked) {
        this.$router.push('/applications/current/link-diploma')
      } else {
        this.$router.push('/applications/current/summary')
      }
    },
    goToPayment() {
      this.$router.push('/payments/checkout')
    },
    async submitApplication() {
      await this.$store.dispatch('submitApplication', this.application.id)
      this.showSuccessDialog = true
    },
    viewDiploma() {
      if (this.diploma) {
        this.$router.push(`/diplomas/${this.diploma.id}`)
      }
    },
    getStatusIcon(status) {
      const map = {
        'incomplete': 'mdi-clock-outline',
        'awaiting_submission': 'mdi-email-send-outline',
        'submitted': 'mdi-check-circle',
        'under_review': 'mdi-magnify',
        'accepted': 'mdi-check-all',
        'rejected': 'mdi-close-circle'
      }
      return map[status] || 'mdi-help-circle'
    },
    getStatusLabel(status) {
      const map = {
        'incomplete': 'Niekompletna',
        'awaiting_submission': 'Gotowa do przesłania',
        'submitted': 'Przesłana',
        'under_review': 'W trakcie weryfikacji',
        'accepted': 'Zaakceptowana',
        'rejected': 'Odrzucona'
      }
      return map[status] || status
    },
    getStatusColor(status) {
      const map = {
        'incomplete': 'orange',
        'awaiting_submission': 'blue',
        'submitted': 'green',
        'under_review': 'purple',
        'accepted': 'success',
        'rejected': 'error'
      }
      return map[status] || 'grey'
    },
    getDiplomaTypeColor(type) {
      const map = {
        'Matura polska nowa': 'blue',
        'Matura polska stara': 'purple',
        'Dyplom zagraniczny': 'green'
      }
      return map[type] || 'grey'
    },
    getPaymentStatusColor(status) {
      return status === 'completed' ? 'green' : 'orange'
    },
    getPaymentStatusLabel(status) {
      return status === 'completed' ? 'Opłacona' : 'Oczekująca'
    },
    getPaymentMethod(method) {
      const map = {
        'card': 'Karta płatnicza',
        'blik': 'BLIK',
        'transfer': 'Przelew bankowy'
      }
      return map[method] || 'Nie wybrano'
    },
    formatDate(dateString) {
      if (!dateString) return 'Nie podano'
      return new Date(dateString).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    formatDeadline(date) {
      if (!date) return ''
      return new Date(date).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.info-item {
  margin-bottom: 20px;
}

.info-label {
  font-size: 12px;
  text-transform: uppercase;
  color: #6e6e73;
  margin-bottom: 4px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.info-value {
  font-size: 16px;
  color: #1c1c1e;
  font-weight: 500;
}

/* Horizontal Timeline Styles */
.steps-timeline {
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow-x: auto;
  padding: 20px 10px;
  min-height: 100px;
}

.timeline-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 120px;
  flex-shrink: 0;
}

.step-circle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  transition: all 0.3s ease;
  border: 3px solid;
}

.step-circle.completed {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  border-color: #4CAF50;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.3);
}

.step-circle.pending {
  background: #f5f5f5;
  border-color: #e0e0e0;
}

.step-text {
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: #666;
  max-width: 120px;
  line-height: 1.3;
}

.step-deadline {
  font-size: 11px;
  font-weight: 400;
  color: #FF9500;
  margin-top: 4px;
  white-space: nowrap;
}

.step-line {
  flex: 1;
  height: 3px;
  margin: 0 8px;
  margin-bottom: 40px;
  transition: background-color 0.3s ease;
  min-width: 30px;
}

.step-line.completed {
  background: linear-gradient(90deg, #4CAF50 0%, #45a049 100%);
}

.step-line.pending {
  background: #e0e0e0;
}

/* Responsive adjustments */
@media (max-width: 960px) {
  .steps-timeline {
    justify-content: flex-start;
    padding-bottom: 30px;
  }
  
  .timeline-step {
    min-width: 100px;
  }
  
  .step-text {
    font-size: 12px;
    max-width: 100px;
  }
  
  .step-circle {
    width: 40px;
    height: 40px;
  }
}
</style>
