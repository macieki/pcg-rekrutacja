<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-btn text @click="$router.push('/applications/current/personal-data')" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Wróć do danych osobowych
        </v-btn>

        <h1 class="display-1 font-weight-bold mb-2">Wykształcenie i wyniki egzaminów</h1>
        <p class="text-subtitle-1 grey--text mb-4">
          Podaj informacje o swojej szkole średniej oraz osiągniętych wynikach egzaminacyjnych
        </p>

        <!-- Progress Bar -->
        <v-progress-linear
          :value="completionPercentage"
          height="10"
          rounded
          color="primary"
          class="mb-6"
        ></v-progress-linear>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-stepper v-model="currentStep" vertical>
            <!-- Step 1: Secondary School -->
            <v-stepper-step
              :complete="currentStep > 1"
              step="1"
              editable
            >
              Szkoła średnia
              <small>Informacje o Twojej szkole</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card flat class="pa-4">
                <v-form ref="schoolForm" v-model="validSchool">
                  <v-row>
                    <v-col cols="12">
                      <v-autocomplete
                        v-model="formData.school"
                        :items="schools"
                        item-text="name"
                        item-value="id"
                        label="Nazwa szkoły"
                        outlined
                        :rules="requiredRules"
                        @change="handleSchoolSelect"
                        return-object
                      >
                        <template v-slot:item="{ item }">
                          <v-list-item-content>
                            <v-list-item-title>{{ item.name }}</v-list-item-title>
                            <v-list-item-subtitle>{{ item.city }}, {{ item.voivodeship }}</v-list-item-subtitle>
                          </v-list-item-content>
                        </template>
                      </v-autocomplete>
                    </v-col>
                  </v-row>

                  <v-row v-if="formData.school">
                    <v-col cols="12" md="6">
                      <v-text-field
                        :value="formData.school.voivodeship"
                        label="Województwo"
                        outlined
                        readonly
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        :value="formData.school.city"
                        label="Miasto"
                        outlined
                        readonly
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-select
                        v-model="formData.graduationYear"
                        :items="graduationYears"
                        label="Rok ukończenia"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-select>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.documentNumber"
                        label="Numer świadectwa"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-alert
                    v-if="schoolAutofilled"
                    type="success"
                    text
                  >
                    Lokalizacja szkoły została uzupełniona automatycznie
                  </v-alert>
                </v-form>
              </v-card>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="nextStep"
                  :disabled="!validSchool"
                >
                  Dalej
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <!-- Step 2: Exam Type / Diploma Type -->
            <v-stepper-step
              :complete="currentStep > 2"
              step="2"
              editable
            >
              Rodzaj świadectwa
              <small>Określ typ ukończonej szkoły</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card flat class="pa-4">
                <v-form ref="diplomaForm" v-model="validDiploma">
                  <v-select
                    v-model="formData.diplomaType"
                    :items="diplomaTypes"
                    label="Rodzaj świadectwa"
                    outlined
                    :rules="requiredRules"
                    required
                  ></v-select>

                  <v-alert
                    v-if="formData.diplomaType === 'Polska nowa matura'
                      || formData.diplomaType === 'Polish New Matura'"
                    type="info"
                    text
                  >
                    Polska nowa matura (po 2005 r.) została wybrana automatycznie na podstawie profilu kandydata
                  </v-alert>
                </v-form>
              </v-card>

              <v-card-actions class="pa-4">
                <v-btn text @click="prevStep">
                  <v-icon left>mdi-arrow-left</v-icon>
                  Wstecz
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="nextStep"
                  :disabled="!validDiploma"
                >
                  Dalej
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <!-- Step 3: Subjects and Grades -->
            <v-stepper-step
              :complete="currentStep > 3"
              step="3"
            >
              Przedmioty i wyniki
              <small>Twoje rezultaty egzaminów</small>
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-card flat class="pa-4">
                <v-form ref="subjectsForm" v-model="validSubjects">
                  <v-alert
                    type="info"
                    text
                    dense
                    class="mb-4"
                  >
                    Dodaj przynajmniej jeden przedmiot
                  </v-alert>

                  <!-- Subjects List -->
                  <v-card
                    v-for="(subject, index) in formData.subjects"
                    :key="index"
                    outlined
                    class="mb-3"
                  >
                    <v-card-text>
                      <v-row align="center">
                        <v-col cols="12" md="4">
                          <v-autocomplete
                            v-model="subject.name"
                            :items="availableSubjects"
                            label="Przedmiot"
                            outlined
                            dense
                            :rules="requiredRules"
                            required
                          ></v-autocomplete>
                        </v-col>

                        <v-col cols="12" md="4">
                          <v-select
                            v-model="subject.examType"
                            :items="examTypes"
                            label="Rodzaj egzaminu"
                            outlined
                            dense
                            :rules="requiredRules"
                            required
                          ></v-select>
                        </v-col>

                        <v-col cols="12" md="3">
                          <v-text-field
                            v-model.number="subject.score"
                            label="Wynik"
                            type="number"
                            suffix="%"
                            outlined
                            dense
                            :rules="scoreRules"
                            min="0"
                            max="100"
                            required
                          ></v-text-field>
                        </v-col>

                        <v-col cols="12" md="1" class="text-center">
                          <v-btn
                            icon
                            color="error"
                            @click="removeSubject(index)"
                            :disabled="formData.subjects.length === 1"
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-col>
                      </v-row>
                    </v-card-text>
                  </v-card>

                    <v-btn
                      color="primary"
                      outlined
                      block
                      @click="addSubject"
                      class="mb-4"
                    >
                      <v-icon left>mdi-plus</v-icon>
                      Dodaj kolejny przedmiot
                    </v-btn>
                </v-form>
              </v-card>

              <v-card-actions class="pa-4">
                <v-btn text @click="prevStep">
                  <v-icon left>mdi-arrow-left</v-icon>
                  Wstecz
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn
                  color="secondary"
                  @click="saveAndExit"
                  :loading="saving"
                  text
                >
                  Zapisz szkic
                </v-btn>
                <v-btn
                  color="primary"
                  @click="saveAndContinue"
                  :loading="saving"
                  :disabled="!validSubjects || formData.subjects.length === 0"
                >
                  Zapisz i przejdź do podsumowania
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper>

          <!-- Link Diploma to Programme -->
          <v-card-text v-if="currentStep === 3" class="pa-4">
            <v-card outlined>
              <v-card-title class="text-subtitle-1">
                <v-icon left>mdi-link</v-icon>
                Powiąż świadectwo z kierunkiem
              </v-card-title>
              <v-card-text>
                <div class="d-flex align-center">
                  <v-chip class="mr-2" color="primary">
                    {{ programmeName }}
                  </v-chip>
                  <v-icon>mdi-arrow-left-right</v-icon>
                  <v-chip class="ml-2" color="success">
                    {{ formData.diplomaType || 'Brak wyboru' }}
                  </v-chip>
                </div>
              </v-card-text>
            </v-card>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { schools, subjects, programmes } from '~/data/mockData'

