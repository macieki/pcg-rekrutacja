<template>
  <v-container fluid class="faq-container pa-8">
    <div class="faq-header">
      <div>
        <p class="eyebrow">Wsparcie</p>
        <h1>Najczęściej zadawane pytania</h1>
        <p class="muted">
          Znajdź odpowiedzi na popularne pytania dotyczące procesu rekrutacji i przygotuj się do aplikacji jak profesjonalista.
        </p>
      </div>
      <div class="header-pill">
        <v-icon small>mdi-clock-outline</v-icon>
        Aktualizacja: {{ lastUpdated }}
      </div>
    </div>

    <v-row class="faq-content">
      <v-col cols="12" md="8">
        <v-card class="faq-card">
          <v-card-text>
            <v-text-field
              v-model="searchQuery"
              prepend-inner-icon="mdi-magnify"
              label="Szukaj pytań"
              outlined
              dense
              clearable
              class="mb-4"
            ></v-text-field>

            <v-expansion-panels
              v-model="openedPanels"
              multiple
              accordion
            >
              <v-expansion-panel
                v-for="(item, index) in filteredFaqItems"
                :key="index"
              >
                <v-expansion-panel-header>
                  <div class="d-flex align-center">
                    <div class="question-chip">
                      <v-icon color="#007AFF">mdi-help-circle</v-icon>
                    </div>
                    <span class="question-text">{{ item.question }}</span>
                  </div>
                </v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-divider class="mb-4"></v-divider>
                  <p class="answer-text">{{ item.answer }}</p>
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

            <v-alert
              v-if="filteredFaqItems.length === 0"
              type="info"
              text
              class="mt-4"
            >
              Brak pytań pasujących do wyszukiwania. Spróbuj innych słów kluczowych.
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <!-- Still Have Questions Card -->
        <v-card class="faq-card mb-4">
          <div class="mini-header">
            <v-icon small>mdi-chat-question</v-icon>
            Masz jeszcze pytania?
          </div>
          <v-card-text>
            <p class="muted mb-4">
              Nie możesz znaleźć tego, czego szukasz? Wyślij nam wiadomość, a nasz zespół rekrutacyjny Ci pomoże.
            </p>
            <v-btn
              block
              color="primary"
              @click="$router.push('/messages')"
            >
              <v-icon left>mdi-email</v-icon>
              Wyślij wiadomość
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Quick Links Card -->
        <v-card class="faq-card">
          <div class="mini-header">
            <v-icon small>mdi-link</v-icon>
            Szybkie linki
          </div>
          <v-list dense class="link-list">
            <v-list-item @click="$router.push('/programmes')">
              <v-list-item-icon>
                <v-icon>mdi-school</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Przeglądaj kierunki</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="$router.push('/applications')">
              <v-list-item-icon>
                <v-icon>mdi-file-document-multiple</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Moje aplikacje</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
            <v-list-item @click="$router.push('/dashboard')">
              <v-list-item-icon>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-content>
                <v-list-item-title>Panel główny</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { faqData } from '~/data/mockData'

export default {
  data() {
    return {
      faqItems: faqData,
      searchQuery: '',
      openedPanels: []
    }
  },
  computed: {
    filteredFaqItems() {
      if (!this.searchQuery) {
        return this.faqItems
      }
      
      const query = this.searchQuery.toLowerCase()
      return this.faqItems.filter(item => 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query)
      )
    },
    lastUpdated() {
      const latest = this.faqItems[0]?.updatedAt || new Date().toISOString()
      return new Date(latest).toLocaleDateString('pl-PL', {
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.faq-container {
  background: #f5f5f7;
  min-height: 100vh;
}

.faq-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 32px;
}

.faq-header h1 {
  margin: 4px 0 8px;
  font-size: 32px;
  color: #1c1c1e;
  letter-spacing: -0.02em;
}

.muted {
  color: #6e6e73;
  margin: 0;
}

.eyebrow {
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-size: 12px;
  color: #909095;
  margin: 0;
}

.header-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 999px;
  background: #fff;
  border: 1px solid #e5e5ea;
  color: #1c1c1e;
  font-weight: 500;
}

.faq-card {
  border-radius: 12px;
  border: 1px solid #e5e5ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
}

.question-chip {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: rgba(0, 122, 255, 0.1);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.question-text {
  font-weight: 600;
  color: #1c1c1e;
}

.answer-text {
  color: #3a3a3c;
  line-height: 1.5;
}

.mini-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  padding: 24px 24px 8px;
}

.faq-card .v-card-text {
  padding: 0 24px 24px;
}

.link-list .v-list-item {
  border-radius: 10px;
  margin: 4px 12px;
}

.link-list .v-list-item:hover {
  background: rgba(0, 122, 255, 0.08) !important;
}

@media (max-width: 960px) {
  .faq-header {
    flex-direction: column;
  }
}

@media (max-width: 600px) {
  .faq-container {
    padding: 24px !important;
  }
}
</style>
