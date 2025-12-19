<template>
  <div v-if="application" class="application-progress">
    <v-card flat class="mb-4 progress-card">
      <v-card-text class="pb-3">
        <div class="d-flex justify-space-between align-center mb-3">
          <div>
            <span class="progress-title">{{ programmeName }}</span>
            <span class="progress-percent">{{ progressText }}</span>
          </div>
          <v-chip 
            small 
            :color="progress === 100 ? 'success' : 'primary'" 
            class="font-weight-semibold"
            style="border-radius: 8px;"
          >
            {{ progress === 100 ? '✓ Gotowe' : 'W trakcie' }}
          </v-chip>
        </div>
        <v-progress-linear
          :value="progress"
          :color="progress === 100 ? 'success' : 'primary'"
          height="6"
          rounded
          class="apple-progress"
        ></v-progress-linear>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { programmes } from '~/data/mockData'

export default {
  name: 'ApplicationProgress',
  computed: {
    ...mapGetters(['activeApplication', 'applicationProgress']),
    application() {
      return this.activeApplication
    },
    progress() {
      return this.applicationProgress
    },
    progressText() {
      if (this.progress === 100) {
        return 'Wszystkie kroki ukończone'
      }
      if (this.application?.steps?.submitted) {
        return 'Oczekiwanie na dokumenty'
      }
      return `${this.progress}% ukończone`
    },
    programmeName() {
      if (!this.application) return ''
      const programme = programmes.find(p => p.id === this.application.programmeId)
      return programme ? programme.name : 'Nieznany kierunek'
    }
  }
}
</script>

<style scoped>
.application-progress {
  position: sticky;
  top: 64px;
  z-index: 5;
  background: transparent;
}

.progress-card {
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(20px);
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
  border-radius: 12px !important;
}

.progress-title {
  font-size: 15px;
  font-weight: 600;
  color: #1d1d1f;
  display: block;
  letter-spacing: -0.01em;
}

.progress-percent {
  font-size: 13px;
  color: #86868b;
  display: block;
  margin-top: 2px;
  font-weight: 500;
}

.apple-progress {
  background: rgba(0, 122, 255, 0.1) !important;
}
</style>
