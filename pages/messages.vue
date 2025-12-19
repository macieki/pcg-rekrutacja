<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <h1 class="display-1 font-weight-bold mb-2">Wiadomości</h1>
        <p class="text-subtitle-1 grey--text mb-6">
          Przeglądaj wiadomości od biura rekrutacji
        </p>
      </v-col>
    </v-row>

    <v-row>
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <v-icon left>mdi-email</v-icon>
            Skrzynka odbiorcza
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="composeDialog = true">
              <v-icon left>mdi-plus</v-icon>
              Nowa wiadomość
            </v-btn>
          </v-card-title>

          <!-- Messages Data Table -->
          <v-data-table
            :headers="headers"
            :items="messagesList"
            :items-per-page="10"
            class="elevation-0"
            @click:row="openMessage"
          >
            <template v-slot:item.subject="{ item }">
              <div class="py-2">
                <div :class="{ 'font-weight-bold': !item.read }">
                  {{ item.subject }}
                </div>
                <div class="text-caption grey--text">{{ item.preview }}</div>
              </div>
            </template>

            <template v-slot:item.from="{ item }">
              <v-chip small outlined>
                {{ item.from }}
              </v-chip>
            </template>

            <template v-slot:item.date="{ item }">
              {{ formatDate(item.date) }}
            </template>

            <template v-slot:item.read="{ item }">
              <v-icon v-if="!item.read" color="primary">mdi-email</v-icon>
              <v-icon v-else color="grey">mdi-email-open</v-icon>
            </template>
          </v-data-table>
        </v-card>
      </v-col>
    </v-row>

    <!-- Message Detail Dialog -->
    <v-dialog v-model="messageDialog" max-width="700">
      <v-card v-if="selectedMessage">
        <v-card-title class="primary white--text">
          {{ selectedMessage.subject }}
        </v-card-title>
        <v-card-text class="pa-4">
          <div class="mb-4">
            <v-chip small outlined class="mr-2">
              <v-icon left small>mdi-account</v-icon>
              {{ selectedMessage.from }}
            </v-chip>
            <v-chip small outlined>
              <v-icon left small>mdi-calendar</v-icon>
              {{ formatDate(selectedMessage.date) }}
            </v-chip>
          </div>
          <v-divider class="my-4"></v-divider>
          <p class="text-body-1">{{ selectedMessage.preview }}</p>
          <p class="text-body-1 mt-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
          </p>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="messageDialog = false">Zamknij</v-btn>
          <v-spacer></v-spacer>
          <v-btn color="primary" text>
            <v-icon left>mdi-reply</v-icon>
            Odpowiedz
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Compose Message Dialog -->
    <v-dialog v-model="composeDialog" max-width="600">
      <v-card>
        <v-card-title class="primary white--text">
          <v-icon left dark>mdi-email-edit</v-icon>
          Nowa wiadomość
        </v-card-title>
        <v-card-text class="pa-4">
          <v-form ref="composeForm" v-model="validCompose">
            <v-select
              v-model="newMessage.recipient"
              :items="recipients"
              label="Do"
              outlined
              :rules="[v => !!v || 'Odbiorca jest wymagany']"
              required
            ></v-select>

            <v-text-field
              v-model="newMessage.subject"
              label="Temat"
              outlined
              :rules="[v => !!v || 'Temat jest wymagany']"
              required
            ></v-text-field>

            <v-textarea
              v-model="newMessage.body"
              label="Wiadomość"
              outlined
              rows="6"
              :rules="[v => !!v || 'Wiadomość jest wymagana']"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-card-actions>
          <v-btn text @click="composeDialog = false">Anuluj</v-btn>
          <v-spacer></v-spacer>
          <v-btn
            color="primary"
            :disabled="!validCompose"
            @click="sendMessage"
          >
            <v-icon left>mdi-send</v-icon>
            Wyślij
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import { messages } from '~/data/mockData'

export default {
  middleware: 'auth',
  data() {
    return {
      messagesList: messages,
      messageDialog: false,
      composeDialog: false,
      selectedMessage: null,
      validCompose: false,
      newMessage: {
        recipient: '',
        subject: '',
        body: ''
      },
      recipients: [
        'Biuro rekrutacji',
        'Biuro finansowe',
        'Sprawy studenckie',
        'Wsparcie techniczne'
      ],
      headers: [
        { text: '', value: 'read', sortable: false, width: '50' },
        { text: 'Temat', value: 'subject', sortable: true },
        { text: 'Od', value: 'from', sortable: true },
        { text: 'Data', value: 'date', sortable: true }
      ]
    }
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
    openMessage(message) {
      this.selectedMessage = message
      message.read = true
      this.messageDialog = true
    },
    sendMessage() {
      if (this.$refs.composeForm.validate()) {
        this.$store.commit('SHOW_SNACKBAR', { 
          message: 'Wiadomość wysłana pomyślnie!', 
          color: 'success' 
        })
        this.composeDialog = false
        this.newMessage = {
          recipient: '',
          subject: '',
          body: ''
        }
      }
    }
  }
}
</script>
