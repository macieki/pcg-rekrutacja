<template>
  <v-container fluid class="pa-6">
    <v-row v-if="diploma">
      <v-col cols="12">
        <v-btn text @click="$router.push('/diplomas')" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Wróć do listy dyplomów
        </v-btn>

        <v-card class="diploma-detail-card">
          <v-card-title class="d-flex justify-space-between align-center">
            <div>
              <h1 class="display-1 font-weight-bold">{{ diploma.secondarySchool.name }}</h1>
              <div class="mt-2">
                <v-chip :color="getStatusColor(diploma.status)" dark small>
                  <v-icon left small>{{ getStatusIcon(diploma.status) }}</v-icon>
                  {{ getStatusLabel(diploma.status) }}
                </v-chip>
              </div>
            </div>
            <div>
              <v-btn
                color="primary"
                @click="$router.push(`/diplomas/${$route.params.id}/edit`)"
              >
                <v-icon left>mdi-pencil</v-icon>
                Edytuj
              </v-btn>
            </div>
          </v-card-title>

          <v-divider></v-divider>

          <v-card-text class="pa-6">
            <!-- Basic Info Section -->
            <v-row>
              <v-col cols="12" md="6">
                <h3 class="subtitle-1 font-weight-bold mb-4">Informacje podstawowe</h3>
                
                <div class="info-item">
                  <div class="info-label">Typ dyplomu</div>
                  <div class="info-value">
                    <v-chip :color="getTypeColor(diploma.type)" dark small>
                      <v-icon left small>{{ getTypeIcon(diploma.type) }}</v-icon>
                      {{ diploma.type }}
                    </v-chip>
                  </div>
                </div>

                <div class="info-item">
                  <div class="info-label">Szkoła</div>
                  <div class="info-value">{{ diploma.secondarySchool.name }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">Lokalizacja</div>
                  <div class="info-value">{{ diploma.secondarySchool.city }}, {{ diploma.secondarySchool.voivodeship }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">Rok ukończenia</div>
                  <div class="info-value">{{ diploma.graduationYear }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">Numer świadectwa</div>
                  <div class="info-value">{{ diploma.documentNumber }}</div>
                </div>
              </v-col>

              <v-col cols="12" md="6">
                <h3 class="subtitle-1 font-weight-bold mb-4">Informacje systemowe</h3>
                
                <div class="info-item">
                  <div class="info-label">Data dodania</div>
                  <div class="info-value">{{ formatDate(diploma.createdAt) }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">Ostatnia aktualizacja</div>
                  <div class="info-value">{{ formatDate(diploma.updatedAt) }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">Status</div>
                  <div class="info-value">{{ getStatusLabel(diploma.status) }}</div>
                </div>

                <div class="info-item">
                  <div class="info-label">Liczba przedmiotów</div>
                  <div class="info-value">{{ diploma.subjects.length }}</div>
                </div>
              </v-col>
            </v-row>

            <v-divider class="my-6"></v-divider>

            <!-- Subjects Section -->
            <h3 class="subtitle-1 font-weight-bold mb-4">Przedmioty i wyniki</h3>
            
            <v-simple-table>
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Przedmiot</th>
                    <th class="text-left">Poziom</th>
                    <th class="text-left">Wynik</th>
                    <th class="text-left">Ocena</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(subject, index) in diploma.subjects" :key="index">
                    <td class="font-weight-medium">{{ subject.name }}</td>
                    <td>
                      <v-chip small :color="subject.examType === 'Rozszerzony' ? 'purple' : 'blue'" dark>
                        {{ subject.examType }}
                      </v-chip>
                    </td>
                    <td>
                      <v-chip small :color="getScoreColor(subject.score)" dark>
                        {{ subject.score }}%
                      </v-chip>
                    </td>
                    <td>{{ getGrade(subject.score) }}</td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>

            <v-divider class="my-6"></v-divider>

            <!-- Actions Section -->
            <div class="d-flex justify-space-between align-center">
              <div>
                <v-btn
                  text
                  color="error"
                  @click="confirmDelete"
                >
                  <v-icon left>mdi-delete</v-icon>
                  Usuń dyplom
                </v-btn>
              </div>
              <div>
                <v-btn
                  color="primary"
                  @click="$router.push(`/diplomas/${$route.params.id}/edit`)"
                >
                  <v-icon left>mdi-pencil</v-icon>
                  Edytuj dyplom
                </v-btn>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else>
      <v-col cols="12">
        <v-alert type="error" prominent>
          <v-row align="center">
            <v-col class="grow">
              Nie znaleziono dyplomu
            </v-col>
            <v-col class="shrink">
              <v-btn @click="$router.push('/diplomas')">Wróć do listy</v-btn>
            </v-col>
          </v-row>
        </v-alert>
      </v-col>
    </v-row>

    <!-- Delete confirmation dialog -->
    <v-dialog v-model="deleteDialog" max-width="500">
      <v-card>
        <v-card-title>Usuń dyplom?</v-card-title>
        <v-card-text>
          Czy na pewno chcesz usunąć ten dyplom? Ta operacja jest nieodwracalna.
          Dyplom zostanie odłączony od wszystkich aplikacji.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">Anuluj</v-btn>
          <v-btn color="error" @click="deleteDiploma">Usuń</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      deleteDialog: false
    }
  },
  computed: {
    diploma() {
      const id = parseInt(this.$route.params.id)
      return this.$store.getters.getDiplomaById(id)
    }
  },
  methods: {
    getStatusIcon(status) {
      const map = {
        'draft': 'mdi-pencil',
        'submitted': 'mdi-clock-outline',
        'verified': 'mdi-check-circle'
      }
      return map[status] || 'mdi-help-circle'
    },
    getStatusLabel(status) {
      const map = {
        'draft': 'Wersja robocza',
        'submitted': 'Przesłany',
        'verified': 'Zweryfikowany'
      }
      return map[status] || status
    },
    getStatusColor(status) {
      const map = {
        'draft': 'grey',
        'submitted': 'orange',
        'verified': 'green'
      }
      return map[status] || 'grey'
    },
    getTypeIcon(type) {
      const map = {
        'Matura polska nowa': 'mdi-certificate',
        'Matura polska stara': 'mdi-certificate-outline',
        'Dyplom zagraniczny': 'mdi-earth'
      }
      return map[type] || 'mdi-certificate'
    },
    getTypeColor(type) {
      const map = {
        'Matura polska nowa': 'blue',
        'Matura polska stara': 'purple',
        'Dyplom zagraniczny': 'green'
      }
      return map[type] || 'grey'
    },
    getScoreColor(score) {
      if (score >= 80) return 'green'
      if (score >= 60) return 'orange'
      return 'red'
    },
    getGrade(score) {
      if (score >= 90) return 'Celujący'
      if (score >= 75) return 'Bardzo dobry'
      if (score >= 60) return 'Dobry'
      if (score >= 45) return 'Dostateczny'
      if (score >= 30) return 'Dopuszczający'
      return 'Niedostateczny'
    },
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    },
    confirmDelete() {
      this.deleteDialog = true
    },
    async deleteDiploma() {
      await this.$store.dispatch('deleteDiploma', this.diploma.id)
      this.$router.push('/diplomas')
    }
  }
}
</script>

<style scoped>
.diploma-detail-card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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
</style>
