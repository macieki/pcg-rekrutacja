<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-btn text @click="$router.push('/diplomas')" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Wróć do listy dyplomów
        </v-btn>

        <h1 class="display-1 font-weight-bold mb-2">Dodaj dyplom</h1>
        <p class="text-subtitle-1 grey--text mb-4">
          Wprowadź dane swojego świadectwa maturalnego lub dyplomu
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
                </v-form>

                <v-card-actions class="px-0">
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    @click="nextStep(1)"
                    :disabled="!validSchool"
                  >
                    Dalej
                    <v-icon right>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <!-- Step 2: Exam Type -->
            <v-stepper-step
              :complete="currentStep > 2"
              step="2"
              :editable="currentStep > 1"
            >
              Typ dyplomu
              <small>Wybierz rodzaj egzaminu</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card flat class="pa-4">
                <v-form ref="examTypeForm" v-model="validExamType">
                  <v-row>
                    <v-col cols="12">
                      <v-select
                        v-model="formData.examType"
                        :items="diplomaTypes"
                        label="Rodzaj dyplomu"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-select>
                    </v-col>
                  </v-row>
                </v-form>

                <v-card-actions class="px-0">
                  <v-btn text @click="currentStep = 1">
                    <v-icon left>mdi-arrow-left</v-icon>
                    Wstecz
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    @click="nextStep(2)"
                    :disabled="!validExamType"
                  >
                    Dalej
                    <v-icon right>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>

            <!-- Step 3: Subjects and Scores -->
            <v-stepper-step
              :complete="currentStep > 3"
              step="3"
              :editable="currentStep > 2"
            >
              Przedmioty i wyniki
              <small>Dodaj wyniki egzaminów</small>
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-card flat class="pa-4">
                <v-form ref="subjectsForm" v-model="validSubjects">
                  <div
                    v-for="(subject, index) in formData.subjects"
                    :key="index"
                    class="subject-group mb-4"
                  >
                    <v-row>
                      <v-col cols="12" md="5">
                        <v-autocomplete
                          v-model="subject.name"
                          :items="subjectsList"
                          label="Przedmiot"
                          outlined
                          :rules="requiredRules"
                        ></v-autocomplete>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-select
                          v-model="subject.examType"
                          :items="examTypes"
                          label="Poziom"
                          outlined
                          :rules="requiredRules"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" md="3">
                        <v-text-field
                          v-model.number="subject.score"
                          label="Wynik (%)"
                          type="number"
                          outlined
                          :rules="[...requiredRules, ...scoreRules]"
                          min="0"
                          max="100"
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="1" class="d-flex align-center">
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
                    <v-divider v-if="index < formData.subjects.length - 1"></v-divider>
                  </div>

                  <v-btn
                    text
                    color="primary"
                    @click="addSubject"
                    class="mb-4"
                  >
                    <v-icon left>mdi-plus</v-icon>
                    Dodaj przedmiot
                  </v-btn>
                </v-form>

                <v-card-actions class="px-0">
                  <v-btn text @click="currentStep = 2">
                    <v-icon left>mdi-arrow-left</v-icon>
                    Wstecz
                  </v-btn>
                  <v-spacer></v-spacer>
                  <v-btn
                    color="primary"
                    @click="saveDiploma"
                    :disabled="!validSubjects || formData.subjects.length === 0"
                    :loading="saving"
                  >
                    <v-icon left>mdi-content-save</v-icon>
                    Zapisz dyplom
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-stepper-content>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { schools, subjects } from '~/data/mockData'

export default {
  data() {
    return {
      currentStep: 1,
      validSchool: false,
      validExamType: false,
      validSubjects: false,
      saving: false,
      formData: {
        school: null,
        graduationYear: null,
        documentNumber: '',
        examType: '',
        subjects: [
          {
            name: '',
            examType: '',
            score: null
          }
        ]
      },
      schools,
      subjectsList: subjects,
      diplomaTypes: [
        'Matura polska nowa',
        'Matura polska stara',
        'Dyplom zagraniczny'
      ],
      examTypes: [
        'Podstawowy',
        'Rozszerzony'
      ],
      requiredRules: [
        v => !!v || 'To pole jest wymagane'
      ],
      scoreRules: [
        v => v >= 0 || 'Wynik musi być większy lub równy 0',
        v => v <= 100 || 'Wynik nie może przekraczać 100'
      ]
    }
  },
  computed: {
    completionPercentage() {
      const total = 3
      return (this.currentStep / total) * 100
    },
    graduationYears() {
      const currentYear = new Date().getFullYear()
      const years = []
      for (let i = currentYear; i >= currentYear - 10; i--) {
        years.push(i)
      }
      return years
    }
  },
  methods: {
    handleSchoolSelect(school) {
      if (school) {
        // School details are already in the object
      }
    },
    nextStep(step) {
      if (step === 1 && this.validSchool) {
        this.currentStep = 2
      } else if (step === 2 && this.validExamType) {
        this.currentStep = 3
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
    async saveDiploma() {
      if (!this.$refs.subjectsForm.validate()) {
        return
      }

      this.saving = true

      try {
        const diplomaData = {
          secondarySchool: {
            name: this.formData.school.name,
            voivodeship: this.formData.school.voivodeship,
            city: this.formData.school.city,
            graduationYear: this.formData.graduationYear,
            documentNumber: this.formData.documentNumber
          },
          examType: this.formData.examType,
          subjects: this.formData.subjects
        }

        await this.$store.dispatch('createDiploma', diplomaData)
        
        // Redirect to diplomas list
        this.$router.push('/diplomas')
      } catch (error) {
        console.error('Error saving diploma:', error)
      } finally {
        this.saving = false
      }
    }
  }
}
</script>

<style scoped>
.subject-group {
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
}
</style>
