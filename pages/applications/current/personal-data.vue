<template>
  <v-container fluid class="pa-6">
    <!-- Global Progress Bar -->
    <ApplicationProgress />
    
    <v-row>
      <v-col cols="12">
        <v-btn text @click="$router.push('/dashboard')" class="mb-4">
          <v-icon left>mdi-arrow-left</v-icon>
          Powrót do panelu
        </v-btn>

        <h1 class="display-1 font-weight-bold mb-2">Dane osobowe</h1>
        <p class="text-subtitle-1 grey--text mb-4">
          Uzupełnij swoje dane osobowe w trzech prostych krokach
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-stepper v-model="currentStep" vertical>
            <!-- Step 1: Basic Info -->
            <v-stepper-step
              :complete="currentStep > 1"
              step="1"
              editable
            >
              Informacje podstawowe
              <small>Dane osobowe i identyfikacja</small>
            </v-stepper-step>

            <v-stepper-content step="1">
              <v-card flat class="pa-4">
                <v-form ref="basicInfoForm" v-model="validBasicInfo">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.pesel"
                        label="PESEL"
                        outlined
                        :rules="peselRules"
                        hint="11-cyfrowy numer identyfikacyjny"
                        counter="11"
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-btn
                        color="info"
                        outlined
                        @click="prefillFromPesel"
                        :disabled="!formData.pesel || formData.pesel.length !== 11"
                      >
                        <v-icon left>mdi-auto-fix</v-icon>
                        Wypełnij z PESEL
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.firstName"
                        label="Imię"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.lastName"
                        label="Nazwisko"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.dateOfBirth"
                        label="Data urodzenia"
                        type="date"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-radio-group
                        v-model="formData.gender"
                        label="Płeć"
                        row
                        :rules="requiredRules"
                        required
                      >
                        <v-radio label="Mężczyzna" value="male"></v-radio>
                        <v-radio label="Kobieta" value="female"></v-radio>
                        <v-radio label="Inna" value="other"></v-radio>
                      </v-radio-group>
                    </v-col>
                  </v-row>

                  <v-alert
                    v-if="peselPrefilled"
                    type="success"
                    text
                    class="mt-4"
                  >
                    Dane automatycznie uzupełnione z numeru PESEL
                  </v-alert>
                </v-form>
              </v-card>

              <v-card-actions class="pa-4">
                <v-spacer></v-spacer>
                <v-btn
                  color="primary"
                  @click="nextStep"
                  :disabled="!validBasicInfo"
                  dark
                >
                  Dalej
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <!-- Step 2: Address -->
            <v-stepper-step
              :complete="currentStep > 2"
              step="2"
              editable
            >
              Adres
              <small>Adres zamieszkania i korespondencyjny</small>
            </v-stepper-step>

            <v-stepper-content step="2">
              <v-card flat class="pa-4">
                <v-form ref="addressForm" v-model="validAddress">
                  <h3 class="text-h6 mb-4">Adres zamieszkania</h3>
                  
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.postalCode"
                        label="Kod pocztowy"
                        outlined
                        :rules="postalCodeRules"
                        @input="handlePostalCodeChange"
                        hint="Format: XX-XXX"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.voivodeship"
                        label="Województwo"
                        outlined
                        :rules="requiredRules"
                        readonly
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.county"
                        label="Powiat"
                        outlined
                        :rules="requiredRules"
                        readonly
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.commune"
                        label="Gmina"
                        outlined
                        :rules="requiredRules"
                        readonly
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.city"
                        label="Miasto"
                        outlined
                        :rules="requiredRules"
                        readonly
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.street"
                        label="Ulica"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.houseNumber"
                        label="Numer domu"
                        outlined
                        :rules="requiredRules"
                        required
                      ></v-text-field>
                    </v-col>
                    <v-col cols="12" md="6">
                      <v-text-field
                        v-model="formData.address.residence.flatNumber"
                        label="Numer mieszkania (opcjonalnie)"
                        outlined
                      ></v-text-field>
                    </v-col>
                  </v-row>

                  <v-checkbox
                    v-model="formData.address.sameAsResidence"
                    label="Adres korespondencyjny jest taki sam jak adres zamieszkania"
                  ></v-checkbox>

                  <!-- Correspondence Address (if different) -->
                  <template v-if="!formData.address.sameAsResidence">
                    <v-divider class="my-6"></v-divider>
                    <h3 class="text-h6 mb-4">Adres korespondencyjny</h3>
                    
                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.address.correspondence.postalCode"
                          label="Kod pocztowy"
                          outlined
                          :rules="requiredRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.address.correspondence.city"
                          label="Miasto"
                          outlined
                          :rules="requiredRules"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>

                    <v-row>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.address.correspondence.street"
                          label="Ulica"
                          outlined
                          :rules="requiredRules"
                          required
                        ></v-text-field>
                      </v-col>
                      <v-col cols="12" md="6">
                        <v-text-field
                          v-model="formData.address.correspondence.houseNumber"
                          label="Numer domu"
                          outlined
                          :rules="requiredRules"
                          required
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </template>

                  <v-alert
                    v-if="postalCodeAutofilled"
                    type="info"
                    text
                    class="mt-4"
                  >
                    Szczegóły adresu automatycznie uzupełnione na podstawie kodu pocztowego
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
                  :disabled="!validAddress"
                  dark
                >
                  Dalej
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>

            <!-- Step 3: Photo -->
            <v-stepper-step
              :complete="currentStep > 3"
              step="3"
            >
              Zdjęcie
              <small>Prześlij swoje zdjęcie identyfikacyjne</small>
            </v-stepper-step>

            <v-stepper-content step="3">
              <v-card flat class="pa-4">
                <v-form ref="photoForm" v-model="validPhoto">
                  <v-row>
                    <v-col cols="12" md="6">
                      <v-file-input
                        v-model="photoFile"
                        label="Prześlij zdjęcie"
                        outlined
                        accept="image/*"
                        prepend-icon="mdi-camera"
                        @change="handlePhotoUpload"
                        :rules="photoRules"
                        hint="JPG, PNG, maks. 5MB"
                        show-size
                      ></v-file-input>

                      <v-alert
                        v-if="!photoFile"
                        type="warning"
                        text
                        dense
                        class="mt-4"
                      >
                        Prześlij zdjęcie, aby ukończyć ten krok
                      </v-alert>
                    </v-col>

                    <v-col cols="12" md="6" class="text-center">
                      <div v-if="formData.photo" class="mb-4">
                        <v-avatar size="200" class="elevation-4">
                          <v-img :src="formData.photo"></v-img>
                        </v-avatar>
                        <div class="text-caption grey--text mt-2">Podgląd</div>
                      </div>
                      <div v-else class="pa-12">
                        <v-icon size="100" color="grey lighten-2">mdi-account-circle</v-icon>
                        <div class="text-caption grey--text mt-2">Nie przesłano zdjęcia</div>
                      </div>
                    </v-col>
                  </v-row>
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
                  :disabled="!validPhoto"
                  dark
                >
                  Zapisz i przejdź do wykształcenia
                  <v-icon right>mdi-arrow-right</v-icon>
                </v-btn>
              </v-card-actions>
            </v-stepper-content>
          </v-stepper>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapGetters } from 'vuex'
