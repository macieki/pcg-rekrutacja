export const state = () => ({
  user: null,
  applications: [],
  diplomas: [],
  payments: [],
  activeApplicationId: null,
  pendingProgrammeId: null,
  snackbar: {
    show: false,
    message: '',
    color: 'success'
  }
})

export const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
  
  setActiveApplicationId(state, applicationId) {
    state.activeApplicationId = applicationId
  },
  
  LOGOUT(state) {
    state.user = null
    state.applications = []
    state.diplomas = []
    state.payments = []
    state.activeApplicationId = null
    state.pendingProgrammeId = null
  },
  
  SET_PENDING_PROGRAMME(state, programmeId) {
    state.pendingProgrammeId = programmeId
  },
  
  CLEAR_PENDING_PROGRAMME(state) {
    state.pendingProgrammeId = null
  },
  
  SET_ACTIVE_APPLICATION(state, applicationId) {
    state.activeApplicationId = applicationId
  },
  
  ADD_APPLICATION(state, application) {
    state.applications.push(application)
    state.activeApplicationId = application.id
  },
  
  UPDATE_APPLICATION(state, { id, data }) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, { ...state.applications[index], ...data })
    }
  },
  
  UPDATE_APPLICATION_PERSONAL_DATA(state, { id, personalData }) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        personalData: { ...state.applications[index].personalData, ...personalData }
      })
    }
  },
  
  UPDATE_APPLICATION_ADDRESS(state, { id, address }) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        address: { ...state.applications[index].address, ...address }
      })
    }
  },
  
  UPDATE_APPLICATION_EDUCATION(state, { id, education }) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        education: { ...state.applications[index].education, ...education }
      })
    }
  },
  
  SUBMIT_APPLICATION(state, id) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        status: 'submitted',
        submittedAt: new Date().toISOString(),
        steps: {
          ...state.applications[index].steps,
          submitted: true
        }
      })
    }
  },
  
  SET_DOCUMENT_DELIVERY(state, id) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        steps: {
          ...state.applications[index].steps,
          documentDelivery: true
        }
      })
    }
  },
  
  SET_EXAMS_COMPLETED(state, id) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        steps: {
          ...state.applications[index].steps,
          exams: true
        }
      })
    }
  },
  
  UPDATE_APPLICATION_PRIORITY(state, { id, priority }) {
    const index = state.applications.findIndex(app => app.id === id)
    if (index !== -1) {
      state.applications.splice(index, 1, {
        ...state.applications[index],
        priority
      })
    }
  },
  
  SHOW_SNACKBAR(state, { message, color = 'success' }) {
    state.snackbar = {
      show: true,
      message,
      color
    }
  },
  
  HIDE_SNACKBAR(state) {
    state.snackbar.show = false
  },

  // Diploma mutations
  ADD_DIPLOMA(state, diploma) {
    state.diplomas.push(diploma)
  },

  UPDATE_DIPLOMA(state, { id, data }) {
    const index = state.diplomas.findIndex(d => d.id === id)
    if (index !== -1) {
      state.diplomas.splice(index, 1, { ...state.diplomas[index], ...data })
    }
  },

  DELETE_DIPLOMA(state, id) {
    const index = state.diplomas.findIndex(d => d.id === id)
    if (index !== -1) {
      state.diplomas.splice(index, 1)
    }
  },

  // Payment mutations
  ADD_PAYMENT(state, payment) {
    state.payments.push(payment)
  },

  UPDATE_PAYMENT(state, { id, data }) {
    const index = state.payments.findIndex(p => p.id === id)
    if (index !== -1) {
      state.payments.splice(index, 1, { ...state.payments[index], ...data })
    }
  },

  // Bulk mutations for debug data loading
  SET_DIPLOMAS(state, diplomas) {
    state.diplomas = diplomas
  },

  SET_APPLICATIONS(state, applications) {
    state.applications = applications
  },

  SET_PAYMENTS(state, payments) {
    state.payments = payments
  },

  CLEAR_ALL_DATA(state) {
    state.diplomas = []
    state.applications = []
    state.payments = []
    state.activeApplicationId = null
  }
}

