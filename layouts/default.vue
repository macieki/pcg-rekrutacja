<template>
  <v-app>
    <v-app-bar app flat color="white" height="64" class="apple-app-bar">
      <v-toolbar-title class="d-flex align-center ml-2">
        <nuxt-link to="/" class="logo-link">
          <img src="~/assets/pcg_logo.svg" alt="Logo" class="navbar-logo" />
        </nuxt-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <template v-if="isAuthenticated">
        <!-- Horizontal Navigation Menu -->
        <v-btn
          v-for="item in menuItems"
          :key="item.title"
          :to="item.to"
          text
          class="text-none mx-1 nav-item"
          rounded
        >
          <v-icon left small>{{ item.icon }}</v-icon>
          <span class="font-weight-medium">{{ item.title }}</span>
          <v-badge
            v-if="item.badge"
            :content="item.badge"
            color="error"
            offset-x="-4"
            offset-y="4"
            dot
          />
        </v-btn>

        <v-divider vertical class="mx-3" style="height: 32px;"></v-divider>

        <v-btn icon @click="$router.push('/messages')" class="mr-2">
          <v-badge
            v-if="unreadCount > 0"
            :content="unreadCount"
            color="error"
            overlap
            dot
          >
            <v-icon color="grey darken-1">mdi-email-outline</v-icon>
          </v-badge>
          <v-icon v-else color="grey darken-1">mdi-email-outline</v-icon>
        </v-btn>

        <v-menu offset-y>
          <template v-slot:activator="{ on, attrs }">
            <v-btn text v-bind="attrs" v-on="on" class="text-none" rounded>
              <v-avatar size="32" color="primary" class="mr-2">
                <v-img v-if="user && user.photo" :src="user.photo"></v-img>
                <span v-else class="white--text text-caption font-weight-bold">{{ userInitials }}</span>
              </v-avatar>
              <span class="font-weight-medium hidden-sm-and-down" style="color: #1d1d1f;">{{ userName }}</span>
              <v-icon right small color="grey">mdi-chevron-down</v-icon>
            </v-btn>
          </template>
          <v-list>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ user.email }}</v-list-item-title>
                <v-list-item-subtitle>{{ userName }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="$router.push('/dashboard')">
              <v-list-item-icon>
                <v-icon>mdi-view-dashboard</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Panel główny</v-list-item-title>
            </v-list-item>
            <v-divider v-if="showDebugFooter"></v-divider>
            <v-list-item v-if="showDebugFooter" @click="showDebugDialog = true">
              <v-list-item-icon>
                <v-icon color="warning">mdi-bug</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Debug Menu</v-list-item-title>
            </v-list-item>
            <v-divider></v-divider>
            <v-list-item @click="handleLogout">
              <v-list-item-icon>
                <v-icon>mdi-logout</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Wyloguj</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>
      </template>

      <template v-else>
        <v-btn text @click="$router.push('/auth/login')" class="text-none mr-2" rounded>
          <span class="font-weight-medium">Zaloguj się</span>
        </v-btn>
        <v-btn color="primary" @click="$router.push('/auth/register')" class="text-none" rounded elevation="0">
          <span class="font-weight-medium">Załóż konto</span>
        </v-btn>
      </template>
    </v-app-bar>

    <v-main style="background: #F2F2F7; padding-bottom: 88px;">
      <nuxt />
    </v-main>

    <!-- Debug Dialog -->
    <v-dialog 
      v-model="showDebugDialog" 
      max-width="600" 
      v-if="showDebugFooter"
      :z-index="9999"
    >
      <v-card>
        <v-card-title class="headline">
          <v-icon left color="warning">mdi-bug</v-icon>
          Debug Menu
        </v-card-title>
        <v-card-text>
          <h3 class="mb-3">Zarządzanie statusem dostarczenia dokumentów</h3>
          <p class="text-caption mb-4">
            Ten krok jest poza kontrolą UI i może być ustawiony tylko ręcznie przez administratora.
          </p>
          
          <v-alert v-if="submittedApplications.length === 0" type="info" text dense class="mb-4">
            Brak przesłanych aplikacji. Użyj opcji "Dashboard (Submitted)" z debug footer, aby załadować przykładowe dane.
          </v-alert>
          
          <v-select
            v-model="selectedApplicationId"
            :items="submittedApplications"
            item-text="label"
            item-value="id"
            label="Wybierz aplikację"
            outlined
            dense
            :disabled="submittedApplications.length === 0"
            :menu-props="{ offsetY: true, maxHeight: 300 }"
          ></v-select>

          <v-btn
            color="success"
            block
            :disabled="!selectedApplicationId"
            @click="markDocumentsDelivered"
            class="mb-2"
          >
            <v-icon left>mdi-check-circle</v-icon>
            Oznacz dokumenty jako dostarczone
          </v-btn>
          
          <v-btn
            color="primary"
            block
            :disabled="!selectedApplicationId"
            @click="markExamsCompleted"
          >
            <v-icon left>mdi-school</v-icon>
            Oznacz egzaminy jako zdane
          </v-btn>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn text @click="showDebugDialog = false">Zamknij</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Debug Footer -->
    <div 
      v-if="showDebugFooter" 
      class="debug-footer"
      ref="debugFooter"
      @wheel.prevent="handleDebugFooterScroll"
    >
      <span class="debug-label">Debug nav:</span>
      <button
        v-for="link in debugLinks"
        :key="link.path || link.action || link.label"
        class="debug-link"
        :disabled="link.disabled"
        @click="!link.disabled && navigateDebug(link)"
      >
        {{ link.label }}
      </button>
    </div>

    <!-- Global Snackbar -->
    <v-snackbar
      :value="snackbar.show"
      :color="snackbar.color"
      :timeout="3000"
      bottom
      right
      @input="$store.commit('HIDE_SNACKBAR')"
    >
      {{ snackbar.message }}
      <template v-slot:action="{ attrs }">
        <v-btn
          text
          v-bind="attrs"
          @click="$store.commit('HIDE_SNACKBAR')"
        >
          Zamknij
        </v-btn>
      </template>
    </v-snackbar>

    <!-- Accessibility Button -->
    <v-btn
      v-if="isAuthenticated"
      fab
      fixed
      bottom
      right
      color="accent"
      class="mb-12"
      small
    >
      <v-icon>mdi-wheelchair-accessibility</v-icon>
    </v-btn>
  </v-app>
</template>

<script>
import { mapGetters, mapState } from 'vuex'

export default {
  data() {
    return {
      showDebugDialog: false,
      selectedApplicationId: null,
      menuItems: [
        { title: 'Panel główny', icon: 'mdi-view-dashboard', to: '/dashboard' },
        { title: 'Kierunki', icon: 'mdi-school', to: '/programmes' },
        { title: 'Aplikacje', icon: 'mdi-file-document-multiple', to: '/applications' },
        { title: 'Dyplomy', icon: 'mdi-certificate', to: '/diplomas' },
        { title: 'Płatności', icon: 'mdi-credit-card', to: '/payments' },
        { title: 'FAQ', icon: 'mdi-help-circle', to: '/faq' }
      ],
      debugLinks: [
        { label: 'Home', path: '/' },
        { label: 'Login', path: '/auth/login' },
        { label: 'Register', path: '/auth/register' },
        { label: '--- DASHBOARD ---', disabled: true },
        { label: 'Dashboard (Empty)', path: '/dashboard?debug=empty' },
        { label: 'Dashboard (Incomplete Apps)', path: '/dashboard?debug=incomplete' },
        { label: 'Dashboard (Ready to Submit)', path: '/dashboard?debug=readytosubmit' },
        { label: 'Dashboard (Submitted)', path: '/dashboard?debug=submitted' },
        { label: 'Dashboard (Docs Delivered)', path: '/dashboard?debug=docsdelivered' },
        { label: 'Dashboard (Mixed States)', path: '/dashboard?debug=mixed' },
        { label: 'Dashboard (Unpaid)', path: '/dashboard?debug=unpaid' },
        { label: '🛠️ DEBUG MENU (Docs)', action: 'openDebugDialog' },
        { label: '--- PROGRAMMES ---', disabled: true },
        { label: 'Programmes List', path: '/programmes' },
        { label: 'Programme Detail', path: '/programmes/1' },
        { label: '--- DIPLOMAS ---', disabled: true },
        { label: 'Diplomas (Empty)', path: '/diplomas?debug=empty' },
        { label: 'Diplomas (With Data)', path: '/diplomas?debug=withdata' },
        { label: 'Diploma Add', path: '/diplomas/add' },
        { label: 'Diploma View', path: '/diplomas/1001?debug=view' },
        { label: '--- APPLICATIONS ---', disabled: true },
        { label: 'Apps List (Empty)', path: '/applications?debug=empty' },
        { label: 'Apps List (Mixed)', path: '/applications?debug=mixed' },
        { label: 'App: Personal Data', path: '/applications/current/personal-data?debug=new' },
        { label: 'App: Link Diploma (Empty)', path: '/applications/current/link-diploma?debug=empty' },
        { label: 'App: Link Diploma (Has)', path: '/applications/current/link-diploma?debug=hasdata' },
        { label: 'App: Summary', path: '/applications/current/summary?debug=complete' },
        { label: 'App: View Incomplete', path: '/applications/2001/view?debug=incomplete' },
        { label: 'App: View Complete', path: '/applications/2002/view?debug=complete' },
        { label: 'App: View Submitted', path: '/applications/2003/view?debug=submitted' },
        { label: '--- PAYMENTS ---', disabled: true },
        { label: 'Payments (Empty)', path: '/payments?debug=empty' },
        { label: 'Payments (History)', path: '/payments?debug=history' },
        { label: 'Payment: Checkout (Single)', path: '/payments/checkout?debug=single' },
        { label: 'Payment: Checkout (Multi)', path: '/payments/checkout?debug=multi' },
        { label: 'Payment: Success', path: '/payments/success?debug=success' },
        { label: '--- OTHER ---', disabled: true },
        { label: 'FAQ', path: '/faq' },
        { label: 'Messages', path: '/messages' }
      ]
    }
  },
  computed: {
    ...mapGetters(['isAuthenticated', 'currentUser', 'unreadMessagesCount']),
    ...mapState(['snackbar']),
    user() {
      return this.currentUser
    },
    userName() {
      if (!this.user) return ''
      if (this.user.firstName && this.user.lastName) {
        return `${this.user.firstName} ${this.user.lastName}`
      }
      return this.user.email.split('@')[0]
    },
    userInitials() {
      if (!this.user) return '?'
      if (this.user.firstName && this.user.lastName) {
        return `${this.user.firstName[0]}${this.user.lastName[0]}`.toUpperCase()
      }
      return this.user.email[0].toUpperCase()
    },
    unreadCount() {
      return this.unreadMessagesCount
    },
    showDebugFooter() {
      return process.env.NODE_ENV !== 'production'
    },
    submittedApplications() {
      const applications = this.$store.state.applications || []
      const filtered = applications.filter(app => {
        return app.status === 'submitted' && 
               app.steps && 
               app.steps.submitted === true && 
               app.steps.documentDelivery !== true
      })
      
      return filtered.map(app => {
        const programme = app.programmeId === 1 ? 'Informatyka' : 
                         app.programmeId === 2 ? 'Informatyka stosowana' : 
                         app.programmeId === 3 ? 'Nauka o danych' : 
                         app.programmeId === 4 ? 'Matematyka stosowana' :
                         app.programmeId === 5 ? 'Informatyka (Niestacjonarne)' :
                         app.programmeId === 6 ? 'Sztuczna inteligencja' :
                         `Programme #${app.programmeId}`
        
        const submittedDate = app.submittedAt ? new Date(app.submittedAt).toLocaleDateString('pl-PL') : 'N/A'
        
        return {
          id: app.id,
          label: `#${app.id} - ${programme} (${submittedDate})`
        }
      })
    }
  },
  methods: {
    handleLogout() {
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
    async markDocumentsDelivered() {
      if (!this.selectedApplicationId) return
      
      try {
        await this.$store.dispatch('setDocumentDelivery', this.selectedApplicationId)
        this.showDebugDialog = false
        this.selectedApplicationId = null
      } catch (error) {
        console.error('Failed to mark documents as delivered:', error)
      }
    },
    async markExamsCompleted() {
      if (!this.selectedApplicationId) return
      
      try {
        await this.$store.dispatch('setExamsCompleted', this.selectedApplicationId)
        this.showDebugDialog = false
        this.selectedApplicationId = null
      } catch (error) {
        console.error('Failed to mark exams as completed:', error)
      }
    },
    handleDebugFooterScroll(event) {
      const footer = this.$refs.debugFooter
      if (footer) {
        footer.scrollLeft += event.deltaY * 2
      }
    },
    navigateDebug(link) {
      // Handle action-based links
      if (typeof link === 'object' && link.action) {
        if (link.action === 'openDebugDialog') {
          this.showDebugDialog = true
        }
        return
      }
      
      const path = typeof link === 'string' ? link : link.path
      // Load dummy data based on debug mode
      const debugMode = new URL(window.location.origin + path).searchParams.get('debug')
      
      if (debugMode) {
        this.loadDebugData(debugMode)
      }
      
      this.$router.push(path)
    },
    loadDebugData(mode) {
      const userId = this.$store.state.user?.id || 1
      
      switch(mode) {
        case 'empty':
          // Clear all data
          this.$store.commit('SET_USER', { id: userId, email: 'test@example.com', firstName: 'Jan', lastName: 'Kowalski' })
          this.$store.commit('CLEAR_ALL_DATA')
          break
          
        case 'incomplete':
          this.loadDiplomas()
          this.loadIncompleteApplications()
          break
          
        case 'readytosubmit':
          this.loadDiplomas()
          this.loadReadyToSubmitApplications()
          break
          
        case 'submitted':
          this.loadDiplomas()
          this.loadSubmittedApplications()
          break
          
        case 'docsdelivered':
          this.loadDiplomas()
          this.loadDocsDeliveredApplications()
          break
          
        case 'mixed':
          this.loadDiplomas()
          this.loadMixedStateApplications()
          break
          
        case 'withapps':
          this.loadDiplomas()
          this.loadApplications()
          break
          
        case 'withdata':
        case 'hasdata':
          this.loadDiplomas()
          this.loadApplications()
          break
          
        case 'unpaid':
          this.loadDiplomas()
          this.loadUnpaidApplications()
          break
          
        case 'history':
          this.loadDiplomas()
          this.loadApplications()
          this.loadPayments()
          break
          
        case 'complete':
          this.loadDiplomas()
          this.loadCompleteApplication()
          break
          
        case 'single':
          this.loadDiplomas()
          this.loadSingleUnpaidApp()
          break
          
        case 'multi':
          this.loadDiplomas()
          this.loadMultipleUnpaidApps()
          break
          
        case 'view':
          this.loadDiplomas()
          break
      }
    },
    loadDiplomas() {
      const userId = this.$store.state.user?.id || 1
      const diplomas = [
        {
          id: 1001,
          userId,
          type: 'Matura polska nowa',
          secondarySchool: {
            name: 'I Liceum Ogólnokształcące im. Juliusza Słowackiego',
            voivodeship: 'Mazowieckie',
            city: 'Warszawa',
            graduationYear: 2023,
            documentNumber: 'MAT/2023/001234'
          },
          graduationYear: 2023,
          documentNumber: 'MAT/2023/001234',
          subjects: [
            { name: 'Matematyka', examType: 'Rozszerzony', score: 85 },
            { name: 'Fizyka', examType: 'Rozszerzony', score: 78 },
            { name: 'Język angielski', examType: 'Rozszerzony', score: 92 },
            { name: 'Język polski', examType: 'Podstawowy', score: 88 }
          ],
          status: 'verified',
          createdAt: '2024-01-15T10:00:00Z',
          updatedAt: '2024-01-20T14:30:00Z'
        },
        {
          id: 1002,
          userId,
          type: 'Dyplom zagraniczny',
          secondarySchool: {
            name: 'International School of Warsaw',
            voivodeship: 'Mazowieckie',
            city: 'Warszawa',
            graduationYear: 2022,
            documentNumber: 'IB/2022/5678'
          },
          graduationYear: 2022,
          documentNumber: 'IB/2022/5678',
          subjects: [
            { name: 'Mathematics HL', examType: 'Rozszerzony', score: 90 },
            { name: 'Physics HL', examType: 'Rozszerzony', score: 85 },
            { name: 'English A', examType: 'Podstawowy', score: 95 }
          ],
          status: 'submitted',
          createdAt: '2024-02-10T09:00:00Z',
          updatedAt: '2024-02-10T09:00:00Z'
        }
      ]
      this.$store.commit('SET_DIPLOMAS', diplomas)
    },
    loadApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: null,
          userId,
          priority: 1,
          status: 'incomplete',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2002,
          programmeId: 2,
          diplomaId: 1001,
          paymentId: 3001,
          userId,
          priority: 2,
          status: 'awaiting_submission',
          createdAt: '2024-12-02T11:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2003,
          programmeId: 3,
          diplomaId: 1002,
          paymentId: 3002,
          userId,
          priority: 3,
          status: 'submitted',
          createdAt: '2024-11-15T09:00:00Z',
          submittedAt: '2024-12-05T15:30:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
    },
    loadUnpaidApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: null,
          userId,
          priority: 1,
          status: 'incomplete',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2004,
          programmeId: 4,
          diplomaId: 1001,
          paymentId: null,
          userId,
          status: 'incomplete',
          createdAt: '2024-12-03T12:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
    },
    loadPayments() {
      const userId = this.$store.state.user?.id || 1
      const payments = [
        {
          id: 3001,
          userId,
          applicationIds: [2002],
          amount: 85,
          status: 'completed',
          method: 'card',
          createdAt: '2024-12-02T14:00:00Z',
          paidAt: '2024-12-02T14:05:00Z'
        },
        {
          id: 3002,
          userId,
          applicationIds: [2003],
          amount: 85,
          status: 'completed',
          method: 'blik',
          createdAt: '2024-12-05T13:00:00Z',
          paidAt: '2024-12-05T13:02:00Z'
        }
      ]
      this.$store.commit('SET_PAYMENTS', payments)
    },
    loadCompleteApplication() {
      this.loadApplications()
      this.loadPayments()
    },
    loadIncompleteApplication() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: null,
          paymentId: null,
          userId,
          status: 'incomplete',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: false,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
      this.$store.commit('SET_ACTIVE_APPLICATION', 2001)
    },
    loadSingleUnpaidApp() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: null,
          userId,
          status: 'incomplete',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
    },
    loadMultipleUnpaidApps() {
      this.loadUnpaidApplications()
    },
    loadIncompleteApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: null,
          userId,
          priority: 1,
          status: 'incomplete',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2002,
          programmeId: 3,
          diplomaId: null,
          paymentId: null,
          userId,
          priority: 2,
          status: 'incomplete',
          createdAt: '2024-12-02T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: false,
            diplomaLinked: false,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '',
            firstName: '',
            lastName: '',
            dateOfBirth: '',
            gender: '',
            photo: null
          },
          address: {
            residence: {
              postalCode: '',
              voivodeship: '',
              county: '',
              commune: '',
              city: '',
              street: '',
              houseNumber: '',
              flatNumber: ''
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
    },
    loadReadyToSubmitApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: 3001,
          userId,
          priority: 1,
          status: 'awaiting_submission',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2002,
          programmeId: 2,
          diplomaId: 1001,
          paymentId: 3002,
          userId,
          priority: 2,
          status: 'awaiting_submission',
          createdAt: '2024-12-02T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
      this.$store.commit('SET_PAYMENTS', [
        {
          id: 3001,
          userId,
          applicationId: 2001,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-12-01T12:00:00Z',
          paidAt: '2024-12-01T12:05:00Z'
        },
        {
          id: 3002,
          userId,
          applicationId: 2002,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-12-02T12:00:00Z',
          paidAt: '2024-12-02T12:05:00Z'
        }
      ])
    },
    loadSubmittedApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: 3001,
          userId,
          priority: 1,
          status: 'submitted',
          createdAt: '2024-11-15T10:00:00Z',
          submittedAt: '2024-12-01T15:30:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2002,
          programmeId: 3,
          diplomaId: 1002,
          paymentId: 3002,
          userId,
          priority: 2,
          status: 'submitted',
          createdAt: '2024-11-20T10:00:00Z',
          submittedAt: '2024-12-05T10:00:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
      this.$store.commit('SET_PAYMENTS', [
        {
          id: 3001,
          userId,
          applicationId: 2001,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-12-01T12:00:00Z',
          paidAt: '2024-12-01T12:05:00Z'
        },
        {
          id: 3002,
          userId,
          applicationId: 2002,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-12-05T09:00:00Z',
          paidAt: '2024-12-05T09:05:00Z'
        }
      ])
    },
    loadDocsDeliveredApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: 3001,
          userId,
          priority: 1,
          status: 'submitted',
          createdAt: '2024-11-01T10:00:00Z',
          submittedAt: '2024-11-20T15:30:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: true
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2002,
          programmeId: 2,
          diplomaId: 1001,
          paymentId: 3002,
          userId,
          priority: 2,
          status: 'submitted',
          createdAt: '2024-11-05T10:00:00Z',
          submittedAt: '2024-11-25T10:00:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: true
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
      this.$store.commit('SET_PAYMENTS', [
        {
          id: 3001,
          userId,
          applicationId: 2001,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-11-20T12:00:00Z',
          paidAt: '2024-11-20T12:05:00Z'
        },
        {
          id: 3002,
          userId,
          applicationId: 2002,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-11-25T09:00:00Z',
          paidAt: '2024-11-25T09:05:00Z'
        }
      ])
    },
    loadMixedStateApplications() {
      const userId = this.$store.state.user?.id || 1
      const applications = [
        {
          id: 2001,
          programmeId: 1,
          diplomaId: 1001,
          paymentId: null,
          userId,
          priority: 1,
          status: 'incomplete',
          createdAt: '2024-12-01T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2002,
          programmeId: 2,
          diplomaId: 1001,
          paymentId: 3001,
          userId,
          priority: 2,
          status: 'awaiting_submission',
          createdAt: '2024-11-25T10:00:00Z',
          submittedAt: null,
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: false,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2003,
          programmeId: 3,
          diplomaId: 1002,
          paymentId: 3002,
          userId,
          priority: 3,
          status: 'submitted',
          createdAt: '2024-11-10T10:00:00Z',
          submittedAt: '2024-11-30T10:00:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: false
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        },
        {
          id: 2004,
          programmeId: 4,
          diplomaId: 1001,
          paymentId: 3003,
          userId,
          priority: 4,
          status: 'submitted',
          createdAt: '2024-10-20T10:00:00Z',
          submittedAt: '2024-11-15T10:00:00Z',
          steps: {
            personalData: true,
            diplomaLinked: true,
            paymentComplete: true,
            submitted: true,
            documentDelivery: true
          },
          personalData: {
            pesel: '00012345678',
            firstName: 'Jan',
            lastName: 'Kowalski',
            dateOfBirth: '2000-05-15',
            gender: 'Mężczyzna',
            photo: null
          },
          address: {
            residence: {
              postalCode: '00-001',
              voivodeship: 'Mazowieckie',
              county: 'Warszawa',
              commune: 'Śródmieście',
              city: 'Warszawa',
              street: 'Marszałkowska',
              houseNumber: '10',
              flatNumber: '5'
            },
            correspondence: null,
            sameAsResidence: true
          }
        }
      ]
      this.$store.commit('SET_APPLICATIONS', applications)
      this.$store.commit('SET_PAYMENTS', [
        {
          id: 3001,
          userId,
          applicationId: 2002,
          amount: 85,
          method: 'card',
          status: 'completed',
          createdAt: '2024-11-25T12:00:00Z',
          paidAt: '2024-11-25T12:05:00Z'
        },
        {
          id: 3002,
          userId,
          applicationId: 2003,
          amount: 85,
          method: 'blik',
          status: 'completed',
          createdAt: '2024-11-30T09:00:00Z',
          paidAt: '2024-11-30T09:05:00Z'
        },
        {
          id: 3003,
          userId,
          applicationId: 2004,
          amount: 85,
          method: 'transfer',
          status: 'completed',
          createdAt: '2024-11-15T09:00:00Z',
          paidAt: '2024-11-15T09:10:00Z'
        }
      ])
    }
  }
}
</script>

