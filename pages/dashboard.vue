<template>
  <div class="dashboard-wrapper">
  <v-container fluid class="dashboard-container pa-8">
    <!-- Deadline Notifications -->
    <div v-if="upcomingDeadlines.length > 0" class="deadline-alerts mb-4">
      <v-alert
        v-for="deadline in upcomingDeadlines"
        :key="deadline.id"
        :type="deadline.type"
        dense
        border="left"
        class="compact-alert mb-2"
      >
        <v-row align="center" no-gutters>
          <v-col class="grow">
            <strong>{{ deadline.title }}</strong>
            <span class="ml-2 text-caption">{{ deadline.message }}</span>
          </v-col>
          <v-col class="shrink">
            <v-btn
              small
              :color="deadline.btnColor"
              @click="deadline.action"
            >
              <v-icon left small>{{ deadline.btnIcon }}</v-icon>
              {{ deadline.btnText }}
            </v-btn>
          </v-col>
        </v-row>
      </v-alert>
    </div>

    <!-- Payment Alert -->
    <v-alert
      v-if="unpaidApplications.length > 0"
      type="warning"
      dense
      border="left"
      class="compact-alert mb-4"
    >
      <v-row align="center" no-gutters>
        <v-col class="grow">
          <strong>Masz {{ unpaidApplications.length }} nieopłaconych aplikacji</strong>
          <span class="ml-2 text-caption">Łączna kwota: {{ totalUnpaidAmount }} PLN</span>
        </v-col>
        <v-col class="shrink">
          <v-btn
            small
            color="primary"
            @click="$router.push('/payments/checkout')"
          >
            <v-icon left small>mdi-credit-card</v-icon>
            Zapłać wszystkie ({{ totalUnpaidAmount }} PLN)
          </v-btn>
        </v-col>
      </v-row>
    </v-alert>

    <div class="dashboard-header mb-10">
      <h1 class="page-title mb-2">Panel główny</h1>
      <p class="page-subtitle">
        Witaj z powrotem, {{ userName }}! Zarządzaj swoimi aplikacjami.
      </p>
    </div>

    <!-- No Applications State -->
    <div v-if="!userApplications || userApplications.length === 0" class="empty-state">
      <v-card class="empty-card">
        <div class="empty-content">
          <v-icon size="64" color="#C7C7CC" class="mb-4">mdi-school-outline</v-icon>
          <h2 class="empty-title mb-3">Brak aktywnych aplikacji</h2>
          <p class="empty-text mb-6">
            Rozpocznij swoją przygodę uniwersytecką wybierając kierunek studiów
          </p>
          <button class="primary-btn-large" @click="$router.push('/programmes')">
            <v-icon left size="20">mdi-plus</v-icon>
            Przeglądaj kierunki
          </button>
        </div>
      </v-card>
    </div>

    <!-- Applications Grid with Timeline -->
    <div v-else class="dashboard-content">
      <div class="applications-grid">
      <div 
        v-for="(application, index) in sortedApplications" 
        :key="application.id"
        class="application-card"
        :class="{ 'dragging': draggedIndex === index }"
        draggable="true"
        @click="setActiveApplication(application.id)"
        @dragstart="handleDragStart(index, $event)"
        @dragover.prevent="handleDragOver(index, $event)"
        @drop="handleDrop(index)"
        @dragend="handleDragEnd"
      >
        <div class="card-header" draggable="false">
          <div class="header-row">
            <div 
              v-if="application.steps.documentDelivery"
              class="delivery-badge"
              draggable="false"
            >
              <v-icon size="14" color="#34C759">mdi-check-circle</v-icon>
              Aplikacja złożona
            </div>
            <span 
              v-else
              :class="['status-badge', `status-${application.status}`]"
              draggable="false"
            >
              {{ getStatusText(application.status) }}
            </span>
            <div class="priority-controls" @click.stop draggable="false">
              <button 
                class="priority-btn"
                @click="changePriority(application.id, -1)"
                :disabled="index === 0"
              >
                <v-icon size="16">mdi-plus</v-icon>
              </button>
              <span class="priority-label">Priorytet {{ index + 1 }}</span>
              <button 
                class="priority-btn"
                @click="changePriority(application.id, 1)"
                :disabled="index === sortedApplications.length - 1"
              >
                <v-icon size="16">mdi-minus</v-icon>
              </button>
            </div>
          </div>
          <h3 class="application-title">
            {{ getProgrammeName(application.programmeId) }}
          </h3>
        </div>
        
        <div class="card-body">
          <!-- Progress -->
          <div class="progress-section">
            <div class="progress-header">
              <span class="progress-label">Postęp</span>
              <span class="progress-value">{{ getProgress(application) }}%</span>
            </div>
            <div class="progress-bar-wrapper">
              <div 
                class="progress-bar-fill" 
                :style="{ width: getProgress(application) + '%' }"
                :class="{ 'complete': getProgress(application) === 100 }"
              ></div>
            </div>
          </div>

          <!-- Steps Checklist -->
          <div class="steps-list">
            <div class="step-item">
              <v-icon 
                size="16"
                :color="application.steps.personalData ? '#34C759' : '#C7C7CC'"
                class="step-icon"
              >
                {{ application.steps.personalData ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              <span class="step-label" :class="{ 'completed': application.steps.personalData }">
                Dane osobowe
              </span>
            </div>
            <div class="step-item">
              <v-icon 
                size="16"
                :color="application.steps.diplomaLinked ? '#34C759' : '#C7C7CC'"
                class="step-icon"
              >
                {{ application.steps.diplomaLinked ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              <span class="step-label" :class="{ 'completed': application.steps.diplomaLinked }">
                Dyplom
              </span>
            </div>
            <div class="step-item">
              <v-icon 
                size="16"
                :color="application.steps.paymentComplete ? '#34C759' : '#C7C7CC'"
                class="step-icon"
              >
                {{ application.steps.paymentComplete ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              <span class="step-label" :class="{ 'completed': application.steps.paymentComplete }">
                Płatność
              </span>
            </div>
            <div class="step-item">
              <v-icon 
                size="16"
                :color="application.steps.submitted ? '#34C759' : '#C7C7CC'"
                class="step-icon"
              >
                {{ application.steps.submitted ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              <span class="step-label" :class="{ 'completed': application.steps.submitted }">
                Wysłano
              </span>
            </div>
            <div class="step-item">
              <v-icon 
                size="16"
                :color="application.steps.documentDelivery ? '#34C759' : '#C7C7CC'"
                class="step-icon"
              >
                {{ application.steps.documentDelivery ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              <span class="step-label" :class="{ 'completed': application.steps.documentDelivery }">
                Dostarczenie dokumentów
              </span>
            </div>
            <div 
              v-if="requiresExams(application.programmeId)"
              class="step-item">
              <v-icon 
                size="16"
                :color="application.steps.exams ? '#34C759' : '#C7C7CC'"
                class="step-icon"
              >
                {{ application.steps.exams ? 'mdi-check-circle' : 'mdi-circle-outline' }}
              </v-icon>
              <span class="step-label" :class="{ 'completed': application.steps.exams }">
                Egzaminy
              </span>
            </div>
          </div>
        </div>

        <div class="card-divider"></div>

        <div class="card-footer">
          <button
            v-if="!application.steps.personalData"
            class="primary-btn-block"
            @click.stop="continueApplication(application)"
          >
            <v-icon left size="18">mdi-pencil</v-icon>
            Uzupełnij dane osobowe
          </button>
          <button
            v-else-if="!application.steps.diplomaLinked"
            class="primary-btn-block"
            @click.stop="continueApplication(application)"
          >
            <v-icon left size="18">mdi-link</v-icon>
            Połącz dyplom
          </button>
          <button
            v-else-if="!application.steps.paymentComplete"
            class="primary-btn-block"
            @click.stop="continueApplication(application)"
          >
            <v-icon left size="18">mdi-credit-card</v-icon>
            Przejdź do płatności
          </button>
          <button
            v-else-if="application.status === 'awaiting_submission'"
            class="primary-btn-block"
            @click.stop="continueApplication(application)"
          >
            <v-icon left size="18">mdi-send</v-icon>
            Wyślij aplikację
          </button>
          <button
            v-else
            class="view-btn-block"
            @click.stop="continueApplication(application)"
          >
            <v-icon left size="18">mdi-eye</v-icon>
            Zobacz szczegóły
          </button>
        </div>
      </div>

      <!-- Add New Application Card -->
      <div class="add-card" @click="$router.push('/programmes')">
        <div class="add-card-content">
          <v-icon size="48" color="#C7C7CC" class="mb-3">mdi-plus-circle-outline</v-icon>
          <h3 class="add-card-title">Dodaj nowy kierunek</h3>
          <p class="add-card-text">
            Aplikuj na kolejny kierunek studiów
          </p>
        </div>
      </div>
      </div>
    </div>
  </v-container>

  <!-- Vertical Timeline Sidebar -->
  <div v-if="userApplications && userApplications.length > 0" class="timeline-sidebar">
    <div class="timeline-header">
      <v-icon size="20" color="#007AFF">mdi-calendar-clock</v-icon>
      <h3>Nadchodzące terminy</h3>
    </div>
    <div class="timeline-scroll">
      <div v-if="allDeadlines.length === 0" class="timeline-empty">
        <v-icon size="48" color="#C7C7CC">mdi-calendar-blank</v-icon>
        <p>Brak terminów</p>
      </div>
      <div v-else class="timeline-items">
        <div 
          v-for="(item, index) in allDeadlines" 
          :key="index"
          class="timeline-item"
          :class="{ 'urgent': item.isUrgent, 'past': item.isPast }"
        >
          <div class="timeline-date">
            <div class="date-day">{{ formatDay(item.date) }}</div>
            <div class="date-month">{{ formatMonth(item.date) }}</div>
          </div>
          <div class="timeline-content">
            <div class="timeline-title">{{ item.title }}</div>
            <div class="timeline-programme">{{ item.programmeName }}</div>
            <div class="timeline-type">
              <v-icon size="14" :color="item.iconColor">{{ item.icon }}</v-icon>
              {{ item.type }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex'
import { programmes } from '~/data/mockData'

export default {
  middleware: 'auth',
  data() {
    return {
      programmes,
      draggedIndex: null,
      dragOverIndex: null
    }
  },
  computed: {
    ...mapGetters(['currentUser', 'userApplications', 'userDiplomas', 'userPayments', 'unpaidApplications', 'totalUnpaidAmount']),
    userName() {
      const user = this.currentUser
      if (!user) return ''
      if (user.firstName && user.lastName) {
        return `${user.firstName} ${user.lastName}`
      }
      return user.email.split('@')[0]
    },
    diplomasCount() {
      return this.userDiplomas ? this.userDiplomas.length : 0
    },
    totalPaidAmount() {
      if (!this.userPayments) return 0
      return this.userPayments
        .filter(p => p.status === 'completed')
        .reduce((sum, p) => sum + p.amount, 0)
    },
    sortedApplications() {
      if (!this.userApplications) return []
      return [...this.userApplications].sort((a, b) => {
        const priorityA = a.priority || 999
        const priorityB = b.priority || 999
        return priorityA - priorityB
      })
    },
    upcomingDeadlines() {
      const deadlines = []
      const now = new Date()
      const threeDays = 3 * 24 * 60 * 60 * 1000

      this.sortedApplications.forEach(app => {
        const programme = this.programmes.find(p => p.id === app.programmeId)
        if (!programme) return

        // Payment deadline
        if (app.steps.diplomaLinked && !app.steps.paymentComplete) {
          const paymentDeadline = new Date(programme.recruitmentDates.end)
          const daysLeft = Math.ceil((paymentDeadline - now) / (24 * 60 * 60 * 1000))
          if (daysLeft <= 3 && daysLeft > 0) {
            deadlines.push({
              id: `payment-${app.id}`,
              type: 'error',
              title: 'Termin płatności!',
              message: `${programme.name} - zostało ${daysLeft} dni`,
              btnColor: 'primary',
              btnIcon: 'mdi-credit-card',
              btnText: 'Zapłać',
              action: () => {
                this.setActiveApplicationId(app.id)
                this.$router.push('/payments/checkout')
              }
            })
          }
        }

        // Document delivery deadline
        if (app.steps.submitted && !app.steps.documentDelivery) {
          const docDeadline = new Date(programme.recruitmentDates.end)
          docDeadline.setDate(docDeadline.getDate() + 14)
          const daysLeft = Math.ceil((docDeadline - now) / (24 * 60 * 60 * 1000))
          if (daysLeft <= 7 && daysLeft > 0) {
            deadlines.push({
              id: `docs-${app.id}`,
              type: 'warning',
              title: 'Dostarczenie dokumentów',
              message: `${programme.name} - zostało ${daysLeft} dni`,
              btnColor: 'orange',
              btnIcon: 'mdi-file-document',
              btnText: 'Szczegóły',
              action: () => this.$router.push(`/applications/${app.id}/view`)
            })
          }
        }

        // Exam deadline
        if (programme.additionalExams && programme.additionalExams.required && app.steps.documentDelivery && !app.steps.exams) {
          const examDeadline = new Date(programme.additionalExams.registrationDeadline)
          const daysLeft = Math.ceil((examDeadline - now) / (24 * 60 * 60 * 1000))
          if (daysLeft <= 5 && daysLeft > 0) {
            deadlines.push({
              id: `exam-${app.id}`,
              type: 'info',
              title: 'Egzamin!',
              message: `${programme.name} - zostało ${daysLeft} dni`,
              btnColor: 'info',
              btnIcon: 'mdi-school',
              btnText: 'Zobacz',
              action: () => this.$router.push(`/applications/${app.id}/view`)
            })
          }
        }
      })

      return deadlines
    },
    allDeadlines() {
      const deadlines = []
      const now = new Date()

      this.sortedApplications.forEach(app => {
        const programme = this.programmes.find(p => p.id === app.programmeId)
        if (!programme) return

        // Recruitment end
        const recruitmentEnd = new Date(programme.recruitmentDates.end)
        deadlines.push({
          date: recruitmentEnd,
          title: 'Koniec rekrutacji',
          programmeName: programme.name,
          type: 'Rekrutacja',
          icon: 'mdi-calendar-end',
          iconColor: '#FF3B30',
          isUrgent: (recruitmentEnd - now) < 7 * 24 * 60 * 60 * 1000,
          isPast: recruitmentEnd < now
        })

        // Payment deadline (if not paid)
        if (!app.steps.paymentComplete) {
          deadlines.push({
            date: new Date(programme.recruitmentDates.end),
            title: 'Termin płatności',
            programmeName: programme.name,
            type: 'Płatność',
            icon: 'mdi-credit-card',
            iconColor: '#FF9500',
            isUrgent: (new Date(programme.recruitmentDates.end) - now) < 3 * 24 * 60 * 60 * 1000,
            isPast: new Date(programme.recruitmentDates.end) < now
          })
        }

        // Document delivery deadline (if submitted but not delivered)
        if (app.steps.submitted && !app.steps.documentDelivery) {
          const docDeadline = new Date(programme.recruitmentDates.end)
          docDeadline.setDate(docDeadline.getDate() + 14)
          deadlines.push({
            date: docDeadline,
            title: 'Dostarczenie dokumentów',
            programmeName: programme.name,
            type: 'Dokumenty',
            icon: 'mdi-file-document',
            iconColor: '#34C759',
            isUrgent: (docDeadline - now) < 7 * 24 * 60 * 60 * 1000,
            isPast: docDeadline < now
          })
        }

        // Exam dates
        if (programme.additionalExams && programme.additionalExams.required) {
          const examDate = new Date(programme.additionalExams.registrationDeadline)
          deadlines.push({
            date: examDate,
            title: 'Egzaminy',
            programmeName: programme.name,
            type: 'Egzamin',
            icon: 'mdi-school',
            iconColor: '#007AFF',
            isUrgent: (examDate - now) < 5 * 24 * 60 * 60 * 1000,
            isPast: examDate < now
          })
        }
      })

      return deadlines.sort((a, b) => a.date - b.date)
    }
  },
  methods: {
    ...mapMutations(['setActiveApplicationId']),
    
    getProgrammeName(programmeId) {
      const programme = this.programmes.find(p => p.id === programmeId)
      return programme ? programme.name : 'Nieznany kierunek'
    },
    
    requiresExams(programmeId) {
      const programme = this.programmes.find(p => p.id === programmeId)
      return programme && programme.additionalExams && programme.additionalExams.required
    },

    getProgress(application) {
      if (!application || !application.steps) return 0
      
      // If all steps including document delivery are complete
      if (application.steps.documentDelivery) {
        return 100
      }
      
      // If submitted but documents not delivered yet
      if (application.steps.submitted) {
        return 80
      }
      
      // Count only the 3 main steps before submission
      const mainSteps = [
        application.steps.personalData,
        application.steps.diplomaLinked,
        application.steps.paymentComplete
      ]
      const completed = mainSteps.filter(s => s === true).length
      
      // If all 3 steps are done (awaiting submission), show 75%
      if (completed === 3) {
        return 75
      }
      
      // Otherwise calculate progress (each step is 25%)
      return completed * 25
    },

    getStatusColor(status) {
      const colors = {
        incomplete: 'warning',
        submitted: 'success',
        accepted: 'success',
        rejected: 'error'
      }
      return colors[status] || 'grey'
    },

    getStatusText(status) {
      const texts = {
        incomplete: 'W trakcie',
        awaiting_submission: 'Gotowa do wysłania',
        submitted: 'Wysłana',
        accepted: 'Zaakceptowana',
        rejected: 'Odrzucona'
      }
      return texts[status] || status
    },

    getStepLabel(stepKey) {
      const labels = {
        personalData: 'Dane osobowe',
        diplomaLinked: 'Dyplom',
        paymentComplete: 'Płatność',
        contactData: 'Dane kontaktowe',
        education: 'Wykształcenie',
        documents: 'Dokumenty',
        payment: 'Opłaty'
      }
      return labels[stepKey] || stepKey
    },

    setActiveApplication(applicationId) {
      this.setActiveApplicationId(applicationId)
      this.$router.push(`/applications/${applicationId}/view`)
    },

    continueApplication(application) {
      this.setActiveApplicationId(application.id)
      
      // Determine next incomplete step and navigate accordingly
      const steps = application.steps || {}
      
      if (!steps.personalData) {
        // First step: personal data
        this.$router.push('/applications/current/personal-data')
      } else if (!steps.diplomaLinked) {
        // Second step: link diploma
        this.$router.push('/applications/current/link-diploma')
      } else if (!steps.paymentComplete) {
        // Third step: payment
        this.$router.push('/payments/checkout')
      } else {
        // All steps complete, go to view
        this.$router.push(`/applications/${application.id}/view`)
      }
    },

    showApplicationMenu(application) {
      // TODO: Implement context menu (delete, archive, etc.)
      console.log('Show menu for application:', application.id)
    },

    handleDragStart(index, event) {
      // Only handle drag if it's the card itself, not child elements
      if (!event.target.classList.contains('application-card')) {
        event.preventDefault()
        return
      }
      
      this.draggedIndex = index
      event.dataTransfer.effectAllowed = 'move'
      
      // Create a fully visible ghost element that follows the cursor
      const dragImage = event.currentTarget.cloneNode(true)
      dragImage.style.cssText = `
        width: ${event.currentTarget.offsetWidth}px !important;
        height: ${event.currentTarget.offsetHeight}px !important;
        transform: rotate(5deg) scale(1.05) !important;
        opacity: 1 !important;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
        position: absolute !important;
        top: 0 !important;
        left: 0 !important;
        border-radius: 12px !important;
        background-color: #FFFFFF !important;
        pointer-events: none !important;
        z-index: 9999 !important;
      `
      
      // Force all child elements to be fully opaque
      const allElements = dragImage.querySelectorAll('*')
      allElements.forEach(el => {
        el.style.opacity = '1'
        el.style.filter = 'none'
      })
      
      document.body.appendChild(dragImage)
      
      // Set the drag image to follow cursor
      event.dataTransfer.setDragImage(dragImage, event.offsetX, event.offsetY)
      setTimeout(() => document.body.removeChild(dragImage), 0)
    },

    handleDragOver(index, event) {
      if (this.draggedIndex === null) return
      event.preventDefault()
      this.dragOverIndex = index
      
      // Add visual feedback to the target card
      const cards = document.querySelectorAll('.application-card')
      cards.forEach((card, idx) => {
        if (idx === index && idx !== this.draggedIndex) {
          card.classList.add('drag-over')
        } else {
          card.classList.remove('drag-over')
        }
      })
    },

    handleDrop(dropIndex) {
      if (this.draggedIndex === null || this.draggedIndex === dropIndex) return
      
      const applications = [...this.sortedApplications]
      const draggedApp = applications[this.draggedIndex]
      
      // Remove from old position
      applications.splice(this.draggedIndex, 1)
      // Insert at new position
      applications.splice(dropIndex, 0, draggedApp)
      
      // Update priorities (1-based)
      applications.forEach((app, index) => {
        this.$store.commit('UPDATE_APPLICATION_PRIORITY', { id: app.id, priority: index + 1 })
      })
      
      this.draggedIndex = null
      this.dragOverIndex = null
    },

    handleDragEnd(event) {
      // Reset states
      this.draggedIndex = null
      this.dragOverIndex = null
      
      // Clean up all drag-over classes
      const cards = document.querySelectorAll('.application-card')
      cards.forEach(c => c.classList.remove('drag-over'))
    },

    changePriority(applicationId, direction) {
      const currentIndex = this.sortedApplications.findIndex(app => app.id === applicationId)
      const newIndex = currentIndex + direction
      
      if (newIndex < 0 || newIndex >= this.sortedApplications.length) return
      
      const applications = [...this.sortedApplications]
      const app = applications[currentIndex]
      
      // Swap positions
      applications.splice(currentIndex, 1)
      applications.splice(newIndex, 0, app)
      
      // Update all priorities (1-based)
      applications.forEach((app, index) => {
        this.$store.commit('UPDATE_APPLICATION_PRIORITY', { id: app.id, priority: index + 1 })
      })
    },

    formatDay(date) {
      return new Date(date).getDate()
    },

    formatMonth(date) {
      const months = ['Sty', 'Lut', 'Mar', 'Kwi', 'Maj', 'Cze', 'Lip', 'Sie', 'Wrz', 'Paź', 'Lis', 'Gru']
      return months[new Date(date).getMonth()]
    }
  }
}
</script>

<style scoped>
/* ===== APPLE-STYLE DASHBOARD ===== */

.dashboard-wrapper {
  position: relative;
  min-height: 100vh;
  background: #F5F5F7;
}

.dashboard-container {
  background: #F5F5F7;
  min-height: 100vh;
  padding-right: 380px !important;
}

.dashboard-header {
  width: 100%;
}

.page-title {
  font-size: 32px;
  font-weight: 600;
  color: #1C1C1E;
  letter-spacing: -0.5px;
}

.page-subtitle {
  font-size: 17px;
  color: #6E6E73;
  font-weight: 400;
}

/* Stat Cards */
.stat-card {
  border-radius: 12px;
  border: 1px solid #e5e5ea;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  cursor: pointer;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
}

.stat-value {
  font-size: 28px;
  font-weight: 700;
  color: #1c1c1e;
}

.stat-label {
  font-size: 14px;
  color: #6e6e73;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Empty State */
.empty-state {
  max-width: 600px;
  margin: 0 auto;
}

.empty-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 60px 40px;
}

.empty-content {
  text-align: center;
}

.empty-title {
  font-size: 22px;
  font-weight: 600;
  color: #1C1C1E;
}

.empty-text {
  font-size: 15px;
  color: #6E6E73;
}

.primary-btn-large {
  background: #007AFF;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.primary-btn-large:hover {
  background: #0051D5;
}

/* Applications Grid */
.applications-grid {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.application-card {
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  cursor: grab;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  flex-direction: column;
  position: relative;
}

.application-card:hover {
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px) scale(1.02);
}

.application-card:active {
  cursor: grabbing;
}

.application-card.dragging {
  opacity: 0.4;
  cursor: grabbing;
  transition: opacity 0.2s ease;
}

.application-card.drag-over {
  transform: translateY(-4px) scale(1.03);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
  border: 2px solid #007AFF;
}

.card-header {
  padding: 24px 24px 16px;
}

.header-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.status-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  background: #E5E5EA;
  color: #1C1C1E;
}

.status-badge.status-submitted {
  background: rgba(52, 199, 89, 0.15);
  color: #34C759;
}

.status-badge.status-accepted {
  background: rgba(52, 199, 89, 0.15);
  color: #34C759;
}

.status-badge.status-rejected {
  background: rgba(255, 59, 48, 0.15);
  color: #FF3B30;
}

.delivery-badge {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
  background: rgba(52, 199, 89, 0.15);
  color: #34C759;
  display: flex;
  align-items: center;
  gap: 4px;
}

.priority-controls {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #F5F5F7;
  padding: 4px 8px;
  border-radius: 8px;
}

.priority-label {
  font-size: 13px;
  font-weight: 600;
  color: #1C1C1E;
  white-space: nowrap;
}

.priority-btn {
  background: #FFFFFF;
  border: 1px solid #E5E5EA;
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.priority-btn:hover:not(:disabled) {
  background: #007AFF;
  border-color: #007AFF;
  color: white;
}

.priority-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.icon-btn-sm {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
}

.icon-btn-sm:hover {
  background: #F5F5F7;
}

.application-title {
  font-size: 20px;
  font-weight: 600;
  color: #1C1C1E;
  line-height: 1.3;
}

.card-body {
  padding: 0 24px 20px;
  flex-grow: 1;
}

/* Progress Section */
.progress-section {
  margin-bottom: 20px;
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: 13px;
  color: #6E6E73;
  font-weight: 500;
}

.progress-value {
  font-size: 14px;
  color: #007AFF;
  font-weight: 600;
}

.progress-bar-wrapper {
  height: 6px;
  background: #E5E5EA;
  border-radius: 3px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #007AFF;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-bar-fill.complete {
  background: #34C759;
}

/* Steps List */
.steps-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 186px;
}

.step-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.step-icon {
  flex-shrink: 0;
}

.step-label {
  font-size: 14px;
  color: #6E6E73;
  font-weight: 400;
}

.step-label.completed {
  color: #1C1C1E;
  font-weight: 500;
}

/* Card Footer */
.card-divider {
  height: 1px;
  background: #E5E5EA;
  margin: 0 24px;
}

.card-footer {
  padding: 20px 24px;
}

.primary-btn-block,
.success-btn-block {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.primary-btn-block {
  background: #007AFF;
  color: white;
}

.primary-btn-block:hover {
  background: #0051D5;
}

.view-btn-block {
  width: 100%;
  padding: 12px;
  background: white;
  color: #007AFF;
  border: 2px solid #007AFF;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.view-btn-block:hover {
  background: rgba(0, 122, 255, 0.05);
  border-color: #0051D5;
  color: #0051D5;
}

.success-btn-block {
  background: #F5F5F7;
  color: #6E6E73;
  cursor: not-allowed;
}

/* Add Card */
.add-card {
  background: #FFFFFF;
  border: 2px dashed #D1D1D6;
  border-radius: 12px;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-card:hover {
  border-color: #007AFF;
  background: rgba(0, 122, 255, 0.03);
}

.add-card-content {
  text-align: center;
  padding: 40px;
}

.add-card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1E;
  margin-bottom: 8px;
}

.add-card-text {
  font-size: 14px;
  color: #6E6E73;
  margin: 0;
}

/* Compact Alerts */
.compact-alert {
  padding: 8px 16px !important;
  min-height: auto !important;
}

.compact-alert .v-alert__content {
  padding: 4px 0 !important;
}

.deadline-alerts {
  width: 100%;
}

/* Dashboard Content Layout */
.dashboard-content {
  width: 100%;
}

.applications-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
  width: 100%;
}

/* Timeline Sidebar */
.timeline-sidebar {
  position: fixed;
  right: 0;
  top: 64px;
  width: 360px;
  background: #FFFFFF;
  box-shadow: -2px 0 8px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 64px);
  overflow: hidden;
  z-index: 100;
}

.timeline-header {
  padding: 20px;
  border-bottom: 1px solid #E5E5EA;
  display: flex;
  align-items: center;
  gap: 10px;
}

.timeline-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1C1C1E;
  margin: 0;
}

.timeline-scroll {
  overflow-y: auto;
  flex: 1;
  padding: 16px;
}

.timeline-empty {
  text-align: center;
  padding: 40px 20px;
}

.timeline-empty p {
  font-size: 14px;
  color: #6E6E73;
  margin-top: 12px;
}

.timeline-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: #F5F5F7;
}

.timeline-item:hover {
  background: #E5E5EA;
}

.timeline-item.urgent {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
}

.timeline-item.past {
  opacity: 0.5;
}

.timeline-date {
  text-align: center;
  min-width: 50px;
}

.date-day {
  font-size: 24px;
  font-weight: 700;
  color: #1C1C1E;
  line-height: 1;
}

.date-month {
  font-size: 12px;
  font-weight: 600;
  color: #6E6E73;
  text-transform: uppercase;
  margin-top: 2px;
}

.timeline-content {
  flex: 1;
}

.timeline-title {
  font-size: 15px;
  font-weight: 600;
  color: #1C1C1E;
  margin-bottom: 4px;
}

.timeline-programme {
  font-size: 13px;
  color: #6E6E73;
  margin-bottom: 6px;
}

.timeline-type {
  font-size: 12px;
  color: #007AFF;
  display: flex;
  align-items: center;
  gap: 4px;
}

/* Mobile Responsive */
@media (max-width: 1200px) {
  .dashboard-container {
    padding-right: 20px !important;
  }

  .timeline-sidebar {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
    top: auto;
    width: 100%;
    height: 50vh;
    box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.06);
    transform: translateY(100%);
    transition: transform 0.3s ease;
  }

  .timeline-sidebar.visible {
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .dashboard-container {
    padding: 16px !important;
    padding-right: 16px !important;
  }

  .page-title {
    font-size: 28px;
  }

  .applications-grid {
    grid-template-columns: 1fr;
  }
}
</style>