export const actions = {
  register({ commit }, userData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = {
          id: Date.now(),
          email: userData.email,
          firstName: '',
          lastName: '',
          photo: null,
          registeredAt: new Date().toISOString()
        }
        commit('SET_USER', user)
        commit('SHOW_SNACKBAR', { message: 'Konto utworzone pomyślnie!' })
        resolve(user)
      }, 800)
    })
  },
  
  login({ commit }, { email, password }) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Mock login - accept any email/password
        if (email && password) {
          const user = {
            id: Date.now(),
            email,
            firstName: 'Jan',
            lastName: 'Kowalski',
            photo: null,
            registeredAt: new Date().toISOString()
          }
          commit('SET_USER', user)
          commit('SHOW_SNACKBAR', { message: 'Zalogowano pomyślnie!' })
          resolve(user)
        } else {
          reject(new Error('Invalid credentials'))
        }
      }, 600)
    })
  },
  
  logout({ commit }) {
    commit('LOGOUT')
    commit('SHOW_SNACKBAR', { message: 'Wylogowano pomyślnie!' })
  },
  
  createApplication({ commit, state }, programmeId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // Calculate priority as the highest existing priority + 1
        const maxPriority = state.applications.reduce((max, app) => 
          Math.max(max, app.priority || 0), -1)
        
        const application = {
          id: Date.now(),
          programmeId,
          diplomaId: null,
          paymentId: null,
          userId: state.user.id,
          status: 'incomplete',
          priority: maxPriority + 1,
          createdAt: new Date().toISOString(),
          submittedAt: null,
          steps: {
            personalData: false,
            diplomaLinked: false,
            paymentComplete: false,
            submitted: false,
            documentDelivery: false,
            exams: false
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
        commit('ADD_APPLICATION', application)
        resolve(application)
      }, 400)
    })
  },
  
  savePersonalData({ commit }, { id, data }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('UPDATE_APPLICATION_PERSONAL_DATA', { id, personalData: data })
        const app = this.state.applications.find(app => app.id === id)
        if (app) {
          const updatedSteps = { ...app.steps, personalData: true }
          commit('UPDATE_APPLICATION', { id, data: { steps: updatedSteps } })
        }
        commit('SHOW_SNACKBAR', { message: 'Dane osobowe zapisane!' })
        resolve()
      }, 500)
    })
  },
  
  saveAddress({ commit }, { id, data }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('UPDATE_APPLICATION_ADDRESS', { id, address: data })
        commit('SHOW_SNACKBAR', { message: 'Adres zapisany!' })
        resolve()
      }, 500)
    })
  },
  
  saveEducation({ commit }, { id, data }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('UPDATE_APPLICATION_EDUCATION', { id, education: data })
        const app = this.state.applications.find(app => app.id === id)
        if (app) {
          const updatedSteps = { ...app.steps, education: true, grades: true }
          commit('UPDATE_APPLICATION', { id, data: { steps: updatedSteps } })
        }
        commit('SHOW_SNACKBAR', { message: 'Dane edukacyjne zapisane!' })
        resolve()
      }, 500)
    })
  },
  
  submitApplication({ commit }, id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('SUBMIT_APPLICATION', id)
        resolve()
      }, 800)
    })
  },
  
  setDocumentDelivery({ commit }, id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('SET_DOCUMENT_DELIVERY', id)
        commit('SHOW_SNACKBAR', { message: 'Status dostarczenia dokumentów zaktualizowany!', color: 'success' })
        resolve()
      }, 500)
    })
  },
  
  setExamsCompleted({ commit }, id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('SET_EXAMS_COMPLETED', id)
        commit('SHOW_SNACKBAR', { message: 'Status egzaminów zaktualizowany!', color: 'success' })
        resolve()
      }, 500)
    })
  },

  // Diploma actions
  createDiploma({ commit, state }, diplomaData) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const diploma = {
          id: Date.now(),
          userId: state.user.id,
          type: diplomaData.examType,
          secondarySchool: diplomaData.secondarySchool,
          graduationYear: diplomaData.secondarySchool.graduationYear,
          documentNumber: diplomaData.secondarySchool.documentNumber,
          subjects: diplomaData.subjects,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        commit('ADD_DIPLOMA', diploma)
        commit('SHOW_SNACKBAR', { message: 'Dyplom dodany pomyślnie!' })
        resolve(diploma)
      }, 500)
    })
  },

  updateDiploma({ commit }, { id, data }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('UPDATE_DIPLOMA', { id, data: { ...data, updatedAt: new Date().toISOString() } })
        commit('SHOW_SNACKBAR', { message: 'Dyplom zaktualizowany!' })
        resolve()
      }, 500)
    })
  },

  deleteDiploma({ commit }, id) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('DELETE_DIPLOMA', id)
        commit('SHOW_SNACKBAR', { message: 'Dyplom usunięty!' })
        resolve()
      }, 300)
    })
  },

  linkDiplomaToApplication({ commit }, { applicationId, diplomaId }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        commit('UPDATE_APPLICATION', { 
          id: applicationId, 
          data: { diplomaId, steps: { personalData: true, diplomaLinked: true, paymentComplete: false } } 
        })
        commit('SHOW_SNACKBAR', { message: 'Dyplom połączony z aplikacją!' })
        resolve()
      }, 400)
    })
  },

  // Payment actions
  createPayment({ commit, state }, { applicationIds, amount }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const payment = {
          id: Date.now(),
          userId: state.user.id,
          applicationIds,
          amount,
          status: 'pending',
          method: null,
          createdAt: new Date().toISOString(),
          paidAt: null
        }
        commit('ADD_PAYMENT', payment)
        resolve(payment)
      }, 300)
    })
  },

  completePayment({ commit }, { id, method }) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const paymentData = {
          status: 'completed',
          method,
          paidAt: new Date().toISOString()
        }
        commit('UPDATE_PAYMENT', { id, data: paymentData })
        
        // Update applications to mark payment complete
        const payment = this.state.payments.find(p => p.id === id)
        if (payment) {
          payment.applicationIds.forEach(appId => {
            const app = this.state.applications.find(a => a.id === appId)
            if (app) {
              const updatedSteps = { ...app.steps, paymentComplete: true }
              commit('UPDATE_APPLICATION', { 
                id: appId, 
                data: { 
                  paymentId: id,
                  status: 'awaiting_submission',
                  steps: updatedSteps 
                } 
              })
            }
          })
        }
        
        commit('SHOW_SNACKBAR', { message: 'Płatność zrealizowana pomyślnie!', color: 'success' })
        resolve()
      }, 1000)
    })
  }
}