<style scoped>
.apple-app-bar {
  backdrop-filter: saturate(180%) blur(20px);
  background: rgba(255, 255, 255, 0.85) !important;
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.navbar-logo {
  height: 32px;
  width: auto;
  display: block;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  cursor: pointer;
  border-radius: 8px;
  padding: 4px 8px;
  margin: -4px -8px;
  transition: background 0.15s ease;
}

.logo-link:hover {
  background: rgba(0, 0, 0, 0.04);
}

.nav-item {
  font-size: 15px;
  letter-spacing: -0.01em;
  transition: all 0.2s ease;
  height: 40px !important;
  padding: 0 16px !important;
}

.nav-item:hover {
  background: rgba(0, 122, 255, 0.08) !important;
}

.nav-item.v-btn--active {
  background: rgba(0, 122, 255, 0.12) !important;
  color: #007AFF !important;
}

.nav-item.v-btn--active::before {
  opacity: 0 !important;
}

.debug-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background: rgba(28, 28, 30, 0.92);
  color: #fff;
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 10px 20px;
  z-index: 2000;
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
}

.debug-footer::-webkit-scrollbar {
  height: 8px;
}

.debug-footer::-webkit-scrollbar-track {
  background: transparent;
}

.debug-footer::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.debug-footer::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.5);
}

.debug-label {
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  opacity: 0.7;
}

.debug-link {
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 999px;
  background: transparent;
  color: #fff;
  padding: 6px 14px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.debug-link:disabled {
  opacity: 0.5;
  cursor: default;
  border: none;
  padding-left: 0;
}

.debug-link:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.15);
}
</style>
