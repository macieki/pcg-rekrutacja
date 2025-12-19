<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-btn text @click="$router.push('/applications/current/personal-data')" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Wróć do danych osobowych
        </v-btn>

        <h1 class="display-1 font-weight-bold mb-2">Wybierz dyplom</h1>
        <p class="text-subtitle-1 grey--text mb-4">
          Wybierz istniejący dyplom lub dodaj nowy dla tej aplikacji
        </p>

        <!-- Progress indicator -->
        <v-progress-linear
          :value="50"
          height="10"
          rounded
          color="primary"
          class="mb-6"
        ></v-progress-linear>
      </v-col>
    </v-row>

    <v-row v-if="diplomas.length === 0">
      <v-col cols="12">
        <v-card class="empty-state text-center pa-8">
          <v-icon size="100" color="grey lighten-1" class="mb-4">
            mdi-certificate-outline
          </v-icon>
          <h2 class="mb-4">Nie masz jeszcze żadnych dyplomów</h2>
          <p class="text-body-1 grey--text mb-6">
            Musisz dodać swoje świadectwo maturalne lub dyplom, aby kontynuować aplikację
          </p>
          <v-btn
            x-large
            color="primary"
            @click="createNewDiploma"
          >
            <v-icon left>mdi-plus</v-icon>
            Dodaj dyplom
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-card class="mb-6">
          <v-card-title>
            <v-icon left>mdi-certificate</v-icon>
            Wybierz istniejący dyplom
          </v-card-title>
          <v-divider></v-divider>
          
          <v-radio-group v-model="selectedDiplomaId" class="pa-4">
            <v-card
              v-for="diploma in diplomas"
              :key="diploma.id"
              outlined
              class="diploma-option mb-3"
              :class="{ 'selected': selectedDiplomaId === diploma.id }"
              @click="selectedDiplomaId = diploma.id"
            >
              <v-card-text class="d-flex align-center">
                <v-radio :value="diploma.id" class="mr-4"></v-radio>
                
                <div class="flex-grow-1">
                  <div class="d-flex align-center mb-2">
                    <h3 class="font-weight-bold mr-3">{{ diploma.secondarySchool.name }}</h3>
                    <v-chip
                      small
                      :color="getTypeColor(diploma.type)"
                      dark
                    >
                      {{ diploma.type }}
                    </v-chip>
                    <v-chip
                      small
                      :color="getStatusColor(diploma.status)"
                      dark
                      class="ml-2"
                    >
                      {{ getStatusLabel(diploma.status) }}
                    </v-chip>
                  </div>
                  
                  <div class="grey--text">
                    <v-icon small class="mr-1">mdi-map-marker</v-icon>
                    {{ diploma.secondarySchool.city }}, {{ diploma.secondarySchool.voivodeship }}
                    <v-icon small class="ml-3 mr-1">mdi-calendar</v-icon>
                    {{ diploma.graduationYear }}
                    <v-icon small class="ml-3 mr-1">mdi-book-open-variant</v-icon>
                    {{ diploma.subjects.length }} przedmiotów
                  </div>
                </div>

                <v-btn
                  icon
                  @click.stop="viewDiploma(diploma.id)"
                >
                  <v-icon>mdi-eye</v-icon>
                </v-btn>
              </v-card-text>
            </v-card>
          </v-radio-group>
        </v-card>

        <v-card class="mb-6">
          <v-card-text class="d-flex align-center justify-space-between">
            <div>
              <h3 class="font-weight-bold mb-2">Lub dodaj nowy dyplom</h3>
              <p class="grey--text mb-0">
                Jeśli nie masz odpowiedniego dyplomu na liście, możesz dodać nowy
              </p>
            </div>
            <v-btn
              large
              outlined
              color="primary"
              @click="createNewDiploma"
            >
              <v-icon left>mdi-plus</v-icon>
              Dodaj nowy dyplom
            </v-btn>
          </v-card-text>
        </v-card>

        <!-- Actions -->
        <v-card>
          <v-card-actions class="pa-4">
            <v-btn
              text
              large
              @click="$router.push('/applications/current/personal-data')"
            >
              <v-icon left>mdi-arrow-left</v-icon>
              Wstecz
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              large
              color="primary"
              :disabled="!selectedDiplomaId"
              @click="linkDiploma"
              :loading="loading"
            >
              Kontynuuj
              <v-icon right>mdi-arrow-right</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <!-- Diploma Summary Card -->
    <v-row v-if="selectedDiploma">
      <v-col cols="12">
        <v-card color="blue lighten-5" class="mt-6">
          <v-card-title class="d-flex align-center">
            <v-icon left color="primary">mdi-information</v-icon>
            Wybrany dyplom
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text>
            <v-simple-table dense>
              <template v-slot:default>
                <tbody>
                  <tr>
                    <td class="font-weight-bold">Szkoła:</td>
                    <td>{{ selectedDiploma.secondarySchool.name }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Typ:</td>
                    <td>{{ selectedDiploma.type }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Rok ukończenia:</td>
                    <td>{{ selectedDiploma.graduationYear }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Numer świadectwa:</td>
                    <td>{{ selectedDiploma.documentNumber }}</td>
                  </tr>
                  <tr>
                    <td class="font-weight-bold">Przedmioty:</td>
                    <td>
                      <v-chip
                        v-for="(subject, idx) in selectedDiploma.subjects"
                        :key="idx"
                        x-small
                        class="mr-1"
                      >
                        {{ subject.name }}: {{ subject.score }}%
                      </v-chip>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      selectedDiplomaId: null,
      loading: false
    }
  },
  computed: {
    diplomas() {
      return this.$store.getters.userDiplomas
    },
    selectedDiploma() {
      if (!this.selectedDiplomaId) return null
      return this.$store.getters.getDiplomaById(this.selectedDiplomaId)
    },
    activeApplication() {
      return this.$store.getters.activeApplication
    }
  },
  mounted() {
    // Pre-select if application already has diploma
    if (this.activeApplication && this.activeApplication.diplomaId) {
      this.selectedDiplomaId = this.activeApplication.diplomaId
    }
  },
  methods: {
    getTypeColor(type) {
      const map = {
        'Matura polska nowa': 'blue',
        'Matura polska stara': 'purple',
        'Dyplom zagraniczny': 'green'
      }
      return map[type] || 'grey'
    },
    getStatusColor(status) {
      const map = {
        'draft': 'grey',
        'submitted': 'orange',
        'verified': 'green'
      }
      return map[status] || 'grey'
    },
    getStatusLabel(status) {
      const map = {
        'draft': 'Wersja robocza',
        'submitted': 'Przesłany',
        'verified': 'Zweryfikowany'
      }
      return map[status] || status
    },
    viewDiploma(diplomaId) {
      window.open(`/diplomas/${diplomaId}`, '_blank')
    },
    createNewDiploma() {
      // Store current application context and redirect to add diploma
      this.$router.push('/diplomas/add?returnTo=/applications/current/link-diploma')
    },
    async linkDiploma() {
      if (!this.selectedDiplomaId || !this.activeApplication) return

      this.loading = true
      try {
        await this.$store.dispatch('linkDiplomaToApplication', {
          applicationId: this.activeApplication.id,
          diplomaId: this.selectedDiplomaId
        })

        // Redirect to payment or summary
        this.$router.push('/applications/current/summary')
      } catch (error) {
        console.error('Error linking diploma:', error)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.empty-state {
  border-radius: 12px;
  border: 2px dashed #e0e0e0;
}

.diploma-option {
  cursor: pointer;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.diploma-option:hover {
  border-color: #2196F3;
  background-color: #f5f9ff;
}

.diploma-option.selected {
  border-color: #2196F3;
  background-color: #e3f2fd;
}
</style>
