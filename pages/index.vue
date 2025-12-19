<template>
  <div>
    <v-container fluid class="pa-0">
      <!-- Hero Section -->
      <v-row no-gutters>
        <v-col cols="12">
          <v-card
            flat
            tile
            class="hero-gradient text-center py-16"
          >
            <v-container>
              <v-row justify="center">
                <v-col cols="12" md="8">
                  <h1 class="hero-title mb-4">
                    Rozpocznij swoją uniwersytecką przygodę
                  </h1>
                  <p class="hero-subtitle mb-8">
                    Aplikuj online w trzech prostych krokach. Dołącz do tysięcy studentów budujących swą przyszłość.
                  </p>
                  <v-btn
                    x-large
                    color="white"
                    class="primary--text mr-4 text-none"
                    rounded
                    elevation="8"
                    @click="$router.push('/auth/register')"
                  >
                    <v-icon left>mdi-rocket-launch</v-icon>
                    <span class="font-weight-semibold">Zacznij rekrutację</span>
                  </v-btn>
                  <v-btn
                    x-large
                    outlined
                    dark
                    class="text-none"
                    rounded
                    @click="$router.push('/auth/login')"
                  >
                    <span class="font-weight-medium">Zaloguj się</span>
                  </v-btn>
                </v-col>
              </v-row>
            </v-container>
          </v-card>
        </v-col>
      </v-row>

      <!-- Three Steps Timeline -->
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" class="text-center mb-8">
            <h2 class="display-1 font-weight-bold mb-2">Jak to działa</h2>
            <p class="title grey--text">
              Wypełnij swoją aplikację w trzech łatwych krokach
            </p>
          </v-col>
        </v-row>

        <v-row justify="center">
          <v-col cols="12" md="10">
            <v-timeline align-top>
              <v-timeline-item
                v-for="(step, index) in steps"
                :key="index"
                :color="step.color"
                :icon="step.icon"
                fill-dot
                large
              >
                <template v-slot:opposite>
                  <span class="headline font-weight-bold" :class="`${step.color}--text`">
                    Step {{ index + 1 }}
                  </span>
                </template>
                <v-card class="elevation-2">
                  <v-card-title :class="`${step.color} white--text`">
                    {{ step.title }}
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <p class="text-body-1">{{ step.description }}</p>
                    <v-chip
                      v-for="item in step.items"
                      :key="item"
                      class="ma-1"
                      small
                      outlined
                    >
                      {{ item }}
                    </v-chip>
                  </v-card-text>
                </v-card>
              </v-timeline-item>
            </v-timeline>
          </v-col>
        </v-row>
      </v-container>

      <!-- Features Section -->
      <v-container fluid class="grey lighten-4 py-12">
        <v-container>
          <v-row justify="center">
            <v-col cols="12" class="text-center mb-8">
              <h2 class="display-1 font-weight-bold mb-2">Dlaczego rekrutacja online?</h2>
            </v-col>
          </v-row>

          <v-row>
            <v-col
              v-for="feature in features"
              :key="feature.title"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card class="text-center pa-4" height="100%">
                <v-icon :color="feature.color" size="64" class="mb-4">
                  {{ feature.icon }}
                </v-icon>
                <h3 class="title mb-2">{{ feature.title }}</h3>
                <p class="text-body-2 grey--text">{{ feature.description }}</p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>

      <!-- CTA Section -->
      <v-container class="py-12">
        <v-row justify="center">
          <v-col cols="12" md="8">
            <v-card color="primary" dark class="text-center pa-8">
              <h2 class="display-1 font-weight-bold mb-4">
                Gotowy, aby zacząć?
              </h2>
              <p class="headline font-weight-light mb-6">
                Załóż swoje konto teraz i zacznij swoją aplikację już dziś
              </p>
              <v-btn
                x-large
                color="white"
                class="primary--text"
                @click="$router.push('/auth/register')"
              >
                <v-icon left>mdi-account-plus</v-icon>
                Załóż konto
              </v-btn>
            </v-card>
          </v-col>
        </v-row>
      </v-container>

      <!-- Statistics -->
      <v-container fluid class="grey lighten-4 py-12">
        <v-container>
          <v-row>
            <v-col
              v-for="stat in statistics"
              :key="stat.label"
              cols="12"
              sm="6"
              md="3"
            >
              <v-card class="text-center pa-6">
                <div class="display-2 font-weight-bold primary--text mb-2">
                  {{ stat.value }}
                </div>
                <div class="title grey--text">{{ stat.label }}</div>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-container>
    </v-container>
  </div>
</template>

<script>
export default {
  layout: 'default',
  middleware({ store, redirect }) {
    // Redirect to programmes catalogue as default entry
    return redirect('/programmes')
  },
  data() {
    return {
      steps: [
        {
          title: 'Załóż konto',
          description: 'Zarejestruj się swoim emailem i stwórz profil kandydata. Zajmie to mniej niż 2 minuty.',
          color: 'primary',
          icon: 'mdi-account-plus',
          items: ['Weryfikacja email', 'Ustawienie hasła', 'Utworzenie profilu']
        },
        {
          title: 'Wybierz kierunek',
          description: 'Przeglądaj nasze kierunki, filtruj według preferencji i wybierz ten, który odpowiada Twoim celom.',
          color: 'success',
          icon: 'mdi-school',
          items: ['Katalog kierunków', 'Szczegółowe opisy', 'Wymagania wstępne']
        },
        {
          title: 'Wyślij dokumenty',
          description: 'Wypełnij dane osobowe, historię edukacji, prześlij wyniki egzaminów i wyślij aplikację.',
          color: 'info',
          icon: 'mdi-file-document',
          items: ['Dane osobowe', 'Wyniki egzaminów', 'Świadectwo szkoły', 'Przesłanie zdjęcia']
        }
      ],
      features: [
        {
          title: 'Dostęp 24/7',
          description: 'Wypełnij swoją aplikację o dowolnej porze, z dowolnego miejsca, z dowolnego urządzenia',
          icon: 'mdi-clock-outline',
          color: 'primary'
        },
        {
          title: 'Zapisz postępy',
          description: 'Twoje dane są zapisywane automatycznie. Wróć i kontynuuj później',
          icon: 'mdi-content-save',
          color: 'success'
        },
        {
          title: 'Śledź status',
          description: 'Monitoruj status swojej aplikacji w czasie rzeczywistym z panelu głównego',
          icon: 'mdi-chart-timeline-variant',
          color: 'info'
        },
        {
          title: 'Szybkie wsparcie',
          description: 'Uzyskaj pomoc poprzez nasz system wiadomości i obszerne FAQ',
          icon: 'mdi-help-circle',
          color: 'warning'
        }
      ],
      statistics: [
        { value: '50+', label: 'Kierunków' },
        { value: '15,000+', label: 'Studentów' },
        { value: '98%', label: 'Zadowolenia' },
        { value: '24/7', label: 'Wsparcie' }
      ]
    }
  }
}
</script>

<style scoped>
.hero-gradient {
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  color: white;
}

.hero-title {
  font-size: 56px;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.1;
}

.hero-subtitle {
  font-size: 24px;
  font-weight: 400;
  letter-spacing: -0.01em;
  opacity: 0.95;
  line-height: 1.4;
}

@media (max-width: 960px) {
  .hero-title {
    font-size: 40px;
  }
  
  .hero-subtitle {
    font-size: 20px;
  }
}
</style>