export const getters = {
  isAuthenticated: state => !!state.user,
  
  currentUser: state => state.user,
  
  userApplications: state => state.applications,
  
  activeApplication: state => {
    if (!state.activeApplicationId) return null
    return state.applications.find(app => app.id === state.activeApplicationId)
  },
  
  getApplicationById: state => id => {
    return state.applications.find(app => app.id === id)
  },
  
  getCurrentApplication: state => {
    // Return the active application or most recent incomplete
    if (state.activeApplicationId) {
      return state.applications.find(app => app.id === state.activeApplicationId)
    }
    const incomplete = state.applications.filter(app => app.status === 'incomplete' || app.status === 'draft')
    return incomplete.length > 0 ? incomplete[incomplete.length - 1] : null
  },
  
  applicationProgress: (state, getters) => {
    const app = getters.activeApplication
    if (!app || !app.steps) return 0
    
    // If documents delivered, 100% complete
    if (app.steps.documentDelivery) {
      return 100
    }
    
    // If submitted but documents not delivered, 80%
    if (app.steps.submitted) {
      return 80
    }
    
    // Otherwise, calculate based on the 3 main steps
    const mainSteps = [
      app.steps.personalData,
      app.steps.diplomaLinked,
      app.steps.paymentComplete
    ]
    const completed = mainSteps.filter(step => step === true).length
    return Math.round((completed / 3) * 100)
  },
  
  unreadMessagesCount: () => 2, // Mock count

  // Diploma getters
  userDiplomas: state => state.diplomas,

  getDiplomaById: state => id => {
    return state.diplomas.find(d => d.id === id)
  },

  verifiedDiplomas: state => {
    return state.diplomas.filter(d => d.status === 'verified' || d.status === 'submitted')
  },

  // Payment getters
  userPayments: state => state.payments,

  getPaymentById: state => id => {
    return state.payments.find(p => p.id === id)
  },

  unpaidApplications: state => {
    return state.applications.filter(app => 
      app.status === 'incomplete' && 
      app.steps.personalData && 
      app.steps.diplomaLinked && 
      !app.steps.paymentComplete
    )
  },

  totalUnpaidAmount: (state, getters) => {
    return getters.unpaidApplications.length * 85 // 85 PLN per application
  }
}