export default {
  middleware: 'auth',
  data() {
    return {
      schools,
      availableSubjects: subjects,
      programmes,
      currentStep: 1,
      saving: false,
      schoolAutofilled: false,
      validSchool: false,
      validDiploma: false,
      validSubjects: false,
      formData: {
        school: null,
        graduationYear: '',
        documentNumber: '',
        diplomaType: 'Polska nowa matura',
        subjects: [
          { name: '', examType: '', score: null }
        ]
      },
      diplomaTypes: [
        'Polska nowa matura',
        'Polska stara matura',
        'Świadectwo zagraniczne'
      ],
      examTypes: [
        'Pisemny podstawowy',
        'Pisemny rozszerzony',
        'Ustny'
      ],
      requiredRules: [
        v => !!v || 'To pole jest wymagane'
      ],
      scoreRules: [
        v => v !== null && v !== '' || 'Wynik jest wymagany',
        v => (v >= 0 && v <= 100) || 'Wynik musi mieścić się w zakresie 0-100'
      ]
    }
  },
  computed: {
    ...mapGetters(['getCurrentApplication']),
    graduationYears() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = currentYear; i >= currentYear - 10; i--) {
        years.push(i)
      }
      return years
    },
    completionPercentage() {
      return ((this.currentStep - 1) / 3) * 100
    },
    programmeName() {
      const app = this.getCurrentApplication
      if (app) {
        const programme = this.programmes.find(p => p.id === app.programmeId)
        return programme ? programme.name : 'Nieznany kierunek'
      }
      return 'Nie wybrano kierunku'
    }
  },
  mounted() {
    // Load existing data if available
    const app = this.getCurrentApplication
    if (app && app.education) {
      this.formData = {
        ...this.formData,
        ...app.education
      }
      if (this.formData.subjects.length === 0) {
        this.formData.subjects = [{ name: '', examType: '', score: null }]
      }
    }
  },
  methods: {
    handleSchoolSelect() {
      if (this.formData.school) {
        this.schoolAutofilled = true
        setTimeout(() => {
          this.schoolAutofilled = false
        }, 3000)
      }
    },
    addSubject() {
      this.formData.subjects.push({
        name: '',
        examType: '',
        score: null
      })
    },
    removeSubject(index) {
      if (this.formData.subjects.length > 1) {
        this.formData.subjects.splice(index, 1)
      }
    },
    nextStep() {
      if (this.currentStep < 3) {
        this.currentStep++
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    prevStep() {
      if (this.currentStep > 1) {
        this.currentStep--
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    },
    async saveAndExit() {
      this.saving = true
      
      const app = this.getCurrentApplication
      if (app) {
        await this.$store.dispatch('saveEducation', {
          id: app.id,
          data: this.formData
        })
      }

      this.saving = false
      this.$router.push('/dashboard')
    },
    async saveAndContinue() {
      this.saving = true
      
      const app = this.getCurrentApplication
      if (app) {
        await this.$store.dispatch('saveEducation', {
          id: app.id,
          data: this.formData
        })
      }

      this.saving = false
      this.$router.push('/applications/current/summary')
    }
  }
}
</script>
