<template>
  <v-container fluid class="checkout-container pa-8">
    <v-row>
      <v-col cols="12" md="8">
        <v-btn text @click="$router.back()" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Wróć
        </v-btn>

        <h1 class="display-1 font-weight-bold mb-2">Płatność za aplikacje</h1>
        <p class="text-subtitle-1 grey--text mb-6">
          Wybierz metodę płatności i dokończ proces rekrutacji
        </p>

        <!-- Applications to Pay -->
        <v-card class="mb-6">
          <v-card-title>Aplikacje do opłacenia</v-card-title>
          <v-divider></v-divider>
          <v-list>
            <v-list-item
              v-for="app in selectedApplications"
              :key="app.id"
            >
              <v-list-item-avatar>
                <v-icon color="primary">mdi-school</v-icon>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="font-weight-bold">
                  {{ getProgrammeName(app.programmeId) }}
                </v-list-item-title>
                <v-list-item-subtitle>
                  Aplikacja #{{ app.id }}
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <div class="text-h6">85 PLN</div>
              </v-list-item-action>
            </v-list-item>
          </v-list>
        </v-card>

        <!-- Payment Method Selection -->
        <v-card class="mb-6">
          <v-card-title>Metoda płatności</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-radio-group v-model="paymentMethod" mandatory>
              <v-radio
                value="card"
                class="payment-option"
              >
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <v-icon class="mr-3" color="primary">mdi-credit-card</v-icon>
                    <div>
                      <div class="font-weight-bold">Karta płatnicza</div>
                      <div class="text-caption grey--text">Visa, Mastercard, American Express</div>
                    </div>
                  </div>
                </template>
              </v-radio>

              <v-divider class="my-3"></v-divider>

              <v-radio
                value="blik"
                class="payment-option"
              >
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <v-icon class="mr-3" color="primary">mdi-cellphone</v-icon>
                    <div>
                      <div class="font-weight-bold">BLIK</div>
                      <div class="text-caption grey--text">Szybka płatność mobilna</div>
                    </div>
                  </div>
                </template>
              </v-radio>

              <v-divider class="my-3"></v-divider>

              <v-radio
                value="transfer"
                class="payment-option"
              >
                <template v-slot:label>
                  <div class="d-flex align-center">
                    <v-icon class="mr-3" color="primary">mdi-bank-transfer</v-icon>
                    <div>
                      <div class="font-weight-bold">Przelew bankowy</div>
                      <div class="text-caption grey--text">Standardowy przelew online</div>
                    </div>
                  </div>
                </template>
              </v-radio>
            </v-radio-group>
          </v-card-text>
        </v-card>

        <!-- Payment Form Based on Method -->
        <v-card v-if="paymentMethod === 'card'" class="mb-6">
          <v-card-title>Dane karty</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="cardForm" v-model="validCard">
              <v-text-field
                v-model="cardData.number"
                label="Numer karty"
                outlined
                placeholder="1234 5678 9012 3456"
                :rules="cardNumberRules"
                prepend-inner-icon="mdi-credit-card"
              ></v-text-field>
              <v-text-field
                v-model="cardData.name"
                label="Imię i nazwisko na karcie"
                outlined
                :rules="requiredRules"
              ></v-text-field>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="cardData.expiry"
                    label="Data ważności"
                    outlined
                    placeholder="MM/RR"
                    :rules="expiryRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="6">
                  <v-text-field
                    v-model="cardData.cvv"
                    label="CVV"
                    outlined
                    placeholder="123"
                    :rules="cvvRules"
                    type="password"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card v-else-if="paymentMethod === 'blik'" class="mb-6">
          <v-card-title>Kod BLIK</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="blikForm" v-model="validBlik">
              <p class="mb-4 text-caption">
                Wygeneruj kod BLIK w swojej aplikacji bankowej i wprowadź go poniżej
              </p>
              <v-text-field
                v-model="blikCode"
                label="Kod BLIK"
                outlined
                placeholder="123 456"
                :rules="blikRules"
                prepend-inner-icon="mdi-cellphone"
              ></v-text-field>
            </v-form>
          </v-card-text>
        </v-card>

        <v-card v-else-if="paymentMethod === 'transfer'" class="mb-6">
          <v-card-title>Wybierz bank</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-form ref="transferForm" v-model="validTransfer">
              <v-select
                v-model="selectedBank"
                :items="banks"
                label="Twój bank"
                outlined
                :rules="requiredRules"
                prepend-inner-icon="mdi-bank"
              ></v-select>
            </v-form>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Summary Sidebar -->
      <v-col cols="12" md="4">
        <v-card class="summary-card sticky-card">
          <v-card-title>Podsumowanie</v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <div class="summary-item">
              <span>Liczba aplikacji:</span>
              <span class="font-weight-bold">{{ selectedApplications.length }}</span>
            </div>
            <div class="summary-item">
              <span>Cena za aplikację:</span>
              <span class="font-weight-bold">85 PLN</span>
            </div>
            <v-divider class="my-3"></v-divider>
            <div class="summary-item total">
              <span class="text-h6">Razem:</span>
              <span class="text-h6 primary--text font-weight-bold">{{ totalAmount }} PLN</span>
            </div>

            <v-alert
              type="info"
              text
              dense
              class="mt-4"
            >
              <small>Płatność jest bezpieczna i szyfrowana</small>
            </v-alert>
          </v-card-text>
          <v-divider></v-divider>
          <v-card-actions class="pa-4">
            <v-btn
              block
              x-large
              color="primary"
              :disabled="!isFormValid"
              :loading="processing"
              @click="processPayment"
            >
              <v-icon left>mdi-lock</v-icon>
              Zapłać {{ totalAmount }} PLN
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { programmes } from '~/data/mockData'

