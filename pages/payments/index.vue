<template>
  <v-container fluid class="payments-container pa-8">
    <div class="payments-header">
      <div>
        <p class="eyebrow">Finanse</p>
        <h1>Historia płatności</h1>
        <p class="muted">
          Wszystkie twoje transakcje i płatności za aplikacje rekrutacyjne.
        </p>
      </div>
      <div class="header-stats" v-if="payments.length > 0">
        <div class="stat-item">
          <div class="stat-value">{{ totalPaidAmount }} PLN</div>
          <div class="stat-label">Łącznie zapłacono</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">{{ payments.length }}</div>
          <div class="stat-label">Transakcji</div>
        </div>
      </div>
    </div>

    <!-- Unpaid Applications Alert -->
    <v-alert
      v-if="unpaidApplications.length > 0"
      type="warning"
      prominent
      border="left"
      class="mb-6"
    >
      <v-row align="center">
        <v-col class="grow">
          <strong>Masz {{ unpaidApplications.length }} nieopłaconych aplikacji</strong><br>
          <span class="text-caption">Łączna kwota: {{ totalUnpaidAmount }} PLN</span>
        </v-col>
        <v-col class="shrink">
          <v-btn
            color="primary"
            @click="goToCheckout"
          >
            <v-icon left>mdi-credit-card</v-icon>
            Zapłać teraz
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <!-- No Payments State -->
    <v-row v-if="payments.length === 0" class="mt-8">
      <v-col cols="12">
        <v-card class="empty-state">
          <div class="empty-icon">
            <v-icon size="80" color="#007AFF">mdi-credit-card-outline</v-icon>
          </div>
          <h3>Brak płatności</h3>
          <p class="muted">
            Nie masz jeszcze żadnych transakcji. Płatności pojawią się tutaj po opłaceniu aplikacji.
          </p>
          <v-btn
            v-if="unpaidApplications.length > 0"
            color="primary"
            large
            class="mt-4"
            @click="goToCheckout"
          >
            <v-icon left>mdi-credit-card</v-icon>
            Przejdź do płatności
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payments List -->
    <v-row v-else>
      <v-col cols="12">
        <v-card class="payments-card">
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">ID płatności</th>
                  <th class="text-left">Data</th>
                  <th class="text-left">Aplikacje</th>
                  <th class="text-left">Metoda</th>
                  <th class="text-left">Kwota</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Akcje</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="payment in sortedPayments" :key="payment.id">
                  <td class="font-weight-bold">#{{ payment.id }}</td>
                  <td>{{ formatDate(payment.createdAt) }}</td>
                  <td>
                    <v-chip small>
                      {{ payment.applicationIds.length }} {{ payment.applicationIds.length === 1 ? 'aplikacja' : 'aplikacje' }}
                    </v-chip>
                  </td>
                  <td>
                    <div class="d-flex align-center">
                      <v-icon small class="mr-2">{{ getMethodIcon(payment.method) }}</v-icon>
                      {{ getMethodLabel(payment.method) }}
                    </div>
                  </td>
                  <td class="font-weight-bold">{{ payment.amount }} PLN</td>
                  <td>
                    <v-chip
                      small
                      :color="getStatusColor(payment.status)"
                      dark
                    >
                      <v-icon left small>{{ getStatusIcon(payment.status) }}</v-icon>
                      {{ getStatusLabel(payment.status) }}
                    </v-chip>
                  </td>
                  <td>
                    <v-btn
                      v-if="payment.status === 'pending'"
                      small
                      color="primary"
                      @click="completePayment(payment.id)"
                    >
                      Opłać
                    </v-btn>
                    <v-btn
                      v-else
                      small
                      text
                      @click="viewPayment(payment)"
                    >
                      Szczegóły
                    </v-btn>
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Payment Details Dialog -->
    <v-dialog v-model="detailsDialog" max-width="600">
      <v-card v-if="selectedPayment">
        <v-card-title>
          Szczegóły płatności #{{ selectedPayment.id }}
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text class="pa-6">
          <div class="info-item">
            <div class="info-label">Data utworzenia</div>
            <div class="info-value">{{ formatDateFull(selectedPayment.createdAt) }}</div>
          </div>
          <div class="info-item" v-if="selectedPayment.paidAt">
            <div class="info-label">Data opłacenia</div>
            <div class="info-value">{{ formatDateFull(selectedPayment.paidAt) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Metoda płatności</div>
            <div class="info-value">{{ getMethodLabel(selectedPayment.method) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Kwota</div>
            <div class="info-value">{{ selectedPayment.amount }} PLN</div>
          </div>
          <div class="info-item">
            <div class="info-label">Status</div>
            <div class="info-value">
              <v-chip :color="getStatusColor(selectedPayment.status)" dark small>
                {{ getStatusLabel(selectedPayment.status) }}
              </v-chip>
            </div>
          </div>
          <div class="info-item">
            <div class="info-label">Opłacone aplikacje</div>
            <div class="info-value">
              <v-chip
                v-for="appId in selectedPayment.applicationIds"
                :key="appId"
                small
                class="mr-2"
              >
                Aplikacja #{{ appId }}
              </v-chip>
            </div>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="detailsDialog = false">Zamknij</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      detailsDialog: false,
      selectedPayment: null
    }
  },
  computed: {
    payments() {
      return this.$store.getters.userPayments
    },
    sortedPayments() {
      return [...this.payments].sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      )
    },
    unpaidApplications() {
      return this.$store.getters.unpaidApplications
    },
    totalUnpaidAmount() {
      return this.$store.getters.totalUnpaidAmount
    },
    totalPaidAmount() {
      return this.payments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)
    }
  },
  methods: {
    goToCheckout() {
      this.$router.push('/payments/checkout')
    },
    completePayment(paymentId) {
      this.$router.push(`/payments/checkout?payment=${paymentId}`)
    },
    viewPayment(payment) {
      this.selectedPayment = payment
      this.detailsDialog = true
    },
    getMethodIcon(method) {
      const map = {
        'card': 'mdi-credit-card',
        'transfer': 'mdi-bank-transfer',
        'blik': 'mdi-cellphone'
      }
      return map[method] || 'mdi-cash'
    },
    getMethodLabel(method) {
      const map = {
        'card': 'Karta płatnicza',
        'transfer': 'Przelew bankowy',
        'blik': 'BLIK'
      }
      return map[method] || 'Nie wybrano'
    },
    getStatusIcon(status) {
      const map = {
        'pending': 'mdi-clock-outline',
        'completed': 'mdi-check-circle',
        'failed': 'mdi-alert-circle'
      }
      return map[status] || 'mdi-help-circle'
    },
    getStatusLabel(status) {
      const map = {
        'pending': 'Oczekująca',
        'completed': 'Opłacona',
        'failed': 'Nieudana'
      }
      return map[status] || status
    },
    getStatusColor(status) {
      const map = {
        'pending': 'orange',
        'completed': 'green',
        'failed': 'red'
      }
      return map[status] || 'grey'
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    },
    formatDateFull(dateString) {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.payments-container {
  background: #f5f5f7;
  min-height: 100vh;
}

.payments-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.payments-header h1 {
  margin: 4px 0 8px;
  font-size: 32px;
  color: #1c1c1e;
  letter-spacing: -0.02em;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #909095;
  margin: 0;
}

.muted {
  color: #6e6e73;
  margin: 0;
}

.header-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  text-align: right;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #1c1c1e;
}

.stat-label {
  font-size: 12px;
  color: #6e6e73;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.empty-state {
  border-radius: 12px;
  padding: 64px 32px;
  text-align: center;
  border: 1px solid #e5e5ea;
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-state h3 {
  margin-bottom: 12px;
  color: #1c1c1e;
}

.payments-card {
  border-radius: 12px;
  border: 1px solid #e5e5ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

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

@media (max-width: 960px) {
  .payments-header {
    flex-direction: column;
  }

  .header-stats {
    width: 100%;
    justify-content: space-around;
  }
}
</style>
