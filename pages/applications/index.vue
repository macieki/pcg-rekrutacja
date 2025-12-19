<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 font-weight-bold mb-2">Moje aplikacje</h1>
        <p class="text-subtitle-1 grey--text">
          Przeglądaj i zarządzaj wszystkimi swoimi aplikacjami na kierunki
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-file-document-multiple</v-icon>
            Aplikacje
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="$router.push('/programmes')">
              <v-icon left>mdi-plus</v-icon>
              Nowa aplikacja
            </v-btn>
          </v-card-title>

          <!-- Loading State -->
          <v-progress-linear v-if="loading" indeterminate></v-progress-linear>

          <!-- Applications Table -->
          <v-data-table
            v-else
            :headers="headers"
            :items="applicationsWithDetails"
            :items-per-page="10"
            class="elevation-0"
          >
            <template v-slot:item.programme="{ item }">
              <div class="py-2">
                <div class="font-weight-medium">{{ item.programmeName }}</div>
                <div class="text-caption grey--text">
                  {{ item.programmeLevel }} • {{ item.programmeMode }}
                </div>
              </div>
            </template>

            <template v-slot:item.status="{ item }">
              <v-chip
                small
                :color="getStatusColor(item.status)"
                :text-color="item.status === 'draft' ? undefined : 'white'"
              >
                <v-icon left small>{{ getStatusIcon(item.status) }}</v-icon>
                {{ getStatusText(item.status) }}
              </v-chip>
            </template>

            <template v-slot:item.progress="{ item }">
              <div style="min-width: 150px;">
                <v-progress-linear
                  :value="item.progress"
                  :color="item.progress === 100 ? 'success' : 'primary'"
                  height="8"
                  rounded
                ></v-progress-linear>
                <div class="text-caption text-center mt-1">{{ item.progress }}%</div>
              </div>
            </template>

            <template v-slot:item.createdAt="{ item }">
              {{ formatDate(item.createdAt) }}
            </template>

            <template v-slot:item.actions="{ item }">
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    icon
                    v-bind="attrs"
                    v-on="on"
                  >
                    <v-icon>mdi-dots-vertical</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-if="item.status === 'draft'"
                    @click="continueApplication(item)"
                  >
                    <v-list-item-icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Kontynuuj</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="viewApplication(item)">
                    <v-list-item-icon>
                      <v-icon>mdi-eye</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title>Zobacz szczegóły</v-list-item-title>
                  </v-list-item>
                  <v-list-item
                    v-if="item.status === 'draft'"
                    @click="confirmDelete(item)"
                  >
                    <v-list-item-icon>
                      <v-icon color="error">mdi-delete</v-icon>
                    </v-list-item-icon>
                    <v-list-item-title class="error--text">Usuń</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </template>

            <template v-slot:no-data>
              <div class="text-center pa-12">
                <v-icon size="80" color="grey lighten-1">mdi-file-document-outline</v-icon>
                <h3 class="title mt-4 mb-2">Brak aplikacji</h3>
                <p class="text-body-1 grey--text mb-6">
                  Zacznij od przeglądania kierunków i stworzenia pierwszej aplikacji
                </p>
                <v-btn color="primary" @click="$router.push('/programmes')">
                  <v-icon left>mdi-school</v-icon>
                  Przeglądaj kierunki
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="400">
      <v-card>
        <v-card-title class="text-h6">
          Usunąć aplikację?
        </v-card-title>
        <v-card-text>
          Czy na pewno chcesz usunąć tę aplikację? Tej operacji nie można cofnąć.
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="deleteDialog = false">
            Anuluj
          </v-btn>
          <v-btn color="error" text @click="deleteApplication">
            Usuń
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { programmes } from '~/data/mockData'

export default {
  middleware: 'auth',
  data() {
    return {
      programmes,
      loading: true,
      deleteDialog: false,
      itemToDelete: null,
      headers: [
        { text: 'Kierunek', value: 'programme', sortable: true },
        { text: 'Status', value: 'status', sortable: true },
        { text: 'Postęp', value: 'progress', sortable: true },
        { text: 'Utworzono', value: 'createdAt', sortable: true },
        { text: 'Akcje', value: 'actions', sortable: false, align: 'center' }
      ]
    }
  },
  computed: {
    ...mapGetters(['userApplications']),
    applicationsWithDetails() {
      return this.userApplications.map(app => {
        const programme = this.programmes.find(p => p.id === app.programmeId)
        const completedSteps = Object.values(app.steps).filter(s => s === 'complete').length
        const totalSteps = Object.keys(app.steps).length
        const progress = Math.round((completedSteps / totalSteps) * 100)

        return {
          ...app,
          programmeName: programme ? programme.name : 'Unknown',
          programmeLevel: programme ? programme.level : '',
          programmeMode: programme ? programme.mode : '',
          progress
        }
      })
    }
  },
  mounted() {
    // Simulate loading
    setTimeout(() => {
      this.loading = false
    }, 500)
  },
  methods: {
    formatDate(dateString) {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-GB', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    },
    getStatusColor(status) {
      switch (status) {
        case 'submitted': return 'success'
        case 'draft': return 'grey lighten-1'
        case 'under-review': return 'info'
        case 'accepted': return 'success'
        case 'rejected': return 'error'
        default: return 'grey'
      }
    },
    getStatusIcon(status) {
      switch (status) {
        case 'submitted': return 'mdi-check-circle'
        case 'draft': return 'mdi-pencil'
        case 'under-review': return 'mdi-clock'
        case 'accepted': return 'mdi-check-all'
        case 'rejected': return 'mdi-close-circle'
        default: return 'mdi-help-circle'
      }
    },
    getStatusText(status) {
      switch (status) {
        case 'submitted': return 'Przesłana'
        case 'incomplete': return 'Niekompletna'
        case 'draft': return 'Szkic'
        case 'under-review': return 'W trakcie weryfikacji'
        case 'accepted': return 'Zaakceptowana'
        case 'rejected': return 'Odrzucona'
        default: return 'Nieznany'
      }
    },
    continueApplication(item) {
      // Find first incomplete step
      const steps = [
        { key: 'personalData', route: '/applications/current/personal-data' },
        { key: 'education', route: '/applications/current/education' },
        { key: 'documents', route: '/applications/current/summary' }
      ]

      const incompleteStep = steps.find(s => item.steps[s.key] !== 'complete')
      if (incompleteStep) {
        this.$router.push(incompleteStep.route)
      } else {
        this.$router.push('/applications/current/summary')
      }
    },
    viewApplication(item) {
      if (item.status === 'submitted') {
        this.$router.push('/applications/current/summary')
      } else {
        this.continueApplication(item)
      }
    },
    confirmDelete(item) {
      this.itemToDelete = item
      this.deleteDialog = true
    },
    deleteApplication() {
      // In a real app, this would call a store action
      this.$store.commit('SHOW_SNACKBAR', { 
        message: 'Aplikacja usunięta', 
        color: 'info' 
      })
      this.deleteDialog = false
      this.itemToDelete = null
    }
  }
}
</script>