import { postalCodeData } from '~/data/mockData'
import ApplicationProgress from '~/components/ApplicationProgress.vue'

const createEmptyFormData = () => ({
  pesel: '',
  firstName: '',
  lastName: '',
  dateOfBirth: '',
  gender: '',
  photo: null,
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
    correspondence: {
      postalCode: '',
      city: '',
      street: '',
      houseNumber: '',
      flatNumber: ''
    },
    sameAsResidence: true
  }
})

const deepClone = (value) => (value ? JSON.parse(JSON.stringify(value)) : value)

export default {
  middleware: 'auth',
  components: {
    ApplicationProgress
  },
  data() {
    return {
      currentStep: 1,
      saving: false,
      peselPrefilled: false,
      postalCodeAutofilled: false,
      photoFile: null,
      validBasicInfo: false,
      validAddress: false,
      validPhoto: false,
      formData: createEmptyFormData(),
      requiredRules: [
        v => !!v || 'To pole jest wymagane'
      ],
      peselRules: [
        v => !!v || 'PESEL jest wymagany',
        v => /^\d{11}$/.test(v) || 'PESEL musi mieć 11 cyfr'
      ],
      postalCodeRules: [
        v => !!v || 'Kod pocztowy jest wymagany',
        v => /^\d{2}-\d{3}$/.test(v) || 'Format: XX-XXX'
      ],
      photoRules: [
        v => !!v || 'Zdjęcie jest wymagane'
      ]
    }
  },
  computed: {
    ...mapGetters(['getCurrentApplication']),
    completionPercentage() {
      return ((this.currentStep - 1) / 3) * 100
    }
  },
  mounted() {
    this.hydrateFormData()
  },
  methods: {
    hydrateFormData() {
      const app = this.getCurrentApplication
      const baseForm = createEmptyFormData()

      if (!app) {
        this.formData = baseForm
        return
      }

      const personalData = app.personalData ? deepClone(app.personalData) : {}
      const addressData = app.address ? deepClone(app.address) : {}

      this.formData = {
        ...baseForm,
        ...personalData,
        address: {
          ...baseForm.address,
          ...addressData,
          residence: {
            ...baseForm.address.residence,
            ...(addressData.residence || {})
          },
          correspondence: {
            ...baseForm.address.correspondence,
            ...(addressData.correspondence || {})
          },
          sameAsResidence:
            typeof addressData.sameAsResidence === 'boolean'
              ? addressData.sameAsResidence
              : baseForm.address.sameAsResidence
        }
      }
    },
    prefillFromPesel() {
      // Mock PESEL parsing
      this.formData.firstName = 'Jan'
      this.formData.lastName = 'Kowalski'
      this.formData.dateOfBirth = '1995-05-15'
      this.formData.gender = 'male'
      this.peselPrefilled = true

      setTimeout(() => {
        this.peselPrefilled = false
      }, 3000)
    },
    handlePostalCodeChange() {
      const code = this.formData.address.residence.postalCode
      const data = postalCodeData[code]
      
      if (data) {
        this.formData.address.residence.voivodeship = data.voivodeship
        this.formData.address.residence.county = data.county
        this.formData.address.residence.commune = data.commune
        this.formData.address.residence.city = data.city
        this.postalCodeAutofilled = true

        setTimeout(() => {
          this.postalCodeAutofilled = false
        }, 3000)
      }
    },
    handlePhotoUpload(file) {
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.formData.photo = e.target.result
        }
        reader.readAsDataURL(file)
      } else {
        this.formData.photo = null
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
        await this.$store.dispatch('savePersonalData', {
          id: app.id,
          data: this.formData
        })
        await this.$store.dispatch('saveAddress', {
          id: app.id,
          data: this.formData.address
        })
      }

      this.saving = false
      this.$router.push('/dashboard')
    },
    async saveAndContinue() {
      this.saving = true
      
      const app = this.getCurrentApplication
      if (app) {
        await this.$store.dispatch('savePersonalData', {
          id: app.id,
          data: this.formData
        })
        await this.$store.dispatch('saveAddress', {
          id: app.id,
          data: this.formData.address
        })
      }

      this.saving = false
      this.$router.push('/applications/current/education')
    }
  }
}
</script>
