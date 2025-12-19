<template>
  <v-container fluid class="diplomas-container pa-8">
    <div class="diplomas-header">
      <div>
        <p class="eyebrow">Dokumenty</p>
        <h1>Moje dyplomy</h1>
        <p class="muted">
          Zarządzaj swoimi świadectwami maturalnymi i dyplomami. Dodaj dokumenty raz i użyj ich w wielu aplikacjach.
        </p>
      </div>
      <v-btn
        color="primary"
        large
        @click="$router.push('/diplomas/add')"
      >
        <v-icon left>mdi-plus</v-icon>
        Dodaj dyplom
      </v-btn>
    </div>

    <v-row v-if="diplomas.length === 0" class="mt-8">
      <v-col cols="12">
        <v-card class="empty-state">
          <div class="empty-icon">
            <v-icon size="80" color="#007AFF">mdi-certificate-outline</v-icon>
          </div>
          <h3>Nie masz jeszcze żadnych dyplomów</h3>
          <p class="muted">
            Dodaj swoje świadectwo maturalne lub dyplom, aby móc go używać w aplikacjach rekrutacyjnych.
          </p>
          <v-btn
            color="primary"
            large
            class="mt-4"
            @click="$router.push('/diplomas/add')"
          >
            <v-icon left>mdi-plus</v-icon>
            Dodaj pierwszy dyplom
          </v-btn>
        </v-card>
      </v-col>
    </v-row>

    <v-row v-else class="mt-6">
      <v-col
        v-for="diploma in diplomas"
        :key="diploma.id"
        cols="12"
        md="6"
        lg="4"
      >
        <v-card class="diploma-card" @click="viewDiploma(diploma.id)">
          <div class="diploma-type-badge" :class="getTypeBadgeClass(diploma.type)">
            <v-icon small>{{ getTypeIcon(diploma.type) }}</v-icon>
            {{ diploma.type }}
          </div>

          <v-card-text>
            <div class="diploma-status-chip" :class="diploma.status">
              <v-icon small>{{ getStatusIcon(diploma.status) }}</v-icon>
              {{ getStatusLabel(diploma.status) }}
            </div>

            <h3 class="diploma-title mt-3">{{ diploma.secondarySchool.name }}</h3>
            
            <div class="diploma-meta">
              <div class="meta-item">
                <v-icon small color="#6e6e73">mdi-calendar</v-icon>
                <span>{{ diploma.graduationYear }}</span>
              </div>
              <div class="meta-item">
                <v-icon small color="#6e6e73">mdi-file-document</v-icon>
                <span>{{ diploma.documentNumber }}</span>
              </div>
              <div class="meta-item">
                <v-icon small color="#6e6e73">mdi-book-open-variant</v-icon>
                <span>{{ diploma.subjects.length }} przedmiotów</span>
              </div>
            </div>

            <div class="diploma-subjects mt-4">
              <v-chip
                v-for="(subject, idx) in diploma.subjects.slice(0, 3)"
                :key="idx"
                small
                class="mr-2 mb-2"
              >
                {{ subject.name }}
              </v-chip>
              <v-chip
                v-if="diploma.subjects.length > 3"
                small
                class="mb-2"
              >
                +{{ diploma.subjects.length - 3 }}
              </v-chip>
            </div>

            <div class="diploma-date">
              Dodano {{ formatDate(diploma.createdAt) }}
            </div>
          </v-card-text>

          <v-card-actions>
            <v-btn
              text
              color="primary"
              @click.stop="viewDiploma(diploma.id)"
            >
              <v-icon left small>mdi-eye</v-icon>
              Zobacz szczegóły
            </v-btn>
            <v-spacer></v-spacer>
            <v-btn
              icon
              @click.stop="editDiploma(diploma.id)"
            >
              <v-icon>mdi-pencil</v-icon>
            </v-btn>
            <v-btn
              icon
              @click.stop="confirmDelete(diploma.id)"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
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
      deleteDialog: false,
      diplomaToDelete: null
    }
  },
  computed: {
    diplomas() {
      return this.$store.getters.userDiplomas
    }
  },
  methods: {
    viewDiploma(id) {
      this.$router.push(`/diplomas/${id}`)
    },
    editDiploma(id) {
      this.$router.push(`/diplomas/${id}/edit`)
    },
    confirmDelete(id) {
      this.diplomaToDelete = id
      this.deleteDialog = true
    },
    async deleteDiploma() {
      if (this.diplomaToDelete) {
        await this.$store.dispatch('deleteDiploma', this.diplomaToDelete)
        this.deleteDialog = false
        this.diplomaToDelete = null
      }
    },
    getTypeBadgeClass(type) {
      const map = {
        'Matura polska nowa': 'polish-new',
        'Matura polska stara': 'polish-old',
        'Dyplom zagraniczny': 'foreign'
      }
      return map[type] || 'default'
    },
    getTypeIcon(type) {
      const map = {
        'Matura polska nowa': 'mdi-certificate',
        'Matura polska stara': 'mdi-certificate-outline',
        'Dyplom zagraniczny': 'mdi-earth'
      }
      return map[type] || 'mdi-certificate'
    },
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
    formatDate(dateString) {
      return new Date(dateString).toLocaleDateString('pl-PL', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    }
  }
}
</script>

<style scoped>
.diplomas-container {
  background: #f5f5f7;
  min-height: 100vh;
}

.diplomas-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  margin-bottom: 24px;
}

.diplomas-header h1 {
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

.diploma-card {
  border-radius: 12px;
  border: 1px solid #e5e5ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  overflow: visible;
}

.diploma-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.diploma-type-badge {
  position: absolute;
  top: 16px;
  right: 16px;
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 6px;
}

.diploma-type-badge.polish-new {
  background: rgba(0, 122, 255, 0.1);
  color: #007AFF;
}

.diploma-type-badge.polish-old {
  background: rgba(88, 86, 214, 0.1);
  color: #5856D6;
}

.diploma-type-badge.foreign {
  background: rgba(52, 199, 89, 0.1);
  color: #34C759;
}

.diploma-status-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 500;
}

.diploma-status-chip.draft {
  background: rgba(142, 142, 147, 0.12);
  color: #8e8e93;
}

.diploma-status-chip.submitted {
  background: rgba(255, 149, 0, 0.12);
  color: #FF9500;
}

.diploma-status-chip.verified {
  background: rgba(52, 199, 89, 0.12);
  color: #34C759;
}

.diploma-title {
  color: #1c1c1e;
  font-size: 18px;
  margin: 16px 0 12px;
}

.diploma-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6e6e73;
  font-size: 14px;
}

.diploma-subjects {
  min-height: 40px;
}

.diploma-date {
  color: #8e8e93;
  font-size: 12px;
  margin-top: 16px;
}

@media (max-width: 960px) {
  .diplomas-header {
    flex-direction: column;
  }

  .diplomas-header v-btn {
    width: 100%;
  }
}

@media (max-width: 600px) {
  .diplomas-container {
    padding: 24px !important;
  }
}
</style>
