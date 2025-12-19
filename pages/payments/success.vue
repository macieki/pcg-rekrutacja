<template>
  <v-container fluid class="success-container">
    <v-row justify="center" align="center" style="min-height: 80vh;">
      <v-col cols="12" md="6" lg="4">
        <v-card class="success-card pa-8">
          <div class="success-icon mb-6 text-center">
            <v-icon size="120" color="success">mdi-check-circle</v-icon>
          </div>
          
          <h1 class="text-h4 font-weight-bold mb-4">Płatność zakończona sukcesem!</h1>
          
          <p class="text-body-1 grey--text mb-6">
            Twoja płatność została przetworzona pomyślnie. Możesz teraz przesłać swoje aplikacje.
          </p>

          <v-divider class="my-6"></v-divider>

          <div class="payment-details">
            <div class="detail-item">
              <v-icon left color="primary" size="20">mdi-credit-card</v-icon>
              <span class="grey--text">Zapłacono:</span>
              <span class="font-weight-bold ml-2">{{ paidAmount }} PLN</span>
            </div>
            <div class="detail-item mt-3">
              <v-icon left color="primary" size="20">mdi-calendar</v-icon>
              <span class="grey--text">Data płatności:</span>
              <span class="font-weight-bold ml-2">{{ paymentDate }}</span>
            </div>
          </div>

          <v-alert
            type="success"
            text
            class="mt-6 mb-6 text-left"
          >
            <strong>Co dalej?</strong><br>
            Twoje aplikacje są teraz gotowe do przesłania. Przejdź do panelu głównego, aby dokończyć proces rekrutacji.
          </v-alert>

          <div class="d-flex flex-column gap-3">
            <v-btn
              x-large
              color="primary"
              block
              @click="$router.push('/dashboard')"
            >
              <v-icon left>mdi-view-dashboard</v-icon>
              Przejdź do panelu głównego
            </v-btn>
            
            <v-btn
              large
              outlined
              block
              @click="$router.push('/payments')"
            >
              <v-icon left>mdi-receipt</v-icon>
              Zobacz historię płatności
            </v-btn>
          </div>

          <div class="mt-6">
            <p class="text-caption grey--text">
              Potwierdzenie płatności zostało wysłane na Twój adres e-mail
            </p>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      paidAmount: 0,
      paymentDate: new Date().toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  },
  mounted() {
    // Get the most recent completed payment
    const payments = this.$store.getters.userPayments
    const completedPayments = payments.filter(p => p.status === 'completed')
    if (completedPayments.length > 0) {
      const latestPayment = completedPayments.sort((a, b) => 
        new Date(b.paidAt) - new Date(a.paidAt)
      )[0]
      this.paidAmount = latestPayment.amount
      if (latestPayment.paidAt) {
        this.paymentDate = new Date(latestPayment.paidAt).toLocaleDateString('pl-PL', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      }
    }
  }
}
</script>

<style scoped>
.success-container {
  background: linear-gradient(135deg, #bbb 0%, #eee 100%);
  min-height: 100vh;
  padding: 40px 20px;
}

.success-card {
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.success-icon {
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

.payment-details {
  background: #f5f5f7;
  border-radius: 12px;
  padding: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}

.gap-3 {
  gap: 12px;
}
</style>