export default {
  data() {
    return {
      paymentMethod: 'card',
      validCard: false,
      validBlik: false,
      validTransfer: false,
      processing: false,
      cardData: {
        number: '',
        name: '',
        expiry: '',
        cvv: ''
      },
      blikCode: '',
      selectedBank: '',
      banks: [
        'PKO BP',
        'mBank',
        'ING Bank Śląski',
        'Santander',
        'Pekao SA',
        'Bank Millennium',
        'Alior Bank',
        'BNP Paribas',
        'Getin Bank',
        'Nest Bank'
      ],
      requiredRules: [
        v => !!v || 'To pole jest wymagane'
      ],
      cardNumberRules: [
        v => !!v || 'Numer karty jest wymagany',
        v => /^\d{4}\s?\d{4}\s?\d{4}\s?\d{4}$/.test(v) || 'Nieprawidłowy numer karty'
      ],
      expiryRules: [
        v => !!v || 'Data ważności jest wymagana',
        v => /^\d{2}\/\d{2}$/.test(v) || 'Format: MM/RR'
      ],
      cvvRules: [
        v => !!v || 'CVV jest wymagany',
        v => /^\d{3,4}$/.test(v) || 'CVV to 3 lub 4 cyfry'
      ],
      blikRules: [
        v => !!v || 'Kod BLIK jest wymagany',
        v => /^\d{6}$|^\d{3}\s\d{3}$/.test(v) || 'Kod BLIK to 6 cyfr'
      ]
    }
  },
  computed: {
    selectedApplications() {
      // Get applications from query or all unpaid
      const paymentId = this.$route.query.payment
      if (paymentId) {
        const payment = this.$store.getters.getPaymentById(parseInt(paymentId))
        if (payment) {
          return payment.applicationIds.map(id => 
            this.$store.getters.getApplicationById(id)
          ).filter(app => app)
        }
      }
      return this.$store.getters.unpaidApplications
    },
    totalAmount() {
      return this.selectedApplications.length * 85
    },
    isFormValid() {
      if (this.paymentMethod === 'card') return this.validCard
      if (this.paymentMethod === 'blik') return this.validBlik
      if (this.paymentMethod === 'transfer') return this.validTransfer
      return false
    }
  },
  methods: {
    getProgrammeName(programmeId) {
      const programme = programmes.find(p => p.id === programmeId)
      return programme ? programme.name : `Kierunek #${programmeId}`
    },
    async processPayment() {
      this.processing = true

      try {
        // Check if we're completing existing payment
        const existingPaymentId = this.$route.query.payment
        
        if (existingPaymentId) {
          // Complete existing payment
          await this.$store.dispatch('completePayment', {
            id: parseInt(existingPaymentId),
            method: this.paymentMethod
          })
        } else {
          // Create and complete new payment
          const applicationIds = this.selectedApplications.map(app => app.id)
          const payment = await this.$store.dispatch('createPayment', {
            applicationIds,
            amount: this.totalAmount
          })
          
          await this.$store.dispatch('completePayment', {
            id: payment.id,
            method: this.paymentMethod
          })
        }

        // Redirect to success page
        this.$router.push('/payments/success')
      } catch (error) {
        console.error('Payment error:', error)
        this.$store.commit('SHOW_SNACKBAR', {
          message: 'Wystąpił błąd podczas przetwarzania płatności',
          color: 'error'
        })
      } finally {
        this.processing = false
      }
    }
  }
}
</script>

<style scoped>
.checkout-container {
  background: #f5f5f7;
  min-height: 100vh;
}

.payment-option {
  padding: 12px 0;
}

.summary-card {
  border-radius: 12px;
  border: 1px solid #e5e5ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.sticky-card {
  position: sticky;
  top: 24px;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
  align-items: center;
}

.summary-item.total {
  margin-top: 8px;
}

@media (max-width: 960px) {
  .sticky-card {
    position: static;
  }
}
</style>
